import {v4 as uuidv4} from "uuid"
import {OllamaEmbeddings} from "@langchain/community/embeddings/ollama";
import {createRetrievalChain} from "langchain/chains/retrieval";
import {Ollama} from "@langchain/community/llms/ollama";
import {StructuredOutputParser} from "langchain/output_parsers";
import {PromptTemplate} from "@langchain/core/prompts";
import {createStuffDocumentsChain} from "./node_modules/langchain/dist/chains/combine_documents/index.js";
import {JSONLoader} from "langchain/document_loaders/fs/json";
import {Chroma} from "@langchain/community/vectorstores/chroma";
import weaviate from "weaviate-client";
import {WeaviateStore} from "@langchain/weaviate";
import {CheerioWebBaseLoader} from "@langchain/community/document_loaders/web/cheerio";

const embeddingsModel = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://localhost:11434",
})

const main = async function main() {

    const loader = new CheerioWebBaseLoader("https://python.langchain.com/v0.2/docs/tutorials/qa_chat_history/")
    const docs = await loader.load()

    const vectorStore = new Chroma(embeddingsModel, {
        url: "http://localhost:7000",
        numDimensions: 768,
        collectionName: "langchain"
    })
    await vectorStore.addDocuments(docs)

    const llm = await new Ollama({model: "mistral", temperature: 0})
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        answer: "answer to the question",
        accuracy: "how sure are you that this is the right answer"
    })
    const prompt = PromptTemplate.fromTemplate("You need to answer the users questions about the article i'm going to give you. You shouldn't add anything to the response that isn't formatted exactly how i'm going to tell you in the next lines.\n" +
        "Response format: {format_options}\n" +
        "Context: {context}\n" +
        "User question: {question}"
    )

    const combineDocsChain = await createStuffDocumentsChain({
        llm, prompt, outputParser: parser
    })
    const retrievalChain = await createRetrievalChain({
        retriever: vectorStore.asRetriever(),
        combineDocsChain
    })

    console.log(await retrievalChain.invoke({
        question: "What is the first approach from the article?",
        format_options: parser.getFormatInstructions()
    }))
}

async function importDataToVectorStore(store, docs) {
    console.log("Preparing to import data...")

    await store.addDocuments(docs)

    console.log("Successfully added docs to vector store!")
}

main()