const { json, urlencoded } = require("body-parser");
const express = require('express');
const cors = require('cors');

const dotenv = 
require('dotenv');
const ocrRoutes = require('./routes/ocrRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// app.use(express.json());
app.use(cors());
app.use('/api/', ocrRoutes);
// app.use(json({ limit: '10mb' }))
// app.use(urlencoded({ limit: '10mb', extended: true }))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});