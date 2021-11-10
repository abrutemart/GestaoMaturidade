import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageTitle } from '../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
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
  buscaNumeroCidades,
  buscaNumeroEstados,
  excluiPais,
  excluiEstado,
  excluiCidade,
  alteraPais,
  alteraEstado,
  alteraCidade,
  buscaPais,
  buscaEstado2,
  buscaCidade,
  buscaCidadeCompleta,
  buscaCodPais,
  buscaCodEstado,
  buscaCodCidade
} from '../../services/paisEstadoCidade';

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

const rowsPais = [
  { NomPais: 'Brasil' },
  { NomPais: 'Venezuela' },
  { NomPais: 'Guatemala' }
];

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

export default function PaisEstadoCidade() {
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
  const [novoNomePais, setNovoNomePais] = useState('');
  const [novoNomeEstado, setNovoNomeEstado] = useState('');
  const [novoNomeCidade, setNovoNomeCidade] = useState('');
  const [antigoNomePais, setAntigoNomePais] = useState('');
  const [antigoNomeEstado, setAntigoNomeEstado] = useState('');
  const [antigoNomeCidade, setAntigoNomeCidade] = useState('');
  const [editando, setEditando] = useState(false);
  const [rowCode, setRowCode] = useState('');
  const [open, setOpen] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const [openEscolha2, setOpenEscolha2] = useState(false);
  const [openEscolha3, setOpenEscolha3] = useState(false);
  const [selecao, setSelecao] = useState();
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [refresh, setRefresh] = useState(false);

  function createDataCidade(
    CodCidade,
    NomCidade,
    CodEstado,
    NomEstado,
    CodPais,
    NomPais
  ) {
    return { CodCidade, NomCidade, CodEstado, NomEstado, CodPais, NomPais };
  }

  let rowsCidade = [];
  rowsCidade = dados.map(each =>
    createDataCidade(
      each.CodCidade,
      each.NomCidade,
      each.CodEstado,
      each.NomEstado,
      each.CodPais,
      each.NomPais
    )
  );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rowsCidade.length - page * rowsPerPage);

  useEffect(() => {
    setLoading(true);
    setDados([]);
    setRefresh(false);
    let cancel = false;    
    const runEffect = async () => {
      try {
        await buscaCidadeCompleta(filtro).then(data => {
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
      setFiltro(
        "NomCidade LIKE '%" +
          valor +
          "%' COLLATE Latin1_General_CI_AI OR NomEstado LIKE '%" +
          valor +
          "%' COLLATE Latin1_General_CI_AI OR NomPais LIKE '%" +
          valor +
          "%' COLLATE Latin1_General_CI_AI"
      );
    else setFiltro(null);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
    setOpenEscolha2(false);
    setOpenEscolha3(false);
  };

  const clickExcluir = (CodPais, CodEstado, CodCidade) => {
    setSelecao([CodPais, CodEstado, CodCidade]);
    setOpenEscolha(true);
  };

  const excluiRegistroPais = (codigoPais, codigoEstado, codigoCidade) => {
    setLoading(true);
    let cancel = false;

    const exclui = async () => {
      try {
        await excluiCidade(codigoPais, codigoEstado, codigoCidade);
        if (
          (await excluiCidade(codigoPais, codigoEstado, codigoCidade)) === false
        ) {
          setMensagem({
            titulo: 'Atenção',
            conteudo:
              'Existem empresas associadas a esse cidade. Não é possível efetuar a exclusão!',
            acao: '/PaisEstadoCidade'
          });
          setOpen(true);

          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!',
            acao: '/PaisEstadoCidade'
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
          acao: '/PaisEstadoCidade'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
      try {
        await excluiEstado(codigoPais, codigoEstado, codigoCidade);

        if (
          (await excluiEstado(codigoPais, codigoEstado, codigoCidade)) === false
        ) {
          setMensagem({
            titulo: 'Atenção',
            conteudo:
              'Existem empresas associadas a esse cidade. Não é possível efetuar a exclusão!',
            acao: '/PaisEstadoCidade'
          });
          setOpen(true);

          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!',
            acao: '/PaisEstadoCidade'
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
          acao: '/PaisEstadoCidade'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
      try {
        await excluiPais(codigoPais, codigoEstado, codigoCidade);

        if (
          (await excluiPais(codigoPais, codigoEstado, codigoCidade)) === false
        ) {
          setMensagem({
            titulo: 'Atenção',
            conteudo:
              'Existem empresas associadas a esse cidade. Não é possível efetuar a exclusão!',
            acao: '/PaisEstadoCidade'
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
          acao: '/PaisEstadoCidade'
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

  const checkUltimoEstado = (codigoPais, codigoEstado, codigoCidade) => {
    
    setLoading(true);
    let cancel = false;
    let pesquisaUltimoEstado = `CodCidade = ${codigoCidade} AND CodEstado = ${codigoEstado} AND CodPais = ${codigoPais}`;

    const exclui = async () => {
      const confirmaUltimoEstado = await buscaNumeroEstados(
        pesquisaUltimoEstado
      );      

      if (confirmaUltimoEstado.registros[0].Qtd === 1) {
        setOpenEscolha3(true);
        setOpenEscolha2(false);
        setOpenEscolha(false);
        setOpen(false);
        if (cancel) {
          return;
        }
      } else {
        excluiRegistroEstado(selecao[0], selecao[1], selecao[2]);
      }
    };
    exclui();

    return () => {
      cancel = true;
    };
  };

  const alteraCadastro = (NomPais, NomEstado, NomCidade) => {
    setLoading(true);
    let cancel = false;

    const altera = async () => {      
      var buscaCodigoPais = await buscaCodPais(antigoNomePais);
      var wherePais = buscaCodigoPais.registros[0].CodPais;
      if (buscaCodigoPais !== undefined) {
        var buscaCodigoEstado = await buscaCodEstado(
          antigoNomeEstado,
          wherePais
        );
        var whereEstado = buscaCodigoEstado.registros[0].CodEstado;
      }
      if (buscaCodigoEstado !== undefined) {
        var buscaCodigoCidade = await buscaCodCidade(
          antigoNomeCidade,
          wherePais,
          whereEstado
        );
        var whereCidade = buscaCodigoCidade.registros[0].CodCidade;
      }
      if (novoNomePais !== antigoNomePais) {
        try {          
          if (NomPais !== '' && NomPais !== undefined) {
            if (wherePais !== undefined) {
              await alteraPais(NomPais, wherePais);
            }
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!',
              acao: '/PaisEstadoCidade'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          } else {
            setMensagem({
              titulo: 'Atenção',
              conteudo: 'O campo país não pode ficar em branco',
              acao: '/PaisEstadoCidade'
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
            acao: '/PaisEstadoCidade'
          });
        } finally {
          setRefresh(true);
          if (!cancel) setLoading(false);
        }
      }
      if (novoNomeEstado !== antigoNomeEstado) {
        try {
           if (NomEstado !== '' && NomEstado !== undefined) {
            if (whereEstado !== undefined) {
              await alteraEstado(NomEstado, wherePais, whereEstado);
            }
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!',
              acao: '/PaisEstadoCidade'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          } else {
            setMensagem({
              titulo: 'Atenção',
              conteudo: 'O campo estado não pode ficar em branco',
              acao: '/PaisEstadoCidade'
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
            acao: '/PaisEstadoCidade'
          });
        } finally {
          setRefresh(true);
          if (!cancel) setLoading(false);
        }
      }
      if (novoNomeCidade !== antigoNomeCidade) {
        try {
           if (NomCidade !== '' && NomCidade !== undefined) {
            if (whereCidade !== undefined) {
              await alteraCidade(
                NomCidade,
                wherePais,
                whereEstado,
                whereCidade
              );
            }
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!',
              acao: '/PaisEstadoCidade'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          } else {
            setMensagem({
              titulo: 'Atenção',
              conteudo: 'O campo cidade não pode ficar em branco',
              acao: '/PaisEstadoCidade'
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
            acao: '/PaisEstadoCidade'
          });
        } finally {
          setRefresh(true);
          if (!cancel) setLoading(false);
        }
      }
    };
    altera();
    return () => {
      cancel = true;
    };
  };

  const excluiRegistroEstado = (codigoPais, codigoEstado, codigoCidade) => {
    setLoading(true);
    let cancel = false;

    const exclui = async () => {
      try {
        await excluiCidade(codigoPais, codigoEstado, codigoCidade);

        if (
          (await excluiCidade(codigoPais, codigoEstado, codigoCidade)) === false
        ) {
          setMensagem({
            titulo: 'Atenção',
            conteudo:
              'Existem empresas associadas a esse cidade. Não é possível efetuar a exclusão!',
            acao: '/PaisEstadoCidade'
          });
          setOpen(true);

          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!',
            acao: '/PaisEstadoCidade'
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
          acao: '/PaisEstadoCidade'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
      try {
        await excluiEstado(codigoPais, codigoEstado, codigoCidade);

        if (
          (await excluiEstado(codigoPais, codigoEstado, codigoCidade)) === false
        ) {
          setMensagem({
            titulo: 'Atenção',
            conteudo:
              'Existem empresas associadas a esse cidade. Não é possível efetuar a exclusão!',
            acao: '/PaisEstadoCidade'
          });
          setOpen(true);

          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!',
            acao: '/PaisEstadoCidade'
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
          acao: '/PaisEstadoCidade'
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

  const checkUltimaCidade = (codigoPais, codigoEstado, codigoCidade) => {
    
    setLoading(true);
    let cancel = false;
    let pesquisaUltimaCidade = `CodCidade = ${codigoCidade} AND CodEstado = ${codigoEstado} AND CodPais = ${codigoPais}`;

    const exclui = async () => {
      const confirmaUltimaCidade = await buscaNumeroCidades(
        pesquisaUltimaCidade
      );      

      if (confirmaUltimaCidade.registros[0].Qtd === 1) {
        setOpenEscolha2(true);
        setOpenEscolha(false);
        setOpen(false);
        if (cancel) {
          return;
        }
      } else {
        excluiRegistroCidade(selecao[0], selecao[1], selecao[2]);
      }
    };
    exclui();

    return () => {
      cancel = true;
    };
  };

  const excluiRegistroCidade = (codigoPais, codigoEstado, codigoCidade) => {
    setLoading(true);
    let cancel = false;

    const exclui = async () => {
      try {
        await excluiCidade(codigoPais, codigoEstado, codigoCidade);

        if (
          (await excluiCidade(codigoPais, codigoEstado, codigoCidade)) === false
        ) {
          setMensagem({
            titulo: 'Erro',
            conteudo:
              'Existem empresas associadas a esse cidade. Não é possível efetuar a exclusão!',
            acao: '/PaisEstadoCidade'
          });
          setOpen(true);

          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!',
            acao: '/PaisEstadoCidade'
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
          acao: '/PaisEstadoCidade'
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

  const optionsPais = [...new Set(rowsCidade.map(item => item.NomPais))];

  function filterEstadosPorPais(event) {
    return event.NomPais == antigoNomePais;
  }

  const optionsFilteredEstadoPorPais = rowsCidade.filter(filterEstadosPorPais);

  const optionsEstado = [
    ...new Set(optionsFilteredEstadoPorPais.map(item => item.NomEstado))
  ];

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
              checkUltimaCidade(selecao[0], selecao[1], selecao[2]);
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
            Esta Cidade é a única cadastrada neste Estado. Deseja excluir este
            Estado também?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              excluiRegistroCidade(selecao[0], selecao[1], selecao[2]);
            }}
            color="primary">
            Excluir apenas a cidade
          </Button>
          <Button
            onClick={() => {
              checkUltimoEstado(selecao[0], selecao[1], selecao[2]);
            }}
            color="primary">
            Excluir a cidade e o estado
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEscolha3}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Informação</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Este Estado é o único cadastrada neste País. Deseja excluir este
            Páis também?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              excluiRegistroEstado(selecao[0], selecao[1], selecao[2]);
            }}
            color="primary">
            Excluir apenas cidade o estado
          </Button>
          <Button
            onClick={() => {
              excluiRegistroPais(selecao[0], selecao[1], selecao[2]);
            }}
            color="primary">
            Excluir a cidade, o estado e o pais
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
        titleHeading="País / Estado / Cidade"
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
                to="/PaisEstadoCidade/CadPaisEstadoCidade/CodCidade=0"
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
                    <div className="tableCellHead">País</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableCellHead">Estado</div>
                  </TableCell>
                  <TableCell>
                    <div className="tableCellHead">Cidade</div>
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
                  ? rowsCidade.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rowsCidade
                ).map(row => (
                  <TableRow key={row.NomCidade}>
                    {row.NomCidade === rowCode ? (
                      <TableCell>
                        <Autocomplete
                          disablePortal
                          freeSolo
                          id="outlined-size-small"
                          options={optionsPais}
                          getOptionLabel={option => option}
                          value={row.NomPais}
                          renderInput={params => (
                            <TextField
                              className="m-2"
                              fullWidth
                              onBlur={e => {
                                setNovoNomePais(e.target.value);
                              }}
                              {...params}
                              size="small"
                            />
                          )}
                        />
                      </TableCell>
                    ) : (
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
                    )}
                    {row.NomCidade === rowCode ? (
                      <TableCell>
                        <Autocomplete
                          disablePortal
                          freeSolo
                          id="outlined-size-small"
                          options={optionsEstado}
                          getOptionLabel={option => option}
                          value={row.NomEstado}
                          renderInput={params => (
                            <TextField
                              className="m-2"
                              fullWidth
                              onBlur={e => {
                                setNovoNomeEstado(e.target.value);
                              }}
                              {...params}
                              size="small"
                            />
                          )}
                        />
                      </TableCell>
                    ) : (
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
                    )}
                    {row.NomCidade === rowCode ? (
                      <TableCell>
                        <TextField
                          className="m-2"
                          id="outlined-size-small"
                          defaultValue={row.NomCidade}
                          size="small"
                          autoFocus={true}
                          onBlur={e => {
                            setNovoNomeCidade(e.target.value);
                          }}></TextField>
                      </TableCell>
                    ) : (
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
                    )}
                    {row.NomCidade === rowCode ? (
                      <TableCell align="right" size="small">
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            alteraCadastro(
                              novoNomePais,
                              novoNomeEstado,
                              novoNomeCidade
                            );                            
                            setRowCode('');
                            setRefresh(true);
                          }}>
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          aria-label="clear"
                          onClick={() => setRowCode('')}>
                          <ClearIcon />
                        </IconButton>
                      </TableCell>
                    ) : (
                      <TableCell align="right" size="small">
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            setRowCode(row.NomCidade);
                            setNovoNomeCidade(row.NomCidade);
                            setNovoNomeEstado(row.NomEstado);
                            setNovoNomePais(row.NomPais);
                            setAntigoNomeCidade(row.NomCidade);
                            setAntigoNomeEstado(row.NomEstado);
                            setAntigoNomePais(row.NomPais);                            
                          }}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            clickExcluir(
                              row.CodPais,
                              row.CodEstado,
                              row.CodCidade
                            )
                          }>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
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
                    count={rowsCidade.length}
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
