import Axios from 'axios';

const buscaSegmentos = async (desSegmento = null, codSegmento = null) => {
  let query = 'SELECT CodSegmen, DesSegmen FROM Segmento';
  if (desSegmento != null && codSegmento == null) {
    query = query + ' WHERE ' + desSegmento + ' COLLATE Latin1_General_CI_AI';
  } else if (desSegmento == null && codSegmento != null) {
    query = query + ' WHERE ' + codSegmento;
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

const buscaNivelAnalise = async where => {
  let query = 'SELECT CodNivAna, DesNivAna FROM NivelAnalise';
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

const buscaCfgNivelAnalise = async where => {
  let query = `SELECT CfgNivelAnalise.CodNivAna, NivelAnalise.DesNivAna
  FROM CfgNivelAnalise
  JOIN NivelAnalise ON NivelAnalise.CodNivAna = CfgNivelAnalise.CodNivAna`;
  if (where != null) {
    query = query + ' AND NivelAnalise.' + where;
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

const buscaCfgNivEsp = async where => {
  let query = `SELECT CfgNivEsp.CodNivAna, CfgNivEsp.CodSegmen, NivelAnalise.DesNivAna
  FROM CfgNivEsp
  JOIN NivelAnalise ON NivelAnalise.CodNivAna = CfgNivEsp.CodNivAna
  WHERE CfgNivEsp.HoraAlter IN (SELECT max(T2.HoraAlter)
  FROM CfgNivEsp T2
  WHERE CfgNivEsp.CodSegmen=T2.CodSegmen
  GROUP BY CodSegmen, CodNivAna)`;
  if (where != null) {
    query = query + ' AND CfgNivEsp.' + where;
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

const buscaNivAnaliseSegmen = async where => {
  let query = `SELECT 
  Segmento.CodSegmen,
  Segmento.DesSegmen,
COUNT (Segmento.CodSegmen) AS Niveis
  FROM Segmento
  JOIN CfgNivEsp ON CfgNivEsp.CodSegmen = Segmento.CodSegmen
  JOIN NivelAnalise ON NivelAnalise.CodNivAna = CfgNivEsp.CodNivAna
  WHERE CfgNivEsp.HoraAlter IN (SELECT max(T2.HoraAlter)
  FROM CfgNivEsp T2
  WHERE CfgNivEsp.CodSegmen=T2.CodSegmen
  GROUP BY CodSegmen, CodNivAna
)
  GROUP BY Segmento.CodSegmen, Segmento.DesSegmen`;
  if (where != null) {
    query = `SELECT 
    Segmento.CodSegmen,
    Segmento.DesSegmen,
  COUNT (Segmento.CodSegmen) AS Niveis
    FROM Segmento
    JOIN CfgNivEsp ON CfgNivEsp.CodSegmen = Segmento.CodSegmen
    JOIN NivelAnalise ON NivelAnalise.CodNivAna = CfgNivEsp.CodNivAna
    WHERE CfgNivEsp.HoraAlter IN (SELECT max(T2.HoraAlter)
    FROM CfgNivEsp T2
    WHERE CfgNivEsp.CodSegmen=T2.CodSegmen
    GROUP BY CodSegmen, CodNivAna
  ) AND Segmento.DesSegmen=${where}
    GROUP BY Segmento.CodSegmen, Segmento.DesSegmen`;
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

const buscaSegmentoProcesso = async (CodSegmen, CodProces = null) => {
  if (CodProces == null) {
    var query = `SELECT S.CodSegmen, P.CodProces,P.DesProces,
  MAX(HoraAlter) AS Hora
  FROM SegmenProces S JOIN Processo P ON P.CodProces = S.CodProces
  WHERE S.${CodSegmen}
  GROUP BY S.CodSegmen, 
  P.CodProces, P.DesProces`;
  } else {
    var query = `SELECT S.CodSegmen, P.CodProces,P.DesProces,
  MAX(HoraAlter) AS Hora
  FROM SegmenProces S JOIN Processo P ON P.CodProces = S.CodProces
  WHERE S.${CodSegmen} AND P.${CodProces}
  GROUP BY S.CodSegmen, 
  P.CodProces, P.DesProces`;
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

const excluiCfgNivGeral = async CodNivAna => {
  let query = `DELETE FROM CfgNivelAnalise WHERE CodNivAna = ${CodNivAna}`;
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

const excluiCfgNivEsp = async CodSegmen => {
  let query = `DELETE FROM CfgNivEsp WHERE CodSegmen = ${CodSegmen}`;
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

const excluiNivEsp = async (CodSegmen, CodNivAna) => {
  let query = `DELETE FROM CfgNivEsp
   WHERE CodSegmen = ${CodSegmen} AND CodNivAna = ${CodNivAna}`;
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

const excluiSegmento = async CodSegmen => {
  let codigoSegmento = `CodSegmen = ${CodSegmen}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(codigoSegmento);
  const existeReferenciaSegmenProces = await buscaReferenciaSegProc(
    codigoSegmento
  );
  const existeReferenciaPergSegpro = await buscaReferenciaPergSegPro(
    codigoSegmento
  );
  const existeReferenciaCfgNivEsp = await buscaReferenciaCfgNivEsp(
    codigoSegmento
  );
  if (
    existeReferenciaEmpresa.registros[0] === undefined &&
    existeReferenciaSegmenProces.registros[0] === undefined &&
    existeReferenciaPergSegpro.registros[0] === undefined &&
    existeReferenciaCfgNivEsp.registros[0] === undefined
  ) {
    const exclui = async () => {
      try {
        let query = `DELETE FROM Segmento WHERE CodSegmen = ${CodSegmen};`;
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
      } catch (err) {
        console.log(err);
      }
    };
    exclui();
  } else return false;
};

const excluiSegmentoProcesso = async (CodSegmen, CodProces) => {
  /* let codigoSegmento = `CodSegmen = ${CodSegmen}`;
  const existeReferenciaEmpresa = await buscaReferenciaEmpresa(codigoSegmento);
  if (existeReferenciaEmpresa.registros[0] !== undefined) {
    return false;
  } else { */
  let query = `DELETE FROM SegmenProces WHERE CodSegmen = ${CodSegmen} AND CodProces = ${CodProces};`;
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
  /* } */
};

const buscaReferenciaEmpresa = async where => {
  let query = 'SELECT * FROM HistSegAreAtu';
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

const buscaReferenciaPergSegPro = async where => {
  let query = 'SELECT * FROM PergSegPro';
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

const buscaReferenciaCfgNivEsp = async where => {
  let query = 'SELECT * FROM CfgNivEsp';
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

const buscaReferenciaSegProc = async where => {
  let query = 'SELECT * FROM SegmenProces';
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

const buscaProxIdSegmento = async () => {
  let query = 'SELECT MAX(CodSegmen) AS NovoIdSegmento FROM Segmento';

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

const incluiSegmento = async desSegmento => {
  try {
    const ultimoIdSegmento = await buscaProxIdSegmento();
    let proxIdSegmento = 1;
    if (ultimoIdSegmento.registros[0].NovoIdSegmento)
      proxIdSegmento = ultimoIdSegmento.registros[0].NovoIdSegmento + 1;
    let descricaoSegmento = `UPPER(DesSegmen) = UPPER('${desSegmento}')`;
    const existeSegmento = await buscaSegmentos(descricaoSegmento);
    if (existeSegmento.registros[0] === undefined) {
      var query;
      query =
        'INSERT INTO Segmento (CodSegmen, DesSegmen) VALUES (' +
        proxIdSegmento +
        ",'" +
        desSegmento +
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

const incluiConfigNivGeral = async CodNivAna => {
  try {
    var tempoSegundos = Math.round(new Date() / 1000);
    let descricaoSegmento = `CodNivAna = ${CodNivAna}`;
    const existeSegmento = await buscaCfgNivelAnalise(descricaoSegmento);
    if (existeSegmento.registros[0] === undefined) {
      var query;
      query = `INSERT INTO CfgNivelAnalise Values
      (1, ${CodNivAna}, GETDATE(), ${tempoSegundos})`;
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

const incluiHistConfigNiv = async (PtoForte, PtoFraco) => {
  try {
    var tempoSegundos = Math.round(new Date() / 1000);
    var query;
    query = `
      INSERT INTO HistCfgNivel Values
      (1, GETDATE(), ${tempoSegundos}, ${PtoForte}, ${PtoFraco})`;
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

const incluiSegmentoProcesso = async (CodSegmen, CodProces) => {
  var tempoSegundos = Math.round(new Date() / 1000);

  var dia = new Date();
  var dd = String(dia.getDate()).padStart(2, '0');
  var MM = String(dia.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = dia.getFullYear();
  var ss = String(dia.getSeconds()).padStart(2, '0');
  var mm = String(dia.getMinutes()).padStart(2, '0');
  var hh = String(dia.getHours()).padStart(2, '0');

  var tempo = `${hh}:${mm}:${ss}`;

  dia = yyyy + '-' + MM + '-' + dd + ' ' + tempo;

  try {
    const codigoSegmento = `CodSegmen =${CodSegmen} `;
    const codigoProcesso = `CodProces =${CodProces} `;
    const existeSegmentoProcesso = await buscaSegmentoProcesso(
      codigoSegmento,
      codigoProcesso
    );
    if (existeSegmentoProcesso.registros[0] === undefined) {
      var query;
      query = `INSERT INTO SegmenProces 
        (CodSegmen, CodProces, DataAlter, HoraAlter)
        VALUES (${CodSegmen}, ${CodProces}, '${dia}', '${tempoSegundos}')`;
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

const incluiCfgNivEsp = async (CodSegmen, CodNivAna) => {
  var tempoSegundos = Math.round(new Date() / 1000);
  let codigoSegAndCfgNiv = `CodNivAna = ${CodNivAna} AND CodSegmen=${CodSegmen}`;
  const existeSegAndCfgNiv = await buscaReferenciaCfgNivEsp(codigoSegAndCfgNiv);
  if (existeSegAndCfgNiv.registros[0] === undefined) {
    try {
      var query;
      query = `
      INSERT INTO CfgNivEsp Values
      (${CodSegmen}, ${CodNivAna}, GETDATE(), ${tempoSegundos})`;
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
  } else return false;
};

const alteraSegmento = (desSegmento, codSegmento) => {
  let query =
    "UPDATE Segmento SET DesSegmen = '" +
    desSegmento +
    "' WHERE CodSegmen = " +
    codSegmento;
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

export {
  buscaSegmentos,
  excluiSegmento,
  buscaReferenciaEmpresa,
  incluiSegmento,
  alteraSegmento,
  buscaNivelAnalise,
  buscaSegmentoProcesso,
  incluiSegmentoProcesso,
  excluiSegmentoProcesso,
  buscaNivAnaliseSegmen,
  incluiConfigNivGeral,
  buscaCfgNivelAnalise,
  excluiCfgNivGeral,
  incluiHistConfigNiv,
  excluiCfgNivEsp,
  incluiCfgNivEsp,
  buscaCfgNivEsp,
  excluiNivEsp
};
