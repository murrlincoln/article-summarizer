import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';
import OpenAI from 'openai';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const CRYPTO_SYSTEM_PROMPT = `You are a cryptocurrency and blockchain expert writing for a professional newsletter. Your task is to analyze web content and create concise, insightful summaries that would be valuable for crypto investors, traders, and industry professionals.

Guidelines:
- Focus on key developments, market implications, and actionable insights
- Highlight important metrics, partnerships, regulatory changes, or technological advances
- Keep summaries between 100-200 words
- Use professional tone appropriate for financial newsletter
- Include relevant context for crypto market impact
- Identify potential risks or opportunities mentioned
- Format your response within <answer> tags for easy copying

Always wrap your final summary within <answer> tags.`;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Scrape the URL with Firecrawl
    const scrapeResult = await firecrawl.scrapeUrl(url, {
      formats: ['markdown']
    });


    if (!scrapeResult.success) {
      return NextResponse.json(
        { error: `Failed to scrape: ${scrapeResult.error}` },
        { status: 500 }
      );
    }

    // Handle the response structure - Firecrawl returns data directly
    let markdownContent = '';
    let title = 'No title';
    
    if (scrapeResult.markdown) {
      markdownContent = scrapeResult.markdown;
      title = scrapeResult.metadata?.title || 'No title';
    } else if (scrapeResult.data?.markdown) {
      markdownContent = scrapeResult.data.markdown;
      title = scrapeResult.data.metadata?.title || 'No title';
    } else {
      console.error('Unexpected Firecrawl response structure:', scrapeResult);
      return NextResponse.json(
        { error: 'Failed to extract content from scraped page' },
        { status: 500 }
      );
    }

    if (!markdownContent) {
      return NextResponse.json(
        { error: 'No content found on the page' },
        { status: 400 }
      );
    }

    // Generate summary with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'o4-mini-2025-06-20',
      messages: [
        {
          role: 'user',
          content: `${CRYPTO_SYSTEM_PROMPT}\n\nContent to summarize:\n${markdownContent}`
        }
      ]
    });

    const summary = completion.choices[0]?.message?.content || 'No summary generated';

    return NextResponse.json({
      success: true,
      data: {
        url,
        title,
        summary,
        sourceContent: markdownContent
      }
    });

  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}