import { useState, useEffect } from 'react'

export const useLazyThemes = () => {
  const [themes, setThemes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadThemes = async () => {
      try {
        // Dynamic import to lazy load themes
        const themesModule = await import('../data/themesData.js')
        setThemes(themesModule.default)
      } catch (err) {
        setError(err)
        console.error('Failed to load themes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadThemes()
  }, [])

  return { themes, isLoading, error }
}
