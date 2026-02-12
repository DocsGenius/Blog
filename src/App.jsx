import { useState, useEffect } from 'react'
import './App.css'
import './themes/base.css'
import themesData from './themes.json'

function App() {
  const [currentTheme, setCurrentTheme] = useState('light')

  const switchTheme = (themeName) => {
    const theme = themesData.find(t => t.name === themeName)
    if (!theme) return
    
    // Apply theme colors as CSS custom properties
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    setCurrentTheme(themeName)
  }

  useEffect(() => {
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
        </div>
      </section>

      <footer className="footer surface">
        <p className="text-secondary">Built with React & CSS Custom Properties</p>
      </footer>
    </div>
  )
}

export default App
