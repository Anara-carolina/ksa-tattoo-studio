import { useState, useEffect, useRef } from "react";

import {
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaImage,
} from "react-icons/fa";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./Contato.css";

const WHATSAPP_NUMBER = "5534984065905";
const INSTAGRAM_URL = "https://www.instagram.com/ksastudio_/";

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    assunto: "",
    mensagem: "",
    tamanho: "",
    local: "",
  });

  const [imagens, setImagens] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const imagensRef = useRef([]);

  /* =========================================================
     MANTÉM REFERÊNCIA DAS IMAGENS
  ========================================================= */

  useEffect(() => {
    imagensRef.current = imagens;
  }, [imagens]);

  /* =========================================================
     LIMPA OS PREVIEWS AO SAIR DA PÁGINA
  ========================================================= */

  useEffect(() => {
    return () => {
      imagensRef.current.forEach((imagem) => {
        URL.revokeObjectURL(imagem.preview);
      });
    };
  }, []);

  /* =========================================================
     ALTERAÇÃO DOS CAMPOS
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /* -------------------------------------------------------
       SE SAIR DE ORÇAMENTO, LIMPA OS CAMPOS EXTRAS
    ------------------------------------------------------- */

    if (
      name === "assunto" &&
      value !== "Orçamento de tatuagem"
    ) {
      setFormData((prev) => ({
        ...prev,
        assunto: value,
        tamanho: "",
        local: "",
      }));

      setImagens((prev) => {
        prev.forEach((imagem) => {
          URL.revokeObjectURL(imagem.preview);
        });

        return [];
      });
    }
  };

  /* =========================================================
     UPLOAD DAS IMAGENS
  ========================================================= */

  const handleImagemChange = (event) => {
    const arquivos = Array.from(event.target.files || []);

    if (!arquivos.length) {
      return;
    }

    /* -------------------------------------------------------
       LIMITE DE 10 IMAGENS
    ------------------------------------------------------- */

    if (imagens.length + arquivos.length > 10) {
      alert("Você pode enviar no máximo 10 imagens.");
      event.target.value = "";
      return;
    }

    /* -------------------------------------------------------
       FILTRA FORMATOS PERMITIDOS
    ------------------------------------------------------- */

    const imagensValidas = arquivos.filter((arquivo) =>
      [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(arquivo.type)
    );

    if (imagensValidas.length !== arquivos.length) {
      alert("Envie apenas imagens JPG, PNG ou WEBP.");
    }

    if (!imagensValidas.length) {
      event.target.value = "";
      return;
    }

    /* -------------------------------------------------------
       CRIA PREVIEWS
    ------------------------------------------------------- */

    const novasImagens = imagensValidas.map((arquivo) => ({
      arquivo,
      preview: URL.createObjectURL(arquivo),
    }));

    setImagens((prev) => [
      ...prev,
      ...novasImagens,
    ]);

    /* -------------------------------------------------------
       PERMITE ESCOLHER O MESMO ARQUIVO NOVAMENTE
    ------------------------------------------------------- */

    event.target.value = "";
  };

  /* =========================================================
     REMOVER IMAGEM
  ========================================================= */

  const removerImagem = (index) => {
    setImagens((prev) => {
      const imagemRemovida = prev[index];

      if (imagemRemovida) {
        URL.revokeObjectURL(imagemRemovida.preview);
      }

      return prev.filter(
        (_, imagemIndex) => imagemIndex !== index
      );
    });
  };

  /* =========================================================
     FIREBASE
     SERÁ CONECTADO POSTERIORMENTE
  ========================================================= */

  const salvarContatoNoFirebase = async () => {
    /*
     * Firebase será conectado posteriormente.
     *
     * Aqui serão enviados:
     *
     * - nome
     * - whatsapp
     * - email
     * - assunto
     * - mensagem
     * - tamanho
     * - local
     * - imagens de referência
     * - data
     * - status
     */

    return true;
  };

  /* =========================================================
     ENVIO DO FORMULÁRIO
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    /* -------------------------------------------------------
       VALIDAÇÃO DO NOME
    ------------------------------------------------------- */

    if (!formData.nome.trim()) {
      alert("Por favor, informe seu nome.");
      return;
    }

    /* -------------------------------------------------------
       VALIDAÇÃO DO WHATSAPP
    ------------------------------------------------------- */

    if (!formData.whatsapp.trim()) {
      alert("Por favor, informe seu WhatsApp.");
      return;
    }

    /* -------------------------------------------------------
       VALIDAÇÃO DO ORÇAMENTO
    ------------------------------------------------------- */

    if (
      formData.assunto === "Orçamento de tatuagem"
    ) {
      if (!formData.tamanho.trim()) {
        alert(
          "Por favor, informe o tamanho aproximado da tatuagem."
        );
        return;
      }

      if (!formData.local.trim()) {
        alert(
          "Por favor, informe o local onde deseja fazer a tatuagem."
        );
        return;
      }
    }

    /* -------------------------------------------------------
       VALIDAÇÃO DA MENSAGEM
    ------------------------------------------------------- */

    if (!formData.mensagem.trim()) {
      alert("Por favor, escreva uma mensagem.");
      return;
    }

    /* -------------------------------------------------------
       GUARDA O TIPO ANTES DE LIMPAR
    ------------------------------------------------------- */

    const eraOrcamento =
      formData.assunto === "Orçamento de tatuagem";

    try {
      await salvarContatoNoFirebase();

      setEnviado(true);

      /* -----------------------------------------------------
         LIMPA FORMULÁRIO
      ----------------------------------------------------- */

      setFormData({
        nome: "",
        whatsapp: "",
        email: "",
        assunto: "",
        mensagem: "",
        tamanho: "",
        local: "",
      });

      /* -----------------------------------------------------
         LIMPA IMAGENS
      ----------------------------------------------------- */

      setImagens((prev) => {
        prev.forEach((imagem) => {
          URL.revokeObjectURL(imagem.preview);
        });

        return [];
      });

      /* -----------------------------------------------------
         MENSAGEM NO CONSOLE
      ----------------------------------------------------- */

      console.log(
        eraOrcamento
          ? "Solicitação de orçamento enviada."
          : "Mensagem enviada."
      );

      /* -----------------------------------------------------
         ESCONDE AVISO APÓS 5 SEGUNDOS
      ----------------------------------------------------- */

      setTimeout(() => {
        setEnviado(false);
      }, 5000);
    } catch (error) {
      console.error(
        "Erro ao enviar contato:",
        error
      );

      alert(
        "Não foi possível enviar sua mensagem. Tente novamente."
      );
    }
  };

  /* =========================================================
     VERIFICA SE É ORÇAMENTO
  ========================================================= */

  const isOrcamento =
    formData.assunto === "Orçamento de tatuagem";

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="contato-page">

      <Header />

      <main className="contato-main">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="contato-hero">

          <span className="contato-eyebrow">
            KSA STUDIO
          </span>

          <h1>
            Vamos conversar
          </h1>

          <div className="contato-line"></div>

          <p>
            Tem uma ideia para sua próxima tatuagem?
            Entre em contato e vamos transformar sua ideia
            em algo único.
          </p>

        </section>

        {/* =================================================
            CONTEÚDO PRINCIPAL
        ================================================= */}

        <section className="contato-container">

          {/* =================================================
              INFORMAÇÕES
          ================================================= */}

          <div className="contato-info">

            <div className="contato-info-header">

              <span className="contato-label">
                FALE COM A KATARINE
              </span>

              <h2>
                Seu projeto começa aqui.
              </h2>

              <p>
                Para orçamento, dúvidas ou informações
                sobre tatuagens, envie uma mensagem pelo
                formulário. Seus dados serão recebidos
                pela KSA Studio.
              </p>

            </div>

            {/* =================================================
                WHATSAPP
            ================================================= */}

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contato-whatsapp"
            >

              <div className="contato-icon">
                <FaWhatsapp />
              </div>

              <div className="contato-whatsapp-text">

                <span>
                  WHATSAPP
                </span>

                <strong>
                  (34) 98406-5905
                </strong>

                <small>
                  Clique para iniciar uma conversa
                </small>

              </div>

              <FaArrowRight
                className="contato-arrow"
              />

            </a>

            {/* =================================================
                INSTAGRAM
            ================================================= */}

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contato-social"
            >

              <div className="contato-social-icon">
                <FaInstagram />
              </div>

              <div>

                <span>
                  INSTAGRAM
                </span>

                <strong>
                  @ksastudio_
                </strong>

              </div>

              <FaArrowRight
                className="contato-arrow"
              />

            </a>

            {/* =================================================
                LOCAIS
            ================================================= */}

            <div className="contato-locais">

              <span className="contato-label">
                ATENDIMENTO
              </span>

              <div className="contato-local">

                <FaMapMarkerAlt />

                <div>

                  <strong>
                    Uberaba — MG
                  </strong>

                  <span>
                    Atendimento no studio
                  </span>

                </div>

              </div>

              <div className="contato-local">

                <FaMapMarkerAlt />

                <div>

                  <strong>
                    São Paulo — SP
                  </strong>

                  <span>
                    Atendimento mediante disponibilidade
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              FORMULÁRIO
          ================================================= */}

          <div className="contato-form-card">

            <div className="contato-form-header">

              <span className="contato-label">
                ENVIE UMA MENSAGEM
              </span>

              <h2>
                Conte sua ideia
              </h2>

              <p>
                Preencha os dados abaixo e envie sua
                mensagem para a KSA Studio.
              </p>

            </div>

            {/* =================================================
                MENSAGEM DE SUCESSO
            ================================================= */}

            {enviado && (
              <div className="contato-success">

                <div>
                  <FaCheck />
                </div>

                <span>
                  Mensagem enviada com sucesso.
                </span>

              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="contato-form"
              onSubmit={handleSubmit}
            >

              {/* =================================================
                  NOME
              ================================================= */}

              <div className="contato-field">

                <label htmlFor="nome">
                  NOME
                </label>

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                />

              </div>

              {/* =================================================
                  WHATSAPP + EMAIL
              ================================================= */}

              <div className="contato-fields-row">

                <div className="contato-field">

                  <label htmlFor="whatsapp">
                    WHATSAPP
                  </label>

                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    autoComplete="tel"
                    required
                  />

                </div>

                <div className="contato-field">

                  <label htmlFor="email">
                    E-MAIL
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* =================================================
                  ASSUNTO
              ================================================= */}

              <div className="contato-field">

                <label htmlFor="assunto">
                  ASSUNTO
                </label>

                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                >

                  <option value="">
                    Selecione uma opção
                  </option>

                  <option value="Orçamento de tatuagem">
                    Orçamento de tatuagem
                  </option>

                  <option value="Flash">
                    Flash
                  </option>

                  <option value="Agendamento">
                    Agendamento
                  </option>

                  <option value="Dúvida">
                    Dúvida
                  </option>

                  <option value="Outro">
                    Outro
                  </option>

                </select>

              </div>

              {/* =================================================
                  ÁREA DE ORÇAMENTO
              ================================================= */}

              {isOrcamento && (
                <div className="contato-orcamento-box">

                  {/* =================================================
                      CABEÇALHO
                  ================================================= */}

                  <div className="contato-orcamento-header">

                    <span className="contato-label">
                      SOBRE SUA TATUAGEM
                    </span>

                    <h3>
                      Vamos entender seu projeto.
                    </h3>

                    <p>
                      Para agilizar seu atendimento, informe
                      o tamanho e o local da tatuagem. Se tiver
                      referências, você também pode enviá-las.
                    </p>

                  </div>

                  {/* =================================================
                      TAMANHO + LOCAL
                  ================================================= */}

                  <div className="contato-fields-row">

                    <div className="contato-field">

                      <label htmlFor="tamanho">
                        TAMANHO DA TATUAGEM
                      </label>

                      <input
                        id="tamanho"
                        name="tamanho"
                        type="text"
                        value={formData.tamanho}
                        onChange={handleChange}
                        placeholder="Ex.: 10 cm"
                        required={isOrcamento}
                      />

                    </div>

                    <div className="contato-field">

                      <label htmlFor="local">
                        LOCAL DA TATUAGEM
                      </label>

                      <input
                        id="local"
                        name="local"
                        type="text"
                        value={formData.local}
                        onChange={handleChange}
                        placeholder="Ex.: antebraço"
                        required={isOrcamento}
                      />

                    </div>

                  </div>

                  {/* =================================================
                      REFERÊNCIAS DA TATUAGEM
                  ================================================= */}

                  <div className="contato-upload-section">

                    <span className="contato-upload-title">
                      REFERÊNCIAS DA TATUAGEM
                    </span>

                    <label
                      htmlFor="imagens"
                      className="contato-upload"
                    >

                      {/* ÍCONE */}

                      <div className="contato-upload-icon">
                        <FaImage />
                      </div>

                      {/* TEXTOS */}

                      <div className="contato-upload-text">

                        <strong>
                          ADICIONAR REFERÊNCIAS
                        </strong>

                        <span>
                          Clique para escolher suas fotos
                        </span>

                        <small>
                          JPG, PNG ou WEBP • Até 10 arquivos
                        </small>

                      </div>

                      {/* SETA */}

                      <div className="contato-upload-arrow">
                        <FaArrowRight />
                      </div>

                    </label>

                    {/* =================================================
                        INPUT REAL ESCONDIDO
                    ================================================= */}

                    <input
                      id="imagens"
                      name="imagens"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImagemChange}
                      className="contato-file-input"
                      style={{ display: "none" }}
                    />

                    {/* =================================================
                        PREVIEW DAS IMAGENS
                    ================================================= */}

                    {imagens.length > 0 && (
                      <div className="contato-image-preview">

                        {imagens.map((imagem, index) => (

                          <div
                            className="contato-image-item"
                            key={`${imagem.preview}-${index}`}
                          >

                            <img
                              src={imagem.preview}
                              alt={`Referência ${index + 1}`}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removerImagem(index)
                              }
                              aria-label={`Remover referência ${index + 1}`}
                              className="contato-remove-image"
                            >

                              <FaTimes />

                            </button>

                          </div>

                        ))}

                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* =================================================
                  MENSAGEM
              ================================================= */}

              <div className="contato-field">

                <label htmlFor="mensagem">
                  MENSAGEM
                </label>

                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Conte um pouco sobre sua ideia..."
                  rows="6"
                  required
                />

              </div>

              {/* =================================================
                  BOTÃO ENVIAR
              ================================================= */}

              <button
                type="submit"
                className="contato-submit"
              >

                <span>
                  {isOrcamento
                    ? "SOLICITAR ORÇAMENTO"
                    : "ENVIAR"}
                </span>

                <FaArrowRight />

              </button>

              {/* =================================================
                  AVISO
              ================================================= */}

              <p className="contato-form-note">
                Ao enviar, seus dados serão utilizados para
                responder ao seu contato. As informações serão
                armazenadas com segurança no painel administrativo
                da KSA Studio.
              </p>

            </form>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}

export default Contato;