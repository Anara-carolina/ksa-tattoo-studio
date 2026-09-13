import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { supabase } from "../../lib/supabase";

import "./AnamneseLogin.css";

import paginaLogin from "../../assets/images/paginalogin.png";

export default function AnamneseLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // =========================
  // VERIFICAR SESSÃO
  // =========================
  useEffect(() => {
    const verificarSessao = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao verificar sessão:", error);
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log("Usuário autenticado:", data.session.user);

        navigate("/anamnese/formulario", { replace: true });
        return;
      }

      setLoading(false);
    };

    verificarSessao();

    // Observa mudanças no login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Evento de autenticação:", event);

      if (session) {
        console.log("Usuário autenticado:", session.user);

        navigate("/anamnese/formulario", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // =========================
  // LOGIN COM GOOGLE
  // =========================
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/anamnese`,
      },
    });

    if (error) {
      console.error("Erro ao entrar com Google:", error);

      alert(
        "Não foi possível entrar com o Google. Tente novamente."
      );
    }
  };

  // =========================
  // CARREGANDO
  // =========================
  if (loading) {
    return (
      <main
        className="anamnese-login"
        style={{
          backgroundImage: `url(${paginaLogin})`,
        }}
      >
        <div className="anamnese-login__overlay"></div>

        <section className="anamnese-login__content">

          <p>Verificando seu acesso...</p>

        </section>
      </main>
    );
  }

  // =========================
  // TELA DE LOGIN
  // =========================
  return (
    <main
      className="anamnese-login"
      style={{
        backgroundImage: `url(${paginaLogin})`,
      }}
    >
      <div className="anamnese-login__overlay"></div>

      <section className="anamnese-login__content">

        {/* =========================
            BOTÃO INÍCIO
        ========================= */}

        <div className="anamnese-login__topbar">

          <button
            type="button"
            className="anamnese-home-button"
            onClick={() => navigate("/")}
          >
            INÍCIO
          </button>

        </div>

        {/* =========================
            CABEÇALHO
        ========================= */}

        <div className="anamnese-login__header">

          <span className="anamnese-login__small-title">
            KSA STUDIO
          </span>

          <h1>ANAMNESE</h1>

          <p>
            Antes de realizar sua tatuagem,
            precisamos conhecer um pouco sobre você.
          </p>

        </div>

        {/* =========================
            CARD
        ========================= */}

        <div className="anamnese-login__card">

          <h2>
            Acesse sua ficha
          </h2>

          <p>
            Entre com sua conta Google para continuar
            com o preenchimento da sua Anamnese.
          </p>

          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="google-icon" />

            <span>
              CONTINUAR COM GOOGLE
            </span>
          </button>

          {/* =========================
              PRIVACIDADE
          ========================= */}

          <div className="anamnese-login__privacy">

            <strong>
              Privacidade e proteção de dados
            </strong>

            <p>
              As informações fornecidas nesta Anamnese
              serão utilizadas para finalidades relacionadas
              ao seu atendimento e procedimento de tatuagem,
              respeitando a legislação aplicável de proteção
              de dados.
            </p>

            <Link
              to="/politica-privacidade"
              className="privacy-link"
            >
              LEIA NOSSA POLÍTICA DE PRIVACIDADE
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}