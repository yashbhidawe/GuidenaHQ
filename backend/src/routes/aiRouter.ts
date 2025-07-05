import express from "express";
import authMiddleware from "../middleware/auth";

import { GoogleGenAI } from "@google/genai";
import e from "express";

const aiRouter = express.Router();

aiRouter.post("/ai", authMiddleware, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ message: "Gemini API key  is not configured" });
    return;
  }

  const ai = new GoogleGenAI({});
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are GuidenaAI, an AI mentorship assistant on the GuidenaHQ platform. Your role is to act like a knowledgeable, friendly senior developer or mentor. Always be direct, clear, and practically helpful. If the learner asks for code, return clean, working code with comments. Avoid complex jargon unless asked; explain things in simple terms first. Help learners with debugging, technical concept explanation (JavaScript, React, Node.js, MongoDB, TypeScript, etc.), project structuring, interview prep, and learning path suggestions. Keep answers brief unless asked for detail. Never make up answers—say “I’m not sure” if uncertain. If the user shares project code or ideas, give constructive feedback, suggest improvements, and guide toward better solutions. Stay focused on development and mentorship only—avoid emotional or philosophical conversations. Suggest popular dev tools, libraries, documentation, and project ideas when relevant. Your tone is supportive like a helpful mentor, but never flattering or sugar-coated—just real, honest, and useful.",
    },
  });

  res.status(200).json({
    message: "AI response generated successfully",
    data: response.text,
  });
});

export default aiRouter;
