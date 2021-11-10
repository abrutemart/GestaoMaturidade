import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import {    
    Button    
  } from '@material-ui/core';

  import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

  const colortheme = createMuiTheme({
    palette: {
      primary: { main: '#FF6600', contrastText: '#fff' },
      secondary: { main: '#FF6600', contrastText: '#fff' }
    }
  });

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <MuiThemeProvider theme={colortheme}>
    <Button
    size="large" variant="contained" color="secondary"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
    </MuiThemeProvider>
  );
};

export default LoginButton;