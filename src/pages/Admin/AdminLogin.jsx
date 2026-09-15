import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../../lib/firebase";

import "./AdminLogin.css";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

function AdminLogin() {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    try {
      setCarregando(true);
      setErro("");

      const provider = new GoogleAuthProvider();

      const resultado = await signInWithPopup(auth, provider);

      const email = resultado.user?.email?.toLowerCase();

      if (!email || email !== ADMIN_EMAIL?.toLowerCase()) {
        await auth.signOut();

        setErro(
          "Este e-mail não possui autorização para acessar o painel."
        );

        return;
      }

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro no login administrativo:", error);

      if (error?.code === "auth/popup-closed-by-user") {
        setErro("O login foi cancelado.");
      } else {
        setErro("Não foi possível realizar o login.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-background" />

      <div className="admin-login-overlay" />

      <section className="admin-login-card">

        <div className="admin-login-brand">
          <span>KSA STUDIO</span>
          <small>PAINEL ADMINISTRATIVO</small>
        </div>

        <div className="admin-login-line" />

        <h1>
          Área
          <br />
          Administrativa
        </h1>

        <p>
          Acesso exclusivo para gerenciamento
          do KSA Studio.
        </p>

        {erro && (
          <div className="admin-login-error">
            {erro}
          </div>
        )}

        <button
          type="button"
          className="admin-google-button"
          onClick={handleLogin}
          disabled={carregando}
        >
          <span className="admin-google-icon">
            G
          </span>

          <span>
            {carregando
              ? "ENTRANDO..."
              : "ENTRAR COM GOOGLE"}
          </span>
        </button>

        <div className="admin-login-footer">
          <span>ACESSO RESTRITO</span>
          <span>KSA STUDIO • 2026</span>
        </div>

      </section>

    </main>
  );
}

export default AdminLogin;