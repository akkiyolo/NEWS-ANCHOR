import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const MODEL_CHAIN = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-8b-8192", "llama-3-8b-8192"];

// ─── Generic JSON Chat Completion ─────────────────────────────────────────
export async function chatJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  modelIndex: number = 0
): Promise<T> {
  const activeModel = MODEL_CHAIN[modelIndex] || DEFAULT_MODEL;
  try {
    const completion = await groq.chat.completions.create({
      model: activeModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Fallback: try to extract JSON from markdown code blocks
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1].trim()) as T;
      }
      throw new Error(`Failed to parse JSON response: ${raw.slice(0, 200)}`);
    }
  } catch (err: any) {
    if ((err.status === 429 || err.message?.includes("Rate limit")) && modelIndex < MODEL_CHAIN.length - 1) {
      console.warn(`Groq rate limit hit for ${activeModel}, retrying with ${MODEL_CHAIN[modelIndex + 1]}`);
      return chatJSON<T>(systemPrompt, userPrompt, modelIndex + 1);
    }
    throw err;
  }
}

// ─── Generic Text Chat Completion ─────────────────────────────────────────
export async function chatText(
  systemPrompt: string,
  userPrompt: string,
  modelIndex: number = 0
): Promise<string> {
  const activeModel = MODEL_CHAIN[modelIndex] || DEFAULT_MODEL;
  try {
    const completion = await groq.chat.completions.create({
      model: activeModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (err: any) {
    if ((err.status === 429 || err.message?.includes("Rate limit")) && modelIndex < MODEL_CHAIN.length - 1) {
      console.warn(`Groq rate limit hit for ${activeModel}, retrying with ${MODEL_CHAIN[modelIndex + 1]}`);
      return chatText(systemPrompt, userPrompt, modelIndex + 1);
    }
    throw err;
  }
}

// ─── Prompt Templates ─────────────────────────────────────────────────────

export const PROMPTS = {
  // Debate Both Sides
  debate: (headline: string, articleText: string) => ({
    system: `You are a balanced political analyst. Given a news article, generate three perspectives. 
Return ONLY valid JSON with this exact shape:
{
  "liberal": "3-4 sentences from a progressive viewpoint, factual and balanced in tone",
  "conservative": "3-4 sentences from a conservative viewpoint, factual and balanced in tone",
  "neutral": "3-4 sentences from a centrist/neutral viewpoint, factual and balanced in tone"
}`,
    user: `Headline: ${headline}\n\nArticle: ${articleText}`,
  }),

  // Explain As Persona
  explain: (articleText: string, persona: string) => ({
    system: `You are a ${persona}. Explain the following news article in your unique style. 
Keep it under 150 words. Be entertaining yet informative. 
Return ONLY valid JSON: { "explanation": "your explanation here" }`,
    user: `Article: ${articleText}`,
  }),

  // Fake News Detection
  fakeness: (headline: string, articleText: string, sourceDomain: string, trustLevel: string) => ({
    system: `You are a misinformation detection expert. Analyze the article for fake news signals.
The source domain is "${sourceDomain}" which has a "${trustLevel}" trust rating.
Return ONLY valid JSON:
{
  "score": <number 0-100, where 100 is definitely fake>,
  "signals": ["signal1", "signal2", ...],
  "credibility_rating": "high" | "medium" | "low" | "very_low",
  "reasoning": "detailed explanation"
}`,
    user: `Headline: ${headline}\n\nArticle: ${articleText}`,
  }),

  // Bias Analysis
  bias: (articleText: string, sources: string[]) => ({
    system: `You are a media bias analyst. Analyze the political bias and emotional sentiment of this article.
Sources involved: ${sources.join(", ")}
Return ONLY valid JSON:
{
  "position": <number -100 to +100, where -100 is far left and +100 is far right>,
  "label": "Far Left" | "Left" | "Center-Left" | "Center" | "Center-Right" | "Right" | "Far Right",
  "sentiment": {
    "anger": <0-100>,
    "fear": <0-100>,
    "optimism": <0-100>,
    "trust": <0-100>,
    "surprise": <0-100>,
    "disgust": <0-100>
  },
  "reasoning": "detailed explanation"
}`,
    user: `Article: ${articleText}`,
  }),

  // Article Summary for anchor broadcast
  anchorSummary: (headlines: string[]) => ({
    system: `You are a professional news anchor delivering a live broadcast. Summarize each headline in 2-3 compelling sentences using broadcast anchor style — confident, clear, and engaging. Use transitions between stories. Do NOT use markdown. Return ONLY valid JSON:
{ "broadcast": "Your full broadcast script here as a single string" }`,
    user: `Today's top headlines:\n${headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}`,
  }),

  // Briefing Summary
  briefingSummary: (title: string, content: string) => ({
    system: `You are a concise news briefing writer. Write exactly 2 sentences summarizing this news story. Be factual and informative. Return ONLY valid JSON: { "summary": "your 2-sentence summary" }`,
    user: `Title: ${title}\nContent: ${content}`,
  }),

  // Translation
  translate: (text: string, targetLang: string) => ({
    system: `You are an expert translator. Translate the following text into ${targetLang}. 
Culturally adapt the content — don't do a word-for-word translation. 
Make it sound natural in the target language.
Return ONLY valid JSON: { "translated_text": "your translation here" }`,
    user: text,
  }),

  // Audio-optimized article summary
  audioSummary: (articleText: string) => ({
    system: `You are a podcast narrator. Write a 3-paragraph audio-optimized summary of this article. 
No markdown, no bullet points. Write in a conversational, engaging tone suitable for listening.
Return ONLY valid JSON: { "narration": "your 3-paragraph narration" }`,
    user: `Article: ${articleText}`,
  }),

  // Share clip (tweet-length insight)
  shareClip: (paragraph: string) => ({
    system: `Generate a tweet-length insight (under 280 characters) from this paragraph. 
Make it punchy and shareable. Return ONLY valid JSON: { "clip": "your tweet here" }`,
    user: paragraph,
  }),

  // Search ranking
  searchRank: (query: string, articles: string[]) => ({
    system: `Given a search query and a list of article titles, rank them by relevance. 
Return ONLY valid JSON: { "ranked_indices": [0, 2, 1, ...] } where numbers are the 0-based indices of articles sorted by relevance.`,
    user: `Query: "${query}"\n\nArticles:\n${articles.map((a, i) => `${i}. ${a}`).join("\n")}`,
  }),

  // Historical News Generation
  history: (epoch: string, year: number) => ({
    system: `You are a historical news broadcast archivist. Generate three realistic, authentic historical news articles that would have been published in the year ${year} during the "${epoch}" epoch. 
The articles must capture the exact journalistic style, language, and cultural focus of that time period. 
Return ONLY valid JSON with this exact shape:
{
  "articles": [
    {
      "title": "Historical headline matching the era's tone",
      "description": "Short 1-2 sentence description of the news item",
      "content": "Detailed article content written in authentic historical journalistic style of the year ${year}",
      "source_name": "Authentic historical newspaper or publication name of that era",
      "source_domain": "historical.domain",
      "category": "politics" | "technology" | "science" | "business" | "entertainment",
      "pubDate": "Authentic-looking date in the year ${year}"
    }
  ],
  "historical_analysis": "A 3-sentence summary checking how well the popular news reports of that era matched what actually turned out to be historically true over time."
}`,
    user: `Generate articles for the year ${year} during the ${epoch} event.`,
  }),

  // Media Trends & Global Sentiment Analysis
  trends: (query: string, articlesText: string) => ({
    system: `You are a media research analytics expert. Analyze the collective media coverage of the topic "${query}" based on the provided articles.
Assess the overall sensationalism, the political bias distribution, and the emotional sentiments of the coverage.
Return ONLY valid JSON in this exact shape:
{
  "hype_score": <number 0 to 100 representing how sensationalist/hyperbolic the headlines and texts are>,
  "hype_label": "Extremely Sensationalist" | "High Hype" | "Balanced Coverage" | "Objective",
  "bias_distribution": {
    "left": <number 0 to 100>,
    "center": <number 0 to 100>,
    "right": <number 0 to 100>
  },
  "sentiment_breakdown": {
    "fear": <number 0 to 100>,
    "anger": <number 0 to 100>,
    "optimism": <number 0 to 100>,
    "trust": <number 0 to 100>,
    "surprise": <number 0 to 100>
  },
  "sensationalist_phrases": ["phrase1", "phrase2", "phrase3"],
  "core_narratives": [
    "Brief explanation of main narrative/viewpoint A",
    "Brief explanation of main narrative/viewpoint B"
  ]
}`,
    user: `Analyze the following articles about "${query}":\n\n${articlesText}`,
  }),
};

// ─── Source Trust List ────────────────────────────────────────────────────
const SOURCE_TRUST: Record<string, string> = {
  "reuters.com": "very_high",
  "apnews.com": "very_high",
  "bbc.com": "high",
  "bbc.co.uk": "high",
  "nytimes.com": "high",
  "washingtonpost.com": "high",
  "theguardian.com": "high",
  "aljazeera.com": "medium",
  "cnn.com": "medium",
  "foxnews.com": "medium",
  "ndtv.com": "medium",
  "timesofindia.com": "medium",
  "thehindu.com": "high",
  "hindustantimes.com": "medium",
};

export function getSourceTrust(domain: string): string {
  const clean = domain.replace(/^(www\.)?/, "").toLowerCase();
  return SOURCE_TRUST[clean] || "unknown";
}
