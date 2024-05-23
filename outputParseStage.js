import {StructuredOutputParser} from "langchain/output_parsers";
import {RunnableSequence} from "@langchain/core/runnables";
import {PromptTemplate} from "@langchain/core/prompts";
import {Ollama} from "@langchain/community/llms/ollama";

const main = async function () {
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        answer: "answer to the user's question",
        source: "source used to answer the user's question"
    })

    const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(
            "Answer the users question as best as possible.\n{format_instructions}\n{question}"
        ),
        new Ollama({ temperature: 0, model: "mistral"}),
        parser
    ])

    console.log("Waiting for response...")

    const response = await chain.invoke({
        question: "What is the capital of Brazil?",
        format_instructions: parser.getFormatInstructions()
    })

    console.log(response)
}

const commaSeparatedOutputs = async function () {
    const template = "You are an ice cream specialist who answers user's questions about ice cream.\n{format_instructions}\n{question}"

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        answer: "The answer of the user's question",
        reason: "Why do you think this is the answer",
        accuracy: "How accurate do you think the answer is"
    })

    const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(template),
        new Ollama({ temperature: 0, model: "mistral"}),
        parser
    ])

    console.log(await chain.invoke({
        question: "What is the best ice cream flavour?",
        format_instructions: parser.getFormatInstructions()
    }))
}

commaSeparatedOutputs()