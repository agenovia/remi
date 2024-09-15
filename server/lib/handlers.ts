import type { Document } from "@langchain/core/documents";
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
  return new PineconeHandler(vectorStore);
};

export class PineconeHandler {
  vectorStore: PineconeStore;

  constructor(vectorStore: PineconeStore) {
    this.vectorStore = vectorStore;
  }

  insert = (content: string, tags?: {}) => {
    const metadata = {
      ...tags,
      timestamp: Date.now(),
    };
    const doc: Document = {
      pageContent: content,
      metadata,
    };

    (async () => {
      this.vectorStore.addDocuments([doc]);
    })();
  };

  retrieve = async (query: string) => {
    const retriever = this.vectorStore.asRetriever();
    return await retriever.invoke(query);
  };
}

export default getPineconeVectorStore;
