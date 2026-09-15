import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home/Home";
import Portfolio from "./pages/Portfolio/Portfolio";
import Sobre from "./pages/Sobre/Sobre";

import AnamneseLogin from "./pages/Anamnese/AnamneseLogin";
import AnamneseForm from "./pages/Anamnese/AnamneseForm";

import Documentacao from "./pages/Documentacao/Documentacao";
import Cuidados from "./pages/Cuidados/Cuidados";

import Flash from "./pages/Flash/Flash";

import PoliticaPrivacidade from "./pages/PoliticaPrivacidade/PoliticaPrivacidade";

import Agendamento from "./pages/Agendamento/Agendamento";

import Contato from "./pages/Contato/Contato";

/* =========================================================
   ADMIN
========================================================= */

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminTrabalhos from "./pages/Admin/AdminTrabalhos";
import AgendamentoAdmin from "./pages/Admin/AgendamentoAdmin";

function App() {
  return (
    <BrowserRouter>
      {/* Volta automaticamente para o topo ao mudar de página */}
      <ScrollToTop />

      <Routes>
        {/* =====================================================
            HOME
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =====================================================
            PORTFÓLIO
        ===================================================== */}

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/portfolio/:estilo"
          element={<Portfolio />}
        />

        {/* =====================================================
            SOBRE A ARTISTA
        ===================================================== */}

        <Route
          path="/sobre"
          element={<Sobre />}
        />

        {/* =====================================================
            FLASH
        ===================================================== */}

        <Route
          path="/flash"
          element={<Flash />}
        />

        {/* =====================================================
            AGENDAMENTO
        ===================================================== */}

        <Route
          path="/agendamento"
          element={<Agendamento />}
        />

        {/* =====================================================
            CONTATO
        ===================================================== */}

        <Route
          path="/contato"
          element={<Contato />}
        />

        {/* =====================================================
            ANAMNESE
        ===================================================== */}

        <Route
          path="/anamnese"
          element={<AnamneseLogin />}
        />

        <Route
          path="/anamnese/formulario"
          element={<AnamneseForm />}
        />

        {/* =====================================================
            DOCUMENTAÇÃO
        ===================================================== */}

        <Route
          path="/documentacao"
          element={<Documentacao />}
        />

        {/* =====================================================
            CUIDADOS COM A TATUAGEM
        ===================================================== */}

        <Route
          path="/cuidados"
          element={<Cuidados />}
        />

        {/* =====================================================
            POLÍTICA DE PRIVACIDADE
        ===================================================== */}

        <Route
          path="/politica-privacidade"
          element={<PoliticaPrivacidade />}
        />

        {/* =====================================================
            ÁREA ADMINISTRATIVA
        ===================================================== */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/trabalhos"
          element={<AdminTrabalhos />}
        />

        <Route
          path="/admin/agendamento"
          element={<AgendamentoAdmin />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;