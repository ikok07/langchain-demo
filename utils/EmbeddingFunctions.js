import {OllamaEmbeddings} from "@langchain/community/embeddings/ollama";

export class EmbeddingFn  {
    constructor() {
    }

    async generate(texts)  {
        const embeddings = new OllamaEmbeddings({
            model: "nomic-embed-text",
            baseUrl: "http://localhost:11434",
        })
        return embeddings.embedDocuments(texts)
    }
}