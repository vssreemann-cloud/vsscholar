import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Paper {
  title: string;
  authors: string[];
  year: number;
  journal: string;
  abstract: string;
  link?: string;
}

export async function searchLiterature(query: string): Promise<Paper[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are an academic search engine. The user is searching for: "${query}". 
      Provide a list of 5 highly relevant academic papers (real papers if possible, or highly plausible ones based on real research). 
      Include the title, authors, publication year, journal/conference, and a brief abstract.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              authors: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              year: { type: Type.INTEGER },
              journal: { type: Type.STRING },
              abstract: { type: Type.STRING },
              link: { type: Type.STRING, description: "A plausible URL or DOI link" }
            },
            required: ["title", "authors", "year", "journal", "abstract"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Paper[];
    }
    return [];
  } catch (error) {
    console.error("Error searching literature:", error);
    throw error;
  }
}

export async function summarizeDocument(fileBase64: string, mimeType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Please provide a comprehensive summary of this academic literature. Include the main objectives, methodology, key findings, and conclusion. Format the output in Markdown with clear headings.",
          },
        ],
      },
    });

    return response.text || "No summary could be generated.";
  } catch (error) {
    console.error("Error summarizing document:", error);
    throw error;
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Translate the following academic summary into ${targetLanguage}. Maintain the markdown formatting and professional tone.\n\n${text}`,
    });
    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
}
