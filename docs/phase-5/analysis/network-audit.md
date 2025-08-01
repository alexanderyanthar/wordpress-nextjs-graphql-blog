# Home Page Network Audit - August 1, 2025

## GraphQL Requests Found:

### 1. GetCategories Query
- **Size**: 1.0KB
- **Response Time**: 189.77ms
- **Operation**: GetCategories
- **Variables**: `{first: 100}`
- **Purpose**: Fetches all categories for homepage filtering

### 2. GetPostsPaginated Query  
- **Size**: 3.9KB
- **Response Time**: 235.10ms
- **Operation**: GetPostsPaginated
- **Variables**: `{first: 9}`
- **Purpose**: Fetches latest 9 posts for homepage display

## Summary:
- **Total Requests**: 2
- **Total Data Transfer**: 4.9KB
- **Total Network Time**: ~189.77ms + [second request time]
- **Request Pattern**: Sequential (categories first, then posts)

## Key Observations:

### Data Overlap:
- **CategoryFields fragment** is fetched TWICE:
  1. In GetCategories query (for filtering badges)
  2. In GetPostsPaginated query (for each post's categories)
- This is redundant - categories are fetched separately but also embedded in posts

### Query Efficiency:
- **GetCategories**: Fetches 100 categories but homepage only shows ~8
- **GetPostsPaginated**: Good - fetches exactly what's needed (9 posts)

### Performance Issues:
- **Two separate network requests** instead of one
- **Category data duplication** between queries
- **Over-fetching categories** (100 vs ~8 displayed)

## Optimization Opportunities:
1. **Combine queries** into single request
2. **Reduce category fetch** from 100 to ~10-15 needed for display
3. **Eliminate duplicate CategoryFields** fetching
4. **Potential time savings**: Eliminate 1 network round-trip (~190ms)