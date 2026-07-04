# API Contracts Review Lens

API contracts review lens.

## Checks
1. **Breaking changes**: Removed fields, changed types, removed enum values (Critico)
2. **Backward compatibility**: New required fields without defaults (Critico)
3. **Versioning**: Missing API version when breaking changes exist
4. **Schema validation**: Missing validation annotations/decorators
5. **Naming consistency**: Consistent naming across endpoints
6. **Documentation**: Missing descriptions on non-obvious fields
7. **Error responses**: Consistent error format across endpoints
8. **Type reuse**: Copy-pasting types instead of sharing

## Format-specific
- **OpenAPI/Swagger**: Schema validation, example values, response codes
- **GraphQL**: Breaking schema changes, N+1 in resolvers, missing nullable
- **gRPC/Protobuf**: Wire compatibility, field number reuse
- **SDKGen**: Missing `?` on nullable, `!secret` on sensitive fields
