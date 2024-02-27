import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function TopNavbar() {
  const isAuthenticated = false; // TODO: implement authentification logic

  return (
    <AppBar position="static" sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => console.log('Logo clicked')}
        >
          SocialMedia
        </Typography>
        
        {isAuthenticated ? (
          <React.Fragment>
            <Button color="inherit" onClick={() => console.log('Messages clicked')}>
              Messages
            </Button>
          </React.Fragment>
        ) : (
          <Button color="inherit" onClick={() => console.log('Login clicked')}>
            Info
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}