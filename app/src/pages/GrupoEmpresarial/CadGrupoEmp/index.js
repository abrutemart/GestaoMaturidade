import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { useHistory } from "react-router-dom";
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
  Divider,
} from '@material-ui/core';

import { buscaGrupos, incluiGrupos, alteraGrupos } from '../../../services/grupoEmpresarial';

export default function CadGrupoEmp() {
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [dados, setDados] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true); 
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: '',
  });
  const [open, setOpen] = useState(false);
  const history = useHistory();
  
  const handleClose = () => {
    setOpen(false);
    history.push(mensagem.acao);
  };
 
  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    if (filtro[5] !== "CodGrpEmp=0")
    {
      setTransacaoIncluir(false);
      setLoading(true)
      setDados([])
      let cancel = false
      const runEffect = async () => {
        try {
          await buscaGrupos(filtro[5])
          .then(data =>  {
            if (data !== undefined) {
              if (data.registros.length > 0) {
                setDados(data.registros)
                setValor(data.registros[0].NomGrpEmp)
              }
              else {
                setDados([]);
                setTransacaoIncluir(true);
                setOpen(true);
                setMensagem({
                  titulo: 'Aviso',
                  conteudo: 'Registro selecionado não existe! Selecione um registro existente.',
                  acao: '/GrupoEmpresarial',
                })                
              }
            }
            else {
              setDados([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo: 'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/GrupoEmpresarial',
              })
            }
          })
          if (cancel) {
            return
          }
        } catch (err) {
          setDados([])
          console.log(err)
        } finally {
          if (!cancel) {
            setLoading(false)
          }
        }
      }
      runEffect()
      return () => {
        cancel = true
      }
    }
  }, [])

  const concluiAcao = (acao, set, where) => {
    if (acao === true) {
      setLoading(true)
      let cancel = false
      const inclui = async () => {
        try {
          await incluiGrupos(set);
          setMensagem({
            titulo: 'Sucesso',
              conteudo: 'Inclusão realizada com sucesso!',
            acao: '/GrupoEmpresarial',
          });
          setOpen(true);
          if (cancel) {
            return
          }
        } catch (err) {
          console.log(err);
          setOpen(true);
          setMensagem({
            titulo: 'Erro',
            conteudo: err,
            acao: '/GrupoEmpresarial',
          })
        } finally {
          if (!cancel) 
            setLoading(false)
        }
      }
      inclui()
        return () => {
          cancel = true
        }
    }
    else {
      let alteracao = " NomGrpEmp = '" + set + "'";
      let filtro = " CodGrpEmp = " + where;
      setLoading(true)
      let cancel = false
      const altera = async () => {
        try {
          await alteraGrupos(alteracao, filtro);
          setMensagem({
            titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!',
            acao: '/GrupoEmpresarial',
          });
          setOpen(true);
          if (cancel) {
            return
          }
        } catch (err) {
          console.log(err);
          setOpen(true);
          setMensagem({
            titulo: 'Erro',
            conteudo: err,
            acao: '/GrupoEmpresarial',
          })
        } finally {
          if (!cancel) 
            setLoading(false)
        }
      }
      altera()
        return () => {
          cancel = true
        }
    }
  }

  const handleChange = (campo) => event => {
    setValor(event.target.value);
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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
        titleHeading="Grupo Empresarial"
        titleDescription={dados.length > 0 ? 'Alteração do grupo empresarial' : 'Novo grupo empresarial'}
      />  
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  className="m-2"
                  label="Nome do grupo empresarial"
                  id="outlined-size-small"
                  value={valor}
                  variant="outlined"
                  size="small"
                  onChange={handleChange('grupoEmp')}
                />
              </Grid>
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
                    href="/GrupoEmpresarial">
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
                      onClick={() => concluiAcao(transacaoIncluir, valor, transacaoIncluir ? 0 : dados[0].CodGrpEmp)}>
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