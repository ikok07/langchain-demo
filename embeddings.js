import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const main = async function () {

    // Load documents from a web page
    const loader = new CheerioWebBaseLoader("https://docs.smith.langchain.com/user_guide")
    const docs = await loader.load()

    // Split the documents into smaller chunks
    const splitter = new RecursiveCharacterTextSplitter();
    const splittedDocs = await splitter.splitDocuments(docs)

   try {
       // Create embeddings
       const embeddings = new OllamaEmbeddings({
           model: "nomic-embed-text",
           baseUrl: "http://localhost:11434",
           maxConcurrency: 5
       })

       const embeddingResults = await embeddings.embedDocuments(splittedDocs)
       console.log(embeddingResults)
   } catch(err) {
        console.log(err)
   }
}

main()