import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';

import * as V from 'victory';
import { VictoryBar } from 'victory';

import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import Widgets from 'fusioncharts/fusioncharts.widgets';

import ReactApexChart from 'apexcharts';
import Chart from 'react-apexcharts';

import Cookies from 'universal-cookie';

import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import {
  Delete,
  Edit,
  HourglassBottom,
  HourglassEmpty,
  RotateLeft
} from '@material-ui/icons';

import { PageTitle } from '../../layout-components';

import {
  Container,
  FormHelperText,
  FormGroup,
  Checkbox,
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
  FormControl,
  makeStyles,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Paper
} from '@material-ui/core';

import {
  buscaProcessoPorEmpresa,
  buscaProcessoPorEmpresaDel,
  buscaVersaoDiagnostico,
  buscaNomeEmpresa,
  excluiProcesso,
  restauraProcesso,
  buscaAssunto,
  buscaPergunta,
  buscaResposta,
  incluiRespostas,
  buscaSegmento,
  BuscaTotalRespondido,
  incluiVersao,
  buscaProxVersao,
  buscaProcessosPorVersao,
  buscaParcialRespondido,
  incluiDataResposta,
  buscaProcessosFinalizados,
  buscaNotaProcesso,
  buscaNotaAvgProcesso,
  buscaNotaMaxProcesso,
  buscaProximoProcesso,
  buscaRisco,
  buscaProcessos
} from '../../services/relatoriosRespostasDosQuestionarios';

