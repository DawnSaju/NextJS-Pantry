import { OpenAI } from 'openai';

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });
  if (req.method === 'POST') {
    try {
      const { pantryItems } = await req.json();
      const jsonPantry = pantryItems.map((item: { name: string }) => item.name).join(", ");
      const prompt = `Give me the suggested recipe based on the pantries that I have on me: ${jsonPantry}`;
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: process.env.BASE || '' },
          { role: "user", content: prompt },
        ],
        model: process.env.MODEL || '',
      });
      const suggestion = completion.choices[0]?.message?.content || "No suggestion available";
      return new Response(JSON.stringify({ suggestion }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error in API route:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } else {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }
}
