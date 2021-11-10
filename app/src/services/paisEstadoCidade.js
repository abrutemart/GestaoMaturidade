import Axios from 'axios';

const buscaCodCidade = async (where1, where2, where3) => {
  let query =
    "SELECT CodCidade AS CodCidade FROM Cidade WHERE NomCidade = '" +
    where1 +
    "' AND CodPais = " +
    where2 +
    ' AND CodEstado = ' +
    where3;
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

const buscaCodEstado = async (where1, where2) => {
  let query =
    "SELECT CodEstado AS CodEstado FROM Estado WHERE NomEstado = '" +
    where1 +
    "' AND CodPais = " +
    where2;
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

const buscaCodPais = async where => {
  let query =
    "SELECT CodPais AS CodPais FROM Pais WHERE NomPais = '" + where + "'";
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

const buscaNumeroCidades = async where => {
  let query =
    'SELECT COUNT(*) as Qtd FROM Estado E JOIN Cidade C  ON C.codEstado = E.codEstado WHERE E.codEstado = (SELECT codEstado FROM Cidade ';
  if (where != null) query = query + 'WHERE ' + where + ')';

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

const buscaNumeroEstados = async where => {
  let query =
    'SELECT COUNT(*) as Qtd FROM Estado E JOIN Cidade C ON C.codEstado = E.codEstado JOIN Pais P ON P.CodPais = E.CodPais WHERE E.codPais = (SELECT codPais FROM Cidade ';
  if (where != null) query = query + ' WHERE ' + where + ')';

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

const buscaPais = async where => {
  let query = 'SELECT * FROM Pais ORDER BY NomPais';
  if (where != null)
    query =
      'SELECT * FROM Pais' +
      ' WHERE UPPER(NomPais) = ' +
      where +
      ' COLLATE Latin1_General_CI_AI';

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

const buscaEstado = async where => {
  let query = 'SELECT CodEstado, NomEstado FROM Estado ORDER BY NomEstado';
  if (where != null) {
    query =
      'SELECT E.CodEstado, E.NomEstado FROM Estado E JOIN Pais P ON P.CodPais = E.CodPais WHERE UPPER(NomPais) = ' +
      where +
      'ORDER BY NomEstado';

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
  }
};

const buscaEstado2 = async (NomEstado, NomPais) => {
  let query = 'SELECT CodEstado, NomEstado FROM Estado ORDER BY NomEstado';
  if (NomEstado != null) {
    query =
      'SELECT E.NomEstado AS NomEstado FROM Estado E JOIN Pais P ON P.CodPais = E.CodPais WHERE UPPER(E.NomEstado) = ' +
      "UPPER('" +
      NomEstado +
      "')" +
      ' AND UPPER(P.NomPais) = ' +
      "UPPER('" +
      NomPais +
      "')";

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
  }
};

const buscaCidade2 = async where => {
  let query = 'SELECT CodCidade, NomCidade FROM Cidade ORDER BY NomCidade';
  if (where != null) {
    query =
      "SELECT C.CodCidade, C.NomCidade FROM Cidade C JOIN Estado E ON C.CodEstado = E.CodEstado WHERE NomEstado = '" +
      where +
      "'";

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
  }
};

const buscaCidade = async (NomCidade, NomEstado, NomPais) => {
  let query =
    'SELECT C.CodCidade CodCidade, P.NomPais NomPais, E.NomEstado NomEstado, C.NomCidade FROM Pais P JOIN Estado E ON E.CodPais = P.CodPais JOIN Cidade C ON C.CodEstado = E.CodEstado';
  if (NomCidade != null)
    query =
      'SELECT C.NomCidade AS NomCidade FROM Cidade C JOIN Estado E ON E.CodPais = C.CodPais JOIN Pais P ON P.CodPais = E.CodPais WHERE UPPER(C.NomCidade) = ' +
      "UPPER('" +
      NomCidade +
      "')" +
      ' AND UPPER(E.NomEstado) = ' +
      "UPPER('" +
      NomEstado +
      "')" +
      ' AND UPPER(P.NomPais) = ' +
      "UPPER('" +
      NomPais +
      "')";

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

const buscaCidadeCompleta = async where => {
  let query =
    'SELECT C.CodCidade CodCidade, C.NomCidade NomCidade, E.CodEstado CodEstado, E.NomEstado NomEstado, P.CodPais CodPais, P.NomPais NomPais FROM Pais P JOIN Estado E ON E.CodPais = P.CodPais JOIN Cidade C ON C.CodEstado = E.CodEstado';
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
  let query = 'SELECT * FROM HistLocalidade';
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

const buscaReferenciaEstado = async where => {
  let query = 'SELECT * FROM Estado';
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

const buscaReferenciaPais = async where => {
  let query = 'SELECT * FROM Pais';
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

const buscaProxIdPais = async () => {
  let query = 'SELECT MAX(CodPais) AS NovoIdPais FROM Pais';

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

const buscaProxIdEstado = async () => {
  let query = 'SELECT MAX(CodEstado) AS NovoIdEstado FROM Estado';

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

const buscaProxIdCidade = async () => {
  let query = 'SELECT MAX(CodCidade) AS NovoIdCidade FROM Cidade';

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

const incluiRegistro = async (
  paisEscolhido,
  estadoEscolhido,
  cidadeEscolhida
) => {
  const ultimoIdPais = await buscaProxIdPais();
  const ultimoIdEstado = await buscaProxIdEstado();
  const ultimoIdCidade = await buscaProxIdCidade();
  let proxIdPais = 1;
  let proxIdEstado = 1;
  let proxIdCidade = 1;
  if (ultimoIdPais.registros[0].NovoIdPais != 'NULL')
    proxIdPais = ultimoIdPais.registros[0].NovoIdPais + 1;
  if (ultimoIdEstado.registros[0].NovoIdEstado != 'NULL')
    proxIdEstado = ultimoIdEstado.registros[0].NovoIdEstado + 1;
  if (ultimoIdCidade.registros[0].NovoIdCidade != 'NULL')
    proxIdCidade = ultimoIdCidade.registros[0].NovoIdCidade + 1;
  let pesquisaPais = `UPPER('${paisEscolhido}')`;
  let pesquisaEstado = `UPPER('${estadoEscolhido}')`;
  let pesquisaCidade = `UPPER('${cidadeEscolhida}')`;
  const existePais = await buscaPais(pesquisaPais);
  if (existePais.registros[0] !== undefined) {
    var codPais = await buscaCodPais(paisEscolhido);
    var wherePais = codPais.registros[0].CodPais;
    var existeEstado = await buscaEstado2(estadoEscolhido, paisEscolhido);
    var codEstado = await buscaCodEstado(estadoEscolhido, wherePais);
  }
  if (
    existePais.registros[0] !== undefined &&
    existeEstado.registros[0] !== undefined
  ) {
    var wherePais = codPais.registros[0].CodPais;
    var whereEstado = codEstado.registros[0].CodEstado;
    var existeCidade = await buscaCidade(
      cidadeEscolhida,
      estadoEscolhido,
      paisEscolhido
    );
  }
  if (
    paisEscolhido !== '' &&
    estadoEscolhido !== '' &&
    cidadeEscolhida !== ''
  ) {
    //1º Caso: País e, consequentenmente, Estado e Cidade não estão cadastrados
    if (existePais.registros[0] === undefined) {
      try {
        var query;
        query = `
        INSERT INTO Pais (CodPais, NomPais) 
        VALUES (${proxIdPais}, '${paisEscolhido}')
        
        INSERT INTO Estado (CodPais, CodEstado, NomEstado) VALUES 
        (${proxIdPais}, ${proxIdEstado},'${estadoEscolhido}')
        
        INSERT INTO Cidade (CodPais, CodEstado, CodCidade, NomCidade) VALUES
        (${proxIdPais}, ${proxIdEstado}, ${proxIdCidade}, '${cidadeEscolhida}')`;

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
      } catch (error) {
        console.log('Erro no insert no banco de dados:', error);
        return false;
      }
    }
    //2º Caso: Estado e, consequentenmente, Cidade não estão cadastrados
    else if (existeEstado.registros[0] === undefined) {
      try {
        var query;
        query = `INSERT INTO Estado (CodPais, CodEstado, NomEstado) VALUES 
        (${wherePais}, ${proxIdEstado},'${estadoEscolhido}')
        
        INSERT INTO Cidade (CodPais, CodEstado, CodCidade, NomCidade) VALUES
        (${wherePais}, ${proxIdEstado}, ${proxIdCidade}, '${cidadeEscolhida}')`;

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
      } catch (error) {
        console.log('Erro no insert no banco de dados:', error);
        return false;
      }
    }
    //3º Caso: Apenas a cidade não está cadastrada
    else if (existeCidade.registros[0] === undefined) {
      try {
        var query;
        query = `INSERT INTO Cidade (CodPais, CodEstado, CodCidade, NomCidade)
      VALUES (${wherePais}, ${whereEstado}, ${proxIdCidade}, 
      '${cidadeEscolhida}')`;
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
      } catch (error) {
        console.log('Erro no insert no banco de dados:', error);
        return false;
      }
    }
  } else {
    return false;
  }
};

const incluiPais = async (proxIdPais, paisEscolhido) => {
  try {
    var query;
    query =
      'INSERT INTO Pais (CodPais, NomPais) VALUES (' +
      proxIdPais +
      ",'" +
      paisEscolhido +
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
  } catch (error) {
    console.log('Erro no insert no banco de dados:', error);
    return false;
  }
};

const incluiEstado = async (proxIdPais, proxIdEstado, estadoEscolhido) => {
  try {
    var query;
    query =
      'INSERT INTO Estado (CodPais, CodEstado, NomEstado) VALUES (' +
      proxIdPais +
      ',' +
      proxIdEstado +
      ",'" +
      estadoEscolhido +
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
  } catch (error) {
    console.log('Erro no insert no banco de dados:', error);
    return false;
  }
};

const incluiCidade = async (
  proxIdPais,
  proxIdEstado,
  proxIdCidade,
  cidadeEscolhida
) => {
  try {
    var query;
    query =
      'INSERT INTO Cidade (CodPais, CodEstado, CodCidade, NomCidade) VALUES (' +
      proxIdPais +
      ',' +
      proxIdEstado +
      ',' +
      proxIdCidade +
      ",'" +
      cidadeEscolhida +
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
  } catch (error) {
    console.log('Erro no insert no banco de dados:', error);
    return false;
  }
};

const alteraPais = (set, where) => {
  let query =
    "UPDATE Pais SET NomPais = '" + set + "' WHERE CodPais = " + where;
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

const alteraEstado = (set, where1, where2) => {
  let query =
    "UPDATE Estado SET NomEstado = '" +
    set +
    "' WHERE CodPais = " +
    where1 +
    ' AND CodEstado = ' +
    where2;
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

const alteraCidade = (set, where1, where2, where3) => {
  let query =
    "UPDATE Cidade SET NomCidade = '" +
    set +
    "' WHERE CodPais = " +
    where1 +
    ' AND CodEstado = ' +
    where2 +
    ' AND CodCidade = ' +
    where3;
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

const excluiPais = async (codigoPais, codigoEstado, codigoCidade) => {
  let pesquisaReferenciaEmpresa = `CodCidade = ${codigoCidade} AND CodEstado = ${codigoEstado} AND CodPais = ${codigoPais}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    pesquisaReferenciaEmpresa
  );

  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else {
    let query = 'DELETE FROM Pais WHERE CodPais = ' + codigoPais + ';';

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

const excluiEstado = async (codigoPais, codigoEstado, codigoCidade) => {
  let pesquisaReferenciaEmpresa = `CodCidade = ${codigoCidade} AND CodEstado = ${codigoEstado} AND CodPais = ${codigoPais}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    pesquisaReferenciaEmpresa
  );

  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else {
    let query =
      'DELETE FROM Estado WHERE CodPais = ' +
      codigoPais +
      ' AND CodEstado = ' +
      codigoEstado +
      ';';

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

const excluiCidade = async (codigoPais, codigoEstado, codigoCidade) => {
  let pesquisaReferenciaEmpresa = `CodCidade = ${codigoCidade} AND CodEstado = ${codigoEstado} AND CodPais = ${codigoPais}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(
    pesquisaReferenciaEmpresa
  );
  let pesquisaUltimaCidade = `CodCidade = ${codigoCidade} AND CodEstado = ${codigoEstado} AND CodPais = ${codigoPais}`;
  const confirmaUltimaCidade = await buscaNumeroCidades(pesquisaUltimaCidade);
  console.log(confirmaUltimaCidade.registros[0].Qtd);

  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else {
    let query =
      'DELETE FROM Cidade WHERE CodPais = ' +
      codigoPais +
      ' AND CodEstado = ' +
      codigoEstado +
      ' AND CodCidade = ' +
      codigoCidade +
      ';';

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
  buscaCodEstado,
  buscaCodPais,
  buscaCodCidade,
  buscaPais,
  buscaEstado,
  buscaEstado2,
  buscaCidade,
  buscaCidade2,
  buscaCidadeCompleta,
  buscaNumeroCidades,
  buscaNumeroEstados,
  buscaReferenciaEmpresa,
  buscaReferenciaEstado,
  buscaReferenciaPais,
  buscaProxIdPais,
  buscaProxIdEstado,
  buscaProxIdCidade,
  incluiRegistro,
  incluiEstado,
  incluiCidade,
  alteraPais,
  alteraEstado,
  alteraCidade,
  excluiPais,
  excluiEstado,
  excluiCidade
};
