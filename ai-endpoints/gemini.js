const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} = require("@google/generative-ai");
require("dotenv").config();

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GEMINI_API;
console.log("here");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({model: MODEL_NAME});

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 8096,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const generateContent = async (prompt, context, history = []) => {
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{text: context}],
      },
      {
        role: "model",
        parts: [{text: "Understood."}],
      },
      ...history,
    ],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  return response.text();

  // const result = await chat.sendMessageStream(prompt);
  // let response = "";
  // for await (const item of result.stream) {
  //   const block = item.candidates[0].content.parts[0].text;
  //   response += block;
  //   typeof cb === "function" && cb(block);
  // }
  // return response;
};

exports._generateContent = generateContent;
