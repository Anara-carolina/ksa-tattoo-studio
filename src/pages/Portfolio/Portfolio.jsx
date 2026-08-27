import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

import floral from "../../assets/images/floral.png";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./Portfolio.css";


export default function Portfolio() {

  // =========================================================
  // ROTAS
  // =========================================================

  const { estilo } = useParams();
  const navigate = useNavigate();


  // =========================================================
  // CARROSSEL PRINCIPAL
  // =========================================================

  const [carouselIndex, setCarouselIndex] = useState(0);


  // =========================================================
  // MODAL
  // =========================================================

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  // =========================================================
  // ESTILOS DO PORTFÓLIO
  // =========================================================

  const estilos = [

    {
      slug: "florais",
      nome: "FLORAIS",
      descricao:
        "Tatuagens florais autorais, delicadas e cheias de significado.",
      imagem: floral
    },

    {
      slug: "delicadas",
      nome: "DELICADAS",
      descricao:
        "Traços leves e sutis para tatuagens delicadas e cheias de personalidade.",
      imagem: floral
    },

    {
      slug: "blackwork",
      nome: "BLACKWORK",
      descricao:
        "Contraste, força e personalidade em trabalhos marcantes.",
      imagem: floral
    },

    {
      slug: "realismo",
      nome: "REALISMO",
      descricao:
        "Trabalhos ricos em detalhes, profundidade e expressão.",
      imagem: floral
    },

    {
      slug: "lettering",
      nome: "LETTERING",
      descricao:
        "Palavras, frases e significados transformados em arte na pele.",
      imagem: floral
    },

    {
      slug: "autorais",
      nome: "AUTORAIS",
      descricao:
        "Criações exclusivas desenvolvidas especialmente pela KSA Studio.",
      imagem: floral
    }

  ];


  // =========================================================
  // FOTOS DE CADA ESTILO
  // =========================================================

  const fotosPorEstilo = {

    florais: [
      floral,
      floral,
      floral,
      floral,
      floral,
      floral
    ],

    delicadas: [
      floral,
      floral,
      floral,
      floral,
      floral,
      floral
    ],

    blackwork: [
      floral,
      floral,
      floral,
      floral,
      floral,
      floral
    ],

    realismo: [
      floral,
      floral,
      floral,
      floral,
      floral,
      floral
    ],

    lettering: [
      floral,
      floral,
      floral,
      floral,
      floral,
      floral
    ],

    autorais: [
      floral,
      floral,
      floral,
      floral,
      floral,
      floral
    ]

  };


  // =========================================================
  // ESTILO ATUAL DA URL
  // =========================================================

  const estiloAtual = estilos.find(
    (item) => item.slug === estilo
  );


  // =========================================================
  // SINCRONIZA O CARROSSEL COM A URL
  // =========================================================

  useEffect(() => {

    if (!estilo) {

      setCarouselIndex(0);

      return;

    }


    const index = estilos.findIndex(
      (item) => item.slug === estilo
    );


    if (index !== -1) {

      setCarouselIndex(index);

    }

  }, [estilo]);


  // =========================================================
  // FOTOS DO ESTILO ATUAL
  // =========================================================

  const fotosAtuais =
    fotosPorEstilo[estilo] || fotosPorEstilo.florais;


  // =========================================================
  // ESTILO MOSTRADO NO CARROSSEL
  // =========================================================

  const estiloCarousel =
    estiloAtual || estilos[carouselIndex];


  // =========================================================
  // PRÓXIMO ESTILO
  // =========================================================

  function nextCarousel() {

    const nextIndex =
      (carouselIndex + 1) % estilos.length;


    setCarouselIndex(nextIndex);


    navigate(
      `/portfolio/${estilos[nextIndex].slug}`
    );

  }


  // =========================================================
  // ESTILO ANTERIOR
  // =========================================================

  function previousCarousel() {

    const previousIndex =
      (carouselIndex - 1 + estilos.length) %
      estilos.length;


    setCarouselIndex(previousIndex);


    navigate(
      `/portfolio/${estilos[previousIndex].slug}`
    );

  }


  // =========================================================
  // IR DIRETAMENTE PARA UM ESTILO
  // =========================================================

  function goToStyle(index) {

    setCarouselIndex(index);


    navigate(
      `/portfolio/${estilos[index].slug}`
    );

  }


  // =========================================================
  // ABRIR FOTO DO MODAL
  // =========================================================

  function openImage(index) {

    setCurrentIndex(index);


    setSelectedImage(
      fotosAtuais[index]
    );

  }


  // =========================================================
  // FECHAR MODAL
  // =========================================================

  function closeImage() {

    setSelectedImage(null);

  }


  // =========================================================
  // PRÓXIMA FOTO DO MODAL
  // =========================================================

  function nextImage(event) {

    if (event) {

      event.stopPropagation();

    }


    const nextIndex =
      (currentIndex + 1) %
      fotosAtuais.length;


    setCurrentIndex(nextIndex);


    setSelectedImage(
      fotosAtuais[nextIndex]
    );

  }


  // =========================================================
  // FOTO ANTERIOR DO MODAL
  // =========================================================

  function previousImage(event) {

    if (event) {

      event.stopPropagation();

    }


    const previousIndex =
      (currentIndex - 1 + fotosAtuais.length) %
      fotosAtuais.length;


    setCurrentIndex(previousIndex);


    setSelectedImage(
      fotosAtuais[previousIndex]
    );

  }


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="portfolio">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="portfolio-hero">

        <div className="portfolio-hero-overlay"></div>


        <div className="portfolio-hero-content">

          <span>
            KSA STUDIO
          </span>


          <h1>
            PORTFÓLIO
          </h1>


          <div className="portfolio-ornament">
            ✦ ───────── ✦
          </div>


          <p>
            Arte autoral criada para contar
            histórias através da pele.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <main className="portfolio-content">


        {/* ===================================================
            TÍTULO
        =================================================== */}

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


        <p className="portfolio-description">

          Explore os estilos da KSA Studio
          e conheça os trabalhos desenvolvidos
          em cada linguagem artística.

        </p>


        {/* ===================================================
            CARROSSEL PRINCIPAL
        =================================================== */}

        <section className="portfolio-carousel">


          <div className="portfolio-card">

            <img
              src={estiloCarousel.imagem}
              alt={`Tatuagem ${estiloCarousel.nome}`}
            />


            <div className="portfolio-card-info">

              <span>
                KSA STUDIO
              </span>


              <h3>
                {estiloCarousel.nome}
              </h3>


              <p>
                {estiloCarousel.descricao}
              </p>


              <Link
                to={`/portfolio/${estiloCarousel.slug}`}
                className="carousel-style-button"
              >

                VER {estiloCarousel.nome}

              </Link>

            </div>

          </div>


          {/* BOTÃO ANTERIOR */}

          <button
            type="button"
            className="carousel-button previous"
            onClick={previousCarousel}
            aria-label="Estilo anterior"
          >

            <FaChevronLeft />

          </button>


          {/* BOTÃO PRÓXIMO */}

          <button
            type="button"
            className="carousel-button next"
            onClick={nextCarousel}
            aria-label="Próximo estilo"
          >

            <FaChevronRight />

          </button>


          {/* INDICADORES */}

          <div className="carousel-indicators">

            {estilos.map((item, index) => (

              <button
                type="button"
                key={item.slug}
                className={
                  index === carouselIndex
                    ? "active"
                    : ""
                }
                onClick={() =>
                  goToStyle(index)
                }
                aria-label={`Ir para ${item.nome}`}
              />

            ))}

          </div>

        </section>


        {/* =====================================================
            PÁGINA DO ESTILO
        ===================================================== */}

        {estiloAtual && (

          <section className="portfolio-style-page">


            <div className="section-heading">

              <span className="ornament">
                ✦
              </span>


              <h2>
                {estiloAtual.nome}
              </h2>


              <span className="ornament">
                ✦
              </span>

            </div>


            <p className="portfolio-description">

              Conheça alguns dos trabalhos
              da KSA Studio neste estilo.

            </p>


            {/* =================================================
                FILTROS
            ================================================= */}

            <div className="portfolio-filters">

              {estilos.map((item) => (

                <Link
                  key={item.slug}
                  to={`/portfolio/${item.slug}`}
                  className={
                    estilo === item.slug
                      ? "active"
                      : ""
                  }
                >

                  {item.nome}

                </Link>

              ))}

            </div>


            {/* =================================================
                GRADE
            ================================================= */}

            <section className="portfolio-grid">

              {fotosAtuais.map((foto, index) => (

                <button
                  type="button"
                  key={index}
                  className="portfolio-grid-item"
                  onClick={() =>
                    openImage(index)
                  }
                  aria-label={`Abrir trabalho ${index + 1}`}
                >

                  <img
                    src={foto}
                    alt={
                      `${estiloAtual.nome} - trabalho ${index + 1}`
                    }
                  />

                </button>

              ))}

            </section>

          </section>

        )}


        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="portfolio-cta">

          <span>
            SUA HISTÓRIA PODE SER A PRÓXIMA
          </span>


          <h2>
            TEM UMA IDEIA?
          </h2>


          <p>
            Vamos transformar sua ideia
            em uma arte única.
          </p>


          <Link
            to="/contato"
            className="portfolio-button"
          >

            SOLICITAR ORÇAMENTO

          </Link>

        </section>

      </main>


      {/* =====================================================
          FOOTER COMPONENTE
      ===================================================== */}

      <Footer />


      {/* =====================================================
          MODAL
      ===================================================== */}

      {selectedImage && (

        <div
          className="image-modal"
          onClick={closeImage}
        >


          {/* FECHAR */}

          <button
            type="button"
            className="modal-close"
            onClick={closeImage}
            aria-label="Fechar imagem"
          >

            <FaTimes />

          </button>


          {/* ANTERIOR */}

          <button
            type="button"
            className="modal-arrow modal-left"
            onClick={previousImage}
            aria-label="Imagem anterior"
          >

            <FaChevronLeft />

          </button>


          {/* CONTEÚDO */}

          <div
            className="modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={selectedImage}
              alt={
                `${estiloAtual?.nome || "Portfólio"} - trabalho ${currentIndex + 1}`
              }
            />


            <div className="modal-info">

              <span>
                {estiloAtual?.nome || "PORTFÓLIO"}
              </span>


              <h3>
                Trabalho {currentIndex + 1}
              </h3>

            </div>

          </div>


          {/* PRÓXIMA */}

          <button
            type="button"
            className="modal-arrow modal-right"
            onClick={nextImage}
            aria-label="Próxima imagem"
          >

            <FaChevronRight />

          </button>

        </div>

      )}


    </div>

  );

}