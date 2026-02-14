# Authors Configuration Guide

This guide explains how to manage author profiles in the Genius Docs platform.

## Authors Data Structure

Author information is stored in `/src/data/authorsData.js`:

```javascript
const authorsData = {
  "author-id": {
    "name": "Author Name",
    "bio": "Author bio/description",
    "avatar": "/path/to/avatar/image.jpg",
    "linkedin": "https://linkedin.com/in/author-profile"
  }
}
```

## Author ID Format

- Use lowercase letters and hyphens only
- Format: `first-name-last-name` or `username`
- Examples: `john-doe`, `jane-smith`, `roman-rand`

## Required Fields

### name
- Full display name of the author
- Appears in article bylines and author cards

### bio
- Short description of the author
- Appears below the author name in articles
- Keep it concise (1-2 sentences)

### avatar
- Path to profile picture
- Recommended size: 200x200px
- Format: JPG, JPEG, or PNG
- Store in `/public/authors/pfp/`

### linkedin (optional)
- LinkedIn profile URL
- Must be full URL including https://
- Links author avatar to LinkedIn profile

## Adding a New Author

1. **Choose an author ID**
   ```javascript
   "jane-smith": {
     // author data
   }
   ```

2. **Add author avatar**
   - Place image in `/public/authors/pfp/`
   - Use descriptive filename: `jane-smith-001.jpeg`

3. **Update authorsData.js**
   ```javascript
   const authorsData = {
     "jane-smith": {
       "name": "Jane Smith",
       "bio": "Technical writer and developer",
       "avatar": "/authors/pfp/jane-smith-001.jpeg",
       "linkedin": "https://linkedin.com/in/jane-smith"
     }
   }
   ```

## Using Authors in Articles

Reference the author in article frontmatter:

```markdown
---
title: "Your Article Title"
authorId: "jane-smith"
---
```

The system will automatically:
- Resolve the author ID to full name
- Display author bio and avatar
- Link to LinkedIn profile if provided

## Best Practices

### Avatar Images
- Use professional headshots
- Consistent sizing across all authors
- High quality but optimized for web
- Prefer JPEG format for photos

### Author Bios
- Keep under 100 characters
- Focus on expertise relevant to content
- Include current role or specialization

### LinkedIn Profiles
- Always test the URL before adding
- Use the full profile URL, not shortened versions
- Optional but recommended for professional credibility

## Troubleshooting

### Author Not Found
If you see "Author with ID 'xxx' not found" in console:
1. Check if author ID exists in `authorsData.js`
2. Verify the ID matches exactly (case-sensitive)
3. Ensure the file is saved and reloaded

### Avatar Not Loading
1. Verify image path is correct
2. Check if image exists in `/public/authors/pfp/`
3. Ensure image filename matches the path in authorsData

### LinkedIn Link Not Working
1. Verify the URL includes `https://`
2. Test the URL in browser directly
3. Ensure LinkedIn profile is public

## Example Complete Setup

```javascript
// src/data/authorsData.js
const authorsData = {
  "roman-rand": {
    "name": "Roman Rand",
    "bio": "Technical Writer",
    "avatar": "/authors/pfp/roman-rand-001.jpeg",
    "linkedin": "https://www.linkedin.com/in/roman-rand/"
  },
  "jane-smith": {
    "name": "Jane Smith",
    "bio": "Full-stack developer and educator",
    "avatar": "/authors/pfp/jane-smith-001.jpeg",
    "linkedin": "https://linkedin.com/in/jane-smith"
  }
}

export default authorsData
```

This ensures consistent author information across all articles and provides a professional author experience.
