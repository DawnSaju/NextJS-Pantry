import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { pantryItems } = req.body;

    if (!pantryItems || !Array.isArray(pantryItems)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const jsonPantry = pantryItems.map((item: { name: string }) => item.name).join(", ");

    const prompt = `
      Give me the suggested recipe based on the pantries that I have on me: ${jsonPantry}
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: process.env.BASE || '' },
        { role: "user", content: prompt },
      ],
      model: process.env.MODEL || '',
    });

    const suggestion = completion.choices[0]?.message?.content || "No suggestion available";

    res.status(200).json({ suggestion });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
