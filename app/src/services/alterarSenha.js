import Axios from 'axios';

const buscaUsuario = async (
  CodUsuari = null,
  NomUsuari = null,
  EmaUsuari = null
) => {
  //Popula os dados com todas as informações realcionadas de Usuario
  let query = `SELECT CodUsuari, NomUsuari, EmaUsuari, PwdUsuari, PerfilUsu FROM Usuario`;

  //Retorna apenas os dados do item que será alterado
  if (CodUsuari != null && NomUsuari == null) {
    query = query + ' WHERE ' + CodUsuari;
  }

  //Filtro para a barra de pesquisa com base no nome da Usuario
  if (CodUsuari == null && NomUsuari != null) {
    query = query + ' WHERE ' + NomUsuari + ' COLLATE Latin1_General_CI_AI';
  }

  //Filtro para confirmar se o email ja existe
  if (CodUsuari == null && NomUsuari == null && EmaUsuari != null) {
    query = query + ' WHERE ' + EmaUsuari + ' COLLATE Latin1_General_CI_AI';
  }
  const result = await Axios.get(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA + '/api/get', {
    params: { query }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log('Erro na consulta no banco de dados:', error);
    });

  return result;
};

const alteraSenha = async (
  CodUsuari,  
  PwdUsuari
) => {  
      let query = `UPDATE Usuario SET PwdUsuari = '${PwdUsuari}' WHERE CodUsuari = ${CodUsuari}`;
      Axios.post(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA + '/api/post', {
        query: query
      })
        .then(() => {
          return true;
        })
        .catch(error => {
          console.log('Erro no update no banco de dados:', error);
          return false;
        }); 
};

const buscaUsuarioSenha = async (  
  EmaUsuari,
  PwdUsuari
) => {  
  let query = `SELECT CodUsuari, NomUsuari, EmaUsuari, PwdUsuari, 
  PerfilUsu FROM Usuario  WHERE EmaUsuari = '${EmaUsuari}' AND
  PwdUsuari = '${PwdUsuari}'`
    
  const result = await Axios.get(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA + '/api/get', {
    params: { query }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log('Erro na consulta no banco de dados:', error);
    });

  return result;
};

export { buscaUsuario, alteraSenha, buscaUsuarioSenha };
