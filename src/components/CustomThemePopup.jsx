import { useState, useCallback } from 'react'
import ColorSlider from './ColorSlider'

const CustomThemePopup = ({ isOpen, onClose, onSave, currentTheme, themesData, customThemes }) => {
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

  const handlePullTheme = useCallback(() => {
    // Get current theme colors from CSS variables
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)
    
    const currentColors = {
      primary: computedStyle.getPropertyValue('--color-primary').trim(),
      secondary: computedStyle.getPropertyValue('--color-secondary').trim(),
      accent: computedStyle.getPropertyValue('--color-accent').trim(),
      surface: computedStyle.getPropertyValue('--color-surface').trim(),
      background: computedStyle.getPropertyValue('--color-background').trim(),
      text: computedStyle.getPropertyValue('--color-text').trim(),
      border: computedStyle.getPropertyValue('--color-border').trim(),
      highlight: computedStyle.getPropertyValue('--color-highlight').trim()
    }
    
    setColors(currentColors)
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
          <button className="btn secondary" onClick={handlePullTheme}>Pull Current Theme</button>
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save Theme</button>
        </div>
      </div>
    </div>
  )
}

export default CustomThemePopup
