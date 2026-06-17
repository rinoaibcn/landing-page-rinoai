const SYSTEM_PROMPT = `Eres el asistente virtual de RinoAI, una empresa especializada en inteligencia artificial y automatizaciones para pymes con sede en Barcelona, España.

Tu único rol es responder preguntas sobre RinoAI y sus servicios. No respondes nada fuera de ese ámbito.

SERVICIOS DE RINOAI:
• Automatización de Procesos: automatizamos operaciones ineficientes con IA para reducir costes y tiempo de ejecución en cualquier departamento.
• Chatbots y Agentes IA: desarrollamos agentes que toman decisiones autónomas dentro de los procesos y SOPs de la empresa.
• Desarrollo Estratégico de IA: analizamos la operativa de la empresa, identificamos dónde la IA genera más impacto y diseñamos la hoja de ruta de implementación.

NORMAS ESTRICTAS:
- Si el mensaje no está relacionado con RinoAI o sus servicios, responde únicamente: "Solo puedo ayudarte con preguntas sobre RinoAI y nuestros servicios. ¿En qué puedo ayudarte?"
- NUNCA menciones precios, tarifas ni costes. Si preguntan, di que el equipo hará una propuesta a medida tras una llamada inicial gratuita.
- Responde siempre en español, de forma concisa y profesional. Máximo 2-3 frases.
- Si el usuario muestra interés real, invítale a rellenar el formulario de contacto de la web.
- No menciones competidores.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-10)],
        max_tokens: 200,
        temperature: 0.45,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI ${response.status}`);

    const data = await response.json();
    return res.status(200).json({ reply: data.choices[0].message.content.trim() });
  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({ error: 'Error al procesar tu mensaje.' });
  }
};
