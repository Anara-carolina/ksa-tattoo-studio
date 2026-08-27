import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFileAlt,
  FaArrowRight
} from "react-icons/fa";

import logo from "../../assets/images/logo.png";
import pantera from "../../assets/images/pantera.png";
import luaFlash from "../../assets/images/luaflash.png";
import panteraFlash from "../../assets/images/panteraflash.png";
import rosaFlash from "../../assets/images/rosaflash.png";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./Home.css";


export default function Home() {

  return (

    <div className="home">

      <Header />


      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div className="header-button-placeholder"></div>


        <img
          src={logo}
          alt="KSA Studio"
          className="logo"
        />


        <Link
          to="/agendamento"
          className="header-button"
          aria-label="Agendar tatuagem"
        >

          <FaCalendarAlt />

        </Link>

      </header>



      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <img
          src={pantera}
          alt="Arte de pantera"
          className="hero-pantera"
        />

        <div className="hero-overlay"></div>


        <div className="hero-content">

          <span className="hero-small">
            KSA STUDIO
          </span>


          <h1>

            ARTE NA PELE,
            <br />

            HISTÓRIAS PRA

            <span> VIDA.</span>

          </h1>


          <p>

            Tatuagens autorais com significado,
            excelência e intenção em cada traço.

          </p>


          <div className="hero-buttons">

            <button className="button-primary">

              SOLICITAR ORÇAMENTO

            </button>


            <Link
              to="/portfolio"
              className="button-secondary"
            >

              VER PORTFÓLIO

            </Link>

          </div>

        </div>

      </section>



      {/* =========================
          ESTILOS
      ========================= */}

      <section className="styles-section">

        <div className="section-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>
            NOSSOS ESTILOS
          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <div className="styles-grid">


          {/* FINE LINE */}

          <Link
            to="/portfolio/fine-line"
            className="style-card"
          >

            <div className="style-icon">
              ◈
            </div>

            <span>
              FINE LINE
            </span>

          </Link>



          {/* BLACKWORK */}

          <Link
            to="/portfolio/blackwork"
            className="style-card"
          >

            <div className="style-icon">
              ✧
            </div>

            <span>
              BLACKWORK
            </span>

          </Link>



          {/* REALISMO */}

          <Link
            to="/portfolio/realismo"
            className="style-card"
          >

            <div className="style-icon">
              ◉
            </div>

            <span>
              REALISMO
            </span>

          </Link>



          {/* FLORAIS */}

          <Link
            to="/portfolio/florais"
            className="style-card"
          >

            <div className="style-icon">
              ❀
            </div>

            <span>
              FLORAIS
            </span>

          </Link>



          {/* GEOMÉTRICO */}

          <Link
            to="/portfolio/geometrico"
            className="style-card"
          >

            <div className="style-icon">
              ✦
            </div>

            <span>
              GEOMÉTRICO
            </span>

          </Link>



          {/* AUTORAIS */}

          <Link
            to="/portfolio/autorais"
            className="style-card"
          >

            <div className="style-icon">
              ♢
            </div>

            <span>
              AUTORAIS
            </span>

          </Link>

        </div>


        <Link
          to="/portfolio"
          className="button-outline"
        >

          VER TODOS OS ESTILOS

        </Link>

      </section>



      {/* =========================
          ARTISTA
      ========================= */}

      <section className="artist-section">

        <div className="section-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>
            CONHEÇA A ARTISTA
          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <div className="artist-content">


          <div className="artist-image">

            <div className="artist-image-placeholder">

              <span>
                FOTO DA ARTISTA
              </span>

            </div>

          </div>


          <div className="artist-info">

            <span className="artist-label">
              KSA STUDIO
            </span>


            <h3>
              Katarine
            </h3>


            <p className="artist-role">
              Tatuadora e artista
            </p>


            <p>

              Apaixonada por transformar histórias,
              sentimentos e ideias em arte na pele.
              Cada tatuagem é criada com intenção,
              cuidado e personalidade.

            </p>


            <Link
              to="/sobre"
              className="button-outline"
            >

              CONHECER MINHA HISTÓRIA

              <FaArrowRight />

            </Link>

          </div>

        </div>

      </section>



      {/* =========================
          ORÇAMENTO
      ========================= */}

      <section className="budget-section">

        <div className="budget-content">

          <span className="budget-small">
            SUA IDEIA COMEÇA AQUI
          </span>


          <h2>

            TEM UMA IDEIA?

            <br />

            <span>
              VAMOS TRANSFORMÁ-LA EM ARTE.
            </span>

          </h2>


          <p>

            Conte para nós o que você imaginou
            e vamos construir juntos uma tatuagem
            única para você.

          </p>


          <div className="budget-options">


            <div className="budget-card">

              <FaWhatsapp />

              <h3>
                WHATSAPP
              </h3>

              <p>
                Converse diretamente com a artista.
              </p>

            </div>


            <div className="budget-card">

              <FaEnvelope />

              <h3>
                E-MAIL
              </h3>

              <p>
                Envie sua ideia e referências.
              </p>

            </div>


            <div className="budget-card">

              <FaFileAlt />

              <h3>
                FORMULÁRIO
              </h3>

              <p>
                Conte todos os detalhes da tatuagem.
              </p>

            </div>

          </div>


          <Link
            to="/contato"
            className="button-primary"
          >

            SOLICITAR ORÇAMENTO

          </Link>

        </div>

      </section>



      {/* =========================
          TRABALHOS
      ========================= */}

      <section className="works-section">

        <div className="section-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>

            TRABALHOS QUE
            <br />
            CONTAM HISTÓRIAS

          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <p className="section-description">

          Cada traço carrega intenção,
          cada detalhe, significado.
          Conheça alguns dos nossos
          trabalhos autorais.

        </p>


        <div className="works-grid">


          <div className="work-card">

            <span>
              TRABALHO 01
            </span>

          </div>


          <div className="work-card">

            <span>
              TRABALHO 02
            </span>

          </div>


          <div className="work-card">

            <span>
              TRABALHO 03
            </span>

          </div>


          <div className="work-card">

            <span>
              TRABALHO 04
            </span>

          </div>


        </div>


        <Link
          to="/portfolio"
          className="button-secondary"
        >

          VER PORTFÓLIO

        </Link>

      </section>



      {/* =========================
          FLASH
      ========================= */}

      <section className="flash-section">

        <div className="section-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>
            TATUAGENS FLASH
          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <p className="section-description">

          Algumas inspirações das nossas
          Flash autorais, criadas para quem
          busca uma tatuagem especial.

        </p>


        <div className="flash-preview">


          <div className="flash-preview-card">

            <img
              src={luaFlash}
              alt="Tatuagem Flash de lua"
            />

          </div>


          <div className="flash-preview-card">

            <img
              src={panteraFlash}
              alt="Tatuagem Flash de pantera"
            />

          </div>


          <div className="flash-preview-card">

            <img
              src={rosaFlash}
              alt="Tatuagem Flash de rosa"
            />

          </div>

        </div>


        <div className="flash-price">

          <span className="flash-label">
            FLASH KSA
          </span>


          <h3>
            A PARTIR DE
          </h3>


          <strong>
            R$ 150
          </strong>


          <p>

            Para tatuagens de aproximadamente
            até <strong>8 cm</strong>.

          </p>


          <p className="flash-observation">

            Outros tamanhos, alterações no desenho
            ou artes com mais detalhes podem ter
            valores diferentes.

          </p>

        </div>


        <div className="flash-actions">


          <Link
            to="/agendamento"
            className="button-primary"
          >

            AGENDAR FLASH

          </Link>


          <p className="flash-budget-text">

            Gostou de uma Flash, mas quer outro
            tamanho? Ou tem outra ideia?

            <br />

            <span>
              Solicite um orçamento e envie sua ideia.
            </span>

          </p>


          <Link
            to="/contato"
            className="button-outline"
          >

            SOLICITAR ORÇAMENTO

          </Link>

        </div>

      </section>



      {/* =========================
          ESTÚDIO
      ========================= */}

      <section className="studio-section">

        <div className="studio-content">

          <span className="studio-small">
            KSA STUDIO
          </span>


          <h2>
            NOSSO ESTÚDIO
          </h2>


          <div className="studio-info">

            <div>

              <FaMapMarkerAlt />

              <span>
                São Paulo - SP | Uberaba - MG
              </span>

            </div>


            <div>

              <FaWhatsapp />

              <span>
                WhatsApp
              </span>

            </div>


            <div>

              <FaInstagram />

              <span>
                Instagram
              </span>

            </div>

          </div>

        </div>

      </section>



      {/* =========================
          FOOTER COMPONENTE
      ========================= */}

      <Footer />



      {/* =========================
          WHATSAPP FLUTUANTE
      ========================= */}

      <a
        href="#"
        className="whatsapp-button"
        aria-label="WhatsApp"
      >

        <FaWhatsapp />

      </a>


    </div>

  );

}