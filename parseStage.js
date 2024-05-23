import {PromptTemplate} from "@langchain/core/prompts";

const main = async function () {
   const template = "Tell me a good meal for a light dinner near the fire in the forest. It should contain: {ingredients}"

   const promptTemplate = PromptTemplate.fromTemplate(template)

   const formattedTemplate = await promptTemplate.format({
      ingredients: ["beans", "sausages", "cheese"].join(", ")
   })
   console.log(formattedTemplate)
}

main()