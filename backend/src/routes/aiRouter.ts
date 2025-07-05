import express from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { GoogleGenAI } from "@google/genai";
import { createAuthHandler } from "../types/handlers";

const aiRouter = express.Router();

aiRouter.post(
  "/ai",
  authMiddleware,
  createAuthHandler(async (req: AuthenticatedRequest, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Valid prompt is required",
        });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          success: false,
          message: "Gemini API key is not configured",
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt.trim() }],
          },
        ],
        config: {
          systemInstruction:
            'You are GuidenaAI, an AI mentorship assistant on the GuidenaHQ platform. Your role is to act like a knowledgeable, friendly senior developer or mentor. Always be direct, clear, and practically helpful. If the learner asks for code, return clean, working code with comments. Avoid complex jargon unless asked; explain things in simple terms first. Help learners with debugging, technical concept explanation (JavaScript, React, Node.js, MongoDB, TypeScript, etc.), project structuring, interview prep, and learning path suggestions. Keep answers brief unless asked for detail. Never make up answers—say "I\'m not sure" if uncertain. If the user shares project code or ideas, give constructive feedback, suggest improvements, and guide toward better solutions. Stay focused on development and mentorship only—avoid emotional or philosophical conversations. Suggest popular dev tools, libraries, documentation, and project ideas when relevant. Your tone is supportive like a helpful mentor, but never flattering or sugar-coated—just real, honest, and useful.',
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });

      const aiResponse =
        response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        res.status(500).json({
          success: false,
          message: "Failed to generate AI response",
        });
        return;
      }

      const formattedResponse = aiResponse
        .trim()
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\t/g, "  ");

      res.status(200).json({
        success: true,
        message: "AI response generated successfully",
        data: {
          response: formattedResponse,
          timestamp: new Date().toISOString(),
          model: "gemini-2.5-flash",
        },
      });
    } catch (error: any) {
      console.error("AI Router Error:", error);

      if (error.message?.includes("API key")) {
        res.status(401).json({
          success: false,
          message: "Invalid or expired API key",
        });
        return;
      }

      if (
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")
      ) {
        res.status(429).json({
          success: false,
          message: "API rate limit exceeded. Please try again later.",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error while processing AI request",
      });
    }
  })
);

export default aiRouter;
