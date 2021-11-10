import Axios from 'axios';

const buscaCategoria = async (CodCatego = null, DesCatego = null) => {
  let query = `SELECT CodCatego, DesCatego FROM Categoria`;

  //Retorna apenas os dados do item que será alterado
  if (CodCatego != null && DesCatego == null) {
    query = query + ' WHERE ' + CodCatego;
  }

  //Filtro para a barra de pesquisa com base no nome da Categoria de Pergunta e confirmar se Categoria já existe
  else if (CodCatego == null && DesCatego != null) {
    query =
      query +
      ' WHERE ' +
      DesCatego +
      ' ORDER BY DesCatego COLLATE Latin1_General_CI_AI';
  }

  //Popula os dados com todas as informações realcionadas de Categoria de Pergunta ordenado por DesCatego
  else {
    query = query + ' ORDER BY DesCatego';
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

const excluiCategoria = async CodCatego => {
  let codigoCategoria = `CodCatego = ${CodCatego}`;
  const existeReferenciaPergunta = await buscaReferenciaPergunta(
    codigoCategoria
  );
  if (existeReferenciaPergunta.registros[0] !== undefined) {
    return false;
  } else {
    let query = `DELETE FROM Categoria WHERE CodCatego = ${CodCatego}`;
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
  }
};

const buscaReferenciaPergunta = async (CodCatego = null) => {
  let query = 'SELECT * FROM HistPergunta';
  if (CodCatego != null) query = query + ' WHERE ' + CodCatego;
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

const buscaProximoID = async () => {
  let query = 'SELECT MAX(CodCatego) AS NovoIDCategoria FROM Categoria';

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

const incluiCategoria = async (CodCatego, DesCatego) => {
  try {
    const ultimoIDCategoria = await buscaProximoID();
    let proxIDCategoria = 1;
    if (ultimoIDCategoria.registros[0].NovoIDCategoria !== 'NULL')
      proxIDCategoria = ultimoIDCategoria.registros[0].NovoIDCategoria + 1;
    let descricaoCategoria = `UPPER(DesCatego) = UPPER('${DesCatego}')`;
    const existeCategoria = await buscaCategoria(undefined, descricaoCategoria);
    if (existeCategoria.registros[0] === undefined) {
      var query;
      query =
        'INSERT INTO Categoria (CodCatego, DesCatego) VALUES (' +
        proxIDCategoria +
        ",'" +
        DesCatego +
        "')";
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

const alteraCategoria = async (CodCatego, DesCatego) => {
  let descricaoCategoria = `UPPER(DesCatego) = UPPER('${DesCatego}')`;
  const existeCategoria = await buscaCategoria(undefined, descricaoCategoria);
  if (existeCategoria.registros[0] === undefined) {
    let query =
      "UPDATE Categoria SET DesCatego = '" +
      DesCatego +
      "' WHERE CodCatego = " +
      CodCatego;
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
};

export {
  buscaCategoria,
  excluiCategoria,
  buscaReferenciaPergunta,
  incluiCategoria,
  alteraCategoria
};
