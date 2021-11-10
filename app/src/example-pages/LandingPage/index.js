import React, { Fragment } from 'react';

import FormControl from '@material-ui/core/FormControl';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'reactn';

import Logo from '../../assets/images/logoLoblogin.gif';

import { buscaUsuarioSenha } from 'services/usuarios';

import Cookies from 'universal-cookie';

const colortheme = createMuiTheme({
  palette: {
    primary: { main: '#FF6600', contrastText: '#fff' },
    secondary: { main: '#FF6600', contrastText: '#fff' }
  }
});

const cookies = new Cookies();

export default function App() {
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      style={{ minHeight: '100vh' }}
      spacing={5}>
      <Grid item>
        <img
          className="app-sidebar-logo"
          alt="Lobtec"
          src={Logo}
          style={{ minHeight: '10vh', minWidth: '20vh' }}
        />
      </Grid>
      <Grid
        item
        style={{
          border: '2px solid #ff6600',
          minWidth: '50vh',
          borderRadius: '6px'
        }}>
        <Login />
      </Grid>
    </Grid>
  );
}

document.body.style = 'background: white;';

const Login = () => {
  const history = useHistory();
  const [loginInvalido, setLoginInvalido] = useState(false);
  const [loginInvalido2, setLoginInvalido2] = useState(false);
  const [errors, setErrors] = useState(false);
  const [errors2, setErrors2] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');
  const [helperErrors2, setHelperErrors2] = useState('');
  const [valor, setValor] = useState('');
  const [valor2, setValor2] = useState({
    password: '',
    showPassword: false
  });
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);

  const montaLink = () => {
    history.push(`/DashboardDefault`);
  };

  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const handleChange = prop => event => {
    setValor2({ ...valor2, [prop]: event.target.value });
    setErrors2(false);
    setHelperErrors2('');
    setLoginInvalido(false);
  };

  const handleClickShowPassword = () => {
    setValor2({
      ...valor2,
      showPassword: !valor2.showPassword
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const validacaoEmail = email => {
    let validateEmail = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(
      email
    );
    return validateEmail;
  };

  const handleCheckEmail = email => {
    if (validacaoEmail(email) === false || email.length > 254) {
      setErrors(true);
      setHelperErrors('*Este não é um e-mail válido');
      return true;
    } else {
      setErrors(false);
      setHelperErrors('');
      return false;
    }
  };

  const concluiAcao = (EmaUsuari, PwdUsuari1) => {
    const DADOS_CRIPTOGRAFAR = {
      algoritmo: 'aes256',
      segredo: 'chaves',
      tipo: 'hex'
    };
    const crypto = require('crypto');
    const cipher = crypto.createCipher(
      DADOS_CRIPTOGRAFAR.algoritmo,
      DADOS_CRIPTOGRAFAR.segredo
    );
    function criptografar(senha) {
      const cipher = crypto.createCipher(
        DADOS_CRIPTOGRAFAR.algoritmo,
        DADOS_CRIPTOGRAFAR.segredo
      );
      cipher.update(senha);
      return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
    }
    let passwordCipher = 0;
    passwordCipher = criptografar(PwdUsuari1);
    let cancel = false;
    const busca = async () => {
      try {
        if (valor !== '' && valor2 !== '' && validacaoEmail(valor) === true) {
          const busca = await buscaUsuarioSenha(EmaUsuari, passwordCipher);
          if (busca.registros[0] === undefined) {
            setLoginInvalido(true);
          } else {
            var MyDate = new Date();
            var MyDateString;
            MyDateString = MyDate.getFullYear()  + '-'
             + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-'
             + ('0' + MyDate.getDate()).slice(-2)
            if (busca.registros[0].DataBloqu < MyDateString) {              
              setLoginInvalido2(true);
            } else {
              cookies.set('token', 'true', {
                path: '/'
              });
              await buscaUsuarioSenha(EmaUsuari, passwordCipher).then(data => {
                cookies.set('CodigoDoUsuario', data.registros[0].CodUsuari, {
                  path: '/'
                });
                cookies.set('PerfilDoUsuario', data.registros[0].PerfilUsu, {
                  path: '/'
                });
              });
              montaLink();
            }
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/Login'
        });
      } finally {
        if (!cancel);
      }
    };
    busca();
    return () => {
      cancel = true;
    };
  };

  const submitForm = Form => {
    if (valor === '') {
      setErrors(true);
      setHelperErrors('*O preenchimento deste campo é obrigatório');
    }
    if (valor2.password === '') {
      setErrors2(true);
      setHelperErrors2(
        <FormHelperText>
          *O preenchimento deste campo é obrigatório
        </FormHelperText>
      );
    }
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{mensagem.titulo}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mensagem.conteudo}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Grid
        container
        direction="column"
        alignItems="flex-end"
        justify="center"
        color="secondary">
        <TextField
          variant="outlined"
          label="Digite seu usuário"
          fullWidth
          style={{ marginBottom: '2em' }}
          color="secondary"
          error={errors}
          helperText={helperErrors}
          size="small"
          onChange={e => {
            setValor(e.target.value);
            setLoginInvalido(false);
            setLoginInvalido2(false);
          }}
          onBlur={e => {
            handleCheckEmail(e.target.value);
          }}
        />
        <FormControl
          variant="outlined"
          size="small"
          justify="flex-start"
          fullWidth
          error={errors2}
          style={{ marginBottom: '2em' }}
          color="secondary">
          <InputLabel>{'Digite sua senha'}</InputLabel>
          <OutlinedInput
            label="Digite sua senha"
            type={valor2.showPassword ? 'text' : 'password'}
            value={valor2.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end">
                  {valor2.showPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors2 ? helperErrors2 : ''}
        </FormControl>
        <MuiThemeProvider theme={colortheme}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => {
              concluiAcao(valor, valor2.password);
              submitForm();
            }}>
            Entrar
          </Button>
        </MuiThemeProvider>
        {/* <Button
          className="m-2"
          color="secondary"
          style={{ paddingRight: '1px' }}>
          Esqueceu sua senha?
        </Button> */}
      </Grid>
      {loginInvalido === true ? (
        <div
          style={{
            color: 'red'
          }}>
          {' '}
          *Usuário ou senha inválida!
        </div>
      ) : (
        ''
      )}
      {loginInvalido2 === true ? (
        <div
          style={{
            color: 'red'
          }}>
          {' '}
          *Usuário bloqueado temporariamente
        </div>
      ) : (
        ''
      )}
    </Fragment>
  );
};

/* import React, { Fragment } from 'react';

import { Grid, Container, Button } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Fragment>
      
            <Container maxWidth="md" className="pb-5">
              <Grid container spacing={4}>
                <Grid
                  item
                  lg={10}
                  className="px-0 mx-auto d-flex align-items-center">
                  <div className="text-center">
                    <div className="px-4 px-sm-0 text-white mt-4">
                       <div>
                        <Button
                          to="/DashboardDefault"
                          component={Link}
                          size="large"
                          color="primary"
                          variant="contained"
                          className="m-2 py-3 px-5"
                          title="Acessar o sistema">
                          <span className="btn-wrapper--label">Acessar</span>
                          <span className="btn-wrapper--icon">
                            <FontAwesomeIcon icon={['fas', 'arrow-right']} />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Container>

    </Fragment>
  );
};

export default Login;
 */
