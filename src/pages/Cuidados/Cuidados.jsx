import {
  FaSun,
  FaTint,
  FaHandSparkles,
  FaBan,
  FaHeart,
  FaExclamationTriangle,
  FaMoon,
  FaShower,
  FaSwimmingPool,
  FaHotTub,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PantherHero from "../../components/PantherHero/PantherHero";

import "./Cuidados.css";


export default function Cuidados() {

  return (

    <div className="cuidados">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />


      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ===================================================== */}

      <main className="cuidados-main">


        {/* =====================================================
            HERO
        ===================================================== */}

        <PantherHero>

          <span className="cuidados-small">
            KSA STUDIO
          </span>


          <div className="cuidados-heading">

            <span className="ornament">
              ✦
            </span>

            <h1>
              CUIDADOS
              <br />
              <span>COM A TATUAGEM</span>
            </h1>

            <span className="ornament">
              ✦
            </span>

          </div>


          <p className="cuidados-intro">

            Sua tatuagem continua sendo cuidada
            depois que você sai do estúdio.
            Seguir corretamente as orientações
            ajuda a preservar a arte e favorece
            uma boa cicatrização.

          </p>

        </PantherHero>



        {/* =====================================================
            AVISO IMPORTANTE
        ===================================================== */}

        <section className="cuidados-aviso">

          <div className="aviso-icon">
            <FaHeart />
          </div>


          <div>

            <span className="aviso-label">
              IMPORTANTE
            </span>

            <p>

              Siga sempre as orientações específicas
              fornecidas pela sua tatuadora, especialmente
              em relação ao curativo e aos produtos
              indicados para sua tatuagem.

            </p>

          </div>

        </section>



        {/* =====================================================
            ANTES DA TATUAGEM
        ===================================================== */}

        <section className="cuidados-section">

          <div className="section-title">

            <span className="ornament">
              ✦
            </span>

            <div>

              <h2>
                ANTES DA TATUAGEM
              </h2>

            </div>

          </div>


          <p className="section-description">

            Alguns cuidados antes do procedimento
            podem contribuir para que você tenha
            uma experiência mais confortável.

          </p>


          <div className="cuidados-grid">


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaTint />
              </div>

              <h3>
                HIDRATE-SE
              </h3>

              <p>
                Mantenha uma boa hidratação antes
                do procedimento.
              </p>

            </article>


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaCheckCircle />
              </div>

              <h3>
                ALIMENTE-SE
              </h3>

              <p>
                Faça uma refeição adequada antes
                de realizar sua tatuagem.
              </p>

            </article>


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaMoon />
              </div>

              <h3>
                DESCANSE
              </h3>

              <p>
                Procure chegar ao procedimento
                descansado(a).
              </p>

            </article>


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaBan />
              </div>

              <h3>
                EVITE ÁLCOOL
              </h3>

              <p>
                Evite consumir álcool antes
                do procedimento.
              </p>

            </article>

          </div>

        </section>



        {/* =====================================================
            NO DIA
        ===================================================== */}

        <section className="cuidados-section cuidados-section-dark">

          <div className="section-title">

            <span className="ornament">
              ✦
            </span>

            <div>

              <h2>
                NO DIA DO PROCEDIMENTO
              </h2>

            </div>

          </div>


          <div className="lista-cuidados">

            <div className="lista-item">

              <FaCheckCircle />

              <p>
                Compareça com a região da tatuagem
                limpa e sem produtos desnecessários.
              </p>

            </div>


            <div className="lista-item">

              <FaCheckCircle />

              <p>
                Use roupas confortáveis e que não
                causem atrito desnecessário na região.
              </p>

            </div>


            <div className="lista-item">

              <FaCheckCircle />

              <p>
                Informe à tatuadora qualquer situação
                ou condição que possa interferir
                no procedimento.
              </p>

            </div>


            <div className="lista-item">

              <FaCheckCircle />

              <p>
                Tire todas as suas dúvidas antes
                de iniciar o procedimento.
              </p>

            </div>

          </div>

        </section>



        {/* =====================================================
            PRIMEIRAS HORAS
        ===================================================== */}

        <section className="cuidados-section">

          <div className="section-title">

            <span className="ornament">
              ✦
            </span>

            <div>

              <h2>
                PRIMEIRAS HORAS
              </h2>

            </div>

          </div>


          <p className="section-description">

            Ao terminar o procedimento, sua tatuadora
            irá orientar você sobre o curativo e os
            cuidados iniciais.

          </p>


          <div className="destaque-box">

            <FaHandSparkles />

            <div>

              <h3>
                SIGA A ORIENTAÇÃO DO ESTÚDIO
              </h3>

              <p>

                O período de permanência do curativo
                e a forma correta de higienização podem
                variar de acordo com o método utilizado.
                Por isso, siga a orientação específica
                recebida no atendimento.

              </p>

            </div>

          </div>

        </section>



        {/* =====================================================
            CICATRIZAÇÃO
        ===================================================== */}

        <section className="cuidados-section cuidados-section-dark">

          <div className="section-title">

            <span className="ornament">
              ✦
            </span>

            <div>

              <h2>
                DURANTE A CICATRIZAÇÃO
              </h2>

            </div>

          </div>


          <div className="cuidados-grid">


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaShower />
              </div>

              <h3>
                HIGIENE
              </h3>

              <p>
                Higienize a região de maneira suave,
                seguindo as orientações recebidas.
              </p>

            </article>


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaHandSparkles />
              </div>

              <h3>
                NÃO COCE
              </h3>

              <p>
                Evite coçar, esfregar ou manipular
                a tatuagem desnecessariamente.
              </p>

            </article>


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaSun />
              </div>

              <h3>
                PROTEJA DO SOL
              </h3>

              <p>
                Evite exposição solar direta durante
                o período de cicatrização.
              </p>

            </article>


            <article className="cuidado-card">

              <div className="cuidado-icon">
                <FaTint />
              </div>

              <h3>
                HIDRATE
              </h3>

              <p>
                Utilize somente os produtos e a forma
                de aplicação recomendados pela tatuadora.
              </p>

            </article>

          </div>

        </section>



        {/* =====================================================
            O QUE EVITAR
        ===================================================== */}

        <section className="evitar-section">

          <div className="section-title section-title-center">

            <span className="ornament">
              ✦
            </span>

            <div>

              <h2>
                O QUE EVITAR
              </h2>

            </div>

            <span className="ornament">
              ✦
            </span>

          </div>


          <div className="evitar-grid">


            <div className="evitar-card">

              <FaSun />

              <h3>
                SOL
              </h3>

              <p>
                Evite exposição solar direta
                durante a cicatrização.
              </p>

            </div>


            <div className="evitar-card">

              <FaSwimmingPool />

              <h3>
                PISCINA
              </h3>

              <p>
                Evite piscina enquanto a tatuagem
                estiver cicatrizando.
              </p>

            </div>


            <div className="evitar-card">

              <FaSwimmingPool />

              <h3>
                MAR
              </h3>

              <p>
                Evite entrar no mar durante
                o período de cicatrização.
              </p>

            </div>


            <div className="evitar-card">

              <FaHotTub />

              <h3>
                SAUNA
              </h3>

              <p>
                Evite sauna e situações de
                exposição intensa ao calor.
              </p>

            </div>


            <div className="evitar-card">

              <FaHandSparkles />

              <h3>
                COÇAR
              </h3>

              <p>
                Não coce nem retire pelinhas
                ou crostas da tatuagem.
              </p>

            </div>


            <div className="evitar-card">

              <FaBan />

              <h3>
                PRODUTOS
              </h3>

              <p>
                Não utilize produtos que não
                tenham sido recomendados.
              </p>

            </div>

          </div>

        </section>



        {/* =====================================================
            SINAIS DE ATENÇÃO
        ===================================================== */}

        <section className="atencao-section">

          <div className="atencao-header">

            <FaExclamationTriangle />

            <div>

              <h2>
                SINAIS DE ATENÇÃO
              </h2>

            </div>

          </div>


          <p>

            Algumas reações podem fazer parte do processo
            de cicatrização. Porém, se você perceber algo
            que pareça intenso, persistente ou esteja piorando,
            procure orientação profissional de saúde.

          </p>


          <div className="atencao-lista">

            <span>
              • Vermelhidão intensa ou que aumenta
            </span>

            <span>
              • Dor que piora significativamente
            </span>

            <span>
              • Inchaço importante ou persistente
            </span>

            <span>
              • Secreção incomum
            </span>

            <span>
              • Febre ou mal-estar
            </span>

          </div>

        </section>



        {/* =====================================================
            DEPOIS DA CICATRIZAÇÃO
        ===================================================== */}

        <section className="cuidados-section">

          <div className="section-title">

            <span className="ornament">
              ✦
            </span>

            <div>

              <h2>
                DEPOIS DA CICATRIZAÇÃO
              </h2>

            </div>

          </div>


          <p className="section-description">

            Mesmo depois de cicatrizada, sua tatuagem
            merece cuidados para preservar a aparência
            da arte ao longo do tempo.

          </p>


          <div className="final-cuidados">

            <div>

              <FaSun />

              <h3>
                PROTEÇÃO SOLAR
              </h3>

              <p>
                A exposição solar pode contribuir
                para o desbotamento da tatuagem.
                Proteja sua pele quando estiver
                exposta ao sol.
              </p>

            </div>


            <div>

              <FaTint />

              <h3>
                HIDRATAÇÃO
              </h3>

              <p>
                Manter a pele hidratada ajuda a
                conservar uma aparência saudável.
              </p>

            </div>

          </div>

        </section>



        {/* =====================================================
            FINAL
        ===================================================== */}

        <section className="cuidados-final">

          <span className="documentacao-small">
            KSA STUDIO
          </span>


          <div className="final-ornament">
            ✦
          </div>


          <h2>

            SUA ARTE
            <br />

            <span>
              MERECE CUIDADO.
            </span>

          </h2>


          <p>

            Em caso de dúvidas sobre sua cicatrização
            ou sobre os cuidados específicos da sua tatuagem,
            entre em contato com o KSA Studio.

          </p>


          <div className="final-heart">
            ♥
          </div>

        </section>


      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>

  );

}