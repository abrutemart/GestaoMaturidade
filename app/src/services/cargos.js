import Axios from 'axios';

const buscaCargos = async where => {
  let query = 'SELECT * FROM Cargo';
  if (where != null) query = query + ' WHERE ' + where + ' ORDER BY DesCargo';
  else query = query + ' ORDER BY DesCargo';
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

const buscaReferencia = async where => {
  let query = 'SELECT * FROM ContatoEmp';
  if (where != null) query = query + ' WHERE ' + where;

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

const buscaReferenciaEmpresa = async where => {
  let query = 'SELECT * FROM Empresa';
  if (where != null) query = query + ' WHERE ' + where;

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

const buscaProxId = async () => {
  let query = 'SELECT MAX(CodCargo) AS NovoId FROM Cargo';

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

const incluiCargos = async values => {
  const ultimoId = await buscaProxId();
  let proxId = 1;
  let pesquisaCargo = `UPPER(DesCargo) = UPPER('${values}')`;
  const existeCargo = await buscaCargos(pesquisaCargo);

  if (values !== '' && existeCargo.registros[0] === undefined) {
    if (ultimoId.registros[0].NovoId != 'NULL')
      proxId = ultimoId.registros[0].NovoId + 1;
    var query;
    query =
      'INSERT INTO Cargo (CodCargo, DesCargo) VALUES (' +
      proxId +
      ",'" +
      values +
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
  } else {
    return false;
  }
};

const alteraCargos = (set, where) => {
  let query = 'UPDATE Cargo SET ' + set + ' WHERE ' + where;
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

const excluiCargos = async where => {
  let pesquisaReferencia = `CodCarCnt = ${where}`;
  let pesquisaReferenciaEmpresa = `CodCarRes = ${where}`;
  const existeReferencia = await buscaReferencia(pesquisaReferencia);
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    pesquisaReferenciaEmpresa
  );

  if (
    existeReferencia.registros[0] !== undefined ||
    existeReferenciaEmpresa.registros[0] !== undefined
  ) {
    return false;
  } else {
    let query = 'DELETE Cargo WHERE CodCargo = ' + where;

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

export {
  buscaCargos,
  incluiCargos,
  alteraCargos,
  excluiCargos,
  buscaProxId,
  buscaReferencia
};
