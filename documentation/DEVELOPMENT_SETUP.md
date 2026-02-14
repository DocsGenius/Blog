# Development Setup Guide

This guide explains how to set up and develop the Genius Docs platform locally.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control
- Modern web browser

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/DocsGenius/Blog.git
   cd docs-genius-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
docs-genius-site/
├── public/                 # Static assets
│   ├── articles/          # Article cover images
│   ├── authors/           # Author avatars
│   └── branding/          # Logo and brand assets
├── src/
│   ├── articles/          # Markdown article files
│   ├── components/        # React components
│   │   ├── charts/       # Chart components
│   │   └── ...           # Other UI components
│   ├── data/             # Configuration data
│   │   ├── authorsData.js
│   │   └── themesData.js
│   ├── documentation/    # Documentation files
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # CSS stylesheets
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # App entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## Available Scripts

### `npm run dev`
Starts the development server with hot reload.
- Port: 5173 (or next available if occupied)
- Hot module replacement enabled
- Source maps for debugging

### `npm run build`
Creates an optimized production build.
- Outputs to `dist/` folder
- Minified CSS and JavaScript
- Asset optimization

### `npm run preview`
Preview the production build locally.
- Serves from `dist/` folder
- Simulates production environment

### `npm run lint`
Runs ESLint to check code quality.
- Enforces coding standards
- Catches potential issues
- Auto-fixes some problems

## Key Dependencies

### Core Framework
- **React 19**: UI framework
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server

### Content & Styling
- **React Markdown**: Markdown rendering
- **js-yaml**: Frontmatter parsing
- **CSS Variables**: Dynamic theming

### Charts & Data
- **Recharts**: Chart library
- **EmailJS**: Contact form functionality

## Development Workflow

### 1. Creating Articles
1. Add Markdown files to `/src/articles/`
2. Include frontmatter with metadata
3. Add chart data if needed
4. Test in development server

### 2. Adding Authors
1. Update `/src/data/authorsData.js`
2. Add author avatar to `/public/authors/pfp/`
3. Reference in article frontmatter

### 3. Customizing Themes
1. Edit `/src/data/themesData.js`
2. Test theme switching
3. Verify accessibility

### 4. Adding Components
1. Create component in `/src/components/`
2. Export and import where needed
3. Follow existing naming patterns

## Configuration Files

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Base URL for deployment
  build: {
    outDir: 'dist'
  }
})
```

### `eslint.config.js`
Code linting configuration for consistent style.

### `.gitignore`
Files and folders to exclude from version control.

## Environment Variables

Create a `.env.local` file for environment-specific settings:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

## Deployment

### GitHub Pages (Current)
1. Push to `main` branch
2. GitHub Actions automatically deploy
3. Available at `https://geniusdocs.blog`

### Manual Build
```bash
npm run build
npm run preview
```

### Custom Domain
Update `vite.config.js` base path:
```javascript
base: '/your-subdirectory/'
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
1. Check for missing imports
2. Verify file paths
3. Check console for specific errors

### Hot Reload Not Working
1. Save the file again
2. Check for syntax errors
3. Restart dev server

## Best Practices

### Code Organization
- Keep components focused and reusable
- Use descriptive file and component names
- Follow React hooks patterns correctly

### Performance
- Optimize images before adding
- Use lazy loading for large content
- Minimize bundle size

### Accessibility
- Test with screen readers
- Ensure keyboard navigation
- Maintain color contrast

### Git Workflow
- Commit frequently with descriptive messages
- Use feature branches for new work
- Pull requests for review

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request
5. Address feedback

This setup ensures a smooth development experience for the Genius Docs platform.
