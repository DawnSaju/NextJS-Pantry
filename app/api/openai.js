import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { pantryItems } = req.body;

      const jsonPantry = pantryItems.map(item => item.name).join(", ");

      const prompt = `
        Give me the suggested recipe based on the pantries that I have on me: ${jsonPantry}
      `;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: process.env.NEXT_PUBLIC_BASE },
          { role: "user", content: prompt },
        ],
        model: process.env.NEXT_PUBLIC_MODEL,
      });

      const suggestion = completion.choices[0]?.message?.content || "No suggestion available";

      res.status(200).json({ suggestion });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
