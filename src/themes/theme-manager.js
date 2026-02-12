/**
 * Theme Manager - Handles theme switching and management
 * 
 * This utility provides easy theme switching functionality for the CSS themes
 * All themes follow the same variable structure with 3 main colors and 5 option colors
 */

class ThemeManager {
  constructor() {
    this.themes = [
      'light',
      'dark', 
      'ocean',
      'forest',
      'sunset',
      'purple',
      'monochrome',
      'candy'
    ];
    
    this.currentTheme = this.getStoredTheme() || 'light';
    this.themeLink = null;
    this.init();
  }

  /**
   * Initialize the theme manager
   */
  init() {
    // Create or find the theme stylesheet link
    this.themeLink = document.getElementById('theme-stylesheet');
    
    if (!this.themeLink) {
      this.themeLink = document.createElement('link');
      this.themeLink.id = 'theme-stylesheet';
      this.themeLink.rel = 'stylesheet';
      this.themeLink.type = 'text/css';
      document.head.appendChild(this.themeLink);
    }

    // Apply the stored theme
    this.applyTheme(this.currentTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.currentTheme === 'system') {
          this.applySystemTheme();
        }
      });
    }
  }

  /**
   * Apply a specific theme
   * @param {string} themeName - The name of the theme to apply
   */
  applyTheme(themeName) {
    if (!this.themes.includes(themeName)) {
      console.warn(`Theme "${themeName}" not found. Available themes:`, this.themes);
      return false;
    }

    // Update the stylesheet
    this.themeLink.href = `/src/themes/${themeName}.css`;
    this.currentTheme = themeName;
    
    // Store the preference
    this.storeTheme(themeName);
    
    // Update body class for potential additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: themeName } 
    }));
    
    return true;
  }

  /**
   * Apply system theme (light/dark based on user preference)
   */
  applySystemTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    this.applyTheme(systemTheme);
  }

  /**
   * Get the current theme
   * @returns {string} The current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Get all available themes
   * @returns {string[]} Array of available theme names
   */
  getAvailableThemes() {
    return [...this.themes];
  }

  /**
   * Toggle between light and dark themes
   */
  toggleLightDark() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  /**
   * Get theme preview colors
   * @param {string} themeName - The theme to get colors for
   * @returns {Object} Object containing the theme's color variables
   */
  getThemeColors(themeName) {
    if (!this.themes.includes(themeName)) {
      return null;
    }

    // Create a temporary element to read CSS variables
    const tempEl = document.createElement('div');
    tempEl.style.display = 'none';
    tempEl.className = `theme-${themeName}`;
    document.body.appendChild(tempEl);

    const styles = getComputedStyle(tempEl);
    const colors = {
      primary: styles.getPropertyValue('--color-primary').trim(),
      secondary: styles.getPropertyValue('--color-secondary').trim(),
      accent: styles.getPropertyValue('--color-accent').trim(),
      surface: styles.getPropertyValue('--color-surface').trim(),
      background: styles.getPropertyValue('--color-background').trim(),
      text: styles.getPropertyValue('--color-text').trim(),
      border: styles.getPropertyValue('--color-border').trim(),
      highlight: styles.getPropertyValue('--color-highlight').trim()
    };

    document.body.removeChild(tempEl);
    return colors;
  }

  /**
   * Store theme preference in localStorage
   * @param {string} theme - The theme to store
   */
  storeTheme(theme) {
    try {
      localStorage.setItem('preferred-theme', theme);
    } catch (e) {
      console.warn('Could not store theme preference:', e);
    }
  }

  /**
   * Get stored theme from localStorage
   * @returns {string|null} The stored theme or null
   */
  getStoredTheme() {
    try {
      return localStorage.getItem('preferred-theme');
    } catch (e) {
      console.warn('Could not retrieve theme preference:', e);
      return null;
    }
  }

  /**
   * Create a theme switcher component
   * @param {HTMLElement} container - Container element for the switcher
   * @param {Object} options - Configuration options
   */
  createThemeSwitcher(container, options = {}) {
    const {
      showLabels = true,
      showPreviews = false,
      customClass = ''
    } = options;

    const switcher = document.createElement('div');
    switcher.className = `theme-switcher ${customClass}`.trim();

    const select = document.createElement('select');
    select.id = 'theme-selector';
    
    this.themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme;
      option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
      if (theme === this.currentTheme) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      this.applyTheme(e.target.value);
    });

    switcher.appendChild(select);

    if (showLabels) {
      const label = document.createElement('label');
      label.htmlFor = 'theme-selector';
      label.textContent = 'Theme: ';
      switcher.insertBefore(label, select);
    }

    if (showPreviews) {
      const preview = document.createElement('div');
      preview.className = 'theme-preview';
      preview.style.cssText = `
        display: flex;
        gap: 8px;
        margin-top: 8px;
        flex-wrap: wrap;
      `;

      this.themes.forEach(theme => {
        const colors = this.getThemeColors(theme);
        if (colors) {
          const colorDot = document.createElement('div');
          colorDot.style.cssText = `
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(45deg, ${colors.primary}, ${colors.accent});
            border: 1px solid ${colors.border};
            cursor: pointer;
            title: ${theme}
          `;
          colorDot.addEventListener('click', () => this.applyTheme(theme));
          preview.appendChild(colorDot);
        }
      });

      switcher.appendChild(preview);
    }

    container.appendChild(switcher);
    return switcher;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
  
  // Create global instance
  window.themeManager = new ThemeManager();
}
