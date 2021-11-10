import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ThemeProvider } from '@material-ui/styles';

import MuiTheme from './theme';

import Cookies from 'universal-cookie';

// Layout Blueprints

import { LeftSidebar, PresentationLayout } from './layout-blueprints';

// Example Pages

import AlterarSenha from './pages/AlterarSenha';
import Buttons from './example-pages/Buttons';
import Dropdowns from './example-pages/Dropdowns';
import NavigationMenus from './example-pages/NavigationMenus';
import ProgressBars from './example-pages/ProgressBars';
import Pagination from './example-pages/Pagination';
import Scrollable from './example-pages/Scrollable';
import Badges from './example-pages/Badges';
import Icons from './example-pages/Icons';
import UtilitiesHelpers from './example-pages/UtilitiesHelpers';
import RegularTables1 from './example-pages/RegularTables1';
import RegularTables4 from './example-pages/RegularTables4';
import FormsControls from './example-pages/FormsControls';
import Cargos from './pages/Cargos';
import CadCargos from './pages/Cargos/CadCargos';
import PaisEstadoCidade from './pages/PaisEstadoCidade';
import CadPaisEstadoCidade from './pages/PaisEstadoCidade/CadPaisEstadoCidade';
import Segmentos from './pages/Segmentos';
import CadSegmentos from './pages/Segmentos/CadSegmentos';
import AreasDeAtuacao from './pages/AreasDeAtuacao';
import CadAreasDeAtuacao from './pages/AreasDeAtuacao/CadAreasDeAtuacao';
import ClassificacaoDaEmpresa from './pages/ClassificacaoDaEmpresa';
import CadClassificacaoDaEmpresa from './pages/ClassificacaoDaEmpresa/CadClassificacaoDaEmpresa';
import FaturamentoMensal from './pages/FaturamentoMensal';
import CadFaturamentoMensal from './pages/FaturamentoMensal/CadFaturamentoMensal';
import QuantidadeFuncionarios from './pages/QuantidadeFuncionarios';
import CadQuantidadeFuncionarios from './pages/QuantidadeFuncionarios/CadQuantidadeFuncionarios';
import Processos from './pages/Processos';
import CadProcessos from './pages/Processos/CadProcessos';
import CategoriaDePerguntas from './pages/CategoriaDePerguntas';
import CadCategoriaDePerguntas from './pages/CategoriaDePerguntas/CadCategoriaDePerguntas';
import GrupoDeRespostas from './pages/GrupoDeRespostas';
import CadGrupoDeRespostas from './pages/GrupoDeRespostas/CadGrupoDeRespostas';
import PerguntasPorProcesso from './pages/PerguntasPorProcesso';
import CadPerguntasPorProcesso from './pages/PerguntasPorProcesso/CadPerguntasPorProcesso';
import Usuarios from './pages/Usuarios';
import CadUsuarios from './pages/Usuarios/CadUsuarios';
import ConfiguracaoDeNivelDeAnalise from './pages/ConfiguracaoDeNivelDeAnalise';
import CadConfiguracaoDeNivelDeAnalise from './pages/ConfiguracaoDeNivelDeAnalise/CadConfiguracaoDeNivelDeAnalise';
import ProcessosPorSegmentos from './pages/ProcessosPorSegmentos';
import CadProcessosPorSegmentos from './pages/ProcessosPorSegmentos/CadProcessosPorSegmentos';
import SelecaoEmpresa from './pages/SelecaoEmpresa';
import Empresa from './pages/Empresa';
import CadEmpresa from './pages/Empresa/CadEmpresa';
import GrupoEmpresarial from './pages/GrupoEmpresarial';
import CadGrupoEmp from './pages/GrupoEmpresarial/CadGrupoEmp';
import ProcEmpresa from './pages/ProcEmpresa';
import AnalisesSuaEmpresa from './pages/AnalisesSuaEmpresa';
import RelatoriosRespostasDosQuestionarios from './pages/RelatoriosRespostasDosQuestionarios';
import RelatoriosIndicadoresAnalise from './pages/RelatoriosIndicadoresAnalise';
import RelatoriosIndicadoresComparativo from './pages/RelatoriosIndicadoresComparativo';

const DashboardDefault = lazy(() => import('./example-pages/DashboardDefault'));
const Cards3 = lazy(() => import('./example-pages/Cards3'));
const Login = lazy(() => import('./example-pages/LandingPage'));
const Accordions = lazy(() => import('./example-pages/Accordions'));
const Modals = lazy(() => import('./example-pages/Modals'));
const Notifications = lazy(() => import('./example-pages/Notifications'));
const Popovers = lazy(() => import('./example-pages/Popovers'));
const Tabs = lazy(() => import('./example-pages/Tabs'));
const ApexCharts = lazy(() => import('./example-pages/ApexCharts'));
const Maps = lazy(() => import('./example-pages/Maps'));
const ListGroups = lazy(() => import('./example-pages/ListGroups'));

