const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/webhook", async (req, res) => {
  const message = req.body.queryResult.queryText;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });

    const reply = chat.choices[0].message.content;

    res.json({
      fulfillmentText: reply
    });
  } catch (error) {
    console.error("GPT error:", error.message);
    res.json({
      fulfillmentText: "😓 Sorry, I couldn’t connect to ChatGPT."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ GPT Webhook running on port", PORT));
