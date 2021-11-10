import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { Delete } from '@material-ui/icons';

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
  buscaSegmentos,
  incluiSegmento,
  alteraSegmento,
  buscaProcesso,
  buscaSegmentoProcesso,
  incluiSegmentoProcesso,
  excluiSegmentoProcesso
} from 'services/segmentos';
import { Paper } from '@material-ui/core';

export default function CadSegmentos() {
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [codigoSegmen, setCodigoSegmen] = useState('');
  const [codigoProcess, setCodigoProcess] = useState('');
  const [dados, setDados] = useState([]);
  const [processo, setProcesso] = useState([]);
  const [segmentoProcesso, setSegmentoProcesso] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [plusNovo, setPlusNovo] = useState(false);
  const [selecao1, setSelecao1] = useState('');
  const [selecao2, setSelecao2] = useState('');
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [disable, setDisable] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');
  const [errorsProcesso, setErrorsProcesso] = useState(false);
  const [helperErrorsProcesso, setHelperErrorsProcesso] = useState('');
  const [refresh, setRefresh] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
    setRefresh(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
    setOpenEscolha(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const clickExcluir = (item1, item2) => {
    setSelecao1(item1);
    setSelecao2(item2);
    setOpenEscolha(true);
  };

  const aplicaFiltro = valor => {
    if (valor.length >= 1) setFiltro("LIKE '%" + valor + "%'");
    else setFiltro(null);
  };

  const populateProcessos = async () => {
    await buscaProcesso().then(data => {
      setProcesso(data.registros);
    });
  };

  function createDataProcesso(CodProces, DesProces, CodImagem) {
    return { CodProces, DesProces, CodImagem };
  }

  let rowsProcesso = [];
  rowsProcesso = processo.map(each =>
    createDataProcesso(each.CodProces, each.DesProces, each.CodImagem)
  );

  var listaProcessos = rowsProcesso.map(item => item.DesProces);

  function createDataSegmentoProcesso(CodSegmen, CodProces, DesProces, Hora) {
    return { CodSegmen, CodProces, DesProces, Hora };
  }

  let rowsSegmentoProcesso = [];
  rowsSegmentoProcesso = segmentoProcesso.map(each =>
    createDataSegmentoProcesso(
      each.CodSegmen,
      each.CodProces,
      each.DesProces,
      each.Hora
    )
  );

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    setRefresh(false);
    populateProcessos();
    
    if (filtro[5] !== 'CodSegmen=0') {
      setTransacaoIncluir(false);
      
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaProcesso(filtro[5]).then(data => {
            if (data !== undefined) setProcesso(data.registros);
            else setProcesso([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setProcesso([]);
          console.log(err);
        }
        try {
          await buscaSegmentos(undefined, filtro[5]).then(data => {
            if (data !== undefined) {
              if (data.registros.length > 0) {
                setDados(data.registros);
                setValor(data.registros[0].DesSegmen);
                setCodigoSegmen(data.registros[0].CodSegmen);
                
              } else {
                setDados([]);
                setTransacaoIncluir(true);
                setOpen(true);
                setMensagem({
                  titulo: 'Aviso',
                  conteudo:
                    'Registro selecionado não existe! Selecione um registro existente.',
                  acao: '/Segmentos'
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
                acao: '/Segmentos'
              });
            }
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setDados([]);
          console.log(err);
        }
        try {
          await buscaSegmentoProcesso(filtro[5]).then(data => {
            if (data !== undefined) setSegmentoProcesso(data.registros);
            else setSegmentoProcesso([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setProcesso([]);
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
  }, [filtro, refresh]);

  const concluiAcao = (
    transacaoIncluir,
    desSegmento,
    codSegmento,
    plusNovo
  ) => {
    if (transacaoIncluir === true) {
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const inclui = await incluiSegmento(desSegmento);
            if (inclui === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else if (plusNovo === false) {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/Segmentos'
              });
              setOpen2(true);
              if (cancel) {
                return;
              }
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/Segmentos/CadSegmentos/CodSegmen=0'
              });
              setOpen2(true);
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
            acao: '/Segmentos'
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
      let alteracao = desSegmento;
      let filtro = codSegmento;
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const alteracaoSegmento = await alteraSegmento(alteracao, filtro);
            if (alteracaoSegmento === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/Segmentos'
              });
              setOpen2(true);
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
            acao: '/Segmentos'
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

  const concluiAcao2 = (codSegmento, codProcesso) => {
    
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (
          codSegmento !== '' &&
          codSegmento !== undefined &&
          codProcesso !== '' &&
          codProcesso !== undefined
        ) {
          const inclui = await incluiSegmentoProcesso(codSegmento, codProcesso);
          if (inclui === false) {
            setErrorsProcesso(true);
            setHelperErrorsProcesso(
              '*Já existe um processo com este nome associado a este segmento'
            );
          } else {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclusão realizada com sucesso!'
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
          acao: '/Segmentos'
        });
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    inclui();
    return () => {
      cancel = true;
    };
  };

  const excluiRegistro = (CodSegmen, CodProces) => {
    const url = window.location.href;
    const filtro = url.split('/');
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        await excluiSegmentoProcesso(CodSegmen, CodProces);
        setMensagem({
          titulo: 'Sucesso',
          conteudo: 'Exclusão realizada com sucesso!',
          acao: `/Segmentos/CadSegmentos/${filtro[5]}`
        });
        setOpen(true);
        if (cancel) {
          return;
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/Segmentos'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
    };
    exclui();
    return () => {
      cancel = true;
    };
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

  const url = window.location.href;
  const NovoOuAlteracao = url.split('/');

  return (
    <Fragment>
      <Dialog
        open={openEscolha}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Informação</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja excluir o registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Não
          </Button>
          <Button
            onClick={() => excluiRegistro(selecao1, selecao2)}
            color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
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
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{mensagem.titulo}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mensagem.conteudo}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <PageTitle
        titleHeading="Segmentos"
        titleDescription={
          NovoOuAlteracao[5] != 'CodSegmen=0'
            ? 'Alteração do Segmento'
            : 'Novo Segmento'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              {/* Nome do Segmento a Ser Alterado ou a Ser Criado */}

              <div className="searchBar">Nome do Segmento</div>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o Nome do Novo Segmento"
                  multiline
                  rowsMax={3}
                  helperText={helperErrors}
                  className="m-2"
                  id="outlined-size-small"
                  value={valor}
                  variant="outlined"
                  size="small"
                  onChange={handleChange('segmentos')}
                  error={errors}
                />
              </Grid>
              {NovoOuAlteracao[5] != 'CodSegmen=0' ? (
                <>
                  <div className="searchBar">Processos</div>
                  <Grid container spacing={1} wrap="wrap">
                    <Grid item xs={11} sm={11} md={11}>
                      <Autocomplete
                        disabled={
                          NovoOuAlteracao[5] != 'CodSegmen=0' ? false : true
                        }
                        style={{ marginLeft: 9 }}
                        onChange={(event, newValue) => {
                          newValue === null
                            ? setCodigoProcess('')
                            : setCodigoProcess(newValue.CodProces);
                          setErrorsProcesso(false);
                          setHelperErrorsProcesso('');
                        }}
                        disablePortal
                        id="outlined-size-small"
                        options={rowsProcesso}
                        getOptionLabel={rowsProcesso => rowsProcesso.DesProces}
                        renderInput={params => (
                          <TextField
                            helperText={helperErrorsProcesso}
                            error={errorsProcesso}
                            className="m-2"
                            fullWidth
                            variant="outlined"
                            {...params}
                            size="small"
                          />
                        )}
                      />
                    </Grid>

                    {/* Botão para Associar Processo Selecionado ao Segmento Definido */}

                    <Grid item xs={1} sm={1} md={1} align="center">
                      <Button
                        disabled={
                          NovoOuAlteracao[5] != 'CodSegmen=0' ? false : true
                        }
                        edge="end"
                        style={{
                          maxWidth: '50px',
                          maxHeight: '40px',
                          minWidth: '50px',
                          minHeight: '40px'
                        }}
                        className="m-2"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          concluiAcao2(codigoSegmen, codigoProcess);
                        }}>
                        +
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                    <Paper
                      style={{
                        maxHeight: '100px',
                        minHeight: '100px',
                        overflow: 'auto',
                        marginLeft: 9
                      }}>
                      <List>
                        {rowsSegmentoProcesso.map(row => (
                          <ListItem key={row.CodProces}>
                            <ListItemText
                              primary={row.DesProces}></ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() =>
                                  clickExcluir(row.CodSegmen, row.CodProces)
                                }>
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </>
              ) : (
                ''
              )}
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
                      href="/Segmentos">
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
                          transacaoIncluir ? 0 : dados[0].CodSegmen,
                          plusNovo
                        );
                        aplicaFiltro(valor);
                        submitForm();
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
                {NovoOuAlteracao[5] == 'CodSegmen=0' ? (
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/Segmentos/CadSegmentos/CodSegmen=0"
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
                            valor,
                            transacaoIncluir ? 0 : dados[0].CodSegmen,
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
