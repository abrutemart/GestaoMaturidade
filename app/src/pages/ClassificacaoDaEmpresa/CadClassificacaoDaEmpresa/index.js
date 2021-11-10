import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';

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
  buscaClassificacaoEmpresa,  
  incluiClassificacao,
  alteraClassificacao
} from 'services/classificacaoDaEmpresa'; 

import { setHeaderFixed } from 'reducers/ThemeOptions';

export default function CadClassificacaoDaEmpresa() {
  const [filtro, setFiltro] = useState(null);
  
  const [valor, setValor] = useState('');
  const [valor2, setValor2] = useState('');
  const [codigoSeg, setCodigoSeg] = useState('');
  const [dados, setDados] = useState([]);
  const [classificacao, setClassificao] = useState([]);  
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

  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const aplicaFiltro = valor => {
    if (valor.length >= 1) setFiltro("LIKE '%" + valor + "%'");
    else setFiltro(null);
  };

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');    
    if (filtro[5] !== 'CodClassi=0') {
      setTransacaoIncluir(false);
      
      setDados([]);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaClassificacaoEmpresa( filtro[5], undefined).then(
            data => {
              if (data !== undefined) {
                if (data.registros.length > 0) {
                  setDados(data.registros);
                  setValor(data.registros[0].DesClassi);                  
                } else {
                  setDados([]);
                  setTransacaoIncluir(true);
                  setOpen(true);
                  setMensagem({
                    titulo: 'Aviso',
                    conteudo:
                      'Registro selecionado não existe! Selecione um registro existente.',
                    acao: '/ClassificacaoDaEmpresa'
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
                  acao: '/ClassificacaoDaEmpresa'
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
    CodClassi,
    DesClassi,
    plusNovo
  ) => {
    if (transacaoIncluir === true) {
      
      let cancel = false;
      const inclui = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const inclui = await incluiClassificacao(              
              CodClassi,
              DesClassi
            );
            if (inclui === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else if (plusNovo === false) {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/ClassificacaoDaEmpresa'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/ClassificacaoDaEmpresa/CadClassificacaoDaEmpresa/CodClassi=0'
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
        } 
      };
      inclui();
      return () => {
        cancel = true;
      };
    } else {
      
      let cancel = false;
      const altera = async () => {
        try {
          if (DesClassi !== '' && DesClassi !== undefined) {
            const alteracaoClassificacao = await alteraClassificacao(
              CodClassi,
              DesClassi
            );
            if (alteracaoClassificacao === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Alteração realizada com sucesso!',
                acao: '/ClassificacaoDaEmpresa'
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
            acao: '/ClassificacaoDaEmpresa'
          });
        } finally {
          
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
        titleHeading="Classificação da Empresa"
        titleDescription={
          dados.length > 0
            ? 'Alteração da Classificação da Empresa'
            : 'Nova Classificação da Empresa'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">              
              <div className="searchBar">Classificação da Empresa</div>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe o Nome da Nova Classificação"
                  multiline
                  rowsMax={3}
                  helperText={helperErrors}
                  className="m-2"
                  id="outlined-size-small"
                  value={valor}
                  variant="outlined"
                  size="small"
                  onChange={handleChange('classificação')}
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
                      href="/ClassificacaoDaEmpresa">
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
                          transacaoIncluir ? 0 : dados[0].CodClassi,
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
                {NovoOuAlteracao[5] == 'CodClassi=0' ? (
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/ClassificacaoDaEmpresa/CadClassificacaoDaEmpresa/CodClassi=0"
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
                            transacaoIncluir ? 0 : dados[0].CodClassi,
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
