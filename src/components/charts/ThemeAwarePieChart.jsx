import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getCSSVar = (varName) => {
  if (typeof window === 'undefined') return '#000000';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim() || '#000000';
};

export const ThemeAwarePieChart = ({ data, nameKey, valueKey }) => {
  const [themeColors, setThemeColors] = useState({
    primary: '#000000',
    secondary: '#666666',
    accent: '#0066cc',
    surface: '#ffffff',
    border: '#e0e0e0',
    text: '#333333'
  });

  useEffect(() => {
    const updateColors = () => {
      setThemeColors({
        primary: getCSSVar('--color-primary'),
        secondary: getCSSVar('--color-secondary'),
        accent: getCSSVar('--color-accent'),
        surface: getCSSVar('--color-surface'),
        border: getCSSVar('--color-border'),
        text: getCSSVar('--color-text')
      });
    };

    updateColors();

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

    return () => observer.disconnect();
  }, []);

  // Generate color palette from theme colors
  const COLORS = [
    themeColors.primary,
    themeColors.accent,
    themeColors.secondary,
    '#4ecdc4',
    '#ff6b6b',
    '#45b7d1',
    '#96ceb4',
    '#ffeaa5',
    '#74b9ff',
    '#a29bfe'
  ];

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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={(entry) => entry[nameKey]}
            outerRadius={120}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
              borderRadius: '4px',
              color: themeColors.text
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
