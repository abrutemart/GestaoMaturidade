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

import Carregando from '../../assets/images/loader2.gif';

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
  buscaRespostaRisco1,
  buscaRespostaRisco2
} from '../../services/procEmpresa';

import {
  buscaDiagnosticos,
  buscaAnalises
} from '../../services/analisesSuaEmpresa';

export default function ProcEmpresa() { 
  const cookies = new Cookies();
  const [assunto, setAssunto] = useState([]);
  const [nomeProcesso, setNomeProcesso] = useState('');
  const [nomeProcesso2, setNomeProcesso2] = useState('');
  const [pergunta, setPergunta] = useState([]);
  const [resposta, setResposta] = useState([]);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menorPercent, setMenorPercent] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [openEscolha, setOpenEscolha] = useState('');
  const [openEscolha2, setOpenEscolha2] = useState('');
  const [openEscolha3, setOpenEscolha3] = useState('');
  const [procEmpresa, setProcEmpresa] = useState([]);
  const [respostaRisco1, setRespostaRisco1] = useState([]);
  const [respostaRisco2, setRespostaRisco2] = useState([]);
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
  const [proxVersao, setProxVersao] = useState([]);
  const [processosFinalizados, setProcessosFinalizados] = useState(false);
  const [tela, setTela] = useState('Questionário');
  const [notaProcesso, setNotaProcesso] = useState(0);
  const [notaAvgProcesso, setNotaAvgProcesso] = useState(0);
  const [notaMaxProcesso, setNotaMaxProcesso] = useState(0);
  const [noMessage1, setNoMessage1] = useState(false);
  const [noMessage2, setNoMessage2] = useState(false);
  const [risco, setRisco] = useState('');

  ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);
  ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

  // Define the colorVariations of the angular gauge
  const colorRange = {
    color: [
      {
        minValue: '0',
        maxValue: '25',
        code: '#F2726F'
      },
      {
        minValue: '25',
        maxValue: '50',
        code: '#FFC533'
      },
      {
        minValue: '50',
        maxValue: '75',
        code: '#fee002'
      },
      {
        minValue: '75',
        maxValue: '100',
        code: '#15e606'
      }
    ]
  };
  //Set up the dial value
  const dials = {
    dial: [
      {
        value: notaProcesso
      }
    ]
  };

  // Create a JSON object to store the chart configurations
  const chartConfigs = {
    type: 'angulargauge', // The chart type
    width: '300', // Width of the chart
    height: '176', // Height of the chart
    dataFormat: 'json', // Data type
    dataSource: {
      chart: {
        caption: '',
        showvalue: '1',
        numbersuffix: '%',
        subcaption: '',
        lowerLimit: '0',
        upperLimit: '100',
        theme: 'fusion'
      },
      colorRange: colorRange,
      dials: dials
    }
  };

  const populateDataRisco = async (CodEmpres, CodProces, Versao, CodSegmen) => {
    await buscaRisco(CodEmpres, CodProces, Versao, CodSegmen).then(data => {
      if (data.registros[0] !== undefined) {
        setRisco(data.registros);
      } else {
        setRisco('');
      }
    });
  };

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

  const populateDataParcialRespondido = async (
    CodEmpres,
    Versao,
    CodSegmen,
    CodProces
  ) => {
    await buscaParcialRespondido(CodEmpres, Versao, CodSegmen, CodProces).then(
      data => {
        if (
          data.registros[0].QtdRespondida == data.registros[0].TotalPergunta
        ) {
          setParcialRespondido(false);
        } else {
          setParcialRespondido(true);
        }
      }
    );
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
        setCodigoDoSegmento(cookies.get('CodigoDoSegmento'));
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
    CodProces,
    Versao,
    DataFinal,
    CodAssunt,
    DesAssunt
  ) {
    return {
      CodEmpres,
      CodProces,
      Versao,
      DataFinal,
      CodAssunt,
      DesAssunt,
      Pergunta: []
    };
  }

  let rowsAssunto = '';
  rowsAssunto = assunto.map(each =>
    createDataAssunto(
      each.CodEmpres,
      each.CodProces,
      each.Versao,
      each.DataFinal,
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
    CodProces,
    Versao,
    DataFinal,
    CodAssunt,
    CodPergun,
    DesPergun
  ) {
    return {
      CodEmpres,
      CodProces,
      Versao,
      DataFinal,
      CodAssunt,
      CodPergun,
      DesPergun,
      Resposta: []
    };
  }

  let rowsPergunta = '';
  rowsPergunta = pergunta.map(each =>
    createDataPergunta(
      each.CodEmpres,
      each.CodProces,
      each.Versao,
      each.DataFinal,
      each.CodAssunt,
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
    CodProces,
    Versao,
    DataFinal,
    CodAssunt,
    CodPergun,
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
      CodProces,
      Versao,
      DataFinal,
      CodAssunt,
      CodPergun,
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
      each.CodProces,
      each.Versao,
      each.DataFinal,
      each.CodAssunt,
      each.CodPergun,
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

  const populateDataRespostaRisco = async (
    CodEmpres,
    CodProces,
    Versao,
    CodSegmen
  ) => {
    var A = '';
    var B = '';
    await buscaRespostaRisco1(CodEmpres, CodProces, Versao, CodSegmen).then(
      data => {
        A = data.registros;
      }
    );
    await buscaRespostaRisco2(CodEmpres, CodProces, Versao, CodSegmen).then(
      data => {
        B = data.registros;
      }
    );
    let x = true;
    for (i = 0; i < A.length; i++) {
      if (A[i].Percentua == B[i].Percentua) x = true;
      if (x == true) {
        setMenorPercent(true);
      }
    }
  };

  var resposta2 = rowsResposta;

  let rowsQuestions = [];
  let assuntoN = rowsAssunto.length;
  var perguntaN = rowsPergunta.length;
  var respostaN = rowsResposta.length;
  rowsQuestions = rowsAssunto;
  for (var i = 0; i < assuntoN; i++) {
    for (var j = 0; j < perguntaN; j++) {
      if (rowsQuestions[i].CodAssunt == rowsPergunta[j].CodAssunt) {
        rowsQuestions[i].Pergunta.push(rowsPergunta[j]);
        for (var k = 0; k < respostaN; k++) {
          if (rowsPergunta[j].CodPergun == rowsResposta[k].CodPergun) {
            rowsPergunta[j].Resposta.push(rowsResposta[k]);
          }
        }
      }
    }
  }

  const analise = async CodEmpres => {
    if (CodEmpres != '' && CodEmpres != null && CodEmpres != undefined) {
      await buscaAnalises(CodEmpres).then(data => {
        if (data.registros[0] != undefined) {
          cookies.set('Analises', 'true', {
            path: '/'
          });
        }
      });
    }
  };

  const finalizaDiagnóstico = (CodEmpres, Versao) => {
    let cancel = false;
    const altera = async () => {
      try {
        processoVersao.map(row => {
          incluiVersao(CodEmpres, row.CodProces, Versao, proxVersao);
        });
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ProcEmpresa'
        });
      }
    };
    altera();
    return () => {
      cancel = true;
    };
  };

  const finalizaQuestionário = (CodEmpres, Versao) => {
    let cancel = false;
    const altera = async () => {
      try {
        resposta2.map(row => {
          incluiDataResposta(CodEmpres, codigoDoProcesso, Versao);
        });
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ProcEmpresa'
        });
      } finally {
        populateDataResposta(codigoDaEmpresa, codigoDoProcesso, versao);
        populateDataProcEmpresa(versao);
        populateDataTotalRespondido(codigoDaEmpresa, versao, codigoDoSegmento);
        populateDataParcialRespondido(
          codigoDaEmpresa,
          versao,
          codigoDoSegmento,
          codigoDoProcesso
        );
      }
    };
    altera();
    return () => {
      cancel = true;
    };
  };

  const alteraNota = (
    CodEmpres,
    CodProces,
    Versao,
    CodPergun,
    CodGrpRes,
    CodRespos,
    NovaNota,
    CodAssunt
  ) => {
    let cancel = false;
    const altera = async () => {
      try {
        resposta2.map(row => {
          if (row.CodAssunt == CodAssunt && row.CodPergun == CodPergun)
            incluiRespostas(
              CodEmpres,
              CodProces,
              Versao,
              CodPergun,
              CodGrpRes,
              row.CodRespos,
              CodRespos,
              NovaNota == 0 ? 0.0001 : NovaNota
            );
        });
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ProcEmpresa'
        });
      } finally {
        populateDataResposta(codigoDaEmpresa, codigoDoProcesso, versao);
        populateDataProcEmpresa(versao);
        populateDataTotalRespondido(codigoDaEmpresa, versao, codigoDoSegmento);
        populateDataParcialRespondido(
          codigoDaEmpresa,
          versao,
          codigoDoSegmento,
          CodProces
        );
        populateDataProcessosFinalizados(codigoDaEmpresa, versao);
      }
    };
    altera();
    populateDataResposta(codigoDaEmpresa, codigoDoProcesso, versao);
    return () => {
      cancel = true;
    };
  };

  const montaLink = page => {
    history.push(page);
  };

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
      }
    };
    runEffect();
    return () => {
      cancel = true;
    };
  }, [refresh]);

  const clickExcluir = (CodEmpres, CodProces, Versao) => {
    setSelecao([CodEmpres, CodProces, Versao]);
    setOpenEscolha(true);
  };

  const deleteProcesso = (CodEmpres, CodProces, Versao) => {
    let cancel = false;
    const exclui = async () => {
      try {
        const excluirProcesso = await excluiProcesso(
          CodEmpres,
          CodProces,
          Versao
        );
        if (excluirProcesso !== false) {
          setNomeProcesso('');
          setTela('Questionário');
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
          populateDataProcEmpresa(Versao);
          populateDataProcEmpresaDel(Versao);
        } else {
          setMensagem({
            titulo: 'Atenção',
            conteudo: 'Este processo está associado a um ou mais diagnosticos'
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
          acao: '/ProcEmpresa'
        });
      }
    };
    exclui();
    return () => {
      cancel = true;
    };
  };

  const restoreProcesso = (CodEmpres, CodProces, Versao) => {
    let cancel = false;
    const exclui = async () => {
      try {
        await restauraProcesso(CodEmpres, CodProces, Versao);
        setNomeProcesso('');
        setTela('Questionário');
        setMensagem({
          titulo: 'Sucesso',
          conteudo: 'Ação realizada com sucesso!'
        });
        setOpen(true);
        if (cancel) {
          return;
        }

        populateDataProcEmpresa(Versao);
        populateDataProcEmpresaDel(Versao);
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ProcEmpresa'
        });
      }
    };
    exclui();
    return () => {
      cancel = true;
    };
  };

  const load = () => {
    setLoading(false);
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
            onClick={() => deleteProcesso(selecao[0], selecao[1], selecao[2])}
            color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEscolha2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Aviso</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Após a conclusão desta etapa, não será mais possível alterar as
            respostas deste processo. Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} color="primary" autoFocus>
            Não
          </Button>
          <Button
            onClick={() => {
              finalizaQuestionário(codigoDaEmpresa, versao);
              populateDataNotaProcesso(
                codigoDaEmpresa,
                codigoDoProcesso,
                versao,
                codigoDoSegmento
              );
              populateDataAvgNotaProcesso(codigoDoProcesso, codigoDoSegmento);
              populateDataMaxNotaProcesso(codigoDoProcesso, codigoDoSegmento);
              populateDataProcessosFinalizados(codigoDaEmpresa, versao);
              populateDataRespostaRisco(
                codigoDaEmpresa,
                codigoDoProcesso,
                versao,
                codigoDoSegmento
              );
              setTela('Nota');
              handleClose2();
            }}
            color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEscolha3}
        onClose={handleClose3}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Aviso</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Após a conclusão desta etapa, não será mais possível alterar
            qualquer uma das respostas deste diagnóstico. Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose3} color="primary" autoFocus>
            Não
          </Button>
          <Button
            onClick={() => {
              finalizaQuestionário(codigoDaEmpresa, versao);
              finalizaDiagnóstico(codigoDaEmpresa, versao);
              populateDataNotaProcesso(
                codigoDaEmpresa,
                codigoDoProcesso,
                versao,
                codigoDoSegmento
              );
              populateDataAvgNotaProcesso(codigoDoProcesso, codigoDoSegmento);
              populateDataMaxNotaProcesso(codigoDoProcesso, codigoDoSegmento);
              populateDataRespostaRisco(
                codigoDaEmpresa,
                codigoDoProcesso,
                versao,
                codigoDoSegmento
              );
              setTela('Nota');
              populateDataProcessosFinalizados(codigoDaEmpresa, versao);
              cookies.set('Diagnósticos', 'true', {
                path: '/'
              });
              handleClose3();
            }}
            color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <PageTitle titleHeading="Processos por Empresa" titleDescription="Menu" />
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
                          setNomeProcesso('');
                          setVersao(newValue.Versao);
                          setDataFinal(newValue.DataFinal);
                          populateDataProcEmpresa(newValue.Versao);
                          populateDataProcEmpresaDel(newValue.Versao);
                          populateDataTotalRespondido(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                          populateDataProcessoVersao(codigoDoSegmento);
                          populateDataProxVersao();
                          setTela('Questionário');
                        }
                        /* setErrorsProcesso(false);
                      setHelperErrorsProcesso(''); */
                      }}
                      renderInput={params => (
                        <TextField
                          type="tel"
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
                  <Divider />
                  <div
                    className="searchBar"
                    style={{ fontSize: '16px', margin: '5px' }}>
                    Questionários:
                  </div>
                  <List>
                    {rowsProcEmpresa.map(row => (
                      <ListItem
                        button
                        key={
                          row.CodEmpres +
                          '_' +
                          row.CodSegmen +
                          '_' +
                          row.CodProces
                        }>
                        <ListItemText
                          primary={row.DesProces}
                          onClick={() => {
                            if (row.ProcessoFinalizado == 1) {
                              setNoMessage1(true);
                            } else setLoading(true);
                            setNoMessage1(false);
                            setNomeProcesso(row.DesProces);
                            setCodigoDoProcesso(row.CodProces);
                            populateDataAssuntos(
                              row.CodEmpres,
                              row.CodProces,
                              versao
                            );
                            populateDataPergunta(
                              row.CodEmpres,
                              row.CodProces,
                              versao
                            );
                            populateDataResposta(
                              row.CodEmpres,
                              row.CodProces,
                              versao
                            );
                            populateDataParcialRespondido(
                              row.CodEmpres,
                              versao,
                              codigoDoSegmento,
                              row.CodProces
                            );
                            populateDataProcessosFinalizados(
                              codigoDaEmpresa,
                              versao
                            );
                            populateDataRisco(
                              row.CodEmpres,
                              row.CodProces,
                              versao,
                              codigoDoSegmento
                            );
                            setTela('Questionário');
                            setTimeout(() => load(), 1000);
                          }}></ListItemText>
                        {dataFinal == 'Novo' ? (
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              onClick={() =>
                                clickExcluir(
                                  row.CodEmpres,
                                  row.CodProces,
                                  versao
                                )
                              }>
                              <Delete />
                            </IconButton>
                            {row.ProcessoFinalizado == 1 ? (
                              <CheckIcon />
                            ) : row.QtdRespondida > 0 ? (
                              <HourglassEmpty />
                            ) : (
                              ''
                            )}
                          </ListItemSecondaryAction>
                        ) : (
                          ''
                        )}
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
                        {dataFinal == 'Novo' ? (
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              onClick={() =>
                                restoreProcesso(
                                  row.CodEmpres,
                                  row.CodProces,
                                  versao
                                )
                              }>
                              <RotateLeft />
                            </IconButton>
                          </ListItemSecondaryAction>
                        ) : (
                          ''
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Box>
            </Grid>
            {/* DECISÃO QUESTIONÁRIO OU RESULTADO PARCIAL */}
            {tela == 'Questionário' ? (
              /* QUESTIONÁRIO */
              <Grid item xs={9}>
                <Box
                  overflow="auto"
                  border={1}
                  style={{
                    minHeight: '720px',
                    maxHeight: '720px',
                    borderColor: '#d9d9d9',
                    backgroundColor: '#ffffff'
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
                      value={
                        nomeProcesso == ''
                          ? nomeEmpresa
                          : 'Diagnóstico - ' +
                            nomeProcesso +
                            ' - ' +
                            nomeEmpresa
                      }
                      id="outlined-size-small"
                      size="small"
                    />
                  </Grid>
                  <Divider />
                  <Grid container xs={12}>
                    {nomeProcesso == '' ? (
                      ''
                    ) : loading == true ? (
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        direction="column"
                        style={{ minHeight: '60vh' }}
                        spacing={5}>
                        <Grid item>
                          <img
                            className="app-sidebar-logo"
                            alt="Lobtec"
                            src={Carregando}
                            style={{  minHeight: '25vh', minWidth: '25vh' }}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <List>
                        {rowsQuestions.map(row => (
                          <>
                            <ListItem key={row.CodAssunt}>
                              <ListItemText
                                className="searchBar"
                                primary={row.DesAssunt}></ListItemText>
                            </ListItem>
                            <Divider />
                            <Grid container xs={12}>
                              <List>
                                {row.Pergunta.map(row => (
                                  <>
                                    <ListItem
                                      key={
                                        row.CodAssunt + ' ' + row.CodPergunta
                                      }>
                                      <ListItemText
                                        style={{
                                          maxWidth: '500px',
                                          maxHeight: '60px',
                                          minWidth: '500px',
                                          minHeight: '40px'
                                        }}
                                        primary={row.DesPergun}></ListItemText>
                                      <FormControl component="fieldset">
                                        <RadioGroup
                                          row
                                          aria-label="gender"
                                          defaultValue="female"
                                          name="radio-buttons-group">
                                          {row.Resposta.map(row => (
                                            <>
                                              <FormControlLabel
                                                disabled={
                                                  row.DataFinal != 'NULL'
                                                    ? true
                                                    : false
                                                }
                                                value={row.DesRespos}
                                                control={
                                                  row.TipoRespo == 1 ? (
                                                    <Radio
                                                      color="primary"
                                                      onClick={e => {
                                                        alteraNota(
                                                          row.CodEmpres,
                                                          row.CodProces,
                                                          row.Versao,
                                                          row.CodPergun,
                                                          row.CodGrpRes,
                                                          row.CodRespos,
                                                          (row.Peso *
                                                            row.Percentua) /
                                                            100,
                                                          row.CodAssunt
                                                        );
                                                        populateDataResposta(
                                                          codigoDaEmpresa,
                                                          codigoDoProcesso,
                                                          versao
                                                        );
                                                        populateDataProcEmpresa(
                                                          versao
                                                        );
                                                        populateDataTotalRespondido(
                                                          codigoDaEmpresa,
                                                          versao,
                                                          codigoDoSegmento
                                                        );
                                                        populateDataParcialRespondido(
                                                          codigoDaEmpresa,
                                                          versao,
                                                          codigoDoSegmento,
                                                          row.CodProces
                                                        );
                                                        populateDataProcessosFinalizados(
                                                          codigoDaEmpresa,
                                                          versao
                                                        );
                                                      }}
                                                    />
                                                  ) : (
                                                    <Checkbox
                                                      color="primary"
                                                      onClick={e => {
                                                        alteraNota(
                                                          row.CodEmpres,
                                                          row.CodProces,
                                                          row.Versao,
                                                          row.CodPergun,
                                                          row.CodGrpRes,
                                                          row.CodRespos,
                                                          10,
                                                          row.CodAssunt
                                                        );
                                                        populateDataResposta(
                                                          codigoDaEmpresa,
                                                          codigoDoProcesso,
                                                          versao
                                                        );
                                                        populateDataProcEmpresa(
                                                          versao
                                                        );
                                                        populateDataTotalRespondido(
                                                          codigoDaEmpresa,
                                                          versao,
                                                          codigoDoSegmento
                                                        );
                                                        populateDataParcialRespondido(
                                                          codigoDaEmpresa,
                                                          versao,
                                                          codigoDoSegmento,
                                                          row.CodProces
                                                        );
                                                        populateDataProcessosFinalizados(
                                                          codigoDaEmpresa,
                                                          versao
                                                        );
                                                      }}
                                                    />
                                                  )
                                                }
                                                label={row.DesRespos}
                                                checked={
                                                  row.Nota > 0 &&
                                                  row.Nota != 'NULL'
                                                    ? true
                                                    : false
                                                }></FormControlLabel>
                                            </>
                                          ))}
                                        </RadioGroup>
                                      </FormControl>
                                    </ListItem>
                                    <Divider />
                                  </>
                                ))}
                              </List>
                            </Grid>
                          </>
                        ))}
                      </List>
                    )}
                  </Grid>
                </Box>

                <Grid
                  container
                  justify="space-around"
                  spacing={2}
                  textAlign="center">
                  <Grid item xs={12}></Grid>
                  {nomeProcesso == '' ? (
                    ''
                  ) : (
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
                          onClick={() => {
                            setTela('Questionário');
                            setNomeProcesso('');
                          }}>
                          Voltar para o Painel
                        </Button>
                      </Box>
                    </Grid>
                  )}
                  {dataFinal != 'Novo' ? (
                    ''
                  ) : nomeProcesso == '' ? (
                    ''
                  ) : (
                    <Grid item xs={12} sm={12} md={4}>
                      <Box sx={{ width: '100%' }} textAlign="center">
                        <Button
                          disabled={parcialRespondido}
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
                            if (noMessage1 == false) {
                              if (processosFinalizados == 2) {
                                if (noMessage2 == false) {
                                  setOpenEscolha3(true);
                                } else {
                                  setTela('Nota');
                                  populateDataNotaProcesso(
                                    codigoDaEmpresa,
                                    codigoDoProcesso,
                                    versao,
                                    codigoDoSegmento
                                  );
                                  populateDataAvgNotaProcesso(
                                    codigoDoProcesso,
                                    codigoDoSegmento
                                  );
                                  populateDataMaxNotaProcesso(
                                    codigoDoProcesso,
                                    codigoDoSegmento
                                  );
                                  populateDataProcessosFinalizados(
                                    codigoDaEmpresa,
                                    versao
                                  );
                                  populateDataRespostaRisco(
                                    codigoDaEmpresa,
                                    codigoDoProcesso,
                                    versao,
                                    codigoDoSegmento
                                  );
                                }
                              } else {
                                setOpenEscolha2(true);
                              }
                            } else {
                              setTela('Nota');
                              populateDataNotaProcesso(
                                codigoDaEmpresa,
                                codigoDoProcesso,
                                versao,
                                codigoDoSegmento
                              );
                              populateDataAvgNotaProcesso(
                                codigoDoProcesso,
                                codigoDoSegmento
                              );
                              populateDataMaxNotaProcesso(
                                codigoDoProcesso,
                                codigoDoSegmento
                              );
                            }
                            populateDataProxProcesso(
                              codigoDaEmpresa,
                              versao,
                              codigoDoSegmento,
                              nomeProcesso
                            );
                            populateDataProcessosFinalizados(
                              codigoDaEmpresa,
                              versao
                            );
                            populateDataRespostaRisco(
                              codigoDaEmpresa,
                              codigoDoProcesso,
                              versao,
                              codigoDoSegmento
                            );
                          }}>
                          Ver Resultado Parcial
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ) : (
              /* RESULTADO PARCIAL */
              <Grid item xs={9}>
                <Box
                  overflow="auto"
                  border={1}
                  style={{
                    minHeight: '720px',
                    maxHeight: '720px',
                    borderColor: '#d9d9d9',
                    backgroundColor: '#ffffff'
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
                      value={
                        'Resultado Parcial do Diagnóstico - ' +
                        nomeProcesso +
                        ' - ' +
                        nomeEmpresa
                      }
                      id="outlined-size-small"
                      size="small"
                    />
                  </Grid>
                  <Divider />
                  <Grid container>
                    <Grid
                      container
                      xs={5}
                      style={{ justifyContent: 'flex-start' }}>
                      <Grid item xs={12} style={{ textAlignLast: 'center' }}>
                        <ReactFC {...chartConfigs} />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      xs={7}
                      style={{ justifyContent: 'flex-start' }}>
                      <Grid item xs={12}>
                        <div
                          className="searchBar"
                          style={{ fontSize: '16px', margin: '13px' }}>
                          O índice desse processo para sua empresa é de{' '}
                          {notaProcesso.toFixed(1)} (variação de 0 a 100)
                        </div>
                        <div
                          className="searchBar"
                          style={{ fontSize: '16px', margin: '13px' }}>
                          O índice médio desse processo no seu segmento{' '}
                          {descricaoDoSegmento} é de{' '}
                          {quantidadeDeEmpresas > 2
                            ? notaAvgProcesso.toFixed(1)
                            : 55.0}
                        </div>
                        <div
                          className="searchBar"
                          style={{ fontSize: '16px', margin: '13px' }}>
                          O índice dos melhores do seu segmento{' '}
                          {descricaoDoSegmento} é de{' '}
                          {quantidadeDeEmpresas > 2
                            ? notaMaxProcesso.toFixed(1)
                            : 75.0}
                        </div>
                        <Divider />
                        <div
                          className="searchBar"
                          style={{ fontSize: '16px', margin: '13px' }}>
                          Finalize o diagnóstico para obter uma análise mais
                          detalhada.
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12}>
                        {risco != '' && menorPercent == true ? (
                          <Card
                            className="p-4 mb-4"
                            style={{
                              backgroundColor: '#ffb3fb',
                              margin: '13px'
                            }}>
                            <div
                              className="searchBar"
                              style={{ fontSize: '16px', margin: '1px' }}>
                              Atenção: Conheça alguns riscos que sua empresa
                              corre:
                            </div>
                            <List>
                              {risco.map(row => (
                                <ListItem key={row.CodRisco}>
                                  <ListItemText
                                    primary={
                                      '- ' + row.DesRisco
                                    }></ListItemText>
                                </ListItem>
                              ))}
                            </List>
                          </Card>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>

                <Grid
                  container
                  justify="space-around"
                  spacing={2}
                  textAlign="center">
                  <Grid item xs={12}></Grid>
                  {nomeProcesso == '' ? (
                    ''
                  ) : (
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
                          onClick={() => {
                            setTela('Questionário');
                            setNomeProcesso('');
                          }}>
                          Voltar para o Painel
                        </Button>
                      </Box>
                    </Grid>
                  )}
                  {dataFinal != 'Novo' ? (
                    ''
                  ) : nomeProcesso == '' ? (
                    ''
                  ) : (
                    <Grid item xs={12} sm={12} md={4}>
                      <Box sx={{ width: '100%' }} textAlign="center">
                        {processosFinalizados == 0 ? (
                          <Button
                            onLoad={analise(codigoDaEmpresa)}
                            style={{
                              maxWidth: '800px',
                              maxHeight: '60px',
                              minWidth: '180px',
                              minHeight: '40px'
                            }}
                            className="m-2"
                            variant="contained"
                            color="primary"
                            href="/AnalisesSuaEmpresa">
                            Análise da sua Empresa
                          </Button>
                        ) : (
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
                              setNomeProcesso(nomeProcesso2);
                              setCodigoDoProcesso(codigoDoProcesso2);
                              populateDataAssuntos(
                                codigoDaEmpresa,
                                codigoDoProcesso2,
                                versao
                              );
                              populateDataPergunta(
                                codigoDaEmpresa,
                                codigoDoProcesso2,
                                versao
                              );
                              populateDataResposta(
                                codigoDaEmpresa,
                                codigoDoProcesso2,
                                versao
                              );
                              populateDataParcialRespondido(
                                codigoDaEmpresa,
                                versao,
                                codigoDoSegmento,
                                codigoDoProcesso2
                              );
                              populateDataProcessosFinalizados(
                                codigoDaEmpresa,
                                versao
                              );
                              populateDataRisco(
                                codigoDaEmpresa,
                                codigoDoProcesso2,
                                versao,
                                codigoDoSegmento
                              );
                              setTela('Questionário');
                            }}>
                            Responder o Próximo
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
