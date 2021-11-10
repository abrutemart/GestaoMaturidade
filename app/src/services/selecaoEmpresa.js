import Axios from 'axios';

const buscaEmpresa = async (where) => {
  let query = `SELECT Empresa.CodEmpres, GrupoEmp.CodGrpEmp,
  GrupoEmp.NomGrpEmp, Empresa.NomEmpres, Empresa.TipEmpres, Segmento.CodSegmen, Segmento.DesSegmen,
  AreaAtuacao.NomAreAtu, Classificacao.DesClassi, Faturamento.DesFatura, Empresa.Telefone,
  Empresa.CodCNPJ, Empresa.Matriz, QtdFuncionario.DesQtdFun,  
  Empresa.NomRespon, Empresa.EmaRespon, Empresa.TelRespon,
  Cargo.DesCargo, Pais.NomPais, Estado.NomEstado, Cidade.NomCidade,
  Empresa.AnoFundac FROM EMPRESA 
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
  ) 
`;
  if (where != null)
    query = query + ' AND ' + where;    
  const result = await Axios.get(process.env.REACT_APP_SRV_PROXY+process.env.REACT_APP_PORTA + '/api/get', { params: { query }})
  .then((response) => {
    return response.data;  
  })
  .catch((error) => {
    console.log('Erro na consulta no banco de dados:', error)
  })  
  return result;}

export { buscaEmpresa }