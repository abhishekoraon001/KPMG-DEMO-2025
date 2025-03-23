const { exec } = require('child_process');
const BUCKET_NAME = 'idp-demo-2025';
const FOLDER_PATH = '/output-documents';

const awsController = async (req, res) => {
    const command = `aws s3 sync s3://${BUCKET_NAME}/${FOLDER_PATH} C:/Users/ABHISHEK/Desktop/KPMG_DEMO/back_end/src/static`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return res.status(500).send('Error downloading files');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error downloading files');
        }

        console.log(`stdout: ${stdout}`);
        res.send('Files downloaded successfully');
    });
};

module.exports = {awsController};