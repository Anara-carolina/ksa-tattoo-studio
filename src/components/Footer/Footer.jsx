import { Link, useLocation } from "react-router-dom";

import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import logo from "../../assets/images/logo.png";

import "./Footer.css";

const INSTAGRAM_URL = "https://www.instagram.com/ksastudio_/";
const WHATSAPP_URL = "https://wa.me/5534984065905";

export default function Footer() {
  const location = useLocation();

  return (
    <>
      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        {/* LOGO */}

        <img
          src={logo}
          alt="KSA Studio"
          className="footer-logo"
        />

        {/* REDES SOCIAIS */}

        <div className="social-icons">

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram KSA Studio"
            title="Instagram KSA Studio"
          >
            <FaInstagram />
          </a>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp KSA Studio"
            title="WhatsApp KSA Studio"
          >
            <FaWhatsapp />
          </a>

        </div>

        {/* INFORMAÇÕES */}

        <p>
          Estúdio de Tatuagem KSA
        </p>

        <p>
          São Paulo - SP | Uberaba - MG
        </p>

        <p className="footer-copyright">
          © 2026 KSA Studio
        </p>

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
          <span>⌂</span>
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
          <span>▧</span>
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
          <span>ϟ</span>
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
          <span>▣</span>
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
          <span>♧</span>
          CONTATO
        </Link>

      </nav>
    </>
  );
}