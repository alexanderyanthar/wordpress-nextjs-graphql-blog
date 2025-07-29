# Component Reference

## Layout Components

### Header (`/src/components/layout/Header.tsx`)
- Responsive navigation with mobile hamburger menu
- Logo with hover effects and navigation
- Desktop navigation menu with hover states
- Mobile sheet navigation with accessibility

### Footer (`/src/components/layout/Footer.tsx`)
- Responsive 3-column layout (1 col mobile, 3 col desktop)
- Clickable social media icons with hover effects
- Footer navigation links
- Dynamic copyright with current year

## Post Components

### PostCard (`/src/components/posts/PostCard.tsx`)
- Featured image with loading states, error handling, and hover effects
- Clickable post title with typography optimization
- Post excerpt with line clamping
- Metadata display (date, reading time, tags)
- Interactive category and tag badges
- Responsive card design

### PostList (`/src/components/posts/PostList.tsx`)
- Responsive grid layout
- Pagination with infinite scroll and load more
- Loading skeletons and error states
- Empty state handling

## Theme Components

### ThemeProvider (`/src/components/theme-provider.tsx`)
- App-wide theme context
- Dark/light/system theme support

### ThemeToggle (`/src/components/theme-toggle.tsx`)
- Animated theme switching button
- Sun/moon icon transitions