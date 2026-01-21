
import { GoogleGenAI } from "@google/genai";

export const getSmartRecommendation = async (dishes: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Bạn là một chuyên gia ẩm thực. Người dùng đã chọn các món: ${dishes.join(', ')}. 
  Hãy đưa ra một lời khen ngắn gọn và gợi ý thêm một món đồ uống hoặc món phụ phù hợp từ văn hóa ẩm thực Việt Nam để bữa ăn thêm trọn vẹn. 
  Câu trả lời không quá 3 câu.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Chúc bạn ngon miệng với sự lựa chọn tuyệt vời này!";
  }
};
