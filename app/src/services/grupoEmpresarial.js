import Axios from 'axios';

const buscaGrupos = async where => {
  let query = 'SELECT * FROM GrupoEmp';
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
  let query = 'SELECT MAX(CodGrpEmp) AS NovoId FROM GrupoEmp';

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

const incluiGrupos = async values => {
  const ultimoId = await buscaProxId();
  let proxId = 1;  
  if (ultimoId.registros[0].NovoId !== 'NULL')
    proxId = ultimoId.registros[0].NovoId + 1;
  let query =
    'INSERT INTO GrupoEmp (CodGrpEmp, NomGrpEmp) VALUES (' +
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
};

const alteraGrupos = (set, where) => {
  let query = 'UPDATE GrupoEmp SET ' + set + ' WHERE ' + where;
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

const excluiGrupos = async where => {
  let pesquisaReferencia = `CodCarCnt = ${where}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    pesquisaReferencia
  );

  if (existeReferenciaEmpresa.excluiCargosregistros[0] !== undefined) {
    return false;
  } else {
    let query = 'DELETE GrupoEmp WHERE CodGrpEmp = ' + where;

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

export { buscaGrupos, incluiGrupos, alteraGrupos, excluiGrupos, buscaProxId };
