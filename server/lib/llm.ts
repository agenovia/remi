import { ChatOpenAI } from "@langchain/openai";

const createOpenAILLM = (apiKey: string) => {
  const llm = new ChatOpenAI({
    apiKey,
    model: "gpt-4o-mini",
    temperature: 0,
  });
  return llm;
};

export default createOpenAILLM;
