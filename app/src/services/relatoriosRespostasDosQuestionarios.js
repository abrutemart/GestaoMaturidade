import Axios from 'axios';

const buscaNotaProcesso = async (CodEmpres, CodProces, Versao, CodSegmen) => {
  let query = `
  SELECT
 SUM (ProcessoEmp.Nota) AS Nota
  from PergSegPro
  left join Processo ON Processo.CodProces = PergSegPro.CodProces
  LEFT JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
  left join HistPergunta on HistPergunta.CodPergun = PergSegPro.CodPergun
  left join Assunto on Assunto.CodAssunt = HistPergunta.CodAssunt
  left join RespostaGrupo on RespostaGrupo.CodGrupo = HistPergunta.CodGrpRes
  left join HistResposta on HistResposta.CodRespos = RespostaGrupo.CodRespos
  left join Resposta on Resposta.CodRespos = RespostaGrupo.CodRespos
  left join GrpResposta on GrpResposta.CodGrpRes = RespostaGrupo.CodGrupo
  left join HistGrpRes on HistGrpRes.CodGrpRes = GrpResposta.CodGrpRes
  left join ProEmpAux on ProEmpAux.CodProces = PergSegPro.CodProces
  left join ProcessoEmp on ProcessoEmp.codempres = ProEmpAux.CodEmpres  AND 
  ProcessoEmp.HoraAlter = ( select max(t1.HoraAlter) from ProcessoEmp t1 where 
  ProcessoEmp.CodEmpres = t1.CodEmpres AND ProcessoEmp.CodProces = t1.CodProces 
  AND ProcessoEmp.CodPergun = t1.CodPergun AND ProcessoEmp.CodGrpRes = t1.CodGrpRes 
  AND ProcessoEmp.CodRespos = t1.CodRespos AND ProcessoEmp.Versao = t1.Versao)
  and ProcessoEmp.CodProces = Processo.CodProces
  and ProcessoEmp.CodPergun = HistPergunta.CodPergun
  and ProcessoEmp.CodGrpRes = RespostaGrupo.CodGrupo
  and ProcessoEmp.CodRespos = HistResposta.CodRespos
  and ProcessoEmp.Versao = ProEmpAux.Versao
  where HistResposta.HoraAlter = 
  ( select max(t1.HoraAlter) from HistResposta t1 where HistResposta.CodRespos = t1.CodRespos) 
  and HistGrpRes.HoraAlter = ( select max(t1.HoraAlter) from HistGrpRes t1 
  where HistGrpRes.CodGrpRes = t1.CodGrpRes)
  AND HistPergunta.HoraAlter = ( select max(t1.HoraAlter) from HistPergunta t1 
  where HistPergunta.CodPergun = t1.CodPergun AND HistPergunta.CodAssunt = t1.CodAssunt AND 
  HistPergunta.CodCatego = t1.CodCatego AND HistPergunta.CodGrpRes = t1.CodGrpRes)
  AND PergSegPro.HoraAlter = ( select max(t1.HoraAlter) from PergSegPro t1 
  where PergSegPro.CodSegmen = t1.CodSegmen AND PergSegPro.CodProces = t1.CodProces
   AND PergSegPro.CodPergun = t1.CodPergun)
  AND RespostaGrupo.HoraAlter = ( select max(t1.HoraAlter) from RespostaGrupo t1 
  where RespostaGrupo.CodGrupo = t1.CodGrupo AND RespostaGrupo.CodRespos = t1.CodRespos)
  and ProEmpAux.CodEmpres = ${CodEmpres}
  AND ProEmpAux.CodProces = ${CodProces}
  AND ProEmpAux.Versao=${Versao}
  AND PergSegPro.CodSegmen = ${CodSegmen}
  `;
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

const buscaNotaAvgProcesso = async (CodProces, CodSegmen) => {
  let query = `
  SELECT
 AVG(ProcessoEmp.Nota) AS Nota,
 COUNT(DISTINCT ProEmpAux.CodEmpres) AS QtdEmpresa
  from PergSegPro
  left join Processo ON Processo.CodProces = PergSegPro.CodProces
  LEFT JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
  left join HistPergunta on HistPergunta.CodPergun = PergSegPro.CodPergun
  left join Assunto on Assunto.CodAssunt = HistPergunta.CodAssunt
  left join RespostaGrupo on RespostaGrupo.CodGrupo = HistPergunta.CodGrpRes
  left join HistResposta on HistResposta.CodRespos = RespostaGrupo.CodRespos
  left join Resposta on Resposta.CodRespos = RespostaGrupo.CodRespos
  left join GrpResposta on GrpResposta.CodGrpRes = RespostaGrupo.CodGrupo
  left join HistGrpRes on HistGrpRes.CodGrpRes = GrpResposta.CodGrpRes
  left join ProEmpAux on ProEmpAux.CodProces = PergSegPro.CodProces
  left join ProcessoEmp on ProcessoEmp.CodEmpres = ProEmpAux.CodEmpres  AND 
  ProcessoEmp.HoraAlter = ( select max(t1.HoraAlter) from ProcessoEmp t1 where 
  ProcessoEmp.CodEmpres = t1.CodEmpres AND ProcessoEmp.CodProces = t1.CodProces 
  AND ProcessoEmp.CodPergun = t1.CodPergun AND ProcessoEmp.CodGrpRes = t1.CodGrpRes 
  AND ProcessoEmp.CodRespos = t1.CodRespos AND ProcessoEmp.Versao = t1.Versao)
  and ProcessoEmp.CodProces = Processo.CodProces
  and ProcessoEmp.CodPergun = HistPergunta.CodPergun
  and ProcessoEmp.CodGrpRes = RespostaGrupo.CodGrupo
  and ProcessoEmp.CodRespos = HistResposta.CodRespos
  and ProcessoEmp.Versao = ProEmpAux.Versao
  LEFT JOIN Segmento ON Segmento.CodSegmen = PergSegPro.CodSegmen
  LEFT JOIN CfgNivEsp ON CfgNivEsp.CodSegmen = Segmento.CodSegmen
  where HistResposta.HoraAlter = 
  ( select max(t1.HoraAlter) from HistResposta t1 where HistResposta.CodRespos = t1.CodRespos) 
  and HistGrpRes.HoraAlter = ( select max(t1.HoraAlter) from HistGrpRes t1 
  where HistGrpRes.CodGrpRes = t1.CodGrpRes)
  AND HistPergunta.HoraAlter = ( select max(t1.HoraAlter) from HistPergunta t1 
  where HistPergunta.CodPergun = t1.CodPergun AND HistPergunta.CodAssunt = t1.CodAssunt AND 
  HistPergunta.CodCatego = t1.CodCatego AND HistPergunta.CodGrpRes = t1.CodGrpRes)
  AND PergSegPro.HoraAlter = ( select max(t1.HoraAlter) from PergSegPro t1 
  where PergSegPro.CodSegmen = t1.CodSegmen AND PergSegPro.CodProces = t1.CodProces
   AND PergSegPro.CodPergun = t1.CodPergun)
  AND RespostaGrupo.HoraAlter = ( select max(t1.HoraAlter) from RespostaGrupo t1 
  where RespostaGrupo.CodGrupo = t1.CodGrupo AND RespostaGrupo.CodRespos = t1.CodRespos)  
  AND ProEmpAux.CodProces = ${CodProces}
  AND PergSegPro.CodSegmen = ${CodSegmen}
  AND ProcessoEmp.Nota > 0
  `;
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

const buscaNotaMaxProcesso = async (CodProces, CodSegmen) => {
  let query = `
  SELECT
 MAX(ProcessoEmp.Nota) AS Nota
  from PergSegPro
  left join Processo ON Processo.CodProces = PergSegPro.CodProces
  LEFT JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
  left join HistPergunta on HistPergunta.CodPergun = PergSegPro.CodPergun
  left join Assunto on Assunto.CodAssunt = HistPergunta.CodAssunt
  left join RespostaGrupo on RespostaGrupo.CodGrupo = HistPergunta.CodGrpRes
  left join HistResposta on HistResposta.CodRespos = RespostaGrupo.CodRespos
  left join Resposta on Resposta.CodRespos = RespostaGrupo.CodRespos
  left join GrpResposta on GrpResposta.CodGrpRes = RespostaGrupo.CodGrupo
  left join HistGrpRes on HistGrpRes.CodGrpRes = GrpResposta.CodGrpRes
  left join ProEmpAux on ProEmpAux.CodProces = PergSegPro.CodProces
  left join ProcessoEmp on ProcessoEmp.codempres = ProEmpAux.CodEmpres  AND 
  ProcessoEmp.HoraAlter = ( select max(t1.HoraAlter) from ProcessoEmp t1 where 
  ProcessoEmp.CodEmpres = t1.CodEmpres AND ProcessoEmp.CodProces = t1.CodProces 
  AND ProcessoEmp.CodPergun = t1.CodPergun AND ProcessoEmp.CodGrpRes = t1.CodGrpRes 
  AND ProcessoEmp.CodRespos = t1.CodRespos AND ProcessoEmp.Versao = t1.Versao)
  and ProcessoEmp.CodProces = Processo.CodProces
  and ProcessoEmp.CodPergun = HistPergunta.CodPergun
  and ProcessoEmp.CodGrpRes = RespostaGrupo.CodGrupo
  and ProcessoEmp.CodRespos = HistResposta.CodRespos
  and ProcessoEmp.Versao = ProEmpAux.Versao
  where HistResposta.HoraAlter = 
  ( select max(t1.HoraAlter) from HistResposta t1 where HistResposta.CodRespos = t1.CodRespos) 
  and HistGrpRes.HoraAlter = ( select max(t1.HoraAlter) from HistGrpRes t1 
  where HistGrpRes.CodGrpRes = t1.CodGrpRes)
  AND HistPergunta.HoraAlter = ( select max(t1.HoraAlter) from HistPergunta t1 
  where HistPergunta.CodPergun = t1.CodPergun AND HistPergunta.CodAssunt = t1.CodAssunt AND 
  HistPergunta.CodCatego = t1.CodCatego AND HistPergunta.CodGrpRes = t1.CodGrpRes)
  AND PergSegPro.HoraAlter = ( select max(t1.HoraAlter) from PergSegPro t1 
  where PergSegPro.CodSegmen = t1.CodSegmen AND PergSegPro.CodProces = t1.CodProces
   AND PergSegPro.CodPergun = t1.CodPergun)
  AND RespostaGrupo.HoraAlter = ( select max(t1.HoraAlter) from RespostaGrupo t1 
  where RespostaGrupo.CodGrupo = t1.CodGrupo AND RespostaGrupo.CodRespos = t1.CodRespos)  
  AND ProEmpAux.CodProces = ${CodProces}
  AND PergSegPro.CodSegmen = ${CodSegmen}
  AND ProcessoEmp.Nota > 0
  `;
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

const buscaProximoProcesso = async (
  CodEmpres,
  Versao,
  CodSegmen,
  DesProces
) => {
  let query = `
  select First_CodProces,First_DesProces, DesProces, Next_CodProces, Next_DesProces
  from (
      select Processo.CodProces,
             FIRST_VALUE(Processo.DesProces) OVER (
            ORDER BY Processo.DesProces ASC
        ) AS  First_DesProces ,
        FIRST_VALUE(Processo.CodProces) OVER (
            ORDER BY Processo.DesProces ASC
        ) AS  First_CodProces ,
             DesProces,
             lead(Processo.CodProces) over (ORDER BY Processo.DesProces ASC) as Next_CodProces,
             lead(Processo.DesProces) over (ORDER BY Processo.DesProces ASC) as Next_DesProces
    FROM Empresa
    JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
    JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
    JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
    JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
    JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
    JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
    JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
    JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
    JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
    JOIN GrpResposta ON GrpResposta.CodGrpRes = HistPergunta.CodGrpRes
    JOIN RespostaGrupo ON RespostaGrupo.CodGrupo = GrpResposta.CodGrpRes
    JOIN Resposta ON Resposta.CodRespos = RespostaGrupo.CodRespos
    JOIN HistResposta ON HistResposta.CodRespos = Resposta.CodRespos
    LEFT JOIN ProcessoEmp ON ProcessoEmp.CodEmpres = Empresa.CodEmpres AND
     ProcessoEmp.CodProces = Processo.CodProces AND ProcessoEmp.Versao = ProEmpAux.Versao
    WHERE  ProEmpAux.CodEmpres=${CodEmpres}
    AND ProEmpAux.Versao=${Versao}
    AND PergSegPro.CodSegmen = ${CodSegmen}
    AND
    HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistSegAreAtu T2
         WHERE CodEmpres=T2.CodEmpres
         GROUP BY CodEmpres
      ) 
      AND
      SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM SegmenProces T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
      PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM PergSegPro T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
    HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistPergunta T2
         WHERE CodPergun=T2.CodPergun
         GROUP BY CodPergun
      ) 
      AND
      HistResposta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistResposta T2
         WHERE CodRespos=T2.CodRespos
         GROUP BY CodRespos
      ) AND EXISTS (SELECT * FROM ProEmpAux 
    WHERE ProEmpAux.CodEmpres = Empresa.CodEmpres AND
    ProEmpAux.CodProces=Processo.CodProces AND ProEmpAux.Versao =${Versao})
      GROUP BY Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen, 
    SegmenProces.CodProces, Processo.DesProces, Processo.CodProces
) as t
where DesProces = '${DesProces}';
  `;
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

const buscaProcessoPorEmpresa = async (CodEmpres, Versao, CodSegmen) => {
  let query = `
  SELECT
    Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen, 
    SegmenProces.CodProces, Processo.DesProces, 
    COUNT(DISTINCT ProcessoEmp.CodPergun) AS QtdRespondida,
    COUNT(DISTINCT PergSegPro.CodPergun) AS TotalPergunta,
    COUNT (DISTINCT ProcessoEmp.DataFinal)  AS ProcessoFinalizado
    FROM Empresa
    JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
    JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
    JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
    JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
    JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
    JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
    JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
    JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
    JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
    JOIN GrpResposta ON GrpResposta.CodGrpRes = HistPergunta.CodGrpRes
    JOIN RespostaGrupo ON RespostaGrupo.CodGrupo = GrpResposta.CodGrpRes
    JOIN Resposta ON Resposta.CodRespos = RespostaGrupo.CodRespos
    JOIN HistResposta ON HistResposta.CodRespos = Resposta.CodRespos
    LEFT JOIN ProcessoEmp ON ProcessoEmp.CodEmpres = Empresa.CodEmpres AND
     ProcessoEmp.CodProces = Processo.CodProces AND ProcessoEmp.Versao = ProEmpAux.Versao
    WHERE  ProEmpAux.CodEmpres=${CodEmpres}
    AND ProEmpAux.Versao=${Versao}
    AND PergSegPro.CodSegmen = ${CodSegmen}
    AND
    HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistSegAreAtu T2
         WHERE CodEmpres=T2.CodEmpres
         GROUP BY CodEmpres
      ) 
      AND
      SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM SegmenProces T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
      PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM PergSegPro T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
    HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistPergunta T2
         WHERE CodPergun=T2.CodPergun
         GROUP BY CodPergun
      ) 
      AND
      HistResposta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistResposta T2
         WHERE CodRespos=T2.CodRespos
         GROUP BY CodRespos
      ) AND EXISTS (SELECT * FROM ProEmpAux 
    WHERE ProEmpAux.CodEmpres = Empresa.CodEmpres AND
    ProEmpAux.CodProces=Processo.CodProces AND ProEmpAux.Versao =${Versao})
      GROUP BY Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen, 
    SegmenProces.CodProces, Processo.DesProces
    ORDER BY Processo.DesProces ASC
  `;
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

const buscaProcessoPorEmpresaDel = async (CodEmpres, Versao, CodSegmen) => {
  let query = `SELECT DISTINCT 
  Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen, 
  SegmenProces.CodProces, Processo.DesProces
  FROM Empresa
  LEFT JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
  LEFT JOIN Segmento ON Segmento.CodSegmen=HistSegAreAtu.CodSegmen
  LEFT JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
  LEFT JOIN Processo ON SegmenProces.CodProces = Processo.CodProces
  LEFT JOIN PerguntaProcesso ON PerguntaProcesso.CodProces = Processo.CodProces
  WHERE PerguntaProcesso.CodPergun IS NOT NULL AND  Empresa.CodEmpres=${CodEmpres} AND
    Segmento.CodSegmen = ${CodSegmen} AND 
  HistSegAreAtu.HoraAlter = ( select max(t1.HoraAlter) from HistSegAreAtu t1 where 
  HistSegAreAtu.CodEmpres = t1.CodEmpres AND HistSegAreAtu.CodSegmen = t1.CodSegmen 
  AND HistSegAreAtu.CodAreAtu = t1.CodAreAtu)
  
  AND SegmenProces.HoraAlter = ( select max(t1.HoraAlter) from SegmenProces t1 where 
  SegmenProces.CodSegmen = t1.CodSegmen AND SegmenProces.CodProces = t1.CodProces)
  
  AND PerguntaProcesso.HoraAlter = ( select max(t1.HoraAlter) from PerguntaProcesso t1 WHERE
   PerguntaProcesso.CodProces = t1.CodProces AND PerguntaProcesso.CodPergun= t1.CodPergun)
  
  AND NOT EXISTS (SELECT * FROM ProEmpAux 
  WHERE ProEmpAux.CodEmpres = Empresa.CodEmpres AND
  ProEmpAux.CodProces=Processo.CodProces AND ProEmpAux.Versao =${Versao})
  ORDER BY Processo.DesProces ASC`;
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

const buscaProcessosFinalizados = async (CodEmpres, Versao) => {
  let query = `SELECT
  ProcessoEmp.CodEmpres,
  (SELECT COUNT(CodProces) FROM
  ProEmpAux
  WHERE  ProEmpAux.CodEmpres= ${CodEmpres}
  AND ProEmpAux.Versao=${Versao}) AS QtdProcessos,
   (SELECT COUNT(DISTINCT CodProces) FROM
  ProcessoEmp
  WHERE  ProcessoEmp.CodEmpres=${CodEmpres}
  AND ProcessoEmp.Versao=${Versao}
  AND ProcessoEmp.DataFinal IS NOT NULL)  AS ProcessoFinalizado
  FROM ProcessoEmp
  LEFT JOIN ProEmpAux ON ProEmpAux.CodEmpres = ProcessoEmp.CodEmpres
  AND ProEmpAux.CodProces = ProcessoEmp.CodProces
  AND ProEmpAux.Versao = ProcessoEmp.Versao
  WHERE  ProcessoEmp.CodEmpres=${CodEmpres}
  AND ProcessoEmp.Versao=${Versao}
  GROUP BY ProcessoEmp.CodEmpres
  `;
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

const buscaVersaoDiagnostico = async CodEmpres => {
  let query = `SELECT DISTINCT(Versao), DataFinal
  FROM ProEmpAux WHERE CodEmpres=${CodEmpres} AND DataFinal IS NOT NULL`;
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

const buscaProcessos = async (CodEmpres, Versao, CodSegmen) => {
  let query = `
  SELECT DISTINCT
Empresa.CodEmpres,
Empresa.NomEmpres,
ProcessoEmp.DataFinal,    
    ProEmpAux.CodProces,
    Processo.DesProces    
    FROM Empresa
    JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
    JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
    JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
    JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
    JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
    JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
    JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
    JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
    JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
    JOIN ProcessoEmp ON ProcessoEmp.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=ProcessoEmp.CodProces AND ProcessoEmp.CodProces=Processo.CodProces
    WHERE    
    ProEmpAux.CodEmpres=${CodEmpres}    
    AND ProEmpAux.Versao=${Versao}
    AND PergSegPro.CodSegmen = ${CodSegmen}
    AND
    HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistSegAreAtu T2
         WHERE CodEmpres=T2.CodEmpres
         GROUP BY CodEmpres
      ) 
      AND
      SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM SegmenProces T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
      PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM PergSegPro T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
    HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistPergunta T2
         WHERE CodPergun=T2.CodPergun
         GROUP BY CodPergun
      )        AND
    ProcessoEmp.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM ProcessoEmp T2
         WHERE CodEmpres=T2.CodEmpres AND Versao = ${Versao}
         GROUP BY CodEmpres, CodProces
      ) 
      ORDER BY Processo.DesProces   
     `;
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

const buscaAssunto = async (CodEmpres, Versao, CodSegmen) => {
  let query = `
  SELECT DISTINCT
Empresa.CodEmpres,
Empresa.NomEmpres,    
    ProEmpAux.CodProces,
    Processo.DesProces,
    Assunto.CodAssunt, 
    Assunto.DesAssunt
    FROM Empresa
    JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
    JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
    JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
    JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
    JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
    JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
    JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
    JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
    JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
    WHERE  
    ProEmpAux.CodEmpres=${CodEmpres}    
    AND ProEmpAux.Versao=${Versao}
    AND PergSegPro.CodSegmen = ${CodSegmen}
    AND
    HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistSegAreAtu T2
         WHERE CodEmpres=T2.CodEmpres
         GROUP BY CodEmpres
      ) 
      AND
      SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM SegmenProces T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
      PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM PergSegPro T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
    HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistPergunta T2
         WHERE CodPergun=T2.CodPergun
         GROUP BY CodPergun
      )
      ORDER BY Assunto.DesAssunt    
     `;
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

const buscaPergunta = async (CodEmpres, Versao, CodSegmen) => {
  let query = `
  SELECT DISTINCT
Empresa.CodEmpres,
Empresa.NomEmpres,    
    ProEmpAux.CodProces,
    Processo.DesProces,
    Assunto.CodAssunt, 
    Assunto.DesAssunt,
  Pergunta.CodPergun,
  Pergunta.DesPergun
  FROM Empresa
  JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
  JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
  JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
  JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
  JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
  JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
  JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
  JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
  JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
  WHERE  
  ProEmpAux.CodEmpres=${CodEmpres}  
  AND ProEmpAux.Versao=${Versao}
  AND PergSegPro.CodSegmen = ${CodSegmen}
  AND
  HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistSegAreAtu T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) 
    AND
    SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM SegmenProces T2
       WHERE CodSegmen=T2.CodSegmen
       GROUP BY CodSegmen, CodProces
    )
    AND
    PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM PergSegPro T2
       WHERE CodSegmen=T2.CodSegmen
       GROUP BY CodSegmen, CodProces
    )
    AND
  HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistPergunta T2
       WHERE CodPergun=T2.CodPergun
       GROUP BY CodPergun
    )
  
  
`;
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

const buscaResposta = async (CodEmpres, Versao, CodSegmen) => {
  let query = `SELECT
  Empresa.CodEmpres,
 Empresa.NomEmpres,    
     ProEmpAux.CodProces,
     Processo.DesProces,
     Assunto.CodAssunt, 
     Assunto.DesAssunt,
   Pergunta.CodPergun,
   Pergunta.DesPergun,
   Resposta.CodRespos,
   Resposta.DesRespos,
   GrpResposta.CodGrpRes,
   GrpResposta.NomGrpRes,
   HistGrpRes.TipoRespo,
   HistResposta.Percentua,
   PergSegPro.Peso,
   ProcessoEmp.Nota
   from PergSegPro
   left join Processo ON Processo.CodProces = PergSegPro.CodProces
   LEFT JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
   left join HistPergunta on HistPergunta.CodPergun = PergSegPro.CodPergun
   left join Assunto on Assunto.CodAssunt = HistPergunta.CodAssunt
   left join RespostaGrupo on RespostaGrupo.CodGrupo = HistPergunta.CodGrpRes
   left join HistResposta on HistResposta.CodRespos = RespostaGrupo.CodRespos
   left join Resposta on Resposta.CodRespos = RespostaGrupo.CodRespos
   left join GrpResposta on GrpResposta.CodGrpRes = RespostaGrupo.CodGrupo
   left join HistGrpRes on HistGrpRes.CodGrpRes = GrpResposta.CodGrpRes
   left join ProEmpAux on ProEmpAux.CodProces = PergSegPro.CodProces
   LEFT JOIN Empresa ON Empresa.CodEmpres = ProEmpAux.CodEmpres 
   left join ProcessoEmp on ProcessoEmp.codempres = ProEmpAux.CodEmpres  AND 
   ProcessoEmp.HoraAlter = ( select max(t1.HoraAlter) from ProcessoEmp t1 where 
   ProcessoEmp.CodEmpres = t1.CodEmpres AND ProcessoEmp.CodProces = t1.CodProces 
   AND ProcessoEmp.CodPergun = t1.CodPergun AND ProcessoEmp.CodGrpRes = t1.CodGrpRes 
   AND ProcessoEmp.CodRespos = t1.CodRespos AND ProcessoEmp.Versao = t1.Versao)
   and ProcessoEmp.CodProces = Processo.CodProces
   and ProcessoEmp.CodPergun = HistPergunta.CodPergun
   and ProcessoEmp.CodGrpRes = RespostaGrupo.CodGrupo
   and ProcessoEmp.CodRespos = HistResposta.CodRespos
   and ProcessoEmp.Versao = ProEmpAux.Versao
   AND Empresa.CodEmpres = ProcessoEmp.CodEmpres
   where HistResposta.HoraAlter = 
   ( select max(t1.HoraAlter) from HistResposta t1 where HistResposta.CodRespos = t1.CodRespos) 
   and HistGrpRes.HoraAlter = ( select max(t1.HoraAlter) from HistGrpRes t1 
   where HistGrpRes.CodGrpRes = t1.CodGrpRes)
   AND HistPergunta.HoraAlter = ( select max(t1.HoraAlter) from HistPergunta t1 
   where HistPergunta.CodPergun = t1.CodPergun AND HistPergunta.CodAssunt = t1.CodAssunt AND 
   HistPergunta.CodCatego = t1.CodCatego AND HistPergunta.CodGrpRes = t1.CodGrpRes)
   AND PergSegPro.HoraAlter = ( select max(t1.HoraAlter) from PergSegPro t1 
   where PergSegPro.CodSegmen = t1.CodSegmen AND PergSegPro.CodProces = t1.CodProces
    AND PergSegPro.CodPergun = t1.CodPergun)
   AND RespostaGrupo.HoraAlter = ( select max(t1.HoraAlter) from RespostaGrupo t1 
   where RespostaGrupo.CodGrupo = t1.CodGrupo AND RespostaGrupo.CodRespos = t1.CodRespos)
   and ProEmpAux.CodEmpres = ${CodEmpres}  
  AND ProEmpAux.Versao=${Versao}
  AND PergSegPro.CodSegmen = ${CodSegmen}  
  AND ProcessoEmp.Nota > 0
   `;
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

const buscaRisco = async (CodEmpres, CodProces, Versao, CodSegmen) => {
  let query = `SELECT 
  RiscoPergunta.CodRisco,
  Risco.DesRisco
  FROM Empresa
  JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
  JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
  JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
  JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
  JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
  JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
  JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
  JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
  JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
  JOIN RiscoPergunta ON RiscoPergunta.CodPergun = Pergunta.CodPergun AND RiscoPergunta.CodPergun = PergSegPro.CodPergun AND RiscoPergunta.CodPergun = HistPergunta.CodPergun 
  JOIN Risco ON Risco.CodRisco = RiscoPergunta.CodRisco
  WHERE  
  ProEmpAux.CodEmpres = ${CodEmpres}
  AND ProEmpAux.CodProces = ${CodProces}
  AND ProEmpAux.Versao=${Versao}
  AND PergSegPro.CodSegmen = ${CodSegmen}
  AND
  HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistSegAreAtu T2
       WHERE CodEmpres=T2.CodEmpres
       GROUP BY CodEmpres
    ) 
    AND
    SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM SegmenProces T2
       WHERE CodSegmen=T2.CodSegmen
       GROUP BY CodSegmen, CodProces
    )
    AND
    PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM PergSegPro T2
       WHERE CodSegmen=T2.CodSegmen
       GROUP BY CodSegmen, CodProces
    )
    AND
  HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM HistPergunta T2
       WHERE CodPergun=T2.CodPergun
       GROUP BY CodPergun
    )     
        AND
  RiscoPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
       FROM RiscoPergunta T2
       WHERE CodPergun=T2.CodPergun
       GROUP BY CodPergun, CodRisco
    )   
   `;
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

const buscaNomeEmpresa = async where => {
  let query = `SELECT * FROM Empresa`;
  query = query + ` WHERE CodEmpres='${where}'`;
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

const excluiProcesso = async (CodEmpres, CodProces, Versao) => {
  let query = `
  DELETE FROM ProEmpAux 
  WHERE CodEmpres = ${CodEmpres} AND 
  CodProces = ${CodProces} AND 
  Versao = ${Versao}`;
  let pesquisaProcesso = `CodEmpres = ${CodEmpres} AND CodProces = ${CodProces} AND Versao = ${Versao}`;
  const existeProcesso = await buscaProcessoEmp(pesquisaProcesso);
  if (existeProcesso.registros[0] === undefined) {
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

const restauraProcesso = async (CodEmpres, CodProces, Versao) => {
  let query = `
  INSERT INTO ProEmpAux 
  VALUES (${CodEmpres}, ${CodProces}, ${Versao}, null)`;
  let pesquisaProcesso = `CodEmpres = ${CodEmpres} AND CodProces = ${CodProces} AND Versao = ${Versao}`;
  const existeProcesso = await buscaProcessoEmp(pesquisaProcesso);
  if (existeProcesso.registros[0] === undefined) {
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

const buscaProcessosPorVersao = async CodSegmen => {
  let query = `SELECT DISTINCT Processo.CodProces FROM PergSegPro
  JOIN Processo ON Processo.CodProces = PergSegPro.CodProces
  WHERE PergSegPro.CodSegmen = ${CodSegmen}`;
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

const buscaProxVersao = async () => {
  let query = 'SELECT MAX(Versao) AS NovaVersao FROM ProEmpAux';
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

const buscaSegmento = async CodEmpres => {
  let query = `SELECT * FROM EMPRESA 
  JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
  JOIN Segmento ON HistSegAreAtu.CodSegmen = Segmento.CodSegmen
  WHERE EMPRESA.CodEmpres = ${CodEmpres} AND HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
  FROM HistSegAreAtu T2
  WHERE CodEmpres=T2.CodEmpres
  GROUP BY CodEmpres)`;
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

const buscaVersao = async (CodEmpres, CodProces, Versao) => {
  let query = `SELECT * FROM ProEmpAux   
  WHERE CodEmpres = ${CodEmpres} AND CodProces = ${CodProces} AND Versao = ${Versao} `;
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

const BuscaTotalRespondido = async (CodEmpres, Versao, CodSegmen) => {
  let query = `
  SELECT
    Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen,   
    COUNT(DISTINCT ProcessoEmp.CodPergun) AS QtdRespondida,
    COUNT(DISTINCT PergSegPro.CodPergun) AS TotalPergunta
    FROM Empresa
    JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
    JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
    JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
    JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
    JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
    JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
    JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
    JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
    JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
    JOIN GrpResposta ON GrpResposta.CodGrpRes = HistPergunta.CodGrpRes
    JOIN RespostaGrupo ON RespostaGrupo.CodGrupo = GrpResposta.CodGrpRes
    JOIN Resposta ON Resposta.CodRespos = RespostaGrupo.CodRespos
    JOIN HistResposta ON HistResposta.CodRespos = Resposta.CodRespos
    LEFT JOIN ProcessoEmp ON ProcessoEmp.CodEmpres = Empresa.CodEmpres AND
     ProcessoEmp.CodProces = Processo.CodProces AND ProcessoEmp.Versao = ProEmpAux.Versao
    WHERE  ProEmpAux.CodEmpres=${CodEmpres} 
    AND ProEmpAux.Versao=${Versao}
    AND PergSegPro.CodSegmen = ${CodSegmen}
    AND
    HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistSegAreAtu T2
         WHERE CodEmpres=T2.CodEmpres
         GROUP BY CodEmpres
      ) 
      AND
      SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM SegmenProces T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
      PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM PergSegPro T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
    HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistPergunta T2
         WHERE CodPergun=T2.CodPergun
         GROUP BY CodPergun
      ) 
      AND
      HistResposta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistResposta T2
         WHERE CodRespos=T2.CodRespos
         GROUP BY CodRespos
      ) AND EXISTS (SELECT * FROM ProEmpAux 
    WHERE ProEmpAux.CodEmpres = Empresa.CodEmpres AND
    ProEmpAux.CodProces=Processo.CodProces AND ProEmpAux.Versao =${Versao})
      GROUP BY Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen
  `;
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

const buscaParcialRespondido = async (
  CodEmpres,
  Versao,
  CodSegmen,
  CodProces
) => {
  let query = `
  SELECT
    Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen,   
    COUNT(DISTINCT ProcessoEmp.CodPergun) AS QtdRespondida,
    COUNT(DISTINCT PergSegPro.CodPergun) AS TotalPergunta
    FROM Empresa
    JOIN HistSegAreAtu ON HistSegAreAtu.CodEmpres = Empresa.CodEmpres
    JOIN Segmento ON Segmento.CodSegmen = HistSegAreAtu.CodSegmen
    JOIN SegmenProces ON SegmenProces.CodSegmen = Segmento.CodSegmen
    JOIN Processo ON Processo.CodProces = SegmenProces.CodProces
    JOIN PergSegPro ON PergSegPro.CodProces = Processo.CodProces
    JOIN Pergunta ON Pergunta.CodPergun = PergSegPro.CodPergun
    JOIN HistPergunta ON HistPergunta.CodPergun = Pergunta.CodPergun
    JOIN Assunto ON Assunto.CodAssunt = HistPergunta.CodAssunt
    JOIN ProEmpAux ON ProEmpAux.CodEmpres = Empresa.CodEmpres AND ProEmpAux.CodProces=Processo.CodProces
    JOIN GrpResposta ON GrpResposta.CodGrpRes = HistPergunta.CodGrpRes
    JOIN RespostaGrupo ON RespostaGrupo.CodGrupo = GrpResposta.CodGrpRes
    JOIN Resposta ON Resposta.CodRespos = RespostaGrupo.CodRespos
    JOIN HistResposta ON HistResposta.CodRespos = Resposta.CodRespos
    LEFT JOIN ProcessoEmp ON ProcessoEmp.CodEmpres = Empresa.CodEmpres AND
     ProcessoEmp.CodProces = Processo.CodProces AND ProcessoEmp.Versao = ProEmpAux.Versao
    WHERE  ProEmpAux.CodEmpres=${CodEmpres} 
    AND ProEmpAux.Versao=${Versao}
    AND Processo.CodProces=${CodProces}
    AND PergSegPro.CodSegmen = ${CodSegmen}
    AND
    HistSegAreAtu.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistSegAreAtu T2
         WHERE CodEmpres=T2.CodEmpres
         GROUP BY CodEmpres
      ) 
      AND
      SegmenProces.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM SegmenProces T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
      PergSegPro.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM PergSegPro T2
         WHERE CodSegmen=T2.CodSegmen
         GROUP BY CodSegmen, CodProces
      )
      AND
    HistPergunta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistPergunta T2
         WHERE CodPergun=T2.CodPergun
         GROUP BY CodPergun
      ) 
      AND
      HistResposta.HoraAlter IN (SELECT max(T2.HoraAlter)
         FROM HistResposta T2
         WHERE CodRespos=T2.CodRespos
         GROUP BY CodRespos
      ) AND EXISTS (SELECT * FROM ProEmpAux 
    WHERE ProEmpAux.CodEmpres = Empresa.CodEmpres AND
    ProEmpAux.CodProces=Processo.CodProces AND ProEmpAux.Versao =${Versao})
      GROUP BY Empresa.CodEmpres, Empresa.NomEmpres, HistSegAreAtu.CodSegmen
  `;
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

const emAndamento = async (CodEmpres, Codproces, Versao) => {
  let query = `SELECT * FROM ProcessoEmp
  WHERE CodEmpres =${CodEmpres} AND CodProces=${Codproces} AND Versao=${Versao}`;
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

const incluiRespostas = async (
  CodEmpres,
  CodProces,
  Versao,
  CodPergun,
  CodGrpRes,
  CodRespos1,
  CodRespos2,
  novaNota
) => {
  var tempoSegundos = Math.round(new Date() / 1000);
  let query = `INSERT INTO ProcessoEmp 
  VALUES (${CodEmpres}, ${CodProces}, ${CodPergun}, ${CodGrpRes}, ${CodRespos1}, 0, 
  GETDATE(), ${tempoSegundos}, ${Versao}, NULL)
  
  UPDATE dbo.ProcessoEmp
  SET  Nota = ${novaNota}
  WHERE CodEmpres = ${CodEmpres} AND CodProces = ${CodProces} AND Versao = ${Versao}
  AND CodPergun = ${CodPergun} AND HoraAlter = ${tempoSegundos} AND CodGrpRes = ${CodGrpRes}
  AND CodRespos = ${CodRespos2}`;
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

const incluiVersao = async (CodEmpres, CodProces, Versao, NovaVersao) => {
  const existeVersao = await buscaVersao(CodEmpres, CodProces, NovaVersao);
  var query
  if (existeVersao.registros[0] === undefined) {
    query = `
  UPDATE dbo.ProEmpAux
  SET DataFinal = GETDATE()
  WHERE CodEmpres = ${CodEmpres} AND CodProces = ${CodProces} AND Versao = ${Versao}
  
  INSERT INTO ProEmpAux 
  VALUES (${CodEmpres}, ${CodProces}, ${NovaVersao}, NULL)  
  `;
  } else {
    query = `
  UPDATE dbo.ProEmpAux
  SET DataFinal = GETDATE()
  WHERE CodEmpres = ${CodEmpres} AND CodProces = ${CodProces} AND Versao = ${Versao}
  `;
  }
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

const incluiDataResposta = async (CodEmpres, CodProces, Versao) => {
  let query = `
  UPDATE ProcessoEmp
  SET DataFinal = GETDATE()
  WHERE CodEmpres = ${CodEmpres} AND CodProces = ${CodProces} AND Versao = ${Versao} AND DataFinal IS NULL
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
};

export {
  buscaProcessoPorEmpresa,
  buscaProcessoPorEmpresaDel,
  buscaVersaoDiagnostico,
  buscaNomeEmpresa,
  excluiProcesso,
  restauraProcesso,
  buscaAssunto,
  buscaPergunta,
  buscaResposta,
  incluiRespostas,
  buscaSegmento,
  emAndamento,
  BuscaTotalRespondido,
  incluiVersao,
  buscaProxVersao,
  buscaProcessosPorVersao,
  buscaParcialRespondido,
  incluiDataResposta,
  buscaProcessosFinalizados,
  buscaNotaProcesso,
  buscaNotaAvgProcesso,
  buscaNotaMaxProcesso,
  buscaProximoProcesso,
  buscaRisco,
  buscaProcessos
};

