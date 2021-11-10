import React, { Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { HomeWork, Settings, Person } from '@material-ui/icons';

import Cookies from 'universal-cookie';

import {
  Menu,
  List,
  ListItem,
  Divider,
  IconButton,
  Tooltip
} from '@material-ui/core';

export default function HeaderUserbox() {
  const cookies = new Cookies();
  const history = useHistory();
  const [anchorUsu, setAnchorUsu] = React.useState(null);
  const [anchorCfg, setAnchorCfg] = React.useState(null);
  const [perfil, setPerfil] = React.useState('');

  const handleClick = (event, id) => {
    switch (id) {
      case 'usuario': {
        setAnchorUsu(event.currentTarget);
        setAnchorCfg(null);
        break;
      }
      case 'config': {
        setAnchorUsu(null);
        setAnchorCfg(event.currentTarget);

        break;
      }
      default:
        break;
    }
  };

  const montaLink = () => {
    history.push(`/Login`);
  };

  const handleClose = id => {
    switch (id) {
      case 'usuario': {
        setAnchorUsu(null);
        break;
      }
      case 'config': {
        setAnchorCfg(null);
        break;
      }
      default:
        break;
    }
  };

  const handleCloseAll = () => {
    setAnchorUsu(null);
    setAnchorCfg(null);
  };

  const handleCloseAll2 = () => {
    setAnchorUsu(null);
    setAnchorCfg(null);    
    cookies.remove('token');
    cookies.remove('CodigoDoUsuario');
    cookies.remove('CodigoDaEmpresa');
    cookies.remove('PerfilDoUsuario');
    cookies.remove('NomeDaEmpresa');
    cookies.remove('NomeGrpEmpresarial');
    cookies.remove('CodigoGrpEmpresarial'); 
    cookies.remove('Analises');
    cookies.remove('CodigoDoSegmento');
    montaLink();
  };

  return (
    <Fragment>
      <Link to="/SelecaoEmpresa">
        {cookies.get('CodigoDaEmpresa') > 0 ? (
          <Tooltip title={cookies.get('NomeDaEmpresa')}>
            <IconButton aria-label="homework" style={{ color: '#ffffff' }}>
              <HomeWork />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton aria-label="homework" style={{ color: '#8c8c8c' }}>
            <HomeWork />
          </IconButton>
        )}
      </Link>
      <IconButton
        aria-label="person"
        onClick={e => handleClick(e, 'usuario')}
        className="m-2 text-white">
        <Person />
      </IconButton>
      <Menu
        anchorEl={anchorUsu}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorUsu)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        onClose={() => handleClose('usuario')}
        className="ml-2">
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="text-left bg-transparent d-flex align-items-center flex-column pt-0">
            <Link to="/AlterarSenha">
              <ListItem button onClick={handleCloseAll}>
                Alterar senha
              </ListItem>
            </Link>
            <ListItem button onClick={handleCloseAll2}>
              Sair
            </ListItem>
          </List>
        </div>
      </Menu>      

      
      {cookies.get('PerfilDoUsuario') == 'A' ? (
        <IconButton
        aria-label="settings"
        onClick={e => handleClick(e, 'config')}
        className="m-2 text-white">
        <Settings />
      </IconButton>
      ) : (
        ''
      )}

      <Menu
        anchorEl={anchorCfg}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorCfg)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        onClose={() => handleClose('config')}
        className="ml-2">
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="text-left bg-transparent d-flex align-items-left flex-column pt-0">
            <Link to="/Cargos">
              <ListItem button onClick={handleCloseAll}>
                Cargos
              </ListItem>
            </Link>
            <Link to="/PaisEstadoCidade">
              <ListItem button onClick={handleCloseAll}>
                Pais / Estado / Cidade
              </ListItem>
            </Link>
            <Link to="/Segmentos">
              <ListItem button onClick={handleCloseAll}>
                Segmentos
              </ListItem>
            </Link>
            <Link to="/AreasDeAtuacao">
              <ListItem button onClick={handleCloseAll}>
                Áreas de atuação
              </ListItem>
            </Link>
            <Link to="/ClassificacaoDaEmpresa">
              <ListItem button onClick={handleCloseAll}>
                Classificação da empresa
              </ListItem>
            </Link>
            <Link to="/FaturamentoMensal">
              <ListItem button onClick={handleCloseAll}>
                Faturamento mensal
              </ListItem>
            </Link>
            <Link to="/QuantidadeFuncionarios">
              <ListItem button onClick={handleCloseAll}>
                Quantidade de funcionários
              </ListItem>
            </Link>
            <Divider className="w-100" />
            <Link to="/Processos">
              <ListItem button onClick={handleCloseAll}>
                Processos
              </ListItem>
            </Link>
            <Link to="/CategoriaDePerguntas">
              <ListItem button onClick={handleCloseAll}>
                Categorias de perguntas
              </ListItem>
            </Link>
            <Link to="/GrupoDeRespostas">
              <ListItem button onClick={handleCloseAll}>
                Grupo de respostas
              </ListItem>
            </Link>
            <Link to="/PerguntasPorProcesso">
              <ListItem button onClick={handleCloseAll}>
                Perguntas por processo
              </ListItem>
            </Link>
            <Link to="/ProcessosPorSegmentos">
              <ListItem button onClick={handleCloseAll}>
                Processos por segmento
              </ListItem>
            </Link>
            <Divider className="w-100" />
            <Link to="/Usuarios">
              <ListItem button onClick={handleCloseAll}>
                Usuários
              </ListItem>
            </Link>
            <Divider className="w-100" />
            <Link to="/ConfiguracaoDeNiveldeAnalise">
              <ListItem button onClick={handleCloseAll}>
                Configuração de nível de análise
              </ListItem>
            </Link>
          </List>
        </div>
      </Menu>
    </Fragment>
  );
}
