
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  FaArrowLeft,
  FaSearch,
  FaPlus,
  FaUser,
  FaUsers,
  FaPhone,
  FaInstagram,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaCalendarAlt,
  FaHistory,
  FaChevronRight,
  FaPaintBrush,
  FaMoneyBillWave,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { db } from "../../lib/firebase";

import "./AdminCRM.css";

function AdminCRM() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState("novo");

  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const [trabalhos, setTrabalhos] = useState([]);
  const [carregandoTrabalhos, setCarregandoTrabalhos] = useState(false);

  const [modalTrabalhoAberto, setModalTrabalhoAberto] = useState(false);
  const [salvandoTrabalho, setSalvandoTrabalho] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: "",
    whatsapp: "",
    instagram: "",
    email: "",
    observacoes: "",
  });

  const [formularioTrabalho, setFormularioTrabalho] = useState({
    descricao: "",
    data: "",
    localCorpo: "",
    estilo: "",
    valorTotal: "",
    valorSinal: "",
    formaPagamentoSinal: "",
    observacoes: "",
  });

  useEffect(() => {
    const clientesRef = collection(db, "clientes");

    const unsubscribe = onSnapshot(
      clientesRef,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        lista.sort((a, b) => {
          const nomeA = (a.nome || "").toLowerCase();
          const nomeB = (b.nome || "").toLowerCase();

          return nomeA.localeCompare(nomeB, "pt-BR");
        });

        setClientes(lista);
      },
      (error) => {
        console.error("Erro ao carregar clientes:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!clienteSelecionado?.id || !modalAberto) {
      setTrabalhos([]);
      return;
    }

    setCarregandoTrabalhos(true);

    const trabalhosRef = collection(
      db,
      "clientes",
      clienteSelecionado.id,
      "trabalhos"
    );

    const unsubscribe = onSnapshot(
      trabalhosRef,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        lista.sort((a, b) => {
          const dataA = a.data || "";
          const dataB = b.data || "";

          return dataB.localeCompare(dataA);
        });

        setTrabalhos(lista);
        setCarregandoTrabalhos(false);
      },
      (error) => {
        console.error("Erro ao carregar trabalhos:", error);
        setCarregandoTrabalhos(false);
      }
    );

    return () => unsubscribe();
  }, [clienteSelecionado?.id, modalAberto]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleTrabalhoChange = (event) => {
    const { name, value } = event.target;

    setFormularioTrabalho((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const abrirNovoCliente = () => {
    setModoModal("novo");
    setClienteSelecionado(null);
    setTrabalhos([]);

    setFormulario({
      nome: "",
      whatsapp: "",
      instagram: "",
      email: "",
      observacoes: "",
    });

    setModalAberto(true);
  };

  const abrirEdicao = (cliente) => {
    setModoModal("editar");
    setClienteSelecionado(cliente);

    setFormulario({
      nome: cliente.nome || "",
      whatsapp: cliente.whatsapp || "",
      instagram: cliente.instagram || "",
      email: cliente.email || "",
      observacoes: cliente.observacoes || "",
    });

    setModalAberto(true);
  };

  const abrirFicha = (cliente) => {
    setClienteSelecionado(cliente);
    setModoModal("visualizar");
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando || salvandoTrabalho) return;

    setModalAberto(false);
    setModalTrabalhoAberto(false);
    setClienteSelecionado(null);
    setTrabalhos([]);
  };

  const salvarCliente = async (event) => {
    event.preventDefault();

    const nomeLimpo = formulario.nome.trim();

    if (!nomeLimpo) {
      alert("Digite o nome do cliente.");
      return;
    }

    try {
      setSalvando(true);

      if (modoModal === "novo") {
        await addDoc(collection(db, "clientes"), {
          nome: nomeLimpo,
          whatsapp: formulario.whatsapp.trim(),
          instagram: formulario.instagram.trim(),
          email: formulario.email.trim(),
          observacoes: formulario.observacoes.trim(),

          statusCliente: "novo",
          quantidadeTrabalhos: 0,
          valorTotalGasto: 0,

          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
        });
      }

      if (
        modoModal === "editar" &&
        clienteSelecionado
      ) {
        const clienteRef = doc(
          db,
          "clientes",
          clienteSelecionado.id
        );

        await updateDoc(clienteRef, {
          nome: nomeLimpo,
          whatsapp: formulario.whatsapp.trim(),
          instagram: formulario.instagram.trim(),
          email: formulario.email.trim(),
          observacoes: formulario.observacoes.trim(),
          atualizadoEm: serverTimestamp(),
        });
      }

      setModalAberto(false);
      setClienteSelecionado(null);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);

      alert(
        "Não foi possível salvar o cliente. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  const excluirCliente = async (cliente) => {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir ${cliente.nome || "este cliente"}?`
    );

    if (!confirmou) return;

    try {
      setExcluindo(true);

      await deleteDoc(
        doc(db, "clientes", cliente.id)
      );

      if (
        clienteSelecionado &&
        clienteSelecionado.id === cliente.id
      ) {
        setModalAberto(false);
        setClienteSelecionado(null);
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);

      alert(
        "Não foi possível excluir o cliente."
      );
    } finally {
      setExcluindo(false);
    }
  };

  const abrirNovoTrabalho = () => {
    if (!clienteSelecionado) return;

    setFormularioTrabalho({
      descricao: "",
      data: new Date().toISOString().split("T")[0],
      localCorpo: "",
      estilo: "",
      valorTotal: "",
      valorSinal: "",
      formaPagamentoSinal: "",
      observacoes: "",
    });

    setModalTrabalhoAberto(true);
  };

  const fecharModalTrabalho = () => {
    if (salvandoTrabalho) return;

    setModalTrabalhoAberto(false);
  };

  const converterValor = (valor) => {
    if (!valor) return 0;

    const normalizado = String(valor)
      .replace(/\./g, "")
      .replace(",", ".");

    const numero = Number(normalizado);

    return Number.isFinite(numero) ? numero : 0;
  };

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  };

  const valorTotalTrabalho =
    converterValor(formularioTrabalho.valorTotal);

  const valorSinalTrabalho =
    converterValor(formularioTrabalho.valorSinal);

  const valorRestanteTrabalho = Math.max(
    valorTotalTrabalho - valorSinalTrabalho,
    0
  );

  const salvarTrabalho = async (event) => {
    event.preventDefault();

    if (!clienteSelecionado) return;

    const descricaoLimpa =
      formularioTrabalho.descricao.trim();

    if (!descricaoLimpa) {
      alert("Digite uma descrição para o trabalho.");
      return;
    }

    if (valorTotalTrabalho <= 0) {
      alert("Informe o valor total da tatuagem.");
      return;
    }

    if (valorSinalTrabalho > valorTotalTrabalho) {
      alert(
        "O sinal não pode ser maior que o valor total."
      );
      return;
    }

    try {
      setSalvandoTrabalho(true);

      const trabalhosRef = collection(
        db,
        "clientes",
        clienteSelecionado.id,
        "trabalhos"
      );

      await addDoc(trabalhosRef, {
        descricao: descricaoLimpa,
        data: formularioTrabalho.data || "",
        localCorpo:
          formularioTrabalho.localCorpo.trim(),
        estilo:
          formularioTrabalho.estilo.trim(),

        valorTotal: valorTotalTrabalho,
        valorSinal: valorSinalTrabalho,
        valorRestante: valorRestanteTrabalho,
        valorPago: valorSinalTrabalho,

        formaPagamentoSinal:
          formularioTrabalho.formaPagamentoSinal,

        observacoes:
          formularioTrabalho.observacoes.trim(),

        statusFinanceiro:
          valorSinalTrabalho >= valorTotalTrabalho
            ? "pago"
            : valorSinalTrabalho > 0
            ? "sinal_pago"
            : "pendente",

        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      });

      const clienteRef = doc(
        db,
        "clientes",
        clienteSelecionado.id
      );

      const quantidadeAtual =
        Number(
          clienteSelecionado.quantidadeTrabalhos
        ) || 0;

      const valorTotalAtual =
        Number(
          clienteSelecionado.valorTotalGasto
        ) || 0;

      const novaQuantidade =
        quantidadeAtual + 1;

      const novoValorTotal =
        valorTotalAtual + valorTotalTrabalho;

      await updateDoc(clienteRef, {
        quantidadeTrabalhos: novaQuantidade,
        valorTotalGasto: novoValorTotal,
        statusCliente:
          novaQuantidade >= 2
            ? "recorrente"
            : "cliente",
        atualizadoEm: serverTimestamp(),
      });

      setClienteSelecionado((anterior) => ({
        ...anterior,
        quantidadeTrabalhos: novaQuantidade,
        valorTotalGasto: novoValorTotal,
        statusCliente:
          novaQuantidade >= 2
            ? "recorrente"
            : "cliente",
      }));

      setModalTrabalhoAberto(false);

      setFormularioTrabalho({
        descricao: "",
        data: "",
        localCorpo: "",
        estilo: "",
        valorTotal: "",
        valorSinal: "",
        formaPagamentoSinal: "",
        observacoes: "",
      });
    } catch (error) {
      console.error("Erro ao salvar trabalho:", error);

      alert(
        "Não foi possível cadastrar o trabalho. Tente novamente."
      );
    } finally {
      setSalvandoTrabalho(false);
    }
  };

  const obterStatusCliente = (cliente) => {
    const quantidade =
      Number(cliente.quantidadeTrabalhos) || 0;

    if (quantidade >= 2) {
      return {
        texto: "Recorrente",
        classe: "recorrente",
      };
    }

    if (quantidade === 1) {
      return {
        texto: "Cliente",
        classe: "cliente",
      };
    }

    return {
      texto: "Novo",
      classe: "novo",
    };
  };

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return clientes;
    }

    return clientes.filter((cliente) => {
      const nome =
        (cliente.nome || "").toLowerCase();

      const whatsapp =
        (cliente.whatsapp || "").toLowerCase();

      const instagram =
        (cliente.instagram || "").toLowerCase();

      const email =
        (cliente.email || "").toLowerCase();

      return (
        nome.includes(termo) ||
        whatsapp.includes(termo) ||
        instagram.includes(termo) ||
        email.includes(termo)
      );
    });
  }, [clientes, busca]);

  const formatarData = (timestamp) => {
    if (!timestamp) {
      return "Não informado";
    }

    try {
      const data = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      return data.toLocaleDateString("pt-BR");
    } catch {
      return "Não informado";
    }
  };

  const formatarDataSimples = (data) => {
    if (!data) return "Não informada";

    try {
      const partes = data.split("-");

      if (partes.length !== 3) {
        return data;
      }

      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    } catch {
      return data;
    }
  };

  const quantidadeNovos = clientes.filter(
    (cliente) =>
      obterStatusCliente(cliente).classe ===
      "novo"
  ).length;

  const quantidadeRecorrentes = clientes.filter(
    (cliente) =>
      obterStatusCliente(cliente).classe ===
      "recorrente"
  ).length;

  return (
    <main className="admin-crm">

      <header className="admin-crm-header">

        <div className="admin-crm-header-left">

          <button
            type="button"
            className="admin-crm-back"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            <span>Voltar</span>
          </button>

          <div className="admin-crm-title">

            <div className="admin-crm-title-icon">
              <FaUser />
            </div>

            <div>
              <span>GESTÃO DE CLIENTES</span>

              <h1>CRM</h1>

              <p>
                Clientes, histórico e relacionamento
              </p>
            </div>

          </div>

        </div>

        <div className="admin-crm-header-count">

          <span>CLIENTES</span>

          <strong>
            {String(clientes.length).padStart(2, "0")}
          </strong>

        </div>

      </header>

      <section className="admin-crm-content">

        <div className="admin-crm-summary">

          <div className="admin-crm-summary-card">
            <span>TOTAL</span>

            <strong>
              {clientes.length}
            </strong>

            <small>
              clientes cadastrados
            </small>
          </div>

          <div className="admin-crm-summary-card">
            <span>NOVOS</span>

            <strong>
              {quantidadeNovos}
            </strong>

            <small>
              sem trabalhos concluídos
            </small>
          </div>

          <div className="admin-crm-summary-card">
            <span>RECORRENTES</span>

            <strong>
              {quantidadeRecorrentes}
            </strong>

            <small>
              clientes com 2+ trabalhos
            </small>
          </div>

        </div>

        <div className="admin-crm-list-header">

          <div>
            <span>BASE DE CLIENTES</span>

            <h2>
              Seus clientes
            </h2>
          </div>

          <button
            type="button"
            className="admin-crm-new-button"
            onClick={abrirNovoCliente}
          >
            <FaPlus />
            <span>Novo cliente</span>
          </button>

        </div>

        <div className="admin-crm-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Buscar por nome, WhatsApp, Instagram ou e-mail..."
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
          />

          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
            >
              <FaTimes />
            </button>
          )}

        </div>

        {clientes.length === 0 ? (

          <div className="admin-crm-empty">

            <div className="admin-crm-empty-icon">
              <FaUsers />
            </div>

            <h3>
              Nenhum cliente cadastrado
            </h3>

            <p>
              Comece adicionando o primeiro cliente
              ao CRM do KSA Studio.
            </p>

            <button
              type="button"
              onClick={abrirNovoCliente}
            >
              <FaPlus />
              Cadastrar primeiro cliente
            </button>

          </div>

        ) : clientesFiltrados.length === 0 ? (

          <div className="admin-crm-empty">

            <div className="admin-crm-empty-icon">
              <FaSearch />
            </div>

            <h3>
              Nenhum resultado
            </h3>

            <p>
              Não encontramos clientes para essa busca.
            </p>

            <button
              type="button"
              onClick={() => setBusca("")}
            >
              Limpar busca
            </button>

          </div>

        ) : (

          <div className="admin-crm-list">

            {clientesFiltrados.map((cliente) => {

              const status =
                obterStatusCliente(cliente);

              return (
                <article
                  className="admin-crm-client-card"
                  key={cliente.id}
                >

                  <div className="admin-crm-client-avatar">
                    {cliente.nome
                      ? cliente.nome
                          .charAt(0)
                          .toUpperCase()
                      : "?"}
                  </div>

                  <div className="admin-crm-client-main">

                    <div className="admin-crm-client-name-row">

                      <h3>
                        {cliente.nome ||
                          "Cliente sem nome"}
                      </h3>

                      <span
                        className={`admin-crm-status ${status.classe}`}
                      >
                        {status.texto}
                      </span>

                    </div>

                    <div className="admin-crm-client-info">

                      {cliente.whatsapp && (
                        <span>
                          <FaPhone />
                          {cliente.whatsapp}
                        </span>
                      )}

                      {cliente.instagram && (
                        <span>
                          <FaInstagram />
                          {cliente.instagram}
                        </span>
                      )}

                      {cliente.email && (
                        <span>
                          <FaEnvelope />
                          {cliente.email}
                        </span>
                      )}

                    </div>

                    <div className="admin-crm-client-meta">

                      <span>
                        <FaHistory />

                        {Number(
                          cliente.quantidadeTrabalhos
                        ) || 0}{" "}

                        {Number(
                          cliente.quantidadeTrabalhos
                        ) === 1
                          ? "trabalho"
                          : "trabalhos"}
                      </span>

                      <span>
                        Cadastro:{" "}
                        {formatarData(
                          cliente.criadoEm
                        )}
                      </span>

                    </div>

                  </div>

                  <div className="admin-crm-client-actions">

                    <button
                      type="button"
                      className="admin-crm-action-button edit"
                      onClick={() =>
                        abrirEdicao(cliente)
                      }
                      title="Editar cliente"
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      className="admin-crm-action-button delete"
                      onClick={() =>
                        excluirCliente(cliente)
                      }
                      title="Excluir cliente"
                      disabled={excluindo}
                    >
                      <FaTrash />
                    </button>

                    <button
                      type="button"
                      className="admin-crm-open-button"
                      onClick={() =>
                        abrirFicha(cliente)
                      }
                    >
                      <span>Ver ficha</span>
                      <FaChevronRight />
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

      {modalAberto && (

        <div
          className="admin-crm-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              fecharModal();
            }
          }}
        >

          <div className="admin-crm-modal">

            <header className="admin-crm-modal-header">

              <div>

                <span>
                  {modoModal === "novo"
                    ? "NOVO CADASTRO"
                    : modoModal === "editar"
                    ? "EDITAR CLIENTE"
                    : "FICHA DO CLIENTE"}
                </span>

                <h2>
                  {modoModal === "novo"
                    ? "Novo cliente"
                    : clienteSelecionado?.nome ||
                      "Cliente"}
                </h2>

              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={
                  salvando || salvandoTrabalho
                }
                aria-label="Fechar"
              >
                <FaTimes />
              </button>

            </header>

            {modoModal === "visualizar" &&
            clienteSelecionado ? (

              <div className="admin-crm-profile">

                <div className="admin-crm-profile-top">

                  <div className="admin-crm-profile-avatar">
                    {clienteSelecionado.nome
                      ?.charAt(0)
                      .toUpperCase() || "?"}
                  </div>

                  <div>

                    <h3>
                      {clienteSelecionado.nome}
                    </h3>

                    <span
                      className={`admin-crm-status ${
                        obterStatusCliente(
                          clienteSelecionado
                        ).classe
                      }`}
                    >
                      {
                        obterStatusCliente(
                          clienteSelecionado
                        ).texto
                      }
                    </span>

                  </div>

                </div>

                <div className="admin-crm-profile-grid">

                  <div className="admin-crm-profile-item">

                    <span>
                      <FaPhone />
                      WHATSAPP
                    </span>

                    <strong>
                      {clienteSelecionado.whatsapp ||
                        "Não informado"}
                    </strong>

                  </div>

                  <div className="admin-crm-profile-item">

                    <span>
                      <FaInstagram />
                      INSTAGRAM
                    </span>

                    <strong>
                      {clienteSelecionado.instagram ||
                        "Não informado"}
                    </strong>

                  </div>

                  <div className="admin-crm-profile-item">

                    <span>
                      <FaEnvelope />
                      E-MAIL
                    </span>

                    <strong>
                      {clienteSelecionado.email ||
                        "Não informado"}
                    </strong>

                  </div>

                  <div className="admin-crm-profile-item">

                    <span>
                      <FaHistory />
                      TRABALHOS
                    </span>

                    <strong>
                      {Number(
                        clienteSelecionado.quantidadeTrabalhos
                      ) || 0}
                    </strong>

                  </div>

                  <div className="admin-crm-profile-item">

                    <span>
                      <FaMoneyBillWave />
                      TOTAL GASTO
                    </span>

                    <strong>
                      {formatarMoeda(
                        clienteSelecionado.valorTotalGasto
                      )}
                    </strong>

                  </div>

                </div>

                <div className="admin-crm-profile-section">

                  <span>
                    OBSERVAÇÕES
                  </span>

                  <p>
                    {clienteSelecionado.observacoes ||
                      "Nenhuma observação cadastrada."}
                  </p>

                </div>

                <div className="admin-crm-profile-section">

                  <span>
                    HISTÓRICO DE TRABALHOS
                  </span>

                  <div className="admin-crm-trabalhos-header">

                    <div>
                      <strong>
                        {trabalhos.length}{" "}
                        {trabalhos.length === 1
                          ? "trabalho"
                          : "trabalhos"}
                      </strong>

                      <small>
                        Histórico financeiro e artístico
                      </small>
                    </div>

                    <button
                      type="button"
                      className="admin-crm-add-trabalho-button"
                      onClick={abrirNovoTrabalho}
                    >
                      <FaPlus />
                      Novo trabalho
                    </button>

                  </div>

                  {carregandoTrabalhos ? (

                    <div className="admin-crm-trabalhos-loading">
                      Carregando histórico...
                    </div>

                  ) : trabalhos.length === 0 ? (

                    <div className="admin-crm-trabalhos-empty">

                      <FaPaintBrush />

                      <p>
                        Nenhum trabalho cadastrado para este cliente.
                      </p>

                      <button
                        type="button"
                        onClick={abrirNovoTrabalho}
                      >
                        <FaPlus />
                        Cadastrar primeiro trabalho
                      </button>

                    </div>

                  ) : (

                    <div className="admin-crm-trabalhos-list">

                      {trabalhos.map((trabalho) => (

                        <article
                          className="admin-crm-trabalho-card"
                          key={trabalho.id}
                        >

                          <div className="admin-crm-trabalho-icon">
                            <FaPaintBrush />
                          </div>

                          <div className="admin-crm-trabalho-main">

                            <div className="admin-crm-trabalho-title-row">

                              <h4>
                                {trabalho.descricao ||
                                  "Trabalho sem descrição"}
                              </h4>

                              <span
                                className={`admin-crm-finance-status ${trabalho.statusFinanceiro || "pendente"}`}
                              >
                                {trabalho.statusFinanceiro ===
                                "pago"
                                  ? "Pago"
                                  : trabalho.statusFinanceiro ===
                                    "sinal_pago"
                                  ? "Sinal pago"
                                  : "Pendente"}
                              </span>

                            </div>

                            <div className="admin-crm-trabalho-details">

                              {trabalho.data && (
                                <span>
                                  <FaCalendarAlt />
                                  {formatarDataSimples(
                                    trabalho.data
                                  )}
                                </span>
                              )}

                              {trabalho.localCorpo && (
                                <span>
                                  <FaMapMarkerAlt />
                                  {trabalho.localCorpo}
                                </span>
                              )}

                              {trabalho.estilo && (
                                <span>
                                  <FaPaintBrush />
                                  {trabalho.estilo}
                                </span>
                              )}

                            </div>

                            <div className="admin-crm-trabalho-finance">

                              <div>
                                <small>
                                  TOTAL
                                </small>

                                <strong>
                                  {formatarMoeda(
                                    trabalho.valorTotal
                                  )}
                                </strong>
                              </div>

                              <div>
                                <small>
                                  SINAL
                                </small>

                                <strong>
                                  {formatarMoeda(
                                    trabalho.valorSinal
                                  )}
                                </strong>
                              </div>

                              <div>
                                <small>
                                  RESTANTE
                                </small>

                                <strong className={
                                  Number(
                                    trabalho.valorRestante
                                  ) > 0
                                    ? "pendente"
                                    : "pago"
                                }>
                                  {formatarMoeda(
                                    trabalho.valorRestante
                                  )}
                                </strong>
                              </div>

                            </div>

                          </div>

                        </article>

                      ))}

                    </div>
                  )}

                </div>

                <div className="admin-crm-profile-section">

                  <span>
                    CADASTRO
                  </span>

                  <p>
                    Cliente cadastrado em{" "}
                    {formatarData(
                      clienteSelecionado.criadoEm
                    )}
                  </p>

                </div>

                <div className="admin-crm-profile-actions">

                  <button
                    type="button"
                    className="admin-crm-secondary-button"
                    onClick={() =>
                      abrirEdicao(
                        clienteSelecionado
                      )
                    }
                  >
                    <FaEdit />
                    Editar cliente
                  </button>

                  <button
                    type="button"
                    className="admin-crm-primary-button"
                    onClick={() => {
                      setModalAberto(false);

                      navigate(
                        "/admin/agendamento"
                      );
                    }}
                  >
                    <FaCalendarAlt />
                    Agendar atendimento
                  </button>

                </div>

              </div>

            ) : (

              <form
                className="admin-crm-form"
                onSubmit={salvarCliente}
              >

                <div className="admin-crm-form-group full">

                  <label htmlFor="nome">
                    Nome completo *
                  </label>

                  <div className="admin-crm-input-wrapper">

                    <FaUser />

                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      placeholder="Nome do cliente"
                      value={formulario.nome}
                      onChange={handleChange}
                      required
                      autoFocus
                    />

                  </div>

                </div>

                <div className="admin-crm-form-grid">

                  <div className="admin-crm-form-group">

                    <label htmlFor="whatsapp">
                      WhatsApp
                    </label>

                    <div className="admin-crm-input-wrapper">

                      <FaPhone />

                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        placeholder="(34) 99999-9999"
                        value={formulario.whatsapp}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                  <div className="admin-crm-form-group">

                    <label htmlFor="instagram">
                      Instagram
                    </label>

                    <div className="admin-crm-input-wrapper">

                      <FaInstagram />

                      <input
                        id="instagram"
                        name="instagram"
                        type="text"
                        placeholder="@usuario"
                        value={formulario.instagram}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>

                <div className="admin-crm-form-group full">

                  <label htmlFor="email">
                    E-mail
                  </label>

                  <div className="admin-crm-input-wrapper">

                    <FaEnvelope />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="cliente@email.com"
                      value={formulario.email}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="admin-crm-form-group full">

                  <label htmlFor="observacoes">
                    Observações
                  </label>

                  <textarea
                    id="observacoes"
                    name="observacoes"
                    placeholder="Informações importantes sobre o cliente..."
                    value={formulario.observacoes}
                    onChange={handleChange}
                    rows={5}
                  />

                </div>

                <div className="admin-crm-form-info">

                  <FaHistory />

                  <span>
                    O histórico de trabalhos e financeiro
                    será integrado ao CRM nas próximas etapas.
                  </span>

                </div>

                <div className="admin-crm-form-actions">

                  <button
                    type="button"
                    className="admin-crm-secondary-button"
                    onClick={fecharModal}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="admin-crm-primary-button"
                    disabled={salvando}
                  >

                    {salvando ? (
                      "Salvando..."
                    ) : (
                      <>
                        <FaSave />

                        {modoModal === "novo"
                          ? "Cadastrar cliente"
                          : "Salvar alterações"}
                      </>
                    )}

                  </button>

                </div>

              </form>
            )}

          </div>

        </div>
      )}

      {modalTrabalhoAberto &&
      clienteSelecionado && (

        <div
          className="admin-crm-modal-overlay admin-crm-trabalho-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              fecharModalTrabalho();
            }
          }}
        >

          <div className="admin-crm-modal admin-crm-trabalho-modal">

            <header className="admin-crm-modal-header">

              <div>

                <span>
                  NOVO TRABALHO
                </span>

                <h2>
                  {clienteSelecionado.nome}
                </h2>

              </div>

              <button
                type="button"
                onClick={fecharModalTrabalho}
                disabled={salvandoTrabalho}
                aria-label="Fechar"
              >
                <FaTimes />
              </button>

            </header>

            <form
              className="admin-crm-form"
              onSubmit={salvarTrabalho}
            >

              <div className="admin-crm-form-group full">

                <label htmlFor="descricao">
                  Trabalho / tatuagem *
                </label>

                <div className="admin-crm-input-wrapper">

                  <FaPaintBrush />

                  <input
                    id="descricao"
                    name="descricao"
                    type="text"
                    placeholder="Ex.: Fechamento de braço, rosa, pantera..."
                    value={
                      formularioTrabalho.descricao
                    }
                    onChange={handleTrabalhoChange}
                    required
                    autoFocus
                  />

                </div>

              </div>

              <div className="admin-crm-form-grid">

                <div className="admin-crm-form-group">

                  <label htmlFor="data">
                    Data
                  </label>

                  <div className="admin-crm-input-wrapper">

                    <FaCalendarAlt />

                    <input
                      id="data"
                      name="data"
                      type="date"
                      value={
                        formularioTrabalho.data
                      }
                      onChange={handleTrabalhoChange}
                    />

                  </div>

                </div>

                <div className="admin-crm-form-group">

                  <label htmlFor="localCorpo">
                    Local do corpo
                  </label>

                  <div className="admin-crm-input-wrapper">

                    <FaMapMarkerAlt />

                    <input
                      id="localCorpo"
                      name="localCorpo"
                      type="text"
                      placeholder="Ex.: Braço"
                      value={
                        formularioTrabalho.localCorpo
                      }
                      onChange={handleTrabalhoChange}
                    />

                  </div>

                </div>

              </div>

              <div className="admin-crm-form-group full">

                <label htmlFor="estilo">
                  Estilo
                </label>

                <div className="admin-crm-input-wrapper">

                  <FaPaintBrush />

                  <input
                    id="estilo"
                    name="estilo"
                    type="text"
                    placeholder="Ex.: Old School, Fine Line..."
                    value={
                      formularioTrabalho.estilo
                    }
                    onChange={handleTrabalhoChange}
                  />

                </div>

              </div>

              <div className="admin-crm-finance-form">

                <div className="admin-crm-form-group">

                  <label htmlFor="valorTotal">
                    Valor total *
                  </label>

                  <div className="admin-crm-input-wrapper">

                    <FaMoneyBillWave />

                    <input
                      id="valorTotal"
                      name="valorTotal"
                      type="text"
                      inputMode="decimal"
                      placeholder="R$ 0,00"
                      value={
                        formularioTrabalho.valorTotal
                      }
                      onChange={handleTrabalhoChange}
                      required
                    />

                  </div>

                </div>

                <div className="admin-crm-form-group">

                  <label htmlFor="valorSinal">
                    Valor do sinal
                  </label>

                  <div className="admin-crm-input-wrapper">

                    <FaMoneyBillWave />

                    <input
                      id="valorSinal"
                      name="valorSinal"
                      type="text"
                      inputMode="decimal"
                      placeholder="R$ 0,00"
                      value={
                        formularioTrabalho.valorSinal
                      }
                      onChange={handleTrabalhoChange}
                    />

                  </div>

                </div>

              </div>

              <div className="admin-crm-finance-preview">

                <div>
                  <span>
                    VALOR TOTAL
                  </span>

                  <strong>
                    {formatarMoeda(
                      valorTotalTrabalho
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    SINAL
                  </span>

                  <strong>
                    {formatarMoeda(
                      valorSinalTrabalho
                    )}
                  </strong>
                </div>

                <div className="highlight">

                  <span>
                    RESTANTE
                  </span>

                  <strong>
                    {formatarMoeda(
                      valorRestanteTrabalho
                    )}
                  </strong>

                </div>

              </div>

              {valorSinalTrabalho > 0 && (

                <div className="admin-crm-form-group full">

                  <label htmlFor="formaPagamentoSinal">
                    Forma de pagamento do sinal
                  </label>

                  <select
                    id="formaPagamentoSinal"
                    name="formaPagamentoSinal"
                    value={
                      formularioTrabalho.formaPagamentoSinal
                    }
                    onChange={handleTrabalhoChange}
                  >

                    <option value="">
                      Selecione
                    </option>

                    <option value="pix">
                      PIX
                    </option>

                    <option value="dinheiro">
                      Dinheiro
                    </option>

                    <option value="cartao_credito">
                      Cartão de crédito
                    </option>

                    <option value="cartao_debito">
                      Cartão de débito
                    </option>

                    <option value="transferencia">
                      Transferência
                    </option>

                  </select>

                </div>
              )}

              <div className="admin-crm-form-group full">

                <label htmlFor="observacoesTrabalho">
                  Observações do trabalho
                </label>

                <textarea
                  id="observacoesTrabalho"
                  name="observacoes"
                  placeholder="Detalhes do projeto, briefing, observações..."
                  value={
                    formularioTrabalho.observacoes
                  }
                  onChange={handleTrabalhoChange}
                  rows={4}
                />

              </div>

              <div className="admin-crm-form-info">

                <FaMoneyBillWave />

                <span>
                  Nesta etapa o trabalho será salvo no
                  histórico do cliente. O lançamento
                  automático no Caixa será integrado
                  na próxima etapa.
                </span>

              </div>

              <div className="admin-crm-form-actions">

                <button
                  type="button"
                  className="admin-crm-secondary-button"
                  onClick={fecharModalTrabalho}
                  disabled={salvandoTrabalho}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-crm-primary-button"
                  disabled={salvandoTrabalho}
                >

                  {salvandoTrabalho ? (
                    "Salvando..."
                  ) : (
                    <>
                      <FaSave />
                      Salvar trabalho
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}

export default AdminCRM;
