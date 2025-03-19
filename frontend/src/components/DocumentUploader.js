import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button, Typography, Box, Alert, Grid, Slider, Tabs, Tab, CircularProgress} from '@mui/material';
import axios from 'axios';
import Papa from 'papaparse'; // Import PapaParse for CSV conversion
import './DocumentUploader.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/legacy/build/pdf.worker.min.mjs`;

const DocumentUploader = () => {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [scale, setScale] = useState(1.0); // Magnification scale
    const [uploadStatus, setUploadStatus] = useState('');
    const [tabValue, setTabValue] = useState(0); // State for tab selection
    const [keyValuePairs, setKeyValuePairs] = useState([]); // State for key-value pairs
    const [ocrloading, setOcrLoading] = useState(false); 
    const [keyvalueloading, setKeyValueLoading] = useState(false);// Loading state

    const handleFileChange = async (e) => {
        const uploadedFile = e.target.files[0];
        setError('');
        setUploadStatus('');
        if (uploadedFile  && (uploadedFile.type === 'application/pdf' || uploadedFile.type  === 'image/jpeg' ||
            uploadedFile.type === 'image/png'  )) {
            setFile(uploadedFile);
            setError('');
            setPageNumber(1);
            setExtractedText(''); // Reset extracted text on new file upload
            setKeyValuePairs([]); // Reset key-value pairs on new file upload
            setOcrLoading(true); 
            setKeyValueLoading(true);// Set loading to true
           
            await handleOCR(uploadedFile);
            await handleFormParse(uploadedFile); // Call OCR API immediately after file upload
        } else {
            setError('Please upload a valid PDF/image file.');
            setFile(null);
        }
    };

    const handleOCR = async (uploadedFile) => {
        const formData = new FormData();
        formData.append('image', uploadedFile); // Append the file to the form data

        try {
            const response = await axios.post('http://localhost:8080/api/ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            const text = response.data.text; // Adjust based on your API response structure
            setExtractedText(text);
            setUploadStatus('File uploaded successfully!');
        } catch (error) {
            console.error('Error extracting text:', error);
            setError('Failed to extract text. Please try again.');
            setUploadStatus('Error uploading file.');
        } finally {
            setOcrLoading(false); // Set loading to false after fetching
        }
    };

    const handleFormParse = async (uploadedFile) => {
        const formData = new FormData();
        formData.append('image', uploadedFile); // Append the file to the form data
        console.log("formparse file", uploadedFile);
        try {
            const response = await axios.post('http://localhost:8080/api/formparse', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            const text = response.data; // Adjust based on your API response structure
            setKeyValuePairs(text);
            setUploadStatus('File uploaded successfully!');
        } catch (error) {
            console.error('Error fetching key-value pairs:', error);
            setError('Failed to fetch key-value pairs. Please try again.');
            setUploadStatus('Error uploading file.');
        } finally {
            setKeyValueLoading(false) // Set loading to false after fetching
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const nextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleScaleChange = (event, newValue) => {
        setScale(newValue);
    };

    const downloadCSV = (data, e) => {
        console.log(data);
        const csv = Papa.unparse(data);

        // Create a blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Create a link element
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', file.name.replace('.', '_') + '_keyValuePairs.csv');
        link.style.visibility = 'hidden';

        // Append the link to the body
        document.body.appendChild(link);
        // Trigger the download
        link.click();
        // Remove the link from the document
        document.body.removeChild(link);
    };

    const downloadTXT = (data) => {
        const blob = new Blob([data], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'extracted_text.txt');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPPT = () => {
        // Implement PPT download logic here
        alert('PPT download functionality is not implemented yet.');
    };

    const handleTabChange = async (event, newValue) => {
        setTabValue(newValue);
    };

    // Component to display each line of extracted text
    const TextLine = ({ text }) => {
        return (
            <Box
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    padding: 1,
                    marginBottom: 1, // Small gap between components
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backgroundColor: '#f9f9f9', // Light background for better visibility
                }}
            >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {text}
                </Typography>
            </Box>
        );
    };

    // Component to display all extracted text
    const ExtractedTextDisplay = ({ extractedText }) => {
        const lines = extractedText.split('\n\n'); // Split text into lines

        return (
            <Box sx={{ maxHeight: '300px', overflowY: 'auto', padding: 1 }}>
                {ocrloading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    lines.map((line, index) => (
                        <TextLine key={index} text={line} />
                    ))
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Upload a Document
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <input
                    type="file"
                    // accept=".pdf"
                    onChange={handleFileChange}
                    style={{
                        margin: '0 10px',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '300px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Add shadow
                        backgroundColor: '#fff', // Consistent background color
                    }}
                />
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            {uploadStatus && <Alert severity="success">{uploadStatus}</Alert>}
            {file && (
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Box
                            sx={{
                                padding: 2,
                                backgroundColor: '#fff',
                                borderRadius: 2,
                                boxShadow: 3,
                                height: '80vh',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Navigation Buttons at the Top */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Button variant="contained" color="primary" onClick={prevPage} disabled={pageNumber <= 1}>
                                    Previous
                                </Button>

                                {/* Magnification Slider and Page Number Display */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Slider
                                        value={scale}
                                        min={0.5}
                                        max={2.0}
                                        step={0.1}
                                        onChange={handleScaleChange}
                                        valueLabelDisplay="auto"
                                        sx={{
                                            width: 100,
                                            color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
                                        }}
                                    />
                                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                        Page {pageNumber} of {numPages}
                                    </Typography>
                                </Box>

                                <Button variant="contained" color="primary" onClick={nextPage} disabled={pageNumber >= numPages}>
                                    Next
                                </Button>
                            </Box>

                            {/* PDF Document Display */}
                            <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {file.type === 'application/pdf'? (
                                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page pageNumber={pageNumber} scale={scale} />
                                </Document>
                                )
                            :  <img src={URL.createObjectURL(file)} alt="Displayed" style={{ maxWidth: '100%', height: 'auto' }} />
                            }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                            <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
                                <Tab label="Extracted Text" />
                                <Tab label="Key-Value Pairs" />
                                <Tab label="All Fields" />
                            </Tabs>

                            {/* Tab Content */}
                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Extracted Text
                                    </Typography>
                                    <ExtractedTextDisplay extractedText={extractedText} /> {/* Use the new component */}
                                </Box>
                            )}

                            {tabValue === 1 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Extracted Key-Value Pairs
                                    </Typography>
                                    <Box
                                        sx={{
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            border: '1px solid #ccc',
                                            borderRadius: 1,
                                            padding: 2,
                                            backgroundColor: '#f9f9f9', // Light background
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Add shadow
                                        }}
                                    >
                                        {keyvalueloading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <CircularProgress color="primary" />
                                            </Box>
                                        ) : (
                                            keyValuePairs.length > 0 ? (
                                                keyValuePairs.map((pair, index) => (
                                                    <TextLine key={index} text={`${pair.key}: ${pair.value}`} /> // Use TextLine for key-value pairs
                                                ))
                                            ) : (
                                                <Typography variant="body2">No key-value pairs extracted yet.</Typography>
                                            )
                                        )}
                                    </Box>
                                    <Button variant="contained" color="primary" onClick={(e) => { downloadCSV(keyValuePairs, e) }} sx={{ marginTop: 2 }}>
                                        Export to CSV
                                    </Button>
                                </Box>
                            )}

                            {tabValue === 2 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Extract All Fields
                                    </Typography>
                                    <Button variant="contained" color="primary" onClick={downloadCSV}>
                                        Extract All Fields
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default DocumentUploader;