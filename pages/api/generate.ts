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

        if(!prompt) return res.status(400).send({error: "Prompt is required: Please write a prompt before hitting the button"});

        const chat = [
            {
                role: "user",
                parts: [{
                    text: `Generate a complete, single-file HTML document for a website based on the following description: "${prompt}".

                    **Strict Output Requirements:**
                    1.  Provide ONLY the HTML code. Do NOT include any extra text, explanations, comments outside the HTML structure, or Markdown code block fences (like \`\`\`html or \`\`\`).
                    2.  The HTML must be properly formatted, with consistent indentation, newlines between elements, and a clean, readable structure. Every opening and closing tag should be in a new separate line. Donot generate single-line code or compacted code. This is super important to note.
                    3.  The website should be fully responsive and include a meta viewport tag in the <head>.
                    4.  For styling, include the Tailwind CSS CDN script in the <head>: \`<script src="https://cdn.tailwindcss.com"></script>\`.
                    5.  Integrate inline CSS within <style> tags in the <head> for any custom styles not easily achieved with Tailwind.
                    6.  Include any necessary JavaScript directly within <script> tags, preferably at the end of the <body> for performance.
                    7.  Use calm and minimalist themes (preferrable pastel colors) with proper background colors and all throughout the website.
                    8.  The overall design should be modern and appealing and have the same theme thoughout the site.`
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
        let code = ''
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            code = result.candidates[0].content.parts[0].text;

            if (code.startsWith('```html\n')) {
                code = code.slice('```html\n'.length);
            } else if (code.startsWith('```html')) {
                code = code.slice('```html'.length);
            }

            if (code.endsWith('\n```')) {
                code = code.slice(0, -'\n```'.length);
            } else if (code.endsWith('```')) {
                code = code.slice(0, -'```'.length);
            }
        }else{
            return res.status(500).json({ error: "Failed to generate code: Unexpected API response format." });
        }

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
        return res.status(500).json({ error: `Internal Server Error: ${errorMessage}` });
    }
}
