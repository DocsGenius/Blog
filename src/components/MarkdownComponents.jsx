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
        return (
          <ThemeAwareBarChart 
            data={data} 
            xKey={Object.keys(data[0])[0]} 
            bars={[{ dataKey: Object.keys(data[0])[1], fill: 'var(--primary-color)' }]}
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
