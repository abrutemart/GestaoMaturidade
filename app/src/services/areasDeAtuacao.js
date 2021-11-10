import Axios from 'axios';

const buscaAreaDeAtuacao = async (
  CodSegmen = null,
  CodAreAtu = null,
  NomAreAtu = null
) => {
  //Popula os dados com todas as informações realcionadas de Area de Atuacao e Segmento
  let query = `SELECT S.CodSegmen, S.DesSegmen, A.CodAreAtu, A.NomAreAtu 
    FROM AreaAtuacao A JOIN Segmento S ON S.CodSegmen = A.CodSegmen`;

  //Retorna apenas os dados do item que será alterado
  if (NomAreAtu == null && CodSegmen == null && CodAreAtu != null) {
    query = query + ' WHERE A.' + CodAreAtu;
  } else if (NomAreAtu != null && CodSegmen == null && CodAreAtu == null) {

  /* Filtro para a barra de pesquisa com base no nome da area de atuação organizado
   por ordem alfabetica */
    query =
      query +
      ' WHERE ' +
      NomAreAtu +
      ' ORDER BY S.DesSegmen, A.NomAreAtu COLLATE Latin1_General_CI_AI';
  }

  //confirma se já não há cadastro deste item no sistema
  else if (NomAreAtu != null && CodSegmen != null && CodAreAtu == null) {
    query = query + ' WHERE ' + NomAreAtu + ' AND S.CodSegmen = ' + CodSegmen;
  } else {

  /* Popula os dados com todas as informações realcionadas de Area de Atuacao
   e Segmento organizado por ordem alfabetica */
    query = query + ' ORDER BY S.DesSegmen, A.NomAreAtu ';
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

const excluiAreaAtuacao = async (CodSegmen, CodAreAtu) => {
  let codigoSegmento = `CodSegmen = ${CodSegmen}`;
  let codigoAreaAtuacao = `CodAreAtu = ${CodAreAtu}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    codigoSegmento,
    codigoAreaAtuacao
  );
  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else {
    let query = `DELETE FROM AreaAtuacao WHERE CodAreAtu = ${CodAreAtu} AND CodSegmen = ${CodSegmen}`;
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

const buscaReferenciaEmpresa = async (CodSegmen = null, CodAreAtu = null) => {
  let query = 'SELECT * FROM HistSegAreAtu';
  if (CodAreAtu != null && CodSegmen != null)
    query = query + ' WHERE ' + CodSegmen + ' AND ' + CodAreAtu;
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
  let query = 'SELECT MAX(CodAreAtu) AS NovoIDAreaAtuacao FROM AreaAtuacao';

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

const incluiAreaAtuacao = async (CodSegmen, CodAreAtu, NomAreAtu) => {
  try {
    const ultimoIDAreaAtuacao = await buscaProximoID();
    let proxIdAreaAtuacao = 1;
    if (ultimoIDAreaAtuacao.registros[0].NovoIDAreaAtuacao !== 'NULL')
      proxIdAreaAtuacao =
        ultimoIDAreaAtuacao.registros[0].NovoIDAreaAtuacao + 1;
    let descricaoAreaAtuacao = `UPPER(NomAreAtu) = UPPER('${NomAreAtu}')`;
    if (CodSegmen !== null && CodSegmen !== '' && CodSegmen !== undefined) {
      const existeAreaAtuacao = await buscaAreaDeAtuacao(
        CodSegmen,
        undefined,
        descricaoAreaAtuacao
      );
      if (existeAreaAtuacao.registros[0] === undefined) {
        var query;
        query =
          'INSERT INTO AreaAtuacao (CodSegmen, CodAreAtu, NomAreAtu) VALUES (' +
          CodSegmen +
          ',' +
          proxIdAreaAtuacao +
          ",'" +
          NomAreAtu +
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
    } else return false;
  } catch (error) {
    console.log('Erro no insert no banco de dados:', error);
    return false;
  }
};

const alteraAreaAtuacao = async (CodSegmen, CodAreAtu, NomAreAtu) => {
  let descricaoAreaAtuacao = `UPPER(NomAreAtu) = UPPER('${NomAreAtu}')`;
  const existeAreaAtuacao = await buscaAreaDeAtuacao(
    CodSegmen,
    undefined,
    descricaoAreaAtuacao
  );
  if (existeAreaAtuacao.registros[0] === undefined) {
    let query =
      "UPDATE AreaAtuacao SET NomAreAtu = '" +
      NomAreAtu +
      "' WHERE CodSegmen = " +
      CodSegmen +
      ' AND CodAreAtu = ' +
      CodAreAtu;
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

const buscaSegmentos = async (desSegmento = null, codSegmento = null) => {
  let query = 'SELECT CodSegmen, DesSegmen FROM Segmento';
  if (desSegmento != null && codSegmento == null) {
    query =
      query +
      ' WHERE ' +
      desSegmento +
      ' ORDER BY S.DesSegmen COLLATE Latin1_General_CI_AI';
  } else if (desSegmento == null && codSegmento != null) {
    query = query + ' WHERE ' + codSegmento + ' ORDER BY S.DesSegmen';
  } else {
    query = query + ' ORDER BY DesSegmen';
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

export {
  buscaAreaDeAtuacao,
  buscaSegmentos,
  excluiAreaAtuacao,
  buscaReferenciaEmpresa,
  incluiAreaAtuacao,
  alteraAreaAtuacao
};
