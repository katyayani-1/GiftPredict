const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.post("/api/suggestions", async (req, res) => {
    const { occasion, relationship, interests, age, budget } = req.body;

    const prompt = `Suggest 3 creative gift ideas for a ${age}-year-old ${relationship} for their ${occasion}. Their interests include ${interests}, and the budget is ${budget}. Each suggestion should include:

1. Product Name
2. Short Description
3. A real buying link (like Amazon or Etsy). 

Format each suggestion like this:
1. Product Name
Description
URL`;

    try {
        const response = await axios.post(
            "https://api.cohere.ai/v1/chat",
            {
                model: "command-r",  // Chat model
                message: prompt,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const aiText = response.data.text || "No suggestions found.";
        console.log("AI Response Text:", aiText);  // Log AI response for debugging

        // Check if the AI response looks valid before parsing
        if (!aiText || aiText === "No suggestions found.") {
            return res.status(400).json({ error: "No valid suggestions found." });
        }

        // Parse the AI response into a usable format
        const suggestions = parseGiftSuggestions(aiText);

        // Check if suggestions are found
        if (suggestions.length > 0) {
            res.json(suggestions);  // Send the parsed suggestions back to the frontend
        } else {
            res.status(400).json({ error: "Failed to parse valid suggestions from AI response." });
        }
    } catch (error) {
        console.error("Error fetching AI suggestions:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to get AI suggestions." });
    }
});

// Helper: Parse AI text to JSON array
function parseGiftSuggestions(text) {
    const regex = /(\d+)\.\s*(.+?)\nDescription:\s*(.+?)\nURL:\s*(https?:\/\/[^\s]+)/g;
    const suggestions = [];
    let match;

    // Use regex to extract the product name, description, and URL
    while ((match = regex.exec(text)) !== null) {
        suggestions.push({
            name: match[2].trim(),
            description: match[3].trim(),
            url: match[4].trim(),
        });
    }

    console.log("Parsed Suggestions:", suggestions);  // Log parsed suggestions for debugging

    return suggestions;
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
