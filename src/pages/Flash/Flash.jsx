import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaArrowRight,
  FaWhatsapp
} from "react-icons/fa";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import pantera from "../../assets/images/pantera.png";

import luaFlash from "../../assets/images/luaflash.png";
import panteraFlash from "../../assets/images/panteraflash.png";
import rosaFlash from "../../assets/images/rosaflash.png";

import flash0 from "../../assets/images/flash0.jpeg";
import flash1 from "../../assets/images/flash1.jpeg";
import flash2 from "../../assets/images/flash2.jpeg";
import flash3 from "../../assets/images/flash3.jpeg";
import flash4 from "../../assets/images/flash4.jpeg";
import flash5 from "../../assets/images/flash5.jpeg";
import flash6 from "../../assets/images/flash6.jpeg";
import flash7 from "../../assets/images/flash7.jpeg";
import flash8 from "../../assets/images/flash8.jpeg";
import flash9 from "../../assets/images/flash9.jpeg";
import flash10 from "../../assets/images/flash10.jpeg";
import flash11 from "../../assets/images/flash11.jpeg";
import flash12 from "../../assets/images/flash12.jpeg";
import flash13 from "../../assets/images/flash13.jpeg";
import flash14 from "../../assets/images/flash14.jpeg";
import flash15 from "../../assets/images/flash15.jpeg";

import "./Flash.css";


