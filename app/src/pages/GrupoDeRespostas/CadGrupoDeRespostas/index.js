import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { Delete, Edit } from '@material-ui/icons';

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
  buscaGrpResposta,
  excluiGrpResposta,
  buscaReferenciaPergunta,
  incluiGrpResposta,
  alteraGrpResposta,
  buscaResposta,
  excluiResposta,
  incluiResposta,
  alteraResposta,
  buscaProximoID,
  incluiGrupoEResposta,
  buscaTotalPercent
} from 'services/grupoDeRespostas';
import { Paper } from '@material-ui/core';

export default function CadGrupoDeRespostas() {
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [valor2, setValor2] = useState('');
  const [valor3, setValor3] = useState('');
  const [tipo, setTipo] = useState(1);
  const [dados, setDados] = useState([]);
  const [selecao, setSelecao] = useState([]);
  const [novaResposta, setNovaResposta] = useState('');
  const [novoPercentua, setNovoPercentua] = useState('');
  const [antigaResposta, setAntigaResposta] = useState('');
  const [antigoPercentua, setAntigoPercentua] = useState('');
  const [antigoGrpResposta, setAntigoGrpResposta] = useState('');
  const [novoGrpResposta, setNovoGrpResposta] = useState('');
  const [antigoTipo, setAntigoTipo] = useState('');
  const [novoTipo, setNovoTipo] = useState('');
  const [rowCode, setRowCode] = useState('');
  const [codigoGrupo, setCodigoGrupo] = useState('');
  const [resposta, setResposta] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [plusNovo, setPlusNovo] = useState(false);
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
  const [errorsTipo, setErrorsTipo] = useState(false);
  const [helperErrorsTipo, setHelperErrorsTipo] = useState('');
  const [errorsResposta, setErrorsResposta] = useState(false);
  const [helperErrorsResposta, setHelperErrorsResposta] = useState('');
  const [errorsPercentua, setErrorsPercentua] = useState(false);
  const [helperErrorsPercentua, setHelperErrorsPercentua] = useState('');
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

  const aplicaFiltro = valor => {
    if (valor.length >= 1) setFiltro("LIKE '%" + valor + "%'");
    else setFiltro(null);
  };

  function createDataRespostas(CodGrupo, CodRespos, DesRespos, Percentua) {
    return { CodGrupo, CodRespos, DesRespos, Percentua };
  }

  let rowsRespostas = [];
  rowsRespostas = resposta.map(each =>
    createDataRespostas(
      each.CodGrupo,
      each.CodRespos,
      each.DesRespos,
      each.Percentua
    )
  );

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    setCodigoGrupo(filtro[5].replace('CodGrpRes=', ''));
    setRefresh(false);
    if (filtro[5] !== 'CodGrpRes=0') {
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          let filtro2 = filtro[5].replace('CodGrpRes', 'CodGrupo');
          await buscaResposta(filtro2).then(data => {
            if (data !== undefined) {
              setResposta(data.registros);
            } else setResposta([]);
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setResposta([]);
          console.log(err);
        }
        try {
          await buscaGrpResposta(filtro[5]).then(data => {
            if (data !== undefined) {
              if (data.registros.length > 0) {
                setDados(data.registros);
                setValor(data.registros[0].NomGrpRes);
                setAntigoGrpResposta(data.registros[0].NomGrpRes);
                setNovoGrpResposta(data.registros[0].NomGrpRes);
                setTipo(data.registros[0].TipoRespo);
                setAntigoTipo(data.registros[0].TipoRespo);
                setNovoTipo(data.registros[0].TipoRespo);
              } else {
                setDados([]);
                setTransacaoIncluir(true);
                setOpen(true);
                setMensagem({
                  titulo: 'Aviso',
                  conteudo:
                    'Registro selecionado não existe! Selecione um registro existente.',
                  acao: '/GrupoDeRespostas'
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
                acao: '/GrupoDeRespostas'
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

  const clickExcluir = (CodGrupo, CodRespos) => {
    setSelecao([CodGrupo, CodRespos]);
    setOpenEscolha(true);
  };

  const concluiAcaoGrpResposta = (
    transacaoIncluir,
    NomGrpRes,
    TipoRespos,
    CodGrpRes,
    plusNovo
  ) => {
    if (transacaoIncluir === true) {
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const inclui = await incluiGrpResposta(NomGrpRes, TipoRespos);

            if (inclui === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
              setHelperErrorsTipo(true);
              setHelperErrorsTipo('*');
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: plusNovo
                  ? '/GrupoDeRespostas/CadGrupoDeRespostas/CodGrpRes=0'
                  : '/GrupoDeRespostas'
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
            acao: '/GrupoDeRespostas'
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
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          if (
            novoGrpResposta !== antigoGrpResposta &&
            (novoTipo !== antigoTipo || novoTipo === antigoTipo)
          ) {
            if (valor !== '' && valor !== undefined) {
              const alteracaoGrpResposta = await alteraGrpResposta(
                CodGrpRes,
                NomGrpRes,
                TipoRespos,
                false
              );
              if (alteracaoGrpResposta === false) {
                setErrors(true);
                setHelperErrors('*Já existe um cadastro com este nome');
                setErrorsTipo(true);
                setHelperErrorsTipo('*');
              } else {
                setMensagem({
                  titulo: 'Sucesso',
                  conteudo: 'Alteração realizada com sucesso!',
                  acao: '/GrupoDeRespostas'
                });
                setOpen(true);
                if (cancel) {
                  return;
                }
              }
            }
          } else if (
            novoGrpResposta === antigoGrpResposta &&
            novoTipo !== antigoTipo
          ) {
            if (valor !== '' && valor !== undefined) {
              await alteraGrpResposta(CodGrpRes, NomGrpRes, TipoRespos, true);
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/GrupoDeRespostas'
              });
              setOpen2(true);
              if (cancel) {
                return;
              }
            }
          } else {
            setMensagem({
              titulo: 'Aviso',
              conteudo:
                'Nenhuma alteração realizada no nome do Grupo ou tipo do grupo',
              acao: '/GrupoDeRespostas'
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
            acao: '/GrupoDeRespostas'
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

  const concluiAcaoResposta2 = (NomGrpRes, StatGrupo, DesRespos, Percentua) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (valor !== '' && valor !== undefined) {
          if (
            valor2 !== '' &&
            valor2 !== undefined &&
            valor3 !== '' &&
            valor3 !== undefined
          ) {
            const ultimoIDGrpResposta = await buscaProximoID();
            var proxIDGrpResposta = 1;
            if (ultimoIDGrpResposta.registros[0].NovoIDGrpResposta !== 'NULL')
              proxIDGrpResposta =
                ultimoIDGrpResposta.registros[0].NovoIDGrpResposta + 1;
            const inclui = await incluiGrupoEResposta(
              NomGrpRes,
              StatGrupo,
              DesRespos,
              Percentua
            );
            if (inclui === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: `/GrupoDeRespostas/CadGrupoDeRespostas/CodGrpRes=${proxIDGrpResposta}`
              });
              setOpen2(true);
              if (cancel) {
                return;
              }
            }
          } else if (valor2 === '' && valor3 !== '') {
            setErrorsResposta(true);
            setHelperErrorsResposta('*Campo obrigatório');
            setErrorsPercentua(true);
            setHelperErrorsPercentua('*');
          } else if (valor2 !== '' && valor3 === '') {
            setErrorsResposta(true);
            setHelperErrorsResposta('*');
            setErrorsPercentua(true);
            setHelperErrorsPercentua('*Campo obrigatório');
          } else if (valor2 === '' && valor3 === '') {
            setErrorsResposta(true);
            setHelperErrorsResposta('*Campo obrigatório');
            setErrorsPercentua(true);
            setHelperErrorsPercentua('*Campo obrigatório');
          }
        } else {
          submitForm();
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/GrupoDeRespostas'
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

  const concluiAcaoResposta = (
    transacaoIncluirResposta,
    DesRespos,
    Percentua,
    CodRespos
  ) => {
    var menorQue100 = false;
    if (transacaoIncluirResposta === true) {
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            if (
              valor2 !== '' &&
              valor2 !== undefined &&
              valor3 !== '' &&
              valor3 !== undefined
            ) {
              if (tipo == 2) {
                await buscaTotalPercent(codigoGrupo).then(data => {
                  if (
                    parseInt(data.registros[0].TotalPorcentagem) +
                      parseInt(Percentua) >
                    100
                  ) {
                    setErrorsResposta(true);
                    setHelperErrorsResposta('*');
                    setErrorsPercentua(true);
                    setHelperErrorsPercentua('*%Total ultrapassada');
                    setMensagem({
                      titulo: 'Aviso',
                      conteudo: `A porcentagem total deve ser menor ou igual a 100%!`
                    });
                    setOpen(true);
                    if (cancel) {
                      return;
                    }
                  } else {
                    menorQue100 = true;
                  }
                });
              } else {
                menorQue100 = true;
              }
            } else if (valor2 === '' && valor3 !== '') {
              setErrorsResposta(true);
              setHelperErrorsResposta('*Campo obrigatório');
              setErrorsPercentua(true);
              setHelperErrorsPercentua('*');
            } else if (valor2 !== '' && valor3 === '') {
              setErrorsResposta(true);
              setHelperErrorsResposta('*');
              setErrorsPercentua(true);
              setHelperErrorsPercentua('*Campo obrigatório');
            } else if (valor2 === '' && valor3 === '') {
              setErrorsResposta(true);
              setHelperErrorsResposta('*Campo obrigatório');
              setErrorsPercentua(true);
              setHelperErrorsPercentua('*Campo obrigatório');
            }
          } else {
            submitForm();
          }
          if (menorQue100 == true) {
            const inclui2 = await incluiResposta(
              codigoGrupo,
              DesRespos,
              Percentua
            );
            if (inclui2 === false) {
              setErrorsResposta(true);
              setHelperErrorsResposta('*Já existe um cadastro com este nome');
              setErrorsPercentua(true);
              setHelperErrorsPercentua('*');
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!'
              });
              setOpen(true);
              setValor2('');
              setValor3('');
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
            acao: '/GrupoDeRespostas'
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
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          if (novaResposta !== '' && novoPercentua !== '') {
            if (
              novaResposta != antigaResposta &&
              novoPercentua != antigoPercentua
            ) {
              if (tipo == 2) {
                await buscaTotalPercent(codigoGrupo).then(data => {
                  if (
                    parseInt(data.registros[0].TotalPorcentagem) +
                      parseInt(Percentua) >
                    100
                  ) {
                    menorQue100 = false;
                  } else {
                    menorQue100 = true;
                  }
                });
              } else {
                menorQue100 = true;
              }
              if (menorQue100 == true) {
                const alteracaoResposta = await alteraResposta(
                  codigoGrupo,
                  CodRespos,
                  DesRespos,
                  Percentua,
                  1
                );
                if (alteracaoResposta === false) {
                  setMensagem({
                    titulo: 'Atenção',
                    conteudo:
                      'Já existe uma descrição com este nome neste grupo de resposta!'
                  });
                  setOpen(true);
                  if (cancel) {
                    return;
                  }
                } else {
                  setMensagem({
                    titulo: 'Sucesso',
                    conteudo: 'Alteração realizada com sucesso!'
                  });
                  setOpen(true);
                  if (cancel) {
                    return;
                  }
                }
              } else
                setMensagem({
                  titulo: 'Aviso',
                  conteudo:
                    'A porcentagem total deve ser menor ou igual a 100%!'
                });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else if (
              novaResposta != antigaResposta &&
              novoPercentua == antigoPercentua
            ) {
              const alteracaoResposta = await alteraResposta(
                codigoGrupo,
                CodRespos,
                DesRespos,
                Percentua,
                2
              );
              if (alteracaoResposta === false) {
                setMensagem({
                  titulo: 'Atenção',
                  conteudo:
                    'Já existe uma descrição com este nome neste grupo de resposta!'
                });
                setOpen(true);
                if (cancel) {
                  return;
                }
              } else {
                setMensagem({
                  titulo: 'Sucesso',
                  conteudo: 'Alteração realizada com sucesso!'
                });
                setOpen(true);
                if (cancel) {
                  return;
                }
              }
            } else if (
              novaResposta == antigaResposta &&
              novoPercentua != antigoPercentua
            ) {
              if (tipo == 2) {
                await buscaTotalPercent(codigoGrupo).then(data => {
                  if (
                    parseInt(data.registros[0].TotalPorcentagem) +
                      parseInt(Percentua) >
                    100
                  ) {
                    menorQue100 = false;
                  } else {
                    menorQue100 = true;
                  }
                });
              } else {
                menorQue100 = true;
              }
              if (menorQue100 == true) {
                const alteracaoResposta = await alteraResposta(
                  codigoGrupo,
                  CodRespos,
                  DesRespos,
                  Percentua,
                  3
                );
                setMensagem({
                  titulo: 'Sucesso',
                  conteudo: 'Alteração realizada com sucesso!'
                });
                setOpen(true);
                if (cancel) {
                  return;
                }
              } else
                setMensagem({
                  titulo: 'Aviso',
                  conteudo: `A porcentagem total deve ser menor ou igual a 100%!`
                });
              setOpen(true);
              if (cancel) {
                return;
              }
            }
          } else {
            setMensagem({
              titulo: 'Aviso',
              conteudo:
                'Os campos Descrição de Resposta e Percentual são obrigatórios'
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
            acao: '/GrupoDeRespostas'
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

  const excluiRegistroResposta = (CodGrupo, CodRespos) => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        await excluiResposta(CodGrupo, CodRespos);
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
          acao: '/GrpRespostaDePerguntas'
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

  const handleChange1 = campo => event => {
    setValor(event.target.value);
    setNovoGrpResposta(event.target.value);
  };

  const handleChange2 = event => {
    setTipo(event.target.value);
    setNovoTipo(event.target.value);
  };

  const handleChange3 = event => {
    setValor2(event.target.value);
  };

  const submitForm = Form => {
    if (valor === '') {
      setErrors(true);
      setHelperErrors('*O preenchimento deste campo é obrigatório');
      setErrorsTipo(true);
      setHelperErrorsTipo('*');
    }
  };

  const handler = event => {
    const value = event.target.value;
    const setValue = value <= 100 ? value : valor3;
    setValor3(setValue);
  };

  const handler2 = event => {
    const value = event.target.value;
    const setValue = value <= 100 ? value : novoPercentua;
    setNovoPercentua(setValue);
  };

  const url = window.location.href;
  const NovoOuAlteracao = url.split('/');

  return (
    <Fragment>
      <Dialog
        open={openEscolha}
        onClose={handleClose2}
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
            onClick={() => {
              excluiRegistroResposta(selecao[0], selecao[1]);
              setOpenEscolha(false);
            }}
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
        titleHeading="Grupo de Respostas"
        titleDescription={
          NovoOuAlteracao != 'CodGrpRes=0'
            ? 'Alteração do Grupo de Resposta'
            : 'Novo Grupo de Resposta'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              <Grid item xs={11} sm={9} md={10} lg={10}>
                <div className="searchBar">Nome do Grupo de Resposta</div>
              </Grid>
              <Grid item xs={1} sm={3} md={2} lg={2}>
                <div className="searchBar"> &nbsp;&nbsp;Tipo</div>
              </Grid>
              <Grid
                container
                justify="flex-start"
                spacing={2}
                wrap="wrap"
                alignItems="center">
                <Grid item xs={11} sm={9} md={10} lg={10}>
                  <TextField
                    required
                    fullWidth
                    placeholder="Informe o Nome do Novo Grupo de Resposta"
                    multiline
                    rowsMax={3}
                    className="m-2"
                    id="outlined-size-small"
                    value={valor}
                    variant="outlined"
                    size="small"
                    onInput={e => {
                      setErrors(false);
                      setHelperErrors('');
                      setErrorsTipo(false);
                      setHelperErrorsTipo('');
                    }}
                    onChange={handleChange1('grupoDeResposta')}
                    error={errors}
                    helperText={helperErrors}
                  />
                </Grid>
                <Grid item xs={1} sm={3} md={2} lg={2}>
                  <TextField
                    className="m-2"
                    defaultValue={tipo}
                    id="outlined-size-small"
                    onChange={handleChange2}
                    value={tipo}
                    size="small"
                    variant="outlined"
                    select
                    fullWidth
                    error={errorsTipo}
                    helperText={helperErrorsTipo}>
                    <MenuItem value={1}>Única Escolha</MenuItem>
                    <MenuItem value={2}>Múltipla Escolha</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Grid item>
                <div
                  className="searchBar"
                  style={{
                    marginTop: '2px'
                  }}>
                  Respostas
                </div>
              </Grid>
              <Grid item xs={12}>
                <Divider className="w-100" />
              </Grid>
              <Grid item item xs={12} sm={8} md={8}>
                <div className="searchBar">Descrição da Respostas</div>
              </Grid>
              <Grid item item xs={4} sm={4} md={4}>
                <div className="searchBar">
                  &nbsp;&nbsp;Percentual (0 a 100%)
                </div>
              </Grid>
              <Grid container spacing={1} wrap="wrap" alignItems="center">
                <Grid item xs={8} sm={8} md={8}>
                  <TextField
                    helperText={helperErrorsResposta}
                    error={errorsResposta}
                    className="m-2"
                    fullWidth
                    variant="outlined"
                    onInput={e => {
                      setErrorsResposta(false);
                      setHelperErrorsResposta('');
                      setErrorsPercentua(false);
                      setHelperErrorsPercentua('');
                    }}
                    onChange={handleChange3}
                    onBlur={e => {
                      setValor2(e.target.value);
                    }}
                    size="small"
                    value={valor2}
                  />
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                  <TextField
                    helperText={helperErrorsPercentua}
                    error={errorsPercentua}
                    className="m-2"
                    type="number"
                    InputProps={{
                      inputProps: { min: '0', max: '100', step: '1' }
                    }}
                    fullWidth
                    onInput={e => {
                      setErrorsResposta(false);
                      setHelperErrorsResposta('');
                      setErrorsPercentua(false);
                      setHelperErrorsPercentua('');
                    }}
                    onChange={handler}
                    onBlur={e => {
                      setValor3(e.target.value);
                    }}
                    variant="outlined"
                    size="small"
                    value={valor3}
                  />
                </Grid>
                <Grid item xs={1} sm={1} md={1} align="center">
                  {NovoOuAlteracao[5] === 'CodGrpRes=0' ? (
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
                        concluiAcaoResposta2(valor, tipo, valor2, valor3);
                        setRowCode('');
                        setRefresh(true);
                      }}>
                      +
                    </Button>
                  ) : (
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
                        concluiAcaoResposta(true, valor2, valor3);
                        setRowCode('');
                        setRefresh(true);
                      }}>
                      +
                    </Button>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Paper
                  style={{
                    maxHeight: '100px',
                    minHeight: '100px',
                    overflow: 'auto'
                  }}>
                  <List>
                    {rowsRespostas.map(row => (
                      <ListItem key={row.CodRespos}>
                        {row.CodRespos === rowCode ? (
                          <>
                            <ListItemText>
                              <TextField
                                id="outlined-size-small"
                                defaultValue={row.DesRespos}
                                size="small"
                                autoComplete="off"
                                onBlur={e => {
                                  setNovaResposta(e.target.value);
                                }}></TextField>
                            </ListItemText>
                            <ListItemText>
                              <TextField
                                id="outlined-size-small"
                                defaultValue={row.Percentua}
                                size="small"
                                type="number"
                                autoComplete="off"
                                value={novoPercentua}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment>%</InputAdornment>
                                  ),
                                  max: 100,
                                  min: 0
                                }}
                                onChange={handler2}
                                onBlur={e => {
                                  setNovoPercentua(e.target.value);
                                }}></TextField>
                            </ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-label="edit"
                                edge="end"
                                onClick={() => {
                                  concluiAcaoResposta(
                                    false,
                                    novaResposta,
                                    novoPercentua,
                                    row.CodRespos
                                  );
                                  setRowCode('');
                                  setRefresh(true);
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
                              primary={row.DesRespos}></ListItemText>
                            <ListItemText
                              primary={row.Percentua + '%'}></ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  setRowCode(row.CodRespos);
                                  setNovaResposta(row.DesRespos);
                                  setNovoPercentua(row.Percentua);
                                  setAntigaResposta(row.DesRespos);
                                  setAntigoPercentua(row.Percentua);
                                }}>
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() =>
                                  clickExcluir(row.CodGrupo, row.CodRespos)
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
                      href="/GrupoDeRespostas">
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
                        concluiAcaoGrpResposta(
                          transacaoIncluir,
                          valor,
                          tipo,
                          transacaoIncluir ? 0 : dados[0].CodGrpRes,
                          plusNovo
                        );
                        aplicaFiltro(valor);
                        submitForm();
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
                {NovoOuAlteracao[5] == 'CodGrpRes=0' ? (
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/GrupoDeRespostas/CadGrupoDeRespostas/CodGrpRes=0"
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
                          concluiAcaoGrpResposta(
                            transacaoIncluir,
                            valor,
                            tipo,
                            transacaoIncluir ? 0 : dados[0].CodGrpRes,
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
