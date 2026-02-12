import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import './App.css'
import './themes/theme-variables.css'
import { useCustomThemes } from './hooks/useCustomThemes'
import { useLazyThemes } from './hooks/useLazyThemes'
import { useColorConversion, isRedDominant } from './utils/colorUtils'

const ColorSlider = memo(({ label, value, onChange }) => {
  const rgb = useColorConversion(value)

  const handleRgbChange = useCallback((channel, val) => {
    const newRgb = { ...rgb, [channel]: val }
    const hex = '#' + [newRgb.r, newRgb.g, newRgb.b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
    onChange(hex)
  }, [rgb, onChange])

  return (
    <div className="color-slider">
      <label>{label}</label>
      <div className="slider-group">
        <div className="slider-row">
          <span>R</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
          />
          <span>{rgb.r}</span>
        </div>
        <div className="slider-row">
          <span>G</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
          />
          <span>{rgb.g}</span>
        </div>
        <div className="slider-row">
          <span>B</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
          />
          <span>{rgb.b}</span>
        </div>
        <div className="color-preview" style={{ backgroundColor: value }}></div>
      </div>
    </div>
  )
})

const CustomThemePopup = memo(({ isOpen, onClose, onSave }) => {
  const [colors, setColors] = useState({
    primary: '#808080',
    secondary: '#a0a0a0',
    accent: '#c0c0c0',
    surface: '#f5f5f5',
    background: '#fafafa',
    text: '#333333',
    border: '#d0d0d0',
    highlight: '#e0e0e0'
  })

  const handleColorChange = useCallback((key, value) => {
    setColors(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSave = useCallback(() => {
    const themeName = prompt('Enter a name for your custom theme:')
    if (themeName) {
      onSave({ name: themeName, displayName: themeName, colors })
      onClose()
    }
  }, [colors, onSave, onClose])

  if (!isOpen) return null

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h3>Create Custom Theme</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">
          {Object.entries(colors).map(([key, value]) => (
            <ColorSlider
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={(newValue) => handleColorChange(key, newValue)}
            />
          ))}
        </div>
        <div className="popup-footer">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save Theme</button>
        </div>
      </div>
    </div>
  )
})

function App() {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [showCustomPopup, setShowCustomPopup] = useState(false)
  const { customThemes, isLoading: customLoading, saveCustomTheme, deleteCustomTheme } = useCustomThemes()
  const { themes: themesData, isLoading: themesLoading } = useLazyThemes()

  const switchTheme = useCallback((themeName) => {
    if (themeName === 'custom') {
      setShowCustomPopup(true)
      return
    }
    
    const theme = themesData?.find(t => t.name === themeName) || 
                 customThemes.find(t => t.name === themeName)
    
    if (!theme) return
    
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    setCurrentTheme(themeName)
  }, [themesData, customThemes])

  useEffect(() => {
    if (!themesLoading && themesData?.length > 0) {
      switchTheme('light')
    }
  }, [switchTheme, themesLoading, themesData])

  return (
    <div className="app">
      <header className="header surface">
        <nav className="nav">
          <div className="nav-brand">
            <h1 className="text-primary">Theme System Demo</h1>
          </div>
          <div className="nav-menu">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#themes" className="nav-link">Themes</a>
          </div>
        </nav>
      </header>

      <main className="main">
      </main>

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
                  deleteCustomTheme(theme.name)
                }}
                title="Delete theme"
              ></span>
              <span className="theme-name">{theme.displayName}</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="footer surface">
        <p className="text-secondary">Built with React & CSS Custom Properties</p>
      </footer>

      <CustomThemePopup
        isOpen={showCustomPopup}
        onClose={() => setShowCustomPopup(false)}
        onSave={saveCustomTheme}
      />
    </div>
  )
}

export default App
