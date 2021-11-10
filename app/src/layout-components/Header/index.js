import React, { Fragment } from 'react';
import clsx from 'clsx';
import { Link, useHistory } from 'react-router-dom';

import Cookies from 'universal-cookie';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
  Hidden,  
  AppBar,
  Box,
  Button,  
  MenuItem,
  Popper,
  Grow,
  MenuList,
  Paper
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';

import { connect } from 'react-redux';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import projectLogo from '../../assets/images/logopb.png';

import HeaderLogo from '../../layout-components/HeaderLogo';
import HeaderUserbox from '../../layout-components/HeaderUserbox';

/* import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'; */

import {
  buscaProcessos,
  buscaDiagnosticos,
  incluiVersao,
  buscaAnalises
} from '../../services/analisesSuaEmpresa';

const Header = props => {
  const cookies = new Cookies();
  const history = useHistory();  

  
  const {
    
    headerFixed,
    sidebarToggleMobile,
    setSidebarToggleMobile
  } = props;

  const anchorRefCad = React.useRef(null);
  const anchorRefDia = React.useRef(null);
  const anchorRefAna = React.useRef(null);
  const anchorRefRel = React.useRef(null);
  const [openCad, setOpenCad] = React.useState(false);
  const [openDia, setOpenDia] = React.useState(false);
  const [openAna, setOpenAna] = React.useState(false);
  const [openRel, setOpenRel] = React.useState(false);

  const handleClose = () => {
    setOpenCad(false);
    setOpenDia(false);
    setOpenAna(false);
    setOpenRel(false);
  };

  const handleCloseOne = id => {
    switch (id) {
      case 'cadastro': {
        setOpenCad(false);
        break;
      }
      case 'diagnostico': {
        setOpenDia(false);
        break;
      }
      case 'analise': {
        setOpenAna(false);
        break;
      }
      case 'relatorio': {
        setOpenRel(false);
        break;
      }
      default:
        break;
    }
  };

  const handleToggle = id => {
    switch (id) {
      case 'cadastro': {
        setOpenCad(prevOpen => !prevOpen);
        setOpenDia(false);
        setOpenAna(false);
        setOpenRel(false);
        break;
      }
      case 'diagnostico': {
        setOpenDia(prevOpen => !prevOpen);
        setOpenCad(false);
        setOpenAna(false);
        setOpenRel(false);
        break;
      }
      case 'analise': {
        setOpenAna(prevOpen => !prevOpen);
        setOpenCad(false);
        setOpenDia(false);
        setOpenRel(false);
        break;
      }
      case 'relatorio': {
        setOpenRel(prevOpen => !prevOpen);
        setOpenCad(false);
        setOpenDia(false);
        setOpenAna(false);
        break;
      }
      default:
        break;
    }
  };

  function handleListKeyDown(event, id) {
    if (event.key === 'Tab') {
      event.preventDefault();

      setOpenCad(false);
      setOpenDia(false);
      setOpenAna(false);
      setOpenRel(false);
    }
  }

  const montaLink = () => {
    history.push(`/Login`);
  };

  const populateProcesso = async () => {
    await buscaProcessos(cookies.get('CodigoDaEmpresa')).then(data => {
      cookies.set('Processos', data.registros, {
        path: '/'
      });
    });
  };

  const diagnosticos = async CodEmpres => {
    if (CodEmpres != '' && CodEmpres != null && CodEmpres != undefined) {
      await buscaDiagnosticos(CodEmpres).then(data => {
        if (data.registros[0] == undefined) {
          populateProcesso();
        } else cookies.remove('Processos');
      });
    }
  };

  const adicionaProcesso = (CodEmpres, Processo) => {
    let cancel = false;
    const insere = async () => {
      try {
        Processo.map(row => {
          incluiVersao(CodEmpres, row.CodProces);
        });
      } catch (err) {
        console.log(err);
      }
    };
    insere();
    return () => {
      cancel = true;
    };
  };

  const analise = async CodEmpres => {
    if (CodEmpres != '' && CodEmpres != null && CodEmpres != undefined) {
      await buscaAnalises(CodEmpres).then(data => {
        if (data.registros[0] != undefined) {
          cookies.set('Analises', 'true', {
            path: '/'
          });
        }
      });
    }
  };

  return (
    <Fragment>
      <AppBar
        onLoad={() => {
          if (cookies.get('token') != 'true') {
            cookies.remove('token');
            cookies.remove('CodigoDoUsuario');
            cookies.remove('CodigoDaEmpresa');
            cookies.remove('PerfilDoUsuario');
            cookies.remove('NomeDaEmpresa');
            cookies.remove('NomeGrpEmpresarial');
            cookies.remove('CodigoGrpEmpresarial');
            cookies.remove('Analises');
            cookies.remove('Diagnósticos');
            montaLink();
          }
          diagnosticos(cookies.get('CodigoDaEmpresa'));
          analise(cookies.get('CodigoDaEmpresa'));
        }}
        color="primary"
        className={clsx('app-header', {})}
        position={headerFixed ? 'fixed' : 'absolute'}
        /* elevation={headerShadow ? 11 : 3} */
      >
        {!props.isCollapsedLayout && <HeaderLogo />}
        <Box className="app-header-toolbar">
          <Hidden lgUp>
            <Box className="app-logo-wrapper" title="Lobtec">
              <Link to="/DashboardDefault" className="app-logo-link">
                <img className="app-logo-img" alt="Lobtec" src={projectLogo} />
              </Link>
            </Box>
          </Hidden>

          <Box className="d-flex align-items-center">
            <Button
              ref={anchorRefCad}
              aria-controls={openCad ? 'menu-list-grow-cadastros' : undefined}
              aria-haspopup="true"
              onClick={() => handleToggle('cadastro')}
              size="large"
              className="m-2 text-white"
              endIcon={<KeyboardArrowDown />}>
              Cadastros
            </Button>
            <Popper
              open={openCad}
              anchorEl={anchorRefCad.current}
              role={undefined}
              transition
              disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom'
                  }}>
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() => handleCloseOne('cadastro')}>
                      <MenuList
                        autoFocusItem={openCad}
                        id="menu-list-grow-cadastros"
                        onKeyDown={e => handleListKeyDown(e, 'cadastro')}>
                        <Link to="/GrupoEmpresarial">
                          <MenuItem onClick={handleClose}>
                            Grupo empresarial
                          </MenuItem>
                        </Link>
                        <Link to="/Empresa">
                          <MenuItem onClick={handleClose}>Empresa</MenuItem>
                        </Link>
                        {cookies.get('CodigoDaEmpresa') > 0 ? (
                          <Link to="/ProcEmpresa">
                            <MenuItem
                              onClick={() => {
                                handleClose();
                                if (
                                  cookies.get('Processos') != '' &&
                                  cookies.get('Processos') != null &&
                                  cookies.get('Processos') != undefined
                                ) {
                                  adicionaProcesso(
                                    cookies.get('CodigoDaEmpresa'),
                                    cookies.get('Processos')
                                  );
                                }
                              }}>
                              Processos por empresa
                            </MenuItem>
                          </Link>
                        ) : (
                          ''
                        )}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            {cookies.get('CodigoDaEmpresa') > 0 ? (
              <Button
                ref={anchorRefDia}
                aria-haspopup="true"
                aria-controls={
                  openDia ? 'menu-list-grow-diagnosticos' : undefined
                }
                onClick={() => {
                  handleToggle('diagnostico');
                }}
                size="large"
                className="m-2 text-white"
                endIcon={<KeyboardArrowDown />}>
                Diagnósticos
              </Button>
            ) : (
              ''
            )}
            <Popper
              open={openDia}
              anchorEl={anchorRefDia.current}
              role={undefined}
              transition
              disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom'
                  }}>
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() => handleCloseOne('diagnostico')}>
                      <MenuList
                        autoFocusItem={openDia}
                        id="menu-list-grow-diagnosticos"
                        onKeyDown={e => handleListKeyDown(e, 'diagnostico')}>
                        <Link to="/ProcEmpresa">
                          <MenuItem
                            onClick={() => {
                              handleClose();
                              if (
                                cookies.get('Processos') != '' &&
                                cookies.get('Processos') != null &&
                                cookies.get('Processos') != undefined
                              ) {
                                adicionaProcesso(
                                  cookies.get('CodigoDaEmpresa'),
                                  cookies.get('Processos')
                                );
                              }
                            }}>
                            Diagnósticos
                          </MenuItem>
                        </Link>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            {cookies.get('CodigoDaEmpresa') > 0 &&
            cookies.get('Analises') == 'true' ? (
              <Button
                ref={anchorRefAna}
                aria-haspopup="true"
                aria-controls={openAna ? 'menu-list-grow-analises' : undefined}
                onClick={() => handleToggle('analise')}
                size="large"
                className="m-2 text-white"
                endIcon={<KeyboardArrowDown />}>
                Análises
              </Button>
            ) : (
              ''
            )}

            <Popper
              open={openAna}
              anchorEl={anchorRefAna.current}
              role={undefined}
              transition
              disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom'
                  }}>
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() => handleCloseOne('analise')}>
                      <MenuList
                        autoFocusItem={openAna}
                        id="menu-list-grow-analises"
                        onKeyDown={e => handleListKeyDown(e, 'analise')}>
                        <Link to="/AnalisesSuaEmpresa">
                          <MenuItem onClick={handleClose} href="">
                            Análises
                          </MenuItem>
                        </Link>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            {cookies.get('CodigoDaEmpresa') > 0 &&
            cookies.get('Analises') == 'true' ? (
              <Button
                ref={anchorRefRel}
                aria-controls={
                  openRel ? 'menu-list-grow-relatorios' : undefined
                }
                aria-haspopup="true"
                onClick={() => handleToggle('relatorio')}
                size="large"
                className="m-2 text-white"
                endIcon={<KeyboardArrowDown />}>
                Relatórios
              </Button>
            ) : (
              ''
            )}
            <Popper
              open={openRel}
              anchorEl={anchorRefRel.current}
              role={undefined}
              transition
              disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom'
                  }}>
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() => handleCloseOne('relatorio')}>
                      <MenuList
                        autoFocusItem={openRel}
                        id="menu-list-grow-relatorios"
                        onKeyDown={e => handleListKeyDown(e, 'relatorio')}>
                        <Link to="/RelatoriosRespostasDosQuestionarios">
                          <MenuItem onClick={handleClose} href="">
                            Respostas dos questionários
                          </MenuItem>
                        </Link>
                        <Link to="/RelatoriosIndicadoresAnalise">
                          <MenuItem onClick={handleClose} href="">
                            Indicadores da análise da sua empresa
                          </MenuItem>
                        </Link>
                        <Link to="/RelatoriosIndicadoresComparativo">
                          <MenuItem onClick={handleClose} href="">
                            Indicadores de comparativo com o mercado
                          </MenuItem>
                        </Link>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>

          <Box className="d-flex align-items-center">
            <HeaderUserbox />
            {/* <Box className="toggle-sidebar-btn-mobile">
              <Tooltip title="Toggle Sidebar" placement="right">
                <IconButton
                  color="inherit"
                  onClick={toggleSidebarMobile}
                  size="medium">
                  {sidebarToggleMobile ? (
                    <MenuOpenRoundedIcon />
                  ) : (
                    <MenuRoundedIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box> */}
          </Box>
        </Box>
      </AppBar>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  headerShadow: state.ThemeOptions.headerShadow,
  headerFixed: state.ThemeOptions.headerFixed,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
