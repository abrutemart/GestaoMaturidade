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
  incluiCategoria  
} from 'services/categoriasDePerguntas'; 

export default function CadCategoriaDePerguntas() {  
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');   
  const plusNovo = false;
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

  useEffect(() => {
    const url = window.location.href;    
  }, []);

  const concluiAcao = (
    DesCatego,
    plusNovo
  ) => {    
      setLoading(true);
      let cancel = false;
      const inclui = async () => {
        try {
          if (valor !== '' && valor !== undefined) {
            const inclui = await incluiCategoria(undefined,
              DesCatego
            );
            if (inclui === false) {
              setErrors(true);
              setHelperErrors('*Já existe um cadastro com este nome');
            } else if (plusNovo === false) {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/CategoriaDePerguntas'
              });
              setOpen(true);
              if (cancel) {
                return;
              }
            } else {
              setMensagem({
                titulo: 'Sucesso',
                conteudo: 'Inclusão realizada com sucesso!',
                acao: '/CategoriaDePerguntas/CadCategoriaDePerguntas/CodCatego=0'
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
            acao: '/CategoriaDePerguntas'
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

  const handleChange = campo => event => {
    setValor(event.target.value);
  };

  const submitForm = Form => {    
    if (valor === '') {      
      setErrors(true);
      setHelperErrors('*O preenchimento deste campo é obrigatório');
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
        titleHeading="Categorias de Perguntas"
        titleDescription={'Nova Categoria de Pergunta'}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">              
              <div className="searchBar">Categoria de Pergunta</div>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe a nova Categoria de Pergunta"
                  multiline
                  rowsMax={3}
                  helperText={helperErrors}
                  className="m-2"
                  id="outlined-size-small"
                  value={valor}
                  variant="outlined"
                  size="small"
                  onChange={handleChange('Categoria')}
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
                      href="/CategoriaDePerguntas">
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
                          valor,
                          plusNovo
                        );                        
                        submitForm();
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>                
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ width: '100%' }} textAlign="center">
                      <Button
                        to="/CategoriaDePerguntas/CadCategoriaDePerguntas/CodCatego=0"
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
                            valor
                          );
                          submitForm();
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
