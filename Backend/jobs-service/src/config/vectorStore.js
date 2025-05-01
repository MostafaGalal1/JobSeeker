const embeddings = () => {
  const { CohereEmbeddings } = require("@langchain/cohere");
  new CohereEmbeddings({
    model: "embed-english-v3.0",
    apiKey: process.env.COHERE_API_KEY,
  });
};

const vectorStore = async (collectionName) => {
  const { QdrantVectorStore } = require("@langchain/qdrant");
  await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: collectionName,
    apiKey: process.env.QDRANT_API_KEY,
  });
};

module.exports = { vectorStore };
