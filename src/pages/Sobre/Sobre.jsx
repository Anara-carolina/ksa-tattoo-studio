
import { Link } from "react-router-dom";
import { FaArrowRight, FaInstagram, FaWhatsapp } from "react-icons/fa";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PantherHero from "../../components/PantherHero/PantherHero";

import katarine from "../../assets/images/katarine.jpeg";

import "./Sobre.css";

export default function Sobre() {
  return (
    <div className="sobre-page">

      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <PantherHero>

        <span className="sobre-small">
          KSA STUDIO
        </span>

        <div className="sobre-heading">

          <span className="ornament">
            ✦
          </span>

          <h1>
            SOBRE
            <br />
            <span>A ARTISTA</span>
          </h1>

          <span className="ornament">
            ✦
          </span>

        </div>

        <p>
          Conheça um pouco da minha história,
          <br />
          da minha arte e do meu trabalho.
        </p>

      </PantherHero>


      {/* =====================================================
          INTRODUÇÃO
      ===================================================== */}

      <section className="sobre-intro">

        <span className="sobre-label">
          KSA STUDIO
        </span>

        <h2>
          ARTE QUE NASCE
          <br />
          <span>DO TRAÇO.</span>
        </h2>

        <div className="sobre-intro-line"></div>

        <p>
          Antes de encontrar a pele como tela, a arte já fazia parte da minha
          história.
        </p>

      </section>


      {/* =====================================================
          ARTISTA
      ===================================================== */}

      <section className="sobre-artista">

        <div className="sobre-artista-container">

          {/* FOTO */}

          <div className="sobre-artista-image">

            <img
              src={katarine}
              alt="Katarine - Tatuadora e artista da KSA Studio"
            />

            <div className="sobre-image-frame"></div>

            <div className="sobre-image-caption">
              <span>KATARINE</span>
              <small>TATUADORA & ARTISTA</small>
            </div>

          </div>


          {/* TEXTO */}

          <div className="sobre-artista-content">

            <span className="sobre-label">
              SOBRE MIM
            </span>

            <h2>
              Katarine
            </h2>

            <span className="sobre-role">
              Tatuadora e artista
            </span>

            <p>
              Desde pequena, eu já encontrava nos riscos e rabiscos uma forma
              de expressão. O que começou de maneira simples, quase como uma
              brincadeira, foi se transformando com o tempo em um olhar atento
              para o desenho, para as formas e para a maneira como a arte pode
              ocupar diferentes espaços.
            </p>

            <p>
              Com o passar dos anos, percebi que desenhar era muito mais do que
              simplesmente colocar uma ideia no papel. Era uma maneira de
              expressar aquilo que eu sentia, imaginava e enxergava no mundo.
            </p>

            <p>
              Hoje, essa paixão encontra na pele uma nova dimensão.
            </p>

            <p>
              Para mim, tatuar não é apenas desenhar. É transformar uma ideia,
              uma história ou um sentimento em algo que passa a fazer parte de
              alguém.
            </p>

            <p>
              Cada tatuagem carrega uma escolha. Pode representar um momento,
              uma fase, uma conquista, uma lembrança ou simplesmente a vontade
              de expressar quem se é.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          LIBERDADE
      ===================================================== */}

      <section className="sobre-liberdade">

        <div className="sobre-liberdade-content">

          <span className="sobre-liberdade-symbol">
            ✦
          </span>

          <span className="sobre-label">
            EXPRESSÃO
          </span>

          <h2>
            UMA ARTE QUE
            <br />
            <span>TAMBÉM É LIBERDADE.</span>
          </h2>

          <p>
            Como mulher e artista, acredito na força de ocupar espaços, criar
            minha própria identidade e transformar a arte em uma forma de
            expressão e empoderamento.
          </p>

          <p>
            Acredito que a pele se torna uma tela viva — e que cada pessoa tem
            o direito de escolher o que quer carregar nela.
          </p>

          <p>
            Para mim, tatuar também é sobre liberdade. Liberdade para marcar o
            próprio corpo, contar a própria história e enxergar beleza nas
            próprias escolhas.
          </p>

          <div className="sobre-quote">

            <span>“</span>

            <p>
              É sobre transformar o corpo em arte sem deixar de ser você.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          DO TRAÇO PARA A PELE
      ===================================================== */}

      <section className="sobre-traco">

        <div className="sobre-traco-container">

          <div className="sobre-traco-content">

            <span className="sobre-label">
              O MEU TRABALHO
            </span>

            <h2>
              DO TRAÇO
              <br />
              <span>PARA A PELE.</span>
            </h2>

            <p>
              Meu trabalho une técnica, criatividade e sensibilidade para
              criar tatuagens que tenham personalidade e significado.
            </p>

            <p>
              Entre traços marcantes e detalhes delicados, cada projeto é
              pensado para respeitar a história e a individualidade de quem
              escolhe tatuar comigo.
            </p>

            <p>
              Gosto de entender a ideia de cada pessoa e transformar aquilo
              que ela imagina em uma arte que realmente faça sentido para ela.
            </p>

            <p>
              Para mim, cada tatuagem é uma construção entre artista e cliente.
              É nesse encontro que uma ideia deixa de ser apenas um desenho e
              passa a fazer parte da pele.
            </p>

          </div>


          <div className="sobre-traco-decoration">

            <div className="sobre-circle"></div>

            <span className="sobre-decoration-text">
              ARTE
            </span>

            <span className="sobre-decoration-small">
              IDENTIDADE • EXPRESSÃO • PELE
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          ATENDIMENTOS
      ===================================================== */}

      <section className="sobre-atendimento">

        <span className="sobre-label">
          ONDE ESTOU
        </span>

        <div className="sobre-atendimento-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>
            ONDE
            <br />
            <span>VOCÊ ME ENCONTRA</span>
          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <div className="sobre-locations">

          <div className="sobre-location">

            <span className="location-number">
              01
            </span>

            <div>

              <span className="location-label">
                ATENDIMENTO
              </span>

              <h3>
                UBERABA
              </h3>

              <p>
                MINAS GERAIS
              </p>

            </div>

          </div>


          <div className="sobre-location">

            <span className="location-number">
              02
            </span>

            <div>

              <span className="location-label">
                ATENDIMENTO
              </span>

              <h3>
                SÃO PAULO
              </h3>

              <p>
                CAPITAL
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="sobre-cta">

        <div className="sobre-cta-content">

          <span className="sobre-small">
            KSA STUDIO
          </span>

          <h2>
            SUA HISTÓRIA.
            <br />
            <span>SUA PELE. SUA ARTE.</span>
          </h2>

          <p>
            Agora que você conhece um pouco mais sobre mim, conheça também
            meu trabalho e as tatuagens que crio na KSA Studio.
          </p>


          <div className="sobre-cta-buttons">

            <Link
              to="/portfolio"
              className="sobre-button-primary"
            >
              VER PORTFÓLIO
              <FaArrowRight />
            </Link>

            <Link
              to="/agendamento"
              className="sobre-button-outline"
            >
              AGENDAR TATUAGEM
              <FaArrowRight />
            </Link>

          </div>


          <div className="sobre-social">

            <a
              href="#"
              aria-label="Instagram KSA Studio"
              className="sobre-social-link"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="WhatsApp KSA Studio"
              className="sobre-social-link"
            >
              <FaWhatsapp />
            </a>

          </div>

        </div>

      </section>


      <Footer />

    </div>
  );
}
