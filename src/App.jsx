import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Portfolio from "./pages/Portfolio/Portfolio";

import AnamneseLogin from "./pages/Anamnese/AnamneseLogin";
import AnamneseForm from "./pages/Anamnese/AnamneseForm";

import Documentacao from "./pages/Documentacao/Documentacao";
import Cuidados from "./pages/Cuidados/Cuidados";

import Flash from "./pages/Flash/Flash";

import PoliticaPrivacidade from "./pages/PoliticaPrivacidade/PoliticaPrivacidade";


function App() {

  return (

    <BrowserRouter>

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
            FLASH
        ===================================================== */}

        <Route
          path="/flash"
          element={<Flash />}
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


      </Routes>

    </BrowserRouter>

  );

}


export default App;