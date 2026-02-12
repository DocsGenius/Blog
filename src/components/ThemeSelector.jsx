import { isRedDominant } from '../utils/colorUtils'

const ThemeSelector = ({ 
  themesData, 
  customThemes, 
  currentTheme, 
  themesLoading, 
  switchTheme, 
  deleteCustomTheme, 
  onCustomThemeClick 
}) => {
  return (
    <section className="theme-selector">
      <div className="theme-list">
        {themesLoading ? (
          <div className="loading-themes">Loading themes...</div>
        ) : (
          themesData?.map((theme) => (
            <button
              key={theme.name}
              className={`theme-item ${currentTheme === theme.name ? 'active' : ''}`}
              onClick={() => switchTheme(theme.name)}
            >
              <span className="theme-color" style={{ backgroundColor: theme.colors.primary }}></span>
              <span className="theme-name">{theme.displayName}</span>
            </button>
          ))
        )}
        {customThemes.map((theme) => (
          <button
            key={theme.name}
            className={`theme-item ${currentTheme === theme.name ? 'active' : ''}`}
            onClick={() => switchTheme(theme.name)}
          >
            <span 
              className={`theme-color custom-theme-color ${isRedDominant(theme.colors.primary) ? 'red-dominant' : ''}`} 
              style={{ backgroundColor: theme.colors.primary }}
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete "${theme.displayName}" theme?`)) {
                  deleteCustomTheme(theme.name)
                }
              }}
              title="Delete theme"
            ></span>
            <span className="theme-name">{theme.displayName}</span>
          </button>
        ))}
        <button
          className="theme-item custom-theme-button"
          onClick={onCustomThemeClick}
        >
          <span className="theme-color" style={{ 
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
            border: '2px dashed #ccc'
          }}></span>
          <span className="theme-name">+ Custom</span>
        </button>
      </div>
    </section>
  )
}

export default ThemeSelector
