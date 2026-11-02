const axios = require('axios');

// Gemini API base
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=`;

const callGemini = async (prompt) => {
  const res = await axios.post(
    `${GEMINI_URL}${process.env.GEMINI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not process your request.';
};

// @desc   Chat with AI
// @route  POST /api/ai/chat
exports.chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const systemContext = `You are MediConnect AI, a professional healthcare assistant. 
    Provide helpful medical information but always remind users to consult a doctor for diagnosis.
    Be empathetic, professional, and concise.`;

    const prompt = `${systemContext}\n\nConversation History:\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}\n\nUser: ${message}\n\nAssistant:`;
    const reply = await callGemini(prompt);

    res.json({ success: true, data: { reply } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI service unavailable', data: { reply: 'I apologize, the AI service is currently unavailable. Please try again later.' } });
  }
};

// @desc   Symptom checker
// @route  POST /api/ai/symptom-check
exports.symptomChecker = async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;
    const prompt = `As a medical AI assistant, analyze these symptoms for a ${age}-year-old ${gender}:
    Symptoms: ${symptoms}
    
    Provide:
    1. Possible conditions (list 3-5)
    2. Severity level (Low/Medium/High)
    3. Recommended actions
    4. Which type of specialist to see
    5. Warning signs to watch for
    
    Format as JSON with keys: conditions, severity, actions, specialist, warnings.
    Always include a disclaimer to see a real doctor.`;

    const reply = await callGemini(prompt);

    // Try to parse JSON from response
    let parsed;
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: reply };
    } catch {
      parsed = { raw: reply };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Symptom check failed' });
  }
};

// @desc   Get doctor recommendation
// @route  POST /api/ai/recommend-doctor
exports.getDoctorRecommendation = async (req, res) => {
  try {
    const { symptoms, condition } = req.body;
    const prompt = `Based on: symptoms: "${symptoms}", condition: "${condition}"
    What type of medical specialist should this patient see? 
    Return JSON: { specialist: string, department: string, reason: string, urgency: "low"|"medium"|"high" }`;

    const reply = await callGemini(prompt);
    let parsed;
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: reply };
    } catch {
      parsed = { raw: reply };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Recommendation failed' });
  }
};

// @desc   Get daily health tips
// @route  GET /api/ai/health-tips
exports.getHealthTips = async (req, res) => {
  try {
    const prompt = `Generate 5 practical daily health tips for today. 
    Return as JSON array: [{ tip: string, category: string, icon: string }]
    Categories: Nutrition, Exercise, Mental Health, Sleep, Hydration`;

    const reply = await callGemini(prompt);
    let tips;
    try {
      const jsonMatch = reply.match(/\[[\s\S]*\]/);
      tips = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      tips = [];
    }

    res.json({ success: true, data: tips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Health tips unavailable' });
  }
};
