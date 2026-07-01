// routes/substitution.js
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/ask', async (req, res) => {
  try {
    const { recipe, question, conversationHistory } = req.body || {};

    if (!recipe || !question) {
      return res.status(400).json({ error: 'Recipe and question are required' });
    }

    const systemPrompt = `You are a smart cooking substitution assistant for CookSmart.
You help users substitute ingredients while preserving taste and texture, and adjust quantities accordingly.

When the user asks something like "I don't have buttermilk, what can I use instead?" or "make this recipe vegan":
1. Identify which ingredients need to change
2. Suggest the best substitution(s)
3. Adjust quantities if the substitute has different potency/density
4. Briefly explain WHY (taste/texture impact) in 1-2 sentences
5. Return the FULL updated recipe (ingredients as an array of strings like the original format, and instructions/steps) with the substitution applied

The recipe's "ingredients" field is an array of plain strings (e.g. "1 cup buttermilk"), not objects. Keep that same string format in your updated ingredients.

Respond ONLY in this exact JSON format, nothing else, no markdown fences:
{
  "explanation": "short friendly explanation of the substitution and any taste/texture notes",
  "changesSummary": ["Buttermilk → 1 cup milk + 1 tbsp lemon juice"],
  "updatedRecipe": {
    "ingredients": ["1 cup milk + 1 tbsp lemon juice", "..."],
    "instructions": "full updated instructions text or steps"
  }
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Current recipe: ${JSON.stringify({
          name: recipe.name || recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        })}` },
      ...(Array.isArray(conversationHistory) ? conversationHistory : []),
      { role: 'user', content: question }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      response_format: { type: 'json_object' }
    });

    const raw = completion.choices[0].message.content;
    const aiResponse = JSON.parse(raw);

    res.json({ success: true, ...aiResponse });

  } catch (err) {
    console.error('Substitution bot error:', err);
    res.status(500).json({ error: 'Failed to process substitution request' });
  }
});

module.exports = router;