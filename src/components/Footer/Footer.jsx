import { Link, useLocation } from "react-router-dom";

import {
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";

import logo from "../../assets/images/logo.png";

import "./Footer.css";


export default function Footer() {

  const location = useLocation();


  return (

    <>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <img
          src={logo}
          alt="KSA Studio"
          className="footer-logo"
        />


        <p>
          Estúdio de Tatuagem KSA
        </p>


        <p>
          São Paulo - SP | Uberaba - MG
        </p>


        <p>
          © 2026 KSA Studio
        </p>


        <div className="social-icons">

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

      </footer>



      {/* =====================================================
          NAVEGAÇÃO INFERIOR
      ===================================================== */}

      <nav className="bottom-navigation">


        <Link
          to="/"
          className={
            location.pathname === "/"
              ? "active"
              : ""
          }
        >

          <span>
            ⌂
          </span>

          INÍCIO

        </Link>


        <Link
          to="/portfolio"
          className={
            location.pathname.startsWith("/portfolio")
              ? "active"
              : ""
          }
        >

          <span>
            ▧
          </span>

          PORTFÓLIO

        </Link>


        <Link
          to="/flash"
          className={
            location.pathname.startsWith("/flash")
              ? "active"
              : ""
          }
        >

          <span>
            ϟ
          </span>

          FLASH

        </Link>


        <Link
          to="/agendamento"
          className={
            location.pathname.startsWith("/agendamento")
              ? "active"
              : ""
          }
        >

          <span>
            ▣
          </span>

          AGENDAR

        </Link>


        <Link
          to="/contato"
          className={
            location.pathname.startsWith("/contato")
              ? "active"
              : ""
          }
        >

          <span>
            ♧
          </span>

          CONTATO

        </Link>


      </nav>

    </>

  );

}