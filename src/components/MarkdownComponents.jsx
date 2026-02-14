import React from 'react';
import { ThemeAwareBarChart } from './charts/ThemeAwareBarChart';
import { ThemeAwarePieChart } from './charts/ThemeAwarePieChart';

export const getMarkdownComponents = (chartData) => ({
  code({ node, inline, className, children, ...props }) {
    const match = /language-chart-(\w+)/.exec(className || '');
    const chartId = String(children).trim();

    if (!inline && match) {
      const chartType = match[1];
      // Retrieve the specific data block using the ID from the markdown
      const data = chartData && chartData[chartId] ? chartData[chartId] : null;

      if (!data) {
        return <div className="chart-error">Chart data for "{chartId}" not found in frontmatter.</div>;
      }

      if (chartType === 'bar') {
        const keys = Object.keys(data[0])
        const xKey = keys[0]
        const dataKeys = keys.slice(1)
        const bars = dataKeys.map((key, index) => ({
          dataKey: key,
          fill: index === 0 ? 'var(--color-primary)' : 
                index === 1 ? 'var(--color-accent)' : 
                index === 2 ? 'var(--color-secondary)' : 'var(--color-text-secondary)'
        }))
        return (
          <ThemeAwareBarChart 
            data={data} 
            xKey={xKey} 
            bars={bars}
          />
        );
      }
      
      if (chartType === 'pie') {
        return (
          <ThemeAwarePieChart 
            data={data} 
            nameKey={Object.keys(data[0])[0]} // Automatically use the first key as name
            valueKey={Object.keys(data[0])[1]} // Automatically use the second key as value
          />
        );
      }
    }

    return <code className={className} {...props}>{children}</code>;
  }
});
