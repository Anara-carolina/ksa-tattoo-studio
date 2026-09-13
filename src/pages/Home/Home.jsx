import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFileAlt,
  FaArrowRight,
  FaTimes
} from "react-icons/fa";

import pantera from "../../assets/images/pantera.png";

// ======================================================
// FOTO DA ARTISTA
// ======================================================

import katarine from "../../assets/images/katarine.jpeg";

// ======================================================
// BLACKWORK
// ======================================================

import black0 from "../../assets/images/black0.jpeg";
import black1 from "../../assets/images/black1.jpeg";
import black2 from "../../assets/images/black2.jpeg";
import black3 from "../../assets/images/black3.jpeg";
import black4 from "../../assets/images/black4.jpeg";
import black5 from "../../assets/images/black5.jpeg";
import black6 from "../../assets/images/black6.jpeg";
import black7 from "../../assets/images/black7.jpeg";
import black8 from "../../assets/images/black8.jpeg";

// ======================================================
// OLD SCHOOL
// ======================================================

import old0 from "../../assets/images/old0.jpeg";
import old1 from "../../assets/images/old1.jpeg";
import old2 from "../../assets/images/old2.jpeg";
import old3 from "../../assets/images/old3.jpeg";
import old4 from "../../assets/images/old4.jpeg";
import old5 from "../../assets/images/old5.jpeg";
import old6 from "../../assets/images/old6.jpeg";
import old7 from "../../assets/images/old7.jpeg";
import old8 from "../../assets/images/old8.jpeg";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./Home.css";


// ======================================================
// COMPONENTE DE CADA ESTILO
// ======================================================

