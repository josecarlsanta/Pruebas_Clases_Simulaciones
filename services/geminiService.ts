import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const getExplanation = async (voltage: number, resistance: number): Promise<string> => {
  if (!API_KEY) {
    return "🔑 El botón de IA necesita una clave de API configurada. El simulador funciona perfectamente sin ella.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const current = (voltage / resistance).toFixed(2);

    const prompt = `
      Imagina que eres un profesor de física divertido y amigable para niños.
      Explica qué está pasando en un circuito eléctrico con estos valores:
      - Voltaje (Fuerza de empuje): ${voltage} Volts
      - Resistencia (Oposición/Estrechamiento): ${resistance} Ohms
      - Corriente Resultante (Velocidad de flujo): ${current} Amperes.

      Usa una analogía divertida (como agua en una tubería, coches en una autopista, o hormigas cargando comida).
      Explica cómo el voltaje empuja y la resistencia frena.
      Mantén la respuesta breve (máximo 3 oraciones) y muy entusiasta.
      Responde en Español.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "¡Los electrones están fluyendo!";
  } catch (error) {
    console.error("Error fetching explanation:", error);
    return "¡Ups! El profesor Electrón está tomando una siesta. (Error de conexión)";
  }
};
