import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Navbar from './components/Navbar';
import DocumentUploader from './components/DocumentUploader';
import Login from './components/Login';
// import './styles.css';

const App = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                <Routes>
                    <Route path="/upload" element={<DocumentUploader />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;