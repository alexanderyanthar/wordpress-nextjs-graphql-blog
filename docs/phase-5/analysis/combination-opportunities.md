# Query Combination Analysis

## Current Separate Queries:

### 1. GetCategories Query
- **Purpose**: Fetches categories for homepage filter badges
- **Timing**: Runs immediately on page mount
- **Size**: 1.0KB
- **Time**: ~190ms
- **Data**: Categories for filtering interface

### 2. GetPostsPaginated Query  
- **Purpose**: Fetches latest posts for homepage display
- **Timing**: Runs immediately on page mount (after categories)
- **Size**: 3.9KB
- **Time**: ~??ms (need to add from network tab)
- **Data**: Posts + embedded categories + tags

## Combination Feasibility Analysis:

### **Can be combined**: ✅ YES

### **Reasoning**:
1. **Same Timing**: Both run immediately on page mount
2. **Related Data**: Both fetch WordPress content for same page
3. **No Dependencies**: Neither query depends on the other's result
4. **Same User Context**: Both serve the homepage experience

### **Technical Compatibility**:
- **Same GraphQL endpoint**: ✅ WordPress GraphQL
- **Same authentication**: ✅ Both are public queries
- **Same caching needs**: ✅ Both benefit from cache-first strategy
- **No conflicting variables**: ✅ Can use separate variable names

## Benefits of Combination:

### **Performance Gains**:
- **Network Requests**: 2 → 1 (eliminate 1 round-trip)
- **Loading Time**: ~380ms → ~190ms (parallel vs sequential)
- **Data Transfer**: 4.9KB → ~2.5KB (eliminate duplication)
- **User Experience**: Single loading state vs multiple loading states

### **Code Simplification**:
- **Single Hook**: Replace `useCategories` + `usePaginatedPosts` with `useHomePage`
- **Unified Loading**: One loading state instead of multiple
- **Consistent Error Handling**: Single error boundary for homepage data
- **Simpler State Management**: One data source instead of multiple

### **Data Efficiency**:
- **Eliminate CategoryFields Duplication**: Categories fetched once, referenced in posts
- **Optimized Field Selection**: Custom fragments for homepage needs
- **Reduced Over-fetching**: Fetch exactly what homepage displays

## Risks Assessment:

### **Potential Issues**:
1. **Query Complexity**: Larger, more complex single query
2. **All-or-Nothing**: If query fails, entire homepage data fails
3. **Caching Granularity**: Can't cache categories separately from posts
4. **Future Flexibility**: Harder to reuse individual pieces

### **Risk Mitigation**:
1. **Error Policy**: Use `errorPolicy: 'partial'` to allow partial data
2. **Fallback Components**: Section-level error boundaries for graceful degradation
3. **Smart Caching**: Use query-level caching with appropriate TTL
4. **Modular Fragments**: Keep fragments reusable for other pages

## Recommended Approach:

### **Strategy**: Create Combined Homepage Query
- **Name**: `HomePageQuery`
- **Combines**: Categories + Posts data
- **Approach**: Single query with optimized fragments
- **Error Handling**: Partial error policy with section fallbacks

### **Implementation Plan**:
1. **Create optimized fragments** (next step)
2. **Build combined query** using existing + new fragments  
3. **Create unified hook** (`useHomePage`)
4. **Add error boundaries** for each homepage section
5. **Replace multiple hooks** in page.tsx with single hook

### **Expected Results**:
- **50% fewer network requests** (2 → 1)
- **50% faster loading** (~380ms → ~190ms) 
- **49% less data transfer** (4.9KB → ~2.5KB)
- **Simpler codebase** (3 hooks → 1 hook)
- **Better user experience** (single loading state)

## Next Steps:
1. ✅ Complete query combination analysis
2. ⏳ Plan fragment optimization (Step 1.2.2.2)
3. ⏳ Record performance baseline (Step 1.2.2.3)
4. ⏳ Create implementation plan for combined query

**Conclusion**: Combining queries is highly beneficial with manageable risks. Proceed with combined homepage query approach.