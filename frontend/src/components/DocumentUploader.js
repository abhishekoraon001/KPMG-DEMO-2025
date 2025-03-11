import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Typography, Box, Alert, Grid, Slider, Tabs, Tab, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import Papa from 'papaparse'; // Import PapaParse for CSV conversion
import './DocumentUploader.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

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
    const [canDownload,setCanDownload] = useState(false);

    const handleFileChange = async (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile && uploadedFile.type === 'application/pdf') {
            setFile(uploadedFile);
            setError('');
            setPageNumber(1);
            setExtractedText(''); // Reset extracted text on new file upload
            setKeyValuePairs([]); // Reset key-value pairs on new file upload
            await handleOCR(uploadedFile); // Call OCR API immediately after file upload
        } else {
            setError('Please upload a valid PDF file.');
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
            setCanDownload(true);
        } catch (error) {
            console.error('Error fetching key-value pairs:', error);
            setError('Failed to fetch key-value pairs. Please try again.');
            setUploadStatus('Error uploading file.');
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

    const downloadCSV = (data) => {
        console.log(data,"csvdata")
        const csv = Papa.unparse(data.map(line => {
            const [key, value] = line.split(':');
            return { key: key.trim(), value: value ? value.trim() : '' };
        }));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'extracted_text.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
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
        setCanDownload(false);
        if (newValue === 1) { // If the Key-Value Pairs tab is selected
            await handleFormParse(file);
        }
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Upload a Document
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <input
                    type="file"
                    accept=".pdf"
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
                                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page pageNumber={pageNumber} scale={scale} />
                                </Document>
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
                                    <Box
                                        sx={{
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            border: '1px solid #ccc',
                                            borderRadius: 1,
                                            padding: 2,
                                            backgroundColor: '#e9ecef', // Light green background
                                            color: '#343a40', // Dark green text
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Add shadow
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                                            {extractedText || 'No text extracted yet.'}
                                        </Typography>
                                    </Box>
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
                                            backgroundColor: '#e9ecef', // Light green background
                                            color: '#343a40', // Dark green text
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Add shadow
                                        }}
                                    >
                                        {keyValuePairs.length > 0 ? (
                                            <List>
                                                {keyValuePairs.map((pair, index) => (
                                                    <ListItem key={index} sx={{ border: '1px solid #ccc', borderRadius: 1, marginBottom: 1, boxShadow: 1 }}>
                                                        <ListItemText primary={`${pair.key}: ${pair.value}`} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="body2">No key-value pairs extracted yet.</Typography>
                                        )}
                                    </Box>
                                    <Button variant="contained" color="primary" onClick={downloadCSV} sx={{ marginTop: 2 }}>
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