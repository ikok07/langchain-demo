import { Ollama } from "@langchain/community/llms/ollama";
import {ChatOllama} from "@langchain/community/chat_models/ollama";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {CommaSeparatedListOutputParser} from "langchain/output_parsers";


async function main() {
    const llm = new Ollama({
        model: "mistral"
    })
    const chatModel = new ChatOllama({
        model: "mistral"
    })

    const template =
        "You are a helpful assistant that translates {input_language} to {output_language}.";
    const humanTemplate = "{text}";

    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", template],
        ["user", humanTemplate]
    ])

    const parser = new CommaSeparatedListOutputParser()

    const chain = chatPrompt.pipe(chatModel).pipe(parser)

    console.log(await chain.invoke({
        input_language: "English",
        output_language: "Bulgarian",
        text: "I love programming"
    }))
}
main()