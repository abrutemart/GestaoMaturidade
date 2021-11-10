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
  DialogTitle,
  IconButton
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
  buscaEmpresa,
  excluiEmpresa,
  buscaReferenciaProEmpAux,
  buscaReferenciaProcEmp,
  excluiEmpresaTotal
} from '../../services/empresa';

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

export default function Empresa() {
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
  const [valor, setValor] = useState('');
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

  function createData(
    CodEmpres,
    NomGrpEmp,
    NomEmpres,
    TipEmpres,
    DesSegmen,
    NomAreAtu,
    DesClassi,
    DesFatura,
    Telefone,
    CodCNPJ,
    Matriz,
    DesQtdFun,
    NomRespon,
    EmaRespon,
    TelRespon,
    NomContat,
    EmaContat,
    TelContat,
    DesCargo,
    NomPais,
    NomEstado,
    NomCidade,
    AnoFundac
  ) {
    return {
      CodEmpres,
      NomGrpEmp,
      NomEmpres,
      TipEmpres,
      DesSegmen,
      NomAreAtu,
      DesClassi,
      DesFatura,
      Telefone,
      CodCNPJ,
      Matriz,
      DesQtdFun,
      NomRespon,
      EmaRespon,
      TelRespon,
      NomContat,
      EmaContat,
      TelContat,
      DesCargo,
      NomPais,
      NomEstado,
      NomCidade,
      AnoFundac
    };
  }

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

  let rows = [];
  rows = dados.map(each =>
    createData(
      each.CodEmpres,
      each.NomGrpEmp,
      each.NomEmpres,
      each.TipEmpres,
      each.DesSegmen,
      each.NomAreAtu,
      each.DesClassi,
      each.DesFatura,
      formatPhoneNumber(each.Telefone),
      formatCNPJ(each.CodCNPJ),
      each.Matriz,
      each.DesQtdFun,
      each.NomRespon,
      each.EmaRespon,
      formatPhoneNumber(each.TelRespon),
      each.NomContat,
      each.EmaContat,
      formatPhoneNumber(each.TelContat),
      each.DesCargo,
      each.NomPais,
      each.NomEstado,
      each.NomCidade,
      each.AnoFundac
    )
  );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    setLoading(true);
    setDados([]);
    setRefresh(false);
    let cancel = false;
    const runEffect = async () => {
      try {
        await buscaEmpresa(filtro).then(data => {
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

  const aplicaFiltro = valor => {
    if (valor.length >= 1)
      setFiltro(`(GrupoEmp.NomGrpEmp LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Empresa.NomEmpres LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Segmento.DesSegmen LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      AreaAtuacao.NomAreAtu LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Classificacao.DesClassi LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Faturamento.DesFatura LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      QtdFuncionario.DesQtdFun LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Empresa.NomRespon LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Empresa.EmaRespon LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR      
      Cargo.DesCargo LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Pais.NomPais LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Estado.NomEstado LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Cidade.NomCidade LIKE '%${valor}%' COLLATE Latin1_General_CI_AI OR
      Empresa.AnoFundac LIKE '%${valor}%')`);
    else setFiltro(null);
  };

  const montaLink = codigo => {
    history.push(`/Empresa/CadEmpresa/CodEmpres=${codigo}`);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
  };

  const clickExcluir = item => {
    setSelecao(item);
    setOpenEscolha(true);
  };

  const checkRegistro = codigoEmpresa => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      let pesquisaReferencia = `CodEmpres = ${codigoEmpresa}`;
      const existeReferenciaProEmpAux = await buscaReferenciaProEmpAux(
        pesquisaReferencia
      );
      const existeReferenciaProcEmp = await buscaReferenciaProcEmp(
        pesquisaReferencia
      );

      if (
        existeReferenciaProEmpAux.registros[0] !== undefined ||
        existeReferenciaProcEmp.registros[0] !== undefined
      ) {
        setOpenEscolha2(true);
        setOpenEscolha(false);
        setOpen(false);
        if (cancel) {
          return;
        }
      } else {
        excluiRegistro(codigoEmpresa);
      }
    };
    exclui();

    return () => {
      cancel = true;
    };
  };

  const excluiRegistro = codigo => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        const exclui = await excluiEmpresa(codigo);
        if (exclui != false) {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!',
            acao: '/Empresa'
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
          acao: '/Empresa'
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

  const excluiRegistroTotal = codigo => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        await excluiEmpresaTotal(codigo);
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/Empresa'
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
          <Button onClick={() => checkRegistro(selecao)} color="primary">
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
            Já foi iniciado o diagnóstico dessa empresa. Se excluir a empresa,
            todos os dados de diagnóstico e análise serão excluídos. Confirma?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              excluiRegistroTotal(selecao);
            }}
            color="primary">
            Confirmar
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
      <PageTitle titleHeading="Empresa" titleDescription="Consulta" />
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
              <div class="searchBar">Filtro para pesquisa:</div>
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
          <div align="right">
            <Button
              to="/Empresa/CadEmpresa/CodEmpres=0"
              component={Link}
              className="m-2"
              variant="contained"
              color="primary"
              startIcon={<Add />}>
              &nbsp;&nbsp;Novo&nbsp;&nbsp;&nbsp;&nbsp;
            </Button>
          </div>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <div class="tableCellHead">Nome Grupo Empresarial</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Nome Empresa</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Tipo Empresa</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Segmento</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Área Atuação</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Classificação</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Faturamento</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Telefone</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">CNPJ</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Matriz</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Quantidade Funcionários</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Nome Responsável</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Email Responsável</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Telefone Responsável </div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Cargo Contato</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Pais</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Estado</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Cidade</div>
                  </TableCell>
                  <TableCell>
                    <div class="tableCellHead">Ano Fundação</div>
                  </TableCell>
                  <TableCell align="center">
                    <div class="tableCellHead">Ações</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map(row => (
                  <TableRow key={row.CodEmpres}>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '280px',
                        maxHeight: '60px',
                        minWidth: '160px',
                        minHeight: '40px'
                      }}>
                      {row.NomGrpEmp}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '280px',
                        maxHeight: '60px',
                        minWidth: '160px',
                        minHeight: '40px'
                      }}>
                      {row.NomEmpres}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '110px',
                        maxHeight: '60px',
                        minWidth: '110px',
                        minHeight: '40px'
                      }}>
                      {row.TipEmpres}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '60px',
                        minWidth: '200px',
                        minHeight: '40px'
                      }}>
                      {row.DesSegmen}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '60px',
                        minWidth: '200px',
                        minHeight: '40px'
                      }}>
                      {row.NomAreAtu}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '150px',
                        maxHeight: '60px',
                        minWidth: '150px',
                        minHeight: '40px'
                      }}>
                      {row.DesClassi}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '60px',
                        minWidth: '200px',
                        minHeight: '40px'
                      }}>
                      {row.DesFatura}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '180px',
                        maxHeight: '60px',
                        minWidth: '160px',
                        minHeight: '40px'
                      }}>
                      {row.Telefone}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '190px',
                        maxHeight: '60px',
                        minWidth: '190px',
                        minHeight: '40px'
                      }}>
                      {row.CodCNPJ}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '100px',
                        maxHeight: '60px',
                        minWidth: '90px',
                        minHeight: '40px'
                      }}>
                      {(row.Matriz = 1 ? 'Sim' : 'Não')}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '110px',
                        maxHeight: '60px',
                        minWidth: '110px',
                        minHeight: '40px'
                      }}>
                      {row.DesQtdFun}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '240px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}>
                      {row.NomRespon}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '280px',
                        maxHeight: '60px',
                        minWidth: '130px',
                        minHeight: '40px'
                      }}>
                      {row.EmaRespon}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}>
                      {row.TelRespon}
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
                      {row.DesCargo}
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
                      {row.NomPais}
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
                      {row.NomEstado}
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
                      {row.NomCidade}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      size="small"
                      style={{
                        maxWidth: '110px',
                        maxHeight: '60px',
                        minWidth: '110px',
                        minHeight: '40px'
                      }}>
                      {row.AnoFundac}
                    </TableCell>
                    <TableCell
                      align="right"
                      size="small"
                      style={{ minWidth: 130 }}>
                      <IconButton
                        aria-label="edit"
                        onClick={() => montaLink(row.CodEmpres)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => clickExcluir(row.CodEmpres)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={23} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={rows.length}
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
        </Grid>
      </Grid>
    </Fragment>
  );
}
