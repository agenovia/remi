import { OpenAIEmbeddings } from "@langchain/openai";

interface OpenAIEmbeddingOptions {
  openAIApiKey: string;
  model?: string;
}

const createOpenAIEmbeddings = ({
  openAIApiKey,
  model,
}: OpenAIEmbeddingOptions): OpenAIEmbeddings => {
  return new OpenAIEmbeddings({
    openAIApiKey,
    model: model ?? "text-embedding-3-small",
  });
};

export default createOpenAIEmbeddings;
