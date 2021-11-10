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

import {
  buscaSegmentos,  
  buscaNivelAnalise,  
  incluiCfgNivEsp,
  buscaCfgNivEsp,
  excluiNivEsp
} from 'services/configuracaoDeNivelDeAnalise';
import { Paper } from '@material-ui/core';

export default function CadSegmentos() {
  const [desSegmen, setDesSegmen] = useState({ DesSegmen: '' });
  const [cfgNivEsp, setCfgNivEsp] = useState([]);
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [codigoSegmen, setCodigoSegmen] = useState('');
  const [codigoProcess, setCodigoProcess] = useState('');
  const [dados, setDados] = useState([]);
  const [processo, setProcesso] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [plusNovo, setPlusNovo] = useState(false);
  const [selecao1, setSelecao1] = useState('');
  const [selecao2, setSelecao2] = useState('');
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [niveisAnalise, setNiveisAnalise] = useState([]);
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
    console.log('certo');
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

  const populateCfgNivEsp = async CodSegmen => {
    if (CodSegmen !== '' && CodSegmen !== null && CodSegmen !== undefined) {
      await buscaCfgNivEsp(CodSegmen).then(data => {
        setCfgNivEsp(data.registros);
      });
    } else {
      setCfgNivEsp([]);
    }
  };

  function createDataNiveisAnalise(CodNivAna, DesNivAna) {
    return { CodNivAna, DesNivAna };
  }

  let rowsNiveisAnalise = [];
  rowsNiveisAnalise = niveisAnalise.map(each =>
    createDataNiveisAnalise(each.CodNivAna, each.DesNivAna)
  );

  function createDataSegmento(CodSegmen, DesSegmen) {
    return { CodSegmen, DesSegmen };
  }

  let rowsSegmento = [];
  rowsSegmento = segmentos.map(each =>
    createDataSegmento(each.CodSegmen, each.DesSegmen)
  );

  function createDataCfgNivEsp(CodNivAna, CodSegmen, DesNivAna) {
    return { CodNivAna, CodSegmen, DesNivAna };
  }

  let rowsCfgNivEsp = [];
  rowsCfgNivEsp = cfgNivEsp.map(each =>
    createDataCfgNivEsp(each.CodNivAna, each.CodSegmen, each.DesNivAna)
  );

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    setRefresh(false);
    if (filtro[5] !== 'CodSegmen=0') {
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaNivelAnalise(filtro[5]).then(data => {
            if (data !== undefined) {
              setNiveisAnalise(data.registros);
            } else {
              setDados([]);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/ConfiguracaoDeNiveldeAnalise'
              });
            }
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setNiveisAnalise([]);
          console.log(err);
        }
        try {
          await buscaSegmentos(undefined, filtro[5]).then(data => {
            if (data !== undefined) {
              setSegmentos(data.registros);
              setDesSegmen({
                CodSegmen: data.registros[0].CodSegmen,
                DesSegmen: data.registros[0].DesSegmen
              });
            } else {
              setDados([]);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/ConfiguracaoDeNiveldeAnalise'
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
          await buscaCfgNivEsp(filtro[5]).then(data => {
            if (data !== undefined) {
              setCfgNivEsp(data.registros);
            } else {
              setCfgNivEsp([]);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/ConfiguracaoDeNiveldeAnalise'
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
    } else {
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaNivelAnalise().then(data => {
            if (data !== undefined) {
              setNiveisAnalise(data.registros);
            } else {
              setDados([]);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/ConfiguracaoDeNiveldeAnalise'
              });
            }
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setNiveisAnalise([]);
          console.log(err);
        }
        try {
          await buscaSegmentos().then(data => {
            if (data !== undefined) {
              setSegmentos(data.registros);
            } else {
              setDados([]);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/ConfiguracaoDeNiveldeAnalise'
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
          await buscaCfgNivEsp(filtro[5]).then(data => {
            if (data !== undefined) {
              setCfgNivEsp(data.registros);
            } else {
              setCfgNivEsp([]);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/ConfiguracaoDeNiveldeAnalise'
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
  }, [filtro, refresh]);


  const excluiRegistro = (CodSegmen, CodProces) => {    
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        await excluiNivEsp(CodSegmen, CodProces);
        setMensagem({
          titulo: 'Sucesso',
          conteudo: 'Exclusão realizada com sucesso!'
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
          acao: '/ConfiguracaoDeNiveldeAnalise'
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

  const submitForm = Form => {
    const check1 = () => {
      if (valor === '' || valor === undefined || valor === null) {
        /* setErrorsProcesso(true);
        setHelperErrorsProcesso('*Campo obrigatório'); */
        return false;
      }
    };

    const check2 = () => {
      if (desSegmen.DesSegmen === '' || desSegmen.DesSegmen === undefined) {
        /* setErrorsDesSegmen(true);
        setHelperErrorsDesSegmen('*Campo obrigatório'); */
        return false;
      }
    };

    check1();
    check2();

    if (check1() == false || check2() == false) return false;
  };

  const addSegNivAna = (CodSegmen, CodNivAna) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (submitForm() != false) {
          const inclui = await incluiCfgNivEsp(CodSegmen, CodNivAna);
          if (inclui != false)
          {setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Inclusão realizada com sucesso!',
            acao: `/ConfiguracaoDeNiveldeAnalise/CadConfiguracaoDeNiveldeAnalise/CodSegmen=${CodSegmen}`
          });
          setOpen(true);
          if (cancel) {
            return;
          }
          setRefresh(true);}
          else {
            setMensagem({
              titulo: 'Aviso',
              conteudo: 'Já existe um cadastro com estas informações',
              acao: `/ConfiguracaoDeNiveldeAnalise/CadConfiguracaoDeNiveldeAnalise/CodSegmen=${CodSegmen}`
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
          acao: '/ConfiguracaoDeNiveldeAnalise'
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
          <Button
            onClick={
              NovoOuAlteracao[5] == 'CodSegmen=0' ? handleClose2 : handleClose
            }
            color="primary"
            autoFocus>
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
        titleHeading="Configuração de Nível"
        titleDescription={
          NovoOuAlteracao[5] != 'CodSegmen=0'
            ? 'Alteração da Configuração de Nível'
            : 'Nova Configuração de Nível'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              {/* Nome do Segmento a Ser Associado */}

              <div className="searchBar">Segmento</div>
              <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                  value={desSegmen}
                  ListboxProps={{ style: { maxHeight: '10rem' } }}
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setDesSegmen('')
                      : setDesSegmen({
                          CodSegmen: newValue.CodSegmen,
                          DesSegmen: newValue.DesSegmen
                        });
                    /* setErrorsProcesso(false);
                      setHelperErrorsProcesso(''); */
                  }}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsSegmento}
                  getOptionLabel={rowsSegmento => rowsSegmento.DesSegmen}
                  renderInput={params => (
                    <TextField
                      /* helperText={helperErrorsProcesso}
                        error={errorsProcesso} */

                      className="m-2"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>

              {/* Lista de Níveis de Análise Já Existentes */}

              <div className="searchBar">Nível de Análise</div>
              <Grid container spacing={1} wrap="wrap">
                <Grid item xs={11} sm={11} md={11}>
                  <Autocomplete
                    style={{ marginLeft: 9 }}
                    ListboxProps={{ style: { maxHeight: '10rem' } }}
                    onChange={(event, newValue) => {
                      newValue === null
                        ? setValor('')
                        : setValor(newValue.CodNivAna);
                      /* setErrorsProcesso(false);
                      setHelperErrorsProcesso(''); */
                    }}
                    disablePortal
                    id="outlined-size-small"
                    options={rowsNiveisAnalise}
                    getOptionLabel={rowsNiveisAnalise =>
                      rowsNiveisAnalise.DesNivAna
                    }
                    renderInput={params => (
                      <TextField
                        /* helperText={helperErrorsProcesso}
                        error={errorsProcesso} */
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
                      addSegNivAna(desSegmen.CodSegmen, valor);
                    }}>
                    +
                  </Button>
                </Grid>
              </Grid>

              {/* Lista de Processos Já Associados ao Segmento Definido */}

              {
                <Grid item xs={12} sm={12} md={12}>
                  <Paper
                    style={{
                      maxHeight: '100px',
                      minHeight: '100px',
                      overflow: 'auto',
                      marginLeft: 9
                    }}>
                    <List>
                      {rowsCfgNivEsp.map(row => (
                        <ListItem key={row.CodSegmen + '' + row.CodNivAna}>
                          <ListItemText primary={row.DesNivAna}></ListItemText>
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              onClick={() =>
                                clickExcluir(row.CodSegmen, row.CodNivAna)
                              }>
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              }
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
                      href="/ConfiguracaoDeNiveldeAnalise">
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
                      href="/ConfiguracaoDeNiveldeAnalise">
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
