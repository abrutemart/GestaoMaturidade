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
  buscaProcessos,
  incluiProcesso,
  alteraProcesso,
  buscaSegmento,
  buscaSegmentoProcesso,
  incluiSegmentoProcesso,
  excluiSegmentoProcesso,
  buscaImagem,
  incluiProcessoImagem
} from 'services/processos';
import { Paper } from '@material-ui/core';

export default function CadSegmentos() {
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [codigoSegmento, setCodigoSegmento] = useState('');
  const [codigoProces, setCodigoProces] = useState('');
  const [codigoImagem, setCodigoImagem] = useState('');
  const [dados, setDados] = useState([]);
  const [processo, setProcesso] = useState([]);
  const [imagem, setImagem] = useState([]);
  const [segmento, setSegmento] = useState([]);
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
  const [errorsImagem, setErrorsImagem] = useState(false);
  const [helperErrorsProcesso, setHelperErrorsProcesso] = useState('');
  const [helperErrorsImagem, setHelperErrorsImagem] = useState('');
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

  const populateImagens = async () => {
    await buscaImagem().then(data => {
      setImagem(data.registros);
    });
  };

  function createDataImagem(CodImagem, DesImagem) {
    return { CodImagem, DesImagem };
  }

  let rowsImagens = [];
  rowsImagens = imagem.map(each =>
    createDataImagem(each.CodImagem, each.DesImagem)
  );

  const aplicaFiltro = valor => {
    if (valor.length >= 1) setFiltro("LIKE '%" + valor + "%'");
    else setFiltro(null);
  };

  const populateSegmentos = async () => {
    await buscaSegmento().then(data => {
      setSegmento(data.registros);
    });
  };

  function createDataSegmento(CodSegmen, DesSegmen) {
    return { CodSegmen, DesSegmen };
  }

  let rowsSegmento = [];
  rowsSegmento = segmento.map(each =>
    createDataSegmento(each.CodSegmen, each.DesSegmen)
  );

  function createDataSegmentoProcesso(CodSegmen, CodProces, DesSegmen, Hora) {
    return { CodSegmen, CodProces, DesSegmen, Hora };
  }

  let rowsSegmentoProcesso = [];
  rowsSegmentoProcesso = segmentoProcesso.map(each =>
    createDataSegmentoProcesso(
      each.CodSegmen,
      each.CodProces,
      each.DesSegmen,
      each.Hora
    )
  );

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    setRefresh(false);
    populateSegmentos();
    if (filtro[5] !== 'CodProces=0') {
      populateImagens();
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaSegmento(filtro[5]).then(data => {
            if (data !== undefined) setSegmento(data.registros);
            else setSegmento([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setProcesso([]);
          console.log(err);
        }
        try {
          await buscaProcessos(undefined, filtro[5]).then(data => {
            if (data !== undefined) {
              if (data.registros.length > 0) {
                setDados(data.registros);
                setValor(data.registros[0].DesProces);
                setCodigoProces(data.registros[0].CodProces);
              } else {
                setDados([]);
                setTransacaoIncluir(true);
                setOpen(true);
                setMensagem({
                  titulo: 'Aviso',
                  conteudo:
                    'Registro selecionado n??o existe! Selecione um registro existente.',
                  acao: '/Processos'
                });
              }
            } else {
              setDados([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado n??o existe! Selecione um registro existente.',
                acao: '/Processos'
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
          await buscaSegmentoProcesso(undefined, filtro[5]).then(data => {
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
  }, [filtro, refresh, codigoSegmento]);

  const concluiAcao = (
    transacaoIncluir,
    desProcesso,
    codProcesso,
    plusNovo
  ) => {
    if (transacaoIncluir === true) {
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const inclui = await incluiProcesso(desProcesso);
            if (inclui === false) {
              setErrors(true);
              setHelperErrors('*J?? existe um cadastro com este nome');
            } else if (plusNovo === false) {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclus??o realizada com sucesso!',
                acao: '/Processos'
              });
              setOpen2(true);
              if (cancel) {
                return;
              }
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclus??o realizada com sucesso!',
                acao: '/Processos/CadProcessos/CodProces=0'
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
            acao: '/Processos'
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
      let alteracao = desProcesso;
      let filtro = codProcesso;
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const alteracaoprocesso = await alteraProcesso(alteracao, filtro);
            if (alteracaoprocesso === false) {
              setErrors(true);
              setHelperErrors('*J?? existe um cadastro com este nome');
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Altera????o realizada com sucesso!',
                acao: '/Processos'
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
            acao: '/Processos'
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
              '*J?? existe um segmento com este nome associado a este processo'
            );
          } else {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclus??o realizada com sucesso!'
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
          acao: '/Processos'
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

  const concluiAcao3 = (codImagem, codProcesso) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (
          codImagem !== '' &&
          codImagem !== undefined &&
          codProcesso !== '' &&
          codProcesso !== undefined
        ) {
          const inclui = await incluiProcessoImagem(codImagem, codProcesso);
          if (inclui === false) {
            setErrorsImagem(true);
            setHelperErrorsImagem(
              '*J?? existe uma imagem com este nome associada a este processo'
            );
          } else {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclus??o realizada com sucesso!'
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
          acao: '/Processos'
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
          conteudo: 'Exclus??o realizada com sucesso!',
          acao: `/Processos/CadProcessos/${filtro[5]}`
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
          acao: '/Processos'
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
      setHelperErrors('*O preenchimento deste campo ?? obrigat??rio');
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
        <DialogTitle id="alert-dialog-title">Informa????o</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja excluir o registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            N??o
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
        titleHeading="Processos"
        titleDescription={
          NovoOuAlteracao[5] != 'CodProces=0'
            ? 'Altera????o do Processo'
            : 'Novo Processo'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              <Grid item xs={7} sm={7} md={7}>
                <div className="searchBar">Nome do Processo</div>
              </Grid>
              
                  {/* <Grid item xs={4} sm={4} md={4}>
                    <div className="searchBar">Selecionar Imagem</div>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}>
                    <div> </div>
                  </Grid>{' '} */}
              

              {/* Nome do Processo a Ser Alterado ou a Ser Criado */}

              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o Nome do Novo Processo"
                  multiline
                  rowsMax={3}
                  helperText={helperErrors}
                  className="m-2"
                  id="outlined-size-small"
                  value={valor}
                  variant="outlined"
                  size="small"
                  onChange={handleChange('processos')}
                  error={errors}
                />
              </Grid>
              {NovoOuAlteracao[5] != 'CodProces=0' ? (
                <>
                  

                  {/* <Grid item xs={4} sm={4} md={4}>
                    <Autocomplete
                      disabled={
                        NovoOuAlteracao[5] != 'CodProces=0' ? false : true
                      }
                      style={{ marginLeft: 9 }}
                      onChange={(event, newValue) => {
                        newValue === null
                          ? setCodigoImagem('')
                          : setCodigoImagem(newValue.CodImagem);
                        setErrorsImagem(false);
                        setHelperErrorsImagem('');
                      }}
                      disablePortal
                      freeSolo
                      id="outlined-size-small"
                      options={rowsImagens}
                      getOptionLabel={rowsImagens => rowsImagens.DesImagem}
                      renderInput={params => (
                        <TextField
                          helperText={helperErrorsImagem}
                          error={errorsImagem}
                          className="m-2"
                          fullWidth
                          variant="outlined"
                          {...params}
                          size="small"
                        />
                      )}
                    />
                  </Grid>

                  

                  <Grid item xs={1} sm={1} md={1} align="center">
                    <Button
                      disabled={
                        NovoOuAlteracao[5] != 'CodProces=0' ? false : true
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
                        concluiAcao3(codigoImagem, codigoProces);
                      }}>
                      +
                    </Button>
                  </Grid> */}

                  {/* Lista de Segmentos J?? Existentes */}

                  <Grid item xs={7} sm={7} md={7}>
                    <div className="searchBar">Segmentos</div>
                  </Grid>

                  <Grid container spacing={1} wrap="wrap">
                    <Grid item xs={11} sm={11} md={11}>
                      <Autocomplete
                        disabled={
                          NovoOuAlteracao[5] != 'CodProces=0' ? false : true
                        }
                        style={{ marginLeft: 9 }}
                        onChange={(event, newValue) => {
                          newValue === null
                            ? setCodigoSegmento('')
                            : setCodigoSegmento(newValue.CodSegmen);
                          setErrorsProcesso(false);
                          setHelperErrorsProcesso('');
                        }}
                        disablePortal
                        freeSolo
                        id="outlined-size-small"
                        options={rowsSegmento}
                        getOptionLabel={rowsSegmento => rowsSegmento.DesSegmen}
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

                    {/* Bot??o para Associar Segmento Selecionado ao Processo Definido */}

                    <Grid item xs={1} sm={1} md={1} align="center">
                      <Button
                        disabled={
                          NovoOuAlteracao[5] != 'CodProces=0' ? false : true
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
                          concluiAcao2(codigoSegmento, codigoProces);
                        }}>
                        +
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Lista de Segmentos J?? Associados ao Processo Definido */}

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
                          <ListItem key={row.CodSegmen}>
                            <ListItemText
                              primary={row.DesSegmen}></ListItemText>
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
                      href="/Processos">
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
                          transacaoIncluir ? 0 : dados[0].CodProces,
                          plusNovo
                        );
                        aplicaFiltro(valor);
                        submitForm();
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
                {NovoOuAlteracao[5] == 'CodProces=0' ? (
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/Processos/CadProcessos/CodProces=0"
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
                            transacaoIncluir ? 0 : dados[0].CodProces,
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
