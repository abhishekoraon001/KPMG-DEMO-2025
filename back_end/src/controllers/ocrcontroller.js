const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs').promises;
require('dotenv').config();

// Instantiate a client
const client = new DocumentProcessorServiceClient({
    keyFilename: "C:/Users/ABHISHEK/Desktop/Annexures/fresh-rain-451706-e2-8222dea2b911.json"
  });

const ocrController = async (req, res) => {
    if (!req.file) {
        console.log(req.body,"ANS");
        return res.status(400).send('No file uploaded.');
    }

    // TODO: Uncomment and set these variables
    const projectId ="fresh-rain-451706-e2";
    const location = process.env.LOCATION; // Format is 'us' or 'eu'
    const processorId =process.env.PROCESSOR_ID;
    console.log(process.env.PROCESSOR_ID) // Create processor in Cloud Console

    const name = `projects/fresh-rain-451706-e2/locations/us/processors/4f6f77dba8fa6a1c`;

    // Convert the uploaded file buffer to base64
    const encodedImage = Buffer.from(req.file.buffer).toString('base64');

    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType: req.file.mimetype, // Use the correct mime type
        },
    };

    try {
        // Recognizes text entities in the document
        const [result] = await client.processDocument(request);
        const { document } = result;

        // Get all of the document text as one big string
        const { text } = document;

        // Extract paragraphs from the text field
        const getText = textAnchor => {
            if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
                return '';
            }

            const startIndex = textAnchor.textSegments[0].startIndex || 0;
            const endIndex = textAnchor.textSegments[0].endIndex;

            return text.substring(startIndex, endIndex);
        };

        // Read the text recognition output from the processor
        console.log('The document contains the following paragraphs:');
        const [page1] = document.pages;
        const { paragraphs } = page1;

        const extractedText = paragraphs.map(paragraph => getText(paragraph.layout.textAnchor)).join('\n');

        res.json({ text: extractedText });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the image.');
    }
};

module.exports = { ocrController };