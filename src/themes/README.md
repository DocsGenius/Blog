# CSS Theme System

A comprehensive CSS theme system with standardized color variables and easy theme switching capabilities.

## Structure

All themes follow the same color structure with **3 main colors** and **5 option colors**:

### Main Colors (3)
- `--color-primary`: Primary brand color
- `--color-secondary`: Secondary supporting color  
- `--color-accent`: Accent/highlight color

### Option Colors (5)
- `--color-surface`: Surface/container backgrounds
- `--color-background`: Main page background
- `--color-text`: Primary text color
- `--color-border`: Border and divider colors
- `--color-highlight`: Highlight/attention color

## Available Themes

1. **Light** (`light.css`) - Clean and bright
2. **Dark** (`dark.css`) - Easy on the eyes
3. **Ocean** (`ocean.css`) - Blue and teal inspired
4. **Forest** (`forest.css`) - Green and natural
5. **Sunset** (`sunset.css`) - Warm oranges and reds
6. **Purple** (`purple.css`) - Royal and elegant
7. **Monochrome** (`monochrome.css`) - Classic black and white
8. **Candy** (`candy.css`) - Sweet and playful

## Usage

### Basic CSS Import

```css
@import url('./themes/light.css');
```

### JavaScript Theme Manager

```javascript
// Apply a theme
themeManager.applyTheme('dark');

// Toggle between light and dark
themeManager.toggleLightDark();

// Get current theme
const current = themeManager.getCurrentTheme();

// Create a theme switcher
themeManager.createThemeSwitcher(document.body, {
  showLabels: true,
  showPreviews: true
});
```

### HTML Setup

```html
<!DOCTYPE html>
<html>
<head>
  <link id="theme-stylesheet" rel="stylesheet" href="/src/themes/light.css">
  <script src="/src/themes/theme-manager.js"></script>
</head>
<body>
  <!-- Your content here -->
  <div id="theme-switcher-container"></div>
  
  <script>
    // Create theme switcher
    themeManager.createThemeSwitcher(
      document.getElementById('theme-switcher-container'),
      { showPreviews: true }
    );
  </script>
</body>
</html>
```

### CSS Classes

The base.css provides utility classes for consistent styling:

```css
<!-- Color classes -->
<div class="primary">Primary colored element</div>
<div class="secondary">Secondary colored element</div>
<div class="accent">Accent colored element</div>
<div class="highlight">Highlighted element</div>
<div class="surface">Surface element</div>

<!-- Text colors -->
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-accent">Accent text</p>

<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-surface">Surface background</div>
<div class="bg-background">Page background</div>

<!-- Border colors -->
<div class="border-primary">Primary border</div>
<div class="border-accent">Accent border</div>
```

## Custom Themes

To create a new theme:

1. Create a new CSS file in the themes directory
2. Import the base.css: `@import url('./base.css');`
3. Define the 8 color variables following the naming convention
4. Add the theme name to the `themes` array in theme-manager.js

Example:
```css
@import url('./base.css');

:root {
  --color-primary: #your-primary-color;
  --color-secondary: #your-secondary-color;
  --color-accent: #your-accent-color;
  --color-surface: #your-surface-color;
  --color-background: #your-background-color;
  --color-text: #your-text-color;
  --color-border: #your-border-color;
  --color-highlight: #your-highlight-color;
}
```

## Features

- **Consistent Structure**: All themes use the same variable names
- **Easy Switching**: JavaScript manager for dynamic theme changes
- **System Preference**: Automatically detects light/dark mode preference
- **Local Storage**: Remembers user's theme choice
- **Semantic Mappings**: Derived colors for buttons, links, forms, etc.
- **Utility Classes**: Ready-to-use CSS classes for common styling needs
- **Smooth Transitions**: Built-in transition effects for theme changes

## Browser Support

- Modern browsers with CSS custom properties support
- LocalStorage for theme persistence
- CSS transitions for smooth theme switching
