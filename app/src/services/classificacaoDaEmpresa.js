import Axios from 'axios';

const buscaClassificacaoEmpresa = async (
  CodClassi = null,
  DesClassi = null
) => {
  //Popula os dados com todas as informações realcionadas de Classificacao de Empresa
  let query = `SELECT CodClassi, DesClassi FROM Classificacao`;

  //Retorna apenas os dados do item que será alterado
  if (CodClassi != null && DesClassi == null) {
    query = query + ' WHERE ' + CodClassi;
  }

  //Filtro para a barra de pesquisa com base no nome da Classificacao de Empresa e confirmar se classificacao já existe
  if (CodClassi == null && DesClassi != null) {
    query = query + ' WHERE ' + DesClassi + ' COLLATE Latin1_General_CI_AI';
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

const excluiClassificacao = async CodClassi => {
  let codigoClassificacao = `CodClassi = ${CodClassi}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    codigoClassificacao
  );
  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else {
    let query = `DELETE FROM Classificacao WHERE CodClassi = ${CodClassi}`;
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

const buscaReferenciaEmpresa = async (CodClassi = null) => {
  let query = 'SELECT * FROM HistClassi';
  if (CodClassi != null) query = query + ' WHERE ' + CodClassi;
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
  let query = 'SELECT MAX(CodClassi) AS NovoIDClassificacao FROM Classificacao';

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

const incluiClassificacao = async (CodClassi, DesClassi) => {
  try {
    const ultimoIDClassificacao = await buscaProximoID();
    let proxIDClassificacao = 1;
    if (ultimoIDClassificacao.registros[0].NovoIDClassificacao !== 'NULL')
      proxIDClassificacao =
        ultimoIDClassificacao.registros[0].NovoIDClassificacao + 1;
    let descricaoClassificacao = `UPPER(DesClassi) = UPPER('${DesClassi}')`;
    const existeClassificacao = await buscaClassificacaoEmpresa(
      undefined,
      descricaoClassificacao
    );
    if (existeClassificacao.registros[0] === undefined) {
      var query;
      query =
        'INSERT INTO Classificacao (CodClassi, DesClassi) VALUES (' +
        proxIDClassificacao +
        ",'" +
        DesClassi +
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

const alteraClassificacao = async (CodClassi, DesClassi) => {
  let descricaoClassificacao = `UPPER(DesClassi) = UPPER('${DesClassi}')`;
  const existeClassificacao = await buscaClassificacaoEmpresa(
    undefined,
    descricaoClassificacao
  );
  if (existeClassificacao.registros[0] === undefined) {
    let query =
      "UPDATE Classificacao SET DesClassi = '" +
      DesClassi +
      "' WHERE CodClassi = " +
      CodClassi;
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
  buscaClassificacaoEmpresa,
  excluiClassificacao,
  buscaReferenciaEmpresa,
  incluiClassificacao,
  alteraClassificacao
};
