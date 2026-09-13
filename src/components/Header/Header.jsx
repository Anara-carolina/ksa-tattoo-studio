import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBars,
  FaCalendarAlt,
  FaInstagram,
  FaWhatsapp,
  FaTimes
} from "react-icons/fa";

import logo from "../../assets/images/logo.png";

import "./Header.css";


export default function Header() {

  const [menuOpen, setMenuOpen] = useState(false);


  function closeMenu() {
    setMenuOpen(false);
  }


  return (
    <>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="site-header">

        <button
          type="button"
          className="site-header-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <FaBars />
        </button>


        <Link
          to="/"
          className="site-logo-link"
          onClick={closeMenu}
        >

          <img
            src={logo}
            alt="KSA Studio"
            className="site-logo"
          />

        </Link>


        <Link
          to="/agendamento"
          className="site-header-button"
          aria-label="Agendar tatuagem"
        >

          <FaCalendarAlt />

        </Link>

      </header>



      {/* =====================================================
          MENU LATERAL
      ===================================================== */}

      {menuOpen && (

        <div
          className="site-menu-overlay"
          onClick={closeMenu}
        >

          <aside
            className="site-side-menu"
            onClick={(event) => event.stopPropagation()}
          >


            {/* =================================================
                BOTÃO FECHAR
            ================================================= */}

            <button
              type="button"
              className="site-menu-close"
              onClick={closeMenu}
              aria-label="Fechar menu"
            >

              <FaTimes />

            </button>



            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              onClick={closeMenu}
            >

              <img
                src={logo}
                alt="KSA Studio"
                className="site-menu-logo"
              />

            </Link>


            <span className="site-menu-title">
              KSA STUDIO
            </span>



            {/* =================================================
                MENU
            ================================================= */}

            <nav className="site-menu-links">


              <Link
                to="/"
                onClick={closeMenu}
              >
                INÍCIO
              </Link>


              <Link
                to="/portfolio"
                onClick={closeMenu}
              >
                PORTFÓLIO
              </Link>


              <Link
                to="/flash"
                onClick={closeMenu}
              >
                FLASH
              </Link>


              <Link
                to="/agendamento"
                onClick={closeMenu}
              >
                AGENDAR
              </Link>


              <Link
                to="/sobre"
                onClick={closeMenu}
              >
                SOBRE A ARTISTA
              </Link>


              <Link
                to="/anamnese"
                onClick={closeMenu}
              >
                ANAMNESE
              </Link>


              <Link
                to="/cuidados"
                onClick={closeMenu}
              >
                CUIDADOS COM A TATUAGEM
              </Link>


              <Link
                to="/documentacao"
                onClick={closeMenu}
              >
                DOCUMENTAÇÃO
              </Link>


              <Link
                to="/contato"
                onClick={closeMenu}
              >
                CONTATO
              </Link>


            </nav>



            {/* =================================================
                REDES SOCIAIS
            ================================================= */}

            <div className="site-menu-social">


              <a
                href="#"
                aria-label="Instagram"
              >

                <FaInstagram />

              </a>


              <a
                href="#"
                aria-label="WhatsApp"
              >

                <FaWhatsapp />

              </a>


            </div>


          </aside>

        </div>

      )}

    </>
  );
}