function StyleShowcase({
  nome,
  descricao,
  imagens = [],
  rota,
  placeholder = false
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages =
    Array.isArray(imagens) &&
    imagens.length > 0;


  // ====================================================
  // IMAGEM ANTERIOR
  // ====================================================

  const previousImage = () => {
    if (!hasImages) return;

    setIndex((current) => {
      if (current === 0) {
        return imagens.length - 1;
      }

      return current - 1;
    });
  };


  // ====================================================
  // PRÓXIMA IMAGEM
  // ====================================================

  const nextImage = () => {
    if (!hasImages) return;

    setIndex((current) => {
      if (current === imagens.length - 1) {
        return 0;
      }

      return current + 1;
    });
  };


  // ====================================================
  // SELECIONAR IMAGEM
  // ====================================================

  const selectImage = (imageIndex) => {
    setIndex(imageIndex);
  };


  // ====================================================
  // ABRIR LIGHTBOX
  // ====================================================

  const openLightbox = (imageIndex) => {
    setIndex(imageIndex);
    setLightboxOpen(true);
  };


  // ====================================================
  // FECHAR LIGHTBOX
  // ====================================================

  const closeLightbox = () => {
    setLightboxOpen(false);
  };


  // ====================================================
  // TECLADO
  // ====================================================

  useEffect(() => {
    if (!lightboxOpen) return;

    document.body.classList.add("lightbox-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.classList.remove(
        "lightbox-open"
      );
    };
  }, [lightboxOpen, imagens.length]);


  // ====================================================
  // LIGHTBOX
  // Renderizado diretamente no BODY
  // ====================================================

  const lightbox =
    lightboxOpen && hasImages
      ? (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada - ${nome}`}
          onClick={closeLightbox}
        >

          {/* ==========================================
              BOTÃO FECHAR
          ========================================== */}

          <button
            type="button"
            className="lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            aria-label="Fechar imagem ampliada"
          >
            <FaTimes />
          </button>


          {/* ==========================================
              SETA ESQUERDA
          ========================================== */}

          <button
            type="button"
            className="lightbox-arrow lightbox-arrow-left"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="Imagem anterior"
          >
            ‹
          </button>


          {/* ==========================================
              IMAGEM
          ========================================== */}

          <div
            className="lightbox-image-container"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >

            <img
              src={imagens[index].imagem}
              alt={`${imagens[index].alt} ampliada`}
              className="lightbox-image"
            />

            <div className="lightbox-caption">

              <span>
                {nome}
              </span>

              <small>
                {index + 1} / {imagens.length}
              </small>

            </div>

          </div>


          {/* ==========================================
              SETA DIREITA
          ========================================== */}

          <button
            type="button"
            className="lightbox-arrow lightbox-arrow-right"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="Próxima imagem"
          >
            ›
          </button>

        </div>
      )
      : null;


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>

      <section className="style-showcase">

        {/* ==================================================
            CABEÇALHO
        ================================================== */}

        <div className="style-showcase-header">

          <span className="style-showcase-small">
            KSA STUDIO
          </span>

          <div className="section-heading">

            <span className="ornament">
              ✦
            </span>

            <h2>
              {nome}
            </h2>

            <span className="ornament">
              ✦
            </span>

          </div>

          <p>
            {descricao}
          </p>

        </div>


        {/* ==================================================
            GRID DESKTOP
        ================================================== */}

        {hasImages && !placeholder && (

          <div className="style-showcase-grid">

            {imagens.map((imagem, imageIndex) => (

              <button
                type="button"
                className="style-showcase-grid-card"
                key={imageIndex}
                onClick={() =>
                  openLightbox(imageIndex)
                }
                aria-label={`Ampliar imagem ${
                  imageIndex + 1
                } de ${nome}`}
              >

                <img
                  src={imagem.imagem}
                  alt={`${imagem.alt} ${
                    imageIndex + 1
                  }`}
                />

                <span className="image-zoom-hint">
                  CLIQUE PARA AMPLIAR
                </span>

              </button>

            ))}

          </div>

        )}


        {/* ==================================================
            CARROSSEL MOBILE
        ================================================== */}

        {hasImages && !placeholder && (

          <div className="style-showcase-carousel">

            <button
              type="button"
              className="style-carousel-arrow style-carousel-prev"
              onClick={previousImage}
              aria-label={`Imagem anterior de ${nome}`}
            >
              ‹
            </button>


            <button
              type="button"
              className="style-carousel-frame"
              onClick={() =>
                openLightbox(index)
              }
              aria-label={`Ampliar imagem ${
                index + 1
              } de ${nome}`}
            >

              <img
                src={imagens[index].imagem}
                alt={`${imagens[index].alt} ${
                  index + 1
                }`}
              />

              <span className="mobile-zoom-hint">
                TOQUE PARA AMPLIAR
              </span>

            </button>


            <button
              type="button"
              className="style-carousel-arrow style-carousel-next"
              onClick={nextImage}
              aria-label={`Próxima imagem de ${nome}`}
            >
              ›
            </button>

          </div>

        )}


        {/* ==================================================
            CONTADOR
        ================================================== */}

        {hasImages && !placeholder && (

          <div className="style-carousel-counter">

            <span>
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="style-counter-line"></span>

            <span>
              {String(imagens.length).padStart(2, "0")}
            </span>

          </div>

        )}


        {/* ==================================================
            DOTS
        ================================================== */}

        {hasImages && !placeholder && (

          <div className="style-carousel-dots">

            {imagens.map((_, imageIndex) => (

              <button
                type="button"
                key={imageIndex}
                className={
                  index === imageIndex
                    ? "style-carousel-dot active"
                    : "style-carousel-dot"
                }
                onClick={() =>
                  selectImage(imageIndex)
                }
                aria-label={`Ver imagem ${
                  imageIndex + 1
                }`}
              />

            ))}

          </div>

        )}


        {/* ==================================================
            PLACEHOLDER
        ================================================== */}

        {placeholder && (

          <div className="style-showcase-placeholder">

            <span>
              GALERIA EM BREVE
            </span>

            <small>
              NOVAS TATUAGENS SERÃO ADICIONADAS AQUI
            </small>

          </div>

        )}


        {/* ==================================================
            BOTÃO PORTFÓLIO
        ================================================== */}

        <div className="style-showcase-actions">

          <Link
            to={rota}
            className="button-primary"
          >
            VER PORTFÓLIO {nome}

            <FaArrowRight />

          </Link>

        </div>

      </section>


      {/* ==================================================
          LIGHTBOX FORA DA SECTION
          DIRETO NO BODY
      ================================================== */}

      {lightbox &&
        typeof document !== "undefined" &&
        createPortal(
          lightbox,
          document.body
        )}

    </>
  );
}


// ======================================================
// HOME
// ======================================================

export default function Home() {

  // ====================================================
  // IMAGENS BLACKWORK
  // black0 é a primeira
  // ====================================================

  const blackworkImages = [
    {
      imagem: black0,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black1,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black2,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black3,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black4,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black5,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black6,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black7,
      alt: "Tatuagem Blackwork KSA Studio"
    },
    {
      imagem: black8,
      alt: "Tatuagem Blackwork KSA Studio"
    }
  ];


  // ====================================================
  // IMAGENS OLD SCHOOL
  // old0 até old8
  // ====================================================

  const oldSchoolImages = [
    {
      imagem: old0,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old1,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old2,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old3,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old4,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old5,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old6,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old7,
      alt: "Tatuagem Old School KSA Studio"
    },
    {
      imagem: old8,
      alt: "Tatuagem Old School KSA Studio"
    }
  ];


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="home">

      <Header />


      {/* ==================================================
          HERO
      ================================================== */}

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

            <Link
              to="/contato"
              className="button-primary"
            >
              SOLICITAR ORÇAMENTO
            </Link>

            <Link
              to="/portfolio"
              className="button-secondary"
            >
              VER PORTFÓLIO
            </Link>

          </div>

        </div>

      </section>


      {/* ==================================================
          ARTISTA
      ================================================== */}

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

          {/* ==========================================
              FOTO DA KATARINE
          ========================================== */}

          <div className="artist-image">

            <img
              src={katarine}
              alt="Katarine - Tatuadora e artista da KSA Studio"
              className="artist-photo"
            />

          </div>


          {/* ==========================================
              INFORMAÇÕES DA ARTISTA
          ========================================== */}

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


      {/* ==================================================
          ESTILOS
      ================================================== */}

      <section className="styles-section">

        <div className="section-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>
            CONHEÇA UM POUCO
            <br />
            DOS NOSSOS ESTILOS
          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <p className="section-description">
          Cada estilo possui sua própria identidade.
          Conheça um pouco das possibilidades que
          fazem parte da arte da KSA Studio.
        </p>


        {/* ==================================================
            BLACKWORK
        ================================================== */}

        <StyleShowcase
          nome="BLACKWORK"
          descricao="Uma estética marcada pelo preto, contraste e presença. Composições fortes, marcantes e cheias de personalidade."
          imagens={blackworkImages}
          rota="/portfolio/blackwork"
        />


        {/* ==================================================
            OLD SCHOOL
        ================================================== */}

        <StyleShowcase
          nome="OLD SCHOOL"
          descricao="Traços marcantes, formas tradicionais e uma estética clássica que atravessa gerações."
          imagens={oldSchoolImages}
          rota="/portfolio/old-school"
        />


        {/* ==================================================
            MAORI
        ================================================== */}

        <StyleShowcase
          nome="MAORI"
          descricao="Símbolos, formas e padrões que criam composições marcantes e cheias de personalidade."
          imagens={[]}
          rota="/portfolio/maori"
          placeholder
        />


        {/* ==================================================
            FINE LINE
        ================================================== */}

        <StyleShowcase
          nome="FINE LINE"
          descricao="Traços delicados e precisos para tatuagens leves, elegantes e cheias de detalhes."
          imagens={[]}
          rota="/portfolio/fine-line"
          placeholder
        />


        {/* ==================================================
            ORNAMENTAL
        ================================================== */}

        <StyleShowcase
          nome="ORNAMENTAL"
          descricao="Composições inspiradas em formas, simetria e detalhes ornamentais para criar desenhos únicos."
          imagens={[]}
          rota="/portfolio/ornamental"
          placeholder
        />


        {/* ==================================================
            PORTFÓLIO COMPLETO
        ================================================== */}

        <Link
          to="/portfolio"
          className="button-outline styles-main-button"
        >
          VER PORTFÓLIO COMPLETO

          <FaArrowRight />

        </Link>

      </section>


      {/* ==================================================
          TRABALHOS
      ================================================== */}

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


      {/* ==================================================
          FLASH
          SEM IMAGENS NA HOME
          AS IMAGENS FICAM NA PÁGINA /FLASH
      ================================================== */}

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
          Artes autorais criadas pela KSA Studio
          para quem busca uma tatuagem especial,
          pronta para ganhar vida na pele.
        </p>


        {/* ==================================================
            PREÇO
        ================================================== */}

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
            Para tatuagens de aproximadamente até{" "}
            <strong>
              8 cm
            </strong>.
          </p>

          <p className="flash-observation">
            Outros tamanhos, alterações no desenho
            ou artes com mais detalhes podem ter
            valores diferentes.
          </p>

        </div>


        {/* ==================================================
            AÇÕES FLASH
        ================================================== */}

        <div className="flash-actions">

          {/* ==============================================
              VER AS ARTES FLASH
          ============================================== */}

          <Link
            to="/flash"
            className="button-outline"
          >
            VER FLASH DISPONÍVEIS

            <FaArrowRight />

          </Link>


          {/* ==============================================
              AGENDAMENTO
          ============================================== */}

          <Link
            to="/agendamento"
            className="button-primary"
          >
            AGENDAR FLASH

            <FaArrowRight />

          </Link>


          {/* ==================================================
              ESSA PARTE FICA DESATIVADA POR ENQUANTO
              NÃO APARECE NA HOME
          ================================================== */}

          {/*
          <p className="flash-budget-text">
            Gostou de uma Flash, mas quer outro tamanho?
            Ou tem outra ideia?
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
          */}

        </div>

      </section>


      {/* ==================================================
          ORÇAMENTO
          AGORA FICA ABAIXO DAS FLASH
      ================================================== */}

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

            {/* ==========================================
                WHATSAPP
            ========================================== */}

            <div className="budget-card">

              <FaWhatsapp />

              <h3>
                WHATSAPP
              </h3>

              <p>
                Converse diretamente com a artista.
              </p>

            </div>


            {/* ==========================================
                E-MAIL
            ========================================== */}

            <div className="budget-card">

              <FaEnvelope />

              <h3>
                E-MAIL
              </h3>

              <p>
                Envie sua ideia e referências.
              </p>

            </div>


            {/* ==========================================
                FORMULÁRIO
            ========================================== */}

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


      {/* ==================================================
          ESTÚDIO
      ================================================== */}

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


      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />


      {/* ==================================================
          WHATSAPP FLUTUANTE
      ================================================== */}

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