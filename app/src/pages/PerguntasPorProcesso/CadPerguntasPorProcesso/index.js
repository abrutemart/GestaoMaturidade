import React, { Fragment } from 'react';
import { useState, useEffect } from 'reactn';
import { Link, useHistory } from 'react-router-dom';
import { PageTitle } from '../../../layout-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { Delete, Edit } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { Add } from '@material-ui/icons';
import { Paper } from '@material-ui/core';

import {
  Grid,
  FormHelperText,
  Button,
  TextField,
  Card,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider
} from '@material-ui/core';

import {  
  alteraAssunto,
  alteraPergunta,
  alteraRisco,
  buscaProcesso,
  incluiPerguntaProcesso,
  buscaAssunto,
  buscaCategoriaDePerguntas,
  buscaGrupoDeRespostas,
  buscaPerguntaCategoriaGrpResposta,
  buscaRiscoPergunta,
  incluiAssunto,
  incluiRisco,
  excluiAssunto,
  excluiPergunta,
  excluiRisco,
  incluiAssuPergCategGrpResp
} from 'services/perguntasPorProcesso';

export default function CadSegmentos() {
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valor1, setValor1] = useState('');
  const [valor2, setValor2] = useState('');
  const [valor3, setValor3] = useState('');
  const [valor4, setValor4] = useState('');
  const [valor5, setValor5] = useState('');
  const [valor6, setValor6] = useState('');
  const [valor7, setValor7] = useState('');
  const [valor8, setValor8] = useState('');
  const [dados, setDados] = useState([]);
  const [transacaoIncluir, setTransacaoIncluir] = useState(true);
  const [plusNovo, setPlusNovo] = useState(false);
  const [selecao1, setSelecao1] = useState('');
  const [selecao2, setSelecao2] = useState('');
  const [selecao3, setSelecao3] = useState('');
  const [mensagem, setMensagem] = useState({
    titulo: '',
    conteudo: '',
    acao: ''
  });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openEscolha, setOpenEscolha] = useState(false);
  const [openEscolhaPergunta, setOpenEscolhaPergunta] = useState(false);
  const [openEscolhaAssunto, setOpenEscolhaAssunto] = useState(false);
  const [openEscolhaRisco, setOpenEscolhaRisco] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState(false);
  const [errorsPergunta, setErrorsPergunta] = useState(false);
  const [errorsCategoria, setErrorsCategoria] = useState(false);
  const [errorsGrpResposta, setErrorsGrpResposta] = useState(false);
  const [helperErrorsCategoria, setHelperErrorsCategoria] = useState('');
  const [helperErrorsGrpResposta, setHelperErrorsGrpResposta] = useState('');
  const [errorsEscolhaAssunto, setErrorsEscolhaAssunto] = useState(false);
  const [errorsEscolhaPergunta, setErrorsEscolhaPergunta] = useState(false);
  const [errorsRisco, setErrorsRisco] = useState(false);
  const [helperErrorsRisco, setHelperErrorsRisco] = useState('');
  const [helperErrorsEscolhaAssunto, setHelperErrorsEscolhaAssunto] = useState(
    ''
  );
  const [
    helperErrorsEscolhaPergunta,
    setHelperErrorsEscolhaPergunta
  ] = useState('');
  const [helperErrors, setHelperErrors] = useState('');
  const [errorsAssunto, setErrorsAssunto] = useState(false);
  const [helperErrorsAssunto, setHelperErrorsAssunto] = useState('');
  const [errorsProcesso, setErrorsProcesso] = useState(false);
  const [helperErrorsProcesso, setHelperErrorsProcesso] = useState('');
  const [helperErrorsPergunta, setHelperErrorsPergunta] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [processo, setProcesso] = useState([]);
  const [assunto, setAssunto] = useState([]);
  const [categoriaDePerguntas, setCategoriaDePerguntas] = useState([]);
  const [grupoDeRespostas, setGrupoDeRespostas] = useState([]);
  const [pergunCategGrpResp, setPergunCategGrpResp] = useState([]);
  const [risco, setRisco] = useState([]);
  const [assuntoEscolhido, setAssuntoEscolhido] = useState(null);
  const [perguntaEscolhida, setPerguntaEscolhida] = useState(null);
  const [rowCode, setRowCode] = useState('');
  const [rowCode2, setRowCode2] = useState('');
  const [rowCode3, setRowCode3] = useState('');
  const [novoDesAssunt, setNovoDesAssunt] = useState('');
  const [antigoDesAssunt, setAntigoDesAssunt] = useState('');
  const [novoDesPergunta, setNovoDesPergunta] = useState('');
  const [antigoDesPergunta, setAntigoDesPergunta] = useState('');
  const [novoDesRisco, setNovoDesRisco] = useState('');
  const [antigoDesRisco, setAntigoDesRisco] = useState('');

  const handleClose = () => {
    setOpen(false);
    setOpenEscolha(false);
    setOpenEscolhaAssunto(false);
    setOpenEscolhaPergunta(false);
    setOpenEscolhaRisco(false);
    setRefresh(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
    setOpenEscolha(false);
    history.push(mensagem.acao);
    window.location.reload();
  };

  const clickExcluir = item => {
    setSelecao1(item);
    setOpenEscolhaAssunto(true);
  };

  const clickExcluir2 = (CodPergun, CodAssunt, CodCatego, CodGrpRes) => {
    setSelecao2([CodPergun, CodAssunt, CodCatego, CodGrpRes]);
    setOpenEscolhaPergunta(true);
  };

  const clickExcluir3 = CodRisco => {
    setSelecao3(CodRisco);
    setOpenEscolhaRisco(true);
  };

  function createDataProcesso(CodProces, DesProces, CodImagem) {
    return { CodProces, DesProces, CodImagem };
  }

  let rowsProcesso = [];
  rowsProcesso = processo.map(each =>
    createDataProcesso(each.CodProces, each.DesProces, each.CodImagem)
  );

  function createDataAssunto(CodAssunt, DesAssunt) {
    return { CodAssunt, DesAssunt };
  }

  let rowsAssunto = [];
  rowsAssunto = assunto.map(each =>
    createDataAssunto(each.CodAssunt, each.DesAssunt)
  );

  function createDataCategoriaDePerguntas(CodCatego, DesCatego) {
    return { CodCatego, DesCatego };
  }

  let rowsCategoriaDePerguntas = [];
  rowsCategoriaDePerguntas = categoriaDePerguntas.map(each =>
    createDataCategoriaDePerguntas(each.CodCatego, each.DesCatego)
  );  

  function createDataGrupoDeRespostas(CodGrpRes, NomGrpRes) {
    return { CodGrpRes, NomGrpRes };
  }

  let rowsGrupoDeRespostas = [];
  rowsGrupoDeRespostas = grupoDeRespostas.map(each =>
    createDataGrupoDeRespostas(each.CodGrpRes, each.NomGrpRes)
  );

  const populatePergunCategGrpResp = async assuntoEscolhido => {
    if (
      assuntoEscolhido !== '' &&
      assuntoEscolhido !== null &&
      assuntoEscolhido !== undefined
    ) {
      await buscaPerguntaCategoriaGrpResposta(assuntoEscolhido).then(data => {
        setPergunCategGrpResp(data.registros);
      });
    } else {
      setPergunCategGrpResp([]);
    }
  };

  function createDataPergunCategGrpResp(
    CodProces,
    CodPergun,
    DesPergun,
    CodCatego,
    DesCatego,
    CodGrpRes,
    NomGrpRes
  ) {
    return {
      CodProces,
      CodPergun,
      DesPergun,
      CodCatego,
      DesCatego,
      CodGrpRes,
      NomGrpRes
    };
  }

  let rowsPergunCategGrpResp = [];
  rowsPergunCategGrpResp = pergunCategGrpResp.map(each =>
    createDataPergunCategGrpResp(
      each.CodProces,
      each.CodPergun,
      each.DesPergun,
      each.CodCatego,
      each.DesCatego,
      each.CodGrpRes,
      each.NomGrpRes
    )
  );

  const populateRisco = async perguntaEscolhida => {
    if (
      perguntaEscolhida !== '' &&
      perguntaEscolhida !== null &&
      perguntaEscolhida !== undefined
    ) {
      await buscaRiscoPergunta(perguntaEscolhida).then(data => {
        if (data !== undefined) {
          setRisco(data.registros);
        }
      });
    } else {
      setRisco([]);
    }
  };

  function createDataRisco(
    CodProces,
    CodPergun,
    CodCatego,
    CodGrpRes,
    CodRisco,
    DesRisco
  ) {
    return {
      CodProces,
      CodPergun,
      CodCatego,
      CodGrpRes,
      CodRisco,
      DesRisco
    };
  }

  let rowsRisco = [];
  rowsRisco = risco.map(each =>
    createDataRisco(
      each.CodProces,
      each.CodPergun,
      each.CodCatego,
      each.CodGrpRes,
      each.CodRisco,
      each.DesRisco
    )
  );

  const url = window.location.href;
  const urlSplit = url.split('/');
  const codigos0 = urlSplit[5];
  const codigos1 = codigos0.replace(/_/g, ' ');
  const codigos2 = codigos1.split('AND');

  useEffect(() => {
    const url = window.location.href;
    const filtro = url.split('/');
    setRefresh(false);
    if (
      codigos0 !== 'CodProces=0_AND_CodPergun=0_AND_CodCatego=0_AND_CodGrpRes=0'
    ) {
      setTransacaoIncluir(false);
      setLoading(true);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaProcesso(codigos2[0]).then(data => {
            if (data !== undefined) {
              setProcesso(data.registros);
              setValor1(data.registros[0].DesProces);
            } else {
              setProcesso([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/PerguntasPorProcesso'
              });
            }
          });
          await buscaAssunto().then(data => {
            if (data !== undefined) {
              setAssunto(data.registros);
            }
          });
          await buscaCategoriaDePerguntas().then(data => {
            if (data !== undefined) {
              setCategoriaDePerguntas(data.registros);
            } else {
              setCategoriaDePerguntas([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/PerguntasPorProcesso'
              });
            }
          });
          await buscaGrupoDeRespostas().then(data => {
            if (data !== undefined) {
              setGrupoDeRespostas(data.registros);
            } else {
              setGrupoDeRespostas([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/PerguntasPorProcesso'
              });
            }
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setDados([]);
          console.log(err);
        } finally {
          if (!cancel) {
            setLoading(false);
          }
        }
      };
      runEffect();
      return () => {
        cancel = true;
      };
    } else {
      setLoading(true);
      let cancel = false;
      const runEffect = async () => {
        try {
          await buscaProcesso().then(data => {
            if (data !== undefined) {
              setProcesso(data.registros);
            }
          });
          await buscaAssunto().then(data => {
            if (data !== undefined) {
              setAssunto(data.registros);
            }
          });
          await buscaCategoriaDePerguntas().then(data => {
            if (data !== undefined) {
              setCategoriaDePerguntas(data.registros);
            } else {
              setCategoriaDePerguntas([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/PerguntasPorProcesso'
              });
            }
          });
          await buscaGrupoDeRespostas().then(data => {
            if (data !== undefined) {
              setGrupoDeRespostas(data.registros);
            } else {
              setGrupoDeRespostas([]);
              setTransacaoIncluir(true);
              setOpen(true);
              setMensagem({
                titulo: 'Aviso',
                conteudo:
                  'Registro selecionado não existe! Selecione um registro existente.',
                acao: '/PerguntasPorProcesso'
              });
            }
          });
          if (cancel) {
            return;
          }
        } catch (err) {
          setDados([]);
          console.log(err);
        } finally {
          if (!cancel) {
            setLoading(false);
          }
        }
      };
      runEffect();
      return () => {
        cancel = true;
      };
    }
  }, [filtro, refresh]);

  const addAssunto = () => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (valor2 !== '' && valor2 !== undefined) {
          const inclui = await incluiAssunto(valor2);
          if (inclui === false) {
            setErrorsAssunto(true);
            setHelperErrorsAssunto('*Já existe um cadastro com este nome');
          } else {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclusão realizada com sucesso!'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PerguntasPorProcesso'
        });
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    inclui();
    return () => {
      cancel = true;
    };
  };

  const modAssunto = (CodAssunt, DesAssunt) => {
    setLoading(true);
    let cancel = false;
    const altera = async () => {
      try {
        if (DesAssunt !== '' && DesAssunt !== undefined) {
          const alterarAssunto = await alteraAssunto(CodAssunt, DesAssunt);
          if (alterarAssunto !== false) {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          } else {
            setMensagem({
              titulo: 'Atenção',
              conteudo: 'Já existe um cadastro com esta descrição'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          }
        } else {
          setMensagem({
            titulo: 'Atenção',
            conteudo: 'O campo assunto não pode ficar em branco'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/Cargos'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
    };
    altera();
    return () => {
      cancel = true;
    };
  };

  const deleteAssunto = CodAssunt => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        const excluirAssunto = await excluiAssunto(CodAssunt);
        if (excluirAssunto !== false) {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Atenção',
            conteudo: 'Este assunto está associado a uma ou mais perguntas'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PerguntasPorProcesso'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
    };
    exclui();
    return () => {
      cancel = true;
    };
  };

  const addPergunta = (CodAssunt, DesPergun, CodCatego, CodGrpRes) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (submitForm1() !== false) {
          const inclui = await incluiAssuPergCategGrpResp(
            CodAssunt,
            DesPergun,
            CodCatego,
            CodGrpRes
          );
          if (inclui === false) {
            setErrorsPergunta(true);
            setHelperErrorsPergunta('*Já existe um cadastro com este nome');
          } else {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclusão realizada com sucesso!'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          }
          populatePergunCategGrpResp(CodAssunt);
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PerguntasPorProcesso'
        });
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    inclui();
    return () => {
      cancel = true;
    };
  };

  const modPergunta = (CodPergun, DesPergun) => {
    setLoading(true);
    let cancel = false;
    const altera = async () => {
      try {
        if (DesPergun !== '' && DesPergun !== undefined) {
          const alterarPergunta = await alteraPergunta(CodPergun, DesPergun);
          if (alterarPergunta !== false) {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          } else {
            setMensagem({
              titulo: 'Atenção',
              conteudo: 'Já existe um cadastro com esta descrição'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          }
          populatePergunCategGrpResp(valor3);
        } else {
          setMensagem({
            titulo: 'Atenção',
            conteudo: 'O campo assunto não pode ficar em branco'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/Cargos'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
    };
    altera();
    return () => {
      cancel = true;
    };
  };

  const deletePergunta = (CodPergun, CodAssunt, CodCatego, CodGrpRes) => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        const excluirPergunta = await excluiPergunta(
          CodPergun,
          CodAssunt,
          CodCatego,
          CodGrpRes
        );
        if (excluirPergunta !== false) {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Atenção',
            conteudo: 'Este assunto está associado a uma ou mais perguntas'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
        populatePergunCategGrpResp(valor3);
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PerguntasPorProcesso'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
    };
    exclui();
    return () => {
      cancel = true;
    };
  };

  const addRisco = (CodPergun, DesRisco) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (submitForm2() !== false) {
          const inclui = await incluiRisco(CodPergun, DesRisco);
          if (inclui === false) {
            setErrorsRisco(true);
            setHelperErrorsRisco('*Já existe um cadastro com este nome');
          } else {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Inclusão realizada com sucesso!'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
            populateRisco(CodPergun);
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PerguntasPorProcesso'
        });
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    inclui();
    return () => {
      cancel = true;
    };
  };

  const modRisco = (CodRisco, DesRisco) => {
    setLoading(true);
    let cancel = false;
    const altera = async () => {
      try {
        if (DesRisco !== '' && DesRisco !== undefined) {
          const alterarRisco = await alteraRisco(CodRisco, DesRisco);
          if (alterarRisco !== false) {
            setMensagem({
              titulo: 'Sucesso',
              conteudo: 'Alteração realizada com sucesso!'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          } else {
            setMensagem({
              titulo: 'Atenção',
              conteudo: 'Já existe um cadastro com esta descrição'
            });
            setOpen(true);
            if (cancel) {
              return;
            }
          }
          populateRisco(valor7);
        } else {
          setMensagem({
            titulo: 'Atenção',
            conteudo: 'O campo assunto não pode ficar em branco'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/Cargos'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
    };
    altera();
    return () => {
      cancel = true;
    };
  };

  const deleteRisco = CodRisco => {
    setLoading(true);
    let cancel = false;
    const exclui = async () => {
      try {
        const excluirRisco = await excluiRisco(CodRisco, valor7);
        if (excluirRisco !== false) {
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Exclusão realizada com sucesso!'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        } else {
          setMensagem({
            titulo: 'Atenção',
            conteudo: 'Este assunto está associado a uma ou mais perguntas'
          });
          setOpen(true);
          if (cancel) {
            return;
          }
        }
        populateRisco(valor7);
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PerguntasPorProcesso'
        });
      } finally {
        setRefresh(true);
        if (!cancel) setLoading(false);
      }
    };
    exclui();
    return () => {
      cancel = true;
    };
  };

  const concluiAcao = (CodProces, CodPergun) => {
    setLoading(true);
    let cancel = false;
    const inclui = async () => {
      try {
        if (submitForm3() !== false) {
          const inclui = await incluiPerguntaProcesso(CodProces, CodPergun);
          setMensagem({
            titulo: 'Sucesso',
            conteudo: 'Inclusão realizada com sucesso!',
            acao: '/PerguntasPorProcesso'
          });
          setOpen2(true);
          if (cancel) {
            return;
          }
        }
      } catch (err) {
        console.log(err);
        setOpen(true);
        setMensagem({
          titulo: 'Erro',
          conteudo: err,
          acao: '/PerguntasPorProcesso'
        });
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    inclui();
    return () => {
      cancel = true;
    };
  };

  const submitForm1 = Form => {
    const check1 = () => {
      if (valor3 === '' || valor3 === undefined || valor3 === null) {
        setErrorsEscolhaAssunto(true);
        return false;
      }
    };

    const check2 = () => {
      if (valor4 === '' || valor4 === undefined || valor4 === null) {
        setErrorsPergunta(true);
        setHelperErrorsPergunta('*Campo obrigatório');
        return false;
      }
    };

    const check3 = () => {
      if (valor5 === '' || valor5 === undefined || valor5 === null) {
        setErrorsCategoria(true);
        setHelperErrorsCategoria('*Campo obrigatório');
        return false;
      }
    };

    const check4 = () => {
      if (valor5 === '' || valor5 === undefined || valor5 === null) {
        setErrorsGrpResposta(true);
        setHelperErrorsGrpResposta('*Campo obrigatório');
        return false;
      }
    };

    check1();
    check2();
    check3();
    check4();

    if (
      check1() == false ||
      check2() == false ||
      check3() == false ||
      check4() == false
    )
      return false;
  };

  const submitForm2 = Form => {
    const check1 = () => {
      if (valor3 === '' || valor3 === undefined || valor3 === null) {
        setErrorsEscolhaAssunto(true);
        return false;
      }
    };

    const check2 = () => {
      if (valor7 === '' || valor7 === undefined || valor7 === null) {
        setErrorsEscolhaPergunta(true);
        return false;
      }
    };

    check1();
    check2();

    if (check1() == false || check2() == false) return false;
  };

  const submitForm3 = Form => {
    const check1 = () => {
      if (valor1 === '' || valor1 === undefined || valor1 === null) {
        setErrorsProcesso(true);
        setHelperErrorsProcesso('*Campo obrigatório');
        return false;
      }
    };

    const check2 = () => {
      if (valor3 === '' || valor3 === undefined || valor3 === null) {
        setErrorsEscolhaAssunto(true);
        return false;
      }
    };

    const check3 = () => {
      if (valor7 === '' || valor7 === undefined || valor7 === null) {
        setErrorsEscolhaPergunta(true);
        return false;
      }
    };

    check1();
    check2();
    check3();

    if (check1() == false || check2() == false || check3() == false)
      return false;
  };

  const NovoOuAlteracao = url.split('/');

  return (
    <Fragment> 
      <Dialog
        open={openEscolhaAssunto}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Informação</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja excluir o registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Não
          </Button>
          <Button onClick={() => deleteAssunto(selecao1)} color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEscolhaPergunta}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Informação</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja excluir o registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Não
          </Button>
          <Button
            onClick={() =>
              deletePergunta(selecao2[0], selecao2[1], selecao2[2], selecao2[3])
            }
            color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEscolhaRisco}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Informação</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja excluir o registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Não
          </Button>
          <Button onClick={() => deleteRisco(selecao3)} color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{mensagem.titulo}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mensagem.conteudo}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{mensagem.titulo}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mensagem.conteudo}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <PageTitle
        titleHeading="Perguntas por Processo"
        titleDescription={
          NovoOuAlteracao[5] !=
          'CodProces=0_AND_CodPergun=0_AND_CodCatego=0_AND_CodGrpRes=0'
            ? 'Alteração de Perguntas por Processo'
            : 'Novas Perguntas por Processo'
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card className="p-4 mb-4">
            <Grid container justify="flex-start" spacing={2} wrap="wrap">
              {/* Nome do Processo */}

              <div className="searchBar">Nome do Processo</div>
              <Grid item xs={12} sm={12} md={12}>
                {NovoOuAlteracao[5] ==
                'CodProces=0_AND_CodPergun=0_AND_CodCatego=0_AND_CodGrpRes=0' ? (
                  <Autocomplete
                    disablePortal
                    id="outlined-size-small"
                    options={rowsProcesso}
                    getOptionLabel={rowsProcesso => rowsProcesso.DesProces}
                    onChange={(event, newValue) => {
                      newValue === null
                        ? setValor1('')
                        : setValor1({
                            CodProces: newValue.CodProces,
                            DesProces: newValue.DesProces
                          });
                      setErrorsProcesso(false);
                      setHelperErrorsProcesso('');
                    }}
                    renderInput={params => (
                      <TextField
                        helperText={helperErrorsProcesso}
                        error={errorsProcesso}
                        className="m-2"
                        fullWidth
                        variant="outlined"
                        {...params}
                        size="small"
                      />
                    )}
                  />
                ) : (
                  <TextField
                    disabled
                    required
                    fullWidth
                    placeholder="Informe o Nome do Novo Assunto"
                    multiline
                    rowsMax={3}
                    helperText={helperErrors}
                    className="m-2"
                    id="outlined-size-small"
                    value={valor1}
                    variant="outlined"
                    size="small"
                    error={errors}
                  />
                )}
              </Grid>

              {/* Tópico - Assuntos */}
              <div className="searchBar">Assuntos</div>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <div className="searchBar">Nome do Assunto</div>
              <Grid container spacing={1} wrap="wrap">
                <Grid item xs={11} sm={11} md={11}>
                  <TextField
                    required
                    fullWidth
                    placeholder="Informe o Nome do Novo Assunto"
                    multiline
                    rowsMax={3}
                    error={errorsAssunto}
                    helperText={helperErrorsAssunto}
                    className="m-2"
                    id="outlined-size-small"
                    variant="outlined"
                    size="small"
                    onChange={e => {
                      setValor2(e.target.value);
                      setErrorsAssunto(false);
                      setHelperErrorsAssunto('');
                    }}
                  />
                </Grid>

                {/* Botão para Adicionar Assunto */}

                <Grid item xs={1} sm={1} md={1} align="center">
                  <Button
                    edge="end"
                    style={{
                      maxWidth: '50px',
                      maxHeight: '40px',
                      minWidth: '50px',
                      minHeight: '40px'
                    }}
                    className="m-2"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      addAssunto(valor2);
                    }}>
                    +
                  </Button>
                </Grid>
              </Grid>

              {/* Lista de Assuntos */}

              <Grid item xs={12} sm={12} md={12}>
                <Paper
                  style={{
                    maxHeight: '100px',
                    minHeight: '100px',
                    overflow: 'auto',
                    marginLeft: 9
                  }}>
                  <List>
                    {rowsAssunto.map(row => (
                      <ListItem
                        button={rowCode === row.CodAssunt ? false : true}
                        key={row.CodAssunt}
                        style={
                          assuntoEscolhido == row.CodAssunt
                            ? {
                                backgroundColor: '#fff1ff',
                                border: '1px dashed red'
                                //Roxo claro ou '#fffbf2'-> amarelo claro
                              }
                            : { backgroundColor: '' }
                        }>
                        {rowCode === row.CodAssunt ? (
                          <>
                            <ListItemText>
                              <TextField
                                className="m-2"
                                multiline
                                rowsMax={3}
                                id="outlined-size-small"
                                defaultValue={row.DesAssunt}
                                size="small"
                                onBlur={e => {
                                  setNovoDesAssunt(e.target.value);
                                }}
                                style={{
                                  minWidth: '600px',
                                  maxWidth: '600px'
                                }}></TextField>
                            </ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-label="edit"
                                onClick={() => {
                                  modAssunto(row.CodAssunt, novoDesAssunt);
                                  setRowCode('');
                                }}>
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                aria-label="clear"
                                onClick={() => setRowCode('')}>
                                <ClearIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </>
                        ) : (
                          <>
                            <ListItemText
                              primary={row.DesAssunt}
                              onClick={() => {
                                setAssuntoEscolhido(row.CodAssunt);
                                setValor3(row.CodAssunt);
                                let assunto = row.CodAssunt;
                                populatePergunCategGrpResp(assunto);
                                setErrorsEscolhaAssunto(false);
                                setHelperErrorsEscolhaAssunto('');
                              }}></ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  setRowCode(row.CodAssunt);
                                  setNovoDesAssunt(row.DesAssunt);
                                  setAntigoDesAssunt(row.DesAssunt);
                                }}>
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => clickExcluir(row.CodAssunt)}>
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                {errorsEscolhaAssunto ? (
                  <FormHelperText style={{ color: 'red' }}>
                    *Necessário selecionar um assunto
                  </FormHelperText>
                ) : (
                  ''
                )}
              </Grid>

              {/* Tópico - Perguntas */}
              <div className="searchBar" style={{ marginTop: '2px' }}>
                Perguntas
              </div>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <div className="searchBar">Descrição da Pergunta</div>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  placeholder="Informe a Descrição da Nova Pergunta"
                  multiline
                  rowsMax={3}
                  error={errorsPergunta}
                  helperText={helperErrorsPergunta}
                  className="m-2"
                  id="outlined-size-small"
                  variant="outlined"
                  size="small"
                  onBlur={e => {
                    setValor4(e.target.value);
                  }}
                  onChange={e => {
                    setErrorsPergunta(false);
                    setHelperErrorsPergunta('');
                  }}
                />
              </Grid>

              <Grid item xs={5}>
                <div className="searchBar">Categoria</div>
              </Grid>
              <Grid item xs={5}>
                <div className="searchBar">Grupo de Resposta</div>
              </Grid>

              <Grid item xs={5}>
                <Autocomplete
                  disablePortal
                  id="outlined-size-small"
                  freeSolo
                  options={rowsCategoriaDePerguntas}
                  getOptionLabel={rowsCategoriaDePerguntas =>
                    rowsCategoriaDePerguntas.DesCatego
                  }
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setValor5('')
                      : setValor5(newValue.CodCatego);
                    setErrorsCategoria(false);
                    setHelperErrorsCategoria('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsCategoria}
                      error={errorsCategoria}
                      className="m-2"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={5}>
                <Autocomplete
                  freeSolo
                  disablePortal
                  id="outlined-size-small"
                  options={rowsGrupoDeRespostas}
                  getOptionLabel={rowsGrupoDeRespostas =>
                    rowsGrupoDeRespostas.NomGrpRes
                  }
                  onChange={(event, newValue) => {
                    newValue === null
                      ? setValor6('')
                      : setValor6(newValue.CodGrpRes);
                    setErrorsGrpResposta(false);
                    setHelperErrorsGrpResposta('');
                  }}
                  renderInput={params => (
                    <TextField
                      helperText={helperErrorsGrpResposta}
                      error={errorsGrpResposta}
                      className="m-2"
                      fullWidth
                      variant="outlined"
                      {...params}
                      size="small"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={2} align="center">
                <Button
                  disabled={NovoOuAlteracao[5] != 'CodSegmen=0' ? false : true}
                  edge="end"
                  style={{
                    maxWidth: '100px',
                    maxHeight: '40px',
                    minWidth: '100px',
                    minHeight: '40px'
                  }}
                  className="m-2"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addPergunta(valor3, valor4, valor5, valor6);
                  }}>
                  Adicionar
                </Button>
              </Grid>

              {/* Lista de Perg/Categ/GrpResp Já Associados ao Processo Definido */}

              <Grid item xs={12} sm={12} md={12}>
                <Paper
                  style={{
                    maxHeight: '100px',
                    minHeight: '100px',
                    overflow: 'auto',
                    marginLeft: 9
                  }}>
                  <List>
                    {rowsPergunCategGrpResp.map(row => (
                      <ListItem
                        button={rowCode2 === row.CodPergun ? false : true}
                        key={
                          row.CodProces +
                          '_' +
                          row.CodPergun +
                          '_' +
                          row.CodCatego +
                          '_' +
                          row.CodGrpRes
                        }
                        style={
                          perguntaEscolhida == row.CodPergun
                            ? {
                                backgroundColor: '#fff1ff',
                                border: '1px dashed red'
                                //Roxo claro ou '#fffbf2'-> amarelo claro
                              }
                            : { backgroundColor: '' }
                        }>
                        {rowCode2 === row.CodPergun ? (
                          <>
                            <ListItemText>
                              <TextField
                                className="m-2"
                                multiline
                                rowsMax={3}
                                id="outlined-size-small"
                                defaultValue={row.DesPergun}
                                size="small"
                                onBlur={e => {
                                  setNovoDesPergunta(e.target.value);
                                }}
                                style={{
                                  minWidth: '600px',
                                  maxWidth: '600px'
                                }}></TextField>
                            </ListItemText>
                            {/* <ListItemText
                          primary={row.DesCatego}
                          style={{
                            minWidth: '150px',
                            maxWidth: '150px'
                          }}></ListItemText>
                        <ListItemText
                          primary={row.NomGrpRes}
                          style={{
                            minWidth: '100px',
                            maxWidth: '100px'
                          }}></ListItemText> */}
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-label="edit"
                                onClick={() => {
                                  modPergunta(row.CodPergun, novoDesPergunta);
                                  setRowCode2('');
                                }}>
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                aria-label="clear"
                                onClick={() => setRowCode2('')}>
                                <ClearIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </>
                        ) : (
                          <>
                            <ListItemText
                              onClick={() => {
                                setPerguntaEscolhida(row.CodPergun);
                                setValor7(row.CodPergun);
                                let pergunta = row.CodPergun;
                                populateRisco(pergunta);
                                setErrorsEscolhaPergunta(false);
                                setHelperErrorsEscolhaPergunta('');
                              }}
                              primary={
                                row.DesPergun.length > 50
                                  ? row.DesPergun.substring(0, 50) + '...'
                                  : row.DesPergun
                              }
                              style={{
                                minWidth: '420px',
                                maxWidth: '420px'
                              }}></ListItemText>
                            <ListItemText
                              primary={row.DesCatego}
                              style={{
                                minWidth: '150px',
                                maxWidth: '150px'
                              }}></ListItemText>
                            <ListItemText
                              primary={row.NomGrpRes}
                              style={{
                                minWidth: '100px',
                                maxWidth: '100px'
                              }}></ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-label="edit"
                                onClick={() => {
                                  setRowCode2(row.CodPergun);
                                  setNovoDesPergunta(row.DesPergun);
                                  setAntigoDesPergunta(row.DesPergun);
                                }}>
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  clickExcluir2(
                                    row.CodPergun,
                                    valor3,
                                    row.CodCatego,
                                    row.CodGrpRes
                                  );
                                }}>
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                {errorsEscolhaPergunta ? (
                  <FormHelperText style={{ color: 'red' }}>
                    *Necessário selecionar uma pergunta
                  </FormHelperText>
                ) : (
                  ''
                )}
              </Grid>

              {/* Tópico - Riscos */}
              <div className="searchBar">Riscos Associados à Pergunta</div>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <div className="searchBar">Risco</div>
              <Grid container spacing={1} wrap="wrap">
                <Grid item xs={11} sm={11} md={11}>
                  <TextField
                    required
                    fullWidth
                    placeholder="Informe o Nome do Novo Assunto"
                    multiline
                    rowsMax={3}
                    error={errorsRisco}
                    helperText={helperErrorsRisco}
                    className="m-2"
                    id="outlined-size-small"
                    variant="outlined"
                    size="small"
                    onBlur={e => {
                      setValor8(e.target.value);
                    }}
                    onChange={e => {
                      setErrorsRisco(false);
                      setHelperErrorsRisco('');
                    }}
                  />
                </Grid>

                {/* Botão para Associar Risco á Pergunta Selecionada */}

                <Grid item xs={1} sm={1} md={1} align="center">
                  <Button
                    edge="end"
                    style={{
                      maxWidth: '50px',
                      maxHeight: '40px',
                      minWidth: '50px',
                      minHeight: '40px'
                    }}
                    className="m-2"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      addRisco(valor7, valor8);
                    }}>
                    +
                  </Button>
                </Grid>
              </Grid>

              {/* Lista de Riscos Já Associados à Pergunta Selecionada */}

              <Grid item xs={12} sm={12} md={12}>
                <Paper
                  style={{
                    maxHeight: '100px',
                    minHeight: '100px',
                    overflow: 'auto',
                    marginLeft: 9
                  }}>
                  <List>
                    {rowsRisco.map(row => (
                      <ListItem
                        key={
                          row.CodProces +
                          '_' +
                          row.CodPergun +
                          '_' +
                          row.CodCatego +
                          '_' +
                          row.CodGrpRes +
                          '_' +
                          row.CodRisco
                        }>
                        {rowCode3 === row.CodRisco ? (
                          <>
                            <ListItemText>
                              <TextField
                                className="m-2"
                                multiline
                                rowsMax={3}
                                id="outlined-size-small"
                                defaultValue={row.DesRisco}
                                size="small"
                                onBlur={e => {
                                  setNovoDesRisco(e.target.value);
                                }}
                                style={{
                                  minWidth: '600px',
                                  maxWidth: '600px'
                                }}></TextField>
                            </ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-label="edit"
                                onClick={() => {
                                  modRisco(row.CodRisco, novoDesRisco);
                                  setRowCode3('');
                                }}>
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                aria-label="clear"
                                onClick={() => setRowCode3('')}>
                                <ClearIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </>
                        ) : (
                          <>
                            <ListItemText
                              primary={
                                row.DesRisco.length > 40
                                  ? row.DesRisco.substring(0, 40) + '...'
                                  : row.DesRisco
                              }></ListItemText>
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-label="edit"
                                onClick={() => {
                                  setRowCode3(row.CodRisco);
                                  setNovoDesRisco(row.DesRisco);
                                  setAntigoDesRisco(row.DesRisco);
                                }}>
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => clickExcluir3(row.CodRisco)}>
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              <Grid
                container
                justify="space-around"
                spacing={2}
                textAlign="center">
                <Grid item xs={12}>
                  <Divider className="my-4" />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Box textAlign="center">
                    <Button
                      style={{
                        maxWidth: '800px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}
                      className="m-2"
                      variant="outlined"
                      color="primary"
                      href="/PerguntasPorProcesso">
                      Voltar
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Box sx={{ width: '100%' }} textAlign="center">
                    <Button
                      style={{
                        maxWidth: '800px',
                        maxHeight: '60px',
                        minWidth: '180px',
                        minHeight: '40px'
                      }}
                      className="m-2"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        concluiAcao(valor1.CodProces, valor7);
                      }}>
                      Confirmar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
