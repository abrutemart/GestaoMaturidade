import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageTitle } from '../../layout-components';

import {
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
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

/* Funções necessárias para CRUD*/
import {
  buscaProcessos,
  excluiProcessos,
  buscaProcessoSegmento,
  excluiSegmentoProcesso
} from '../../services/processosPorSegmentos';

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

export default function Processos() {
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
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const { processoSegmento, setProcessoSegmento } = useState([]);
  const [valor, setValor] = useState('');
  const [open, setOpen] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const [selecao, setSelecao] = useState();
  const [selecao2, setSelecao2] = useState();
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [refresh, setRefresh] = useState(false); 

  function createDataProcessoSegmento(
    CodSegmen,
    CodProces,
    DesSegmen,
    DesProces,
    Hora
  ) {
    return { CodSegmen, CodProces, DesSegmen, DesProces, Hora };
  }

  let rowsProcessoSegmento = [];
  rowsProcessoSegmento = dados.map(each =>
    createDataProcessoSegmento(
      each.CodSegmen,
      each.CodProces,
      each.DesSegmen,
      each.DesProces,
      each.Hora
    )
  );

  const aplicaFiltro = valor => {
    if (valor.length >= 1)
      setFiltro(
        `Segmento.DesSegmen LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR Processo.DesProces LIKE '%${valor}%' COLLATE Latin1_General_CI_AI`
      );
    else setFiltro(null);
  };

  const montaLink = (codigo1, codigo2) => {
    history.push(
      `/ProcessosPorSegmentos/CadProcessosPorSegmentos/CodSegmen=${codigo1}_AND_CodProces=${codigo2}`
    );
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rowsProcessoSegmento.length - page * rowsPerPage);

  useEffect(() => {
    setLoading(true);
    setDados([]);
    setRefresh(false);
    let cancel = false;
    const runEffect = async () => {
      try {
        await buscaProcessoSegmento(filtro).then(data => {
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
  }, [filtro, refresh]);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
  };

  const clickExcluir = (CodSegmen, CodProces) => {
    setSelecao(CodSegmen);
    setSelecao2( CodProces);
    setOpenEscolha(true);
  };

  const excluiRegistroProcessoSegmento = (CodSegmen, CodProces) => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {        
        if ((await excluiSegmentoProcesso(CodSegmen, CodProces)) === false) {
          setMensagem({
            titulo: 'Erro',
            conteudo:
              'Existem segmentos associados a esse processo. Não é possível efetuar a exclusão!',
            acao: '/ProcessosPorSegmentos'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!',
            acao: '/ProcessosPorSegmentos'
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
          acao: '/ProcessosPorSegmentos'
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

  return (
    <Fragment>
      {/* Mensagem confirmação exclusão */}
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
              excluiRegistroProcessoSegmento(selecao, selecao2);
            }}
            color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      {/* Mensagem encerramento das ações */}
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
        titleHeading="Processos por Segmentos"
        titleDescription="Consulta"
      />
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
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
                to="/ProcessosPorSegmentos/CadProcessosPorSegmentos/CodSegmen=0_AND_CodProces=0"
                component={Link}
                className="m-2"
                variant="contained"
                color="primary"
                startIcon={<Add />}>
                &nbsp;&nbsp;Novo&nbsp;&nbsp;&nbsp;&nbsp;
              </Button>
            </div>
            {/* Tabela com todos os dados de consulta*/}
            <Table
              className={classes.table}
              aria-label="custom pagination table">
                {/* Cabeçalho da Tabela*/}
              <TableHead>
                <TableRow>
                  <TableCell>
                    <div className="tableCellHead">Processo</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableCellHead">Segmento</div>
                  </TableCell>
                  <TableCell align="right">
                    <div className="tableCellHead">
                      Ações&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              {/* Corpo da tabela*/}
              <TableBody>
                {(rowsPerPage > 0
                  ? rowsProcessoSegmento.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rowsProcessoSegmento
                ).map(row => (
                  <TableRow key={row.CodSegmen +''+ row.CodProces}>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '180px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}>
                      {row.DesProces}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '180px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}>
                      {row.DesSegmen}
                    </TableCell>
                    <TableCell align="right" size="small">
                      {/* Botão para editar valores da respectiva linha*/}
                      <IconButton
                        aria-label="edit"
                        onClick={() => montaLink(row.CodSegmen, row.CodProces)}>
                        <Edit />
                      </IconButton>
                      {/* Botão para excluir valores da respectiva linha*/}
                      <IconButton
                        aria-label="delete"
                        onClick={() => clickExcluir(row.CodSegmen, row.CodProces)}>
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
                    count={rowsProcessoSegmento.length}
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
