import { useState, useEffect, useCallback } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './styles/article.css'
import './themes/theme-variables.css'
import { useCustomThemes } from './hooks/useCustomThemes'
import { useLazyThemes } from './hooks/useLazyThemes'
import Home from './components/Home'
import ArticleList from './components/ArticleList'
import Article from './components/Article'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomThemePopup from './components/CustomThemePopup'
import ThemeSelector from './components/ThemeSelector'



function App() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('selectedTheme') || 'light'
  })
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
    localStorage.setItem('selectedTheme', themeName)
  }, [themesData, customThemes])

  useEffect(() => {
    if (!themesLoading && themesData?.length > 0) {
      const savedTheme = localStorage.getItem('selectedTheme') || 'light'
      switchTheme(savedTheme)
    }
  }, [switchTheme, themesLoading, themesData])

  return (
    <Router>
      <div className="app">
        <header className="header surface">
          <nav className="nav">
            <div className="nav-brand">
              <Link to="/" className="nav-brand-link">
                <img src="/branding/GeniusDocsIconClear.png" alt="Genius Docs" className="nav-icon" />
                <h1 className="text-primary">Genius Docs</h1>
              </Link>
            </div>
            <div className="nav-menu">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/articles" className="nav-link">Articles</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </div>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <ThemeSelector
          themesData={themesData}
          customThemes={customThemes}
          currentTheme={currentTheme}
          themesLoading={themesLoading}
          switchTheme={switchTheme}
          deleteCustomTheme={deleteCustomTheme}
          onCustomThemeClick={() => setShowCustomPopup(true)}
        />

        <Footer />

        <CustomThemePopup
          isOpen={showCustomPopup}
          onClose={() => setShowCustomPopup(false)}
          onSave={saveCustomTheme}
          currentTheme={currentTheme}
          themesData={themesData}
          customThemes={customThemes}
        />
      </div>
    </Router>
  )
}

export default App
