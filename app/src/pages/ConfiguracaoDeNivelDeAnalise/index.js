import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageTitle } from '../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import {
  TableBody,
  Divider,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Edit, Add } from '@material-ui/icons';

import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  buscaNivelAnalise,
  buscaNivAnaliseSegmen,
  incluiConfigNivGeral,
  buscaCfgNivelAnalise,
  excluiCfgNivGeral,
  incluiHistConfigNiv,
  excluiCfgNivEsp
} from '../../services/configuracaoDeNivelDeAnalise';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page">
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page">
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500
  }
});

export default function Segmentos() {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const history = useHistory();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [dados, setDados] = useState([]);
  const [errorsValor2, setErrorsValor2] = useState(false);
  const [errorsValor3, setErrorsValor3] = useState(false);
  const [cfgNivelAnalise, setCfgNivelAnalise] = useState([]);
  const [helperErrorsValor2, setHelperErrorsValor2] = useState('');
  const [helperErrorsValor3, setHelperErrorsValor3] = useState('');
  const [nivelAnalise, setNivelAnalise] = useState([]);
  const [nivAnaliseSegmen, setNivAnaliseSegmen] = useState([]);
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [valor, setValor] = useState('');
  const [valor1, setValor1] = useState('');
  const [valor2, setValor2] = useState('');
  const [valor3, setValor3] = useState('');
  const [open, setOpen] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const [openEscolha2, setOpenEscolha2] = useState(false);
  const [selecao, setSelecao] = useState();
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [refresh, setRefresh] = useState(false);

  const handler = event => {
    const value = event.target.value;
    const setValue = value <= 100 ? value : valor2;
    setValor2(setValue);
    setErrorsValor2(false);
    setHelperErrorsValor2('');
  };

  const handler2 = event => {
    const value = event.target.value;
    const setValue = value <= 100 ? value : valor3;
    setValor3(setValue);
    setErrorsValor3(false);
    setHelperErrorsValor3('');
  };

  function createDataNivAnaliseSegmen(CodSegmen, DesSegmen, Niveis) {
    return { CodSegmen, DesSegmen, Niveis };
  }

  let rowsNivAnaliseSegmen = [];
  rowsNivAnaliseSegmen = nivAnaliseSegmen.map(each =>
    createDataNivAnaliseSegmen(each.CodSegmen, each.DesSegmen, each.Niveis)
  );

  function createDataCfgNivelAnalise(CodNivAna, DesNivAna) {
    return { CodNivAna, DesNivAna };
  }

  let rowsCfgNivelDeAnalise = [];
  rowsCfgNivelDeAnalise = cfgNivelAnalise.map(each =>
    createDataCfgNivelAnalise(each.CodNivAna, each.DesNivAna)
  );

  function createDataNivelAnalise(CodNivAna, DesNivAna) {
    return { CodNivAna, DesNivAna };
  }

  let rowsNivelDeAnalise = [];
  rowsNivelDeAnalise = nivelAnalise.map(each =>
    createDataNivelAnalise(each.CodNivAna, each.DesNivAna)
  );

  const aplicaFiltro = valor => {
    if (valor.length >= 1)
      setFiltro(
        `Segmento.DesSegmen LIKE '%${valor}%' COLLATE Latin1_General_CI_AI`
      );
    else setFiltro(null);
  };

  const montaLink = codigo => {
    history.push(
      `/ConfiguracaoDeNiveldeAnalise/CadConfiguracaoDeNiveldeAnalise/CodSegmen=${codigo}`
    );
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rowsNivAnaliseSegmen.length - page * rowsPerPage);

  useEffect(() => {
    setLoading(true);
    setDados([]);
    setRefresh(false);
    let cancel = false;
    const runEffect = async () => {
      try {
        await buscaCfgNivelAnalise().then(data => {
          if (data !== undefined) setCfgNivelAnalise(data.registros);
          else setDados([]);
        });
        await buscaNivelAnalise().then(data => {
          if (data !== undefined) setNivelAnalise(data.registros);
          else setDados([]);
        });
        await buscaNivAnaliseSegmen(filtro).then(data => {
          if (data !== undefined) setNivAnaliseSegmen(data.registros);
          else setNivAnaliseSegmen([]);
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
  }, [filtro, refresh]);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
    setOpenEscolha2(false);
  };

  const clickExcluir = CodNivAna => {
    setSelecao(CodNivAna);
    setOpenEscolha(true);
  };

  const clickExcluir2 = CodSegmen => {
    setSelecao(CodSegmen);
    setOpenEscolha2(true);
  };

  const addPeso = (PtoForte, PtoFraco) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (submitForm() != false) {
          const inclui = await incluiHistConfigNiv(PtoForte, PtoFraco);
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Inclusão realizada com sucesso!'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
          setRefresh(true);
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ConfiguracaoDeNiveldeAnalise'
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

  const addCfgNivGeral = CodNivAna => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        const inclui = await incluiConfigNivGeral(CodNivAna);
        if (inclui === false) {
          setMensagem({
            titulo: 'Aviso',
            conteudo: 'Já existe um cadastro com este nome'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Inclusão realizada com sucesso!'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
          setRefresh(true);
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ConfiguracaoDeNiveldeAnalise'
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

  const delCfgNivGeral = CodNivAna => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        await excluiCfgNivGeral(CodNivAna);
        setMensagem({
          titulo: 'Sucesso',
          conteudo: 'Exclusão realizada com sucesso!'
        });
        setOpen(true);
        if (cancel) {
          return;
        }
        setRefresh(true);
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ConfiguracaoDeNiveldeAnalise'
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

  const delCfgNivEsp = CodSegmen => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        await excluiCfgNivEsp(CodSegmen);
        setMensagem({
          titulo: 'Sucesso',
          conteudo: 'Exclusão realizada com sucesso!'
        });
        setOpen(true);
        if (cancel) {
          return;
        }
        setRefresh(true);
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/ConfiguracaoDeNiveldeAnalise'
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

  const submitForm = Form => {
    const check1 = () => {
      if (valor2 === '' || valor2 === undefined || valor2 === null) {
        setErrorsValor2(true);
        setHelperErrorsValor2('*Campo obrigatório');
        return false;
      }
    };

    const check2 = () => {
      if (valor3 === '' || valor3 === undefined || valor3 === null) {
        setErrorsValor3(true);
        setHelperErrorsValor3('*Campo obrigatório');
        return false;
      }
    };

    check1();
    check2();

    if (check1() == false || check2() == false) return false;
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
          <Button onClick={handleClose} color="primary" autoFocus>
            Não
          </Button>
          <Button
            onClick={() => {
              delCfgNivGeral(selecao);
            }}
            color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEscolha2}
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
            onClick={() => {
              delCfgNivEsp(selecao);
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
      <PageTitle
        titleHeading="Configuração de Nível de Análise"
        titleDescription="Consulta"
      />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <div className="searchBar">Configuração Geral</div>
          <Grid item xs={12}>
            <Divider className="my-4" />
          </Grid>
          <Card className="p-4 mb-4">
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <div className="searchBar">Nível de Análise</div>
              </Grid>
              <Grid item xs={3}>
                <div className="searchBar">Pontos Fortes(%)</div>
              </Grid>
              <Grid item xs={3}>
                <div className="searchBar">Pontos Fracos(%)</div>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Autocomplete
                  disablePortal
                  id="outlined-size-small"
                  options={rowsNivelDeAnalise}
                  ListboxProps={{ style: { maxHeight: 100, overflow: 'auto' } }}
                  getOptionLabel={rowsNivelDeAnalise =>
                    rowsNivelDeAnalise.DesNivAna
                  }
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      setValor1('');
                    } else {
                      setValor1(newValue.CodNivAna);
                      addCfgNivGeral(newValue.CodNivAna);
                    }
                  }}
                  renderInput={params => (
                    <TextField
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
                <TextField
                  autoComplete="off"
                  fullWidth
                  className="m-2"
                  id="outlined-size-small"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={valor2}
                  InputProps={{
                    max: 100,
                    min: 0
                  }}
                  onChange={handler}                  
                  error={errorsValor2}
                  helperText={helperErrorsValor2}></TextField>                
              </Grid>

              <Grid item xs={3}>
              <TextField
                  autoComplete="off"
                  fullWidth
                  className="m-2"
                  id="outlined-size-small"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={valor3}
                  InputProps={{
                    max: 100,
                    min: 0
                  }}
                  onChange={handler2}                  
                  error={errorsValor3}
                  helperText={helperErrorsValor3}></TextField> 
              </Grid>
              <Grid item xs={1} align="center">
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
                    addPeso(valor2, valor3);
                  }}>
                  +
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Paper
                style={{
                  maxHeight: '100px',
                  minHeight: '100px',
                  overflow: 'auto',
                  marginLeft: 9
                }}>
                <List>
                  {rowsCfgNivelDeAnalise.map(row => (
                    <ListItem key={row.CodNivAna}>
                      <ListItemText primary={row.DesNivAna}></ListItemText>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => clickExcluir(row.CodNivAna)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Card>

          <div className="searchBar">Configuração Especifica</div>
          <Divider className="my-4" />

          <ExpansionPanel
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
            square={true}
            rounded="true">
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id="additional-actions1-header">
              <div className="searchBar">Filtro para pesquisa:</div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                fullWidth
                className="m-2"
                label="Digite o valor a ser pesquisado"
                id="outlined-size-small"
                defaultValue=""
                variant="outlined"
                size="small"
                onChange={e => {
                  setValor(e.target.value);
                }}
              />
              <Button
                className="m-2"
                variant="contained"
                color="primary"
                onClick={() => aplicaFiltro(valor)}>
                Pesquisar
              </Button>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div>&nbsp;</div>
          <TableContainer component={Paper}>
            <div align="right">
              <Button
                to="/ConfiguracaoDeNiveldeAnalise/CadConfiguracaoDeNiveldeAnalise/CodSegmen=0"
                component={Link}
                className="m-2"
                variant="contained"
                color="primary"
                startIcon={<Add />}>
                &nbsp;&nbsp;Novo&nbsp;&nbsp;&nbsp;&nbsp;
              </Button>
            </div>
            <Table
              className={classes.table}
              aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <div className="tableCellHead">Segmento</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableCellHead">Níveis</div>
                  </TableCell>
                  <TableCell align="right">
                    <div className="tableCellHead">
                      Ações&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rowsNivAnaliseSegmen.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rowsNivAnaliseSegmen
                ).map(row => (
                  <TableRow key={row.CodSegmen}>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '60px',
                        minWidth: '300px',
                        minHeight: '40px'
                      }}>
                      {row.DesSegmen}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '100px',
                        maxHeight: '60px',
                        minWidth: '100px',
                        minHeight: '40px'
                      }}>
                      {row.Niveis}
                    </TableCell>
                    <TableCell align="right" size="small">
                      <IconButton
                        aria-label="edit"
                        onClick={() => montaLink(row.CodSegmen)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => clickExcluir2(row.CodSegmen)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: 'All', value: -1 }
                    ]}
                    colSpan={3}
                    count={rowsNivAnaliseSegmen.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Fragment>
  );
}
