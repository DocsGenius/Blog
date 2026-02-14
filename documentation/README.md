# Documentation Index

Welcome to the GeniusDocs documentation! This guide covers everything you need to know about creating, managing, and developing content on the Genius Docs platform.

## Getting Started

### [Development Setup](./DEVELOPMENT_SETUP.md)
Set up your local development environment and understand the project structure.

### [Article Writing Guide](./ARTICLE_WRITING_GUIDE.md)
Learn how to write beautiful, interactive articles using Markdown and frontmatter.

## Content Management

### [Authors Configuration](./AUTHORS_SETUP.md)
Manage author profiles, avatars, and bylines.

### [Themes Guide](./THEMES_GUIDE.md)
Understand and customize the 20 available themes.

### [Charts Integration](./CHARTS_GUIDE.md)
Create interactive charts and data visualizations.

## External Services

### [EmailJS Setup](./EMAILJS_SETUP.md)
Configure contact forms and email notifications.

## Quick Reference

### Article Frontmatter Template
```markdown
---
title: "Article Title"
subtitle: "Engaging subtitle"
authorId: "author-id"
date: "Month Dayth, YYYY"
category: "Category"
readingTime: "X min read"
coverImage: "/path/to/image.jpg"
tags: ['Tag1', 'Tag2', 'Tag3']
chartData:
  chart-id:
    - { key1: 'value1', key2: 'value2' }
---
```

### Chart Syntax
```markdown
```chart-bar
chart-id
```

```chart-pie
chart-id
```
```

### Author Data Structure
```javascript
"author-id": {
  "name": "Author Name",
  "bio": "Author description",
  "avatar": "/authors/pfp/avatar.jpg",
  "linkedin": "https://linkedin.com/in/profile"
}
```

## File Structure

```
src/
├── articles/              # Markdown articles
├── components/            # React components
│   └── charts/           # Chart components
├── data/                 # Configuration data
│   ├── authorsData.js   # Author profiles
│   └── themesData.js    # Theme definitions
├── documentation/        # Documentation files
├── hooks/               # Custom React hooks
├── styles/              # CSS stylesheets
└── utils/               # Utility functions

public/
├── articles/            # Article cover images
├── authors/             # Author avatars
└── branding/            # Logo and brand assets
```

## Common Tasks

### Creating a New Article
1. Add `.md` file to `/src/articles/`
2. Include frontmatter with metadata
3. Write content in Markdown
4. Add chart data if needed
5. Test in development server

### Adding a New Author
1. Add avatar to `/public/authors/pfp/`
2. Update `/src/data/authorsData.js`
3. Reference in article frontmatter

### Customizing Themes
1. Edit `/src/data/themesData.js`
2. Test theme switching
3. Verify accessibility

### Adding Charts
1. Define data in frontmatter
2. Use chart syntax in Markdown
3. Test chart rendering

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check code quality
npm run lint
```

## Support

For questions or issues:
1. Check the relevant documentation
2. Review existing articles for examples
3. Test in development environment
4. Check browser console for errors

## Best Practices

### Writing
- Keep content focused and valuable
- Use proper Markdown formatting
- Include relevant charts and images
- Test all interactive elements

### Development
- Follow existing code patterns
- Test changes thoroughly
- Maintain accessibility standards
- Document new features

### Content Organization
- Use descriptive filenames
- Organize images properly
- Keep frontmatter consistent
- Test across different themes

This documentation should help you create amazing content and contribute to the Genius Docs platform effectively.
