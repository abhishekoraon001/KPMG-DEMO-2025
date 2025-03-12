const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1; // Use v1
const fs = require('fs').promises;

const client = new DocumentProcessorServiceClient({
    keyFilename: "C:/Users/ABHISHEK/Desktop/Annexures/fresh-rain-451706-e2-8222dea2b911.json"
});

function extractFormFields(data) {
  const result = [];
  const mapdata = data[0].document.pages;
  console.log(data[0].document.pages[0],"functiondata")
  
  // Safely navigate through the nested structure
  mapdata?.map(elem=>{
    elem.formFields.map(key1=>{
      const keye = (key1?.fieldName?.textAnchor?.content.replace(':', '').replace(/[\r\n]+/g,''))?key1?.fieldName?.textAnchor?.content.replace(':', ''):"";
      const valuei = (key1?.fieldValue?.textAnchor?.content)?(key1?.fieldValue?.textAnchor?.content):"";
      result.push({
        key: keye ? keye.replace(/[\r\n]+/g,''):"",
        value:valuei.replace(/[\r\n]+/g,'')? valuei:""
      })
    })
   });

  
  console.log(result,"result")
  return result;
}

const formparserController = async (req, res) => {
    if (!req.file) {
        console.log(req.body, "ANS");
        return res.status(400).send('No file uploaded.');
    }

    const name = `projects/fresh-rain-451706-e2/locations/us/processors/2f732c09cd47c77e`; // Ensure this is correct

    // Convert the uploaded file buffer to base64
    const encodedImage = Buffer.from(req.file.buffer).toString('base64');

    const request = {
        name: name,
        rawDocument: {
            content: encodedImage,
            mimeType: req.file.mimetype,
        },
    };

    try {
        // Process the document
        const dtata = await client.processDocument(request);
        // const keyValuePairs = extractKeyValuePairs(result);

        // const extractedData = extractKeyValuePairs(dtata);

      
        res.json(extractFormFields(dtata));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the document.');
    }
};





module.exports = { formparserController };