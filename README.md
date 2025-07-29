This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Component Structure

### Phase 4: shadcn/ui Component Library

```
/src/components/
├── ui/                 # shadcn/ui components
│   ├── alert.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── navigation-menu.tsx
│   └── skeleton.tsx
├── layout/             # Layout components (Phase 4)
│   ├── Header.tsx      # Completed ✅
│   └── Footer.tsx      # Completed ✅
└── posts/              # Post-related components
    ├── postlist/
    ├── searchinput/
    ├── searchresults/
    └── PostCard.tsx    # Completed ✅

/src/lib/utils/         # Component utilities (Phase 4)
/src/hooks/             # Custom hooks (Phase 4)
/src/constants/         # Component constants (Phase 4)
```

## Phase 4 Completion: shadcn/ui Component Library

### Completed Components

#### Layout Components
- **Header Component** - Responsive navigation with mobile menu, logo, and theme support
- **Footer Component** - Multi-column footer with social links, navigation, and dynamic copyright

#### Post Display Components  
- **PostCard Component** - Feature-rich blog post cards with:
  - Featured image support with loading states and error handling
  - Clickable titles and proper navigation
  - Post excerpts with typography optimization
  - Metadata display (date, reading time, tag count)
  - Interactive category and tag badges
  - Responsive design with hover effects

- **PostList Component** - Advanced post listing with:
  - Responsive grid layout (1/2/3 columns)
  - Pagination (infinite scroll + load more button)
  - Loading states with skeleton components
  - Error handling with retry functionality
  - Empty states with helpful messaging

#### Theme Support
- **ThemeProvider** - App-wide theme management with next-themes
- **ThemeToggle** - Dark/light mode switching component

### shadcn/ui Components Used
- Core: `button`, `card`, `badge`, `avatar`, `input`
- Navigation: `navigation-menu`, `sheet`, `dropdown-menu`
- Layout: `separator`, `scroll-area`
- Forms: `switch`, `toggle`
- Feedback: `skeleton`, `alert`
- Overlays: `dialog`

### Features Implemented
- ✅ Responsive design across all breakpoints
- ✅ Dark/light theme support foundation
- ✅ Professional loading and error states
- ✅ Accessibility with proper ARIA labels and semantic HTML
- ✅ Performance optimization with React.memo and Next.js Image
- ✅ WordPress GraphQL integration
- ✅ Interactive hover effects and animations
- ✅ Mobile-first responsive navigation

## shadcn/ui Setup

This project uses shadcn/ui for the component library with the following configuration:
- TypeScript support
- Tailwind CSS integration
- Components located in `src/components/ui/`
- Utility functions in `src/lib/utils.ts`

### Adding new shadcn/ui components:
```bash
npx shadcn-ui@latest add [component-name]
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.