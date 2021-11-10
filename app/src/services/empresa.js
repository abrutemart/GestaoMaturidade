import Axios from 'axios';

const buscaEmpresa = async where => {
  let query = `SELECT Empresa.CodEmpres,
  GrupoEmp.NomGrpEmp, Empresa.NomEmpres, Empresa.TipEmpres, Segmento.DesSegmen,  AreaAtuacao.NomAreAtu, Classificacao.DesClassi, Faturamento.DesFatura, Empresa.Telefone,
  Empresa.CodCNPJ, Empresa.Matriz, QtdFuncionario.DesQtdFun,
  Empresa.NomRespon, Empresa.EmaRespon, Empresa.TelRespon, 
  Cargo.DesCargo, Pais.NomPais, Estado.NomEstado, Cidade.NomCidade,
  Empresa.AnoFundac,
  HistLocalidade.HoraAlter 
   FROM EMPRESA
  JOIN HistClassi ON HistClassi.CodEmpres = Empresa.CodEmpres
  JOIN HistFatura ON HistFatura.CodEmpres = Empresa.CodEmpres
  JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
  JOIN HistGrupoEmp ON HistGrupoEmp.CodEmpres = Empresa.CodEmpres
  JOIN HistLocalidade ON HistLocalidade.CodEmpres = Empresa.CodEmpres
  JOIN HistQtdFunc ON HistQtdFunc.CodEmpres = Empresa.CodEmpres  
  JOIN Classificacao ON Classificacao.CodClassi = HistClassi.CodClassi
  JOIN Faturamento ON Faturamento.CodFatura = HistFatura.CodFatura
  JOIN AreaAtuacao ON AreaAtuacao.CodSegmen = HistSegAreAtu.CodSegmen AND      
   AreaAtuacao.CodAreAtu = HistSegAreAtu.CodAreAtu
  JOIN Segmento ON Segmento.CodSegmen = AreaAtuacao.CodSegmen
  JOIN GrupoEmp ON GrupoEmp.CodGrpEmp = HistGrupoEmp.CodGrpEmp
  JOIN Cargo ON Empresa.CodCarRes = Cargo.CodCargo
  JOIN QtdFuncionario ON QtdFuncionario.CodQtdFun = HistQtdFunc.CodQtdFun      
  JOIN Cidade ON Cidade.CodPais = HistLocalidade.CodPais AND
   Cidade.CodEstado = HistLocalidade.CodEstado AND
    Cidade.CodCidade = HistLocalidade.CodCidade
  JOIN Estado ON Estado.CodPais = Cidade.CodPais AND
   Estado.CodEstado = Cidade.CodEstado
  JOIN Pais ON Pais.CodPais = Estado.CodPais
  WHERE HistLocalidade.HoraAlter IN (SELECT max(T2.HoraAlter)
     FROM HistLocalidade T2
     WHERE CodEmpres=T2.CodEmpres
     GROUP BY CodEmpres
  ) AND
  HistQtdFunc.HoraAlter IN (SELECT max(T2.HoraAlter)
     FROM HistQtdFunc T2
     WHERE CodEmpres=T2.CodEmpres
     GROUP BY CodEmpres
  ) AND
  HistGrupoEmp.HoraAlter IN (SELECT max(T2.HoraAlter)
     FROM HistGrupoEmp T2
     WHERE CodEmpres=T2.CodEmpres
     GROUP BY CodEmpres
  ) AND
  HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
     FROM HistSegAreAtu T2
     WHERE CodEmpres=T2.CodEmpres
     GROUP BY CodEmpres
  ) AND 
  HistFatura.HoraAlter IN (SELECT max(T2.HoraAlter)
     FROM HistFatura T2
     WHERE CodEmpres=T2.CodEmpres
     GROUP BY CodEmpres
  ) AND
  HistClassi.HoraAlter IN (SELECT max(T2.HoraAlter)
     FROM HistClassi T2
     WHERE CodEmpres=T2.CodEmpres
     GROUP BY CodEmpres
  )`;
  if (where != null) query = query + ' AND ' + where;
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
  let query = `SELECT * FROM Empresa`;
  query = query + ` WHERE NomEmpres='${where}'`;
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
  let query = `SELECT * FROM ProEmpAux`;
  query = query + ` WHERE ${where}`;
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

const buscaReferenciaProcEmp = async where => {
  let query = `SELECT * FROM ProcessoEmp`;
  query = query + ` WHERE ${where}`;
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

const buscaCadEmpresa = async where => {
  let query = `SELECT 
  GrupoEmp.CodGrpEmp,
  GrupoEmp.NomGrpEmp, 
  Empresa.CodEmpres,
  Empresa.NomEmpres, 
  Empresa.TipEmpres, 
  Empresa.Telefone,
  Empresa.CodCNPJ, 
  Empresa.Matriz, 
  Empresa.NomRespon, 
  Empresa.EmaRespon, 
  Empresa.TelRespon,
  Empresa.AnoFundac, 
  Segmento.CodSegmen,
  Segmento.DesSegmen,  
  AreaAtuacao.CodAreAtu,
  AreaAtuacao.NomAreAtu, 
  Classificacao.CodClassi,
  Classificacao.DesClassi, 
  Faturamento.CodFatura,
  Faturamento.DesFatura, 
  QtdFuncionario.CodQtdFun,
  QtdFuncionario.DesQtdFun,  
  Cargo.CodCargo,
  Cargo.DesCargo, 
  Pais.CodPais,
  Pais.NomPais, 
  Estado.CodEstado,
  Estado.NomEstado, 
  Cidade.CodCidade,
  Cidade.NomCidade
    FROM EMPRESA
    JOIN HistClassi ON HistClassi.CodEmpres = Empresa.CodEmpres
    JOIN HistFatura ON HistFatura.CodEmpres = Empresa.CodEmpres
    JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
    JOIN HistGrupoEmp ON HistGrupoEmp.CodEmpres = Empresa.CodEmpres
    JOIN HistLocalidade ON HistLocalidade.CodEmpres = Empresa.CodEmpres
    JOIN HistQtdFunc ON HistQtdFunc.CodEmpres = Empresa.CodEmpres    
    JOIN Classificacao ON Classificacao.CodClassi = HistClassi.CodClassi
    JOIN Faturamento ON Faturamento.CodFatura = HistFatura.CodFatura
    JOIN AreaAtuacao ON AreaAtuacao.CodSegmen = HistSegAreAtu.CodSegmen AND      
     AreaAtuacao.CodAreAtu = HistSegAreAtu.CodAreAtu
    JOIN Segmento ON Segmento.CodSegmen = AreaAtuacao.CodSegmen
    JOIN GrupoEmp ON GrupoEmp.CodGrpEmp = HistGrupoEmp.CodGrpEmp
    JOIN Cargo ON Cargo.CodCargo = Empresa.CodCarRes
    JOIN QtdFuncionario ON QtdFuncionario.CodQtdFun = HistQtdFunc.CodQtdFun      
    JOIN Cidade ON Cidade.CodPais = HistLocalidade.CodPais AND
     Cidade.CodEstado = HistLocalidade.CodEstado AND
      Cidade.CodCidade = HistLocalidade.CodCidade
    JOIN Estado ON Estado.CodPais = Cidade.CodPais AND
     Estado.CodEstado = Cidade.CodEstado
    JOIN Pais ON Pais.CodPais = Estado.CodPais
    WHERE HistLocalidade.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistLocalidade T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) AND
    HistQtdFunc.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistQtdFunc T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) AND
    HistGrupoEmp.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistGrupoEmp T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) AND
    HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistSegAreAtu T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) AND
    HistFatura.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistFatura T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) AND
    HistClassi.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistClassi T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) `;
  if (where != null) query = query + ' AND ' + where;
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
  let query = 'SELECT MAX(CodEmpres) AS NovoId FROM Empresa';

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

const buscaProxIdContato = async () => {
  let query = 'SELECT MAX(CodContat) AS NovoId FROM ContatoEmp';

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

const buscaGrupoEmpresarial = async () => {
  let query = `SELECT CodGrpEmp, NomGrpEmp FROM GrupoEmp`;
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

const buscaPais = async () => {
  let query = `SELECT CodPais, NomPais FROM Pais`;
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
  let query = `SELECT CodPais, CodEstado, NomEstado FROM Estado`;
  if (where != null) query = query + ' WHERE CodPais=' + where;
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

const buscaCidade = async (where1, where2) => {
  let query = `SELECT CodPais, CodEstado, CodCidade, NomCidade FROM Cidade`;
  if (where1 != null && where2 != null)
    query = query + ' WHERE CodPais=' + where1 + 'AND CodEstado=' + where2;
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

const buscaSegmento = async () => {
  let query = `SELECT CodSegmen, DesSegmen FROM Segmento`;
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

const buscaAreaAtuacao = async where => {
  let query = `SELECT CodSegmen, CodAreAtu, NomAreAtu FROM AreaAtuacao`;
  if (where != null) query = query + ' WHERE CodSegmen =' + where;
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

const buscaClassificacao = async () => {
  let query = `SELECT CodClassi, DesClassi FROM Classificacao`;
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

const buscaQtdFuncionario = async () => {
  let query = `SELECT CodQtdFun, DesQtdFun FROM QtdFuncionario`;
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

const buscaFaturamento = async () => {
  let query = `SELECT CodFatura, DesFatura FROM Faturamento`;
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

const buscaCargo = async () => {
  let query = `SELECT CodCargo, DesCargo FROM Cargo`;
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

const buscaContatoEmp = async where => {
  let query = `SELECT CodEmpres, CodContat, NomContat, EmaContat, TelContat, CodCarCnt, DesCargo
  FROM ContatoEmp JOIN Cargo ON Cargo.CodCargo = ContatoEmp.CodCarCnt`;
  if (where != null) query = query + ' AND ' + where;
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

const incluiEmpresa = async (
  CodGrpEmp,
  NomEmpres,
  CodPais,
  CodEstado,
  CodCidade,
  Telefone,
  CodClassi,
  CodFatura,
  CodSegmen,
  CodAreAtu,
  CodQtdFun,
  CodCNPJ,
  AnoFundac,
  TipEmpres,
  Matriz,
  NomRespon,
  CodCargo,
  EmaRespon,
  TelRespon
) => {
  var tempoSegundos = Math.round(new Date() / 1000);
  const ultimoId = await buscaProxId();
  let proxId = 1;
  if (ultimoId.registros[0].NovoId !== 'NULL')
    proxId = ultimoId.registros[0].NovoId + 1;
  const existeEmpresa = await buscaReferenciaEmpresa(NomEmpres);
  let query = `INSERT INTO Empresa 
  (CodEmpres, NomEmpres, Telefone, CodCNPJ, AnoFundac, TipEmpres,
   Matriz, NomRespon, EmaRespon, TelRespon, CodCarRes)
  VALUES (${proxId}, '${NomEmpres}', ${Telefone}, ${CodCNPJ},
   ${AnoFundac}, '${TipEmpres}', ${Matriz}, '${NomRespon}',
   '${EmaRespon}', ${TelRespon}, ${CodCargo})
  
  INSERT INTO HistLocalidade 
  (CodEmpres, DataAlter, HoraAlter, CodPais, CodEstado, CodCidade)
  VALUES 
  (${proxId}, GETDATE(), ${tempoSegundos}, ${CodPais}, ${CodEstado},
   ${CodCidade})
   
  INSERT INTO HistQtdFunc 
  (CodEmpres, DataAlter, HoraAlter, CodQtdFun)
  VALUES (${proxId}, GETDATE(),${tempoSegundos}, ${CodQtdFun})  
  
  INSERT INTO HistClassi 
  (CodEmpres, DataAlter, HoraAlter, CodClassi)
  VALUES (${proxId}, GETDATE(), ${tempoSegundos}, ${CodClassi})
  
  INSERT INTO HistFatura 
  (CodEmpres, DataAlter, HoraAlter, CodFatura)
  VALUES (${proxId}, GETDATE(), ${tempoSegundos}, ${CodFatura})

  INSERT INTO HistSegAreAtu 
  (CodEmpres, DataAlter, HoraAlter, CodSegmen, CodAreAtu)
  VALUES (${proxId}, GETDATE(), ${tempoSegundos}, ${CodSegmen}, ${CodAreAtu})

  INSERT INTO HistGrupoEmp
  (CodEmpres, DataAlter, HoraAlter, CodGrpEmp)
  VALUES (${proxId}, GETDATE(), ${tempoSegundos}, ${CodGrpEmp})
`;
  if (existeEmpresa.registros[0] === undefined) {
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
  } else return false;
};

const incluiContato = async (
  CodEmpres,
  NomContat,
  CodCarCnt,
  EmaContat,
  TelContat
) => {
  const ultimoId = await buscaProxIdContato();
  let proxId = 1;
  if (ultimoId.registros[0].NovoId !== 'NULL')
    proxId = ultimoId.registros[0].NovoId + 1;
  let query = `INSERT INTO ContatoEmp 
  (CodEmpres, CodContat, NomContat, EmaContat, TelContat, CodCarCnt)
  VALUES (${CodEmpres}, ${proxId}, '${NomContat}', '${EmaContat}',
   '${TelContat}', ${CodCarCnt})`;

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

const alteraEmpresa = (
  CodEmpres,
  CodGrpEmp,
  NomEmpres,
  CodPais,
  CodEstado,
  CodCidade,
  Telefone,
  CodClassi,
  CodFatura,
  CodSegmen,
  CodAreAtu,
  CodQtdFun,
  CodCNPJ,
  AnoFundac,
  TipEmpres,
  Matriz,
  NomRespon,
  CodCargo,
  EmaRespon,
  TelRespon
) => {
  if (Matriz == false) Matriz = 0;
  if (Matriz == true) Matriz = 1;
  var tempoSegundos = Math.round(new Date() / 1000);
  let query = `UPDATE Empresa 
  SET
	NomEmpres = '${NomEmpres}',
	Telefone = ${Telefone},
	CodCNPJ = ${CodCNPJ},
	AnoFundac = ${AnoFundac},
	TipEmpres = '${TipEmpres}',
	Matriz = ${Matriz},
	NomRespon = '${NomRespon}',
	EmaRespon = '${EmaRespon}',
	TelRespon = ${TelRespon},
	CodCarRes = ${CodCargo}
  WHERE CodEmpres = ${CodEmpres}
  
  INSERT INTO HistLocalidade 
  (CodEmpres, DataAlter, HoraAlter, CodPais, CodEstado, CodCidade)
  VALUES 
  (${CodEmpres}, GETDATE(), ${tempoSegundos}, ${CodPais}, ${CodEstado},
   ${CodCidade})
   
  INSERT INTO HistQtdFunc 
  (CodEmpres, DataAlter, HoraAlter, CodQtdFun)
  VALUES (${CodEmpres}, GETDATE(),${tempoSegundos}, ${CodQtdFun})  
  
  INSERT INTO HistClassi 
  (CodEmpres, DataAlter, HoraAlter, CodClassi)
  VALUES (${CodEmpres}, GETDATE(), ${tempoSegundos}, ${CodClassi})
  
  INSERT INTO HistFatura 
  (CodEmpres, DataAlter, HoraAlter, CodFatura)
  VALUES (${CodEmpres}, GETDATE(), ${tempoSegundos}, ${CodFatura})

  INSERT INTO HistSegAreAtu 
  (CodEmpres, DataAlter, HoraAlter, CodSegmen, CodAreAtu)
  VALUES (${CodEmpres}, GETDATE(), ${tempoSegundos}, ${CodSegmen}, ${CodAreAtu})

  INSERT INTO HistGrupoEmp
  (CodEmpres, DataAlter, HoraAlter, CodGrpEmp)
  VALUES (${CodEmpres}, GETDATE(), ${tempoSegundos}, ${CodGrpEmp})`;
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

const excluiEmpresa = async where => {
  let pesquisaReferencia = `CodEmpres = ${where}`;
  const existeReferenciaProEmpAux = await buscaReferenciaProEmpAux(
    pesquisaReferencia
  );
  const existeReferenciaProcEmp = await buscaReferenciaProcEmp(
    pesquisaReferencia
  );
  if (
    existeReferenciaProEmpAux.registros[0] !== undefined ||
    existeReferenciaProcEmp.registros[0] !== undefined
  ) {
    return false;
  } else {
    let query = `
  DELETE FROM HistLocalidade 
  WHERE CodEmpres = ${where} 
  
  DELETE FROM HistQtdFunc 
  WHERE CodEmpres = ${where} 
  
  DELETE FROM HistClassi 
  WHERE CodEmpres = ${where} 
  
  DELETE FROM HistFatura 
  WHERE CodEmpres = ${where} 

  DELETE FROM HistSegAreAtu 
  WHERE CodEmpres = ${where} 

  DELETE FROM HistGrupoEmp
  WHERE CodEmpres = ${where} 

  DELETE FROM Empresa 
  WHERE CodEmpres = ${where} 
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
  }
};

const excluiContato = async (CodEmpres, CodContat) => {
  let query = `
  DELETE FROM ContatoEmp 
  WHERE CodEmpres = ${CodEmpres} AND CodContat = ${CodContat}
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
};

const excluiEmpresaTotal = async where => {
  let pesquisaReferencia = `CodEmpres = ${where}`;
  const existeReferenciaProEmpAux = await buscaReferenciaProEmpAux(
    pesquisaReferencia
  );
  const existeReferenciaProcEmp = await buscaReferenciaProcEmp(
    pesquisaReferencia
  );
  if (
    existeReferenciaProEmpAux.registros[0] !== undefined ||
    existeReferenciaProcEmp.registros[0] !== undefined
  ) {
    return false;
  } else {
    let query = `
  DELETE FROM HistLocalidade 
  WHERE CodEmpres = ${where} 
  
  DELETE FROM HistQtdFunc 
  WHERE CodEmpres = ${where} 
  
  DELETE FROM HistClassi 
  WHERE CodEmpres = ${where} 
  
  DELETE FROM HistFatura 
  WHERE CodEmpres = ${where} 

  DELETE FROM HistSegAreAtu 
  WHERE CodEmpres = ${where} 

  DELETE FROM HistGrupoEmp
  WHERE CodEmpres = ${where} 

  DELETE FROM ProEmPAux
  WHERE CodEmpres = ${where} 

  DELETE FROM ProcessoEmp
  WHERE CodEmpres = ${where} 
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
  }
};

export {
  buscaEmpresa,
  incluiEmpresa,
  alteraEmpresa,
  excluiEmpresa,
  buscaProxId,
  buscaCadEmpresa,
  buscaGrupoEmpresarial,
  buscaPais,
  buscaEstado,
  buscaCidade,
  buscaSegmento,
  buscaAreaAtuacao,
  buscaClassificacao,
  buscaQtdFuncionario,
  buscaFaturamento,
  buscaCargo,
  buscaContatoEmp,
  buscaReferenciaEmpresa,
  incluiContato,
  buscaReferenciaProEmpAux,
  buscaReferenciaProcEmp,
  excluiEmpresaTotal,
  excluiContato
};
