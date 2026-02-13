# Charts Integration Guide

This guide explains how to create and integrate interactive charts in DocsGenius articles.

## Chart System Overview

DocsGenius uses Recharts library to render interactive charts directly from Markdown frontmatter data. The system supports bar charts and pie charts with automatic theme integration.

## Supported Chart Types

### Bar Charts
- Multi-series data support
- Automatic axis detection
- Theme-aware colors
- Responsive design

### Pie Charts
- Single-series data
- Automatic label/value detection
- Color palette generation
- Interactive tooltips

## Chart Data Format

### Bar Chart Data Structure
```yaml
chartData:
  chart-id:
    - { category: 'Jan', value1: 100, value2: 200 }
    - { category: 'Feb', value1: 150, value2: 250 }
    - { category: 'Mar', value1: 200, value2: 300 }
```

### Pie Chart Data Structure
```yaml
chartData:
  chart-id:
    - { label: 'Item A', value: 30 }
    - { label: 'Item B', value: 50 }
    - { label: 'Item C', value: 20 }
```

## Adding Charts to Articles

### Step 1: Define Chart Data in Frontmatter
```markdown
---
title: "Your Article"
chartData:
  sales-data:
    - { month: 'Jan', revenue: 4000, costs: 2000 }
    - { month: 'Feb', revenue: 6000, costs: 3000 }
    - { month: 'Mar', revenue: 8000, costs: 4000 }
  market-share:
    - { company: 'Company A', share: 45 }
    - { company: 'Company B', share: 30 }
    - { company: 'Company C', share: 25 }
---
```

### Step 2: Reference Charts in Markdown
```markdown
## Sales Performance

```chart-bar
sales-data
```

## Market Distribution

```chart-pie
market-share
```
```

## Chart Configuration

### Automatic Detection
The system automatically detects:
- **X-axis**: First key in data object
- **Y-axis values**: All subsequent keys
- **Labels**: First key for pie charts
- **Values**: Second key for pie charts

### Manual Override (Advanced)
For custom chart configurations, modify `MarkdownComponents.jsx`:

```javascript
if (chartType === 'bar') {
  return (
    <ThemeAwareBarChart 
      data={data} 
      xKey="custom-x-key"
      bars={[
        { dataKey: 'value1', fill: 'var(--primary-color)' },
        { dataKey: 'value2', fill: 'var(--accent-color)' }
      ]}
    />
  );
}
```

## Chart Styling

### Theme Integration
Charts automatically inherit theme colors:
- Primary color for main data series
- Accent color for highlights
- Surface color for backgrounds
- Text color for labels

### Custom Colors
Override default colors in chart configuration:

```javascript
bars={[
  { dataKey: 'revenue', fill: '#4CAF50' },
  { dataKey: 'costs', fill: '#FF5722' }
]}
```

## Best Practices

### Data Organization
- Use descriptive chart IDs
- Keep data concise and relevant
- Ensure consistent data types
- Use meaningful labels

### Chart Selection
- **Bar charts**: Compare values across categories
- **Pie charts**: Show parts of a whole
- Limit to 8-10 items for pie charts
- Use consistent time periods for temporal data

### Accessibility
- Provide alt text descriptions
- Ensure color contrast
- Test with screen readers
- Include data summaries in text

## Examples

### Monthly Sales Report
```yaml
chartData:
  monthly-sales:
    - { month: 'January', revenue: 12000, expenses: 8000 }
    - { month: 'February', revenue: 15000, expenses: 9000 }
    - { month: 'March', revenue: 18000, expenses: 10000 }
```

```markdown
```chart-bar
monthly-sales
```
```

### Technology Stack Usage
```yaml
chartData:
  tech-stack:
    - { technology: 'React', usage: 65 }
    - { technology: 'Vue', usage: 25 }
    - { technology: 'Angular', usage: 10 }
```

```markdown
```chart-pie
tech-stack
```
```

### Learning Progress
```yaml
chartData:
  learning-progress:
    - { week: 'Week 1', concepts: 5, practice: 3, review: 2 }
    - { week: 'Week 2', concepts: 8, practice: 6, review: 4 }
    - { week: 'Week 3', concepts: 12, practice: 10, review: 8 }
```

```markdown
```chart-bar
learning-progress
```
```

## Troubleshooting

### Chart Not Displaying
1. Check chart ID matches frontmatter key
2. Verify YAML syntax is correct
3. Ensure data structure is valid
4. Check browser console for errors

### Data Not Found Error
```markdown
Chart data for "chart-id" not found in frontmatter.
```
**Solution**: Add the chart data to frontmatter or check spelling

### Empty Chart
1. Verify data array is not empty
2. Check data objects have required keys
3. Ensure values are numbers (not strings)

### Theme Issues
1. Check CSS variables are defined
2. Verify theme is properly loaded
3. Test with different themes

## Advanced Features

### Multiple Series Bar Charts
```yaml
chartData:
  performance:
    - { quarter: 'Q1', sales: 10000, costs: 6000, profit: 4000 }
    - { quarter: 'Q2', sales: 12000, costs: 7000, profit: 5000 }
    - { quarter: 'Q3', sales: 15000, costs: 8000, profit: 7000 }
```

### Custom Color Palettes
Modify `ThemeAwareBarChart.jsx` to use custom colors:

```javascript
const getBarColor = (dataKey, index) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  return colors[index % colors.length];
};
```

### Responsive Charts
Charts automatically adapt to container size. Ensure parent container has proper dimensions:

```css
.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
```

This chart system provides a powerful way to visualize data while maintaining consistency with the DocsGenius design system.
