# Crypto Newsletter Summary Tool

A Next.js web application that scrapes URLs using Firecrawl and generates crypto-focused summaries using OpenAI's o1-mini model.

## Features

- URL scraping with Firecrawl
- AI-powered crypto newsletter summaries  
- Clean, responsive UI
- One-click copy functionality
- Optimized for Vercel deployment

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Add your API keys to `.env.local`:
   - `FIRECRAWL_API_KEY`: Your Firecrawl API key
   - `OPENAI_API_KEY`: Your OpenAI API key

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `FIRECRAWL_API_KEY`
   - `OPENAI_API_KEY`
3. Deploy

## Usage

1. Enter a URL in the input field
2. Click "Summarize" to generate a crypto-focused summary
3. Copy the summary output wrapped in `<answer>` tags for easy pasting into your newsletter
