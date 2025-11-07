import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 👇 This is the route that your OpenAI Agent Builder will call
app.post("/call", async (req, res) => {
  try {
    const { name, arguments: args } = req.body;

    if (name === "deploy_to_github") {
      // Forward the request to your Edge Function
      const edgeResponse = await fetch("https://ai-agents-sqeh.vercel.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args)
      });

      const data = await edgeResponse.json();
      return res.json({ result: data });
    }

    return res.status(400).json({ error: "Unknown tool" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ MCP Server running on port ${PORT}`));
