# Interface Adapters: Controllers, Repositories, and Presenters

## 1. Controllers (Presentation)
- **Role**: Entry point for external requests.
- **Responsibility**: 
  - Parse the raw request (HTTP/CLI/Event).
  - Validate the input structure (not business rules).
  - Map data to a DTO.
  - Call the appropriate Use Case.
- **Constraint**: Should NOT contain business logic or database queries.

## 2. Repositories (Infrastructure)
- **Role**: Data persistence and retrieval.
- **Responsibility**:
  - Implement the interface defined in the Domain/Application.
  - Handle SQL, NoSQL, or File Storage.
  - Map DB models (Infrastructure) to Domain Entities (Domain).
- **Constraint**: Must NOT return database models directly to the Use Case. Always map to Domain Entities.

## 3. Presenters (Presentation)
- **Role**: Format the output.
- **Responsibility**:
  - Take the Use Case result.
  - Transform it into a ViewModel (e.g., stripping sensitive fields).
  - Prepare the final response format (JSON, XML, HTML).

## 4. Gateways
- **Role**: Communication with 3rd party APIs.
- **Responsibility**: 
  - Encapsulate external SDKs.
  - Handle retries and circuit breakers.
  - Map external errors to internal Domain Exceptions.
