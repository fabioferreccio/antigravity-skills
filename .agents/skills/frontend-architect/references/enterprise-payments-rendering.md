# Enterprise Payments, Rendering Modes, Real-Time Messaging & Fraud Isolation Reference

## 1. Shadow Components & Web Components Encapsulation

- **Shadow DOM Isolation**: Use Shadow DOM (`attachShadow({ mode: 'open' })`) for zero CSS leakage in embedded white-label widgets or payment widgets.
- **Slotted Content**: Use `<slot>` elements to inject light DOM content into shadow trees safely.
- **Framework Integration**: Wrap React components inside Web Components (`@r2wc/react-to-web-component` or custom elements) when embedding across non-React host applications.

---

## 2. Rendering Strategy Matrix: Next.js vs Vite (SSR / CSR / RSC)

- **Next.js App Router (RSC & Server Actions)**:
  - **Server Components (Default)**: Fetch data close to the database, zero bundle size for dependencies, secure API key usage.
  - **Client Components (`'use client'`)**: Use strictly for interactive components requiring hooks (`useState`, `useEffect`, event listeners).
  - **Hydration Mismatch Prevention**: Avoid rendering dynamic client-only data (e.g. `window.localStorage`, dates) during initial server pass. Wrap in `useEffect` or custom `useIsMounted` hook.
- **Vite (SPA / Client-Side Rendering)**:
  - Fast HMR, client-side routing (React Router), and skeleton loading states while fetching data via TanStack Query.

---

## 3. White-Label Multi-Acquirer Payment Architecture

- **Acquirer Adapter Pattern**: Abstract payment gateways (Stone, Rede, Cielo, Adyen, Stripe) behind a unified payment interface:
  ```typescript
  export interface PaymentAcquirerAdapter {
    id: string;
    tokenizeCard(cardData: CardInput): Promise<TokenizedResult>;
    renderFraudFingerprint(containerId: string): void;
    processPayment(payload: PaymentPayload): Promise<PaymentResponse>;
  }
  ```
- **Dynamic Gateway Switcher**: Select payment adapter at runtime based on tenant configuration, country, card brand, or transaction risk score.

---

## 4. Fraud Mechanism Isolation per Acquirer / Tenant

- **Isolated Fingerprint Loading**: Execute anti-fraud scripts (Clearsale, Konduto, Cybersource, ThreatMetrix, Sift) inside sandboxed `<iframe>` containers or Web Workers to prevent DOM tampering or cross-tenant script leakage.
- **Script Cleanup**: Unmount and revoke fraud tracking scripts on payment step teardown or tenant switching.

---

## 5. Storage & Cookie / Session Management Matrix

| Storage Mechanism | Purpose | Security / Lifespan | Allowed Data |
| :--- | :--- | :--- | :--- |
| **HttpOnly Secure Cookie** | User Session Tokens | `SameSite=Lax/Strict`, `HttpOnly`, `Secure` | Auth Session ID (No raw JWT in JS) |
| **SessionStorage** | Checkout Transient State | Cleared when tab closes | Step 1 Form Drafts, Temp Wizard State |
| **LocalStorage** | Non-sensitive UI Preferences | Persisted until manually cleared | Theme, Sidebar collapsed state, Language |
| **IndexedDB** | Large Offline Caches | Sandboxed per origin | PWA offline queue, Draft documents |
| **Cookie Banner Store** | LGPD / GDPR Consent | Persisted in LocalStorage / Cookie | Category consent map (`{ analytics: false }`) |

---

## 6. Real-Time Messaging & Continuous Request Strategies

- **WebSockets**: Persistent duplex communication for real-time order status, live chat, or payment status confirmation. Implement heartbeat (`ping/pong`) and auto-reconnection with backoff.
- **Server-Sent Events (SSE)**: Unidirectional real-time streaming from server to client (ideal for payment processing progress or AI response streaming).
- **Long Polling / Short Polling**: Fallback mechanism using TanStack Query `refetchInterval` with conditional polling termination upon final status (`COMPLETED` or `FAILED`).
