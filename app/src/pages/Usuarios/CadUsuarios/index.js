import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import {
  Grid,
  Button,
  TextField,
  Card,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';

import { Add } from '@material-ui/icons';

import { buscaUsuario, incluiUsuario, alteraUsuario, alteraUsuarioSemSenha } from 'services/usuarios';

export default function CadUsuario() {
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [valor2, setValor2] = useState('');
  const [valor3, setValor3] = useState({
    password: '',
    showPassword: false
  });
  const [valor4, setValor4] = useState({
    password: '',
    showPassword: false
  });
  const [valor5, setValor5] = useState('U');
  const [valor6, setValor6] = useState('null');
  const [antigoEmail, setAntigoEmail] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [dados, setDados] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [plusNovo, setPlusNovo] = useState(false);
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState(false);
  const [errors2, setErrors2] = useState(false);
  const [errors3, setErrors3] = useState(false);
  const [errors4, setErrors4] = useState(false);
  const [errors5, setErrors5] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');
  const [helperErrors2, setHelperErrors2] = useState('');
  const [helperErrors3, setHelperErrors3] = useState('');
  const [helperErrors4, setHelperErrors4] = useState('');

  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const aplicaFiltro = valor => {
    if (valor.length >= 1) setFiltro("LIKE '%" + valor + "%'");
    else setFiltro(null);
  };

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    if (filtro[5] !== 'CodUsuari=0') {
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaUsuario(filtro[5], undefined).then(data => {
            if (data !== undefined) {
              if (data.registros.length > 0) {
                setDados(data.registros);
                setValor(data.registros[0].NomUsuari);
                setValor2(data.registros[0].EmaUsuari);
                setAntigoEmail(data.registros[0].EmaUsuari);
                setNovoEmail(data.registros[0].EmaUsuari);
                setValor5(data.registros[0].PerfilUsu);
                setValor6(data.registros[0].DataBloqu);
              } else {
                setDados([]);
                setTransacaoIncluir(true);
                setOpen(true);
                setMensagem({
                  titulo: 'Aviso',
                  conteudo:
                    'Registro selecionado não existe! Selecione um registro existente.',
                  acao: '/Usuarios'
                });
              }
            } else {
              setDados([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Usuarios'
              });
            }
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setDados([]);
          console.log(err);
        } finally {
          if (!cancel) {
            setLoading(false);
          }
        }
      };
      runEffect();
      return () => {
        cancel = true;
      };
    }
  }, [filtro]);

  const concluiAcao = (
    transacaoIncluir,
    CodUsuari,
    NomUsuari,
    EmaUsuari,
    PwdUsuari1,
    PwdUsuari2,
    PerfilUsu,
    plusNovo
  ) => {   
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
    if (transacaoIncluir === true) {
      submitForm();
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          if (
            valor !== '' &&
            valor2 !== '' &&
            valor3 !== '' &&
            valor4 !== '' &&
            validacaoEmail(valor2) === true &&
            valor3.password.length >= 8 &&
            valor3.password === valor4.password
          ) {
            const inclui = await incluiUsuario(
              NomUsuari,
              EmaUsuari,
              passwordCipher,
              PerfilUsu,
              valor6
            );
            if (inclui === false) {
              setErrors2(true);
              setHelperErrors2('*Já existe um cadastro com este e-mail');
            } else if (plusNovo === false) {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/Usuarios'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/Usuarios/CadUsuarios/CodUsuari=0'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            }
          }
        } catch (err) {
          console.log(err);
          setOpen(true);
          setMensagem({
            titulo: 'Erro',
            conteudo: err,
            acao: '/Usuarios'
          });
        } finally {
          if (!cancel) setLoading(false);
        }
      };
      inclui();
      return () => {
        cancel = true;
      };
    } else {
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          if (
            valor !== '' &&
            valor2 !== '' &&
            valor3 !== '' &&
            valor4 !== '' &&
            validacaoEmail(valor2) === true &&
            valor3.password.length >= 8 &&
            valor3.password === valor4.password
          ) {
            if (antigoEmail === novoEmail) {
              const alteracaoUsuario = await alteraUsuario(
                CodUsuari,
                NomUsuari,
                undefined,
                passwordCipher,
                PerfilUsu,
                valor6
              );
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/Usuarios'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              const alteracaoUsuario = await alteraUsuario(
                CodUsuari,
                NomUsuari,
                EmaUsuari,
                passwordCipher,
                PerfilUsu,
                valor6
              );
              if (alteracaoUsuario === false) {
                setErrors2(true);
                setHelperErrors2('*Já existe um cadastro com este email');
              } else {
                setMensagem({
                  titulo: 'Sucesso',
                  conteudo: 'Alteração realizada com sucesso!',
                  acao: '/Usuarios'
                });
                setOpen(true);
                if (cancel) {
                  return;
                }
              }
            }
          } else if (
            valor !== '' &&
            valor2 !== '' &&
            valor3 !== '' &&
            valor4 !== '' &&
            validacaoEmail(valor2) === true &&
            valor3.password.length == '' 
          ) {
            if (antigoEmail === novoEmail) {
              const alteracaoUsuario = await alteraUsuarioSemSenha(
                CodUsuari,
                NomUsuari,
                undefined,                
                PerfilUsu,
                valor6
              );
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/Usuarios'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              const alteracaoUsuario = await alteraUsuarioSemSenha(
                CodUsuari,
                NomUsuari,
                EmaUsuari,                
                PerfilUsu,
                valor6
              );
              if (alteracaoUsuario === false) {
                setErrors2(true);
                setHelperErrors2('*Já existe um cadastro com este email');
              } else {
                setMensagem({
                  titulo: 'Sucesso',
                  conteudo: 'Alteração realizada com sucesso!',
                  acao: '/Usuarios'
                });
                setOpen(true);
                if (cancel) {
                  return;
                }
              }
            }
          }
        } catch (err) {
          console.log(err);
          setOpen(true);
          setMensagem({
            titulo: 'Erro',
            conteudo: err,
            acao: '/Usuarios'
          });
        } finally {
          if (!cancel) setLoading(false);
        }
      };
      altera();
      return () => {
        cancel = true;
      };
    }
  };

  const handleChange2 = prop => event => {
    setValor3({ ...valor3, [prop]: event.target.value });
    setErrors3(false);
    setHelperErrors3('');
  };

  const handleChange3 = prop => event => {
    setValor4({ ...valor4, [prop]: event.target.value });
    setErrors4(false);
    setHelperErrors4('');
  };

  const handleClickShowPassword = () => {
    setValor3({
      ...valor3,
      showPassword: !valor3.showPassword
    });
  };

  const handleClickShowPassword2 = () => {
    setValor4({
      ...valor4,
      showPassword: !valor4.showPassword
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleMouseDownPassword2 = event => {
    event.preventDefault();
  };

  const handleCheckSenha = senha => {
    if (senha.length < 8) {
      setErrors3(true);
      setHelperErrors3(
        <FormHelperText>
          *A senha deve possuir pelo menos 8 dígitos!
        </FormHelperText>
      );
    } else {
      setErrors3(false);
      setHelperErrors3('');
    }
  };

  const handleConfirmaSenha = senha => {
    if (senha !== valor3.password) {
      setErrors4(true);
      setHelperErrors3(
        <FormHelperText>*As senhas digitadas não coincidem!</FormHelperText>
      );
    } else {
      setErrors4(false);
      setHelperErrors4('');
    }
  };

  const validacaoEmail = email => {
    let validateEmail = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(
      email
    );
    return validateEmail;
  };

  const handleCheckEmail = email => {
    if (validacaoEmail(email) === false || email.length > 254) {
      setErrors2(true);
      setHelperErrors2('*Este não é um e-mail válido');
      return true;
    } else {
      setErrors2(false);
      setHelperErrors2('');
      return false;
    }
  };

  const submitForm = Form => {
    if (valor === '') {
      setErrors(true);
      setHelperErrors('*O preenchimento deste campo é obrigatório');
    }
    if (valor2 === '') {
      setErrors2(true);
      setHelperErrors2('*O preenchimento deste campo é obrigatório');
    }
    if (valor3.password === '') {
      setErrors3(true);
      setHelperErrors3(
        <FormHelperText>
          *O preenchimento deste campo é obrigatório
        </FormHelperText>
      );
    }
    if (valor4.password === '') {
      setErrors4(true);
      setHelperErrors4(
        <FormHelperText>
          *O preenchimento deste campo é obrigatório
        </FormHelperText>
      );
    }
  };

  const url = window.location.href;
  const NovoOuAlteracao = url.split('/');

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
      <PageTitle
        titleHeading="Usuários"
        titleDescription={
          dados.length > 0 ? 'Alteração dos Usuários' : 'Novo Usuário'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={1} wrap="wrap">
              <Grid item xs={12} sm={12} md={12}>
                <div className="searchBar">&nbsp;&nbsp;Nome</div>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o nome do usuário"
                  multiline
                  rowsMax={3}
                  helperText={helperErrors}
                  className="m-2"
                  id="outlined-size-small"
                  value={valor}
                  variant="outlined"
                  size="small"
                  onChange={e => {
                    setValor(e.target.value);
                    setErrors(false);
                    setHelperErrors('');
                  }}
                  error={errors}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <div className="searchBar">&nbsp;&nbsp;E-mail</div>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o e-mail do usuário"
                  multiline
                  rowsMax={3}
                  helperText={helperErrors2}
                  className="m-2"
                  id="outlined-size-small"
                  value={valor2}
                  variant="outlined"
                  size="small"
                  onChange={e => {
                    setValor2(e.target.value);
                    setNovoEmail(e.target.value);
                    setErrors2(false);
                    setHelperErrors2('');
                  }}
                  onBlur={e => {
                    handleCheckEmail(e.target.value);
                  }}
                  error={errors2}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <div className="searchBar">&nbsp;&nbsp;Senha</div>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <div className="searchBar">&nbsp;&nbsp;Confirme a Senha</div>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <FormControl
                  sx={{ m: 1, width: '25ch' }}
                  variant="outlined"
                  size="small"
                  justify="flex-start"
                  fullWidth
                  style={{ marginLeft: 9 }}
                  error={errors3}>
                  <OutlinedInput
                    placeholder="Informe a nova senha do usuário"
                    type={valor3.showPassword ? 'text' : 'password'}
                    value={valor3.password}
                    onChange={handleChange2('password')}
                    onBlur={e => {
                      handleCheckSenha(e.target.value);
                      console.log(antigoEmail);
                      console.log(novoEmail);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end">
                          {valor3.showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors3 ? helperErrors3 : ''}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <FormControl
                  sx={{ m: 1, width: '25ch' }}
                  variant="outlined"
                  size="small"
                  fullWidth
                  style={{ marginLeft: 9 }}
                  error={errors4}>
                  <OutlinedInput
                    placeholder="Informe a nova senha do usuário"
                    type={valor4.showPassword ? 'text' : 'password'}
                    value={valor4.password}
                    onChange={handleChange3('password')}
                    onBlur={e => {
                      handleConfirmaSenha(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword2}
                          onMouseDown={handleMouseDownPassword2}
                          edge="end">
                          {valor4.showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors4 ? (
                    <FormHelperText style={{color: 'red'}}>
                      As senhas digitadas não coincidem!
                    </FormHelperText>
                  ) : (
                    ''
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <div className="searchBar">&nbsp;&nbsp;Perfil do Usuário</div>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <div className="searchBar">&nbsp;&nbsp;Data do Bloqueio</div>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o nome do novo usuário"
                  className="m-2"
                  id="outlined-size-small"
                  value={valor5}
                  variant="outlined"
                  size="small"
                  select
                  onChange={e => {
                    setValor5(e.target.value);
                  }}>
                  <MenuItem value={'U'}>Usuário</MenuItem>
                  <MenuItem value={'A'}>Administrador</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  required
                  fullWidth
                  className="m-2"
                  id="outlined-size-small"
                  value={valor6}
                  variant="outlined"
                  size="small"
                  onChange={e => {
                    setValor6(e.target.value);                    
                  }}
                />
              </Grid>
              <Grid
                container
                justify="space-around"
                spacing={2}
                textAlign="center">
                <Grid item xs={12}>
                  <Divider className="my-4" />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Box textAlign="center">
                    <Button
                      style={{
                        maxWidth: '800px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}
                      className="m-2"
                      variant="outlined"
                      color="primary"
                      href="/Usuarios">
                      Voltar
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Box sx={{ width: '100%' }} textAlign="center">
                    <Button
                      style={{
                        maxWidth: '800px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}
                      className="m-2"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        concluiAcao(
                          transacaoIncluir,
                          transacaoIncluir ? 0 : dados[0].CodUsuari,
                          valor,
                          valor2,
                          valor3.password,
                          valor4.password,
                          valor5,
                          plusNovo
                        );
                        /* aplicaFiltro(valor); */                        
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
                {NovoOuAlteracao[5] == 'CodUsuari=0' ? (
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/Usuarios/CadUsuarios/CodUsuari=0"
                        component={Link}
                        style={{
                          maxWidth: '800px',
                          maxHeight: '60px',
                          minWidth: '180px',
                          minHeight: '40px'
                        }}
                        className="m-2"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          concluiAcao(
                            transacaoIncluir,
                            transacaoIncluir ? 0 : dados[0].CodUsuari,
                            valor,
                            valor2,
                            valor3.password,
                            valor4.password,
                            valor5,
                            true
                          );
                          submitForm();
                        }}>
                        {<Add />} &nbsp;&nbsp;Novo&nbsp;&nbsp;&nbsp;&nbsp;
                      </Button>
                    </Box>
                  </Grid>
                ) : (
                  <Grid></Grid>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
