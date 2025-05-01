const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { DocxLoader } = require("@langchain/community/document_loaders/fs/docx");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { cloudStorage } = require("../config/cloudStorage");
const { vectorStore } = require("../config/vectorStore");

const storage = cloudStorage();

const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.auth.userId;
  if (!userId) {
    return res.status(403).json({ message: "Unauthorized: Missing user ID" });
  }

  const destFileName = `${userId}.pdf`;
  const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);
  const file = bucket.file(destFileName);

  try {
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    const docs = await loadText(req.file);
    const splits = await splitText(docs, userId);
    await storeEmbeddings(splits);

    res.status(201).json({ message: "Upload successful" });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const loadText = async (file) => {
  let loader;
  const fileType = file.mimetype;
  const fileBuffer = file.buffer;

  if (fileType === "application/pdf") {
    loader = new PDFLoader(new Blob([fileBuffer]));
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    loader = new DocxLoader(new Blob([fileBuffer]));
  } else {
    throw new Error("Unsupported file format. Use PDF or DOCX.");
  }

  const docs = await loader.load();
  return docs;
};

const splitText = async (docs) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splits = await textSplitter.splitDocuments(docs);
  return splits;
};

const storeEmbeddings = async (splits, userId) => {
  const store = await vectorStore("resume_embeddings");
  splits.forEach((doc) => {
    doc.metadata = { user_id: userId };
  });

  store.delete({ filter: { user_id: userId } });
  store.addDocuments(splits);
};

module.exports = {
  uploadResume,
};
