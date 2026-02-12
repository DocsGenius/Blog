import React from 'react';
import { ThemeAwareBarChart } from './charts/ThemeAwareBarChart';
import { ThemeAwarePieChart } from './charts/ThemeAwarePieChart';

// Sample data for charts - in production, this would come from your articles
const chartData = {
  'monthly-sales': [
    { month: 'Jan', sales: 4000, expenses: 2400, profit: 1600 },
    { month: 'Feb', sales: 3000, expenses: 1398, profit: 1602 },
    { month: 'Mar', sales: 2000, expenses: 9800, profit: -7800 },
    { month: 'Apr', sales: 2780, expenses: 3908, profit: -1128 },
    { month: 'May', sales: 1890, expenses: 4800, profit: -2910 },
    { month: 'Jun', sales: 2390, expenses: 3800, profit: -1410 }
  ],
  'browser-share': [
    { browser: 'Chrome', share: 65 },
    { browser: 'Firefox', share: 15 },
    { browser: 'Safari', share: 12 },
    { browser: 'Edge', share: 5 },
    { browser: 'Other', share: 3 }
  ],
  'programming-languages': [
    { language: 'JavaScript', popularity: 68 },
    { language: 'Python', popularity: 55 },
    { language: 'Java', popularity: 45 },
    { language: 'TypeScript', popularity: 38 },
    { language: 'C++', popularity: 25 },
    { language: 'Go', popularity: 15 },
    { language: 'Rust', popularity: 12 },
    { language: 'Other', share: 8 }
  ],
  'learning-progress': [
    { week: 'Week 1', concepts: 5, practice: 3, review: 2 },
    { week: 'Week 2', concepts: 8, practice: 6, review: 4 },
    { week: 'Week 3', concepts: 12, practice: 10, review: 8 },
    { week: 'Week 4', concepts: 15, practice: 14, review: 12 },
    { week: 'Week 5', concepts: 18, practice: 18, review: 16 },
    { week: 'Week 6', concepts: 20, practice: 22, review: 20 }
  ]
};

// This is the key component - it transforms custom markdown syntax into charts
export const markdownComponents = {
  // Transform ```chart bar``` code blocks
  code({ node, inline, className, children, ...props }) {
    const match = /language-chart-(\w+)/.exec(className || '');
    
    if (!inline && match) {
      const chartType = match[1];
      const chartId = String(children).trim();
      
      if (chartType === 'bar') {
        const data = chartData[chartId] || chartData['monthly-sales'];
        
        // Determine the correct xKey based on data structure
        const xKey = data[0] && data[0].month ? 'month' : 
                     data[0] && data[0].week ? 'week' : 'month';
        
        return (
          <ThemeAwareBarChart
            data={data}
            xKey={xKey}
            bars={[
              { dataKey: 'sales', name: 'Sales' },
              { dataKey: 'expenses', name: 'Expenses' },
              { dataKey: 'profit', name: 'Profit' },
              { dataKey: 'concepts', name: 'Concepts' },
              { dataKey: 'practice', name: 'Practice' },
              { dataKey: 'review', name: 'Review' }
            ].filter(bar => data[0] && data[0].hasOwnProperty(bar.dataKey))}
          />
        );
      }
      
      if (chartType === 'pie') {
        const data = chartData[chartId] || chartData['browser-share'];
        
        // Determine the correct nameKey and valueKey based on data structure
        const nameKey = data[0] && data[0].browser ? 'browser' : 
                       data[0] && data[0].language ? 'language' : 'browser';
        const valueKey = data[0] && data[0].share ? 'share' : 
                        data[0] && data[0].popularity ? 'popularity' : 'share';
        
        return (
          <ThemeAwarePieChart
            data={data}
            nameKey={nameKey}
            valueKey={valueKey}
          />
        );
      }
    }
    
    // Default code rendering
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  
  // You can also add a custom component for inline charts
  div({ node, ...props }) {
    if (props['data-chart']) {
      const chartConfig = JSON.parse(props['data-chart'] || '{}');
      
      if (chartConfig.type === 'bar') {
        return <ThemeAwareBarChart {...chartConfig} />;
      }
      
      if (chartConfig.type === 'pie') {
        return <ThemeAwarePieChart {...chartConfig} />;
      }
    }
    
    return <div {...props} />;
  }
};
