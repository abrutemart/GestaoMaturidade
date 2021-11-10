import { TextField } from '@material-ui/core';
import React from 'react';
import{Grid, TextField, Button} from "@material-ui/core"

export default function App() {
  return (<div>
      <Login />
  </div>);
}

const Login = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center">
          <TextField variatn ='outlined' label="Email" fullWidth/>
          <TextField variatn ='outlined' label="Password" fullWidth/>
          <Button size='large' variant='contained' color='primary'/>
      </Grid>
  );
};
