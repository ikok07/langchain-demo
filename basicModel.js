import { ChatOllama } from "@langchain/community/chat_models/ollama";
import {ChatPromptTemplate} from "@langchain/core/prompts";



async function main() {
    const model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "mistral"
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a world class technical documentation writer."],
        ["user", "{input}"]
    ])

    const outputParser = new StringOutputParser()

    const chain = prompt.pipe(model)

    const data = await chain.invoke({
        input: "What is langsmith?"
    })
    console.log(data)
}

main()