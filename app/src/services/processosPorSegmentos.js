import Axios from 'axios';

const buscaProcessos = async where => {
  let query = `SELECT Processo.CodProces, Processo.DesProces
  FROM SegmenProces
  JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
  WHERE   
    SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter) 
    FROM SegmenProces T2
    WHERE CodProces=T2.CodProces
    GROUP BY CodSegmen, CodProces) AND CodSegmen=${where
    }`
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

const buscaSegmento = async where => {
  let query = 'SELECT * FROM Segmento ORDER BY DesSegmen';
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

const buscaTotalPeso = async CodProces => {
  let query = `SELECT SUM(PSP.Peso) AS Total
  FROM PerguntaProcesso PP FULL JOIN Pergunta P ON P.CodPergun = PP.CodPergun FULL OUTER JOIN PergSegPro PSP ON PSP.CodPergun = P.CodPergun
  WHERE PSP.HoraAlter = (
     SELECT max(T2.HoraAlter) AS Total
     FROM PergSegPro T2
     WHERE PSP.CodPergun=T2.CodPergun
  )  AND  PP.${CodProces}`;
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

const buscaPerguntaPorProcesso = async CodProces => {
  let query = `SELECT P.DesPergun, PSP.Peso AS PesoAntigo, PSP.Peso AS PesoNovo, PSP.CodProces, PSP.CodPergun, PSP.DataAlter, PSP.HoraAlter
  FROM PerguntaProcesso PP FULL JOIN Pergunta P ON P.CodPergun = PP.CodPergun 
  FULL JOIN PergSegPro PSP ON PSP.CodPergun = P.CodPergun
  WHERE (PSP.HoraAlter IN (
     SELECT max(T2.HoraAlter)
     FROM PergSegPro T2
     WHERE PSP.CodPergun=T2.CodPergun
    GROUP BY CodPergun))  AND   PP.${CodProces}
  ORDER BY P.DesPergun`;
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

const buscaPerguntaPorProcesso2 = async CodProces => {
  let query = `SELECT pergunta.CodPergun, Pergunta.DesPergun
  FROM
  Pergunta 
  JOIN PerguntaProcesso ON PerguntaProcesso.CodPergun = Pergunta.CodPergun
  WHERE   
    PerguntaProcesso.HoraAlter IN (SELECT max(T2.HoraAlter) 
    FROM PerguntaProcesso T2
    WHERE CodProces=T2.CodProces
    GROUP BY CodPergun, CodProces) AND PerguntaProcesso.CodProces=${CodProces}
    ORDER BY Pergunta.DesPergun `;
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

const buscaSegmentoProcesso = async (CodSegmen = null, CodProces = null) => {
  var query
  if (CodSegmen == null) {
    query = `SELECT S.CodSegmen, SP.CodProces, S.DesSegmen,
  MAX(HoraAlter) AS Hora
  FROM SegmenProces SP JOIN Segmento S ON SP.CodSegmen= S.CodSegmen
  WHERE SP.${CodProces}
  GROUP BY S.CodSegmen, 
  SP.CodProces, S.DesSegmen`;
  } else {
    query = `SELECT S.CodSegmen, SP.CodProces, S.DesSegmen,
    MAX(HoraAlter) AS Hora
    FROM SegmenProces SP JOIN Segmento S ON SP.CodSegmen= S.CodSegmen
    WHERE SP.${CodSegmen} AND SP.${CodProces}
    GROUP BY S.CodSegmen, 
    SP.CodProces, S.DesSegmen`;
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

const buscaProcessoSegmento = async (where = null, where2 = null) => {
  var query
  if (where != null && where2 == null) {
    query = `SELECT DISTINCT
    PergSegPro.CodSegmen,
    Segmento.DesSegmen,
    PergSegPro.CodProces,
    Processo.DesProces
    FROM PergSegPro
    JOIN Segmento ON Segmento.CodSegmen = PergSegPro.CodSegmen
    JOIN Processo ON Processo.CodProces = PergSegPro.CodProces
    WHERE ${where}`;    
  } else if (where != null && where2 != null) {
    query = `SELECT S.CodSegmen, SP.CodProces, S.DesSegmen, P.DesProces
    FROM SegmenProces SP JOIN Segmento S ON SP.CodSegmen= S.CodSegmen  JOIN Processo P ON P.CodProces = SP.CodProces  
    WHERE ${where} AND ${where2}
   AND SP.HoraAlter IN (SELECT max(T2.HoraAlter) 
  FROM SegmenProces T2
  WHERE CodSegmen=T2.CodSegmen
  GROUP BY CodSegmen, CodProces)`;
    
  } else {
    query = `SELECT DISTINCT
    PergSegPro.CodSegmen,
    Segmento.DesSegmen,
    PergSegPro.CodProces,
    Processo.DesProces
    FROM PergSegPro
    JOIN Segmento ON Segmento.CodSegmen = PergSegPro.CodSegmen
    JOIN Processo ON Processo.CodProces = PergSegPro.CodProces`;
    
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

const buscaProcessoImagem = async (CodImagem = null, CodProces = null) => {
  var query = `SELECT CodProces, CodImagem
  FROM Processo
  WHERE ${CodImagem} AND ${CodProces}`;
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

const buscaProxIdProcesso = async () => {
  let query = 'SELECT MAX(CodProces) AS NovoIdProcesso FROM Processo';

  const result = await Axios.get(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA + '/api/get', {
    params: { query }
  })
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.log('Erro na consulta no banco de dados:', error);
    });

  return result;
};

const excluiProcessos = async CodProces => {
  let codigoProcesso = `CodProces = ${CodProces}`;
  const existeReferenciaSegProc = await buscaReferenciaSegProc(codigoProcesso);
  if (existeReferenciaSegProc.registros[0] !== undefined) {
    return false;
  } else {
    let query = `DELETE FROM Processo WHERE CodProces = ${CodProces};`;
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

const excluiSegmentoProcesso = async (CodSegmen, CodProces) => {
  /* let codigoSegmento = `CodSegmen = ${CodSegmen}`;
  const existeReferenciaSegProc = await buscaReferenciaSegProc(codigoSegmento);
  if (existeReferenciaSegProc.registros[0] !== undefined) {
    return false;
  } else { */
  let query = `DELETE FROM PergSegPro WHERE CodSegmen = ${CodSegmen} AND CodProces = ${CodProces};`;
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

const incluiProcesso = async desProcesso => {
  try {
    const ultimoIdProcesso = await buscaProxIdProcesso();
    let proxIdProcesso = 1;
    proxIdProcesso = ultimoIdProcesso.registros[0].NovoIdProcesso + 1;
    let descricaoProcesso = `UPPER(DesProces) = UPPER('${desProcesso}')`;
    const existeProcesso = await buscaProcessos(descricaoProcesso);
    if (existeProcesso.registros[0] === undefined) {
      var query;
      query =
        'INSERT INTO Processo (CodProces, DesProces) VALUES (' +
        proxIdProcesso +
        ",'" +
        desProcesso +
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

const incluiSegmentoProcesso = async (CodSegmen, CodProces) => {
  var d = new Date();
  var hora = d.toLocaleTimeString();
  var tempoSegundos = Math.round(new Date() / 1000);

  var dia = new Date();
  var dd = String(dia.getDate()).padStart(2, '0');
  var mm = String(dia.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = dia.getFullYear();

  dia = dd + '/' + mm + '/' + yyyy;

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
        VALUES (${CodSegmen}, ${CodProces}, GETDATE(), '${tempoSegundos}')`;
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

const incluiProcessoImagem = async (CodImagem, CodProces) => {
  try {
    const codigoImagem = `CodImagem =${CodImagem} `;
    const codigoProcesso = `CodProces =${CodProces} `;
    const existeImagemProcesso = await buscaProcessoImagem(
      codigoImagem,
      codigoProcesso
    );
    if (existeImagemProcesso.registros[0] === undefined) {
      var query;
      query = `UPDATE Processo
        SET CodImagem =${CodImagem}
        WHERE CodProces = ${CodProces}`;
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

const alteraProcesso = (desProcesso, codProcesso) => {
  let query =
    "UPDATE Processo SET DesProces = '" +
    desProcesso +
    "' WHERE CodProces = " +
    codProcesso;
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

const alteraPeso = (CodSegmen, CodProces, CodPergun, Peso) => {
  var tempoSegundos = Math.round(new Date() / 1000);
  let query = `UPDATE dbo.PergSegPro
    SET Peso = ${Peso}
    WHERE CodSegmen = ${CodSegmen} AND CodProces = ${CodProces} AND
     CodPergun = ${CodPergun} AND HoraAlter = ${tempoSegundos}`;
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

const inserePeso = (CodSegmen, CodProces, CodPergun, Peso) => {
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

  let query = `INSERT INTO PergSegPro 
    (CodSegmen, CodProces, CodPergun, DataAlter, HoraAlter, Peso)
    VALUES (${CodSegmen},${CodProces}, ${CodPergun}, '${dia}', '${tempoSegundos}',
    ${Peso})`;
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
  buscaProcessos,
  excluiProcessos,
  buscaReferenciaSegProc,
  incluiProcesso,
  alteraProcesso,
  buscaSegmento,
  buscaSegmentoProcesso,
  incluiSegmentoProcesso,
  excluiSegmentoProcesso,
  incluiProcessoImagem,
  buscaProcessoSegmento,
  buscaPerguntaPorProcesso,
  buscaPerguntaPorProcesso2,
  inserePeso,
  buscaTotalPeso,
  alteraPeso
};
