# EmailJS Setup Guide, FOR THOSE COPYING THIS REPOSITORY!

This document explains how to configure EmailJS for the DocsGenius contact form.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emaxiljs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. Go to Email Services → Add New Service
2. Choose your email provider (Gmail, Outlook, etc.)
3. Connect your email account
4. Note your **Service ID**

## Step 3: Create Email Template

1. Go to Email Templates → Create New Template
2. Use this template structure:

```
From: {{from_name}} ({{from_email}})
Subject: {{subject}}
To: {{to_email}}

Message:
{{message}}
```

3. Note your **Template ID**

## Step 4: Get Public Key

1. Go to Account → API Keys
2. Copy your **Public Key**

## Step 5: Update Configuration

Replace the placeholder values in `/src/components/Contact.jsx`:

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_ACTUAL_PUBLIC_KEY'
const EMAILJS_SERVICE_ID = 'YOUR_ACTUAL_SERVICE_ID' 
const EMAILJS_TEMPLATE_ID = 'YOUR_ACTUAL_TEMPLATE_ID'
```

## Step 6: Test

1. Start your development server
2. Go to the Contact page
3. Fill out and submit the form
4. Check your email for the test message

## Features

- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Responsive design
- ✅ Theme integration

## Notes

- The free EmailJS plan allows 200 emails per month
- All form data is sent securely through EmailJS
- No backend server required
- Form includes proper error handling and user feedback
