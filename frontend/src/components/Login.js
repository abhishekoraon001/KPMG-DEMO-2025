import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const Login = () => {
    return (
        <Box sx={{ padding: 3, maxWidth: 400, margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form>
                <TextField label="Username" variant="outlined" fullWidth margin="normal" required />
                <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" required />
                <Button variant="contained" color="primary" fullWidth type="submit">
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default Login;