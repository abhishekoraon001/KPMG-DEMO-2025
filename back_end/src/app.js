const { json, urlencoded } = require("body-parser");
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const dotenv = 
require('dotenv');
const ocrRoutes = require('./routes/ocrRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;


const DOWNLOADS_DIR = path.join(__dirname, 'static');
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR);
}
// app.use(express.json());
app.use(cors());
app.use('/api/', ocrRoutes);
// app.use(json({ limit: '10mb' }))
// app.use(urlencoded({ limit: '10mb', extended: true }))
app.use('/downloads', express.static(DOWNLOADS_DIR))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});