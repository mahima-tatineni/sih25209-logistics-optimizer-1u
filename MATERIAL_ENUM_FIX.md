# Material Enum Fix

## Error
```
invalid input value for enum material_enum: "coking_coal"
```

## Root Cause
The database has a `material_enum` type defined as:
```sql
CREATE TYPE material_enum AS ENUM ('COKING_COAL', 'LIMESTONE');
```

But the frontend is sending lowercase values: `'coking_coal'` and `'limestone'`

## Solution
Added material normalization in the API:

```typescript
function normalizeMaterial(material: string): string {
  return material.toUpperCase() // coking_coal → COKING_COAL
}
```

## Material Value Mapping

### Frontend (Form)
- `coking_coal` (lowercase with underscore)
- `limestone` (lowercase)

### Database Enum (Schema 001)
- `COKING_COAL` (uppercase with underscore)
- `LIMESTONE` (uppercase)

### Database VARCHAR (Schema 102)
- `coking_coal` (lowercase with underscore)
- `limestone` (lowercase)

## API Behavior

### For UUID-based schema (with enum):
```typescript
material: material.toUpperCase() // COKING_COAL
```

### For code-based schema (with VARCHAR):
```typescript
material: material // coking_coal (original)
```

## Testing
1. Refresh browser
2. Create request with "Coking Coal"
3. Should succeed with either schema

## Files Modified
- `app/api/plant/[plantId]/requests/route.ts`