const Routes = () => {
  const location = useLocation();
  const cookies = new Cookies();
  const url = window.location.href;
  const urlSplit = url.split('/');
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.01
    }
  };
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <ThemeProvider theme={MuiTheme}>
      <AnimatePresence>
        <Suspense
          fallback={
            <div className="d-flex align-items-center vh-100 justify-content-center text-center font-weight-bold font-size-lg py-3">
              <div className="w-50 mx-auto">
                Aguarde enquanto a solicitação é carregada
              </div>
            </div>
          }>
          <Switch>
            <Redirect exact from="/" to="/Login" />
            <Route path={['/Login']}>
              <PresentationLayout>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route path="/Login" component={Login} />
                  </motion.div>
                </Switch>
              </PresentationLayout>
            </Route>

            <Route
              path={[
                '/AlterarSenha',
                '/DashboardDefault',
                '/Buttons',
                '/Dropdowns',
                '/NavigationMenus',
                '/ProgressBars',
                '/Pagination',
                '/Scrollable',
                '/Badges',
                '/Icons',
                '/UtilitiesHelpers',
                '/Cards3',
                '/Accordions',
                '/Modals',
                '/Notifications',
                '/Popovers',
                '/Tabs',
                '/RegularTables1',
                '/RegularTables4',
                '/FormsControls',
                '/ApexCharts',
                '/Maps',
                '/ListGroups',
                '/Cargos',
                '/Cargos/CadCargos/:id',
                '/PaisEstadoCidade',
                '/PaisEstadoCidade/:id',
                '/Segmentos',
                '/Segmentos/CadSegmentos/:id',
                '/AreasDeAtuacao',
                '/AreasDeAtuacao/CadAreasDeAtuacao/:id',
                '/ClassificacaoDaEmpresa',
                '/ClassificacaoDaEmpresa/CadClassificacaoDaEmpresa/:id',
                '/QuantidadeFuncionarios',
                '/QuantidadeFuncionarios/CadQuantidadeFuncionarios/:id',
                '/FaturamentoMensal',
                '/FaturamentoMensal/CadFaturamentoMensal/:id',
                '/Processos',
                '/Processos/CadProcessos/:id',
                '/CategoriaDePerguntas',
                '/CategoriaDePerguntas/CadCategoriaDePerguntas/:id',
                '/GrupoDeRespostas',
                '/GrupoDeRespostas/CadGrupoDeRespostas/:id',
                '/PerguntasPorProcesso',
                '/PerguntasPorProcesso/CadPerguntasPorProcesso/:id',
                '/Usuarios',
                '/Usuarios/CadUsuarios/:id',
                '/ConfiguracaoDeNivelDeAnalise',
                '/ConfiguracaoDeNivelDeAnalise/CadConfiguracaoDeNivelDeAnalise/:id',
                '/SelecaoEmpresa',
                '/Empresa',
                '/Empresa/CadEmpresa/:id',
                '/GrupoEmpresarial',
                '/GrupoEmpresarial/CadGrupoEmp/:id',
                '/ProcEmpresa',
                '/AnalisesSuaEmpresa',
                '/ProcessosPorSegmentos',
                '/ProcessosPorSegmentos/CadProcessosPorSegmentos',
                '/RelatoriosRespostasDosQuestionarios',
                '/RelatoriosIndicadoresAnalise',
                '/RelatoriosIndicadoresComparativo'
              ]}>
              <LeftSidebar>
                <Switch location={location} key={location.pathname}>
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}>
                    <Route
                      path="/DashboardDefault"
                      component={DashboardDefault}
                    />
                    <Route exact path="/Cargos" component={Cargos} />
                    <Route
                      exact
                      path="/Cargos/CadCargos/:id"
                      component={CadCargos}
                    />
                    <Route
                      exact
                      path="/PaisEstadoCidade"
                      component={PaisEstadoCidade}
                    />
                    <Route
                      exact
                      path="/PaisEstadoCidade/CadPaisEstadoCidade/:id"
                      component={CadPaisEstadoCidade}
                    />
                    <Route exact path="/Segmentos" component={Segmentos} />
                    <Route
                      exact
                      path="/Segmentos/CadSegmentos/:id"
                      component={CadSegmentos}
                    />
                    <Route
                      exact
                      path="/AreasDeAtuacao"
                      component={AreasDeAtuacao}
                    />
                    <Route
                      exact
                      path="/AreasDeAtuacao/CadAreasDeAtuacao/:id"
                      component={CadAreasDeAtuacao}
                    />
                    <Route
                      exact
                      path="/ClassificacaoDaEmpresa"
                      component={ClassificacaoDaEmpresa}
                    />
                    <Route
                      exact
                      path="/ClassificacaoDaEmpresa/CadClassificacaoDaEmpresa/:id"
                      component={CadClassificacaoDaEmpresa}
                    />
                    <Route
                      exact
                      path="/FaturamentoMensal"
                      component={FaturamentoMensal}
                    />
                    <Route
                      exact
                      path="/FaturamentoMensal/CadFaturamentoMensal/:id"
                      component={CadFaturamentoMensal}
                    />
                    <Route
                      exact
                      path="/QuantidadeFuncionarios"
                      component={QuantidadeFuncionarios}
                    />
                    <Route
                      exact
                      path="/QuantidadeFuncionarios/CadQuantidadeFuncionarios/:id"
                      component={CadQuantidadeFuncionarios}
                    />
                    <Route exact path="/Processos" component={Processos} />
                    <Route
                      exact
                      path="/Processos/CadProcessos/:id"
                      component={CadProcessos}
                    />
                    <Route
                      exact
                      path="/CategoriaDePerguntas"
                      component={CategoriaDePerguntas}
                    />
                    <Route
                      exact
                      path="/CategoriaDePerguntas/CadCategoriaDePerguntas/:id"
                      component={CadCategoriaDePerguntas}
                    />
                    <Route
                      exact
                      path="/GrupoDeRespostas"
                      component={GrupoDeRespostas}
                    />
                    <Route
                      exact
                      path="/GrupoDeRespostas/CadGrupoDeRespostas/:id"
                      component={CadGrupoDeRespostas}
                    />
                    <Route
                      exact
                      path="/PerguntasPorProcesso"
                      component={PerguntasPorProcesso}
                    />
                    <Route
                      exact
                      path="/PerguntasPorProcesso/CadPerguntasPorProcesso/:id"
                      component={CadPerguntasPorProcesso}
                    />
                    <Route exact path="/Usuarios" component={Usuarios} />
                    <Route
                      exact
                      path="/Usuarios/CadUsuarios/:id"
                      component={CadUsuarios}
                    />
                    <Route
                      exact
                      path="/ConfiguracaoDeNivelDeAnalise"
                      component={ConfiguracaoDeNivelDeAnalise}
                    />
                    <Route
                      exact
                      path="/ConfiguracaoDeNivelDeAnalise/CadConfiguracaoDeNivelDeAnalise/:id"
                      component={CadConfiguracaoDeNivelDeAnalise}
                    />
                    <Route
                      exact
                      path="/ProcessosPorSegmentos"
                      component={ProcessosPorSegmentos}
                    />
                    <Route
                      exact
                      path="/ProcessosPorSegmentos/CadProcessosPorSegmentos/:id"
                      component={CadProcessosPorSegmentos}
                    />
                    <Route
                      exact
                      path="/SelecaoEmpresa"
                      component={SelecaoEmpresa}
                    />
                    <Route
                      exact
                      path="/AlterarSenha"
                      component={AlterarSenha}
                    />
                    <Route exact path="/Empresa" component={Empresa} />
                    <Route
                      exact
                      path="/Empresa/CadEmpresa/:id"
                      component={CadEmpresa}
                    />
                    <Route
                      exact
                      path="/GrupoEmpresarial"
                      component={GrupoEmpresarial}
                    />
                    <Route
                      exact
                      path="/GrupoEmpresarial/CadGrupoEmp/:id"
                      component={CadGrupoEmp}
                    />
                    <Route exact path="/ProcEmpresa" component={ProcEmpresa} />
                    <Route
                      exact
                      path="/AnalisesSuaEmpresa"
                      component={AnalisesSuaEmpresa}
                    />
                    <Route
                      exact
                      path="/RelatoriosRespostasDosQuestionarios"
                      component={RelatoriosRespostasDosQuestionarios}
                    />
                    <Route
                      exact
                      path="/RelatoriosIndicadoresAnalise"
                      component={RelatoriosIndicadoresAnalise}
                    />
                    <Route
                      exact
                      path="/RelatoriosIndicadoresComparativo"
                      component={RelatoriosIndicadoresComparativo}
                    />

                    <Route path="/Buttons" component={Buttons} />
                    <Route path="/Dropdowns" component={Dropdowns} />
                    <Route
                      path="/NavigationMenus"
                      component={NavigationMenus}
                    />
                    <Route path="/ProgressBars" component={ProgressBars} />
                    <Route path="/Pagination" component={Pagination} />
                    <Route path="/Scrollable" component={Scrollable} />
                    <Route path="/Badges" component={Badges} />
                    <Route path="/Icons" component={Icons} />
                    <Route
                      path="/UtilitiesHelpers"
                      component={UtilitiesHelpers}
                    />
                    <Route path="/Cards3" component={Cards3} />
                    <Route path="/Accordions" component={Accordions} />
                    <Route path="/Modals" component={Modals} />
                    <Route path="/Notifications" component={Notifications} />
                    <Route path="/Popovers" component={Popovers} />
                    <Route path="/Tabs" component={Tabs} />
                    <Route path="/RegularTables1" component={RegularTables1} />
                    <Route path="/RegularTables4" component={RegularTables4} />
                    <Route path="/FormsControls" component={FormsControls} />
                    <Route path="/ApexCharts" component={ApexCharts} />
                    <Route path="/Maps" component={Maps} />
                    <Route path="/ListGroups" component={ListGroups} />
                  </motion.div>
                </Switch>
              </LeftSidebar>
            </Route>
          </Switch>
        </Suspense>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default Routes;
