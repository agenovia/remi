import { Index, Pinecone } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";

abstract class DatabaseHandler {
  abstract upsert(content: string, metadata?: Record<string, string>): void;
  abstract query(query: string, metadata?: Record<string, string>): string;
}

export class PineconeHandler extends DatabaseHandler {
  private apiKey: string;
  private indexName: string;
  private index: Index;
  private client: Pinecone;

  constructor(apiKey: string, indexName: string) {
    super();
    this.apiKey = apiKey;
    this.indexName = indexName;
    this.client = this.getClient();
    this.index = this.getIndex();
  }

  private getClient = () => {
    return new Pinecone({
      apiKey: this.apiKey,
    });
  };

  private getIndex = () => {
    return this.client.Index(this.indexName);
  };

  // this creates an embedding using our project
  // by calling our index name
  private getEmbedding = async (passage: string) => {
    // TODO(agenovia): we need to tokenize
    const embedding = await this.client.inference.embed(
      this.indexName,
      [passage],
      {
        inputType: "passage",
      }
    );
    return embedding;
  };

  // we do an index upsert, but we call inference using
  // the client object
  upsert = (content: string, metadata?: Record<string, string>) => {
    (async () => {
      const id = uuidv4();
      const embedding = await this.getEmbedding(content);
      const data = {
        id: id,
        values: embedding[0].values ?? [],
        metadata: metadata,
      };
      await this.index.upsert([data]);
    })();
  };

  query = (query: string, metadata: Record<string, string>) => {
    async () => {
      const embedding = await this.getEmbedding(query);
    };
    return query;
  };
}
