import { useEffect } from 'react'

export const useDocumentTitle = (title = 'Genius Docs') => {
  useEffect(() => {
    document.title = title
    return () => {
      // Optional: Reset to default when component unmounts
      document.title = 'Genius Docs'
    }
  }, [title])
}
