import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./PoliticaPrivacidade.css";

export default function PoliticaPrivacidade() {
  return (
    <div className="politica-page">

      <Header />

      <main className="politica-main">

        {/* =========================================
            CABEÇALHO
        ========================================= */}

        <section className="politica-header">

          <span className="politica-brand">
            KSA STUDIO
          </span>

          <div className="politica-symbol">
            ✦
          </div>

          <span className="politica-label">
            PRIVACIDADE & PROTEÇÃO DE DADOS
          </span>

          <h1>
            POLÍTICA DE
            <br />
            <span>PRIVACIDADE</span>
          </h1>

          <div className="politica-line"></div>

          <p>
            Transparência, respeito e segurança
            no tratamento das suas informações.
          </p>

        </section>


        {/* =========================================
            CONTEÚDO
        ========================================= */}

        <article className="politica-article">


          {/* =========================================
              01 — INTRODUÇÃO
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              01
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                SOBRE ESTA POLÍTICA
              </span>

              <h2>
                Introdução
              </h2>

              <p>
                A KSA Studio valoriza a privacidade e a
                segurança das informações de suas clientes.
                Esta Política de Privacidade explica como
                coletamos, utilizamos, armazenamos e
                protegemos os dados fornecidos durante o
                atendimento e, especialmente, por meio da
                Anamnese.
              </p>

              <p>
                Ao utilizar nossos serviços e fornecer seus
                dados, você poderá consultar nesta página
                informações sobre as finalidades e condições
                relacionadas ao tratamento dessas informações.
              </p>

            </div>

          </section>


          {/* =========================================
              02 — DADOS COLETADOS
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              02
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                INFORMAÇÕES
              </span>

              <h2>
                Dados que podemos coletar
              </h2>

              <p>
                Dependendo do serviço utilizado, podemos
                coletar informações fornecidas diretamente
                por você, como nome, informações de contato,
                dados necessários para agendamento e
                informações preenchidas na ficha de Anamnese.
              </p>

              <p>
                A Anamnese poderá conter informações
                relacionadas à saúde e outras informações
                necessárias para avaliar condições relevantes
                à realização segura do procedimento.
              </p>

            </div>

          </section>


          {/* =========================================
              03 — UTILIZAÇÃO
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              03
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                FINALIDADE
              </span>

              <h2>
                Como utilizamos seus dados
              </h2>

              <p>
                As informações fornecidas poderão ser
                utilizadas para finalidades relacionadas ao
                atendimento, comunicação com a cliente,
                agendamento, avaliação das informações
                necessárias à realização do procedimento,
                preparação e segurança durante o atendimento.
              </p>

              <p>
                Os dados também poderão ser utilizados para
                cumprir obrigações legais e exercer direitos
                relacionados à prestação dos serviços.
              </p>

            </div>

          </section>


          {/* =========================================
              04 — DADOS SENSÍVEIS
          ========================================= */}

          <section className="politica-section politica-section-highlight">

            <div className="politica-section-number">
              04
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                ATENÇÃO ESPECIAL
              </span>

              <h2>
                Dados pessoais sensíveis
              </h2>

              <p>
                Algumas informações presentes na Anamnese
                podem ser consideradas dados pessoais
                sensíveis pela legislação brasileira,
                especialmente quando relacionadas à saúde.
              </p>

              <p>
                Essas informações deverão ser tratadas com
                cuidado e acesso restrito, observando as
                bases legais e demais requisitos previstos
                na Lei Geral de Proteção de Dados Pessoais
                — LGPD.
              </p>

            </div>

          </section>


          {/* =========================================
              05 — COMPARTILHAMENTO
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              05
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                TRANSPARÊNCIA
              </span>

              <h2>
                Compartilhamento de informações
              </h2>

              <p>
                A KSA Studio não comercializa os dados
                pessoais fornecidos por suas clientes.
              </p>

              <p>
                As informações poderão ser compartilhadas
                apenas quando necessário para a prestação
                do serviço, cumprimento de obrigação legal,
                exercício regular de direitos ou em outras
                hipóteses permitidas pela legislação aplicável.
              </p>

            </div>

          </section>


          {/* =========================================
              06 — SEGURANÇA
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              06
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                PROTEÇÃO
              </span>

              <h2>
                Segurança das informações
              </h2>

              <p>
                Adotamos medidas técnicas e organizacionais
                compatíveis com a finalidade do tratamento
                para proteger as informações contra acessos
                não autorizados, perda, alteração, divulgação
                ou destruição indevida.
              </p>

              <p>
                O acesso às informações deverá ser limitado
                às pessoas que realmente necessitem delas
                para realizar suas atividades.
              </p>

            </div>

          </section>


          {/* =========================================
              07 — ARMAZENAMENTO
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              07
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                RETENÇÃO
              </span>

              <h2>
                Armazenamento e retenção
              </h2>

              <p>
                Os dados serão mantidos pelo período necessário
                para cumprir as finalidades para as quais foram
                coletados, atender obrigações legais e preservar
                direitos relacionados aos serviços prestados.
              </p>

              <p>
                Quando não houver mais necessidade de manter
                determinadas informações, elas poderão ser
                eliminadas ou anonimizadas, observadas as
                obrigações legais aplicáveis.
              </p>

            </div>

          </section>


          {/* =========================================
              08 — DIREITOS
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              08
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                SEUS DIREITOS
              </span>

              <h2>
                Seus direitos
              </h2>

              <p>
                Nos termos da legislação aplicável, você poderá
                exercer direitos relacionados aos seus dados
                pessoais, incluindo solicitar informações sobre
                o tratamento realizado e, quando cabível,
                solicitar correção, atualização ou eliminação
                dos dados.
              </p>

              <p>
                Algumas solicitações poderão estar sujeitas
                a limitações previstas em lei ou à necessidade
                de manutenção de determinadas informações para
                cumprimento de obrigações legais.
              </p>

            </div>

          </section>


          {/* =========================================
              09 — GOOGLE
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              09
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                AUTENTICAÇÃO
              </span>

              <h2>
                Conta Google
              </h2>

              <p>
                Para acessar a Anamnese, poderá ser solicitado
                que você realize a autenticação utilizando uma
                conta Google.
              </p>

              <p>
                A autenticação tem como finalidade identificar
                a pessoa que está acessando a ficha e permitir
                o funcionamento seguro do sistema. A KSA Studio
                não solicita nem armazena sua senha do Google.
              </p>

            </div>

          </section>


          {/* =========================================
              10 — ALTERAÇÕES
          ========================================= */}

          <section className="politica-section">

            <div className="politica-section-number">
              10
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                ATUALIZAÇÕES
              </span>

              <h2>
                Alterações nesta política
              </h2>

              <p>
                Esta Política de Privacidade poderá ser
                atualizada para refletir alterações nos
                serviços, nos procedimentos internos ou na
                legislação aplicável.
              </p>

              <p>
                Recomendamos que você consulte esta página
                periodicamente para verificar a versão mais
                recente da política.
              </p>

            </div>

          </section>


          {/* =========================================
              11 — CONTATO
          ========================================= */}

          <section className="politica-section politica-contact">

            <div className="politica-section-number">
              11
            </div>

            <div className="politica-section-content">

              <span className="politica-section-label">
                FALE CONOSCO
              </span>

              <h2>
                Contato
              </h2>

              <p>
                Caso tenha dúvidas sobre esta Política de
                Privacidade ou sobre o tratamento dos seus
                dados pessoais, entre em contato com a KSA
                Studio pelos canais oficiais de atendimento
                disponibilizados no site.
              </p>

              <div className="politica-update">

                <span>
                  ÚLTIMA ATUALIZAÇÃO
                </span>

                <strong>
                  AGOSTO · 2026
                </strong>

              </div>

            </div>

          </section>


          {/* =========================================
              VOLTAR
          ========================================= */}

          <div className="politica-back">

            <Link
              to="/anamnese"
              className="politica-back-button"
            >
              <span>←</span>
              VOLTAR PARA ANAMNESE
            </Link>

          </div>

        </article>

      </main>

      <Footer />

    </div>
  );
}