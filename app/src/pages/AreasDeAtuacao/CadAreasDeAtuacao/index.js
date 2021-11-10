import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  buscaAreaDeAtuacao,
  buscaSegmentos,
  incluiAreaAtuacao,
  alteraAreaAtuacao
} from 'services/areasDeAtuacao';

export default function CadAreasDeAtuacao() {
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [valor2, setValor2] = useState('');
  const [codigoSeg, setCodigoSeg] = useState('');
  const [dados, setDados] = useState([]);
  const [areaAtuacao, setAreaAtuacao] = useState([]);  
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [plusNovo, setPlusNovo] = useState(false);
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState(false);
  const [helperErrors, setHelperErrors] = useState('');
  const [errorsSegmento, setErrorsSegmento] = useState(false);
  const [helperErrorsSegmento, setHelperErrorsSegmento] = useState('');  

  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const aplicaFiltro = valor => {
    if (valor.length >= 1) setFiltro("LIKE '%" + valor + "%'");
    else setFiltro(null);
  };

  const populateAreaAtuacao = async () => {
    await buscaSegmentos().then(data => {
      setAreaAtuacao(data.registros);
    });
  };

  function createDataAreaAtuacao(CodSegmen, DesSegmen) {
    return { CodSegmen, DesSegmen };
  }

  let rowsAreaAtuacao = [];
  rowsAreaAtuacao = areaAtuacao.map(each =>
    createDataAreaAtuacao(each.CodSegmen, each.DesSegmen)
  );  

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    populateAreaAtuacao();
    if (filtro[5] !== 'CodAreAtu=0') {
      setTransacaoIncluir(false);
      setLoading(true);
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaAreaDeAtuacao(undefined, filtro[5], undefined).then(
            data => {
              if (data !== undefined) {
                if (data.registros.length > 0) {
                  setDados(data.registros);
                  setValor(data.registros[0].NomAreAtu);
                  setValor2(data.registros[0].DesSegmen);
                } else {
                  setDados([]);
                  setTransacaoIncluir(true);
                  setOpen(true);
                  setMensagem({
                    titulo: 'Aviso',
                    conteudo:
                      'Registro selecionado não existe! Selecione um registro existente.',
                    acao: '/AreasDeAtuacao'
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
                  acao: '/AreasDeAtuacao'
                });
              }
            }
          );
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
  }, [filtro, codigoSeg]);

  const concluiAcao = (
    transacaoIncluir,
    codSegmento,
    codAreaAtuacao,
    desAreaAtuacao,
    plusNovo
  ) => {
    if (transacaoIncluir === true) {
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const inclui = await incluiAreaAtuacao(
              codSegmento,
              codAreaAtuacao,
              desAreaAtuacao
            );
            if (codigoSeg === null || codigoSeg === '') {
              setErrors(false);
              setHelperErrors('');
            } else if (inclui === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else if (plusNovo === false) {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/AreasDeAtuacao'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/AreasDeAtuacao/CadAreasDeAtuacao/CodAreAtu=0'
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
    } else {
      setLoading(true);
      let cancel = false;
      const altera = async () => {
        try {
          if (desAreaAtuacao !== '' && desAreaAtuacao !== undefined) {
            const alteracaoAreaAtuacao = await alteraAreaAtuacao(
              codSegmento,
              codAreaAtuacao,
              desAreaAtuacao
            );
            if (alteracaoAreaAtuacao === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/AreasDeAtuacao'
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
            acao: '/AreasDeAtuacao'
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

  const handleChange = campo => event => {
    setValor(event.target.value);
  };

  const submitForm = Form => {
    if (codigoSeg === '' || codigoSeg === null || codigoSeg === undefined) {
      setErrorsSegmento(true);
      setHelperErrorsSegmento(
        '*É necessário escolher uma das opções já cadastradas'
      );
    }
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
        titleHeading="Áreas de Atuação"
        titleDescription={
          dados.length > 0
            ? 'Alteração da Área de Atuação'
            : 'Nova Área de Atuação'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              <div className="searchBar">Segmento</div>
              <Grid item xs={12} sm={12} md={12}>
                {NovoOuAlteracao[5] == 'CodAreAtu=0' ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      
                      if (newValue != null) {
                        setCodigoSeg(newValue.CodSegmen);
                        setErrorsSegmento(false);
                        setHelperErrorsSegmento('');
                      } else {
                        setCodigoSeg(null);                        
                        setErrorsSegmento(false);
                        setHelperErrorsSegmento('');
                      }                      
                    }}
                    disablePortal
                    freeSolo
                    id="outlined-size-small"
                    options={rowsAreaAtuacao}
                    getOptionLabel={option => option.DesSegmen}
                    renderInput={params => (
                      <TextField
                        helperText={helperErrorsSegmento}
                        error={errorsSegmento}
                        className="m-2"
                        fullWidth
                        variant="outlined"
                        {...params}
                        size="small"
                      />
                    )}
                  />
                ) : (
                  <Autocomplete
                    disablePortal
                    disabled
                    freeSolo
                    id="outlined-size-small"
                    value={valor2}
                    renderInput={params => (
                      <TextField
                        /* helperText={helperErrorsSegmento}
                        error={errorsSegmento} */
                        className="m-2"
                        fullWidth
                        variant="outlined"
                        {...params}
                        size="small"
                      />
                    )}
                  />
                )}
              </Grid>
              <div className="searchBar">Área de Atuação</div>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o Nome da Nova Área de Atuação"
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
                      href="/AreasDeAtuacao">
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
                          transacaoIncluir ? codigoSeg : dados[0].CodSegmen,
                          transacaoIncluir ? 0 : dados[0].CodAreAtu,
                          valor,
                          plusNovo
                        );
                        aplicaFiltro(valor);
                        submitForm();
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
                {NovoOuAlteracao[5] == 'CodAreAtu=0' ? (
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/AreasDeAtuacao/CadAreasDeAtuacao/CodAreAtu=0"
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
                            codigoSeg,
                            transacaoIncluir ? 0 : dados[0].CodAreAtu,
                            valor,
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
