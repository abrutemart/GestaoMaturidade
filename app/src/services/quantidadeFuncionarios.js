import Axios from 'axios';

const buscaQuantidadeFuncionarios = async (
  CodQtdFun = null,
  DesQtdFun = null
) => {
  //Popula os dados com todas as informações realcionadas de QtdFuncionario de Empresa
  let query = `SELECT CodQtdFun, DesQtdFun FROM QtdFuncionario`;

  //Retorna apenas os dados do item que será alterado
  if (CodQtdFun != null && DesQtdFun == null) {
    query = query + ' WHERE ' + CodQtdFun;
  }

  //Filtro para a barra de pesquisa com base no nome da QtdFuncionario de Empresa e confirmar se QtdFuncionario já existe
  if (CodQtdFun == null && DesQtdFun != null) {
    query = query + ' WHERE ' + DesQtdFun + ' COLLATE Latin1_General_CI_AI';
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

const excluiQtdFuncionarios = async CodQtdFun => {
  let codigoQtdFuncionario = `CodQtdFun = ${CodQtdFun}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    codigoQtdFuncionario
  );
  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else {
    let query = `DELETE FROM QtdFuncionario WHERE CodQtdFun = ${CodQtdFun}`;
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

const buscaReferenciaEmpresa = async (CodQtdFun = null) => {
  let query = 'SELECT * FROM HistQtdFunc';
  if (CodQtdFun != null) query = query + ' WHERE ' + CodQtdFun;
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
  let query =
    'SELECT MAX(CodQtdFun) AS NovoIDQtdFuncionario FROM QtdFuncionario';

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

const incluiQtdFuncionario = async (CodQtdFun, DesQtdFun) => {
  try {
    const ultimoIDQtdFuncionario = await buscaProximoID();
    let proxIDQtdFuncionario = 1;
    if (ultimoIDQtdFuncionario.registros[0].NovoIDQtdFuncionario !== 'NULL')
      proxIDQtdFuncionario =
        ultimoIDQtdFuncionario.registros[0].NovoIDQtdFuncionario + 1;
    let descricaoQtdFuncionario = `UPPER(DesQtdFun) = UPPER('${DesQtdFun}')`;
    const existeQtdFuncionario = await buscaQuantidadeFuncionarios(
      undefined,
      descricaoQtdFuncionario
    );
    if (existeQtdFuncionario.registros[0] === undefined) {
      var query;
      query =
        'INSERT INTO QtdFuncionario (CodQtdFun, DesQtdFun) VALUES (' +
        proxIDQtdFuncionario +
        ",'" +
        DesQtdFun +
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

const alteraQtdFuncionario = async (CodQtdFun, DesQtdFun) => {
  let descricaoQtdFuncionario = `UPPER(DesQtdFun) = UPPER('${DesQtdFun}')`;
  const existeQtdFuncionario = await buscaQuantidadeFuncionarios(
    undefined,
    descricaoQtdFuncionario
  );
  if (existeQtdFuncionario.registros[0] === undefined) {
    let query =
      "UPDATE QtdFuncionario SET DesQtdFun = '" +
      DesQtdFun +
      "' WHERE CodQtdFun = " +
      CodQtdFun;
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
  buscaQuantidadeFuncionarios,
  excluiQtdFuncionarios,
  buscaReferenciaEmpresa,
  incluiQtdFuncionario,
  alteraQtdFuncionario
};
