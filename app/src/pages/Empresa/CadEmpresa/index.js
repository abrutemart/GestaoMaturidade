import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { Delete, Edit } from '@material-ui/icons';

import {
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
  incluiEmpresa,
  alteraEmpresa,
  buscaCadEmpresa,
  buscaGrupoEmpresarial,
  buscaPais,
  buscaEstado,
  buscaCidade,
  buscaSegmento,
  buscaAreaAtuacao,
  buscaClassificacao,
  buscaQtdFuncionario,
  buscaFaturamento,
  buscaCargo,
  buscaContatoEmp,
  buscaReferenciaEmpresa,
  incluiContato,
  excluiContato
} from '../../../services/empresa';



const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  },
  table: {
    minWidth: 650
  },
  snackbar: {
    bottom: '104px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function CadEmpresa() {
  const [rowCode, setRowCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [codGrpEmp, setCodGrpEmp] = useState('');
  const [nomGrpEmp, setNomGrpEmp] = useState({ NomGrpEmp: '' });
  const [codNomGrpEmp, setCodNomGrpEmp] = useState({});
  const [codEmpres, setCodEmpres] = useState('');
  const [nomEmpres, setNomEmpres] = useState('');
  const [tipEmpres, setTipEmpres] = useState('');
  const [telefone, setTelefone] = useState('');
  const [codCNPJ, setCodCNPJ] = useState('');
  const [matriz, setMatriz] = useState(0);
  const [nomRespon, setNomRespon] = useState('');
  const [emaRespon, setEmaRespon] = useState('');
  const [telRespon, setTelRespon] = useState('');
  const [anoFundac, setAnoFundac] = useState('');
  const [codSegmen, setCodSegmen] = useState('');
  const [desSegmen, setDesSegmen] = useState({ DesSegmen: '' });
  const [codAreAtu, setCodAreAtu] = useState('');
  const [nomAreAtu, setNomAreAtu] = useState({ NomAreAtu: '' });
  const [codClassi, setCodClassi] = useState('');
  const [desClassi, setDesClassi] = useState({ DesClassi: '' });
  const [codFatura, setCodFatura] = useState('');
  const [desFatura, setDesFatura] = useState({ DesFatura: '' });
  const [codQtdFun, setCodQtdFun] = useState('');
  const [desQtdFun, setDesQtdFun] = useState({ DesQtdFun: '' });
  const [codContat, setCodContat] = useState('');
  const [nomContat, setNomContat] = useState('');
  const [emaContat, setEmaContat] = useState('');
  const [telContat, setTelContat] = useState('');
  const [codCargo, setCodCargo] = useState('');
  const [codPais, setCodPais] = useState('');
  const [nomPais, setNomPais] = useState({ NomPais: '' });
  const [codEstado, setCodEstado] = useState('');
  const [nomEstado, setNomEstado] = useState({ NomEstado: '' });
  const [codCidade, setCodCidade] = useState('');
  const [nomCidade, setNomCidade] = useState({ NomCidade: '' });
  const [desCargo, setDesCargo] = useState({ DesCargo: '' });
  const [desCargo2, setDesCargo2] = useState({ DesCargo: '' });
  const [dados, setDados] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const [selecao, setSelecao] = useState('');
  const [open2, setOpen2] = useState(false);
  const history = useHistory();
  const [exibeContatos, setExibeContatos] = useState(false);
  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
  };
  const handleClose2 = () => {
    setOpenEscolha(false);
    setOpen2(false);
    setRefresh(true);
  };
  const [grupoEmpresarial, setGrupoEmpresarial] = useState([]);
  const [pais, setPais] = useState([]);
  const [estado, setEstado] = useState([]);
  const [cidade, setCidade] = useState([]);
  const [segmento, setSegmento] = useState([]);
  const [areaAtuacao, setAreaAtuacao] = useState([]);
  const [classificacao, setClassificacao] = useState([]);
  const [qtdFuncionario, setQtdFuncionario] = useState([]);
  const [faturamento, setFaturamento] = useState([]);
  const [cargo, setCargo] = useState([]);
  const [contatoEmp, setContatoEmp] = useState([]);
  const [novoNomContat, setNovoNomContat] = useState('');
  const [novoEmaContat, setNovoEmaContat] = useState('');
  const [novoTelContat, setNovoTelContat] = useState('');
  const [novoDesCargo, setNovoDesCargo] = useState('');
  const [antigoNomContat, setAntigoNomContat] = useState('');
  const [antigoEmaContat, setAntigoEmaContat] = useState('');
  const [antigoTelContat, setAntigoTelContat] = useState('');
  const [antigoDesCargo, setAntigoDesCargo] = useState('');
  const [errorsNomGrpEmp, setErrorsNomGrpEmp] = useState(false);
  const [errorsNomEmpres, setErrorsNomEmpres] = useState(false);
  const [errorsNomPais, setErrorsNomPais] = useState(false);
  const [errorsNomEstado, setErrorsNomEstado] = useState(false);
  const [errorsNomCidade, setErrorsNomCidade] = useState(false);
  const [errorsTelefone, setErrorsTelefone] = useState(false);
  const [errorsDesClassi, setErrorsDesClassi] = useState(false);
  const [errorsDesFatura, setErrorsDesFatura] = useState(false);
  const [errorsDesSegmen, setErrorsDesSegmen] = useState(false);
  const [errorsNomAreAtu, setErrorsNomAreAtu] = useState(false);
  const [errorsDesQtdFun, setErrorsDesQtdFun] = useState(false);
  const [errorsCodCNPJ, setErrorsCodCNPJ] = useState(false);
  const [errorsAnoFundac, setErrorsAnoFundac] = useState(false);
  const [errorsTipEmpres, setErrorsTipEmpres] = useState(false);
  const [errorsMatriz, setErrorsMatriz] = useState(false);
  const [errorsNomRespon, setErrorsNomRespon] = useState(false);
  const [errorsDesCargo, setErrorsDesCargo] = useState(false);
  const [errorsEmaRespon, setErrorsEmaRespon] = useState(false);
  const [errorsTelRespon, setErrorsTelRespon] = useState(false);
  const [errorsNomContat, setErrorsNomContat] = useState(false);
  const [errorsDesCargo2, setErrorsDesCargo2] = useState(false);
  const [errorsEmaContat, setErrorsEmaContat] = useState(false);
  const [errorsTelContat, setErrorsTelContat] = useState(false);
  const [helperErrorsNomGrpEmp, setHelperErrorsNomGrpEmp] = useState(false);
  const [helperErrors, setHelperErrors] = useState(false);
  const [helperErrorsNomEmpres, setHelperErrorsNomEmpres] = useState(false);
  const [helperErrorsNomPais, setHelperErrorsNomPais] = useState(false);
  const [helperErrorsNomEstado, setHelperErrorsNomEstado] = useState(false);
  const [helperErrorsNomCidade, setHelperErrorsNomCidade] = useState(false);
  const [helperErrorsTelefone, setHelperErrorsTelefone] = useState(false);
  const [helperErrorsDesClassi, setHelperErrorsDesClassi] = useState(false);
  const [helperErrorsDesFatura, setHelperErrorsDesFatura] = useState(false);
  const [helperErrorsDesSegmen, setHelperErrorsDesSegmen] = useState(false);
  const [helperErrorsNomAreAtu, setHelperErrorsNomAreAtu] = useState(false);
  const [helperErrorsDesQtdFun, setHelperErrorsDesQtdFun] = useState(false);
  const [helperErrorsCodCNPJ, setHelperErrorsCodCNPJ] = useState(false);
  const [helperErrorsAnoFundac, setHelperErrorsAnoFundac] = useState(false);
  const [helperErrorsTipEmpres, setHelperErrorsTipEmpres] = useState(false);
  const [helperErrorsMatriz, setHelperErrorsMatriz] = useState(false);
  const [helperErrorsNomRespon, setHelperErrorsNomRespon] = useState(false);
  const [helperErrorsDesCargo, setHelperErrorsDesCargo] = useState(false);
  const [helperErrorsEmaRespon, setHelperErrorsEmaRespon] = useState(false);
  const [helperErrorsTelRespon, setHelperErrorsTelRespon] = useState(false);
  const [helperErrorsNomContat, setHelperErrorsNomContat] = useState(false);
  const [helperErrorsDesCargo2, setHelperErrorsDesCargo2] = useState(false);
  const [helperErrorsEmaContat, setHelperErrorsEmaContat] = useState(false);
  const [helperErrorsTelContat, setHelperErrorsTelContat] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [novoNomeEmp, setNovoNomeEmp] = useState('');
  const [antigoNomeEmp, setAntigoNomeEmp] = useState('');

  const url = window.location.href;
  const codigo = url.split('/');
  const codigo2 = 'Empresa.' + codigo[5];

  function createDataGrupoEmpresarial(CodGrpEmp, NomGrpEmp) {
    return {
      CodGrpEmp,
      NomGrpEmp
    };
  }

  let rowsGrupoEmpresarial = [];
  rowsGrupoEmpresarial = grupoEmpresarial.map(each =>
    createDataGrupoEmpresarial(each.CodGrpEmp, each.NomGrpEmp)
  );

  function createDataPais(CodPais, NomPais) {
    return {
      CodPais,
      NomPais
    };
  }

  let rowsPais = [];
  rowsPais = pais.map(each => createDataPais(each.CodPais, each.NomPais));

  const populateEstado = async paisEscolhido => {
    if (
      paisEscolhido !== '' &&
      paisEscolhido !== null &&
      paisEscolhido !== undefined
    ) {
      await buscaEstado(paisEscolhido).then(data => {
        setEstado(data.registros);
      });
    } else {
      setEstado([]);
    }
  };

  function createDataEstado(CodPais, CodEstado, NomEstado) {
    return {
      CodPais,
      CodEstado,
      NomEstado
    };
  }

  let rowsEstado = [];
  rowsEstado = estado.map(each =>
    createDataEstado(each.CodPais, each.CodEstado, each.NomEstado)
  );

  const populateCidade = async (paisEscolhido, estadoEscolhido) => {
    if (
      paisEscolhido !== '' &&
      paisEscolhido !== null &&
      paisEscolhido !== undefined &&
      estadoEscolhido !== '' &&
      estadoEscolhido !== null &&
      estadoEscolhido !== undefined
    )
      await buscaCidade(paisEscolhido, estadoEscolhido).then(data => {
        setCidade(data.registros);
      });
    else {
      setCidade([]);
    }
  };

  function createDataCidade(CodPais, CodEstado, CodCidade, NomCidade) {
    return {
      CodPais,
      CodEstado,
      CodCidade,
      NomCidade
    };
  }

  let rowsCidade = [];
  rowsCidade = cidade.map(each =>
    createDataCidade(
      each.CodPais,
      each.CodEstado,
      each.CodCidade,
      each.NomCidade
    )
  );

  function createDataSegmento(CodSegmen, DesSegmen) {
    return {
      CodSegmen,
      DesSegmen
    };
  }

  let rowsSegmento = [];
  rowsSegmento = segmento.map(each =>
    createDataSegmento(each.CodSegmen, each.DesSegmen)
  );

  const populateAreaAtuacao = async segmentoEscolhido => {
    if (
      segmentoEscolhido !== '' &&
      segmentoEscolhido !== null &&
      segmentoEscolhido !== undefined
    ) {
      await buscaAreaAtuacao(segmentoEscolhido).then(data => {
        setAreaAtuacao(data.registros);
      });
    } else {
      setAreaAtuacao([]);
    }
  };

  function createDataAreaAtuacao(CodSegmen, CodAreAtu, NomAreAtu) {
    return {
      CodSegmen,
      CodAreAtu,
      NomAreAtu
    };
  }

  let rowsAreaAtuacao = [];
  rowsAreaAtuacao = areaAtuacao.map(each =>
    createDataAreaAtuacao(each.CodSegmen, each.CodAreAtu, each.NomAreAtu)
  );

  function createDataClassificacao(CodClassi, DesClassi) {
    return {
      CodClassi,
      DesClassi
    };
  }

  let rowsClassificacao = [];
  rowsClassificacao = classificacao.map(each =>
    createDataClassificacao(each.CodClassi, each.DesClassi)
  );

  function createDataQtdFuncionario(CodQtdFun, DesQtdFun) {
    return {
      CodQtdFun,
      DesQtdFun
    };
  }

  let rowsQtdFuncionario = [];
  rowsQtdFuncionario = qtdFuncionario.map(each =>
    createDataQtdFuncionario(each.CodQtdFun, each.DesQtdFun)
  );

  function createDataFaturamento(CodFatura, DesFatura) {
    return {
      CodFatura,
      DesFatura
    };
  }

  let rowsFaturamento = [];
  rowsFaturamento = faturamento.map(each =>
    createDataFaturamento(each.CodFatura, each.DesFatura)
  );

  function createDataCargo(CodCargo, DesCargo) {
    return {
      CodCargo,
      DesCargo
    };
  }

  let rowsCargo = [];
  rowsCargo = cargo.map(each => createDataCargo(each.CodCargo, each.DesCargo));

  function createDataContatoEmp(
    CodEmpres,
    CodContat,
    NomContat,
    EmaContat,
    TelContat,
    CodCarCnt,
    DesCargo
  ) {
    return {
      CodEmpres,
      CodContat,
      NomContat,
      EmaContat,
      TelContat,
      CodCarCnt,
      DesCargo
    };
  }

  let rowsContatoEmp = [];
  rowsContatoEmp = contatoEmp.map(each =>
    createDataContatoEmp(
      each.CodEmpres,
      each.CodContat,
      each.NomContat,
      each.EmaContat,
      each.TelContat,
      each.CodCarCnt,
      each.DesCargo
    )
  );

  useEffect(() => {
    if (codigo[5] !== 'CodEmpres=0') {
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      setRefresh(false);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaCadEmpresa(codigo2).then(data => {
            if (data !== undefined) {
              setCodEmpres(data.registros[0].CodEmpres);
              setNovoNomeEmp(data.registros[0].NomEmpres);
              setAntigoNomeEmp(data.registros[0].NomEmpres);
              setNomGrpEmp({
                CodGrpEmp: data.registros[0].CodGrpEmp,
                NomGrpEmp: data.registros[0].NomGrpEmp
              });
              setNomEmpres(data.registros[0].NomEmpres);
              setNomPais({
                CodPais: data.registros[0].CodPais,
                NomPais: data.registros[0].NomPais
              });
              setNomEstado({
                CodPais: data.registros[0].CodPais,
                CodEstado: data.registros[0].CodEstado,
                NomEstado: data.registros[0].NomEstado
              });
              setNomCidade({
                CodPais: data.registros[0].CodPais,
                CodEstado: data.registros[0].CodEstado,
                CodCidade: data.registros[0].CodCidade,
                NomCidade: data.registros[0].NomCidade
              });
              setTelefone(formatPhoneNumber(data.registros[0].Telefone));
              setDesSegmen({
                CodSegmen: data.registros[0].CodSegmen,
                DesSegmen: data.registros[0].DesSegmen
              });
              setCodCNPJ(formatCNPJ(data.registros[0].CodCNPJ));
              setNomAreAtu({
                CodSegmen: data.registros[0].CodSegmen,
                CodAreAtu: data.registros[0].CodAreAtu,
                NomAreAtu: data.registros[0].NomAreAtu
              });
              setDesClassi({
                CodClassi: data.registros[0].CodClassi,
                DesClassi: data.registros[0].DesClassi
              });
              setDesQtdFun({
                CodQtdFun: data.registros[0].CodQtdFun,
                DesQtdFun: data.registros[0].DesQtdFun
              });
              setDesFatura({
                CodFatura: data.registros[0].CodFatura,
                DesFatura: data.registros[0].DesFatura
              });
              setAnoFundac(data.registros[0].AnoFundac);
              setTipEmpres(data.registros[0].TipEmpres);
              setMatriz(data.registros[0].Matriz);
              setNomRespon(data.registros[0].NomRespon);
              setEmaRespon(data.registros[0].EmaRespon);
              setDesCargo({
                CodCargo: data.registros[0].CodCargo,
                DesCargo: data.registros[0].DesCargo
              });
              setTelRespon(formatPhoneNumber(data.registros[0].TelRespon));
              
            } else {
              setDados([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaGrupoEmpresarial(codigo[5]).then(data => {
            if (data !== undefined) {
              setGrupoEmpresarial(data.registros);
              
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaContatoEmp(codigo[5]).then(data => {
            if (data !== undefined) {
              setContatoEmp(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaPais(codigo[5]).then(data => {
            if (data !== undefined) {
              setPais(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          if (
            nomPais.CodPais != '' &&
            nomPais.CodPais != null &&
            nomPais.CodPais != undefined
          ) {
            populateEstado();
          } else {
            setEstado([]);
          }
          /* await buscaEstado(codigo[5]).then(data => {
            if (data !== undefined) {
              setEstado(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          }); */
          /* await buscaCidade(codigo[5]).then(data => {
            if (data !== undefined) {
              setCidade(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          }); */
          if (
            nomPais.CodPais != '' &&
            nomPais.CodPais != null &&
            nomPais.CodPais != undefined &&
            nomEstado.CodEstado != '' &&
            nomEstado.CodEstado != null &&
            nomEstado.CodEstado != undefined
          ) {
            populateCidade();
          } else {
            setCidade([]);
          }
          await buscaSegmento(codigo[5]).then(data => {
            if (data !== undefined) {
              setSegmento(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          populateAreaAtuacao();
          /* await buscaAreaAtuacao(codigo[5]).then(data => {
            if (data !== undefined) {
              setAreaAtuacao(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          }); */
          await buscaClassificacao(codigo[5]).then(data => {
            if (data !== undefined) {
              setClassificacao(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaQtdFuncionario(codigo[5]).then(data => {
            if (data !== undefined) {
              setQtdFuncionario(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaFaturamento(codigo[5]).then(data => {
            if (data !== undefined) {
              setFaturamento(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaCargo(codigo[5]).then(data => {
            if (data !== undefined) {
              setCargo(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
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
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaGrupoEmpresarial(codigo[5]).then(data => {
            if (data !== undefined) {
              setGrupoEmpresarial(data.registros);
              
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaPais(codigo[5]).then(data => {
            if (data !== undefined) {
              setPais(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          if (
            nomPais.CodPais != '' &&
            nomPais.CodPais != null &&
            nomPais.CodPais != undefined
          ) {
            populateEstado();
          } else {
            setEstado([]);
          }
          /* await buscaEstado(codigo[5]).then(data => {
          if (data !== undefined) {
            setEstado(data.registros);
          } else {
            setOpen(true);
            setMensagem({
              titulo: 'Aviso',
              conteudo:
                'Registro selecionado não existe! Selecione um registro existente.',
              acao: '/Empresa'
            });
          }
        }); */
          if (
            nomPais.CodPais != '' &&
            nomPais.CodPais != null &&
            nomPais.CodPais != undefined &&
            nomEstado.CodEstado != '' &&
            nomEstado.CodEstado != null &&
            nomEstado.CodEstado != undefined
          ) {
            populateCidade();
          } else {
            setCidade([]);
          }
          /* await buscaCidade(codigo[5]).then(data => {
          if (data !== undefined) {
            setCidade(data.registros);
          } else {
            setOpen(true);
            setMensagem({
              titulo: 'Aviso',
              conteudo:
                'Registro selecionado não existe! Selecione um registro existente.',
              acao: '/Empresa'
            });
          }
        }); */
          await buscaSegmento(codigo[5]).then(data => {
            if (data !== undefined) {
              setSegmento(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          populateAreaAtuacao();
          /*  await buscaAreaAtuacao(codigo[5]).then(data => {
            if (data !== undefined) {
              setAreaAtuacao(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          }); */
          await buscaClassificacao(codigo[5]).then(data => {
            if (data !== undefined) {
              setClassificacao(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaQtdFuncionario(codigo[5]).then(data => {
            if (data !== undefined) {
              setQtdFuncionario(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaFaturamento(codigo[5]).then(data => {
            if (data !== undefined) {
              setFaturamento(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
              });
            }
          });
          await buscaCargo(codigo[5]).then(data => {
            if (data !== undefined) {
              setCargo(data.registros);
            } else {
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/Empresa'
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
  }, [refresh]);

  const concluiAcao = () => {
    if (transacaoIncluir === true) {
      let cancel = false;
      const inclui = async () => {
        try {
          
          if (submitForm() != false) {
            const existeEmpresa = await buscaReferenciaEmpresa(nomEmpres);
            if (matriz === false) matriz = 0;
            if (existeEmpresa.registros[0] === undefined) {
              await incluiEmpresa(
                nomGrpEmp.CodGrpEmp,
                nomEmpres,
                nomPais.CodPais,
                nomEstado.CodEstado,
                nomCidade.CodCidade,
                telefone.replace(/[()-]| /g, ''),
                desClassi.CodClassi,
                desFatura.CodFatura,
                desSegmen.CodSegmen,
                nomAreAtu.CodAreAtu,
                desQtdFun.CodQtdFun,
                codCNPJ.replace(/[./-]/g, ''),
                anoFundac,
                tipEmpres,
                matriz,
                nomRespon,
                desCargo.CodCargo,
                emaRespon,
                telRespon.replace(/[()-]| /g, '')
              );
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/Empresa'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              setErrorsNomEmpres(true);
              setHelperErrorsNomEmpres(
                '*Já existe uma empresa cadastrada com este nome'
              );
            }
          }
        } catch (err) {
          console.log(err);
          setOpen(true);
          setMensagem({
            titulo: 'Erro',
            conteudo: err,
            acao: '/Empresa'
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
      
      let filtro = ' CodEmpres = ';
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          if (submitForm() != false) {
            if (novoNomeEmp === antigoNomeEmp) {
              await alteraEmpresa(
                codEmpres,
                nomGrpEmp.CodGrpEmp,
                nomEmpres,
                nomPais.CodPais,
                nomEstado.CodEstado,
                nomCidade.CodCidade,
                telefone.replace(/[()-]| /g, ''),
                desClassi.CodClassi,
                desFatura.CodFatura,
                desSegmen.CodSegmen,
                nomAreAtu.CodAreAtu,
                desQtdFun.CodQtdFun,
                codCNPJ.replace(/[./-]/g, ''),
                anoFundac,
                tipEmpres,
                matriz,
                nomRespon,
                desCargo.CodCargo,
                emaRespon,
                telRespon.replace(/[()-]| /g, '')
              );
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/Empresa'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              const existeEmpresa = await buscaReferenciaEmpresa(nomEmpres);
              if (existeEmpresa.registros[0] === undefined) {
                await alteraEmpresa(
                  codEmpres,
                  nomGrpEmp.CodGrpEmp,
                  nomEmpres,
                  nomPais.CodPais,
                  nomEstado.CodEstado,
                  nomCidade.CodCidade,
                  telefone.replace(/[()-]| /g, ''),
                  desClassi.CodClassi,
                  desFatura.CodFatura,
                  desSegmen.CodSegmen,
                  nomAreAtu.CodAreAtu,
                  desQtdFun.CodQtdFun,
                  codCNPJ.replace(/[./-]/g, ''),
                  anoFundac,
                  tipEmpres,
                  matriz,
                  nomRespon,
                  desCargo.CodCargo,
                  emaRespon,
                  telRespon.replace(/[()-]| /g, '')
                );
                setMensagem({
                  titulo: 'Sucesso',
                  conteudo: 'Alteração realizada com sucesso!',
                  acao: '/Empresa'
                });
                setOpen(true);
                if (cancel) {
                  return;
                }
              } else {
                setErrorsNomEmpres(true);
                setHelperErrorsNomEmpres(
                  '*Já existe uma empresa cadastrada com este nome'
                );
              }
            }
          }
        } catch (err) {
          console.log(err);
          setOpen(true);
          setMensagem({
            titulo: 'Erro',
            conteudo: err,
            acao: '/Empresa'
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

  const concluiAcao2 = () => {
    let cancel = false;
    const inclui = async () => {
      
      try {
        if (submitForm2() != false) {
          await incluiContato(
            codEmpres,
            nomContat,
            desCargo2.CodCargo,
            emaContat,
            telContat.replace(/[()-]| /g, '')
          );
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Inclusão realizada com sucesso!'
          });
          setOpen2(true);
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
          acao: '/Empresa'
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

  const excluiRegistro = (CodEmpres, CodContat) => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        await excluiContato(CodEmpres, CodContat);
        setMensagem({
          titulo: 'Sucesso',
          conteudo: 'Exclusão realizada com sucesso!'
        });
        setOpen2(true);
        if (cancel) {
          return;
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/Empresa'
        });
      } finally {
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
      if (nomGrpEmp.NomGrpEmp === '' || nomGrpEmp.NomGrpEmp === undefined) {
        setErrorsNomGrpEmp(true);
        setHelperErrorsNomGrpEmp('*Campo obrigatório');
        return false;
      }
    };
    const check2 = () => {
      if (nomEmpres === '') {
        setErrorsNomEmpres(true);
        setHelperErrorsNomEmpres('*Campo obrigatório');
        return false;
      }
    };
    const check3 = () => {
      if (nomPais.NomPais === '' || nomPais.NomPais === undefined) {
        setErrorsNomPais(true);
        setHelperErrorsNomPais('*Campo obrigatório');
        return false;
      }
    };
    const check4 = () => {
      if (nomEstado.NomEstado === '' || nomEstado.NomEstado === undefined) {
        setErrorsNomEstado(true);
        setHelperErrorsNomEstado('*Campo obrigatório');
        return false;
      }
    };
    const check5 = () => {
      if (nomCidade.NomCidade === '' || nomCidade.NomCidade === undefined) {
        setErrorsNomCidade(true);
        setHelperErrorsNomCidade('*Campo obrigatório');
        return false;
      }
    };
    const check6 = () => {
      if (telefone === '') {
        setErrorsTelefone(true);
        setHelperErrorsTelefone('*Campo obrigatório');
        return false;
      }
    };
    const check7 = () => {
      if (telefone.replace(/[()-]| /g, '').length < 10) {
        setErrorsTelefone(true);
        setHelperErrorsTelefone('*Número de telefone inválido');
        return false;
      }
    };
    const check8 = () => {
      if (desClassi.DesClassi === '' || desClassi.DesClassi === undefined) {
        setErrorsDesClassi(true);
        setHelperErrorsDesClassi('*Campo obrigatório');
        return false;
      }
    };
    const check9 = () => {
      if (desFatura.DesFatura === '' || desFatura.DesFatura === undefined) {
        setErrorsDesFatura(true);
        setHelperErrorsDesFatura('*Campo obrigatório');
        return false;
      }
    };
    const check11 = () => {
      if (desSegmen.DesSegmen === '' || desSegmen.DesSegmen === undefined) {
        setErrorsDesSegmen(true);
        setHelperErrorsDesSegmen('*Campo obrigatório');
        return false;
      }
    };
    const check12 = () => {
      if (nomAreAtu.NomAreAtu === '' || nomAreAtu.NomAreAtu === undefined) {
        setErrorsNomAreAtu(true);
        setHelperErrorsNomAreAtu('*Campo obrigatório');
        return false;
      }
    };
    const check13 = () => {
      if (desQtdFun.DesQtdFun === '' || desQtdFun.DesQtdFun === undefined) {
        setErrorsDesQtdFun(true);
        setHelperErrorsDesQtdFun('*Campo obrigatório');
        return false;
      }
    };
    const check14 = () => {
      if (codCNPJ === '') {
        setErrorsCodCNPJ(true);
        setHelperErrorsCodCNPJ('*Campo obrigatório');
        return false;
      }
    };
    const check15 = () => {
      if (codCNPJ.replace(/[./-]/g, '').length < 14) {
        setErrorsCodCNPJ(true);
        setHelperErrorsCodCNPJ('*CNPJ inválido');
        return false;
      }
    };
    const check16 = () => {
      if (anoFundac === '') {
        setErrorsAnoFundac(true);
        setHelperErrorsAnoFundac('*Campo obrigatório');
        return false;
      }
    };
    const check17 = () => {
      if (anoFundac < 1500) {
        setErrorsAnoFundac(true);
        setHelperErrorsAnoFundac('Valor deve ser > 1499');
        return false;
      }
    };
    const check18 = () => {
      if (tipEmpres === '') {
        setErrorsTipEmpres(true);
        setHelperErrorsTipEmpres(
          <FormHelperText>*Campo obrigatório</FormHelperText>
        );
        return false;
      }
    };
    const check19 = () => {
      if (nomRespon === '') {
        setErrorsNomRespon(true);
        setHelperErrorsNomRespon('*Campo obrigatório');
        return false;
      }
    };
    const check20 = () => {
      if (desCargo.DesCargo === '' || desCargo.DesCargo === undefined) {
        setErrorsDesCargo(true);
        setHelperErrorsDesCargo('*Campo obrigatório');
        return false;
      }
    };
    const check21 = () => {
      if (emaRespon === '') {
        setErrorsEmaRespon(true);
        setHelperErrorsEmaRespon('*Campo obrigatório');
        return false;
      }
    };
    const check22 = () => {
      if (telRespon === '') {
        setErrorsTelRespon(true);
        setHelperErrorsTelRespon('*Campo obrigatório');
        return false;
      }
    };
    const check23 = () => {
      if (telRespon.replace(/[()-]| /g, '').length < 10) {
        setErrorsTelRespon(true);
        setHelperErrorsTelRespon('*Número de telefone inválido');
        return false;
      }
    };
    const check24 = () => {
      if (handleCheckEmail(emaRespon) == false) {
        setErrorsEmaRespon(true);
        setHelperErrorsEmaRespon('* Email inválido');
        return false;
      }
    };

    check1();
    check2();
    check3();
    check4();
    check5();
    check6();
    check7();
    check8();
    check9();
    check11();
    check12();
    check13();
    check14();
    check15();
    check16();
    check17();
    check18();
    check19();
    check20();
    check21();
    check22();
    check23();
    check24();

    if (
      check1() == false ||
      check2() == false ||
      check3() == false ||
      check4() == false ||
      check5() == false ||
      check6() == false ||
      check7() == false ||
      check8() == false ||
      check9() == false ||
      check11() == false ||
      check12() == false ||
      check13() == false ||
      check14() == false ||
      check15() == false ||
      check16() == false ||
      check17() == false ||
      check18() == false ||
      check19() == false ||
      check20() == false ||
      check21() == false ||
      check22() == false ||
      check23() == false ||
      check24() == false
    )
      return false;
  };

  const submitForm2 = Form => {
    const check1 = () => {
      if (nomContat === '') {
        setErrorsNomContat(true);
        setHelperErrorsNomContat('*Campo obrigatório');
        return false;
      }
    };
    const check2 = () => {
      if (desCargo2.DesCargo === '' || desCargo2.DesCargo === undefined) {
        setErrorsDesCargo2(true);
        setHelperErrorsDesCargo2('*Campo obrigatório');
        return false;
      }
    };
    const check3 = () => {
      if (handleCheckEmail(emaContat) == false) {
        setErrorsEmaContat(true);
        setHelperErrorsEmaContat('Email inválido');
        return false;
      }
    };
    const check4 = () => {
      if (telContat.replace(/[()-]| /g, '').length < 10) {
        setErrorsTelefone(true);
        setHelperErrorsTelefone('*Número de telefone inválido');
        return false;
      }
    };

    check1();
    check2();
    check3();
    check4();

    if (
      check1() == false ||
      check2() == false ||
      check3() == false ||
      check4() == false
    )
      return false;
  };

  const checkSegmento = Form => {
    if (
      desSegmen.CodSegmen === '' ||
      desSegmen.CodSegmen === null ||
      desSegmen.CodSegmen === undefined
    ) {
      setErrorsDesSegmen(true);
      setHelperErrorsDesSegmen('*O preenchimento deste campo é obrigatório');
    }
  };

  const checkPais = Form => {
    if (
      nomPais.CodPais === '' ||
      nomPais.CodPais === null ||
      nomPais.CodPais === undefined
    ) {
      setErrorsNomPais(true);
      setHelperErrorsNomPais('*O preenchimento deste campo é obrigatório');
    }
  };

  const checkEstado = Form => {
    if (
      nomEstado.CodEstado === '' ||
      nomEstado.CodEstado === null ||
      nomEstado.CodEstado === undefined
    ) {
      setErrorsNomEstado(true);
      setHelperErrorsNomEstado('*O preenchimento deste campo é obrigatório');
    }
  };

  const clickExcluir = (CodEmpres, CodContat) => {
    setSelecao([CodEmpres, CodContat]);
    setOpenEscolha(true);
  };

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    var match2 = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (cleaned.length == 10) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    } else if (cleaned.length == 11) {
      return '(' + match2[1] + ') ' + match2[2] + '-' + match2[3];
    } else return null;
  }

  function formatCNPJ(CNPJ) {
    var cleaned = ('' + CNPJ).replace(/\D/g, '');
    
    var match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    
    if (match) {
      return (
        match[1] +
        '.' +
        match[2] +
        '.' +
        match[3] +
        '/' +
        match[4] +
        '-' +
        match[5]
      );
    } else return null;
  }

  const validacaoEmail = email => {
    let validateEmail = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(
      email
    );
    return validateEmail;
  };

  const handleCheckEmail = email => {
    if (validacaoEmail(email) === false || email.length > 254) {      
      return false;
    } else {
      return true;
    }
  };

  const [rows, setRows] = useState([
    { id: 1, firstname: '', lastname: '', city: '' }
  ]);

  // Initial states
  const [open1, setOpen1] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Function For closing the alert snackbar
  const handleClose1 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen1(false);
  };

  // Function For adding new row object
  const handleAdd = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        firstname: '',
        lastname: '',
        city: ''
      }
    ]);
    setEdit(true);
  };

  // Function to handle edit
  const handleEdit = i => {
    // If edit mode is true setEdit will
    // set it to false and vice versa
    setEdit(!isEdit);
  };

  // Function to handle save
  const handleSave = () => {
    setEdit(!isEdit);
    setRows(rows);    
    setDisable(true);
    setOpen1(true);
  };

  // The handleInputChange handler can be set up to handle
  // many different inputs in the form, listen for changes
  // to input elements and record their values in state
  const handleInputChange = (e, index) => {
    setDisable(false);
    const { name, value } = e.target;
    const list = [...rows];
    list[index][name] = value;
    setRows(list);
  };

  // Showing delete confirmation to users
  const handleConfirm = () => {
    setShowConfirm(true);
  };

  // Handle the case of delete confirmation where
  // user click yes delete a specific row of id:i
  const handleRemoveClick = i => {
    const list = [...rows];
    list.splice(i, 1);
    setRows(list);
    setShowConfirm(false);
  };

  // Handle the case of delete confirmation
  // where user click no
  const handleNo = () => {
    setShowConfirm(false);
  };

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
          <Button onClick={handleClose2} color="primary" autoFocus>
            Não
          </Button>
          <Button
            onClick={() => excluiRegistro(selecao[0], selecao[1])}
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
        titleHeading="Empresa"
        titleDescription={
          codigo[5] !== 'CodEmpres=0' ? 'Alteração da empresa' : 'Nova empresa'
        }
      />
      <Grid container>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid item xs={12}>
              <div className="searchBar" style={{ fontSize: '18px' }}>
                Dados da Empresa:
              </div>
              <Divider className="my-4" />
            </Grid>
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              <Grid item xs={6}>
                <div className="searchBar">Grupo Empresarial</div>{' '}
                {/* Obrigatório */}
                <Autocomplete
                  value={nomGrpEmp}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsGrupoEmpresarial}
                  getOptionLabel={rowsGrupoEmpresarial =>
                    rowsGrupoEmpresarial.NomGrpEmp
                  }
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setNomGrpEmp('')
                      : setNomGrpEmp({
                          CodGrpEmp: newValue.CodGrpEmp,
                          NomGrpEmp: newValue.NomGrpEmp
                        });
                    setErrorsNomGrpEmp(false);
                    setHelperErrorsNomGrpEmp('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsNomGrpEmp}
                      error={errorsNomGrpEmp}
                      required
                      className="m-2"
                      placeholder="Selecione um Grupo Empresarial"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Nome da Empresa</div>{' '}
                {/* Obrigatório e não pode haver duplicidade*/}
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o Nome da Nova Empresa"
                  multiline
                  rowsMax={3}
                  className="m-2"
                  id="outlined-size-small"
                  value={nomEmpres}
                  variant="outlined"
                  size="small"
                  onChange={e => {
                    setNomEmpres(e.target.value);
                    setNovoNomeEmp(e.target.value);
                    setErrorsNomEmpres(false);
                    setHelperErrorsNomEmpres('');
                  }}
                  error={errorsNomEmpres}
                  helperText={helperErrorsNomEmpres}
                />
              </Grid>
              <Grid item xs={3}>
                <div className="searchBar">Pais</div> {/* Obrigatório */}
                <Autocomplete
                  value={nomPais}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsPais}
                  getOptionLabel={rowsPais => rowsPais.NomPais}
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      setNomPais('');
                      setEstado([]);
                    } else {
                      setNomPais({
                        CodPais: newValue.CodPais,
                        NomPais: newValue.NomPais
                      });
                      let paisEscolhido = newValue.CodPais;
                      populateEstado(paisEscolhido);
                    }
                    setNomEstado('');
                    setNomCidade('');
                    setErrorsNomPais(false);
                    setHelperErrorsNomPais('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsNomPais}
                      error={errorsNomPais}
                      placeholder="Selecione um País"
                      className="m-2"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <div className="searchBar">Estado</div>{' '}
                {/* Obrigatório e deve se atualizar conforme País escolhido*/}
                <Autocomplete
                  value={nomEstado}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsEstado}
                  getOptionLabel={rowsEstado => rowsEstado.NomEstado}
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      setNomEstado('');
                      setCidade([]);
                    } else {
                      setNomEstado({
                        CodPais: newValue.CodPais,
                        CodEstado: newValue.CodEstado,
                        NomEstado: newValue.NomEstado
                      });
                      let paisEscolhido = newValue.CodPais;
                      let estadoEscolhido = newValue.CodEstado;
                      populateCidade(paisEscolhido, estadoEscolhido);
                    }
                    setNomCidade('');
                    setErrorsNomEstado(false);
                    setHelperErrorsNomEstado('');
                  }}
                  renderInput={params => (
                    <TextField
                      onClick={() => {
                        checkPais();
                      }}
                      helperText={helperErrorsNomEstado}
                      error={errorsNomEstado}
                      className="m-2"
                      placeholder="Selecione um Estado"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Cidade</div>{' '}
                {/* Obrigatório e deve se atualizar conforme País e Estado escolhido*/}
                <Autocomplete
                  value={nomCidade}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsCidade}
                  getOptionLabel={rowsCidade => rowsCidade.NomCidade}
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setNomCidade('')
                      : setNomCidade({
                          CodPais: newValue.CodPais,
                          CodEstado: newValue.CodEstado,
                          CodCidade: newValue.CodCidade,
                          NomCidade: newValue.NomCidade
                        });
                    setErrorsNomCidade(false);
                    setHelperErrorsNomCidade('');
                  }}
                  renderInput={params => (
                    <TextField
                      onClick={() => {
                        checkEstado();
                        checkPais();
                      }}
                      helperText={helperErrorsNomCidade}
                      error={errorsNomCidade}
                      className="m-2"
                      placeholder="Selecione um Cidade"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Telefone</div>
                <TextField
                  type="phone"
                  autoComplete="off"
                  fullWidth
                  className="m-2"
                  placeholder="Informe o Número de Telefone"
                  id="outlined-size-small"
                  value={telefone}
                  variant="outlined"
                  size="small"
                  helperText={helperErrorsTelefone}
                  error={errorsTelefone}
                  onChange={e => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    if (onlyNums.length < 10) {
                      setTelefone(onlyNums);
                    } else if (onlyNums.length === 10) {
                      const number = onlyNums.replace(
                        /(\d{2})(\d{4})(\d{4})/,
                        '($1) $2-$3'
                      );
                      setTelefone(number);
                    } else if (onlyNums.length === 11) {
                      const number = onlyNums.replace(
                        /(\d{2})(\d{1})(\d{4})(\d{4})/,
                        '($1) $2 $3-$4'
                      );
                      setTelefone(number);
                    }
                    setErrorsTelefone(false);
                    setHelperErrorsTelefone('');
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Classificação</div>{' '}
                {/* Obrigatório */}
                <Autocomplete
                  value={desClassi}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsClassificacao}
                  getOptionLabel={rowsClassificacao =>
                    rowsClassificacao.DesClassi
                  }
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setDesClassi('')
                      : setDesClassi({
                          CodClassi: newValue.CodClassi,
                          DesClassi: newValue.DesClassi
                        });
                    setErrorsDesClassi(false);
                    setHelperErrorsDesClassi('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsDesClassi}
                      error={errorsDesClassi}
                      className="m-2"
                      placeholder="Selecione uma Classificação"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Faturamento Mensal</div>{' '}
                {/* Obrigatório */}
                <Autocomplete
                  value={desFatura}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsFaturamento}
                  getOptionLabel={rowsFaturamento => rowsFaturamento.DesFatura}
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setDesFatura('')
                      : setDesFatura({
                          CodFatura: newValue.CodFatura,
                          DesFatura: newValue.DesFatura
                        });
                    setErrorsDesFatura(false);
                    setHelperErrorsDesFatura('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsDesFatura}
                      error={errorsDesFatura}
                      className="m-2"
                      placeholder="Selecione um Faturamento"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Segmento</div> {/* Obrigatório */}
                <Autocomplete
                  value={desSegmen}
                  ListboxProps={{ style: { maxHeight: '15rem' } }}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsSegmento}
                  getOptionLabel={rowsSegmento => rowsSegmento.DesSegmen}
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      setDesSegmen('');
                      setAreaAtuacao([]);
                    } else {
                      setDesSegmen({
                        CodSegmen: newValue.CodSegmen,
                        DesSegmen: newValue.DesSegmen
                      });
                      let segmentoEscolhido = newValue.CodSegmen;
                      populateAreaAtuacao(segmentoEscolhido);
                    }
                    setNomAreAtu('');
                    setErrorsDesSegmen(false);
                    setHelperErrorsDesSegmen('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsDesSegmen}
                      error={errorsDesSegmen}
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
              <Grid item xs={6}>
                <div className="searchBar">Área de Atuação</div>{' '}
                {/* Obrigatório e deverá se atualizar conforme Segmento selecionado */}
                <Autocomplete
                  value={nomAreAtu}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsAreaAtuacao}
                  getOptionLabel={rowsAreaAtuacao => rowsAreaAtuacao.NomAreAtu}
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setNomAreAtu('')
                      : setNomAreAtu({
                          CodSegmen: newValue.CodSegmen,
                          CodAreAtu: newValue.CodAreAtu,
                          NomAreAtu: newValue.NomAreAtu
                        });
                    setErrorsNomAreAtu(false);
                    setHelperErrorsNomAreAtu('');
                  }}
                  renderInput={params => (
                    <TextField
                      onClick={() => checkSegmento()}
                      helperText={helperErrorsNomAreAtu}
                      error={errorsNomAreAtu}
                      className="m-2"
                      placeholder="Selecione uma Área de Atuação"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Quantidade de Funcionários</div>{' '}
                {/* Obrigatório */}
                <Autocomplete
                  value={desQtdFun}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsQtdFuncionario}
                  getOptionLabel={rowsQtdFuncionario =>
                    rowsQtdFuncionario.DesQtdFun
                  }
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setDesQtdFun('')
                      : setDesQtdFun({
                          CodQtdFun: newValue.CodQtdFun,
                          DesQtdFun: newValue.DesQtdFun
                        });
                    setErrorsDesQtdFun(false);
                    setHelperErrorsDesQtdFun('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsDesQtdFun}
                      error={errorsDesQtdFun}
                      className="m-2"
                      placeholder="Selecione uma Quantidade de Funcionários"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">CNPJ</div>
                <TextField
                  autoComplete="off"
                  fullWidth
                  className="m-2"
                  placeholder="Informe o CNPJ"
                  id="outlined-size-small"
                  value={codCNPJ}
                  variant="outlined"
                  size="small"
                  helperText={helperErrorsCodCNPJ}
                  error={errorsCodCNPJ}
                  onChange={e => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    if (onlyNums.length < 14) {
                      setCodCNPJ(onlyNums);
                    } else if (onlyNums.length === 14) {
                      const number = onlyNums.replace(
                        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                        '$1.$2.$3/$4-$5'
                      );
                      setCodCNPJ(number);
                    }
                    setErrorsCodCNPJ(false);
                    setHelperErrorsCodCNPJ('');
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Ano de Fundação</div>
                <TextField
                  autoComplete="off"
                  type="number"
                  InputProps={{
                    inputProps: { min: '1500', max: '2500', step: '1' }
                  }}
                  fullWidth
                  className="m-2"
                  placeholder="Informe o Ano de Fundação"
                  id="outlined-size-small"
                  value={anoFundac}
                  variant="outlined"
                  size="small"
                  helperText={helperErrorsAnoFundac}
                  error={errorsAnoFundac}
                  onChange={e => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    if (onlyNums.length < 4) {
                      setAnoFundac(onlyNums);
                    } else if (onlyNums.length === 4) {
                      if (onlyNums < 1500 || onlyNums > 2500) {
                        setErrorsAnoFundac(true);
                        setHelperErrorsAnoFundac(
                          'Valor deve ser > 1499 e < 2501'
                        );
                      } else {
                        const number = onlyNums.replace(/^(\d{4})$/, '$1');
                        setAnoFundac(number);
                      }
                    }
                    setErrorsAnoFundac(false);
                    setHelperErrorsAnoFundac('');
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Tipo de Cliente</div>{' '}
                {/* Obrigatório */}
                <FormControl error={errorsTipEmpres}>
                  <RadioGroup
                    row={true}
                    aria-label="Tipo de Cliente"
                    onChange={e => {
                      setTipEmpres(e.target.value);
                      setErrorsTipEmpres(false);
                      setHelperErrorsTipEmpres('');
                    }}>
                    <FormControlLabel
                      value="Cliente"
                      control={<Radio color="primary" />}
                      label="Cliente"
                      checked={tipEmpres == 'Cliente' ? 'checked' : ''}
                    />
                    <FormControlLabel
                      value="Prospect"
                      control={<Radio color="primary" />}
                      label="Prospect"
                      checked={tipEmpres == 'Prospect' ? 'checked' : ''}
                    />
                  </RadioGroup>
                  {errorsTipEmpres ? helperErrorsTipEmpres : ''}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Matriz</div>
                <FormGroup
                  onChange={e => {
                    matriz == 0 || '' ? setMatriz(1) : setMatriz(0);
                  }}>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="É Matriz?"
                    checked={matriz == 1 ? 'checked' : ''}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <div className="searchBar" style={{ fontSize: '18px' }}>
                  Dados dos Contatos:
                </div>
                <Divider className="my-4" />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Nome do Responsável</div>{' '}
                {/* Obrigatório */}
                <TextField
                  autocomplete="off"
                  required
                  fullWidth
                  placeholder="Informe o Nome do Responsável"
                  multiline
                  rowsMax={3}
                  className="m-2"
                  id="outlined-size-small"
                  value={nomRespon}
                  variant="outlined"
                  size="small"
                  onChange={e => {
                    setNomRespon(e.target.value);
                    setErrorsNomRespon(false);
                    setHelperErrorsNomRespon('');
                  }}
                  error={errorsNomRespon}
                  helperText={helperErrorsNomRespon}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Cargo do Responsável</div>{' '}
                {/* Obrigatório */}
                <Autocomplete
                  value={desCargo}
                  ListboxProps={{ style: { maxHeight: '10rem' } }}
                  disablePortal
                  id="outlined-size-small"
                  options={rowsCargo}
                  getOptionLabel={rowsCargo => rowsCargo.DesCargo}
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setDesCargo('')
                      : setDesCargo({
                          CodCargo: newValue.CodCargo,
                          DesCargo: newValue.DesCargo
                        });
                    setErrorsDesCargo(false);
                    setHelperErrorsDesCargo('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsDesCargo}
                      error={errorsDesCargo}
                      className="m-2"
                      placeholder="Selecione um Cargo"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">E-mail do Responsável</div>{' '}
                {/* Obrigatório e validado se está no formato de email*/}
                <TextField
                  autocomplete="off"
                  required
                  fullWidth
                  placeholder="Informe o E-mail do Responsável"
                  multiline
                  rowsMax={3}
                  className="m-2"
                  id="outlined-size-small"
                  value={emaRespon}
                  variant="outlined"
                  size="small"
                  onChange={e => {
                    setEmaRespon(e.target.value);
                    setErrorsEmaRespon(false);
                    setHelperErrorsEmaRespon('');
                  }}
                  onBlur={e => handleCheckEmail(emaRespon)}
                  error={errorsEmaRespon}
                  helperText={helperErrorsEmaRespon}
                />
              </Grid>
              <Grid item xs={6}>
                <div className="searchBar">Telefone do Responsável</div>{' '}
                {/* Obrigatório */}
                <TextField
                  type="phone"
                  required
                  autoComplete="off"
                  fullWidth
                  className="m-2"
                  placeholder="Informe o Telefone do Responsável"
                  id="outlined-size-small"
                  value={telRespon}
                  variant="outlined"
                  size="small"
                  onChange={e => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    if (onlyNums.length < 10) {
                      setTelRespon(onlyNums);
                    } else if (onlyNums.length === 10) {
                      const number = onlyNums.replace(
                        /(\d{2})(\d{4})(\d{4})/,
                        '($1) $2-$3'
                      );
                      setTelRespon(number);
                    } else if (onlyNums.length === 11) {
                      const number = onlyNums.replace(
                        /(\d{2})(\d{1})(\d{4})(\d{4})/,
                        '($1) $2 $3-$4'
                      );
                      setTelRespon(number);
                    }
                    setErrorsTelRespon(false);
                    setHelperErrorsTelRespon('');
                  }}
                  error={errorsTelRespon}
                  helperText={helperErrorsTelRespon}
                />
                {/*  {!exibeContatos ? (
                  <Button
                    className="m-2"
                    variant="outlined"
                    color="primary"
                    onClick={() => setExibeContatos(true)}
                    endIcon={<ArrowDownward />}>
                    Exibir outros contatos
                  </Button>
                ) : (
                  <Button
                    className="m-2"
                    variant="outlined"
                    color="primary"
                    onClick={() => setExibeContatos(false)}
                    endIcon={<ArrowUpward />}>
                    Ocultar outros contatos
                  </Button>
                )} */}
              </Grid>
              {codigo[5] == 'CodEmpres=0' ? (
                ''
              ) : (
                <>
                  <Grid item xs={12}>
                    <div className="searchBar" style={{ fontSize: '18px' }}>
                      Outros Contatos:
                    </div>
                    <Divider className="my-4" />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="searchBar">Nome do Contato</div>{' '}
                    {/* Obrigatório */}
                    <TextField
                      autocomplete="off"
                      required
                      fullWidth
                      placeholder="Informe o Nome do Contato"
                      multiline
                      rowsMax={3}
                      className="m-2"
                      id="outlined-size-small"
                      value={nomContat}
                      variant="outlined"
                      size="small"
                      onChange={e => {
                        setNomContat(e.target.value);
                        setErrorsNomContat(false);
                        setHelperErrorsNomContat('');
                      }}
                      error={errorsNomContat}
                      helperText={helperErrorsNomContat}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="searchBar">Cargo do Contato</div>{' '}
                    {/* Obrigatório */}
                    <Autocomplete
                      disablePortal
                      ListboxProps={{ style: { maxHeight: '10rem' } }}
                      id="outlined-size-small"
                      options={rowsCargo}
                      getOptionLabel={rowsCargo => rowsCargo.DesCargo}
                      onChange={(event, newValue) => {
                        setErrorsDesCargo2(false);
                        setHelperErrorsDesCargo2('');
                        newValue === null
                          ? setDesCargo2('')
                          : setDesCargo2({
                              CodCargo: newValue.CodCargo,
                              DesCargo: newValue.DesCargo
                            });
                      }}
                      renderInput={params => (
                        <TextField
                          helperText={helperErrorsDesCargo2}
                          error={errorsDesCargo2}
                          className="m-2"
                          placeholder="Selecione um Cargo"
                          fullWidth
                          variant="outlined"
                          {...params}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="searchBar">E-mail do Contato</div>{' '}
                    {/* Obrigatório e validado se está no formato de email*/}
                    <TextField
                      autocomplete="off"
                      required
                      fullWidth
                      placeholder="Informe o E-mail do Contato"
                      multiline
                      rowsMax={3}
                      className="m-2"
                      id="outlined-size-small"
                      value={emaContat}
                      variant="outlined"
                      size="small"
                      onChange={e => {
                        setEmaContat(e.target.value);
                        setErrorsEmaContat(false);
                        setHelperErrorsEmaContat('');
                      }}
                      error={errorsEmaContat}
                      helperText={helperErrorsEmaContat}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="searchBar">Telefone do Contato</div>{' '}
                    {/* Obrigatório */}
                    <TextField
                      type="phone"
                      required
                      autoComplete="off"
                      fullWidth
                      className="m-2"
                      placeholder="Informe o Telefone do Contato"
                      id="outlined-size-small"
                      value={telContat}
                      variant="outlined"
                      size="small"
                      error={errorsTelContat}
                      helperText={helperErrorsTelContat}
                      onChange={e => {
                        setErrorsTelContat(false);
                        setHelperErrorsTelContat('');
                        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                        if (onlyNums.length < 10) {
                          setTelContat(onlyNums);
                        } else if (onlyNums.length === 10) {
                          const number = onlyNums.replace(
                            /(\d{2})(\d{4})(\d{4})/,
                            '($1) $2-$3'
                          );
                          setTelContat(number);
                        } else if (onlyNums.length === 11) {
                          const number = onlyNums.replace(
                            /(\d{2})(\d{1})(\d{4})(\d{4})/,
                            '($1) $2 $3-$4'
                          );
                          setTelContat(number);
                        }
                      }}
                    />
                    <div align="right">
                      <Button
                        className="m-2"
                        variant="contained"
                        color="primary"
                        onClick={() => concluiAcao2()}>
                        &nbsp;&nbsp;Adicionar&nbsp;&nbsp;&nbsp;&nbsp;
                      </Button>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Paper
                      style={{
                        maxHeight: '200px',
                        minHeight: '200px',
                        overflow: 'auto'
                      }}>
                      <List disablePadding>
                        {rowsContatoEmp.map(row => (
                          <ListItem key={row.CodEmpres + '_' + row.CodContat}>
                            {row.CodEmpres + '_' + row.CodContat === rowCode ? (
                              <>
                                <ListItemText
                                  style={{
                                    maxWidth: '150px',
                                    minWidth: '150px',
                                    margin: '10px'
                                  }}>
                                  <TextField
                                    id="outlined-size-small"
                                    defaultValue={row.NomContat}
                                    value={novoNomContat}
                                    size="small"
                                    autoComplete="off"
                                    onChange={e => {
                                      setNovoNomContat(e.target.value);
                                    }}></TextField>
                                </ListItemText>
                                <ListItemText
                                  style={{
                                    maxWidth: '230px',
                                    minWidth: '230px',
                                    margin: '10px'
                                  }}>
                                  <TextField
                                    fullWidth
                                    id="outlined-size-small"
                                    defaultValue={row.EmaContat}
                                    value={novoEmaContat}
                                    size="small"
                                    autoComplete="off"
                                    onChange={e => {
                                      setNovoEmaContat(e.target.value);
                                    }}></TextField>
                                </ListItemText>
                                <ListItemText
                                  style={{
                                    maxWidth: '110px',
                                    minWidth: '110px',
                                    margin: '10px'
                                  }}>
                                  <TextField
                                    id="outlined-size-small"
                                    defaultValue={row.TelContat}
                                    size="small"
                                    type="phone"
                                    autoComplete="off"
                                    value={formatPhoneNumber(novoTelContat)}
                                    onChange={e => {
                                      const onlyNums = e.target.value.replace(
                                        /[^0-9]/g,
                                        ''
                                      );
                                      if (onlyNums.length < 10) {
                                        setNovoTelContat(onlyNums);
                                      } else if (onlyNums.length === 10) {
                                        const number = onlyNums.replace(
                                          /(\d{2})(\d{4})(\d{4})/,
                                          '($1) $2-$3'
                                        );
                                        setNovoTelContat(number);
                                      } else if (onlyNums.length === 11) {
                                        const number = onlyNums.replace(
                                          /(\d{2})(\d{1})(\d{4})(\d{4})/,
                                          '($1) $2 $3-$4'
                                        );
                                        setNovoTelContat(number);
                                      }
                                    }}></TextField>
                                </ListItemText>
                                <ListItemText
                                  style={{
                                    maxWidth: '160px',
                                    minWidth: '160px',
                                    margin: '10px'
                                  }}>
                                  <Autocomplete
                                    value={novoDesCargo}
                                    disablePortal
                                    id="outlined-size-small"
                                    options={rowsCargo}
                                    getOptionLabel={rowsCargo =>
                                      rowsCargo.DesCargo
                                    }
                                    onChange={(event, newValue) => {
                                      newValue === null
                                        ? setNovoDesCargo('')
                                        : setNovoDesCargo({
                                            CodCargo: newValue.CodCargo,
                                            DesCargo: newValue.DesCargo
                                          });
                                    }}
                                    renderInput={params => (
                                      <TextField
                                        /* helperText={helperErrorsDesCargo}
                          error={errorsDesCargo} */
                                        className="m-2"
                                        placeholder="Selecione um Cargo"
                                        fullWidth
                                        {...params}
                                        size="small"
                                      />
                                    )}
                                  />
                                </ListItemText>
                                <ListItemSecondaryAction>
                                  <IconButton
                                    aria-label="edit"
                                    edge="end"
                                    onClick={() => {
                                      /* concluiAcaoResposta(
                                        false,
                                        novaResposta,
                                        novoPercentua,
                                        row.CodRespos
                                      ); */
                                      setRowCode('');
                                    }}>
                                    <CheckIcon />
                                  </IconButton>
                                  <IconButton
                                    edge="end"
                                    aria-label="Clear"
                                    onClick={() => setRowCode('')}>
                                    <ClearIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </>
                            ) : (
                              <>
                                <ListItemText
                                  style={{
                                    maxWidth: '150px',
                                    minWidth: '150px'
                                  }}
                                  primary={row.NomContat}></ListItemText>
                                <ListItemText
                                  style={{
                                    maxWidth: '250px',
                                    minWidth: '250px'
                                  }}
                                  primary={row.EmaContat}></ListItemText>
                                <ListItemText
                                  style={{
                                    maxWidth: '120px',
                                    minWidth: '120px'
                                  }}
                                  primary={formatPhoneNumber(
                                    row.TelContat
                                  )}></ListItemText>
                                <ListItemText
                                  style={{
                                    maxWidth: '200px',
                                    minWidth: '200px'
                                  }}
                                  primary={row.DesCargo}></ListItemText>
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    aria-label="comments"
                                    onClick={() => {
                                      setRowCode(
                                        row.CodEmpres + '_' + row.CodContat
                                      );
                                      setNovoNomContat(row.NomContat);
                                      setNovoEmaContat(row.EmaContat);
                                      setNovoTelContat(row.TelContat);
                                      setNovoDesCargo({
                                        CodCargo: row.CodCarCnt,
                                        DesCargo: row.DesCargo
                                      });
                                      setAntigoNomContat(row.NomContat);
                                      setAntigoEmaContat(row.EmaContat);
                                      setAntigoTelContat(row.TelContat);
                                      setAntigoDesCargo(row.DesCargo);
                                    }}>
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    edge="end"
                                    aria-label="comments"
                                    onClick={() =>
                                      clickExcluir(row.CodEmpres, row.CodContat)
                                    }>
                                    <Delete />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                    {/* <Paper
                      style={{
                        maxHeight: '100px',
                        minHeight: '100px',
                        overflow: 'auto',
                        marginLeft: 9
                      }}>
                      <List>
                        {rowsContatoEmp.map(row => (
                          <ListItem key={row.CodEmpres + '_' + row.CodContat}>
                            <ListItemText
                              primary={row.NomContat}></ListItemText>
                            <ListItemText
                              primary={row.EmaContat}></ListItemText>
                            <ListItemText
                              primary={row.TelContat}></ListItemText>
                            <ListItemText primary={row.DesCargo}></ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                 onClick={() =>
                                clickExcluir(row.CodSegmen)
                              } 
                              >
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Paper> */}
                  </Grid>
                </>
              )}

              {/* {exibeContatos && (
                <Grid xs={12} sm={12} md={12}>
                  <TableBody
                    className={classes.table}
                    aria-label="custom pagination table">
                    <Snackbar
                      open={open1}
                      autoHideDuration={2000}
                      onClose={handleClose1}
                      className={classes.snackbar}>
                      <Alert onClose={handleClose1} severity="success">
                        Registro armazenado. Para concluir, clique em
                        "Confirmar"!
                      </Alert>
                    </Snackbar>
                    <Box margin={1}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                        <div>
                          {isEdit ? (
                            <div>
                              <Button onClick={handleAdd}>
                                <AddBoxIcon onClick={handleAdd} />
                                Novo contato
                              </Button>
                              {rows.length !== 0 && (
                                <div>
                                  {disable ? (
                                    <Button
                                      disabled
                                      align="right"
                                      onClick={handleSave}>
                                      <DoneIcon />
                                      Salva
                                    </Button>
                                  ) : (
                                    <Button align="right" onClick={handleSave}>
                                      <DoneIcon />
                                      Salva
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <Button onClick={handleAdd}>
                                <AddBoxIcon onClick={handleAdd} />
                                Novo contato
                              </Button>
                              <Button align="right" onClick={handleEdit}>
                                <CreateIcon />
                                Editar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <TableRow align="center"> </TableRow>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell align="center">Cargo</TableCell>
                            <TableCell align="center"> </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, i) => {
                            return (
                              <div>
                                <TableRow>
                                  {isEdit ? (
                                    <div>
                                      <TableCell padding="none">
                                        <input
                                          value={row.firstname}
                                          name="nome"
                                          onChange={e =>
                                            handleInputChange(e, i)
                                          }
                                        />
                                      </TableCell>
                                      <TableCell padding="none">
                                        <input
                                          value={row.lastname}
                                          name="email"
                                          onChange={e =>
                                            handleInputChange(e, i)
                                          }
                                        />
                                      </TableCell>
                                      <TableCell padding="none">
                                        <select
                                          style={{ width: '100px' }}
                                          name="cargo"
                                          value={row.city}
                                          onChange={e =>
                                            handleInputChange(e, i)
                                          }>
                                          <option value=""></option>
                                          <option value="Karanja">
                                            Karanja
                                          </option>
                                          <option value="Hingoli">
                                            Hingoli
                                          </option>
                                          <option value="Bhandara">
                                            Bhandara
                                          </option>
                                          <option value="Amaravati">
                                            Amaravati
                                          </option>
                                          <option value="Pulgaon">
                                            Pulgaon
                                          </option>
                                        </select>
                                      </TableCell>
                                    </div>
                                  ) : (
                                    <div>
                                      <TableCell component="th" scope="row">
                                        {row.firstname}
                                      </TableCell>
                                      <TableCell component="th" scope="row">
                                        {row.lastname}
                                      </TableCell>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        align="center">
                                        {row.city}
                                      </TableCell>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        align="center"></TableCell>
                                    </div>
                                  )}
                                  {isEdit ? (
                                    <Button
                                      className="mr10"
                                      onClick={handleConfirm}>
                                      <ClearIcon />
                                    </Button>
                                  ) : (
                                    <Button
                                      className="mr10"
                                      onClick={handleConfirm}>
                                      <DeleteOutlineIcon />
                                    </Button>
                                  )}
                                  {showConfirm && (
                                    <div>
                                      <Dialog
                                        open={showConfirm}
                                        onClose={handleNo}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description">
                                        <DialogTitle id="alert-dialog-title">
                                          {'Confirm Delete'}
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText id="alert-dialog-description">
                                            Are you sure to delete
                                          </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            onClick={() => handleRemoveClick(i)}
                                            color="primary"
                                            autoFocus>
                                            Yes
                                          </Button>
                                          <Button
                                            onClick={handleNo}
                                            color="primary"
                                            autoFocus>
                                            No
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </div>
                                  )}
                                </TableRow>
                              </div>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Box>
                  </TableBody>
                </Grid>
              )} */}
              <Grid container justify="space-around" spacing={2}>
                <Grid item xs={12}>
                  <Divider className="my-4" />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Button
                    fullWidth
                    className="m-2"
                    variant="outlined"
                    color="primary"
                    href="/Empresa">
                    Voltar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Box sx={{ width: '100%' }}>
                    <Button
                      fullWidth
                      className="m-2"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        
                        submitForm();
                        concluiAcao();
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
