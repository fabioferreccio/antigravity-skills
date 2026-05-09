# Example 02 — E2E Checkout Flow with Race Conditions & Destructive Scenarios

## Scenario

An e-commerce checkout flow needs E2E tests. The team reports a production bug where concurrent cart updates caused negative inventory. Tests must cover the critical path, race conditions, and destructive scenarios.

---

## Trigger Phrase

```
@qa-engineer create regression tests for the bug where concurrent cart updates caused negative inventory. Also write E2E tests for the checkout flow.
```

---

## Context Provided

**Bug Report #BUG-441**
> **Title**: Concurrent add-to-cart requests allow overselling
> **Steps**: Two users simultaneously add the last unit of product SKU-007. Both requests read `stock=1`, both decrement, both succeed. Result: `stock=-1`.
> **Impact**: Orders placed for items with zero physical inventory.
> **RCA**: No atomic stock reservation — check-then-act is non-atomic.

**API Contract**
- `POST /cart/add` — body: `{ productId, quantity }`
- `POST /checkout` — body: `{ cartId, paymentToken }`
- `GET /products/:id` — returns `{ stock: number }`

---

## Expected Agent Output

---
## Scenario: Regression — Concurrent Cart Add (Oversell)

| Field             | Value                                                               |
|-------------------|---------------------------------------------------------------------|
| Component         | `POST /cart/add` — stock reservation                                |
| Risk Level        | CRITICAL                                                            |
| Risk Description  | Non-atomic stock check allows overselling under concurrent load     |
| Test Strategy     | Integration (concurrent requests)                                   |
| Framework         | Jest / Supertest                                                    |

### Edge Cases
- 2 simultaneous requests for the last 1 unit
- N simultaneous requests for 1 unit (N > stock)
- Add-to-cart while checkout is processing the same item
- Add quantity > available stock in a single request

### Test Code (Regression — BUG-441)
```js
// regression/bug-441-concurrent-cart.test.js
describe('[REGRESSION BUG-441] Concurrent cart add — oversell prevention', () => {
  let productId;

  beforeEach(async () => {
    // Seed: 1 unit in stock
    productId = await db.products.create({ name: 'Widget', stock: 1 });
  });

  afterEach(async () => {
    await db.products.deleteAll();
    await db.carts.deleteAll();
  });

  it('allows only one of two concurrent adds when stock is 1', async () => {
    const addToCart = () =>
      request(app)
        .post('/cart/add')
        .send({ productId, quantity: 1 })
        .set('Authorization', `Bearer ${generateToken()}`);

    const [res1, res2] = await Promise.all([addToCart(), addToCart()]);

    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([200, 409]); // one succeeds, one gets conflict

    const product = await db.products.findById(productId);
    expect(product.stock).toBeGreaterThanOrEqual(0); // stock must NEVER go negative
  });

  it('rejects a single request for quantity exceeding stock', async () => {
    const res = await request(app)
      .post('/cart/add')
      .send({ productId, quantity: 99 })
      .set('Authorization', `Bearer ${generateToken()}`);

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/insufficient stock/i);
  });
});
```

### Expected Result
Stock never drops below 0. Exactly one request succeeds when 2 race for the last unit.

### Acceptance Criteria
- [ ] `product.stock >= 0` always, even under concurrent load
- [ ] Reservation uses atomic DB operation (e.g., `UPDATE products SET stock = stock - 1 WHERE stock > 0 AND id = $1`)
- [ ] Conflict returns HTTP 409 with actionable error message

---

---
## Scenario: E2E — Complete Checkout Happy Path

| Field             | Value                                              |
|-------------------|----------------------------------------------------|
| Component         | Full checkout flow — cart → payment → confirmation |
| Risk Level        | HIGH                                               |
| Risk Description  | Regression in any step silently breaks the revenue path |
| Test Strategy     | E2E                                                |
| Framework         | Playwright                                         |

