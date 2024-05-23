import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {Ollama} from "@langchain/community/llms/ollama";
import {PromptTemplate} from "@langchain/core/prompts";
import {OutputFixingParser, StructuredOutputParser} from "langchain/output_parsers";
import {createStuffDocumentsChain} from "./node_modules/langchain/dist/chains/combine_documents/index.js";
import {OutputParserException} from "@langchain/core/output_parsers";
import {z} from "zod";

const main = async function() {
    const loader = new PDFLoader("data/cooking.pdf", {
        splitPages: true,
    })
    const docs = await loader.load()
    const llm = new Ollama({model: "llama3:8b", temperature: 0})
    const prompt = PromptTemplate.fromTemplate("I need you to get all recipe information from the provided pdf file and format it in a way I can use later.Format it in bulgarian (the original language of the file) and you mustn't change any text nor to split it. If there is missing information leave it blank\n{context}\n{format_options}")
    const parser = StructuredOutputParser.fromZodSchema(z.object({
        analyzedInstructions: z.array(z.string()).describe("An array containing all instructions to prepare the recipe"),
        cookingMinutes: z.bigint().describe("The whole time needed to prepare the recipe"),
        title: z.string().describe("The title of the recipe"),
        ingredients: z.array(z.string()).describe("The ingredients of the recipe"),
        allergies: z.array(z.enum(["Seafood", "Dairy", "Eggs", "Sesame"])).describe("Allergies you think based on the ingredients the recipe will contain"),
        diets: z.array(z.enum(["Vegan", "Paleo", "Vegetarian", "Ketogenic", "Gluten-Free"])).describe("The diets you think the recipe will contain based on the ingredients"),
    }))

    const chain = await createStuffDocumentsChain({
        llm,
        prompt,
        outputParser: parser
    })

    try {
        const response = await chain.invoke({
            question: "What is the main subject of the website?",
            format_options: parser.getFormatInstructions(),
            context: docs
        })
        console.log(response)
    } catch(err) {
        if (err instanceof OutputParserException) {
            console.log("Attempting to fix output")
            const fixParser = OutputFixingParser.fromLLM(
                llm,
                parser
            )
            const output = await fixParser.parse(err.llmOutput)
            console.log(`Fixed output`)
            console.log(output)
          return
        }
        console.log(err)
    }
}

main()