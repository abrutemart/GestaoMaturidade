import Axios from 'axios';

const buscaProcessos = async (desProcesso = null, codProcesso = null) => {
  let query = 'SELECT CodProces, DesProces FROM Processo';
  if (desProcesso != null && codProcesso == null) {
    query = query + ' WHERE ' + desProcesso + ' COLLATE Latin1_General_CI_AI';
  } else if (desProcesso == null && codProcesso != null) {
    query = query + ' WHERE ' + codProcesso;
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

const buscaSegmento = async where => {
  let query = 'SELECT * FROM Segmento ORDER BY DesSegmen';
  /* if (where != null) query = query + ' WHERE ' + where; */
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
  if (CodSegmen == null) {
    var query = `SELECT S.CodSegmen, SP.CodProces, S.DesSegmen,
  MAX(HoraAlter) AS Hora
  FROM SegmenProces SP JOIN Segmento S ON SP.CodSegmen= S.CodSegmen
  WHERE SP.${CodProces}
  GROUP BY S.CodSegmen, 
  SP.CodProces, S.DesSegmen`;
  } else {
    var query = `SELECT S.CodSegmen, SP.CodProces, S.DesSegmen,
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

const buscaReferenciaProEmpAux = async where => {
  let query = 'SELECT * FROM ProEmpAux';
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

const buscaReferenciaProcessoEmp = async where => {
  let query = 'SELECT * FROM ProcessoEmp';
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

const buscaImagem = async where => {
  let query = 'SELECT * FROM Imagem ORDER BY DesImagem';
  /* if (where != null) query = query + ' WHERE ' + where; */
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

const excluiProcessos = async CodProces => {
  let codigoProcesso = `CodProces = ${CodProces}`;
  const existeReferenciaSegProc = await buscaReferenciaSegProc(codigoProcesso);
  const existeReferenciaPergSegPro = await buscaReferenciaPergSegPro(
    codigoProcesso
  );
  const existeReferenciaProEmpAux = await buscaReferenciaProEmpAux(
    codigoProcesso
  );
  const existeReferenciaProcessoEmp = await buscaReferenciaProcessoEmp(
    codigoProcesso
  );
  if (
    existeReferenciaSegProc.registros[0] !== undefined ||
    existeReferenciaPergSegPro.registros[0] !== undefined ||
    existeReferenciaProEmpAux.registros[0] !== undefined ||
    existeReferenciaProcessoEmp.registros[0] !== undefined
  ) {
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

const incluiProcesso = async desProcesso => {
  try {
    const ultimoIdProcesso = await buscaProxIdProcesso();
    let proxIdProcesso = 1;
    if (ultimoIdProcesso.registros[0].NovoIdProcesso != 'NULL')
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

export {
  buscaProcessos,
  buscaImagem,
  excluiProcessos,
  buscaReferenciaSegProc,
  incluiProcesso,
  alteraProcesso,
  buscaSegmento,
  buscaSegmentoProcesso,
  incluiSegmentoProcesso,
  excluiSegmentoProcesso,
  incluiProcessoImagem
};
