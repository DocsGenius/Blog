
import { useState, useEffect, useRef } from 'react'
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
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isHovered) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    } else if (showThemeSelector) {
      timeoutRef.current = setTimeout(() => {
        setShowThemeSelector(false)
        setTimeout(() => {
          setShowButton(true)
        }, 200)
      }, 3000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isHovered, showThemeSelector])

  const handleShowThemes = () => {
    setShowThemeSelector(true)
    setShowButton(false)
  }
  
  return (
    <section className="theme-selector">
      <div 
        className="theme-selector-container"
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="show-theme-list" 
          onClick={handleShowThemes} 
          style={{ 
            display: showButton ? 'flex' : 'none',
            opacity: showButton ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        >
          <h2>Themes</h2>
        </div>
        <div className="theme-list" style={{ visibility: showThemeSelector ? 'visible' : 'hidden' }}>
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
      </div>
    </section>
  )
}

export default ThemeSelector
