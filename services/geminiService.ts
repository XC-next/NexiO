import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return ai;
};

export const generateCreativeCaption = async (mood: string, context: string): Promise<string> => {
  try {
    const client = getAI();
    const prompt = `You are a creative assistant for a Gen-Z social app called NexiO. 
    Generate a short, trendy, viral-worthy caption for a post.
    
    Mood: ${mood}
    Context: ${context}
    
    Keep it under 20 words. Use emojis. No hashtags.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Living my best life ✨"; // Fallback
  }
};

export const generateBio = async (name: string, interests: string): Promise<string> => {
    try {
        const client = getAI();
        const prompt = `Create a cool, aesthetic 2-line bio for a user named ${name} who likes ${interests}. Use 2 emojis.`;
        
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text.trim();
    } catch (error) {
        console.error("Gemini API Error", error);
        return "Digital Dreamer 🌌";
    }
}