export default function ProcEmpresa() {
  const cookies = new Cookies();
  const [assunto, setAssunto] = useState([]);
  const [nomeProcesso, setNomeProcesso] = useState('');
  const [nomeProcesso2, setNomeProcesso2] = useState('');
  const [pergunta, setPergunta] = useState([]);
  const [resposta, setResposta] = useState([]);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [openEscolha, setOpenEscolha] = useState('');
  const [openEscolha2, setOpenEscolha2] = useState('');
  const [openEscolha3, setOpenEscolha3] = useState('');
  const [procEmpresa, setProcEmpresa] = useState([]);
  const [procEmpresaDel, setProcEmpresaDel] = useState([]);
  const [questoes, setQuestoes] = useState([]);
  const [selecao, setSelecao] = useState('');
  const [versaoDiagnostico, setVersaoDiagnostico] = useState([]);
  const [teste, setTeste] = useState(false);
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const history = useHistory();
  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
    history.push(mensagem.acao);
  };
  const handleClose2 = () => {
    setOpenEscolha2(false);
  };
  const handleClose3 = () => {
    setOpenEscolha3(false);
  };
  const [errors, setErrors] = useState(false);
  const [helperErrors, setHelperErrors] = useState(false);
  const url = window.location.href;
  const codigo = url.split('/');
  const codigo2 = 'Empresa.' + codigo[5];
  const codigoDaEmpresa = cookies.get('CodigoDaEmpresa');
  const nomeDaEmpresa = cookies.get('NomeDaEmpresa');
  const codigoGrpEmpresarial = cookies.get('CodigoGrpEmpresarial');
  const nomeGrpEmpresarial = cookies.get('NomeGrpEmpresarial');
  const [versao, setVersao] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [quantidadeDeEmpresas, setQuantidadeDeEmpresas] = useState('');
  const [codigoDoSegmento, setCodigoDoSegmento] = useState('');
  const [descricaoDoSegmento, setDescricaoDoSegmento] = useState('');
  const [codigoDoProcesso, setCodigoDoProcesso] = useState('');
  const [codigoDoProcesso2, setCodigoDoProcesso2] = useState('');
  const [hourGlass, setHourGlass] = useState('');
  const [totalRespondido, setTotalRespondido] = useState(true);
  const [parcialRespondido, setParcialRespondido] = useState(true);
  const [processoVersao, setProcessoVersao] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [proxVersao, setProxVersao] = useState([]);
  const [processosFinalizados, setProcessosFinalizados] = useState(false);
  const [tela, setTela] = useState('Questionário');
  const [notaProcesso, setNotaProcesso] = useState(0);
  const [notaAvgProcesso, setNotaAvgProcesso] = useState(0);
  const [notaMaxProcesso, setNotaMaxProcesso] = useState(0);
  const [noMessage1, setNoMessage1] = useState(false);
  const [noMessage2, setNoMessage2] = useState(false);
  const [risco, setRisco] = useState('');

  const populateDataProxProcesso = async (
    CodEmpres,
    Versao,
    CodSegmen,
    DesProces
  ) => {
    await buscaProximoProcesso(CodEmpres, Versao, CodSegmen, DesProces).then(
      data => {
        if (data.registros[0] !== undefined)
          if (data.registros[0].Next_CodProces != 'NULL') {
            setNomeProcesso2(data.registros[0].Next_DesProces);
            setCodigoDoProcesso2(data.registros[0].Next_CodProces);
          } else {
            setNomeProcesso2(data.registros[0].First_DesProces);
            setCodigoDoProcesso2(data.registros[0].First_CodProces);
          }
      }
    );
  };

  const populateDataNotaProcesso = async (
    CodEmpres,
    CodProces,
    Versao,
    CodSegmen
  ) => {
    await buscaNotaProcesso(CodEmpres, CodProces, Versao, CodSegmen).then(
      data => {
        if (data.registros[0].Nota !== undefined)
          setNotaProcesso(data.registros[0].Nota);
      }
    );
  };

  const populateDataAvgNotaProcesso = async (CodProces, CodSegmen) => {
    await buscaNotaAvgProcesso(CodProces, CodSegmen).then(data => {
      if (data.registros[0].Nota !== undefined)
        setNotaAvgProcesso(data.registros[0].Nota);
      setQuantidadeDeEmpresas(data.registros[0].QtdEmpresa);
    });
  };

  const populateDataMaxNotaProcesso = async (CodProces, CodSegmen) => {
    await buscaNotaMaxProcesso(CodProces, CodSegmen).then(data => {
      if (data.registros[0].Nota !== undefined)
        setNotaMaxProcesso(data.registros[0].Nota);
    });
  };

  const populateDataTotalRespondido = async (CodEmpres, Versao, CodSegmen) => {
    await BuscaTotalRespondido(CodEmpres, Versao, CodSegmen).then(data => {
      if (data.registros[0] !== undefined) {
        if (
          data.registros[0].QtdRespondida == data.registros[0].TotalPergunta
        ) {
          setTotalRespondido(false);
        } else {
          setTotalRespondido(true);
        }
      }
    });
  };

  const populateDataProcessosFinalizados = async (CodEmpres, Versao) => {
    await buscaProcessosFinalizados(CodEmpres, Versao).then(data => {
      if (data.registros[0] !== undefined) {
        if (
          data.registros[0].QtdProcessos -
            data.registros[0].ProcessoFinalizado ==
          1
        ) {
          setProcessosFinalizados(2);
        } else if (
          data.registros[0].QtdProcessos -
            data.registros[0].ProcessoFinalizado ==
          0
        ) {
          setProcessosFinalizados(0);
        } else {
          setProcessosFinalizados(1);
        }
      }
    });
  };

  const populateDataProcessoVersao = async CodSegmen => {
    await buscaProcessosPorVersao(CodSegmen).then(data => {
      if (data.registros != undefined) {
        setProcessoVersao(data.registros);
      }
    });
  };

  const populateDataProxVersao = async () => {
    await buscaProxVersao().then(data => {
      if (data.registros != undefined) {
        setProxVersao(data.registros[0].NovaVersao + 1);
      }
    });
  };

  const populateDataProcEmpresa = async versao => {
    if (versao !== '' && versao !== null && versao !== undefined) {
      await buscaProcessoPorEmpresa(
        codigoDaEmpresa,
        versao,
        codigoDoSegmento
      ).then(data => {
        setProcEmpresa(data.registros);
        setCodigoDoSegmento(data.registros[0].CodSegmen);
      });
    } else {
      setProcEmpresa([]);
    }
  };

  function createDataProcEmpresa(
    CodEmpres,
    NomEmpres,
    CodSegmen,
    CodProces,
    DesProces,
    QtdRespondida,
    TotalPergunta,
    ProcessoFinalizado
  ) {
    return {
      CodEmpres,
      NomEmpres,
      CodSegmen,
      CodProces,
      DesProces,
      QtdRespondida,
      TotalPergunta,
      ProcessoFinalizado
    };
  }

  let rowsProcEmpresa = [];
  rowsProcEmpresa = procEmpresa.map(each =>
    createDataProcEmpresa(
      each.CodEmpres,
      each.NomEmpres,
      each.CodSegmen,
      each.CodProces,
      each.DesProces,
      each.QtdRespondida,
      each.TotalPergunta,
      each.ProcessoFinalizado
    )
  );

  const populateDataProcEmpresaDel = async versao => {
    if (versao !== '' && versao !== null && versao !== undefined) {
      await buscaProcessoPorEmpresaDel(
        codigoDaEmpresa,
        versao,
        codigoDoSegmento
      ).then(data => {
        setProcEmpresaDel(data.registros);
      });
    } else {
      setProcEmpresaDel([]);
    }
  };

  function createDataProcEmpresaDel(
    CodEmpres,
    NomEmpres,
    CodSegmen,
    CodProces,
    DesProces
  ) {
    return {
      CodEmpres,
      NomEmpres,
      CodSegmen,
      CodProces,
      DesProces
    };
  }

  let rowsProcEmpresaDel = [];
  rowsProcEmpresaDel = procEmpresaDel.map(each =>
    createDataProcEmpresaDel(
      each.CodEmpres,
      each.NomEmpres,
      each.CodSegmen,
      each.CodProces,
      each.DesProces
    )
  );

  function createDataVersaoDiagnostico(Versao, DataFinal) {
    if (DataFinal == 'NULL') {
      DataFinal = 'Novo';
    } else {
      let DataFinal2 = DataFinal.split('T');
      let DataFinal3 = DataFinal2[0].split('-');
      let DataFinal4 = DataFinal2[1].split(':');
      DataFinal =
        DataFinal3[2] +
        '/' +
        DataFinal3[1] +
        '/' +
        DataFinal3[0] +
        ' ' +
        DataFinal4[0] +
        ':' +
        DataFinal4[1];
    }
    return {
      Versao,
      DataFinal
    };
  }

  let rowsVersaoDiagnostico = [];
  rowsVersaoDiagnostico = versaoDiagnostico.map(each =>
    createDataVersaoDiagnostico(each.Versao, each.DataFinal)
  );

  const populateDataProcessos = async (CodEmpres, Versao, CodSegmen) => {
    await buscaProcessos(CodEmpres, Versao, CodSegmen).then(data => {
      setProcessos(data.registros);
    });
  };

  function createDataProcessos(CodEmpres, NomEmpres, CodProces, DesProces) {
    return {
      CodEmpres,
      NomEmpres,
      CodProces,
      DesProces,
      Assunto: []
    };
  }

  let rowsProcessos = '';
  rowsProcessos = processos.map(each =>
    createDataProcessos(
      each.CodEmpres,
      each.NomEmpres,
      each.CodProces,
      each.DesProces
    )
  );

  const populateDataAssuntos = async (CodEmpres, CodProces, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      CodProces !== '' &&
      CodProces !== null &&
      CodProces !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaAssunto(CodEmpres, CodProces, Versao, codigoDoSegmento).then(
        data => {
          setAssunto(data.registros);
        }
      );
    } else {
      setAssunto([]);
    }
  };

  function createDataAssunto(
    CodEmpres,
    NomEmpres,
    CodProces,
    DesProces,
    CodAssunt,
    DesAssunt
  ) {
    return {
      CodEmpres,
      NomEmpres,
      CodProces,
      DesProces,
      CodAssunt,
      DesAssunt,
      Pergunta: []
    };
  }

  let rowsAssunto = '';
  rowsAssunto = assunto.map(each =>
    createDataAssunto(
      each.CodEmpres,
      each.NomEmpres,
      each.CodProces,
      each.DesProces,
      each.CodAssunt,
      each.DesAssunt
    )
  );

  const populateDataPergunta = async (CodEmpres, CodProces, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      CodProces !== '' &&
      CodProces !== null &&
      CodProces !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaPergunta(CodEmpres, CodProces, Versao, codigoDoSegmento).then(
        data => {
          setPergunta(data.registros);
        }
      );
    } else {
      setPergunta([]);
    }
  };

  function createDataPergunta(
    CodEmpres,
    NomEmpres,
    CodProces,
    DesProces,
    CodAssunt,
    DesAssunt,
    CodPergun,
    DesPergun
  ) {
    return {
      CodEmpres,
      NomEmpres,
      CodProces,
      DesProces,
      CodAssunt,
      DesAssunt,
      CodPergun,
      DesPergun,
      Resposta: []
    };
  }

  let rowsPergunta = '';
  rowsPergunta = pergunta.map(each =>
    createDataPergunta(
      each.CodEmpres,
      each.NomEmpres,
      each.CodProces,
      each.DesProces,
      each.CodAssunt,
      each.DesAssunt,
      each.CodPergun,
      each.DesPergun
    )
  );

  const populateDataResposta = async (CodEmpres, CodProces, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      CodProces !== '' &&
      CodProces !== null &&
      CodProces !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaResposta(CodEmpres, CodProces, Versao, codigoDoSegmento).then(
        data => {
          setResposta(data.registros);
        }
      );
    } else {
      setResposta([]);
    }
  };

  function createDataResposta(
    CodEmpres,
    NomEmpres,
    CodProces,
    DesProces,
    CodAssunt,
    DesAssunt,
    CodPergun,
    DesPergun,
    CodRespos,
    DesRespos,
    CodGrpRes,
    NomGrpRes,
    TipoRespo,
    Percentua,
    Peso,
    Nota
  ) {
    return {
      CodEmpres,
      NomEmpres,
      CodProces,
      DesProces,
      CodAssunt,
      DesAssunt,
      CodPergun,
      DesPergun,
      CodRespos,
      DesRespos,
      CodGrpRes,
      NomGrpRes,
      TipoRespo,
      Percentua,
      Peso,
      Nota
    };
  }

  let rowsResposta = '';
  rowsResposta = resposta.map(each =>
    createDataResposta(
      each.CodEmpres,
      each.NomEmpres,
      each.CodProces,
      each.DesProces,
      each.CodAssunt,
      each.DesAssunt,
      each.CodPergun,
      each.DesPergun,
      each.CodRespos,
      each.DesRespos,
      each.CodGrpRes,
      each.NomGrpRes,
      each.TipoRespo,
      each.Percentua,
      each.Peso,
      each.Nota
    )
  );

  let rowsQuestions = [];
  let processosN = rowsProcessos.length;
  let assuntoN = rowsAssunto.length;
  var perguntaN = rowsPergunta.length;
  var respostaN = rowsResposta.length;
  rowsQuestions = rowsProcessos;
  for (var x = 0; x < processosN; x++) {
    for (var i = 0; i < assuntoN; i++) {
      if (rowsQuestions[x].CodProces == rowsAssunto[i].CodProces) {
        rowsQuestions[x].Assunto.push(rowsAssunto[i]);
        for (var j = 0; j < perguntaN; j++) {
          if (
            rowsAssunto[i].CodAssunt == rowsPergunta[j].CodAssunt &&
            rowsAssunto[i].CodProces == rowsPergunta[j].CodProces
          ) {
            rowsAssunto[i].Pergunta.push(rowsPergunta[j]);
            for (var k = 0; k < respostaN; k++) {
              if (
                rowsPergunta[j].CodProces == rowsResposta[k].CodProces &&
                rowsPergunta[j].CodPergun == rowsResposta[k].CodPergun &&
                rowsPergunta[j].CodAssunt == rowsResposta[k].CodAssunt
              ) {
                rowsPergunta[j].Resposta.push(rowsResposta[k]);
              }
            }
          }
        }
      }
    }
  }

  console.log(rowsQuestions.map(row => row.DesProces));
  console.log(rowsQuestions);

  useEffect(() => {
    setRefresh(false);
    setLoading(true);
    setDados([]);
    let cancel = false;
    const runEffect = async () => {
      try {
        await buscaSegmento(codigoDaEmpresa).then(data => {
          if (data !== undefined) {
            setCodigoDoSegmento(data.registros[0].CodSegmen);
            setDescricaoDoSegmento(data.registros[0].DesSegmen);
          } else {
            setOpen(true);
            setMensagem({
              titulo: 'Aviso',
              conteudo:
                'Registro selecionado não existe! Selecione um registro existente.',
              acao: '/ProcEmpresa'
            });
          }
        });
        await buscaNomeEmpresa(codigoDaEmpresa).then(data => {
          if (data !== undefined) {
            setNomeEmpresa(data.registros[0].NomEmpres);
          } else {
            setOpen(true);
            setMensagem({
              titulo: 'Aviso',
              conteudo:
                'Registro selecionado não existe! Selecione um registro existente.',
              acao: '/ProcEmpresa'
            });
          }
        });
        await buscaVersaoDiagnostico(codigoDaEmpresa).then(data => {
          if (data !== undefined) {
            setVersaoDiagnostico(data.registros);
          } else {
            setOpen(true);
            setMensagem({
              titulo: 'Aviso',
              conteudo:
                'Registro selecionado não existe! Selecione um registro existente.',
              acao: '/ProcEmpresa'
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
  }, [refresh]);

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
        titleHeading="Relatórios"
        titleDescription="Respostas dos Questionários"
      />
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="flex-start" wrap="wrap">
            <Grid item xs={3}>
              <Box
                border={1}
                style={{
                  backgroundColor: '#f3f3f3',
                  minHeight: '720px',
                  borderColor: '#d9d9d9'
                }}>
                <Grid>
                  <div
                    className="searchBar"
                    style={{ fontSize: '16px', margin: '5px' }}>
                    Selecione o diagnóstico:
                  </div>
                  <Grid item xs={11}>
                    <Autocomplete
                      disableClearable
                      disablePortal
                      id="outlined-size-small"
                      options={rowsVersaoDiagnostico}
                      getOptionLabel={rowsVersaoDiagnostico =>
                        rowsVersaoDiagnostico.DataFinal
                      }
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setVersao('');
                        } else {
                          setVersao(newValue.Versao);
                          setDataFinal(newValue.DataFinal);
                          populateDataProcEmpresa(newValue.Versao);
                          populateDataProcEmpresaDel(newValue.Versao);
                          populateDataProcessoVersao(
                            codigoDaEmpresa,
                            codigoDoSegmento
                          );
                          populateDataProcessos(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                          populateDataAssuntos(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                          populateDataPergunta(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                          populateDataResposta(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                        }
                      }}
                      renderInput={params => (
                        <TextField
                          type="tel"
                          className="m-2"
                          fullWidth
                          variant="outlined"
                          {...params}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Divider />
                  <div
                    className="searchBar"
                    style={{ fontSize: '16px', margin: '5px' }}>
                    Questionários:
                  </div>
                  <List>
                    {rowsProcEmpresa.map(row => (
                      <ListItem
                        key={
                          row.CodEmpres +
                          '_' +
                          row.CodSegmen +
                          '_' +
                          row.CodProces
                        }>
                        <ListItemText primary={row.DesProces}></ListItemText>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <div
                    className="searchBar"
                    style={{ fontSize: '16px', margin: '5px' }}>
                    Excluídos:
                  </div>
                  <List>
                    {rowsProcEmpresaDel.map(row => (
                      <ListItem
                        key={
                          row.CodEmpres +
                          '_' +
                          row.CodSegmen +
                          '_' +
                          row.CodProces
                        }>
                        <ListItemText primary={row.DesProces}></ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={9}>
              {versao == '' ? (
                <Box
                  overflow="auto"
                  border={1}
                  style={{
                    minHeight: '720px',
                    maxHeight: '720px',
                    borderColor: '#d9d9d9'
                  }}
                />
              ) : (
                <Box
                  overflow="auto"
                  border={1}
                  style={{
                    minHeight: '720px',
                    maxHeight: '720px',
                    borderColor: '#d9d9d9'
                  }}>
                  <Grid item xs={12}>
                    <TextField
                      InputProps={{ disableUnderline: true, readOnly: true }}
                      inputProps={{
                        style: {
                          fontSize: 18,
                          fontWeight: 600,
                          color: '#580054'
                        }
                      }}
                      autoComplete="off"
                      fullWidth
                      className="m-2"
                      value={nomeGrpEmpresarial}
                      id="outlined-size-small"
                      size="small"
                    />
                  </Grid>
                  <Grid container>
                    <Grid item xs={9}>
                      <TextField
                        InputProps={{ disableUnderline: true, readOnly: true }}
                        inputProps={{
                          style: {
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#ed7d31',
                            marginLeft: 10
                          }
                        }}
                        autoComplete="off"
                        fullWidth
                        className="m-2"
                        value={nomeDaEmpresa}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        InputProps={{ disableUnderline: true, readOnly: true }}
                        inputProps={{
                          style: {
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#ed7d31'
                          }
                        }}
                        autoComplete="off"
                        fullWidth
                        className="m-2"
                        value={'Finalizado em: ' + dataFinal}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Divider style={{ marginLeft: 15 }} />
                  <Grid item xs={12}>
                    <List>
                      {rowsQuestions.map(row => (
                        <>
                          <ListItem key={row.CodEmpres + ' ' + row.CodProces}>
                            <ListItemText
                              className="searchBar"
                              style={{ marginLeft: 25 }}
                              primary={row.DesProces}></ListItemText>
                          </ListItem>
                          <Divider
                            style={{ background: '#580054', marginLeft: 35 }}
                          />
                          <Grid item xs={12}>
                            <List>
                              {row.Assunto.map(row => (
                                <>
                                  <ListItem
                                    key={
                                      row.CodEmpres +
                                      ' ' +
                                      row.CodProces +
                                      ' ' +
                                      row.CodAssunt
                                    }>
                                    <ListItemText
                                      style={{
                                        maxWidth: '600px',
                                        minWidth: '600px',
                                        color: '#ed7d31',
                                        marginLeft: 40
                                      }}
                                      primary={row.DesAssunt}></ListItemText>
                                  </ListItem>
                                  <Divider
                                    style={{
                                      background: '#ed7d31',
                                      marginLeft: 50
                                    }}
                                  />
                                  <Grid item xs={12}>
                                    <List>
                                      {row.Pergunta.map(row => (
                                        <>
                                          <ListItem
                                            key={
                                              row.CodEmpres +
                                              ' ' +
                                              row.CodProces +
                                              ' ' +
                                              row.CodAssunt +
                                              ' ' +
                                              row.CodPergun
                                            }>
                                            <Grid item xs={9}>
                                              <ListItemText
                                                style={{ 
                                                  marginLeft: 65
                                                }}
                                                primary={
                                                  row.DesPergun
                                                }></ListItemText>
                                            </Grid>
                                            <Grid item xs={3}>
                                              {row.Resposta.map(row => (
                                                <TextField
                                                  InputProps={{
                                                    disableUnderline: true,
                                                    readOnly: true
                                                  }}
                                                  inputProps={{
                                                    style: {
                                                      fontSize: 18,
                                                      fontWeight: 600,
                                                      color: '#ed7d31',
                                                      marginLeft: 10
                                                    }
                                                  }}
                                                  autoComplete="off"
                                                  fullWidth
                                                  className="m-2"
                                                  value={row.DesRespos}
                                                  id="outlined-size-small"
                                                  size="small"
                                                />
                                              ))}
                                            </Grid>
                                          </ListItem>
                                        </>
                                      ))}
                                    </List>
                                  </Grid>
                                </>
                              ))}
                            </List>
                          </Grid>
                        </>
                      ))}
                    </List>
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
