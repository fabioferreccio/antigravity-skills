# Yuno SDK Integration & Payment Architecture Reference

## 1. Overview of Yuno SDKs (https://docs.y.uno/docs/sdks/overview/quickstart)

Yuno provides three integration levels for Web, iOS, and Android to process payments, 3DS 2.0 authentication, and customer payment method enrollment.

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SEAMLESS SDK: Pre-built complete checkout UI modal/flow   │
├─────────────────────────────────────────────────────────────┤
│ 2. LITE SDK: Individual pre-styled payment & enrollment UI  │
├─────────────────────────────────────────────────────────────┤
│ 3. HEADLESS SDK: Custom UI using Yuno Hosted Fields / Direct│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PCI Scope & Security Modes

### Mode A: Out-of-Scope PCI (Recommended - Hosted Fields / Seamless / Lite)
- **PCI Compliance Level**: SAQ A (Lowest merchant PCI burden).
- **Mechanism**: Credit card numbers (PAN), expiration dates, and security codes (CVV) are rendered inside secure, sandboxed `<iframe>` Hosted Fields provided by Yuno SDK.
- **Rule**: Sensitive card data NEVER touches merchant DOM or JS state.

### Mode B: Direct API / In-Scope PCI (Merchant Certified SAQ D)
- **PCI Compliance Level**: SAQ D (Full merchant PCI certification required).
- **Mechanism**: Direct tokenization API endpoints (`/v1/tokens`).
- **Rule**: NEVER store raw PAN or CVV in `localStorage`, `sessionStorage`, or Redux state.

---

## 3. Web Integration Implementation

### Installation
```bash
npm install @yuno-payments/sdk-web @yuno-payments/sdk-web-types
```
or via CDN:
```html
<script src="https://sdk-web.y.uno/v1/main.js"></script>
```

### Seamless / Lite SDK Checkout Flow
```typescript
import { Yuno } from '@yuno-payments/sdk-web';

export async function initializeYunoCheckout(checkoutToken: string, publicApiKey: string) {
  // 1. Initialize Yuno Instance
  const yuno = Yuno.initialize(publicApiKey);

  // 2. Mount Payment Component
  yuno.mountCheckout({
    checkoutToken,
    element: '#yuno-checkout-container',
    country: 'BR',
    language: 'pt',
    async onOneStepPay(oneStepResponse) {
      console.log('Payment OneStep tokenized:', oneStepResponse);
    },
    onError(error) {
      console.error('Yuno payment error:', error);
    },
  });
}
```

### Headless SDK (Hosted Fields for Custom UI)
```typescript
export async function initializeYunoHeadless(checkoutToken: string, publicApiKey: string) {
  const yuno = Yuno.initialize(publicApiKey);

  // Create hosted card input fields
  const cardElement = yuno.createCardElement({
    styles: {
      input: { fontSize: '16px', color: '#1A202C' },
    },
  });

  cardElement.mount('#card-element-container');

  // Submit tokenization on form submit
  const token = await yuno.generateToken();
  return token;
}
```

---

## 4. Anti-Fraud Fingerprint Integration

Yuno automatically manages risk device fingerprinting (ThreatMetrix / Cybersource / Sift):
- Pass `customerSessionId` or `fingerprintSessionId` when requesting `checkoutToken` from merchant backend.
- Ensure fingerprinting scripts load within sandboxed containers to prevent cross-tenant script leaks in multi-tenant environments.
