import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper to get CSS variable value
const getCSSVar = (varName) => {
  if (typeof window === 'undefined') return '#000000';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim() || '#000000';
};

export const ThemeAwareBarChart = ({ data, xKey, bars }) => {
  const [themeColors, setThemeColors] = useState({
    primary: '#000000',
    secondary: '#666666',
    accent: '#0066cc',
    text: '#333333',
    border: '#e0e0e0',
    surface: '#ffffff',
    background: '#f5f5f5'
  });

  // Update colors when theme changes
  useEffect(() => {
    let timeoutId;
    
    const updateColors = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setThemeColors({
          primary: getCSSVar('--color-primary'),
          secondary: getCSSVar('--color-secondary'),
          accent: getCSSVar('--color-accent'),
          text: getCSSVar('--color-text'),
          border: getCSSVar('--color-border'),
          surface: getCSSVar('--color-surface'),
          background: getCSSVar('--color-background')
        });
      }, 100); // Small delay to allow theme transition to start
    };

    // Initial update
    updateColors();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style' && 
            mutation.target === document.documentElement) {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['style'] 
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="chart-container" style={{ 
      width: '100%', 
      height: '400px',
      margin: '2rem 0',
      padding: '1rem',
      backgroundColor: themeColors.surface,
      border: `1px solid ${themeColors.border}`,
      borderRadius: '8px'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={themeColors.border} 
          />
          <XAxis 
            dataKey={xKey} 
            stroke={themeColors.text}
            tick={{ fill: themeColors.text }}
          />
          <YAxis 
            stroke={themeColors.text}
            tick={{ fill: themeColors.text }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
              borderRadius: '4px',
              color: themeColors.text
            }}
          />
          <Legend 
            wrapperStyle={{ 
              color: themeColors.text 
            }} 
          />
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={index === 0 ? themeColors.primary : 
                     index === 1 ? themeColors.accent : 
                     themeColors.secondary}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
