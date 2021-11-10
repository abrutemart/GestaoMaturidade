import Axios from 'axios';

const buscaPerguntasPorProcesso = async where => {
  let query = `SELECT 
  PerguntaProcesso.CodProces, 
  PerguntaProcesso.CodPergun,
  Categoria.CodCatego,
  GrpResposta.CodGrpRes,
  Processo.DesProces, 
  Pergunta.DesPergun, 
  Categoria.DesCatego, 
  GrpResposta.NomGrpRes
  FROM Processo 
  JOIN PerguntaProcesso ON PerguntaProcesso.CodProces = Processo.CodProces
  JOIN Pergunta ON Pergunta.CodPergun = PerguntaProcesso.CodPergun
  JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
  JOIN Categoria ON Categoria.CodCatego = HistPergunta.CodCatego
  JOIN GrpResposta ON GrpResposta.CodGrpRes = HistPergunta.CodGrpRes
  WHERE PerguntaProcesso.HoraAlter IN (
  SELECT max(T2.HoraAlter)
  FROM PerguntaProcesso T2
  WHERE PerguntaProcesso.CodPergun=T2.CodPergun
  GROUP BY CodProces) AND 
  HistPergunta.HoraAlter IN (
  SELECT max(T2.HoraAlter)
  FROM HistPergunta T2
  WHERE HistPergunta.CodPergun=T2.CodPergun
  GROUP BY CodPergun)`;
  if (where != null) {
    query = query + where;
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

const buscaProcesso = async where => {
  let query = `SELECT CodProces, DesProces, CodImagem
  FROM Processo`;
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

const buscaAssunto = async where => {
  let query = `SELECT CodAssunt, DesAssunt FROM Assunto`;
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

const buscaRisco = async where => {
  let query = `SELECT CodRisco, DesRisco FROM Risco`;
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

const buscaPergunta = async where => {
  let query = `SELECT CodPergun, DesPergun FROM Pergunta`;
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

const buscaHistPergunta = async where => {
  let query = `SELECT * FROM HistPergunta`;
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

const buscaCategoriaDePerguntas = async where => {
  let query = `SELECT CodCatego, DesCatego
  FROM Categoria`;
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

const buscaGrupoDeRespostas = async where => {
  let query = `SELECT CodGrpRes, NomGrpRes
  FROM GrpResposta`;
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

const buscaPerguntaCategoriaGrpResposta = async (CodAssunt = null) => {
  if (CodAssunt !== null && CodAssunt !== '') {
    let query = `SELECT 
  Pergunta.CodPergun,  
    Pergunta.DesPergun,
    Categoria.CodCatego,
    Categoria.DesCatego,
    GrpResposta.CodGrpRes,
    GrpResposta.NomGrpRes
    FROM Pergunta
    JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
    JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt 
    JOIN GrpResposta ON GrpResposta.CodGrpRes = HistPergunta.CodGrpRes
    JOIN Categoria ON Categoria.CodCatego = HistPergunta.CodCatego
    WHERE  
    HistPergunta.HoraAlter IN (
    SELECT max(T2.HoraAlter)
    FROM HistPergunta T2
    WHERE HistPergunta.CodPergun=T2.CodPergun
    GROUP BY CodPergun) AND Assunto.CodAssunt =${CodAssunt}`;
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

const buscaRiscoPergunta = async CodPergun => {
  let query = `  SELECT 
  RiscoPergunta.CodPergun, 
  RiscoPergunta.CodRisco, 
  Risco.DesRisco,
  RiscoPergunta.DataAlter, 
  RiscoPergunta.HoraAlter
  FROM Risco
  JOIN RiscoPergunta ON Risco.CodRisco = RiscoPergunta.CodRisco
  JOIN Pergunta ON Pergunta.CodPergun = RiscoPergunta.CodPergun
  WHERE RiscoPergunta.HoraAlter IN (
    SELECT max(T2.HoraAlter)
    FROM RiscoPergunta T2
    WHERE RiscoPergunta.CodPergun=T2.CodPergun
    GROUP BY CodRisco) `;
  if (CodPergun != null) query = query + ' AND Pergunta.CodPergun=' + CodPergun;
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

const excluiPerguntaProcesso = async (CodProces, CodPergun) => {
  let query = `DELETE FROM PerguntaProcesso WHERE CodProces = ${CodProces} AND CodPergun = ${CodPergun};`;
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

const buscaProxIdAssunto = async () => {
  let query = 'SELECT MAX(CodAssunt) AS NovoIdAssunto FROM Assunto';

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

const buscaProxIdPergunta = async () => {
  let query = 'SELECT MAX(CodPergun) AS NovoIdPergunta FROM Pergunta';

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

const buscaProxIdRisco = async () => {
  let query = 'SELECT MAX(CodRisco) AS NovoIdRisco FROM Risco';

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

const incluiAssunto = async DesAssunt => {
  try {
    const ultimoIdAssunto = await buscaProxIdAssunto();
    let proxIdAssunto = 1;
    if (ultimoIdAssunto.registros[0].NovoIdAssunto !== 'NULL')
      proxIdAssunto = ultimoIdAssunto.registros[0].NovoIdAssunto + 1;
    let descricaoAssunto = `UPPER(DesAssunt) = UPPER('${DesAssunt}')`;
    const existeAssunto = await buscaAssunto(descricaoAssunto);
    if (existeAssunto.registros[0] === undefined) {
      var query;
      query =
        'INSERT INTO Assunto (CodAssunt, DesAssunt) VALUES (' +
        proxIdAssunto +
        ",'" +
        DesAssunt +
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

const incluiRisco = async (CodPergun, DesRisco) => {
  try {
    var tempoSegundos = Math.round(new Date() / 1000);
    const ultimoIdRisco = await buscaProxIdRisco();
    let proxIdRisco = 1;
    if (ultimoIdRisco.registros[0].NovoIdRisco !== 'NULL')
      proxIdRisco = ultimoIdRisco.registros[0].NovoIdRisco + 1;
    let descricaoRisco = `UPPER(DesRisco) = UPPER('${DesRisco}')`;
    const existeRisco = await buscaRisco(descricaoRisco);
    if (existeRisco.registros[0] === undefined) {
      var query;
      query = `INSERT INTO Risco
        (CodRisco, DesRisco) 
        VALUES 
        (${proxIdRisco}, '${DesRisco}')
        
        INSERT INTO RiscoPergunta 
        (CodPergun, CodRisco, DataAlter, HoraAlter)
        VALUES 
        (${CodPergun}, ${proxIdRisco}, GETDATE(), ${tempoSegundos})`;
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

const incluiAssuPergCategGrpResp = async (
  CodAssunt,
  DesPergun,
  CodCatego,
  CodGrpRes
) => {
  try {
    var tempoSegundos = Math.round(new Date() / 1000);
    const ultimoIdPergunta = await buscaProxIdPergunta();
    let proxIdPergunta = 1;
    if (ultimoIdPergunta.registros[0].NovoIdPergunta !== 'NULL')
      proxIdPergunta = ultimoIdPergunta.registros[0].NovoIdPergunta + 1;
    let descricaoPergunta = `UPPER(DesPergun) = UPPER('${DesPergun}')`;
    const existePergunta = await buscaPergunta(descricaoPergunta);
    if (existePergunta.registros[0] === undefined) {
      var query;
      query = `INSERT INTO Pergunta 
        (CodPergun, DesPergun)
        VALUES 
        (${proxIdPergunta}, '${DesPergun}')
        
        INSERT INTO HistPergunta 
        (CodPergun, DataAlter, HoraAlter, CodAssunt, CodCatego, CodGrpRes)
        VALUES 
        (${proxIdPergunta}, GETDATE(), ${tempoSegundos}, ${CodAssunt}, ${CodCatego}, ${CodGrpRes})`;
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

const incluiPerguntaProcesso = async (CodProces, CodPergun) => {
  try {
    var tempoSegundos = Math.round(new Date() / 1000);
    var query;
    query = `INSERT INTO PerguntaProcesso 
        (CodProces, CodPergun, DataAlter, HoraAlter)
        VALUES 
        (${CodProces}, ${CodPergun}, GETDATE(), ${tempoSegundos})`;
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

const alteraAssunto = async (CodAssunt, DesAssunt) => {
  let descricaoAssunto = `UPPER(DesAssunt) = UPPER('${DesAssunt}')`;
  const existeAssunto = await buscaAssunto(descricaoAssunto);
  if (existeAssunto.registros[0] === undefined) {
    let query =
      "UPDATE Assunto SET DesAssunt = '" +
      DesAssunt +
      "' WHERE CodAssunt = " +
      CodAssunt;
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

const alteraPergunta = async (CodPergun, DesPergun) => {
  let descricaoPergunta = `UPPER(DesPergun) = UPPER('${DesPergun}')`;
  const existepergunta = await buscaPergunta(descricaoPergunta);
  if (existepergunta.registros[0] === undefined) {
    let query =
      "UPDATE Pergunta SET DesPergun = '" +
      DesPergun +
      "' WHERE CodPergun = " +
      CodPergun;
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

const alteraRisco = async (CodRisco, DesRisco) => {
  let descricaoRisco = `UPPER(DesRisco) = UPPER('${DesRisco}')`;
  const existeRisco = await buscaRisco(descricaoRisco);
  if (existeRisco.registros[0] === undefined) {
    let query =
      "UPDATE Risco SET DesRisco = '" +
      DesRisco +
      "' WHERE CodRisco = " +
      CodRisco;
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

const excluiAssunto = async CodAssunt => {
  let query = `DELETE FROM Assunto WHERE CodAssunt = ${CodAssunt}`;
  let pesquisaAssunto = `CodAssunt = ${CodAssunt}`;
  const existeAssunto = await buscaHistPergunta(pesquisaAssunto);
  if (existeAssunto.registros[0] === undefined) {
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
  } else return false;
};

const buscaPergSegPro = async where => {
  let query = `SELECT * FROM PergSegPro`;
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

const buscaProcessoEmp = async where => {
  let query = `SELECT * FROM ProcessoEmp`;
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

const buscaPerguntaProcesso = async where => {
  let query = `SELECT * FROM PerguntaProcesso`;
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

const buscaRiscoPergunta2 = async where => {
  let query = `SELECT * FROM RiscoPergunta`;
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

const excluiPergunta = async (CodPergun, CodAssunt, CodCatego, CodGrpRes) => {
  let query = `
  DELETE from HistPergunta 
  WHERE 
  CodPergun = ${CodPergun} AND CodAssunt = ${CodAssunt} AND
  CodCatego = ${CodCatego} AND CodGrpRes = ${CodGrpRes}

  DELETE FROM Pergunta
  WHERE CodPergun = ${CodPergun}`;
  let pesquisaPergunta = `CodPergun = ${CodPergun}`;
  const existePergunta1 = await buscaPergSegPro(pesquisaPergunta);
  const existePergunta2 = await buscaProcessoEmp(pesquisaPergunta);
  const existePergunta3 = await buscaPerguntaProcesso(pesquisaPergunta);
  const existePergunta4 = await buscaRiscoPergunta2(pesquisaPergunta);
  if (
    existePergunta1.registros[0] === undefined &&
    existePergunta2.registros[0] === undefined &&
    existePergunta3.registros[0] === undefined &&
    existePergunta4.registros[0] === undefined
  ) {
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
  } else return false;
};

const excluiRisco = async (CodRisco, CodPergun) => {
  let query = `  
  DELETE FROM RiscoPergunta
  WHERE CodRisco = ${CodRisco} AND CodPergun = ${CodPergun}
  
  DELETE FROM Risco 
  WHERE CodRisco = ${CodRisco}`;
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

export {
  buscaPerguntasPorProcesso,
  buscaReferenciaEmpresa,
  incluiAssunto,
  incluiPerguntaProcesso,
  alteraAssunto,
  alteraPergunta,
  alteraRisco,
  buscaProcesso,
  excluiPerguntaProcesso,
  buscaAssunto,
  buscaCategoriaDePerguntas,
  buscaGrupoDeRespostas,
  buscaPerguntaCategoriaGrpResposta,
  buscaRiscoPergunta,
  excluiAssunto,
  excluiPergunta,
  excluiRisco,
  incluiRisco,
  incluiAssuPergCategGrpResp
};
