import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const shoppingAssistant = async (
  products,
  question
) => {

  const productData = products.map((p) => ({
    name: p.productName,
    price: p.productPrice,
    category: p.category,
    brand: p.brand,
  }));

 const prompt = `
You are an AI shopping assistant.

Available Products:
${JSON.stringify(productData, null, 2)}

User Question:
${question}

Rules:
- Recommend products only from the provided catalog.
- If no product matches the user's requirements, clearly say so.
- If the user asks to compare products, compare:
  • Price
  • Brand
  • Category
  • Description
  • Value for money
- If a product does not exist in the catalog, say so.
- Keep answers concise (under 100 words).
- End recommendations with a short conclusion.
`;

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return completion.choices[0].message.content;
};