export default function Flash() {

  const flashes = [

    // =========================================================
    // FLASHES QUE JÁ EXISTIAM
    // =========================================================

    {
      id: "lua",
      nome: "LUA",
      imagem: luaFlash,
      descricao:
        "Arte autoral de lua, delicada e cheia de significado."
    },

    {
      id: "pantera",
      nome: "PANTERA",
      imagem: panteraFlash,
      descricao:
        "Uma arte marcante inspirada na força e na presença da pantera."
    },

    {
      id: "rosa",
      nome: "ROSA",
      imagem: rosaFlash,
      descricao:
        "Rosa autoral para quem busca delicadeza e personalidade."
    },


    // =========================================================
    // NOVAS FLASHES
    // =========================================================

    {
      id: "flash0",
      nome: "FLASH 01",
      imagem: flash0,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash1",
      nome: "FLASH 02",
      imagem: flash1,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash2",
      nome: "FLASH 03",
      imagem: flash2,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash3",
      nome: "FLASH 04",
      imagem: flash3,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash4",
      nome: "FLASH 05",
      imagem: flash4,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash5",
      nome: "FLASH 06",
      imagem: flash5,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash6",
      nome: "FLASH 07",
      imagem: flash6,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash7",
      nome: "FLASH 08",
      imagem: flash7,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash8",
      nome: "FLASH 09",
      imagem: flash8,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash9",
      nome: "FLASH 10",
      imagem: flash9,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash10",
      nome: "FLASH 11",
      imagem: flash10,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash11",
      nome: "FLASH 12",
      imagem: flash11,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash12",
      nome: "FLASH 13",
      imagem: flash12,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash13",
      nome: "FLASH 14",
      imagem: flash13,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash14",
      nome: "FLASH 15",
      imagem: flash14,
      descricao:
        "Arte autoral disponível para tatuagem."
    },

    {
      id: "flash15",
      nome: "FLASH 16",
      imagem: flash15,
      descricao:
        "Arte autoral disponível para tatuagem."
    }

  ];


  return (

    <div className="flash-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="flash-hero">

        <img
          src={pantera}
          alt="Pantera - KSA Studio"
          className="flash-hero-background"
        />

        <div className="flash-hero-overlay"></div>


        <div className="flash-hero-content">

          <span className="flash-small">
            KSA STUDIO
          </span>


          <div className="flash-heading">

            <span className="ornament">
              ✦
            </span>


            <h1>
              TATUAGENS
              <br />
              <span>FLASH</span>
            </h1>


            <span className="ornament">
              ✦
            </span>

          </div>


          <p>
            Artes autorais criadas para quem deseja
            levar uma arte especial para a pele.
          </p>

        </div>

      </section>



      {/* =====================================================
          INTRODUÇÃO
      ===================================================== */}

      <section className="flash-intro">

        <span className="flash-label">
          FLASH KSA
        </span>


        <h2>
          UMA ARTE PRONTA.
          <br />
          <span>UM MOMENTO ÚNICO.</span>
        </h2>


        <p>
          Nossas Flash são artes autorais criadas
          pela KSA Studio. Escolha a sua favorita,
          agende seu horário e venha transformar
          essa arte em uma tatuagem especial.
        </p>

      </section>



      {/* =====================================================
          GALERIA FLASH
      ===================================================== */}

      <section className="flash-gallery">


        <div className="section-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>
            ESCOLHA SUA FLASH
          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <p className="flash-gallery-description">

          Conheça as artes autorais disponíveis
          para agendamento.

        </p>



        {/* ===================================================
            GRADE
        =================================================== */}

        <div className="flash-grid">


          {flashes.map((flash) => (

            <article
              className="flash-card"
              key={flash.id}
            >


              <div className="flash-card-image">

                <img
                  src={flash.imagem}
                  alt={`Tatuagem Flash ${flash.nome}`}
                />

              </div>



              <div className="flash-card-content">

                <span className="flash-card-label">
                  FLASH KSA
                </span>


                <h3>
                  {flash.nome}
                </h3>


                <p>
                  {flash.descricao}
                </p>


                <Link
                  to={`/agendamento?flash=${flash.id}`}
                  className="flash-card-button"
                >

                  AGENDAR ESTA FLASH

                  <FaArrowRight />

                </Link>

              </div>

            </article>

          ))}


        </div>

      </section>



      {/* =====================================================
          VALOR
      ===================================================== */}

      <section className="flash-price-section">

        <div className="flash-price-box">

          <span className="flash-price-label">
            FLASH KSA
          </span>


          <h2>
            A PARTIR DE
          </h2>


          <strong>
            R$ 150
          </strong>


          <p>
            Para tatuagens de aproximadamente
            até <b>8 cm</b>.
          </p>


          <div className="flash-price-line"></div>


          <p className="flash-price-observation">

            Outros tamanhos, alterações no desenho
            ou artes com mais detalhes podem ter
            valores diferentes.

          </p>

        </div>

      </section>



      {/* =====================================================
          COMO FUNCIONA
      ===================================================== */}

      <section className="flash-how">


        <div className="section-heading">

          <span className="ornament">
            ✦
          </span>

          <h2>
            COMO FUNCIONA
          </h2>

          <span className="ornament">
            ✦
          </span>

        </div>


        <div className="flash-steps">


          <div className="flash-step">

            <span className="flash-step-number">
              01
            </span>

            <h3>
              ESCOLHA SUA FLASH
            </h3>

            <p>
              Escolha entre as artes disponíveis
              na galeria.
            </p>

          </div>



          <div className="flash-step">

            <span className="flash-step-number">
              02
            </span>

            <h3>
              ESCOLHA O HORÁRIO
            </h3>

            <p>
              Acesse o agendamento e escolha
              um horário disponível.
            </p>

          </div>



          <div className="flash-step">

            <span className="flash-step-number">
              03
            </span>

            <h3>
              VENHA TATUAR
            </h3>

            <p>
              Compareça ao estúdio no dia e horário
              escolhidos para realizar sua tatuagem.
            </p>

          </div>


        </div>

      </section>



      {/* =====================================================
          ORÇAMENTO
      ===================================================== */}

      <section className="flash-budget">

        <div className="flash-budget-content">

          <span className="flash-small">
            QUER ALGO DIFERENTE?
          </span>


          <h2>

            SUA IDEIA
            <br />

            <span>PODE VIRAR ARTE.</span>

          </h2>


          <p>

            Gostou de uma Flash, mas gostaria de
            outro tamanho, alteração no desenho ou
            uma arte diferente?

            <br />
            <br />

            Nesse caso, solicite um orçamento
            personalizado.

          </p>


          <div className="flash-budget-buttons">


            <Link
              to="/contato"
              className="flash-button-outline"
            >

              SOLICITAR ORÇAMENTO

            </Link>


            <a
              href="#"
              className="flash-whatsapp-button"
            >

              <FaWhatsapp />

              FALAR PELO WHATSAPP

            </a>


          </div>

        </div>

      </section>



      {/* =====================================================
          AGENDAMENTO
      ===================================================== */}

      <section className="flash-booking">


        <FaCalendarAlt className="flash-booking-icon" />


        <span className="flash-small">
          PRONTA PARA SUA NOVA TATUAGEM?
        </span>


        <h2>

          ESCOLHA SUA FLASH
          <br />

          <span>E AGENDE SEU HORÁRIO.</span>

        </h2>


        <p>

          Se você já escolheu sua arte,
          é só acessar o agendamento.

        </p>


        <Link
          to="/agendamento"
          className="flash-button-primary"
        >

          AGENDAR MINHA FLASH

          <FaArrowRight />

        </Link>


      </section>



      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />


    </div>

  );

}