import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

import "./AnamneseForm.css";

import paginaLogin from "../../assets/images/paginalogin.png";

export default function AnamneseForm() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [etapa, setEtapa] = useState(1);

  useEffect(() => {
    // Verifica o usuário autenticado pelo Firebase
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) {
        navigate("/anamnese", { replace: true });
        return;
      }

      console.log("Usuário autenticado pelo Firebase:", usuario);

      setUser(usuario);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/anamnese", { replace: true });
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Não foi possível sair. Tente novamente.");
    }
  };

  const proximaEtapa = () => {
    if (etapa < 4) {
      setEtapa(etapa + 1);
    }
  };

  const etapaAnterior = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    }
  };

  if (loading) {
    return (
      <main
        className="anamnese-form"
        style={{ backgroundImage: `url(${paginaLogin})` }}
      >
        <div className="anamnese-form__overlay"></div>

        <div className="anamnese-form__loading">
          Verificando seu acesso...
        </div>
      </main>
    );
  }

  return (
    <main
      className="anamnese-form"
      style={{ backgroundImage: `url(${paginaLogin})` }}
    >
      <div className="anamnese-form__overlay"></div>

      <section className="anamnese-form__container">

        {/* =========================
            BOTÃO INÍCIO
        ========================= */}

        <div className="anamnese-form__topbar">

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

        <header className="anamnese-form__header">

          <span className="anamnese-form__brand">
            KSA STUDIO
          </span>

          <h1>ANAMNESE</h1>

          <p>
            Vamos conhecer você um pouco melhor.
          </p>

        </header>

        {/* =========================
            PROGRESSO
        ========================= */}

        <div className="anamnese-progress">

          <div className="anamnese-progress__steps">

            {[1, 2, 3, 4].map((numero) => (
              <div
                key={numero}
                className={`progress-step ${
                  etapa >= numero ? "active" : ""
                }`}
              >
                <span>{numero}</span>
              </div>
            ))}

          </div>

          <div className="anamnese-progress__line">

            <div
              className="anamnese-progress__line-fill"
              style={{
                width: `${((etapa - 1) / 3) * 100}%`,
              }}
            ></div>

          </div>

        </div>

        {/* =========================
            CARD
        ========================= */}

        <div className="anamnese-card">

          {/* =========================
              ETAPA 1
          ========================= */}

          {etapa === 1 && (
            <div className="anamnese-step">

              <span className="step-number">
                01
              </span>

              <h2>
                Sobre você
              </h2>

              <p className="step-description">
                Primeiro, algumas informações básicas para
                conhecermos você.
              </p>

              <div className="form-group">

                <label htmlFor="nome">
                  Nome completo
                </label>

                <input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="nascimento">
                    Data de nascimento
                  </label>

                  <input
                    id="nascimento"
                    type="date"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="telefone">
                    Telefone / WhatsApp
                  </label>

                  <input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                  />

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                />

                <small>
                  E-mail vinculado à sua conta Google.
                </small>

              </div>

            </div>
          )}

          {/* =========================
              ETAPA 2
          ========================= */}

          {etapa === 2 && (
            <div className="anamnese-step">

              <span className="step-number">
                02
              </span>

              <h2>
                Sua saúde
              </h2>

              <p className="step-description">
                Essas informações são importantes para
                realizarmos seu procedimento com segurança.
              </p>

              <div className="form-group">

                <label>
                  Você possui alguma alergia?
                </label>

                <div className="radio-group">

                  <label className="radio-option">

                    <input
                      type="radio"
                      name="alergia"
                    />

                    <span>Sim</span>

                  </label>

                  <label className="radio-option">

                    <input
                      type="radio"
                      name="alergia"
                    />

                    <span>Não</span>

                  </label>

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="alergias">
                  Se sim, quais?
                </label>

                <textarea
                  id="alergias"
                  placeholder="Informe suas alergias..."
                  rows="4"
                ></textarea>

              </div>

              <div className="form-group">

                <label>
                  Faz uso contínuo de algum medicamento?
                </label>

                <div className="radio-group">

                  <label className="radio-option">

                    <input
                      type="radio"
                      name="medicamento"
                    />

                    <span>Sim</span>

                  </label>

                  <label className="radio-option">

                    <input
                      type="radio"
                      name="medicamento"
                    />

                    <span>Não</span>

                  </label>

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="medicamentos">
                  Medicamentos
                </label>

                <textarea
                  id="medicamentos"
                  placeholder="Informe quais medicamentos utiliza..."
                  rows="4"
                ></textarea>

              </div>

            </div>
          )}

          {/* =========================
              ETAPA 3
          ========================= */}

          {etapa === 3 && (
            <div className="anamnese-step">

              <span className="step-number">
                03
              </span>

              <h2>
                Sua tatuagem
              </h2>

              <p className="step-description">
                Agora queremos saber um pouco sobre a
                tatuagem que você deseja realizar.
              </p>

              <div className="form-group">

                <label htmlFor="local">
                  Local do corpo
                </label>

                <input
                  id="local"
                  type="text"
                  placeholder="Ex.: braço, costas, perna..."
                />

              </div>

              <div className="form-group">

                <label htmlFor="tamanho">
                  Tamanho aproximado
                </label>

                <input
                  id="tamanho"
                  type="text"
                  placeholder="Ex.: 10 cm"
                />

              </div>

              <div className="form-group">

                <label htmlFor="estilo">
                  Estilo da tatuagem
                </label>

                <select id="estilo">

                  <option value="">
                    Selecione
                  </option>

                  <option value="floral">
                    Floral
                  </option>

                  <option value="fine-line">
                    Fine Line
                  </option>

                  <option value="blackwork">
                    Blackwork
                  </option>

                  <option value="realismo">
                    Realismo
                  </option>

                  <option value="outro">
                    Outro
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label htmlFor="ideia">
                  Conte um pouco sobre sua ideia
                </label>

                <textarea
                  id="ideia"
                  placeholder="Fale sobre a tatuagem que você deseja..."
                  rows="5"
                ></textarea>

              </div>

            </div>
          )}

          {/* =========================
              ETAPA 4
          ========================= */}

          {etapa === 4 && (
            <div className="anamnese-step">

              <span className="step-number">
                04
              </span>

              <h2>
                Consentimento
              </h2>

              <p className="step-description">
                Antes de finalizar, leia atentamente as
                informações abaixo.
              </p>

              <div className="consent-box">

                <p>
                  Declaro que as informações fornecidas
                  nesta Anamnese são verdadeiras e completas.
                </p>

                <p>
                  Estou ciente de que devo informar à
                  profissional qualquer alteração no meu
                  estado de saúde antes da realização da
                  tatuagem.
                </p>

                <p>
                  Autorizo o tratamento das informações
                  fornecidas para as finalidades relacionadas
                  ao meu atendimento, respeitando a legislação
                  aplicável de proteção de dados.
                </p>

              </div>

              <label className="consent-checkbox">

                <input
                  type="checkbox"
                />

                <span>
                  Li e concordo com as informações acima.
                </span>

              </label>

            </div>
          )}

          {/* =========================
              BOTÕES
          ========================= */}

          <div className="anamnese-actions">

            {etapa > 1 && (
              <button
                type="button"
                className="button-secondary"
                onClick={etapaAnterior}
              >
                VOLTAR
              </button>
            )}

            {etapa < 4 ? (
              <button
                type="button"
                className="button-primary"
                onClick={proximaEtapa}
              >
                CONTINUAR
              </button>
            ) : (
              <button
                type="button"
                className="button-primary"
              >
                FINALIZAR ANAMNESE
              </button>
            )}

          </div>

        </div>

        {/* =========================
            RODAPÉ
        ========================= */}

        <footer className="anamnese-form__footer">

          <span>
            Conectada como {user?.email}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            SAIR
          </button>

        </footer>

      </section>

    </main>
  );
}