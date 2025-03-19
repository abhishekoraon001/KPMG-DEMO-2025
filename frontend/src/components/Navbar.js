import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from './KPMG-Logo-500x281.webp';


const Navbar = ({ toggleTheme, isDarkMode }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                   
                    <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ maxHeight: '50px', marginRight: '16px' }} // Adjust size and margin as needed
                />
                </Typography>
                <Button color="inherit" onClick={toggleTheme}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <Button color="inherit" component={Link} to="/">
                    Login
                </Button>
                <Button color="inherit" component={Link} to="/upload">
                    Upload Document
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;