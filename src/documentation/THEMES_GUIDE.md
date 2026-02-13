# Themes Configuration Guide

This guide explains how to manage and customize themes in the DocsGenius platform.

## Theme System Overview

DocsGenius includes 20 pre-built themes that users can switch between. Themes are defined in `/src/data/themesData.js` and automatically applied throughout the application.

## Theme Structure

Each theme follows this structure:

```javascript
{
  "name": "theme-name",
  "displayName": "Display Name",
  "colors": {
    "primary": "#hex-color",
    "secondary": "#hex-color", 
    "accent": "#hex-color",
    "surface": "#hex-color",
    "background": "#hex-color",
    "text": "#hex-color",
    "border": "#hex-color",
    "highlight": "#hex-color"
  }
}
```

## Color Roles

### primary
- Main text color for headings and important elements
- Should have high contrast against background

### secondary
- Secondary text color for body text
- Less prominent than primary but still readable

### accent
- Interactive elements (links, buttons, highlights)
- Should stand out but complement the theme

### surface
- Background for cards, panels, and content areas
- Slightly different from main background

### background
- Main page background color
- Base color for the entire theme

### text
- Default text color for paragraphs and regular content
- Must be readable against background

### border
- Borders, dividers, and subtle UI elements
- Should be subtle but visible

### highlight
- Selection, hover states, and emphasis
- Used for interactive feedback

## Adding a New Theme

1. **Choose a theme name**
   - Use lowercase letters and hyphens only
   - Examples: `aurora`, `deep-sea`, `neon-lights`

2. **Select colors**
   - Use a color palette tool for consistency
   - Ensure good contrast ratios
   - Test in both light and dark contexts

3. **Add to themesData.js**
   ```javascript
   {
     "name": "aurora",
     "displayName": "Aurora",
     "colors": {
       "primary": "#1a237e",
       "secondary": "#3949ab",
       "accent": "#00bcd4",
       "surface": "#f5f5f5",
       "background": "#ffffff",
       "text": "#212121",
       "border": "#e0e0e0",
       "highlight": "#b3e5fc"
     }
   }
   ```

## Theme Categories

### Light Themes
- `light`, `ocean`, `forest`, `sunset`, `arctic`, `lime`, `sky`, `coffee`, `mint`, `gold`, `ice`, `peach`, `slate`

### Dark Themes
- `dark`, `midnight`, `volcano`, `matrix`, `cyberpunk`

### Specialty Themes
- `royal` (purple-based)
- `solar` (bright yellow/orange)
- `lavender` (soft purple)
- `rose` (pink tones)

## Best Practices

### Color Selection
- Use consistent color theory principles
- Ensure WCAG accessibility compliance
- Test with actual content, not just color swatches

### Contrast Ratios
- Primary text: 4.5:1 or higher
- Secondary text: 3:1 or higher
- Interactive elements: 3:1 or higher

### Theme Naming
- Use descriptive, evocative names
- Keep display names short (1-2 words)
- Group similar themes conceptually

## Custom Theme Example

```javascript
{
  "name": "desert",
  "displayName": "Desert",
  "colors": {
    "primary": "#d84315",     // Deep orange for headings
    "secondary": "#bf360c",   // Darker orange for secondary text
    "accent": "#ff9800",      // Bright orange for links
    "surface": "#fff3e0",     // Light orange for cards
    "background": "#fbe9e7",  // Very light orange background
    "text": "#4e342e",        // Dark brown for body text
    "border": "#ffccbc",     // Light orange border
    "highlight": "#ffab91"     // Medium orange highlight
  }
}
```

## Testing Themes

1. **Visual Testing**
   - Check all UI components
   - Test with different content types
   - Verify chart colors work well

2. **Accessibility Testing**
   - Use contrast checker tools
   - Test with screen readers
   - Verify keyboard navigation

3. **Cross-browser Testing**
   - Test in major browsers
   - Check mobile rendering
   - Verify print styles

## Theme Implementation

Themes are automatically applied through CSS custom properties:

```css
:root {
  --color-primary: #111111;
  --color-secondary: #555555;
  --color-accent: #2979ff;
  /* ... other colors */
}
```

Components reference these variables:

```css
h1 {
  color: var(--color-primary);
}

.button {
  background-color: var(--color-accent);
}
```

## Troubleshooting

### Colors Not Applying
1. Check theme name matches exactly
2. Verify CSS custom properties are set
3. Ensure theme data is properly exported

### Poor Contrast
1. Use online contrast checker tools
2. Adjust primary/text colors
3. Test with actual content

### Chart Visibility Issues
1. Test chart colors against theme background
2. Ensure data points are visible
3. Check legend readability

This theme system provides flexibility while maintaining consistency across the DocsGenius platform.
