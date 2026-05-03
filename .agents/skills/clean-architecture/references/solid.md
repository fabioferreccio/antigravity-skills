# SOLID Principles in Clean Architecture

How the five principles apply to a Senior Architectural level:

## 1. Single Responsibility Principle (SRP)
- **Application**: One Use Case = One Goal. One Class = One Reason to change.
- **Example**: Don't put "Calculate Interest" and "Save to DB" in the same class.

## 2. Open/Closed Principle (OCP)
- **Application**: You should be able to add a new Payment Method (e.g., Pix) without modifying the `CheckoutOrchestrator`.
- **Mechanism**: Use the **Strategy Pattern** and Interfaces.

## 3. Liskov Substitution Principle (LSP)
- **Application**: If a Use Case expects a `PaymentGateway` interface, it should work with `StripeGateway`, `PagSeguroGateway`, or `AdyenGateway` without knowing the difference.
- **Rule**: Don't throw "NotImplementedError" in sub-classes for methods defined in the interface.

## 4. Interface Segregation Principle (ISP)
- **Application**: Don't create a giant `Repository` interface with 50 methods. Split into `IUserReader`, `IUserWriter`, `IUserDeleter`.
- **Benefit**: Layers only depend on the methods they actually use.

## 5. Dependency Inversion Principle (DIP)
- **Application**: The core of Clean Arch. Business rules (High-level) depend on abstractions, not on low-level details (DB/UI).
- **Rule**: Inner circles define the contracts; outer circles implement them.
