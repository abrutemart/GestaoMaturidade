import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
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
  buscaProcessos,
  incluiProcesso,
  alteraProcesso,
  buscaSegmento,
  buscaProcessoSegmento,
  incluiSegmentoProcesso,
  excluiSegmentoProcesso,
  buscaPerguntaPorProcesso,
  buscaPerguntaPorProcesso2,
  incluiProcessoImagem,
  inserePeso,
  buscaTotalPeso,
  alteraPeso
} from 'services/processosPorSegmentos';
import { Paper } from '@material-ui/core';
import Processos from 'pages/Processos';

const useStyles1 = makeStyles(theme => ({
  input: {
    background: theme.palette.secondary.main,
    border: `1px solid white !important`,
    flex: 1,
    padding: '8px !important',
    '&[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none !important',
      margin: 0
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none !important',
      margin: 0
    }
  }
}));

export default function CadProcessosPorSegmentos() {
  const [desSegmen, setDesSegmen] = useState({ DesSegmen: '' });
  const [desProces, setDesProces] = useState({ DesProces: '' });
  const [atualizacao, setAtualizacao] = useState(true);
  const classes = useStyles1();
  const [filtro, setFiltro] = useState(null);
  const [codigoSegmento, setCodigoSegmento] = useState('');
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [valor2, setValor2] = useState('');
  const [peso, setPeso] = useState('');
  const [pesoTotal, setPesoTotal] = useState('');
  const [novoPeso, setNovoPeso] = useState('');
  const [antigoPeso, setAntigoPeso] = useState('');
  const [dados, setDados] = useState([]);
  const [processo, setProcesso] = useState([]);
  const [perguntaProcesso, setPerguntaProcesso] = useState([]);
  const [perguntaProcesso2, setPerguntaProcesso2] = useState([]);
  const [segmento, setSegmento] = useState([]);
  const [segmentoProcesso, setSegmentoProcesso] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [selecao1, setSelecao1] = useState('');
  const [selecao2, setSelecao2] = useState('');
  const [rowCode, setRowCode] = useState('');
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');
  const [errorsProcesso, setErrorsProcesso] = useState(false);
  const [helperErrorsProcesso, setHelperErrorsProcesso] = useState('');
  const [refresh, setRefresh] = useState(false);

  const handler2 = event => {
    const value = event.target.value;
    const setValue = value <= 100 ? value : peso;
    setPeso(setValue);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
    setOpenEscolha(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const populateProcesso = async segmentoEscolhido => {
    if (
      segmentoEscolhido !== '' &&
      segmentoEscolhido !== null &&
      segmentoEscolhido !== undefined
    ) {
      await buscaProcessos(segmentoEscolhido).then(data => {
        setProcesso(data.registros);
      });
    } else {
      setProcesso([]);
    }
  };

  function createDataProcesso(CodProces, DesProces, CodImagem) {
    return { CodProces, DesProces, CodImagem };
  }

  let rowsProcesso = [];
  rowsProcesso = processo.map(each =>
    createDataProcesso(each.CodProces, each.DesProces, each.CodImagem)
  );

  function createDataSegmento(CodSegmen, DesSegmen) {
    return { CodSegmen, DesSegmen };
  }

  let rowsSegmento = [];
  rowsSegmento = segmento.map(each =>
    createDataSegmento(each.CodSegmen, each.DesSegmen)
  );

  function createDataSegmentoProcesso(
    CodSegmen,
    CodProces,
    DesSegmen,
    DesProces,
    Hora
  ) {
    return { CodSegmen, CodProces, DesSegmen, DesProces, Hora };
  }

  let rowsSegmentoProcesso = [];
  rowsSegmentoProcesso = segmentoProcesso.map(each =>
    createDataSegmentoProcesso(
      each.CodSegmen,
      each.CodProces,
      each.DesSegmen,
      each.DesProces,
      each.Hora
    )
  );

  function createDataPerguntaProcesso(
    DesPergun,
    PesoNovo,
    PesoAntigo,
    CodProces,
    CodPergun,
    DataAlter,
    HoraAlter
  ) {
    return {
      DesPergun,
      PesoNovo,
      PesoAntigo,
      CodProces,
      CodPergun,
      DataAlter,
      HoraAlter
    };
  }

  function createDataPerguntaProcesso2(CodPergun, DesPergun) {
    return {
      CodPergun,
      DesPergun
    };
  }

  const populatePerguntaProcesso2 = async processoEscolhido => {
    if (
      processoEscolhido !== '' &&
      processoEscolhido !== null &&
      processoEscolhido !== undefined
    ) {
      await buscaPerguntaPorProcesso2(processoEscolhido).then(data => {
        if (data !== undefined) {
          setPerguntaProcesso2(
            data.registros.map(each =>
              createDataPerguntaProcesso2(each.CodPergun, each.DesPergun)
            )
          );
        } else setPerguntaProcesso([]);
      });
    }
  };

  const url = window.location.href;
  const urlSplit = url.split('/');
  const filtro2 = urlSplit[5];
  const codigos = filtro2.replace(/_/g, ' '); // 'CodSegmen=x AND CodProces=y'
  const codigos2 = codigos.replace(/Cod/g, 'SP.Cod'); // 'SP.CodSegmen=x AND SP.CodProces=y'
  const codigos3 = codigos2.split('AND'); // ['SP.CodSegmen=x ', ' SP.CodProces=y']
  const codigos4 = codigos.split('AND'); //['CodSegmen=x ', ' CodProces=y']

  useEffect(() => {
    setRefresh(false);
    setTransacaoIncluir(false);
    setLoading(true);
    setDados([]);
    let cancel = false;
    if (filtro2 !== 'CodSegmen=0_AND_CodProces=0') {
      const runEffect = async () => {
        try {
          await buscaProcessoSegmento(codigos3[0], codigos3[1]).then(data => {
            if (data !== undefined) {
              setSegmentoProcesso(data.registros);
              setValor(data.registros[0].DesProces);
              setValor2(data.registros[0].DesSegmen);
              setDesSegmen({
                CodSegmen: data.registros[0].CodSegmen,
                DesSegmen: data.registros[0].DesSegmen
              });
              setDesProces({
                CodProces: data.registros[0].CodProces,
                DesProces: data.registros[0].DesProces
              });
              setCodigoSegmento(data.registros[0].CodSegmen);
            } else setSegmentoProcesso([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setSegmentoProcesso([]);
          console.log(err);
        }
        try {
          await buscaPerguntaPorProcesso(codigos4[1]).then(data => {
            if (data !== undefined) {
              setPerguntaProcesso2(
                data.registros.map(each =>
                  createDataPerguntaProcesso(
                    each.DesPergun,
                    each.PesoNovo,
                    each.PesoAntigo,
                    each.CodProces,
                    each.CodPergun,
                    each.DataAlter,
                    each.HoraAlter
                  )
                )
              );
            } else setPerguntaProcesso([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setPerguntaProcesso([]);
          console.log(err);
        }
        try {
          await buscaTotalPeso(codigos4[1]).then(data => {
            if (data !== undefined) {
              setPesoTotal(data.registros[0].Total);
            } else setPesoTotal([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setPesoTotal([]);
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
      const runEffect = async () => {
        try {
          await buscaTotalPeso(codigos4[1]).then(data => {
            if (data !== undefined) {
              setPesoTotal(data.registros[0].Total);
            } else setPesoTotal([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setPesoTotal([]);
          console.log(err);
        }
        try {
          await buscaSegmento().then(data => {
            if (data !== undefined) {
              setSegmento(data.registros);
            } else setSegmento([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setSegmento([]);
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
  }, [filtro2, refresh]);

  const changePeso = (CodPergunta, NovoPeso, AntigoPeso) => {
    let totalPeso = pesoTotal;
    if (NovoPeso == undefined) {
      NovoPeso = 0;
    }
    if (AntigoPeso == undefined) {
      AntigoPeso = 0;
    }
    if (pesoTotal == 'NULL') {
      totalPeso = 0;
    }    

    var objIndex = perguntaProcesso2.findIndex(
      obj => obj.CodPergun == CodPergunta
    );
    if (NovoPeso != '') {
      if (parseFloat(NovoPeso) != 0) {        
        if (totalPeso + parseFloat(NovoPeso) - parseFloat(AntigoPeso) < 101) {
          perguntaProcesso2[objIndex].PesoNovo = NovoPeso;
          perguntaProcesso2[objIndex].PesoAntigo = NovoPeso;

          let sum = 0;
          for (let i = 0; i < perguntaProcesso2.length; i++) {
            sum += parseFloat(perguntaProcesso2[i].PesoNovo);
          }
          setPesoTotal(sum);
        } else alert('A somatória de pesos não pode ser superior a 100');
      } else alert('O campo peso deve possuir valor diferente de 0');
    } else alert('O campo peso é obrigatório');
  };

  const alterarPeso = () => {
    var codSegmento = codigos4[0].replace('CodSegmen=', '');
    var codProces = codigos4[1].replace('CodProces=', '');
    
    if (codSegmento == 0) {
      codSegmento = desSegmen.CodSegmen;
    }
    if (codProces == 0) {
      codProces = desProces.CodProces;
    }
    
    setLoading(true);
    let cancel = false;
    const insere = async () => {
      try {
        if (pesoTotal < 101) {
          for (let i = 0; i < perguntaProcesso2.length; i++) {
            inserePeso(
              codSegmento,
              codProces,
              perguntaProcesso2[i].CodPergun,
              parseFloat(perguntaProcesso2[i].PesoNovo)
            );
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!',
              acao: '/ProcessosPorSegmentos'
            });
            setOpen2(true);
            if (cancel) {
              return;
            }
          }
        } else {
          setMensagem({
            titulo: 'Aviso',
            conteudo: 'A somatória de pesos deve ser igual a 100!'
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
          acao: '/ProcessosPorSegmentos'
        });
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    insere();
  };

  const distribuiPeso = () => {
    let sum = 0;
    for (let i = 0; i < perguntaProcesso2.length; i++) {
      var pesoDistribuido = 100 / perguntaProcesso2.length;
      perguntaProcesso2[i].PesoNovo = pesoDistribuido;
      sum += parseFloat(perguntaProcesso2[i].PesoNovo);
    }
    setPesoTotal(sum);
  };

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
        titleHeading="Peso por Perguntas"
        titleDescription={
          NovoOuAlteracao[5] != 'CodSegmen=0_AND_CodProces=0'
            ? 'Alteração do Peso das Perguntas'
            : 'Cadastro Peso das Perguntas'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              <Grid item xs={12} sm={12} md={12}>
                <div className="searchBar">Segmento</div>
              </Grid>

              {/* Nome do Segmento */}
              <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                  disabled={
                    NovoOuAlteracao[5] != 'CodSegmen=0_AND_CodProces=0'
                      ? true
                      : false
                  }
                  value={desSegmen}
                  ListboxProps={{ style: { maxHeight: '15rem' } }}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsSegmento}
                  getOptionLabel={rowsSegmento => rowsSegmento.DesSegmen}
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      setDesSegmen('');
                      setProcesso([]);
                    } else {
                      setDesSegmen({
                        CodSegmen: newValue.CodSegmen,
                        DesSegmen: newValue.DesSegmen
                      });
                      let segmentoEscolhido = newValue.CodSegmen;
                      populateProcesso(segmentoEscolhido);
                    }
                    setDesProces('');
                    /* setErrorsDesSegmen(false);
                  setHelperErrorsDesSegmen(''); */
                  }}
                  renderInput={params => (
                    <TextField
                      type="tel"
                      /* helperText={helperErrorsDesSegmen}
                    error={errorsDesSegmen} */
                      className="m-2"
                      placeholder="Selecione um Segmento"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <div className="searchBar">Processo</div>
              </Grid>

              {/* Nome do Processo */}
              <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                  disabled={
                    NovoOuAlteracao[5] != 'CodSegmen=0_AND_CodProces=0'
                      ? true
                      : false
                  }
                  value={desProces}
                  ListboxProps={{ style: { maxHeight: '15rem' } }}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsProcesso}
                  getOptionLabel={rowsProcesso => rowsProcesso.DesProces}
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      setDesProces('');
                    } else {
                      setDesProces({
                        CodProces: newValue.CodProces,
                        DesProces: newValue.DesProces
                      });
                      let processoEscohido = newValue.CodProces;
                      populatePerguntaProcesso2(processoEscohido);
                    }
                    /* setErrorsDesProces(false);
                  setHelperErrorsDesProces(''); */
                  }}
                  renderInput={params => (
                    <TextField
                      type="tel"
                      /* helperText={helperErrorsDesProces}
                    error={errorsDesProces} */
                      className="m-2"
                      placeholder="Selecione um Processo"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              {/* Lista de Perguntas Já Associados ao Processo Definido */}

              <Grid item xs={10} sm={10} md={10}>
                <div className="searchBar">Pergunta</div>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <div className="searchBar">Peso</div>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Paper
                  style={{
                    maxHeight: '310px',
                    minHeight: '310px',
                    overflow: 'auto'
                  }}>
                  <List>
                    {perguntaProcesso2.map(row => (
                      <ListItem key={row.CodPergun}>
                        <ListItemText
                          style={{
                            maxWidth: '700px',
                            minWidth: '700px'
                          }}
                          primary={row.DesPergun}>
                          {' '}
                        </ListItemText>
                        {row.CodPergun === rowCode ? (
                          <>
                            <ListItemSecondaryAction>
                              <TextField
                                id="outlined-size-small"
                                size="small"
                                type="number"
                                autoComplete="off"
                                value={peso}
                                InputProps={{
                                  max: 100,
                                  min: 0.1
                                }}
                                inputProps={{ step: '0.1' }}
                                onChange={handler2}
                                onBlur={e => {
                                  changePeso(
                                    row.CodPergun,
                                    peso,
                                    row.PesoAntigo
                                  );
                                  setRowCode('');
                                  setPeso('');
                                }}
                                variant="outlined"
                                style={{
                                  maxWidth: '80px',
                                  minWidth: '80px'
                                }}></TextField>
                            </ListItemSecondaryAction>
                          </>
                        ) : (
                          <>
                            <ListItemSecondaryAction>
                              <TextField
                                id="outlined-size-small"
                                value={row.PesoNovo}
                                size="small"
                                type="number"
                                autoComplete="off"
                                InputProps={{
                                  max: 100,
                                  min: 0
                                }}
                                onFocus={() => {
                                  setRowCode(row.CodPergun);
                                  setPeso(row.PesoNovo);
                                  setAtualizacao(false);
                                  
                                }}
                                variant="outlined"
                                onBlur={e => {
                                  setNovoPeso(e.target.value);
                                }}
                                style={{
                                  maxWidth: '80px',
                                  minWidth: '80px'
                                }}></TextField>
                            </ListItemSecondaryAction>
                          </>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              <Grid
                container
                justify="flex-end"
                spacing={2}
                text-align="right"
                alignItems="center"
                alignContent="right">
                <Grid item xs={2} sm={2} md={2} text-align-last="right">
                  <div className="searchBar">Peso Total</div>
                </Grid>
                <Grid item xs={2} sm={2} md={2} text-align="right">
                  <TextField
                    disabled
                    id="outlined-size-small"
                    size="small"
                    type="number"
                    autoComplete="off"
                    value={pesoTotal}
                    variant="outlined"
                    style={{
                      maxWidth: '80px',
                      minWidth: '80px'
                    }}></TextField>
                </Grid>
              </Grid>

              <Grid
                container
                justify="space-around"
                spacing={2}
                textAlign="end">
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
                      href="/ProcessosPorSegmentos">
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
                      onClick={alterarPeso}>
                      Confirmar
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
                      onClick={distribuiPeso}>
                      Distribuir Pesos Igualmente
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
