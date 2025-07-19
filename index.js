const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo", // or try "mistral/mixtral-8x7b"
      messages: [
        { role: "system", content: "You're a supportive mental wellness assistant." },
        { role: "user", content: userMessage }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.choices[0].message.content;

    res.json({ fulfillmentText: reply });
  } catch (err) {
    console.error("OpenRouter error:", err.message);
    res.json({ fulfillmentText: "😓 Sorry, I couldn’t reach the assistant." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Webhook (OpenRouter) running on port", PORT));
