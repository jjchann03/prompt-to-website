import { VercelRequest , VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("Serverless function execution started")
    try {
    // CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "*");

        if (req.method === "OPTIONS") return res.status(200).end();

        if(!apiKey) return res.status(500).json({error: "Server configuration error: Gemini API key not found."})

        const { prompt } = req.body;

        if(!prompt) return res.status(400).send({error: "Prompt is required in the request body."});
        console.log("Prompt received:", prompt);

        const chat = [
            {
                role: "user",
                parts: [{
                    text: `Generate a complete, single-file HTML document with inline CSS and JavaScript for a website based on the following description: "${prompt}". Ensure it's fully responsive, includes a meta viewport tag, and looks modern and appealing. Use Tailwind CSS for styling by including '<script src="https://cdn.tailwindcss.com"></script>' in the <head>. Do not include any external image URLs; use placeholder images (e.g., from placehold.co) or inline SVG if needed. Provide only the HTML code, no extra text, no markdown backticks outside the HTML itself.`
                }]
            }
        ]

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({contents: chat}) // Sends the chat to gemini API
        })

        const result = await geminiResponse.json();
        console.log(result);
        const code = result.candidates[0].content.parts[0].text;

        res.status(200).json({ code });
    } catch (err: unknown) { // Change 'any' to 'unknown'
        let errorMessage = "An unknown error occurred.";
        if (err instanceof Error) {
            // If 'err' is an instance of the built-in Error class
            errorMessage = err.message;
        } else if (typeof err === 'string') {
            // If 'err' is a string
            errorMessage = err;
        }
        // You could add more checks here for other potential error types

        console.error("❌ Function crashed:", errorMessage || err);
        return res.status(500).json({ error: "Internal Server Error", detail: errorMessage });
    }
}
