# Writing Articles for Genius Docs

This guide explains how to write beautiful, functional articles for the Genius Docs platform using Markdown.

## Article Structure

Every article follows this simple structure:

```markdown
---
title: "Your Article Title"
subtitle: "A catchy subtitle that explains what the article is about"
authorId: "your-author-id"
date: "Month Dayth, YYYY"
category: "Category"
readingTime: "X min read"
coverImage: "/path/to/your/image.jpg"
tags: ['Tag1', 'Tag2', 'Tag3']
chartData:
  chart-id:
    - { key1: 'value1', key2: 'value2' }
    - { key1: 'value3', key2: 'value4' }
---

Your article content goes here...
```

## Frontmatter Fields

### Required Fields
- **title**: The main title of your article
- **subtitle**: A descriptive subtitle
- **authorId**: Your unique author identifier (must match `authorsData.js`)
- **date**: Publication date in "Month Dayth, YYYY" format
- **category**: Article category (Newsletter, Informational, Tutorial, etc.)
- **readingTime**: Estimated reading time

### Optional Fields
- **coverImage**: Path to cover image (recommended)
- **tags**: Array of relevant tags
- **chartData**: Chart data for interactive visualizations

## Writing Content

### Headers
Use standard Markdown headers:
```markdown
# Main Header
## Subheader
### Sub-subheader
```

### Text Formatting
```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
`Code snippets` inline
```

### Code Blocks
```javascript
// For code with syntax highlighting
function example() {
  return "Hello, World!";
}
```

### Charts
Add interactive charts using frontmatter data:

```markdown
```chart-bar
chart-id
```

```chart-pie
chart-id
```
```

The chart ID must match a key in your `chartData` frontmatter.

### Links and Images
```markdown
[Link text](/path/to/page)
![Alt text](/path/to/image.jpg)
```

## Chart Data Format

### Bar Charts
```yaml
chartData:
  monthly-stats:
    - { month: 'Jan', revenue: 400, costs: 200 }
    - { month: 'Feb', revenue: 600, costs: 300 }
```

### Pie Charts
```yaml
chartData:
  browser-share:
    - { browser: 'Chrome', share: 65 }
    - { browser: 'Firefox', share: 15 }
    - { browser: 'Safari', share: 12 }
```

## Best Practices

### Writing Style
- Keep sentences clear and concise
- Use active voice when possible
- Break up long paragraphs
- Use headers to organize content

### Visual Structure
- Start with a compelling introduction
- Use subheaders to guide readers
- Include relevant charts and images
- End with a clear conclusion

### Technical Tips
- Preview your article before publishing
- Test chart data thoroughly
- Ensure all image paths are correct
- Check that authorId exists in `authorsData.js`

# Example Article

```markdown
---
title: "Getting Started with Web Development"
subtitle: "Learn the fundamentals of building modern websites"
authorId: "john-doe"
date: "February 13th, 2026"
category: "Tutorial"
readingTime: "5 min read"
coverImage: "/articles/covers/web-dev.jpg"
tags: ['Web Development', 'HTML', 'CSS', 'JavaScript']
chartData:
  tech-stack:
    - { technology: 'HTML', usage: 95 }
    - { technology: 'CSS', usage: 90 }
    - { technology: 'JavaScript', usage: 85 }
---

Web development is an exciting field that combines creativity with technical skills.

## What You'll Learn

This article covers the essential technologies every web developer should know.

### The Core Technologies

Here's the popularity of core web technologies:

```chart-pie
tech-stack
```

## Getting Started

Begin with HTML structure, add CSS styling, then enhance with JavaScript interactivity.

Happy coding!
```

## File Organization

- Place article files in `/src/articles/`
- Use descriptive filenames (e.g., `GettingStartedWithWebDev.md`)
- Store cover images in `/articles/covers/`
- Keep chart data concise and relevant

That's it! You're ready to create beautiful, interactive articles for Genius Docs.
