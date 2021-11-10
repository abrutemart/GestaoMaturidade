import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Add } from '@material-ui/icons';

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
  buscaPais,
  buscaEstado,
  buscaCidade,
  buscaCidade2,
  buscaCidadeCompleta,
  buscaReferenciaPais,
  incluiCidade,
  incluiEstado,
  incluiRegistro
} from '../../../services/paisEstadoCidade';

export default function CadPaisEstadoCidade() {
  const [loading, setLoading] = useState(true);
  const [valorCidade, setValorCidade] = useState('');
  const [valorEstado, setValorEstado] = useState('');
  const [valorPais, setValorPais] = useState('');
  const [dados, setDados] = useState([]);
  const [pais, setPais] = useState([]);
  const [paisEscolhido, setPaisEscolhido] = useState('');
  const [estadoEscolhido, setEstadoEscolhido] = useState('');
  const [cidadeEscolhida, setCidadeEscolhida] = useState('');
  const [cidade, setCidade] = useState([]);
  const [estado, setEstado] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState(false);
  const [errorsPais, setErrorsPais] = useState(false);
  const [errorsEstado, setErrorsEstado] = useState(false);
  const [errorsCidade, setErrorsCidade] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');
  const [helperErrorsPais, setHelperErrorsPais] = useState('');
  const [helperErrorsEstado, setHelperErrorsEstado] = useState('');
  const [helperErrorsCidade, setHelperErrorsCidade] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });

  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const handleChange = campo => event => {
    setValorCidade(event.target.value);
    setPaisEscolhido(event.target.value);
  };

  const populatePais = async () => {
    await buscaPais().then(data => {
      setPais(data.registros);
    });
  };

  function createDataPais(CodPais, NomPais) {
    return { CodPais, NomPais };
  }

  let rowsPais = [];
  rowsPais = pais.map(each => createDataPais(each.CodPais, each.NomPais));

  var listaPaises = rowsPais.map(item => item.NomPais);

  const populateEstado = async () => {
    if (paisEscolhido !== '' && paisEscolhido !== null) {
      await buscaEstado(`UPPER('${paisEscolhido}')`).then(data => {
        setEstado(data.registros);
      });
    } else {
      setEstado([]);
    }
  };

  function createDataEstado(CodEstado, NomEstado) {
    return { CodEstado, NomEstado };
  }

  let rowsEstados = [];
  rowsEstados = estado.map(each =>
    createDataEstado(each.CodEstado, each.NomEstado)
  );

  var listaEstados = rowsEstados.map(item => item.NomEstado);

  function createDados(
    CodCidade,
    NomCidade,
    CodEstado,
    NomEstado,
    CodPais,
    NomPais
  ) {
    return { CodCidade, NomCidade, CodEstado, NomEstado, CodPais, NomPais };
  }

  let rowsDados = [];
  rowsDados = dados.map(each =>
    createDados(
      each.CodCidade,
      each.NomCidade,
      each.CodEstado,
      each.NomEstado,
      each.CodPais,
      each.NomPais
    )
  );

  const populateCidades = async () => {
    if (
      paisEscolhido !== '' &&
      estadoEscolhido !== '' &&
      paisEscolhido !== null &&
      estadoEscolhido !== null
    )
      await buscaCidade2(estadoEscolhido).then(data => {
        setCidade(data.registros);
      });
    else {
      setCidade([]);
    }
  };

  function createDataCidade(CodCidade, NomCidade) {
    return { CodCidade, NomCidade };
  }

  let rowsCidades = [];
  rowsCidades = cidade.map(each =>
    createDataCidade(each.CodCidade, each.NomCidade)
  );

  var listaCidade = rowsCidades.map(item => item.NomCidade);

  useEffect(() => {
    populatePais();
    populateCidades();
    populateEstado();
    setLoading(true);
    setDados([]);
    setRefresh(false);
    let cancel = false;
    const runEffect = async () => {
      try {
        await buscaCidade().then(data => {
          if (data !== undefined) setDados(data.registros);
          else setDados([]);
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
  }, [refresh, paisEscolhido, estadoEscolhido, cidadeEscolhida]);

  const concluiAcao = (paisEscolhido, estadoEscolhido, cidadeEscolhida) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        const existeCidade = await buscaCidade(cidadeEscolhida, estadoEscolhido, paisEscolhido);
        const checkInclusão = await incluiRegistro(
          paisEscolhido,
          estadoEscolhido,
          cidadeEscolhida
        );
        
        if (existeCidade.registros[0] !== undefined) {
          setErrorsCidade(true);
          setHelperErrorsCidade('*Já existe um cadastro com este nome');
        } else if (checkInclusão !== false) {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Inclusão realizada com sucesso!',
            acao: '/PaisEstadoCidade'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
        if (
          paisEscolhido === '' ||
          paisEscolhido === null ||
          paisEscolhido === undefined
        ) {
          setErrorsPais(true);
          setHelperErrorsPais('*Este campo é obrigatório');
        }
        if (
          estadoEscolhido === '' ||
          estadoEscolhido === null ||
          estadoEscolhido === undefined
        ) {
          setErrorsEstado(true);
          setHelperErrorsEstado('*Este campo é obrigatório');
        }
        if (
          cidadeEscolhida === '' ||
          cidadeEscolhida === null ||
          cidadeEscolhida === undefined
        ) {
          setErrorsCidade(true);
          setHelperErrorsCidade('*Este campo é obrigatório');
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PaisEstadoCidade'
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

  const concluiAcaoMaisNovo = (
    paisEscolhido,
    estadoEscolhido,
    cidadeEscolhida
  ) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        const existeCidade = await buscaCidade(cidadeEscolhida, estadoEscolhido, paisEscolhido);
        const checkInclusão = await incluiRegistro(
          paisEscolhido,
          estadoEscolhido,
          cidadeEscolhida
        );
        await incluiRegistro(paisEscolhido, estadoEscolhido, cidadeEscolhida);
        if (existeCidade.registros[0] !== undefined) {
          setErrorsCidade(true);
          setHelperErrorsCidade('*Já existe um cadastro com este nome');
        } else if (checkInclusão !== false) {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Inclusão realizada com sucesso!',
            acao: '/PaisEstadoCidade/CadPaisEstadoCidade/CodCidade=0'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
        if (
          paisEscolhido === '' ||
          paisEscolhido === null ||
          paisEscolhido === undefined
        ) {
          setErrorsPais(true);
          setHelperErrorsPais('*Este campo é obrigatório');
        }
        if (
          estadoEscolhido === '' ||
          estadoEscolhido === null ||
          estadoEscolhido === undefined
        ) {
          setErrorsEstado(true);
          setHelperErrorsEstado('*Este campo é obrigatório');
        }
        if (
          cidadeEscolhida === '' ||
          cidadeEscolhida === null ||
          cidadeEscolhida === undefined
        ) {
          setErrorsCidade(true);
          setHelperErrorsCidade('*Este campo é obrigatório');
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PaisEstadoCidade'
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

  const checkPais = Form => {
    if (paisEscolhido === '' || paisEscolhido === null) {
      setErrorsPais(true);
      setHelperErrorsPais('*O preenchimento deste campo é obrigatório');
    }
  };

  const checkEstado = Form => {
    if (estadoEscolhido === '' || estadoEscolhido === null) {
      setErrorsEstado(true);
      setHelperErrorsEstado('*O preenchimento deste campo é obrigatório');
    }
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
      <PageTitle
        titleHeading="País / Estado / Cidade"
        titleDescription={'Novo País / Estado / Cidade'}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div>&nbsp;</div>
          <Card className="p-4 mb-4">
            <div className="searchBar">Novos Paises / Estados / Cidades</div>
            <div className="divider my-2" />
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              <div className="searchBar">País</div>
              <Grid container justify="flex-start" spacing={1} wrap="wrap">
                <Grid item xs={12} sm={12} md={12}>
                  <Autocomplete
                    onBlur={e => {
                      
                      setPaisEscolhido(e.target.value);
                      setErrorsPais(false);
                      setHelperErrorsPais('');
                      
                    }}
                    disablePortal
                    freeSolo
                    id="outlined-size-small"
                    options={listaPaises}
                    defaultValue={valorPais}
                    renderInput={params => (
                      <TextField
                        helperText={helperErrorsPais}
                        error={errorsPais}
                        className="m-2"
                        fullWidth
                        variant="outlined"
                        {...params}
                        size="small"
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <div className="searchBar">Estado</div>
              <Grid container justify="flex-start" spacing={1} wrap="wrap">
                <Grid item xs={12} sm={12} md={12}>
                  <Autocomplete
                    onBlur={e => {
                      
                      setEstadoEscolhido(e.target.value);
                      setErrorsEstado(false);
                      setHelperErrorsEstado('');
                      
                    }}
                    disablePortal
                    freeSolo
                    className="outlined-size-small"
                    options={listaEstados}
                    defaultValue={valorPais}
                    renderInput={params => (
                      <TextField
                        onClick={checkPais}
                        helperText={helperErrorsEstado}
                        error={errorsEstado}
                        className="m-2"
                        fullWidth
                        variant="outlined"
                        {...params}
                        size="small"
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <div className="searchBar">Cidade</div>
              <Grid container justify="flex-start" spacing={1} wrap="wrap">
                <Grid item xs={12} sm={12} md={12}>
                  <Autocomplete
                    onBlur={e => {
                      
                      setCidadeEscolhida(e.target.value);
                      setErrorsCidade(false);
                      setHelperErrorsCidade('');
                      
                    }}
                    disablePortal
                    freeSolo
                    className="outlined-size-small"
                    options={listaCidade}
                    renderInput={params => (
                      <TextField
                        onClick={() => {
                          checkEstado();
                          checkPais();
                        }}
                        helperText={helperErrorsCidade}
                        error={errorsCidade}
                        className="m-2"
                        fullWidth
                        variant="outlined"
                        {...params}
                        size="small"
                      />
                    )}
                  />
                </Grid>
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
                      href="/PaisEstadoCidade">
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
                          paisEscolhido,
                          estadoEscolhido,
                          cidadeEscolhida
                        );
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Box sx={{ width: '100%' }} textAlign="center">
                    <Button
                      to="/PaisEstadoCidade/CadPaisEstadoCidade/CodCidade=0"
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
                          paisEscolhido,
                          estadoEscolhido,
                          cidadeEscolhida
                        );
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
}
