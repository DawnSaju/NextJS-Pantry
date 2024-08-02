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
  apiKey: "ek-dbDNSrh43c1r8v5xrYSkeAHGZpml4YiqTtKRSPu4J1qRI7kK6i",
  baseURL: "https://api.electronhub.top/v1/",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("body", body);
    const { pantryItems } = body;

    if (!pantryItems || !Array.isArray(pantryItems)) {
      console.log("Invalid input data");
    }

    // const jsonPantry = pantryItems.map((item: { name: string }) => item.name).join(", ");

    // const prompt = `
    //   Give me the suggested recipe based on the pantries that I have on me: ${jsonPantry}
    // `;

    // const completion = await openai.chat.completions.create({
    //   messages: [
    //     { role: "system", content: 'You are an assistant developed by Dawn Saju. Aim is to provide ingredeients based on the pantryitems that the user provides. Including Introudction, Ingredients & Instructions. Your response should be html format should start with <h1 class="text-2xl font-bold mb-2">Suggested Recipe:</h1>. Use TailwindCSS. Format shoudl be the same: <div class="bg-gray-200 p-4 rounded-lg"> <h1 class="text-2xl font-bold mb-2">Suggested Recipe:</h1> <p class="mb-2">Based on the ingredients you have in your pantry (cake, Jackfruit, Banana, Ice Cream, Chocolate), here is a delicious recipe you can try:</p> <ul> <li class="mb-1">Jackfruit Banana Cake with Chocolate Ice Cream</li> <li class="mb-1">Ingredients:</li> <ul class="list-disc ml-4"> <li>1 cup diced Jackfruit</li> <li>2 ripe Bananas</li> <li>1 cup Chocolate Ice Cream</li> <li>1/2 cup Chocolate chips</li> <li>1 cup flour</li> <li>1/2 cup sugar</li> <li>1/4 cup butter</li> <li>1 tsp baking powder</li> <li>1/2 tsp salt</li> </ul> <li class="mt-2">Instructions:</li> <ol class="list-decimal ml-4"> <li>Preheat oven to 350°F.</li> <li>Mix flour, sugar, baking powder, and salt in a bowl.</li> <li>Mash bananas and mix with diced Jackfruit.</li> <li>Add dry ingredients to the banana-jackfruit mixture and mix well.</li> <li>Grease a cake pan and pour the batter into it.</li> <li>Bake for 30-35 minutes or until a toothpick inserted comes out clean.</li> <li>Serve with a scoop of chocolate ice cream and sprinkle chocolate chips on top.</li> </ol> </ul> </div>. Conscise and no vebrose.'},
    //     { role: "user", content: prompt },
    //   ],
    //   model: "gpt-3.5-turbo" || '',
    // });

    const suggestion = "It works yall"|| "No suggestion available";

    console.log(suggestion);

    return new Response(JSON.stringify({ suggestion: suggestion }));
  } catch (error) {
    return new Response(JSON.stringify({ suggestion: "Internal Server Error" }));
  }

}