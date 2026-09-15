
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  FaArrowLeft,
  FaFileMedical,
  FaUser,
  FaHeartbeat,
  FaPaintBrush,
  FaCheckCircle,
  FaSignOutAlt,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { auth, db } from "../../lib/firebase";

import "./AdminAnamneses.css";

const EMAIL_ADMIN = "anaramartins21@gmail.com";

function AdminAnamneses() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [anamneses, setAnamneses] = useState([]);
  const [anamneseSelecionada, setAnamneseSelecionada] =
    useState(null);
  const [carregando, setCarregando] = useState(true);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  // =====================================================
  // VERIFICAR USUÁRIO
  // =====================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          navigate("/admin");
          return;
        }

        if (user.email !== EMAIL_ADMIN) {
          navigate("/admin");
          return;
        }

        setUsuario(user);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  // =====================================================
  // BUSCAR ANAMNESES
  // =====================================================

  useEffect(() => {
    if (!usuario) return;

    const anamnesesRef = collection(
      db,
      "anamneses"
    );

    const unsubscribe = onSnapshot(
      anamnesesRef,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        lista.sort((a, b) => {
          const dataA =
            a.atualizadoEm?.seconds ||
            a.criadoEm?.seconds ||
            0;

          const dataB =
            b.atualizadoEm?.seconds ||
            b.criadoEm?.seconds ||
            0;

          return dataB - dataA;
        });

        setAnamneses(lista);
        setCarregando(false);
      },
      (error) => {
        console.error(
          "Erro ao carregar anamneses:",
          error
        );

        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, [usuario]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // =====================================================
  // FORMATADORES
  // =====================================================

  const valor = (valorCampo) => {
    if (
      valorCampo === undefined ||
      valorCampo === null ||
      valorCampo === ""
    ) {
      return "Não informado";
    }

    return String(valorCampo);
  };

  const formatarData = (data) => {
    if (!data) return "Não informado";

    if (typeof data === "string") {
      const partes = data.split("-");

      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }

      return data;
    }

    if (data?.toDate) {
      return data
        .toDate()
        .toLocaleDateString("pt-BR");
    }

    return "Não informado";
  };

  const formatarDataHora = (timestamp) => {
    if (!timestamp?.toDate) {
      return "Não informado";
    }

    return timestamp
      .toDate()
      .toLocaleString("pt-BR");
  };

  // =====================================================
  // LIMPAR TEXTO PARA PDF
  // =====================================================

  const limparTextoPdf = (texto) => {
    if (
      texto === undefined ||
      texto === null
    ) {
      return "";
    }

    return String(texto)
      .replace(/\r?\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // =====================================================
  // GERAR PDF
  // =====================================================

  const gerarPDF = () => {
    if (!anamneseSelecionada) {
      return;
    }

    try {
      setGerandoPdf(true);

      const anamnese = anamneseSelecionada;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const larguraPagina =
        doc.internal.pageSize.getWidth();

      const alturaPagina =
        doc.internal.pageSize.getHeight();

      const margem = 18;

      // =================================================
      // CORES
      // =================================================

      const dourado = [180, 145, 45];
      const preto = [20, 20, 20];
      const cinza = [90, 90, 90];
      const cinzaClaro = [235, 235, 235];

      // =================================================
      // CABEÇALHO
      // =================================================

      doc.setFillColor(
        preto[0],
        preto[1],
        preto[2]
      );

      doc.rect(
        0,
        0,
        larguraPagina,
        32,
        "F"
      );

      doc.setTextColor(255, 255, 255);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(19);

      doc.text(
        "KSA STUDIO",
        margem,
        14
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.setTextColor(
        205,
        205,
        205
      );

      doc.text(
        "TATUAGEM • ARTE • ESTILO",
        margem,
        21
      );

      doc.setTextColor(
        dourado[0],
        dourado[1],
        dourado[2]
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");

      doc.text(
        "FICHA DE ANAMNESE",
        larguraPagina - margem,
        17,
        {
          align: "right",
        }
      );

      // =================================================
      // TÍTULO
      // =================================================

      let y = 46;

      doc.setTextColor(
        preto[0],
        preto[1],
        preto[2]
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);

      doc.text(
        "Ficha de Anamnese",
        margem,
        y
      );

      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      doc.setTextColor(
        cinza[0],
        cinza[1],
        cinza[2]
      );

      doc.text(
        `Cliente: ${limparTextoPdf(
          valor(anamnese.nome)
        )}`,
        margem,
        y
      );

      y += 5;

      doc.text(
        `Data de preenchimento: ${limparTextoPdf(
          formatarDataHora(
            anamnese.atualizadoEm ||
              anamnese.criadoEm
          )
        )}`,
        margem,
        y
      );

      y += 8;

      // =================================================
      // LINHA DOURADA
      // =================================================

      doc.setDrawColor(
        dourado[0],
        dourado[1],
        dourado[2]
      );

      doc.setLineWidth(0.5);

      doc.line(
        margem,
        y,
        larguraPagina - margem,
        y
      );

      y += 7;

      // =================================================
      // FUNÇÃO PARA SEÇÕES
      // =================================================

      const adicionarSecao = (titulo) => {
        doc.setFillColor(
          245,
          242,
          235
        );

        doc.rect(
          margem,
          y,
          larguraPagina - margem * 2,
          8,
          "F"
        );

        doc.setTextColor(
          dourado[0],
          dourado[1],
          dourado[2]
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(10);

        doc.text(
          titulo,
          margem + 4,
          y + 5.5
        );

        y += 11;
      };

      // =================================================
      // DADOS PESSOAIS
      // =================================================

      adicionarSecao(
        "DADOS PESSOAIS"
      );

      autoTable(doc, {
        startY: y,
        margin: {
          left: margem,
          right: margem,
        },

        theme: "plain",

        styles: {
          font: "helvetica",
          fontSize: 9,
          textColor: preto,
          cellPadding: 3,
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },

        columnStyles: {
          0: {
            fontStyle: "bold",
            textColor: cinza,
            cellWidth: 48,
          },
          1: {
            cellWidth: 65,
          },
          2: {
            fontStyle: "bold",
            textColor: cinza,
            cellWidth: 48,
          },
          3: {
            cellWidth: 47,
          },
        },

        body: [
          [
            "Nome",
            limparTextoPdf(
              valor(anamnese.nome)
            ),
            "Nascimento",
            limparTextoPdf(
              formatarData(
                anamnese.nascimento
              )
            ),
          ],
          [
            "Telefone / WhatsApp",
            limparTextoPdf(
              valor(anamnese.telefone)
            ),
            "E-mail",
            limparTextoPdf(
              valor(anamnese.email)
            ),
          ],
        ],
      });

      y =
        doc.lastAutoTable.finalY + 8;

      // =================================================
      // SAÚDE
      // =================================================

      adicionarSecao("SAÚDE");

      autoTable(doc, {
        startY: y,
        margin: {
          left: margem,
          right: margem,
        },

        theme: "plain",

        styles: {
          font: "helvetica",
          fontSize: 9,
          textColor: preto,
          cellPadding: 3,
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },

        columnStyles: {
          0: {
            fontStyle: "bold",
            textColor: cinza,
            cellWidth: 60,
          },
          1: {
            cellWidth: 148,
          },
        },

        body: [
          [
            "Possui alergias?",
            limparTextoPdf(
              valor(
                anamnese.alergia
              )
            ),
          ],
          [
            "Quais alergias?",
            limparTextoPdf(
              valor(
                anamnese.alergias
              )
            ),
          ],
          [
            "Usa medicamentos?",
            limparTextoPdf(
              valor(
                anamnese.medicamento
              )
            ),
          ],
          [
            "Quais medicamentos?",
            limparTextoPdf(
              valor(
                anamnese.medicamentos
              )
            ),
          ],
        ],
      });

      y =
        doc.lastAutoTable.finalY + 8;

      // =================================================
      // TATUAGEM
      // =================================================

      adicionarSecao(
        "INFORMAÇÕES DA TATUAGEM"
      );

      autoTable(doc, {
        startY: y,
        margin: {
          left: margem,
          right: margem,
        },

        theme: "plain",

        styles: {
          font: "helvetica",
          fontSize: 9,
          textColor: preto,
          cellPadding: 3,
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },

        columnStyles: {
          0: {
            fontStyle: "bold",
            textColor: cinza,
            cellWidth: 48,
          },
          1: {
            cellWidth: 56,
          },
          2: {
            fontStyle: "bold",
            textColor: cinza,
            cellWidth: 48,
          },
          3: {
            cellWidth: 56,
          },
        },

        body: [
          [
            "Local",
            limparTextoPdf(
              valor(anamnese.local)
            ),
            "Tamanho",
            limparTextoPdf(
              valor(anamnese.tamanho)
            ),
          ],
          [
            "Estilo",
            limparTextoPdf(
              valor(anamnese.estilo)
            ),
            "",
            "",
          ],
        ],
      });

      y =
        doc.lastAutoTable.finalY + 6;

      // =================================================
      // IDEIA
      // =================================================

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.setTextColor(
        cinza[0],
        cinza[1],
        cinza[2]
      );

      doc.text(
        "IDEIA / DESCRIÇÃO",
        margem,
        y
      );

      y += 5;

      const ideia = limparTextoPdf(
        valor(anamnese.ideia)
      );

      const linhasIdeia =
        doc.splitTextToSize(
          ideia,
          larguraPagina - margem * 2 - 8
        );

      const alturaCaixa =
        Math.max(
          14,
          linhasIdeia.length * 4.5 + 8
        );

      doc.setFillColor(
        248,
        248,
        248
      );

      doc.setDrawColor(
        225,
        225,
        225
      );

      doc.roundedRect(
        margem,
        y,
        larguraPagina - margem * 2,
        alturaCaixa,
        2,
        2,
        "FD"
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.setTextColor(
        preto[0],
        preto[1],
        preto[2]
      );

      doc.text(
        linhasIdeia,
        margem + 4,
        y + 6
      );

      y += alturaCaixa + 8;

      // =================================================
      // CONSENTIMENTO
      // =================================================

      adicionarSecao(
        "CONSENTIMENTO"
      );

      const consentimento =
        anamnese.consentimento
          ? "CONFIRMADO"
          : "NÃO CONFIRMADO";

      if (anamnese.consentimento) {
        doc.setFillColor(
          232,
          245,
          235
        );
      } else {
        doc.setFillColor(
          250,
          235,
          235
        );
      }

      doc.roundedRect(
        margem,
        y,
        larguraPagina - margem * 2,
        18,
        2,
        2,
        "F"
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(10);

      if (anamnese.consentimento) {
        doc.setTextColor(
          65,
          120,
          75
        );
      } else {
        doc.setTextColor(
          155,
          65,
          65
        );
      }

      doc.text(
        `Consentimento: ${consentimento}`,
        margem + 5,
        y + 7
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(8);

      doc.setTextColor(
        cinza[0],
        cinza[1],
        cinza[2]
      );

      doc.text(
        anamnese.consentimento
          ? "Cliente confirmou as informações fornecidas no formulário."
          : "O consentimento não foi confirmado no formulário.",
        margem + 5,
        y + 13
      );

      y += 27;

      // =================================================
      // RODAPÉ
      // =================================================

      const adicionarRodape = () => {
        const paginaAtual =
          doc.internal.getNumberOfPages();

        for (
          let pagina = 1;
          pagina <= paginaAtual;
          pagina++
        ) {
          doc.setPage(pagina);

          doc.setDrawColor(
            220,
            220,
            220
          );

          doc.setLineWidth(0.2);

          doc.line(
            margem,
            alturaPagina - 17,
            larguraPagina - margem,
            alturaPagina - 17
          );

          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setFontSize(7);

          doc.setTextColor(
            120,
            120,
            120
          );

          doc.text(
            "KSA Studio — Documento de uso interno",
            margem,
            alturaPagina - 10
          );

          doc.text(
            `Página ${pagina} de ${paginaAtual}`,
            larguraPagina - margem,
            alturaPagina - 10,
            {
              align: "right",
            }
          );
        }
      };

      adicionarRodape();

      // =================================================
      // NOME DO ARQUIVO
      // =================================================

      const nomeCliente =
        limparTextoPdf(
          valor(anamnese.nome)
        )
          .normalize("NFD")
          .replace(
            /[\u0300-\u036f]/g,
            ""
          )
          .replace(
            /[^a-zA-Z0-9]+/g,
            "_"
          )
          .replace(
            /^_+|_+$/g,
            ""
          );

      const nomeArquivo =
        `Anamnese_KSA_${nomeCliente || "Cliente"}.pdf`;

      doc.save(nomeArquivo);

      setGerandoPdf(false);
    } catch (error) {
      console.error(
        "Erro ao gerar PDF:",
        error
      );

      alert(
        "Não foi possível gerar o PDF. Verifique o console para mais detalhes."
      );

      setGerandoPdf(false);
    }
  };

  // =====================================================
  // NAVEGAÇÃO
  // =====================================================

  const voltarDashboard = () => {
    navigate("/admin/dashboard");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-anamneses">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-anamneses-header">

        <div className="admin-anamneses-header-left">

          <button
            className="admin-anamneses-back"
            onClick={voltarDashboard}
          >
            <FaArrowLeft />

            <span>
              Dashboard
            </span>
          </button>

          <div className="admin-anamneses-title">

            <div className="admin-anamneses-title-icon">
              <FaFileMedical />
            </div>

            <div>
              <h1>
                Anamneses
              </h1>

              <p>
                Formulários preenchidos pelos clientes
              </p>
            </div>

          </div>

        </div>

        <div className="admin-anamneses-header-right">

          {usuario && (
            <div className="admin-anamneses-user">
              <span>
                {usuario.displayName ||
                  usuario.email}
              </span>
            </div>
          )}

          <button
            className="admin-anamneses-logout"
            onClick={handleLogout}
            title="Sair"
          >
            <FaSignOutAlt />
          </button>

        </div>

      </header>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <main className="admin-anamneses-content">

        <div className="admin-anamneses-top">

          <div>

            <span className="admin-anamneses-label">
              CLIENTES
            </span>

            <h2>
              Anamneses cadastradas
            </h2>

            <p>
              Consulte as informações preenchidas
              antes dos procedimentos.
            </p>

          </div>

          <div className="admin-anamneses-count">

            <FaFileMedical />

            <strong>
              {String(
                anamneses.length
              ).padStart(2, "0")}
            </strong>

            <span>
              formulários
            </span>

          </div>

        </div>

        {/* =================================================
            CARREGANDO
        ================================================= */}

        {carregando && (
          <div className="admin-anamneses-empty">

            <FaFileMedical />

            <h3>
              Carregando anamneses...
            </h3>

            <p>
              Aguarde enquanto buscamos os
              formulários dos clientes.
            </p>

          </div>
        )}

        {/* =================================================
            VAZIO
        ================================================= */}

        {!carregando &&
          anamneses.length === 0 && (
            <div className="admin-anamneses-empty">

              <FaFileMedical />

              <h3>
                Nenhuma anamnese encontrada
              </h3>

              <p>
                Quando um cliente preencher o
                formulário, ele aparecerá aqui.
              </p>

            </div>
          )}

        {/* =================================================
            LISTA
        ================================================= */}

        {!carregando &&
          anamneses.length > 0 && (
            <div className="admin-anamneses-list">

              {anamneses.map(
                (anamnese) => (
                  <button
                    key={anamnese.id}
                    className="admin-anamnese-card"
                    onClick={() =>
                      setAnamneseSelecionada(
                        anamnese
                      )
                    }
                  >

                    <div className="admin-anamnese-card-icon">
                      <FaFileMedical />
                    </div>

                    <div className="admin-anamnese-card-info">

                      <h3>
                        {valor(
                          anamnese.nome
                        )}
                      </h3>

                      <div className="admin-anamnese-card-details">

                        <span>
                          <FaPhone />

                          {valor(
                            anamnese.telefone
                          )}
                        </span>

                        <span>
                          <FaEnvelope />

                          {valor(
                            anamnese.email
                          )}
                        </span>

                      </div>

                      <small>
                        Atualizado em{" "}
                        {formatarDataHora(
                          anamnese.atualizadoEm ||
                            anamnese.criadoEm
                        )}
                      </small>

                    </div>

                    <div className="admin-anamnese-card-arrow">
                      →
                    </div>

                  </button>
                )
              )}

            </div>
          )}

      </main>

      {/* =================================================
          MODAL DA ANAMNESE
      ================================================= */}

      {anamneseSelecionada && (
        <div
          className="admin-anamnese-modal-overlay"
          onClick={() =>
            setAnamneseSelecionada(
              null
            )
          }
        >

          <div
            className="admin-anamnese-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="admin-anamnese-modal-header">

              <div>

                <span>
                  FICHA DO CLIENTE
                </span>

                <h2>
                  {valor(
                    anamneseSelecionada.nome
                  )}
                </h2>

              </div>

              <button
                onClick={() =>
                  setAnamneseSelecionada(
                    null
                  )
                }
                className="admin-anamnese-modal-close"
                title="Fechar"
              >
                <FaTimes />
              </button>

            </div>

            {/* CONTEÚDO */}

            <div className="admin-anamnese-modal-content">

              {/* DADOS PESSOAIS */}

              <section className="admin-anamnese-section">

                <div className="admin-anamnese-section-title">

                  <FaUser />

                  <h3>
                    Dados pessoais
                  </h3>

                </div>

                <div className="admin-anamnese-grid">

                  <div className="admin-anamnese-field">

                    <span>
                      Nome
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.nome
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      Data de nascimento
                    </span>

                    <strong>
                      {formatarData(
                        anamneseSelecionada.nascimento
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      Telefone / WhatsApp
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.telefone
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      E-mail
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.email
                      )}
                    </strong>

                  </div>

                </div>

              </section>

              {/* SAÚDE */}

              <section className="admin-anamnese-section">

                <div className="admin-anamnese-section-title">

                  <FaHeartbeat />

                  <h3>
                    Saúde
                  </h3>

                </div>

                <div className="admin-anamnese-grid">

                  <div className="admin-anamnese-field">

                    <span>
                      Possui alergias?
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.alergia
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      Quais alergias?
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.alergias
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      Usa medicamentos?
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.medicamento
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      Quais medicamentos?
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.medicamentos
                      )}
                    </strong>

                  </div>

                </div>

              </section>

              {/* TATUAGEM */}

              <section className="admin-anamnese-section">

                <div className="admin-anamnese-section-title">

                  <FaPaintBrush />

                  <h3>
                    Informações da tatuagem
                  </h3>

                </div>

                <div className="admin-anamnese-grid">

                  <div className="admin-anamnese-field">

                    <span>
                      Local do corpo
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.local
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      Tamanho aproximado
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.tamanho
                      )}
                    </strong>

                  </div>

                  <div className="admin-anamnese-field">

                    <span>
                      Estilo
                    </span>

                    <strong>
                      {valor(
                        anamneseSelecionada.estilo
                      )}
                    </strong>

                  </div>

                </div>

                <div className="admin-anamnese-field admin-anamnese-field-full">

                  <span>
                    Ideia / descrição
                  </span>

                  <strong>
                    {valor(
                      anamneseSelecionada.ideia
                    )}
                  </strong>

                </div>

              </section>

              {/* CONSENTIMENTO */}

              <section className="admin-anamnese-section">

                <div className="admin-anamnese-section-title">

                  <FaCheckCircle />

                  <h3>
                    Consentimento
                  </h3>

                </div>

                <div
                  className={
                    anamneseSelecionada.consentimento
                      ? "admin-anamnese-consentimento aprovado"
                      : "admin-anamnese-consentimento"
                  }
                >

                  <FaCheckCircle />

                  <div>

                    <strong>
                      {anamneseSelecionada.consentimento
                        ? "Consentimento confirmado"
                        : "Consentimento não confirmado"}
                    </strong>

                    <p>
                      {anamneseSelecionada.consentimento
                        ? "O cliente confirmou as informações e autorizou o procedimento."
                        : "O cliente não confirmou o consentimento no formulário."}
                    </p>

                  </div>

                </div>

              </section>

              {/* CONTA GOOGLE */}

              {(anamneseSelecionada.nomeGoogle ||
                anamneseSelecionada.email) && (
                <section className="admin-anamnese-section admin-anamnese-google">

                  <div className="admin-anamnese-section-title">

                    <FaEnvelope />

                    <h3>
                      Conta utilizada
                    </h3>

                  </div>

                  <div className="admin-anamnese-google-info">

                    <div>

                      <span>
                        Conta Google
                      </span>

                      <strong>
                        {valor(
                          anamneseSelecionada.nomeGoogle
                        )}
                      </strong>

                    </div>

                    <div>

                      <span>
                        E-mail
                      </span>

                      <strong>
                        {valor(
                          anamneseSelecionada.email
                        )}
                      </strong>

                    </div>

                  </div>

                </section>
              )}

            </div>

            {/* =================================================
                FOOTER DO MODAL
            ================================================= */}

            <div className="admin-anamnese-modal-footer">

              <span>
                Última atualização:{" "}
                {formatarDataHora(
                  anamneseSelecionada.atualizadoEm ||
                    anamneseSelecionada.criadoEm
                )}
              </span>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >

                <button
                  onClick={gerarPDF}
                  disabled={gerandoPdf}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    minWidth: "125px",
                    opacity: gerandoPdf
                      ? 0.6
                      : 1,
                    cursor: gerandoPdf
                      ? "wait"
                      : "pointer",
                  }}
                >
                  <FaDownload />

                  {gerandoPdf
                    ? "Gerando..."
                    : "Gerar PDF"}
                </button>

                <button
                  onClick={() =>
                    setAnamneseSelecionada(
                      null
                    )
                  }
                >
                  Fechar
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="admin-anamneses-footer">

        <span>
          KSA Studio
        </span>

        <span>
          Painel administrativo
        </span>

      </footer>

    </div>
  );
}

export default AdminAnamneses;