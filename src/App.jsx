import { useState, useEffect } from 'react'
import './App.css'
import './themes/base.css'
import themesData from './themes.json'

function ColorSlider({ label, value, onChange }) {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(value)

  const handleRgbChange = (channel, val) => {
    const newRgb = { ...rgb, [channel]: val }
    const hex = '#' + [newRgb.r, newRgb.g, newRgb.b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
    onChange(hex)
  }

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
}

function CustomThemePopup({ isOpen, onClose, onSave }) {
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

  const handleColorChange = (key, value) => {
    setColors(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const themeName = prompt('Enter a name for your custom theme:')
    if (themeName) {
      onSave({ name: themeName, displayName: themeName, colors })
      onClose()
    }
  }

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
}

function App() {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [showCustomPopup, setShowCustomPopup] = useState(false)
  const [customThemes, setCustomThemes] = useState([])

  const isRedDominant = (hexColor) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
    if (!result) return false
    
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    
    return r > g * 1.5 && r > b * 1.5
  }

  const switchTheme = (themeName) => {
    // Handle custom theme button click
    if (themeName === 'custom') {
      setShowCustomPopup(true)
      return
    }
    
    const theme = themesData.find(t => t.name === themeName) || 
                 customThemes.find(t => t.name === themeName)
    
    if (!theme) return
    
    // Apply theme colors as CSS custom properties
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    setCurrentTheme(themeName)
  }

  const deleteCustomTheme = (themeName) => {
    try {
      const existingThemes = JSON.parse(localStorage.getItem('customThemes') || '[]')
      const updatedThemes = existingThemes.filter(t => t.name !== themeName)
      
      localStorage.setItem('customThemes', JSON.stringify(updatedThemes))
      setCustomThemes(updatedThemes)
      
      // If deleted theme was current, switch to light
      if (currentTheme === themeName) {
        switchTheme('light')
      }
    } catch (error) {
      console.error('Error deleting custom theme:', error)
    }
  }

  const saveCustomTheme = (theme) => {
    try {
      // Load existing custom themes from localStorage
      const existingThemes = JSON.parse(localStorage.getItem('customThemes') || '[]')
      const updatedThemes = [...existingThemes, theme]
      
      // Save to localStorage
      localStorage.setItem('customThemes', JSON.stringify(updatedThemes))
      setCustomThemes(updatedThemes)
      console.log('Custom theme saved:', theme)
    } catch (error) {
      console.error('Error saving custom theme:', error)
    }
  }

  useEffect(() => {
    // Load custom themes from localStorage on mount
    try {
      const savedThemes = JSON.parse(localStorage.getItem('customThemes') || '[]')
      setCustomThemes(savedThemes)
    } catch (error) {
      console.error('Error loading custom themes:', error)
    }
    
    switchTheme('light')
  }, [])

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
          {themesData.map((theme) => (
            <button
              key={theme.name}
              className={`theme-item ${currentTheme === theme.name ? 'active' : ''}`}
              onClick={() => switchTheme(theme.name)}
            >
              <span className="theme-color" style={{ backgroundColor: theme.colors.primary }}></span>
              <span className="theme-name">{theme.displayName}</span>
            </button>
          ))}
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
