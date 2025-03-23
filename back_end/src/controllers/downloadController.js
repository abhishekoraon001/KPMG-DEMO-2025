const fs = require('fs');
const path = require('path');

const downloadController = async(req,res)=>{
   
        const filename = req.params.filename;
        const filePath = path.join('C:/Users/ABHISHEK/Desktop/KPMG_DEMO/back_end/src/static', filename);
    
        // Check if the file exists
        console.log(filePath)
        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
                if (err) {
                    console.error(`Error sending file: ${err}`);
                    res.status(500).send('Error sending file');
                }
            });
        } else {
            res.status(404).send('File not found');
        }
    
};

module.exports = {downloadController};