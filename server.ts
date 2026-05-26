import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, boardState } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        // High-fidelity fallback simulated workspace analysis
        let reply = "";
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("summarize") || lowerMessage.includes("project") || lowerMessage.includes("progress")) {
          reply = `### Neural Engine v2.4 Project Summary
Project health is **Optimal (84%)**. Here is the breakdown:

- **Sprint Progress**: 12 tasks completed.
- **Bottleneck Identified**: Potential latency issue found in the **Quantization Module** (currently In Progress at 65% done, assigneed to *Sam*).
- **Suggested Actions**:
  1. Reassign the pending *Pruning Strategy Refinement* (AI Suggested) task to a Senior Engineer to coordinate with the quantization benchmark.
  2. Unblock the *Benchmarking Latency* task as soon as hardware dev kits arrive.

Would you like me to draft a pull request setup or run a mocked latency simulation?`;
        } else if (lowerMessage.includes("block") || lowerMessage.includes("bottleneck") || lowerMessage.includes("delay")) {
          reply = `### Blocker Analysis: Quantization Module
The primary bottleneck is the **Quantization Module Refactor**.
- **Status**: \`In Progress\` (65% complete).
- **Risk Level**: **Medium-High** (blocking mobile release roadmap).
- **Inference Latency Target**: Max 12ms per token.
- **Action plan**: We recommend assigning *Alex Rivera* to assist with the C++ conversion bindings to accelerate completion within the 4-day sprint target.`;
        } else if (lowerMessage.includes("suggest") || lowerMessage.includes("next")) {
          reply = `### Nexora AI Copilot Suggestions
Based on repository analysis and current task distributions:
1. **Optimize Sparsity Constraints**: The system suggests pruning the network weight tensor density to 45% using structured sparsity, which could decrease edge module latency by **~28%**.
2. **Review Design Contrast**: Ensure that glassmorphism background contrasts strictly follow WCAG AA guidelines (4.5:1 ratio) for dark-theme dashboards.

Would you like me to generate a template pruning script?`;
        } else {
          reply = `I have received your query: "${message}".

*Note: Since there is no active server-side GEMINI_API_KEY configured in the Workspace settings, I am running on the local Nexora Intelligent Sandbox context.*

**Neural Engine v2.4 Status Insight**:
- You have **${boardState?.tasksCount || 5} active tasks** spanning **research, engineering, design, and operations**.
- The main active block is **"${boardState?.activeTaskTitle || 'Refactor Quantization Module'}"** at **${boardState?.activeTaskProgress || '65%'} progress**.

How can I assist you further with this board? Use suggestions below to run pre-prompted analyses!`;
        }

        return res.json({ reply, localMode: true });
      }

      // Initialize real Google GenAI Client
      // const ai = new GoogleGenAI({
      //   apiKey: apiKey,
      //   httpOptions: {
      //     headers: {
      //       'User-Agent': 'aistudio-build',
      //     }
      //   }
      // });

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const prompt = `
You are the Nexora AI Agent, an intelligent project manager and expert machine learning/software assistant integrated directly into the Nexora AI workspace.
Your tone is technical, highly precise, concise, and professional. Avoid marketing fluff or self-praising sentences. Write in the style of an elite, helpful engineering manager who possesses strong knowledge in edge model optimization, system architecture, and UI/UX design.

The user is managing their project "Neural Engine v2.4" (Optimizing transformer layers for mobile edge computing).
Here is the real-time state of the Kanban task board:
- Total tasks: ${boardState?.tasksCount || 5}
- Tasks list:
${JSON.stringify(boardState?.tasks || [], null, 2)}

User message: "${message}"

Instructions:
1. Provide a direct, constructive engineering-focused answer in beautiful, clean markdown format. Do not use HTML tags in response.
2. If they ask to summarize project, analyze blockers, or offer suggestions, use the lists of tasks provided to extract specific, logical recommendations. Keep recommendations realistic, with concise bold headings and monospaced codes where applicable.
3. Be professional and objective.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API server-side error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
