# Author System Documentation

## Overview

The author system allows you to reference author data by ID in markdown article frontmatter, making it easier to manage author information centrally.

## How it works

1. **Author Data**: All author information is stored in `src/data/authorsData.js`
2. **Article Frontmatter**: Use `authorId` field to reference an author by ID
3. **Automatic Resolution**: The system automatically resolves the author ID to full author details

## Author Data Structure

```javascript
const authorsData = {
    "author-id": {
        "name": "Author Name",
        "bio": "Author bio/description",
        "avatar": "path/to/avatar/image.jpg"
    }
}
```

## Article Frontmatter

Instead of specifying author details directly:
```yaml
---
title: Article Title
author: Roman Rand
authorBio: Technical Writer
authorAvatar: https://example.com/avatar.jpg
---
```

Use the `authorId` field:
```yaml
---
title: Article Title
authorId: roman-rand
---
```

The system will automatically populate:
- `author`: The author's name
- `authorBio`: The author's bio
- `authorAvatar`: The author's avatar path

## Adding New Authors

1. Add the author to `src/data/authorsData.js`:
```javascript
const authorsData = {
    "roman-rand": {
        "name": "Roman Rand",
        "bio": "Technical Writer",
        "avatar": "authors/pfp/roman-rand-001.jpeg"
    },
    "jane-doe": {
        "name": "Jane Doe",
        "bio": "Content Writer",
        "avatar": "authors/pfp/jane-doe-001.jpeg"
    }
}
```

2. Reference the author in any article:
```yaml
---
title: Another Article
authorId: jane-doe
---
```

## Benefits

- **DRY Principle**: Author info is defined once, reused everywhere
- **Easy Updates**: Update author details in one place
- **Consistency**: Ensures author information is consistent across all articles
- **Maintainability**: Simplifies article frontmatter
