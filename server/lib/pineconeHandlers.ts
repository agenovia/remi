import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore, PineconeStoreParams } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

interface PineconeVectorStoreOptions {
  embeddings: OpenAIEmbeddings;
  params?: PineconeStoreParams;
  apiKey: string;
  indexName: string;
}

const getPineconeVectorStore = async ({
  embeddings,
  params,
  apiKey,
  indexName,
}: PineconeVectorStoreOptions) => {
  const client = new PineconeClient({ apiKey });
  const index = client.Index(indexName);
  const defaultConfig: PineconeStoreParams = {
    maxConcurrency: 5,
  };
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    ...defaultConfig,
    ...params,
    pineconeIndex: index,
  });
  return vectorStore;
};

export default getPineconeVectorStore;
