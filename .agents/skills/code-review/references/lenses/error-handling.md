# Error Handling Review Lens

Error handling review lens.

## Checks
1. **Error boundaries**: Missing try/catch on critical paths
2. **Error swallowing**: Empty catch blocks, catch-and-ignore
3. **Error propagation**: Generic errors instead of domain-specific
4. **Retry patterns**: Missing retry on transient failures
5. **Circuit breakers**: Missing for external service calls
6. **Graceful degradation**: Missing fallback for non-critical features
7. **Error logging**: Missing or excessive error logging
8. **User-facing errors**: Technical details exposed to end users
