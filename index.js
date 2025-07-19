const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post("/webhook", async (req, res) => {
  const message = req.body.queryResult.queryText;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });

    const reply = response.data.choices[0].message.content;

    res.json({
      fulfillmentText: reply
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      fulfillmentText: "😓 Sorry, I'm having trouble thinking right now."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook with ChatGPT running on port ${PORT}`));

