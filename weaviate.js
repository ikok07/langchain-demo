import weaviate from "weaviate-client";

const weaviateClient = weaviate.client({
    scheme: "http",
    host: "localhost:7070",
})

const createSample = async function () {
    const result = await weaviateClient.data
        .creator()
        .withClassName("Test")
        .withProperties({
            testProperty: "Test"
        })
        .do()
    console.log(result)
}

const main = async function () {
    const result = await weaviateClient.graphql
        .get()
        .withClassName("Test")
        .withNearVector({
            vector: [0.1, 0.2, 0.3, 0.4]
        })
        .withFields("testProperty")
        .do()
    console.log(result.data)
}

main()