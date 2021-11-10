import Axios from 'axios';

const buscaGrpResposta = async (CodGrpRes = null, NomGrpRes = null) => {
  let query = `SELECT GR.CodGrpRes, GR.NomGrpRes, COUNT(R.DesRespos) AS CountResp, HGR.TipoRespo FROM
  GrpResposta GR FULL JOIN HistGrpRes HGR ON HGR.CodGrpRes = GR.CodGrpRes      
  FULL JOIN RespostaGrupo RG ON RG.CodGrupo = GR.CodGrpRes
  LEFT JOIN Resposta R ON R.CodRespos = RG.CodRespos
  WHERE HGR.HoraAlter = (SELECT max(T3.HoraAlter)
       FROM HistGrpRes T3
       WHERE HGR.CodGrpRes=T3.CodGrpRes
    ) OR HGR.HoraAlter IS NULL AND RG.HoraAlter = (SELECT max(T3.HoraAlter)
       FROM RespostaGrupo T3
       WHERE RG.CodGrupo=T3.CodGrupo
    ) OR RG.HoraAlter IS NULL `;

  //Retorna apenas os dados do item que será alterado
  if (CodGrpRes != null && NomGrpRes == null) {
    query = `SELECT GR.CodGrpRes, GR.NomGrpRes, COUNT(R.DesRespos) AS CountResp, HGR.TipoRespo FROM
    GrpResposta GR FULL JOIN HistGrpRes HGR ON HGR.CodGrpRes = GR.CodGrpRes      
    FULL JOIN RespostaGrupo RG ON RG.CodGrupo = GR.CodGrpRes
    LEFT JOIN Resposta R ON R.CodRespos = RG.CodRespos
    WHERE (HGR.HoraAlter = (SELECT max(T3.HoraAlter)
         FROM HistGrpRes T3
         WHERE HGR.CodGrpRes=T3.CodGrpRes
      ) OR HGR.HoraAlter IS NULL AND RG.HoraAlter = (SELECT max(T3.HoraAlter)    
         FROM RespostaGrupo T3
         WHERE RG.CodGrupo=T3.CodGrupo
      ) OR RG.HoraAlter IS NULL) AND GR.${CodGrpRes} GROUP BY GR.CodGrpRes, GR.NomGrpRes, HGR.TipoRespo ORDER BY GR.NomGrpRes `;
  }

  //Filtro para a barra de pesquisa com base no nome da GrpResposta e confirmar se GrpResposta já existe
  else if (CodGrpRes == null && NomGrpRes != null) {
    query = `SELECT GR.CodGrpRes, GR.NomGrpRes, COUNT(R.DesRespos) AS CountResp, HGR.TipoRespo FROM
    GrpResposta GR FULL JOIN HistGrpRes HGR ON HGR.CodGrpRes = GR.CodGrpRes      
    FULL JOIN RespostaGrupo RG ON RG.CodGrupo = GR.CodGrpRes
    LEFT JOIN Resposta R ON R.CodRespos = RG.CodRespos
    WHERE (HGR.HoraAlter = (SELECT max(T3.HoraAlter)
         FROM HistGrpRes T3
         WHERE HGR.CodGrpRes=T3.CodGrpRes
      ) OR HGR.HoraAlter IS NULL AND RG.HoraAlter = (SELECT max(T3.HoraAlter)    
         FROM RespostaGrupo T3
         WHERE RG.CodGrupo=T3.CodGrupo
      ) OR RG.HoraAlter IS NULL)  AND ${NomGrpRes} COLLATE Latin1_General_CI_AI GROUP BY GR.CodGrpRes, GR.NomGrpRes, HGR.TipoRespo ORDER BY GR.NomGrpRes `;
  }

  //Popula os dados com todas as informações relacionadas de GrpResposta ordenado por NomGrpRes, StatGrupo
  else {
    query =
      query +
      ` GROUP BY GR.CodGrpRes, GR.NomGrpRes, HGR.TipoRespo ORDER BY GR.NomGrpRes`;
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

const buscaGrpResposta2 = async where => {
  let query = `SELECT * FROM GrpResposta WHERE ${where}`;

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

const buscaReferenciaHistPergunta = async (CodGrpRes = null) => {
  let query = 'SELECT * FROM HistPergunta';
  if (CodGrpRes != null) query = query + ' WHERE ' + CodGrpRes;
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

const buscaReferenciaRespostaGrupo = async (CodGrpRes = null) => {
  let query = 'SELECT * FROM RespostaGrupo';
  if (CodGrpRes != null) query = query + ' WHERE ' + CodGrpRes;
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

const buscaReferenciaProcessoEmp = async (CodGrpRes = null) => {
  let query = 'SELECT * FROM ProcessoEmp';
  if (CodGrpRes != null) query = query + ' WHERE ' + CodGrpRes;
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

const buscaTotalPercent = async CodGrupo => {
  let query = `SELECT SUM(HR.Percentua) AS TotalPorcentagem FROM
  RespostaGrupo RG JOIN Resposta R ON R.CodRespos = RG.CodRespos JOIN
  HistResposta HR ON R.CodRespos = HR.CodRespos
  WHERE (RG.HoraAlter IN (SELECT max(T2.HoraAlter)
  FROM RespostaGrupo T2
  WHERE CodGrupo=T2.CodGrupo
  GROUP BY CodRespos
  ) OR RG.HoraAlter IS NULL) AND (HR.HoraAlter = (SELECT max(T3.HoraAlter)  
  FROM HistResposta T3
  WHERE HR.CodRespos=T3.CodRespos
  ) OR HR.HoraAlter IS NULL) AND RG.CodGrupo =${CodGrupo}`;

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
  let query = 'SELECT MAX(CodGrpRes) AS NovoIDGrpResposta FROM GrpResposta';

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

const buscaProximoIDResposta = async () => {
  let query = 'SELECT MAX(CodRespos) AS NovoIDResposta FROM Resposta';

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

const buscaResposta = async (CodGrupo, DesRespos) => {
  let query = `SELECT R.CodRespos, R.DesRespos, HR.Percentua
  FROM Resposta R JOIN HistResposta HR ON HR.CodRespos = R.CodRespos`;
  if (CodGrupo != null && DesRespos == null) {
    query = `SELECT RG.CodGrupo, RG.CodRespos, R.DesRespos, HR.Percentua FROM
    RespostaGrupo RG JOIN Resposta R ON R.CodRespos = RG.CodRespos JOIN
    HistResposta HR ON R.CodRespos = HR.CodRespos
    WHERE (RG.HoraAlter IN (SELECT max(T2.HoraAlter)
    FROM RespostaGrupo T2
    WHERE CodGrupo=T2.CodGrupo
    GROUP BY CodRespos
    ) OR RG.HoraAlter IS NULL) AND (HR.HoraAlter = (SELECT max(T3.HoraAlter)  
    FROM HistResposta T3
    WHERE HR.CodRespos=T3.CodRespos
    ) OR HR.HoraAlter IS NULL) AND RG.${CodGrupo} ORDER BY R.DesRespos`;
  } else if (CodGrupo != null && DesRespos != null) {
    query =
      query +
      ' WHERE GR.CodGrupo = ' +
      CodGrupo +
      ' AND ' +
      DesRespos +
      ' ORDER BY R.DesRespos';
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

const buscaResposta2 = async (CodGrupo, DesRespos) => {
  let query = `SELECT R.DesRespos, RG.HoraAlter, GR.CodGrpRes   FROM
  GrpResposta GR  JOIN RespostaGrupo RG ON RG.CodGrupo = GR.CodGrpRes
  FULL JOIN Resposta R ON R.CodRespos = RG.CodRespos
  WHERE ${DesRespos} AND GR.CodGrpRes = ${CodGrupo}`;

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

const incluiGrpResposta = async (NomGrpRes, TipoRespo) => {
  try {
    const ultimoIDGrpResposta = await buscaProximoID();
    let proxIDGrpResposta = 1;
    if (ultimoIDGrpResposta.registros[0].NovoIDGrpResposta !== 'NULL')
      proxIDGrpResposta =
        ultimoIDGrpResposta.registros[0].NovoIDGrpResposta + 1;
    let descricaoGrpResposta = `UPPER(NomGrpRes) = UPPER('${NomGrpRes}')`;
    const existeGrpResposta = await buscaGrpResposta2(descricaoGrpResposta);

    var tempoSegundos = Math.round(new Date() / 1000);

    if (existeGrpResposta.registros[0] === undefined) {
      var query;
      query = `INSERT INTO GrpResposta (CodGrpRes, NomGrpRes) VALUES (
        ${proxIDGrpResposta}, '${NomGrpRes}');

        INSERT INTO HistGrpRes 
        (CodGrpRes, DataAlter, HoraAlter, TipoRespo) 
        VALUES (${proxIDGrpResposta}, GETDATE(), ${tempoSegundos}, '${TipoRespo}')`;
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
      return proxIDGrpResposta;
    } else return false;
  } catch (error) {
    console.log('Erro no insert no banco de dados:', error);
    return false;
  }
};

const incluiResposta = async (CodGrupo, DesRespos, Percentua) => {
  try {
    var tempoSegundos = Math.round(new Date() / 1000);
    const ultimoIDResposta = await buscaProximoIDResposta(CodGrupo);
    let proxIDResposta = 1;
    let ultimoCodRespos = ultimoIDResposta.registros[0].NovoIDResposta;
    ultimoCodRespos === 'NULL'
      ? (proxIDResposta = 1)
      : (proxIDResposta = ultimoIDResposta.registros[0].NovoIDResposta + 1);
    let descricaoResposta = `UPPER(DesRespos) = UPPER('${DesRespos}')`;
    const existeResposta = await buscaResposta2(CodGrupo, descricaoResposta);
    if (existeResposta.registros[0] === undefined) {
      var query;
      query = `INSERT INTO Resposta (CodRespos, DesRespos) VALUES (
        ${proxIDResposta}, '${DesRespos}');

      INSERT INTO HistResposta
      (CodRespos, DataAlter, HoraAlter, Percentua)
      VALUES (${proxIDResposta}, GETDATE(), ${tempoSegundos}, ${Percentua} )

      INSERT INTO RespostaGrupo 
      (CodGrupo, CodRespos, DataAlter, HoraAlter) 
      VALUES (${CodGrupo}, ${proxIDResposta}, GETDATE(), ${tempoSegundos})
      `;
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

const incluiGrupoEResposta = async (
  NomGrpRes,
  TipoRespo,
  DesRespos,
  Percentua
) => {
  try {
    const ultimoIDGrpResposta = await buscaProximoID();
    let proxIDGrpResposta = 1;
    if (ultimoIDGrpResposta.registros[0].NovoIDGrpResposta !== 'NULL')
      proxIDGrpResposta =
        ultimoIDGrpResposta.registros[0].NovoIDGrpResposta + 1;
    let descricaoGrpResposta = `UPPER(NomGrpRes) = UPPER('${NomGrpRes}')`;
    const existeGrpResposta = await buscaGrpResposta2(descricaoGrpResposta);

    var tempoSegundos = Math.round(new Date() / 1000);

    const ultimoIDResposta = await buscaProximoIDResposta();
    let proxIDResposta = 1;
    let ultimoCodRespos = ultimoIDResposta.registros[0].NovoIDResposta;
    ultimoCodRespos === 'NULL'
      ? (proxIDResposta = 1)
      : (proxIDResposta = ultimoIDResposta.registros[0].NovoIDResposta + 1);
    let descricaoResposta = `UPPER(DesRespos) = UPPER('${DesRespos}')`;
    const existeResposta = await buscaResposta2(
      proxIDResposta,
      descricaoResposta
    );

    if (
      existeGrpResposta.registros[0] === undefined &&
      existeResposta.registros[0] === undefined
    ) {
      var query;
      query = `INSERT INTO GrpResposta (CodGrpRes, NomGrpRes) VALUES (
        ${proxIDGrpResposta}, '${NomGrpRes}');

        INSERT INTO HistGrpRes 
        (CodGrpRes, DataAlter, HoraAlter, TipoRespo) 
        VALUES (${proxIDGrpResposta}, GETDATE(), ${tempoSegundos}, '${TipoRespo}')
        
        INSERT INTO Resposta (CodRespos, DesRespos) VALUES (
          ${proxIDResposta}, '${DesRespos}');

        INSERT INTO HistResposta
        (CodRespos, DataAlter, HoraAlter, Percentua)
        VALUES (${proxIDResposta}, GETDATE(), ${tempoSegundos}, ${Percentua} )

        INSERT INTO RespostaGrupo 
        (CodGrupo, CodRespos, DataAlter, HoraAlter) 
        VALUES (${proxIDGrpResposta}, ${proxIDResposta}, GETDATE(), ${tempoSegundos})
        
        `;
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
      return proxIDGrpResposta;
    } else return false;
  } catch (error) {
    console.log('Erro no insert no banco de dados:', error);
    return false;
  }
};

const incluiHistGrpResposta = async (CodGrpRes, TipoRespo) => {
  try {
    var d = new Date();
    var tempoSegundos = Math.round(new Date() / 1000);

    var query;
    query = `INSERT INTO HistGrpRes 
      (CodGrpRes, DataAlter, HoraAlter, TipoRespo) 
      VALUES (${CodGrpRes}, GETDATE(), ${tempoSegundos}, '${TipoRespo}')`;
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

const excluiResposta = async (CodGrupo, CodRespos) => {
  let query = `DELETE FROM RespostaGrupo
  WHERE CodGrupo = ${CodGrupo} AND CodRespos = ${CodRespos}

  DELETE FROM HistResposta
  WHERE CodRespos = ${CodRespos}

  DELETE FROM Resposta
  WHERE CodRespos = ${CodRespos}
`;
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
  return true;
};

const excluiGrpResposta = async CodGrpRes => {
  let codigoGrpResposta = `CodGrpRes = ${CodGrpRes}`;
  let codigoGrupo = `CodGrupo = ${CodGrpRes}`;
  const existeReferenciaPergunta = await buscaReferenciaHistPergunta(
    codigoGrpResposta
  );
  const existeReferenciaProcessoEmp = await buscaReferenciaProcessoEmp(
    codigoGrpResposta
  );
  const existeReferenciaRespostaGrupo = await buscaReferenciaRespostaGrupo(
    codigoGrupo
  );
  if (
    existeReferenciaPergunta.registros[0] !== undefined ||
    existeReferenciaProcessoEmp.registros[0] !== undefined ||
    existeReferenciaRespostaGrupo.registros[0] !== undefined
  ) {
    return false;
  } else {
    let query = `DELETE FROM HistGrpRes
    WHERE CodGrpRes = ${CodGrpRes}
    
    DELETE FROM RespostaGrupo
    WHERE CodGrupo = ${CodGrpRes}
    
    DELETE FROM GrpResposta
    WHERE CodGrpRes =  ${CodGrpRes}`;
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
    return true;
  }
};

const alteraGrpResposta = async (
  CodGrpRes,
  NomGrpRes,
  TipoRespo,
  AlteraSoStatus
) => {
  var tempoSegundos = Math.round(new Date() / 1000);

  let descricaoGrpResposta = `UPPER(GR.NomGrpRes) = UPPER('${NomGrpRes}')`;
  const existeGrpResposta = await buscaGrpResposta(
    undefined,
    descricaoGrpResposta
  );
  if (existeGrpResposta.registros[0] === undefined) {
    let query = `UPDATE GrpResposta 
      SET NomGrpRes = '${NomGrpRes}'      
      WHERE CodGrpRes = ${CodGrpRes}
      
      INSERT INTO HistGrpRes (CodGrpRes, DataAlter, HoraAlter, TipoRespo)
      VALUES (${CodGrpRes}, GETDATE(), ${tempoSegundos}, ${TipoRespo})`;
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
  } else if (AlteraSoStatus === true) {
    let query = `INSERT INTO HistGrpRes (CodGrpRes, DataAlter, HoraAlter, TipoRespo)
      VALUES (${CodGrpRes}, GETDATE(), ${tempoSegundos}, ${TipoRespo})`;
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

const alteraResposta = async (
  CodGrupo,
  CodRespos,
  DesRespos,
  Percentua,
  TipoAlteracao
) => {
  let descricaoResposta = `UPPER(DesRespos) = UPPER('${DesRespos}')`;
  const existeResposta = await buscaResposta2(CodGrupo, descricaoResposta);
  var tempoSegundos = Math.round(new Date() / 1000);
  if (TipoAlteracao === 1) {
    if (existeResposta.registros[0] === undefined) {
      let query = `UPDATE Resposta
      SET DesRespos = '${DesRespos}'
      WHERE CodRespos = ${CodRespos}
      
      INSERT INTO HistResposta (CodRespos, DataAlter, HoraAlter, Percentua)
      VALUES (${CodRespos}, GETDATE(), ${tempoSegundos}, ${Percentua})`;
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
      return true;
    } else return false;
  } else if (TipoAlteracao === 2) {
    if (existeResposta.registros[0] === undefined) {
      let query = `UPDATE Resposta
      SET DesRespos = '${DesRespos}' 
      WHERE CodRespos = ${CodRespos}`;
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
      return true;
    } else return false;
  } else if (TipoAlteracao === 3) {
    let query = `INSERT INTO HistResposta (CodRespos, DataAlter, HoraAlter, Percentua)
    VALUES (${CodRespos}, GETDATE(), ${tempoSegundos}, ${Percentua})`;
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
    return true;
  }
};

export {
  buscaGrpResposta,
  excluiGrpResposta,
  buscaReferenciaHistPergunta,
  incluiGrpResposta,
  alteraGrpResposta,
  buscaResposta,
  excluiResposta,
  incluiResposta,
  alteraResposta,
  buscaProximoID,
  incluiGrupoEResposta,
  incluiHistGrpResposta,
  buscaTotalPercent
};
