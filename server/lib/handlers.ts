import type { Document } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import {
  PineconeStore,
  PineconeStoreParams,
  PineconeTranslator,
} from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import type { AttributeInfo } from "langchain/chains/query_constructor";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import createOpenAILLM from "./llm";

interface PineconeVectorStoreOptions {
  embeddings: OpenAIEmbeddings;
  params?: PineconeStoreParams;
  apiKey: string;
  indexName: string;
}

const getPineconeHandler = async ({
  embeddings,
  params,
  apiKey,
  indexName,
}: PineconeVectorStoreOptions) => {
  // base client
  const client = new PineconeClient({ apiKey });
  // index is a logical collection consisting of namespaces
  const index = client.Index(indexName);

  const defaultConfig: PineconeStoreParams = {
    maxConcurrency: 5,
  };
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    ...defaultConfig,
    ...params,
    pineconeIndex: index,
  });
  const llm = createOpenAILLM(apiKey);
  return new PineconeHandler(vectorStore, llm);
};

export class PineconeHandler {
  vectorStore: PineconeStore;
  retriever: SelfQueryRetriever<PineconeStore>;

  constructor(vectorStore: PineconeStore, llm: ChatOpenAI) {
    // TODO(agenovia) move this out of here
    this.vectorStore = vectorStore;
    const attributeInfo: AttributeInfo[] = [
      {
        name: "timestamp",
        description:
          "A timestamp, in milliseconds, when the note was last modified",
        type: "number",
      },
    ];
    this.retriever = SelfQueryRetriever.fromLLM({
      llm: llm,
      vectorStore: vectorStore,
      documentContents: "User-submitted notes",
      attributeInfo: attributeInfo,
      structuredQueryTranslator: new PineconeTranslator(),
    });
  }

  insert = (content: string, tags?: {}) => {
    const metadata = {
      ...tags,
      // when we retrieve via metadata, we need to convert
      // and serialize the timestamp
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

  private retrieveWithScoreThreshold = async (
    query: string,
    threshold: number = 0.25
  ) => {
    const retriever = ScoreThresholdRetriever.fromVectorStore(
      this.vectorStore,
      { minSimilarityScore: threshold, searchType: "similarity" }
    );
    return await retriever.invoke(query);
  };

  retrieve = async (query?: string, filter?: {}) => {
    const retriever = this.vectorStore.asRetriever({
      filter: filter,
      k: 1000,
    });

    if (query) {
      return await this.retrieveWithScoreThreshold(query);
    } else {
      return await retriever.invoke("");
    }
  };
}

export default getPineconeHandler;
