import { useState, useEffect, useCallback } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './styles/article.css'
import './themes/theme-variables.css'
import { useCustomThemes } from './hooks/useCustomThemes'
import { useLazyThemes } from './hooks/useLazyThemes'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import Home from './pages/Home'
import ArticleList from './pages/ArticleList'
import Article from './pages/Article'
import CreateArticle from './pages/CreateArticle'
import PreviewDraft from './pages/PreviewDraft'
import Contact from './pages/Contact'
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
    
    if (!theme) {
      // Fallback to 'light' theme if requested theme doesn't exist
      console.warn(`Theme '${themeName}' not found, falling back to 'light' theme`)
      const fallbackTheme = themesData?.find(t => t.name === 'light')
      if (!fallbackTheme) {
        console.error('Light theme not found, cannot apply fallback')
        return
      }
      
      const root = document.documentElement
      root.classList.add('theme-switching')
      
      Object.entries(fallbackTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
      
      setCurrentTheme('light')
      localStorage.setItem('selectedTheme', 'light')
      
      setTimeout(() => {
        root.classList.remove('theme-switching')
      }, 300)
      return
    }
    
    const root = document.documentElement
    
    // Add a temporary class to prevent layout shifts during transition
    root.classList.add('theme-switching')
    
    // Apply new theme colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    // Update state and localStorage
    setCurrentTheme(themeName)
    localStorage.setItem('selectedTheme', themeName)
    
    // Remove the switching class after transition completes
    setTimeout(() => {
      root.classList.remove('theme-switching')
    }, 300)
  }, [themesData, customThemes])

  useEffect(() => {
    if (!themesLoading && themesData?.length > 0) {
      const savedTheme = localStorage.getItem('selectedTheme') || 'light'
      
      // Check if saved theme exists before applying
      const themeExists = themesData?.some(t => t.name === savedTheme) || 
                          customThemes.some(t => t.name === savedTheme)
      
      if (!themeExists && savedTheme !== 'light') {
        console.warn(`Saved theme '${savedTheme}' not found, falling back to 'light' theme`)
        localStorage.setItem('selectedTheme', 'light')
        switchTheme('light')
      } else {
        switchTheme(savedTheme)
      }
    }
  }, [switchTheme, themesLoading, themesData, customThemes])

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
              <Link to="/create-article" className="nav-link">Create Article</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </div>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/preview" element={<PreviewDraft />} />
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
