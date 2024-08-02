import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
  });

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
        { role: "system", content: process.env.NEXT_PUBLIC_BASE || '' },
        { role: "user", content: prompt },
      ],
      model: process.env.NEXT_PUBLIC_MODEL || '',
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
