import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GitHubRepoData, RepoAnalysis, ChatMessage } from "../types";

// Schema definition for the AI response
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A simple, beginner-friendly explanation of what the project does.",
    },
    techStack: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of main technologies, languages, and frameworks used.",
    },
    structure: {
      type: Type.STRING,
      description: "A simple explanation of the folder structure.  Use a plain text list with dashes (e.g. '- src/: main code'). Do NOT use HTML tags like <ul> or <li>.",
    },
    runInstructions: {
      type: Type.STRING,
      description: " Simplified steps to run the project locally. Use Markdown for code blocks.",
    },
    targetAudience: {
      type: Type.STRING,
      description: "Who is this project for? (e.g., ' React beginners', 'Data Scientists').",
    },
    pros: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of strengths or positive aspects of the project/codebase.",
    },
    cons: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of weaknesses, missing features, or areas for improvement.",
    },
  },
  required: ["summary", "techStack", "structure", "runInstructions", "targetAudience", "pros", "cons"],
};

export const analyzeRepo = async (repoData: GitHubRepoData): Promise<RepoAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing Gemini API Key. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a friendly, patient coding mentor for a first-year computer science student.
    
    I will provide you with details about a GitHub repository. 
    Your goal is to explain it simply, avoiding jargon where possible.
    
    Repository Name: ${repoData.owner}/${repoData.repo}
    Description: ${repoData.description || "No description provided."}
    Primary Language: ${repoData.language || "Unknown"}
    
    README Content (truncated if too long):
    ---
    ${repoData.readme.slice(0, 25000)}
    ---

    Please analyze this and provide a structured explanation covering:
    1. What does this project do?
    2. The Tech Stack used.
    3. Explanation of the folder structure (Strictly use a plain text list with dashes. NO HTML TAGS allowed).
    4. How to run it locally (simplify the steps).
    5. Who should use or study this?
    6. Three strengths (pros) of the project.
    7. Three weaknesses or areas for improvement (cons).

    If information is completely missing, explicitly say "Not specified in the repository".
    Keep the tone calm, encouraging, and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a helpful mentor explaining code repositories to beginners. Return responses in JSON format. Do NOT use HTML tags in your strings; use Markdown or plain text with newlines.",
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI.");
    }

    const result = JSON.parse(response.text) as RepoAnalysis;
    return result;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    const errorMessage = error.message || JSON.stringify(error);
    throw new Error(`AI Analysis Failed: ${errorMessage}`);
  }
};

export const chatWithRepo = async (repoData: GitHubRepoData, chatHistory: ChatMessage[], newMessage: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an AI assistant helping a user understand a GitHub repository.
    Answer their questions concisely and accurately based on the repository details.
    
    Repository Name: ${repoData.owner}/${repoData.repo}
    Description: ${repoData.description || "No description provided."}
    Primary Language: ${repoData.language || "Unknown"}
    
    README Content (truncated if too long):
    ---
    ${repoData.readme.slice(0, 15000)}
    ---
  `;

  // Format history for Gemini
  const contents = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Add the new message
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }]
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: contents as any,
      config: {
        systemInstruction,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Failed to get response from AI.");
  }
};

