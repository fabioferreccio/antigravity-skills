# Performance Review Lens

Performance review lens.

## Checks
1. **Memory leaks**: Unclosed resources, unsubscribed listeners, growing collections
2. **Async patterns**: Sequential when parallel is possible, missing timeout/abort
3. **Caching**: Missing cache for expensive operations, cache invalidation issues
4. **Algorithm complexity**: O(n²) when O(n) or O(n log n) is possible
5. **Resource management**: Connection pools, file handles, stream handling
6. **Concurrency**: Race conditions, deadlocks, thread safety
7. **Serialization**: Large payloads, missing pagination, unnecessary data transfer
