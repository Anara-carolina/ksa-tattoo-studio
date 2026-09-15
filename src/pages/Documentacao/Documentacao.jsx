
import { Link } from "react-router-dom";

import {
  FaFileAlt,
  FaDownload,
  FaArrowRight,
  FaIdCard,
  FaClipboardCheck,
  FaUserShield
} from "react-icons/fa";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PantherHero from "../../components/PantherHero/PantherHero";

import autorizacao from "../../assets/formulario/autorizacao.pdf";

import "./Documentacao.css";


export default function Documentacao() {

  return (

    <div className="documentacao">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <Header />


      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ===================================================== */}

      <main className="documentacao-main">


        {/* =====================================================
            HERO
        ===================================================== */}

        <PantherHero>

          <span className="documentacao-small">
            KSA STUDIO
          </span>


          <div className="documentacao-heading">

            <span className="ornament">
              ✦
            </span>

            <h1>
              DOCUMENTAÇÃO
            </h1>

            <span className="ornament">
              ✦
            </span>

          </div>


          <p className="documentacao-description">

            Antes do seu atendimento, confira os documentos
            e informações necessários para realizar seu
            procedimento no KSA Studio.

          </p>

        </PantherHero>



        {/* =====================================================
            ANTES DO ATENDIMENTO
        ===================================================== */}

        <section className="documentacao-before">


          <div className="section-heading">

            <span className="ornament">
              ✦
            </span>

            <h2>
              ANTES DO SEU ATENDIMENTO
            </h2>

            <span className="ornament">
              ✦
            </span>

          </div>


          <p className="documentacao-before-intro">

            Para realizar seu atendimento no KSA Studio,
            é necessário estar com a documentação correta
            em mãos.

          </p>



          <div className="documentacao-requirements">


            {/* =================================================
                DOCUMENTO DE IDENTIFICAÇÃO
            ================================================= */}

            <article className="requirement-item">

              <div className="requirement-icon">

                <FaIdCard />

              </div>


              <div className="requirement-content">


                <h3>
                  DOCUMENTO DE IDENTIFICAÇÃO
                </h3>


                <p>

                  É necessário apresentar um documento de
                  identificação válido e oficial em território
                  nacional no dia do atendimento.

                </p>

              </div>

            </article>



            {/* =================================================
                FICHA DE ANAMNESE
            ================================================= */}

            <article className="requirement-item">

              <div className="requirement-icon">

                <FaClipboardCheck />

              </div>


              <div className="requirement-content">


                <h3>
                  FICHA DE ANAMNESE
                </h3>


                <p>

                  Antes do procedimento, é necessário preencher
                  a Ficha de Anamnese com as informações
                  solicitadas para o seu atendimento.

                </p>


                <Link
                  to="/anamnese"
                  className="requirement-button"
                >

                  PREENCHER ANAMNESE

                  <FaArrowRight />

                </Link>

              </div>

            </article>



            {/* =================================================
                MENOR DE IDADE
            ================================================= */}

            <article className="requirement-item requirement-minor">

              <div className="requirement-icon">

                <FaUserShield />

              </div>


              <div className="requirement-content">


                <h3>
                  TATUAGEM EM MENOR DE IDADE
                </h3>


                <p>

                  Caso o procedimento seja realizado em um
                  menor de idade, é necessário levar a
                  documentação completa no dia do atendimento.

                </p>


                <ul>

                  <li>
                    Imprimir e preencher a Autorização para
                    Tatuagem em Menor de Idade;
                  </li>

                  <li>
                    Levar a autorização devidamente preenchida
                    e assinada;
                  </li>

                  <li>
                    Levar uma cópia do documento de identificação
                    do(a) menor;
                  </li>

                  <li>
                    Levar uma cópia do documento de identificação
                    do responsável legal;
                  </li>

                  <li>
                    Levar uma cópia do CPF do responsável legal,
                    quando necessário.
                  </li>

                </ul>

              </div>

            </article>


          </div>

        </section>



        {/* =====================================================
            DOCUMENTO DE AUTORIZAÇÃO
        ===================================================== */}

        <section className="documentos-lista">


          <div className="section-heading">

            <span className="ornament">
              ✦
            </span>

            <h2>
              DOCUMENTO PARA IMPRESSÃO
            </h2>

            <span className="ornament">
              ✦
            </span>

          </div>


          <p className="documentos-intro">

            Se você é responsável legal por um menor de idade
            que realizará uma tatuagem, imprima e preencha
            o documento abaixo antes do atendimento.

          </p>



          <article className="documento-card">


            <div className="documento-icon">

              <FaFileAlt />

            </div>



            <div className="documento-content">


              <span className="documento-label">
                AUTORIZAÇÃO
              </span>


              <h2>
                Tatuagem em Menor de Idade
              </h2>


              <p>

                Documento destinado à autorização do responsável
                legal para a realização de tatuagem em menor de idade.

              </p>



              <div className="documento-actions">


                <a
                  href={autorizacao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="documento-button documento-button-primary"
                >

                  ABRIR DOCUMENTO

                  <FaArrowRight />

                </a>



                <a
                  href={autorizacao}
                  download
                  className="documento-button documento-button-outline"
                >

                  <FaDownload />

                  BAIXAR PDF

                </a>


              </div>


            </div>


          </article>


        </section>



        {/* =====================================================
            OBSERVAÇÃO
        ===================================================== */}

        <section className="documentacao-info">


          <span className="documentacao-info-icon">
            ✦
          </span>


          <h2>
            IMPORTANTE
          </h2>


          <p>

            A documentação poderá ser conferida pelo KSA Studio
            antes da realização do procedimento. Certifique-se
            de levar todos os documentos necessários no dia
            do seu atendimento.

          </p>


        </section>


      </main>



      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />


    </div>

  );

}
