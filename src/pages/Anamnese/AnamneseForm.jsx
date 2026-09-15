
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";

import "./AnamneseForm.css";

import paginaLogin from "../../assets/images/paginalogin.png";

const formularioInicial = {
  nome: "",
  nascimento: "",
  telefone: "",
  alergia: "",
  alergias: "",
  medicamento: "",
  medicamentos: "",
  local: "",
  tamanho: "",
  estilo: "",
  ideia: "",
  consentimento: false,
};

export default function AnamneseForm() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [etapa, setEtapa] = useState(1);

  const [formulario, setFormulario] = useState(formularioInicial);
  const [anamneseExistente, setAnamneseExistente] = useState(null);

  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        navigate("/anamnese", { replace: true });
        return;
      }

      if (!ativo) return;

      console.log("Usuário autenticado pelo Firebase:", usuario);

      setUser(usuario);

      try {
        /*
         * Cada cliente possui uma anamnese vinculada
         * ao próprio UID do Firebase.
         */
        const referencia = doc(db, "anamneses", usuario.uid);
        const snapshot = await getDoc(referencia);

        if (snapshot.exists()) {
          const dados = snapshot.data();

          setAnamneseExistente(dados);

          setFormulario({
            ...formularioInicial,
            ...dados,
            consentimento: dados.consentimento === true,
          });

          console.log("Anamnese existente carregada.");
        }
      } catch (error) {
        console.error("Erro ao carregar anamnese:", error);
        setErro(
          "Não foi possível carregar seus dados anteriores. Você ainda pode preencher a ficha."
        );
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    });

    return () => {
      ativo = false;
      unsubscribe();
    };
  }, [navigate]);

  const atualizarCampo = (campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    if (erro) {
      setErro("");
    }
  };

  const validarEtapa = () => {
    if (etapa === 1) {
      if (!formulario.nome.trim()) {
        setErro("Digite seu nome completo.");
        return false;
      }

      if (!formulario.nascimento) {
        setErro("Informe sua data de nascimento.");
        return false;
      }

      if (!formulario.telefone.trim()) {
        setErro("Informe seu telefone ou WhatsApp.");
        return false;
      }
    }

    if (etapa === 2) {
      if (!formulario.alergia) {
        setErro("Informe se você possui alguma alergia.");
        return false;
      }

      if (
        formulario.alergia === "sim" &&
        !formulario.alergias.trim()
      ) {
        setErro("Informe quais são suas alergias.");
        return false;
      }

      if (!formulario.medicamento) {
        setErro(
          "Informe se você faz uso contínuo de algum medicamento."
        );
        return false;
      }

      if (
        formulario.medicamento === "sim" &&
        !formulario.medicamentos.trim()
      ) {
        setErro("Informe quais medicamentos você utiliza.");
        return false;
      }
    }

    if (etapa === 3) {
      if (!formulario.local.trim()) {
        setErro("Informe o local do corpo.");
        return false;
      }

      if (!formulario.tamanho.trim()) {
        setErro("Informe o tamanho aproximado da tatuagem.");
        return false;
      }

      if (!formulario.estilo) {
        setErro("Selecione o estilo da tatuagem.");
        return false;
      }

      if (!formulario.ideia.trim()) {
        setErro("Conte um pouco sobre sua ideia.");
        return false;
      }
    }

    return true;
  };

  const proximaEtapa = () => {
    if (!validarEtapa()) {
      return;
    }

    if (etapa < 4) {
      setErro("");
      setEtapa((anterior) => anterior + 1);
    }
  };

  const etapaAnterior = () => {
    setErro("");

    if (etapa > 1) {
      setEtapa((anterior) => anterior - 1);
    }
  };

  const finalizarAnamnese = async () => {
    setErro("");

    if (!validarEtapa()) {
      return;
    }

    if (!formulario.consentimento) {
      setErro(
        "É necessário ler e concordar com as informações para finalizar."
      );
      return;
    }

    if (!user) {
      setErro("Usuário não autenticado. Faça login novamente.");
      return;
    }

    setSalvando(true);

    try {
      const referencia = doc(db, "anamneses", user.uid);

      const dados = {
        uid: user.uid,

        nome: formulario.nome.trim(),
        nascimento: formulario.nascimento,
        telefone: formulario.telefone.trim(),

        email: user.email || "",

        alergia: formulario.alergia,
        alergias:
          formulario.alergia === "sim"
            ? formulario.alergias.trim()
            : "",

        medicamento: formulario.medicamento,
        medicamentos:
          formulario.medicamento === "sim"
            ? formulario.medicamentos.trim()
            : "",

        local: formulario.local.trim(),
        tamanho: formulario.tamanho.trim(),
        estilo: formulario.estilo,
        ideia: formulario.ideia.trim(),

        consentimento: formulario.consentimento,

        /*
         * Informações da conta Google.
         * Facilitam a identificação no painel administrativo.
         */
        nomeGoogle: user.displayName || "",
        fotoGoogle: user.photoURL || "",

        atualizadoEm: serverTimestamp(),

        /*
         * Só cria a data de criação se essa anamnese
         * ainda não existir.
         */
        ...(anamneseExistente?.criadoEm
          ? {}
          : { criadoEm: serverTimestamp() }),
      };

      await setDoc(referencia, dados, { merge: true });

      setAnamneseExistente({
        ...anamneseExistente,
        ...dados,
      });

      setSalvo(true);

      console.log("Anamnese salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar anamnese:", error);

      setErro(
        "Não foi possível salvar sua anamnese. Verifique sua conexão e tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/anamnese", { replace: true });
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Não foi possível sair. Tente novamente.");
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

  /*
   * Tela exibida depois que a ficha foi salva.
   * Mantém o mesmo card e a mesma identidade visual.
   */
  if (salvo) {
    return (
      <main
        className="anamnese-form"
        style={{ backgroundImage: `url(${paginaLogin})` }}
      >
        <div className="anamnese-form__overlay"></div>

        <section className="anamnese-form__container">

          <div className="anamnese-form__topbar">
            <button
              type="button"
              className="anamnese-home-button"
              onClick={() => navigate("/")}
            >
              INÍCIO
            </button>
          </div>

          <header className="anamnese-form__header">
            <span className="anamnese-form__brand">
              KSA STUDIO
            </span>

            <h1>ANAMNESE</h1>

            <p>
              Sua ficha foi enviada com sucesso.
            </p>
          </header>

          <div className="anamnese-card">

            <div className="anamnese-step">

              <span className="step-number">
                ✓
              </span>

              <h2>
                Tudo certo!
              </h2>

              <p className="step-description">
                Sua anamnese foi salva e já está disponível
                para a equipe da KSA Studio.
              </p>

              <div className="consent-box">

                <p>
                  Obrigada por preencher suas informações.
                </p>

                <p>
                  Caso alguma informação de saúde seja
                  alterada antes da tatuagem, informe a
                  profissional responsável pelo procedimento.
                </p>

              </div>

            </div>

            <div className="anamnese-actions">

              <button
                type="button"
                className="button-primary"
                onClick={() => navigate("/")}
              >
                VOLTAR AO INÍCIO
              </button>

            </div>

          </div>

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
                  value={formulario.nome}
                  onChange={(e) =>
                    atualizarCampo("nome", e.target.value)
                  }
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
                    value={formulario.nascimento}
                    onChange={(e) =>
                      atualizarCampo(
                        "nascimento",
                        e.target.value
                      )
                    }
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
                    value={formulario.telefone}
                    onChange={(e) =>
                      atualizarCampo(
                        "telefone",
                        e.target.value
                      )
                    }
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
                      value="sim"
                      checked={formulario.alergia === "sim"}
                      onChange={(e) =>
                        atualizarCampo(
                          "alergia",
                          e.target.value
                        )
                      }
                    />

                    <span>Sim</span>

                  </label>

                  <label className="radio-option">

                    <input
                      type="radio"
                      name="alergia"
                      value="nao"
                      checked={formulario.alergia === "nao"}
                      onChange={(e) =>
                        atualizarCampo(
                          "alergia",
                          e.target.value
                        )
                      }
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
                  value={formulario.alergias}
                  onChange={(e) =>
                    atualizarCampo(
                      "alergias",
                      e.target.value
                    )
                  }
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
                      value="sim"
                      checked={
                        formulario.medicamento === "sim"
                      }
                      onChange={(e) =>
                        atualizarCampo(
                          "medicamento",
                          e.target.value
                        )
                      }
                    />

                    <span>Sim</span>

                  </label>

                  <label className="radio-option">

                    <input
                      type="radio"
                      name="medicamento"
                      value="nao"
                      checked={
                        formulario.medicamento === "nao"
                      }
                      onChange={(e) =>
                        atualizarCampo(
                          "medicamento",
                          e.target.value
                        )
                      }
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
                  value={formulario.medicamentos}
                  onChange={(e) =>
                    atualizarCampo(
                      "medicamentos",
                      e.target.value
                    )
                  }
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
                  value={formulario.local}
                  onChange={(e) =>
                    atualizarCampo(
                      "local",
                      e.target.value
                    )
                  }
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
                  value={formulario.tamanho}
                  onChange={(e) =>
                    atualizarCampo(
                      "tamanho",
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label htmlFor="estilo">
                  Estilo da tatuagem
                </label>

                <select
                  id="estilo"
                  value={formulario.estilo}
                  onChange={(e) =>
                    atualizarCampo(
                      "estilo",
                      e.target.value
                    )
                  }
                >

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
                  value={formulario.ideia}
                  onChange={(e) =>
                    atualizarCampo(
                      "ideia",
                      e.target.value
                    )
                  }
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
                  checked={formulario.consentimento}
                  onChange={(e) =>
                    atualizarCampo(
                      "consentimento",
                      e.target.checked
                    )
                  }
                />

                <span>
                  Li e concordo com as informações acima.
                </span>

              </label>

            </div>
          )}

          {/* =========================
              ERRO
          ========================= */}

          {erro && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                border: "1px solid rgba(180, 40, 40, 0.5)",
                borderRadius: "4px",
                color: "#d98b8b",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {erro}
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
                disabled={salvando}
              >
                VOLTAR
              </button>
            )}

            {etapa < 4 ? (
              <button
                type="button"
                className="button-primary"
                onClick={proximaEtapa}
                disabled={salvando}
              >
                CONTINUAR
              </button>
            ) : (
              <button
                type="button"
                className="button-primary"
                onClick={finalizarAnamnese}
                disabled={salvando}
              >
                {salvando
                  ? "SALVANDO..."
                  : "FINALIZAR ANAMNESE"}
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
            disabled={salvando}
          >
            SAIR
          </button>

        </footer>

      </section>

    </main>
  );
}
