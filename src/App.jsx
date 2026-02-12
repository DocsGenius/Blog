import { useState, useEffect } from 'react'
import './App.css'
import './themes/light.css'

function App() {
  const [currentTheme, setCurrentTheme] = useState('light')

  const themes = [
    'light',
    'dark', 
    'ocean',
    'forest',
    'sunset',
    'purple',
    'monochrome',
    'candy'
  ]

  const switchTheme = (theme) => {
    // Remove all existing theme stylesheets
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"][href*="themes/"]')
    existingLinks.forEach(link => link.remove())
    
    // Add new theme stylesheet
    const newLink = document.createElement('link')
    newLink.rel = 'stylesheet'
    newLink.href = `/src/themes/${theme}.css`
    document.head.appendChild(newLink)
    
    setCurrentTheme(theme)
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
          {themes.map((theme) => (
            <button
              key={theme}
              className={`theme-item ${currentTheme === theme ? 'active' : ''}`}
              onClick={() => switchTheme(theme)}
            >
              <span className="theme-color" data-theme={theme}></span>
              <span className="theme-name">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
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
