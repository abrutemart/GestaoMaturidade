import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageTitle } from '../../layout-components';

import FormControl from '@material-ui/core/FormControl';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import Cookies from 'universal-cookie';

import {
  Card,
  Divider,
  Box,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText
} from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Edit, Add } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { buscaUsuario, alteraSenha } from '../../services/alterarSenha';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));

const useStyles2 = makeStyles({
  table: {
    minWidth: 500
  }
});

export default function AlterarSenha() {
  const cookies = new Cookies();
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const history = useHistory();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [rowCode, setRowCode] = useState('');
  const [codigoAlteracao, setCodigoAlteracao] = useState('');
  const [novoNomUsuari, setNovoNomUsuari] = useState('');
  const [open, setOpen] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const [selecaoCodUsuari, setSelecaoCodUsuari] = useState();
  const [errors, setErrors] = useState(false);
  const [errors2, setErrors2] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');
  const [helperErrors2, setHelperErrors2] = useState('');
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [refresh, setRefresh] = useState(false);
  const [valor, setValor] = useState({
    password: '',
    showPassword: false
  });
  const [valor2, setValor2] = useState({
    password: '',
    showPassword: false
  });

  useEffect(() => {
    setLoading(true);
    setDados([]);
    setRefresh(false);
    let cancel = false;
    const runEffect = async () => {
      try {
        await buscaUsuario(undefined, filtro).then(data => {
          if (data !== undefined) setDados(data.registros);
          else setDados([]);
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
  }, [filtro, refresh]);

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
    history.push(mensagem.acao);
  };  

  const handleClickShowPassword = () => {
    setValor({
      ...valor,
      showPassword: !valor.showPassword
    });
  };

  const handleClickShowPassword2 = () => {
    setValor2({
      ...valor2,
      showPassword: !valor2.showPassword
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleChange = prop => event => {
    setValor({ ...valor, [prop]: event.target.value });
    setErrors(false);
    setHelperErrors('');
    setErrors2(false);
    setHelperErrors2('');
  };

  const handleChange2 = prop => event => {
    setErrors(false);
    setHelperErrors('');
    setValor2({ ...valor2, [prop]: event.target.value });
    setErrors2(false);
    setHelperErrors2('');
  };

  const concluiAcao = (    
    PwdUsuari
  ) => {      
      setLoading(true);
      let cancel = false;
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
      passwordCipher = criptografar(PwdUsuari);
      const altera = async () => {
        try {
          if (valor !== '' &&
          valor2 !== '' &&                   
          valor.password.length >= 8 &&
          valor.password === valor2.password) {
            await alteraSenha(cookies.get('CodigoDoUsuario'), passwordCipher);
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/DashboardDefault'
              });
              setOpen(true);
              if (cancel) {
                return;
              }            
          }
        } catch (err) {
          console.log(err);
          setOpen(true);
          setMensagem({
            titulo: 'Erro',
            conteudo: err,
            acao: '/DashboardDefault'
          });
        } finally {
          if (!cancel) setLoading(false);
        }
      };
      altera();
      return () => {
        cancel = true;
      };    
  };

  const handleCheckSenha = senha => {
    if (senha.length < 8) {
      setErrors(true);
      setHelperErrors(
        <FormHelperText>
          *A senha deve possuir pelo menos 8 dígitos!
        </FormHelperText>
      );
    } else {
      setErrors(false);
      setHelperErrors('');
    }
  };

  const handleCheckSenha2 = senha => {
    if (senha.length < 8) {
      setErrors2(true);
      setHelperErrors2(
        <FormHelperText>
          *A senha deve possuir pelo menos 8 dígitos!
        </FormHelperText>
      );
    } else {
      setErrors(false);
      setHelperErrors('');
    }
  };

  const submitForm = Form => {
    if (valor.password === '') {
      setErrors(true);
      setHelperErrors(<FormHelperText>
        *O preenchimento deste campo é obrigatório
      </FormHelperText>);
    }
    if (valor2.password === '') {
      setErrors2(true);
      setHelperErrors2(
        <FormHelperText>
          *O preenchimento deste campo é obrigatório
        </FormHelperText>
      );
    }
    else if (valor.password !== '' && valor.password < 8) {
      setErrors(true);
      setHelperErrors(<FormHelperText>
        *A senha deve possuir pelo menos 8 dígitos!
      </FormHelperText>);
    }    
    else if (valor.password != valor2.password) {
      setErrors(true);
      setErrors2(true);
      setHelperErrors(<FormHelperText>
        *As senhas digitadas não coincidem!
      </FormHelperText>);
      setHelperErrors2(<FormHelperText>
        *As senhas digitadas não coincidem!
      </FormHelperText>);
    }
    else 
    {
      setErrors(false);
      setErrors2(false);
      setHelperErrors('');
      setHelperErrors2('');
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
      <PageTitle titleHeading="Alteração de Senha" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={1} wrap="wrap">
              <Grid container spacing={2} textAlign="center">
                <Grid Item xs={8}>
                  <div className="searchBar">
                    &nbsp;&nbsp;Digite a Nova Senha
                  </div>
                </Grid>
                <Grid Item xs={8}>
                  {
                    <FormControl
                      variant="outlined"
                      size="small"
                      justify="flex-start"
                      fullWidth
                      error={errors}
                      style={{ margin: '2em' }}
                      color="primary">
                      <InputLabel>{'Digite sua senha'}</InputLabel>
                      <OutlinedInput
                        label="Digite sua senha"
                        type={valor.showPassword ? 'text' : 'password'}
                        value={valor.password}
                        onChange={handleChange('password')}
                        onBlur={e => {
                          handleCheckSenha(e.target.value);                          
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end">
                              {valor.showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors ? helperErrors : ''}
                    </FormControl>
                  }
                </Grid>
                <Grid Item xs={8}>
                  <div className="searchBar">
                    &nbsp;&nbsp;Repita a Nova Senha
                  </div>
                </Grid>

                <Grid Item xs={8}>
                  {
                    <FormControl
                      variant="outlined"
                      size="small"
                      justify="flex-start"
                      error={errors2}
                      fullWidth
                      style={{ margin: '2em' }}
                      color="primary">
                      <InputLabel>{'Digite sua senha'}</InputLabel>
                      <OutlinedInput
                        label="Digite sua senha"
                        type={valor2.showPassword ? 'text' : 'password'}
                        value={valor2.password}
                        onChange={handleChange2('password')}
                        onBlur={e => {
                          handleCheckSenha2(e.target.value);                          
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword2}
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
                  }
                </Grid>
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
                      href="/DashboardDefault">
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
                          valor.password,
                          valor2.password                         
                        );
                        submitForm();
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
