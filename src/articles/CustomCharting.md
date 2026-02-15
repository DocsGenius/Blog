---
title: Custom Charts!
subtitle: See how GeniusDocs created custom charts for future articles to use!
authorId: roman-rand
date: February 14th, 2026
category: Newsletter
readingTime: 2 min read
coverImage: /articles/covers/CustomCharts.png
tags: ['Statistics', 'Writing', 'General', 'Originals']
chartData:
  example-bar:
    - { month: 'First', number: 400 }
    - { month: 'Second', number: 600 }
    - { month: 'Third', number: 800 }
  example-pie:
    - { browser: 'Apple', number: 65 }
    - { browser: 'Banana', number: 15 }
    - { browser: 'Orange', number: 12 }
    - { browser: 'Grape', number: 5 }
    - { browser: 'Watermelon', number: 3 }
---

## Why custom charts?

Well, I decided that it wouldn't be so classy to copy and paste other's charts. The screenshots also would stand out in certain themes, which inspired me to create custom charts!  

## How to use custom charts?

```chart-pie
example-pie
```

Above is an example of a pie chart, which can be created using the template in the Create Article page. When you're writing your article, you can call your template graph using { chart-name }, which will automatically replace your text with the markdown formatting!  

```chart-bar
example-bar
```

Above is an example of a bar chart, which is created the exact same way as the pie chart!  

## A glance into the future

These features aren't just for the inside group of writers at Genius Docs, but for all of you!  I'm actively creating a CloudFlare Worker to host **YOUR** article submissions!!! Until then, you can use the Create Article page to create your articles, and then use the download button to save the formatted article as a PNG!!!

```js
FreeInfrastructure ? signMeUp() : nah();
```

## Inspired, why not help out!

There's a contact page on the website, if you're interested in helping out, please reach out!  
Keep your eyes peeled for the next update, it might include a link to our discord.  
We're going to need all hands on deck, and if you're interested, we'll see you around!