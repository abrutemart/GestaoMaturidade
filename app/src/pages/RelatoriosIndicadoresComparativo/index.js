import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

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
  AppBar,
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Tabs,
  Tab,
  Container,
  FormHelperText,
  FormGroup,
  Checkbox,
  Grid,
  Button,
  TextField,
  FormControl,
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
  buscaPergunta,
  buscaResposta,
  buscaSegmento,
  BuscaTotalRespondido,
  buscaProxVersao,
  buscaProcessosPorVersao,
  buscaNotaTodosProcessos,
  buscaRisco,
  buscaGrpResposta,
  buscaCategPercent,
  buscaCategorias,
  buscaProcesPercent,
  buscaNotaAvg,
  buscaNotaMax,
  buscaCategPercentMaxAvg,
  buscaProcesPercentMaxAvg,
  buscaRespostaRisco1Total,
  buscaRespostaRisco2Total,
  buscaRiscoTotal,
  buscaPtoForteEFraco
} from '../../services/analisesSuaEmpresa';

export default function ProcEmpresa() {
  const cookies = new Cookies();
  const [quantidadeDeEmpresas, setQuantidadeDeEmpresas] = useState('');
  const [assunto, setAssunto] = useState([]);
  const [nomeProcesso, setNomeProcesso] = useState('');
  const [nomeProcesso2, setNomeProcesso2] = useState('');
  const [ptoForteEFraco, setPtoForteEFraco] = useState([]);
  const [pergunta, setPergunta] = useState([]);
  const [resposta, setResposta] = useState([]);
  const [grpResposta, setGrpResposta] = useState([]);
  const [categPercent, setCategPercent] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [procesPercent, setProcesPercent] = useState([]);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [openEscolha, setOpenEscolha] = useState('');
  const [openEscolha2, setOpenEscolha2] = useState('');
  const [openEscolha3, setOpenEscolha3] = useState('');
  const [procEmpresa, setProcEmpresa] = useState([]);
  const [procEmpresaDel, setProcEmpresaDel] = useState([]);
  const [categPercentMaxAvg, setCategPercentMaxAvg] = useState([]);
  const [procesPercentMaxAvg, setProcesPercentMaxAvg] = useState([]);
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
  const nomeGrpEmpresarial = cookies.get('NomeGrpEmpresarial');
  const [versao, setVersao] = useState('');
  const [dataFinal, setDataFinal] = useState('');
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
  const [tela, setTela] = useState('Question??rio');
  const [notaTodosProcessos, setNotaTodosProcessos] = useState(0);
  const [notaAvg, setNotaAvg] = useState(0);
  const [notaMax, setNotaMax] = useState(0);
  const [noMessage1, setNoMessage1] = useState(false);
  const [noMessage2, setNoMessage2] = useState(false);
  const [risco, setRisco] = useState('');

  ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);
  ReactFC.fcRoot(FusionCharts, Widgets, FusionTheme);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        {...other}>
        {value === index && <Box p={0}>{children}</Box>}
      </Typography>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper
    }
  }));

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Define the colorVariations of the angular gauge
  const colorRange = {
    color: [
      {
        minValue: '0',
        maxValue: '25',
        code: '#ff0000'
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

  // Define the colorVariations of the angular gauge 2
  const colorRange2 = {
    color: [
      {
        minValue: '0',
        maxValue: '100',
        code: '#e6e6e6'
      }
    ]
  };

  //Set up the dial value
  const dials = {
    dial: [
      {
        value: notaTodosProcessos,
        bgColor: '#482365',
        showValue: '1',
        valueX: '160',
        valueY: '170',
        tooltext: 'Seu ??ndice',
        rearExtension: '15'
      }
    ]
  };

  //Set up the dial value 2
  const dials2 = {
    dial: [
      {
        value: notaTodosProcessos,
        bgColor: '#482365',
        showValue: '1',
        valueX: '300',
        valueY: '250',
        tooltext: 'Seu ??ndice',
        rearExtension: '15'
      }
    ]
  };

  // Create a JSON object to store the chart configurations
  const chartConfigs = {
    type: 'angulargauge', // The chart type
    width: '320', // Width of the chart
    height: '220', // Height of the chart
    dataFormat: 'json', // Data type
    dataSource: {
      chart: {
        pYAxisNameFontColor: '#000000',
        caption: '',
        showvalue: '0',
        /* numbersuffix: '%', */
        subcaption: '',
        lowerLimit: '0',
        upperLimit: '100',
        theme: 'fusion',
        valueFontColor: '#ffffff',
        valueFontSize: '20',
        valueFontBold: '1',
        valueBgColor: '#482365',
        valueBorderColor: '#999999',
        valueBorderRadius: '2'
      },
      colorRange: colorRange,
      dials: dials
    }
  };

  // Create a JSON object to store the chart configurations 2
  const chartConfigs2 = {
    type: 'angulargauge', // The chart type
    width: '600', // Width of the chart
    height: '300', // Height of the chart
    dataFormat: 'json', // Data type
    dataSource: {
      chart: {
        pYAxisNameFontColor: '#000000',
        caption: '',
        showvalue: '0',
        /* numbersuffix: '%', */
        subcaption: '',
        lowerLimit: '0',
        upperLimit: '100',
        theme: 'fusion',
        valueFontColor: '#ffffff',
        valueFontSize: '20',
        valueFontBold: '1',
        valueBgColor: '#482365',
        valueBorderColor: '#999999',
        valueBorderRadius: '2'
      },
      colorRange: colorRange2,
      dials: dials2,
      trendpoints: {
        point: [
          {
            startValue: quantidadeDeEmpresas > 2 ? notaAvg.toFixed(1) : 55.0,
            displayValue:
              'M??dia: ' +
              (quantidadeDeEmpresas > 2 ? notaAvg.toFixed(1) : 55.0),
            dashed: '1',
            thickness: '3',
            trendValueDistance: '30',
            useMarker: '1',
            color: '#18c2ff',
            markerColor: '#18c2ff',
            markerBorderColor: '#666666',
            markerRadius: '10',
            markerTooltext: 'M??dia do Mercado'
          },
          {
            startValue: quantidadeDeEmpresas > 2 ? notaMax.toFixed(1) : 75.0,
            displayValue:
              'Melhores: ' +
              (quantidadeDeEmpresas > 2 ? notaMax.toFixed(1) : 75.0),
            dashed: '1',
            thickness: '3',
            trendValueDistance: '30',
            useMarker: '2',
            color: '#fc4e07',
            markerColor: '#fc4e07',
            markerBorderColor: '#666666',
            markerRadius: '10',
            markerTooltext: 'Melhores'
          }
        ]
      }
    }
  };

  const populateDataAvgNota = async (CodProces, CodSegmen) => {
    await buscaNotaAvg(CodProces, CodSegmen).then(data => {
      if (data.registros[0].Nota !== undefined)
        setNotaAvg(data.registros[0].Nota);
      setQuantidadeDeEmpresas(data.registros[0].QtdEmpresa);
    });
  };

  const populateDataMaxNota = async (CodProces, CodSegmen) => {
    await buscaNotaMax(CodProces, CodSegmen).then(data => {
      if (data.registros[0].Nota !== undefined)
        setNotaMax(data.registros[0].Nota);
    });
  };

  const populateDataRisco = async (CodEmpres, CodProces, Versao, CodSegmen) => {
    await buscaRisco(CodEmpres, CodProces, Versao, CodSegmen).then(data => {
      console.log(data, data.registros, data.registros[0]);
      if (data.registros[0] !== undefined) {
        setRisco(data.registros);
      } else {
        setRisco('');
      }
    });
  };

  const populateDataNotaTodosProcessos = async (
    CodEmpres,
    Versao,
    CodSegmen
  ) => {
    await buscaNotaTodosProcessos(CodEmpres, Versao, CodSegmen).then(data => {
      if (data.registros[0].Nota !== undefined)
        setNotaTodosProcessos(data.registros[0].Nota);
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

  const populateDataResposta = async (CodEmpres, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaResposta(CodEmpres, Versao, codigoDoSegmento).then(data => {
        setResposta(data.registros);
      });
    } else {
      setResposta([]);
    }
  };

  function createDataResposta(
    CodGrpRes,
    NomGrpRes,
    CodRespos,
    DesRespos,
    QtdRespostas,
    Total,
    Porcentagem
  ) {
    return {
      CodGrpRes,
      NomGrpRes,
      CodRespos,
      DesRespos,
      QtdRespostas,
      Total,
      Porcentagem
    };
  }

  let rowsResposta = '';
  rowsResposta = resposta.map(each =>
    createDataResposta(
      each.CodGrpRes,
      each.NomGrpRes,
      each.CodRespos,
      each.DesRespos,
      each.QtdRespostas,
      each.Total,
      each.Porcentagem
    )
  );

  const populateDataGrpResposta = async (CodEmpres, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaGrpResposta(CodEmpres, Versao, codigoDoSegmento).then(data => {
        setGrpResposta(data.registros);
      });
    } else {
      setGrpResposta([]);
    }
  };

  function createDataGrupos(CodGrpRes, NomGrpRes) {
    return {
      CodGrpRes,
      NomGrpRes,
      Resposta: []
    };
  }

  let rowsGrupos = '';
  rowsGrupos = grpResposta.map(each =>
    createDataGrupos(each.CodGrpRes, each.NomGrpRes)
  );

  let rowsGrpResposta = [];
  let grpRespostaN = rowsGrupos.length;
  var respostaN = rowsResposta.length;
  rowsGrpResposta = rowsGrupos;
  for (var i = 0; i < grpRespostaN; i++) {
    for (var j = 0; j < respostaN; j++) {
      if (rowsGrpResposta[i].CodGrpRes == resposta[j].CodGrpRes) {
        rowsGrpResposta[i].Resposta.push(resposta[j]);
      }
    }
  }

  const populateDataCategPercent = async (CodEmpres, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaCategPercent(CodEmpres, Versao, codigoDoSegmento).then(
        data => {
          setCategPercent(data.registros);
        }
      );
    } else {
      setCategPercent([]);
    }
  };

  function createDataCategPercent(
    CodCatego,
    DesCatego,
    QtdRespostas,
    Total,
    Porcentagem
  ) {
    return {
      CodCatego,
      DesCatego,
      QtdRespostas,
      Total,
      Porcentagem
    };
  }

  let rowsCategPercent = '';
  rowsCategPercent = categPercent.map(each =>
    createDataCategPercent(
      each.CodCatego,
      each.DesCatego,
      each.QtdRespostas,
      each.Total,
      each.Porcentagem
    )
  );

  const populateDataCategPercentMaxAvg = async CodSegmen => {
    if (CodSegmen !== '' && CodSegmen !== null && CodSegmen !== undefined) {
      await buscaCategPercentMaxAvg(codigoDoSegmento).then(data => {
        setCategPercentMaxAvg(data.registros);
      });
    } else {
      setCategPercentMaxAvg([]);
    }
  };

  function createDataCategPercentMaxAvg(
    CodCatego,
    DesCatego,
    QtdRespostas,
    Total,
    Maximo,
    Media
  ) {
    return {
      CodCatego,
      DesCatego,
      QtdRespostas,
      Total,
      Maximo,
      Media
    };
  }

  let rowsCategPercentMaxAvg = '';
  rowsCategPercentMaxAvg = categPercentMaxAvg.map(each =>
    createDataCategPercentMaxAvg(
      each.CodCatego,
      each.DesCatego,
      each.QtdRespostas,
      each.Total,
      each.Maximo,
      each.Media
    )
  );

  const populateDataCategorias = async (CodEmpres, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaCategorias(CodEmpres, Versao, codigoDoSegmento).then(data => {
        setCategorias(data.registros);
      });
    } else {
      setCategorias([]);
    }
  };

  function createDataCategorias(CodCatego, DesCatego) {
    return {
      CodCatego,
      DesCatego,
      Resposta: []
    };
  }

  let rowsCategorias = '';
  rowsCategorias = categorias.map(each =>
    createDataCategorias(each.CodCatego, each.DesCatego)
  );

  let rowsCateg = [];
  let categoriasN = rowsCategorias.length;
  var categPercentN = rowsCategPercent.length;
  rowsCateg = rowsCategorias;
  for (var i = 0; i < categoriasN; i++) {
    for (var j = 0; j < categPercentN; j++) {
      if (rowsCateg[i].CodCatego == rowsCategPercent[j].CodCatego) {
        rowsCateg[i].Resposta.push(rowsCategPercent[j]);
      }
    }
  }

  const populateDataProcesPercent = async (CodEmpres, Versao) => {
    if (
      CodEmpres !== '' &&
      CodEmpres !== null &&
      CodEmpres !== undefined &&
      Versao !== '' &&
      Versao !== null &&
      Versao !== undefined
    ) {
      await buscaProcesPercent(CodEmpres, Versao, codigoDoSegmento).then(
        data => {
          setProcesPercent(data.registros);
        }
      );
    } else {
      setProcesPercent([]);
    }
  };

  function createDataProcesPercent(
    Codproces,
    DesProces,
    QtdRespostas,
    Total,
    Porcentagem
  ) {
    return {
      Codproces,
      DesProces,
      QtdRespostas,
      Total,
      Porcentagem
    };
  }

  let rowsProcesPercent = '';
  rowsProcesPercent = procesPercent.map(each =>
    createDataProcesPercent(
      each.Codproces,
      each.DesProces,
      each.QtdRespostas,
      each.Total,
      each.Porcentagem
    )
  );

  const load = () => {
    setLoading(false);
  };

  const populateDataProcesPercentMaxAvg = async CodSegmen => {
    if (CodSegmen !== '' && CodSegmen !== null && CodSegmen !== undefined) {
      await buscaProcesPercentMaxAvg(codigoDoSegmento).then(data => {
        setProcesPercentMaxAvg(data.registros);
      });
    } else {
      setProcesPercentMaxAvg([]);
    }
  };

  function createDataProcesPercentMaxAvg(
    CodProces,
    DesProces,
    QtdRespostas,
    Total,
    Maximo,
    Media
  ) {
    return {
      CodProces,
      DesProces,
      QtdRespostas,
      Total,
      Maximo,
      Media
    };
  }

  let rowsProcesPercentAvgMax = '';
  rowsProcesPercentAvgMax = procesPercentMaxAvg.map(each =>
    createDataProcesPercentMaxAvg(
      each.CodProces,
      each.DesProces,
      each.QtdRespostas,
      each.Total,
      each.Maximo,
      each.Media
    )
  );

  const populateDataRiscoTotal = async (CodEmpres, Versao, CodSegmen) => {
    let A = '';
    let B = '';
    await buscaRespostaRisco1Total(CodEmpres, Versao, CodSegmen).then(data => {
      A = data.registros;
    });
    await buscaRespostaRisco2Total(CodEmpres, Versao, CodSegmen).then(data => {
      B = data.registros;
    });
    let x = true;
    for (i = 0; i < A.length; i++) {
      if (A[i].Percentua == B[i].Percentua) x = true;
      if (x == true) {
        buscaRiscoTotal(CodEmpres, Versao, CodSegmen).then(data => {
          setRisco(data.registros);
        });
      }
    }
  };

  const populateDataPontoForteEFraco = async (CodEmpres, Versao, CodSegmen) => {
    await buscaPtoForteEFraco(CodEmpres, Versao, CodSegmen).then(data => {
      setPtoForteEFraco(data.registros);
    });
  };

  function createDataPontoForteEFraco(
    CodAssunt,
    DesAssunt,
    PtoForte,
    PtoFraco,
    Porcentagem
  ) {
    return {
      CodAssunt,
      DesAssunt,
      PtoForte,
      PtoFraco,
      Porcentagem
    };
  }

  let rowsPtoForteEFraco = '';
  rowsPtoForteEFraco = ptoForteEFraco.map(each =>
    createDataPontoForteEFraco(
      each.CodAssunt,
      each.DesAssunt,
      each.PtoForte,
      each.PtoFraco,
      each.Porcentagem
    )
  );

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
                'Registro selecionado n??o existe! Selecione um registro existente.',
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
                'Registro selecionado n??o existe! Selecione um registro existente.',
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
                'Registro selecionado n??o existe! Selecione um registro existente.',
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
        titleHeading="Relat??rios"
        titleDescription="Indicadores de Comparativo com o Mercado"
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
                  maxHeight: '720px',
                  borderColor: '#d9d9d9'
                }}>
                <Grid>
                  <div
                    className="searchBar"
                    style={{ fontSize: '16px', margin: '5px' }}>
                    Selecione o diagn??stico:
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
                          setLoading(true);
                          populateDataNotaTodosProcessos(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                          populateDataResposta(
                            codigoDaEmpresa,
                            newValue.Versao
                          );
                          populateDataGrpResposta(
                            codigoDaEmpresa,
                            newValue.Versao
                          );
                          populateDataPontoForteEFraco(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                          populateDataCategPercent(
                            codigoDaEmpresa,
                            newValue.Versao
                          );
                          populateDataCategorias(
                            codigoDaEmpresa,
                            newValue.Versao
                          );
                          populateDataProcesPercent(
                            codigoDaEmpresa,
                            newValue.Versao
                          );
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
                          populateDataRiscoTotal(
                            codigoDaEmpresa,
                            newValue.Versao,
                            codigoDoSegmento
                          );
                          populateDataAvgNota(codigoDoSegmento);
                          populateDataMaxNota(codigoDoSegmento);
                          populateDataCategPercentMaxAvg(codigoDoSegmento);
                          populateDataProcesPercentMaxAvg(codigoDoSegmento);
                        }
                        setTimeout(() => load(), 4000);
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
                    Question??rios:
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
                    Exclu??dos:
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
              <Box
                border={1}
                style={{
                  minHeight: '720px',
                  maxHeight: '720px',
                  borderColor: '#d9d9d9',
                  backgroundColor: '#ffffff'
                }}>
                {versao == '' ? (
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
                        style={{ minHeight: '25vh', minWidth: '25vh' }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Box
                    overflow="auto"
                    border={1}
                    style={{
                      minHeight: '720px',
                      maxHeight: '720px',
                      borderColor: '#d9d9d9',
                      backgroundColor: '#ffffff'
                    }}>
                    <br />
                    <Grid container>
                      <Grid
                        container
                        xs={12}
                        style={{ justifyContent: 'flex-start' }}
                        spacing={2}>
                        <Grid item xs={12} style={{ textAlignLast: 'center' }}>
                          <div
                            className="searchBar"
                            style={{
                              fontSize: '16px',
                              margin: '1px',
                              marginLeft: '15px',
                              fontWeight: 600,
                              textAlignLast: 'left'
                            }}>
                            ??ndice
                          </div>
                          <Divider variant="middle" />
                          <br />
                          <ReactFC {...chartConfigs2} />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center">
                        <Grid
                          container
                          xs={4}
                          alignItems="center"
                          justifyContent="center"
                          justify="center">
                          <Card
                            className="p-4 mb-4"
                            style={{
                              backgroundColor: '#482365',
                              margin: '2px',
                              minHeight: '100px',
                              maxHeight: '100px',
                              minWidth: '130px',
                              maxWidth: '130px'
                            }}>
                            <div
                              /* className="searchBar" */
                              style={{
                                fontSize: '16px',
                                margin: '1px',
                                fontWeight: 600,
                                color: '#ffffff',
                                textAlignLast: 'center'
                              }}>
                              Seu ??ndice
                              <div
                                /* className="searchBar" */
                                style={{
                                  fontSize: '32px',
                                  margin: '1px',
                                  fontWeight: 600,
                                  color: '#ffffff',
                                  textAlignLast: 'center'
                                }}>
                                {notaTodosProcessos.toFixed(1)}
                              </div>
                            </div>
                            <List>
                              {/* Lembrar de colocar um hifen em cada topico */}
                            </List>
                          </Card>
                        </Grid>
                        <Grid
                          container
                          xs={4}
                          alignItems="center"
                          justifyContent="center"
                          justify="center">
                          <Card
                            className="p-4 mb-4"
                            style={{
                              backgroundColor: '#18c2ff',
                              margin: '2px',
                              minHeight: '100px',
                              maxHeight: '100px',
                              minWidth: '130px',
                              maxWidth: '130px'
                            }}>
                            <div
                              /* className="searchBar" */
                              style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#ffffff',
                                textAlignLast: 'center'
                              }}>
                              M??dia
                              <div
                                /* className="searchBar" */
                                style={{
                                  fontSize: '32px',
                                  margin: '1px',
                                  fontWeight: 600,
                                  color: '#ffffff',
                                  textAlignLast: 'center'
                                }}>
                                {quantidadeDeEmpresas > 2
                                  ? notaAvg.toFixed(1)
                                  : 55.0}
                              </div>
                            </div>
                            <List>
                              {/* Lembrar de colocar um hifen em cada topico */}
                            </List>
                          </Card>
                        </Grid>
                        <Grid
                          container
                          xs={4}
                          alignItems="center"
                          justifyContent="center"
                          justify="center">
                          <Card
                            className="p-4 mb-4"
                            style={{
                              backgroundColor: '#df6618',
                              margin: '2px',
                              minHeight: '100px',
                              maxHeight: '100px',
                              minWidth: '130px',
                              maxWidth: '130px'
                            }}>
                            <div
                              /* className="searchBar" */
                              style={{
                                fontSize: '16px',
                                margin: '1px',
                                fontWeight: 600,
                                color: '#ffffff',
                                textAlignLast: 'center'
                              }}>
                              Melhores
                              <div
                                /* className="searchBar" */
                                style={{
                                  fontSize: '32px',
                                  margin: '1px',
                                  fontWeight: 600,
                                  color: '#ffffff',
                                  textAlignLast: 'center'
                                }}>
                                {quantidadeDeEmpresas > 2
                                  ? notaMax.toFixed(1)
                                  : 75.0}
                              </div>
                            </div>
                            <List>
                              {/* Lembrar de colocar um hifen em cada topico */}
                            </List>
                          </Card>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        xs={12}
                        style={{ justifyContent: 'flex-start' }}
                        spacing={2}>
                        <Grid item xs={12} style={{ textAlignLast: 'center' }}>
                          <div
                            className="searchBar"
                            style={{
                              fontSize: '16px',
                              margin: '1px',
                              marginLeft: '15px',
                              fontWeight: 600,
                              textAlignLast: 'left'
                            }}>
                            N??vel de Execu????o (Comparativo)
                          </div>
                          <Divider variant="middle" />
                          <br />
                          <Grid
                            container
                            xs={12}
                            style={{ justifyContent: 'center' }}>
                            <Chart
                              series={[
                                {
                                  name: 'Seu ??ndice',
                                  type: 'column',
                                  data: rowsCategPercent.map(row =>
                                    row.Porcentagem.toFixed(2)
                                  )
                                },
                                {
                                  name: 'M??dia Mercado',
                                  type: 'column',
                                  data: rowsCategPercentMaxAvg.map(row =>
                                    quantidadeDeEmpresas > 2
                                      ? row.Media.toFixed(2)
                                      : 55
                                  )
                                },
                                {
                                  name: 'Melhores',
                                  type: 'line',
                                  data: rowsCategPercentMaxAvg.map(row =>
                                    quantidadeDeEmpresas > 2
                                      ? row.Maximo.toFixed(2)
                                      : 75
                                  )
                                }
                              ]}
                              options={{
                                colors: ['#560053', '#18c2ff', '#fc4e07'],
                                chart: {
                                  type: 'line',
                                  toolbar: {
                                    show: true,
                                    offsetX: 0,
                                    offsetY: 0,
                                    tools: {
                                      download: false,
                                      zoomin: true,
                                      zoomout: true,
                                      pan: true,
                                      reset:
                                        true |
                                        '<img src="/static/icons/reset.png" width="20">'
                                    }
                                  }
                                },
                                stroke: {
                                  width: 5
                                },
                                markers: {
                                  size: 3,
                                  hover: {
                                    size: undefined,
                                    sizeOffset: 2
                                  }
                                },
                                labels: rowsCategPercentMaxAvg.map(
                                  row => row.DesCatego
                                ),
                                xaxis: {
                                  type: 'category'
                                },
                                yaxis: [
                                  {
                                    tickAmount: 10,
                                    min: 0,
                                    max: 100
                                  }
                                ]
                              }}
                              width={1000}
                              height={400}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        xs={12}
                        style={{ justifyContent: 'flex-start' }}
                        spacing={2}>
                        <Grid item xs={12} style={{ textAlignLast: 'center' }}>
                          <div
                            className="searchBar"
                            style={{
                              fontSize: '16px',
                              margin: '1px',
                              marginLeft: '15px',
                              fontWeight: 600,
                              textAlignLast: 'left'
                            }}>
                            ??ndice por Processo (Comparativo)
                          </div>
                          <Divider variant="middle" />
                          <br />
                          <Grid
                            container
                            xs={12}
                            style={{ justifyContent: 'center' }}>
                            <Chart
                              series={[
                                {
                                  name: 'Seu ??ndice',
                                  data: rowsProcesPercent.map(
                                    row => row.Porcentagem
                                  )
                                },
                                {
                                  name: 'M??dia Mercado',
                                  data: rowsProcesPercentAvgMax.map(row =>
                                    quantidadeDeEmpresas > 2
                                      ? row.Media.toFixed(2)
                                      : 55
                                  )
                                },
                                {
                                  name: 'Melhores',
                                  data: rowsProcesPercentAvgMax.map(row =>
                                    quantidadeDeEmpresas > 2
                                      ? row.Maximo.toFixed(2)
                                      : 75
                                  )
                                }
                              ]}
                              options={{
                                colors: ['#560053', '#18c2ff', '#fc4e07'],
                                xaxis: {
                                  categories: rowsProcesPercentAvgMax.map(
                                    row => row.DesProces
                                  )
                                },
                                yaxis: {
                                  min: 0,
                                  max: 100
                                },
                                chart: {
                                  toolbar: {
                                    show: false
                                  }
                                }
                              }}
                              type="radar"
                              width={700}
                              height={700}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
