import { useState, useEffect } from 'react'

export const useCustomThemes = () => {
  const [customThemes, setCustomThemes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedThemes = JSON.parse(localStorage.getItem('customThemes') || '[]')
      setCustomThemes(savedThemes)
    } catch (error) {
      console.error('Error loading custom themes:', error)
      setCustomThemes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveCustomTheme = (theme) => {
    try {
      const existingThemes = JSON.parse(localStorage.getItem('customThemes') || '[]')
      const updatedThemes = [...existingThemes, theme]
      
      localStorage.setItem('customThemes', JSON.stringify(updatedThemes))
      setCustomThemes(updatedThemes)
      return true
    } catch (error) {
      console.error('Error saving custom theme:', error)
      return false
    }
  }

  const deleteCustomTheme = (themeName) => {
    try {
      const existingThemes = JSON.parse(localStorage.getItem('customThemes') || '[]')
      const updatedThemes = existingThemes.filter(t => t.name !== themeName)
      
      localStorage.setItem('customThemes', JSON.stringify(updatedThemes))
      setCustomThemes(updatedThemes)
      return true
    } catch (error) {
      console.error('Error deleting custom theme:', error)
      return false
    }
  }

  return {
    customThemes,
    isLoading,
    saveCustomTheme,
    deleteCustomTheme
  }
}