### Edge Cases
- Checkout with expired payment token
- Checkout while session expires mid-flow
- Checkout with cart containing a now-out-of-stock item (stale cart)
- Double-click on "Pay Now" button (duplicate submission)
- Browser back button after payment confirmation

### Test Code (E2E — Playwright)
```ts
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { seedProduct, clearOrders } from '../helpers/db';
import { mockStripeSuccess, mockStripeDeclined } from '../helpers/stripe-mock';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearOrders();
    await seedProduct({ id: 'SKU-007', name: 'Widget', price: 29.99, stock: 10 });
    await page.goto('/');
  });

  test('completes a full checkout successfully', async ({ page }) => {
    mockStripeSuccess();

    await page.click('[data-testid="product-SKU-007-add-to-cart"]');
    await page.click('[data-testid="cart-checkout-btn"]');

    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/30');
    await page.fill('[data-testid="card-cvc"]', '123');

    await page.click('[data-testid="pay-now-btn"]');

    await expect(page.locator('[data-testid="confirmation-title"]'))
      .toHaveText(/order confirmed/i, { timeout: 5000 });

    await expect(page.locator('[data-testid="order-id"]')).toBeVisible();
  });

  test('shows error when payment is declined', async ({ page }) => {
    mockStripeDeclined();

    await page.click('[data-testid="product-SKU-007-add-to-cart"]');
    await page.click('[data-testid="cart-checkout-btn"]');

    await page.fill('[data-testid="card-number"]', '4000000000000002'); // Stripe decline test card
    await page.fill('[data-testid="card-expiry"]', '12/30');
    await page.fill('[data-testid="card-cvc"]', '123');

    await page.click('[data-testid="pay-now-btn"]');

    await expect(page.locator('[data-testid="payment-error"]'))
      .toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="payment-error"]'))
      .toHaveText(/card was declined/i);
  });

  test('prevents double-submission on rapid "Pay Now" clicks', async ({ page }) => {
    mockStripeSuccess();

    await page.click('[data-testid="product-SKU-007-add-to-cart"]');
    await page.click('[data-testid="cart-checkout-btn"]');
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/30');
    await page.fill('[data-testid="card-cvc"]', '123');

    // Rapid double-click
    await page.click('[data-testid="pay-now-btn"]');
    await page.click('[data-testid="pay-now-btn"]');

    await expect(page.locator('[data-testid="confirmation-title"]'))
      .toHaveText(/order confirmed/i, { timeout: 5000 });

    // Verify only ONE order was created
    const orders = await fetchOrdersBySession(page);
    expect(orders).toHaveLength(1);
  });

  test('handles stale cart (item becomes out of stock after cart creation)', async ({ page }) => {
    await page.click('[data-testid="product-SKU-007-add-to-cart"]');

    // Externally exhaust stock
    await zeroOutStock('SKU-007');

    await page.click('[data-testid="cart-checkout-btn"]');
    await page.click('[data-testid="pay-now-btn"]');

    await expect(page.locator('[data-testid="stock-error"]'))
      .toContainText(/no longer available/i);
  });
});
```

### Expected Result
All flows complete correctly. No double orders. Stock errors are user-friendly. Payment declines are caught before order creation.

### Acceptance Criteria
- [ ] Happy path: order confirmed, stock decremented
- [ ] Declined payment: error shown, no order created, cart retained
- [ ] Double click: exactly one order per checkout session
- [ ] Stale cart: clear error before payment attempt, no charge issued

---

## Coverage Summary

| Layer        | Before | After | Gap Closed                          |
|--------------|--------|-------|-------------------------------------|
| Unit         | 40%    | 40%   | No change (already covered)         |
| Integration  | 10%    | 80%   | Race condition, oversell regression  |
| E2E          | 0%     | 75%   | Full checkout path + destructive     |
| Performance  | 0%     | 0%    | Pending (next: k6 load test)        |

**Confidence Level**: 🟠 ORANGE — critical regressions covered; load testing still required.
**Next Action**: Implement atomic stock reservation with `SELECT FOR UPDATE` or optimistic locking, then run concurrent test to confirm BUG-441 is closed.
