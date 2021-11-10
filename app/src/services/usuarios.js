import Axios from 'axios';

const buscaUsuario = async (
  CodUsuari = null,
  NomUsuari = null,
  EmaUsuari = null
) => {
  //Popula os dados com todas as informações realcionadas de Usuario
  let query = `SELECT CodUsuari, NomUsuari, EmaUsuari, PwdUsuari, PerfilUsu, DataBloqu FROM Usuario`;

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
  const result = await Axios.get(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA+ '/api/get', {
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

const excluiUsuario = async CodUsuari => {
  let query = `DELETE FROM Usuario WHERE CodUsuari = ${CodUsuari}`;
  Axios.post(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA + '/api/post', {
    query: query
  })
    .then(() => {
      return true;
    })
    .catch(error => {
      console.log('Erro no delete no banco de dados:', error);
      return false;
    });
};

const buscaProximoID = async () => {
  let query = 'SELECT MAX(CodUsuari) AS NovoIDUsuario FROM Usuario';

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

const incluiUsuario = async (NomUsuari, EmaUsuari, PwdUsuari, PerfilUsu) => {
  try {
    const ultimoIDUsuario = await buscaProximoID();
    let proxIDUsuario = 1;
    proxIDUsuario = ultimoIDUsuario.registros[0].NovoIDUsuario + 1;
    let descricaoUsuario = `UPPER(EmaUsuari) = UPPER('${EmaUsuari}')`;
    const existeUsuario = await buscaUsuario(
      undefined,
      undefined,
      descricaoUsuario
    );
    if (existeUsuario.registros[0] === undefined) {
      var query;
      query = `INSERT INTO Usuario (CodUsuari, NomUsuari, EmaUsuari, PwdUsuari, PerfilUsu)
         VALUES (${proxIDUsuario}, '${NomUsuari}', '${EmaUsuari}', '${PwdUsuari}',
          '${PerfilUsu}')`;
      Axios.post(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA + '/api/post', {
        query: query
      })
        .then(() => {
          return true;
        })
        .catch(error => {
          console.log('Erro no insert no banco de dados:', error);
          return false;
        });
      return true;
    } else return false;
  } catch (error) {
    console.log('Erro no insert no banco de dados:', error);
    return false;
  }
};

const alteraUsuario = async (
  CodUsuari,
  NomUsuari,
  EmaUsuari = null,
  PwdUsuari,
  PerfilUsu,
  DataBloqu = null
) => {
  let descricaoUsuario = `UPPER(EmaUsuari) = UPPER('${EmaUsuari}')`;
  const existeUsuario = await buscaUsuario(
    undefined,
    undefined,
    descricaoUsuario
  );  
  if (EmaUsuari != null) {
    if (existeUsuario.registros[0] === undefined) {
      let query = `UPDATE Usuario SET NomUsuari = '${NomUsuari}', EmaUsuari = '${EmaUsuari}', PwdUsuari = '${PwdUsuari}',
       PerfilUsu = '${PerfilUsu}', DataBloqu = '${DataBloqu}' WHERE CodUsuari = ${CodUsuari}`;
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
    } else return false;
  } else {
    let query = `UPDATE Usuario SET NomUsuari = '${NomUsuari}', PwdUsuari = '${PwdUsuari}',
       PerfilUsu = '${PerfilUsu}', DataBloqu = '${DataBloqu}' WHERE CodUsuari = ${CodUsuari}`;
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
  }
};

const alteraUsuarioSemSenha = async (
  CodUsuari,
  NomUsuari,
  EmaUsuari = null,  
  PerfilUsu,
  DataBloqu = null
) => {
  let descricaoUsuario = `UPPER(EmaUsuari) = UPPER('${EmaUsuari}')`;
  const existeUsuario = await buscaUsuario(
    undefined,
    undefined,
    descricaoUsuario
  );  
  if (EmaUsuari != null) {
    if (existeUsuario.registros[0] === undefined) {
      let query = `UPDATE Usuario SET NomUsuari = '${NomUsuari}', EmaUsuari = '${EmaUsuari}',
       PerfilUsu = '${PerfilUsu}', DataBloqu = '${DataBloqu}' WHERE CodUsuari = ${CodUsuari}`;
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
    } else return false;
  } else {
    let query = `UPDATE Usuario SET NomUsuari = '${NomUsuari}',
       PerfilUsu = '${PerfilUsu}', DataBloqu = '${DataBloqu}' WHERE CodUsuari = ${CodUsuari}`;
    Axios.post(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA+ '/api/post', {
      query: query
    })
      .then(() => {
        return true;
      })
      .catch(error => {
        console.log('Erro no update no banco de dados:', error);
        return false;
      });
  }
};

const buscaUsuarioSenha = async (EmaUsuari, PwdUsuari) => {
  let query = `SELECT CodUsuari, NomUsuari, EmaUsuari, PwdUsuari, 
  PerfilUsu, DataBloqu, GETDATE() AS DataAtual FROM Usuario  WHERE EmaUsuari = '${EmaUsuari}' AND
  PwdUsuari = '${PwdUsuari}'`;
  console.log(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA+ '/api/get')
  const result = await Axios.get(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA+ '/api/get', {
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

export {
  buscaUsuario,
  excluiUsuario,
  incluiUsuario,
  alteraUsuario,
  buscaUsuarioSenha,
  alteraUsuarioSemSenha
};
