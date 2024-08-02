// import { NextApiRequest, NextApiResponse } from 'next';
// import { OpenAI } from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: process.env.OPENAI_BASE_URL,
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { pantryItems } = req.body;

//       if (!pantryItems || !Array.isArray(pantryItems)) {
//         return res.status(400).json({ error: 'Invalid input data' });
//       }

//       const jsonPantry = pantryItems.map((item: { name: string }) => item.name).join(", ");

//       const prompt = `
//         Give me the suggested recipe based on the pantries that I have on me: ${jsonPantry}
//       `;

//       const completion = await openai.chat.completions.create({
//         messages: [
//           { role: "system", content: process.env.BASE || '' },
//           { role: "user", content: prompt },
//         ],
//         model: process.env.MODEL || '',
//       });

//       const suggestion = completion.choices[0]?.message?.content || "No suggestion available";

//       res.status(200).json({ suggestion });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };


import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {isVision} = body;
    
    if (isVision === true) {
      const { imageUrl } = body;
      if (!imageUrl) {
        return new Response(JSON.stringify({ error: "Image URL is required for vision analysis" }), { status: 400 });
      }

      const prompt = `Analyze the image and give me the exact name of the pantry item in this image: ${imageUrl}`;

      const response = await openai.chat.completions.create({
        model: process.env.VISION_MODEL,
        messages: [
          {"role": "user", "content": "Can you tell me more about yourself?"}
        ],
      });

      const visionresult = response.choices || "No vision result available";
      console.log("visionResult", visionresult);

      return new Response(JSON.stringify({ visionResult: visionresult }));
    } else {
      const { pantryItems } = body;
      if (!pantryItems || !Array.isArray(pantryItems)) {
        alert("Invalid input data");
      }

      const jsonPantry = pantryItems.map((item: { name: string }) => item.name).join(", ");

      const prompt = `
        Give me the suggested recipe based on the pantries that I have on me: ${jsonPantry}
      `;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: process.env.BASE},
          { role: "user", content: prompt },
        ],
        model: process.env.MODEL|| '',
      });

      const suggestion = completion.choices[0]?.message?.content || "No suggestion available";

      console.log(suggestion);
      return new Response(JSON.stringify({ suggestion: suggestion }));
    }
  } catch (error) {
    return new Response(JSON.stringify({ suggestion: error }));
  }

}
