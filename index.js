const express = require("express");
const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("Webhook hit:", req.body.queryResult.queryText);
  res.json({
    fulfillmentText: "✅ Your webhook is working!"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
