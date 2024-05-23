import {ChromaClient} from "chromadb";
import {OllamaEmbeddings} from "@langchain/community/embeddings/ollama";
import {EmbeddingFn} from "./utils/EmbeddingFunctions.js";

const main = async function () {
    const store = new ChromaClient({path: "http://localhost:7000"})
    const coll = await store.getOrCreateCollection({
        name: "meal-bg-tiny",
        embeddingFunction: new EmbeddingFn()
    })

    const result = await coll.query({queryTexts: "Овчарската салата", include: ["title"]})
    console.log(result)
}
main()