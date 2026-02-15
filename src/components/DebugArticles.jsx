import { useState, useEffect } from 'react';

export default function DebugArticles() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function debug() {
      try {
        const response = await fetch('https://genius-docs-worker.k2tfbvzgpm.workers.dev/api/articles');
        const text = await response.text();
        console.log('Raw response:', text);
        
        let json;
        try {
          json = JSON.parse(text);
        } catch (e) {
          setError(`Invalid JSON: ${text.substring(0, 200)}`);
          return;
        }
        
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    debug();
  }, []);

  if (loading) return <div>Loading debug...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>Debug: API Response</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
