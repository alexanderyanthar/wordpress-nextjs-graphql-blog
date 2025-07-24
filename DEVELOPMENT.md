# Development Guide
## Getting Started

1. Start WordPress site in Local by Flywheel
2. Start Next.js development server: `npm run dev`
3. Open http://localhost:3000

## GraphQL Development

### Regenerate Types
When you change GraphQL queries or the WordPress schema changes:
```bash
npm run codegen
```

### Watch Mode for Development
Automatically regenerate types when files change:
```bash
npm run codegen:watch
```

### GraphQL Playground
Access GraphiQL IDE in WordPress admin:
- Go to WordPress Admin → GraphQL → GraphiQL IDE
- Test queries before adding them to your code

# WordPress + Next.js + GraphQL Blog - Project Overview
