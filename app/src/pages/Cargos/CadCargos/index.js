import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';

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
  Divider
} from '@material-ui/core';

import { Add } from '@material-ui/icons';

import {
  buscaCargos,
  incluiCargos,
  alteraCargos
} from '../../../services/cargos';

export default function CadCargos() {
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [dados, setDados] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');

  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const aplicaFiltro = valor => {
    if (valor.length >= 1) setFiltro("DesCargo LIKE '%" + valor + "%'");
    else setFiltro(null);
  };

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    if (filtro[5] !== 'CodCargo=0') {
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaCargos(filtro[5]).then(data => {
            if (data !== undefined) {
              if (data.registros.length > 0) {
                setDados(data.registros);
                setValor(data.registros[0].DesCargo);
              } else {
                setDados([]);
                setTransacaoIncluir(true);
                setOpen(true);
                setMensagem({
                  titulo: 'Aviso',
                  conteudo:
                    'Registro selecionado não existe! Selecione um registro existente.',
                  acao: '/Cargos'
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
                acao: '/Cargos'
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
  }, []);

  const concluiAcaoMaisNovo = (acao, set, where) => {
    if (acao === true) {
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          let pesquisaCargo = `UPPER(DesCargo) = UPPER('${valor}')`;
          const existeCargo = await buscaCargos(pesquisaCargo);
          await incluiCargos(set);
          if (existeCargo.registros[0] !== undefined) {
            setErrors(true);
            setHelperErrors('*Já existe um cadastro com este nome');
          } else if (valor !== '' && valor !== undefined) {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclusão realizada com sucesso!',
              acao: '/Cargos/CadCargos/CodCargo=0'
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
            acao: '/Cargos'
          });
        } finally {
          if (!cancel) setLoading(false);
        }
      };
      inclui();
      return () => {
        cancel = true;
      };
    }
  };

  const concluiAcao = (acao, set, where) => {
    if (acao === true) {
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          let pesquisaCargo = `UPPER(DesCargo) = UPPER('${valor}')`;
          const existeCargo = await buscaCargos(pesquisaCargo);
          await incluiCargos(set);
          if (existeCargo.registros[0] !== undefined) {
            setErrors(true);
            setHelperErrors('*Já existe um cadastro com este nome');
          } else if (valor !== '' && valor !== undefined) {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclusão realizada com sucesso!',
              acao: '/Cargos'
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
            acao: '/Cargos'
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
      let alteracao = " DesCargo = '" + set + "'";
      let filtro = ' CodCargo = ' + where;
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          let pesquisaCargo = `UPPER(DesCargo) = UPPER('${valor}')`;
          const existeCargo = await buscaCargos(pesquisaCargo);
          if (existeCargo.registros[0] !== undefined) {
            setErrors(true);
            setHelperErrors('*Já existe um cadastro com este nome');
          } else if (valor !== '' && valor !== undefined) {
            await alteraCargos(alteracao, filtro);
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!',
              acao: '/Cargos'
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
            acao: '/Cargos'
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

  const handleChange = campo => event => {
    setValor(event.target.value);    
  };

  const submitForm = Form => {
    if (valor === '') {
      setErrors(true);
      setHelperErrors('*O preenchimento deste campo é obrigatório');
    }
  };

  var url_atual = window.location.href;
  var url_nova = window.location.href.slice(-10);
  if (url_nova === 'CodCargo=0') {
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
          titleHeading="Cargos"
          titleDescription={
            dados.length > 0 ? 'Alteração do Cargo' : 'Novo Cargo'
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card className="p-4 mb-4">
              <Grid container justify="flex-start" spacing={2} wrap="wrap">
                <Grid item xs={12} sm={12} md={12}>
                  <div className="searchBar">Nome do Cargo</div>
                  <TextField
                    required
                    fullWidth
                    placeholder="Informe o Nome do Novo Cargo"
                    multiline
                    rowsMax={3}
                    helperText={helperErrors}
                    className="m-2"
                    id="outlined-size-small"
                    value={valor}
                    variant="outlined"
                    size="small"
                    onChange={handleChange('cargos')}
                    error={errors}
                  />
                </Grid>
                <Grid container justify="space-around" spacing={2}>
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
                        href="/Cargos">
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
                            valor,
                            transacaoIncluir ? 0 : dados[0].CodCargo
                          );
                          aplicaFiltro(valor);
                          submitForm();                          
                        }}>
                        Confirmar
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/Cargos/CadCargos/CodCargo=0"
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
                          concluiAcaoMaisNovo(
                            transacaoIncluir,
                            valor,
                            transacaoIncluir ? 0 : dados[0].CodCargo
                          );
                          submitForm();
                        }}>
                        {<Add />} &nbsp;&nbsp;Novo&nbsp;&nbsp;&nbsp;&nbsp;
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
  } else if (url_nova !== 'CodCargo=0') {
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
          titleHeading="Cargos"
          titleDescription={
            dados.length > 0 ? 'Alteração do Cargo' : 'Novo Cargo'
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card className="p-4 mb-4">
              <Grid container justify="flex-start" spacing={2} wrap="wrap">
                <Grid item xs={12} sm={12} md={12}>
                  <div className="searchBar">Nome do Cargo</div>
                  <TextField
                    required
                    fullWidth
                    placeholder="Informe o Novo Nome do Cargo"
                    multiline
                    rowsMax={3}
                    helperText={helperErrors}
                    className="m-2"
                    id="outlined-size-small"
                    value={valor}
                    variant="outlined"
                    size="small"
                    onChange={handleChange('cargos')}
                    error={errors}
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
                        href="/Cargos">
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
                            valor,
                            transacaoIncluir ? 0 : dados[0].CodCargo,
                            valor,
                            transacaoIncluir ? 0 : dados[0].DesCargo
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
}
