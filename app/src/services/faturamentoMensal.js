import Axios from 'axios';

const buscaFaturamentoMensal = async (CodFatura = null, DesFatura = null) => {
  //Popula os dados com todas as informações realcionadas de Faturamento de Empresa
  let query = `SELECT CodFatura, DesFatura FROM Faturamento`;

  //Retorna apenas os dados do item que será alterado
  if (CodFatura != null && DesFatura == null) {
    query = query + ' WHERE ' + CodFatura;
  }

  //Filtro para a barra de pesquisa com base no nome da Faturamento de Empresa e confirmar se Faturamento já existe
  if (CodFatura == null && DesFatura != null) {
    query = query + ' WHERE ' + DesFatura + ' COLLATE Latin1_General_CI_AI';
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

const excluiFaturamento = async CodFatura => {
  let codigoFaturamento = `CodFatura = ${CodFatura}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    codigoFaturamento
  );
  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else {
    let query = `DELETE FROM Faturamento WHERE CodFatura = ${CodFatura}`;
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

const buscaReferenciaEmpresa = async (CodFatura = null) => {
  let query = 'SELECT * FROM HistFatura';
  if (CodFatura != null) query = query + ' WHERE ' + CodFatura;
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
  let query = 'SELECT MAX(CodFatura) AS NovoIDFaturamento FROM Faturamento';

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

const incluiFaturamento = async (CodFatura, DesFatura) => {
  try {
    const ultimoIDFaturamento = await buscaProximoID();
    let proxIDFaturamento = 1;
    if (ultimoIDFaturamento.registros[0].NovoIDFaturamento !== 'NULL')
      proxIDFaturamento =
        ultimoIDFaturamento.registros[0].NovoIDFaturamento + 1;
    let descricaoFaturamento = `UPPER(DesFatura) = UPPER('${DesFatura}')`;
    const existeFaturamento = await buscaFaturamentoMensal(
      undefined,
      descricaoFaturamento
    );
    if (existeFaturamento.registros[0] === undefined) {
      var query;
      query =
        'INSERT INTO Faturamento (CodFatura, DesFatura) VALUES (' +
        proxIDFaturamento +
        ",'" +
        DesFatura +
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

const alteraFaturamento = async (CodFatura, DesFatura) => {
  let descricaoFaturamento = `UPPER(DesFatura) = UPPER('${DesFatura}')`;
  const existeFaturamento = await buscaFaturamentoMensal(
    undefined,
    descricaoFaturamento
  );
  if (existeFaturamento.registros[0] === undefined) {
    let query =
      "UPDATE Faturamento SET DesFatura = '" +
      DesFatura +
      "' WHERE CodFatura = " +
      CodFatura;
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
  buscaFaturamentoMensal,
  excluiFaturamento,
  buscaReferenciaEmpresa,
  incluiFaturamento,
  alteraFaturamento
};
