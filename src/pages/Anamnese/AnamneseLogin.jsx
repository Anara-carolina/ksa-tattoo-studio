import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "../../lib/firebase";
import "./AnamneseLogin.css";
import paginaLogin from "../../assets/images/paginalogin.png";

export default function AnamneseLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuário autenticado:", user);
        navigate("/anamnese/formulario", { replace: true });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      console.log("Login realizado:", result.user);

      navigate("/anamnese/formulario", { replace: true });
    } catch (error) {
      console.error("Erro ao entrar com Google:", error);

      setLoading(false);

      if (error.code === "auth/popup-closed-by-user") {
        return;
      }

      if (error.code === "auth/popup-blocked") {
        alert(
          "O navegador bloqueou a janela de login. Permita pop-ups para este site e tente novamente."
        );
        return;
      }

      alert("Não foi possível entrar com o Google. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <main
        className="anamnese-login"
        style={{ backgroundImage: `url(${paginaLogin})` }}
      >
        <div className="anamnese-login__overlay"></div>

        <div className="anamnese-login__content">
          <div className="anamnese-login__header">
            <span className="anamnese-login__small-title">
              KSA STUDIO
            </span>

            <h1>ANAMNESE</h1>

            <p>Verificando seu acesso...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="anamnese-login"
      style={{ backgroundImage: `url(${paginaLogin})` }}
    >
      <div className="anamnese-login__overlay"></div>

      <div className="anamnese-login__content">

        {/* TOPO */}
        <div className="anamnese-login__topbar">
          <Link to="/" className="anamnese-home-button">
            ← INÍCIO
          </Link>
        </div>

        {/* CABEÇALHO */}
        <div className="anamnese-login__header">
          <span className="anamnese-login__small-title">
            KSA STUDIO
          </span>

          <h1>ANAMNESE</h1>

          <p>
            Antes da sua tatuagem, precisamos conhecer algumas
            informações importantes sobre você.
          </p>
        </div>

        {/* CARD */}
        <div className="anamnese-login__card">

          <h2>Acesse sua ficha</h2>

          <p>
            Para preencher sua anamnese, entre com sua conta Google.
          </p>

          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="google-icon">
              <FcGoogle size={22} />
            </span>

            ENTRAR COM GOOGLE
          </button>

          {/* PRIVACIDADE */}
          <div className="anamnese-login__privacy">
            <strong>Privacidade</strong>

            <p>
              Seus dados serão utilizados exclusivamente para o
              atendimento e preenchimento da sua ficha de anamnese.
            </p>

            <Link
              to="/politica-privacidade"
              className="privacy-link"
            >
              Política de Privacidade
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}