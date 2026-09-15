import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiExternalLink,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiPlus,
  FiUnlock,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { db } from "../../lib/firebase";

import "./AgendamentoAdmin.css";

const HORARIOS_PADRAO = [
  "09:00",
  "10:30",
  "14:00",
  "15:30",
  "17:00",
];

const STATUS_FILTROS = [
  { valor: "todos", label: "Todos" },
  { valor: "pendente", label: "Pendentes" },
  { valor: "confirmado", label: "Confirmados" },
  { valor: "concluido", label: "Concluídos" },
  { valor: "cancelado", label: "Cancelados" },
];

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_SEMANA = [
  "DOM",
  "SEG",
  "TER",
  "QUA",
  "QUI",
  "SEX",
  "SÁB",
];

function criarDataLocal(ano, mes, dia) {
  return new Date(ano, mes, dia);
}

function formatarDataISO(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    return "";
  }

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function adicionarDias(data, quantidade) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + quantidade);
  return novaData;
}

function formatarDataTexto(dataISO) {
  if (!dataISO) return "";

  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const data = criarDataLocal(ano, mes - 1, dia);

  return data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatarDataCurta(dataISO) {
  if (!dataISO) return "";

  const [ano, mes, dia] = dataISO.split("-");

  return `${dia}/${mes}/${ano}`;
}

function criarIdHorario(data, horario) {
  return `${data}_${horario.replace(":", "-")}`;
}

function horarioValido(horario) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(horario);
}

function formatarMoeda(valor) {
  const numero = Number(valor || 0);

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function converterValor(valor) {
  if (typeof valor === "number") {
    return valor;
  }

  if (!valor) {
    return 0;
  }

  const texto = String(valor)
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numero = Number(texto);

  return Number.isFinite(numero) ? numero : 0;
}

function normalizarTelefone(telefone) {
  return String(telefone || "").replace(/\D/g, "");
}

function nomeNormalizado(nome) {
  return String(nome || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterStatusCliente(quantidade) {
  const numero = Number(quantidade || 0);

  if (numero <= 0) return "novo";
  if (numero === 1) return "cliente";

  return "recorrente";
}

function obterNomeStatus(status) {
  switch (status) {
    case "confirmado":
      return "Confirmado";

    case "concluido":
      return "Concluído";

    case "cancelado":
      return "Cancelado";

    case "excluido":
      return "Excluído";

    default:
      return "Pendente";
  }
}

function obterStatusClienteLabel(status) {
  switch (status) {
    case "recorrente":
      return "Cliente recorrente";

    case "cliente":
      return "Cliente";

    case "novo":
    default:
      return "Novo cliente";
  }
}

function AgendamentoAdmin() {
  const navigate = useNavigate();

  const hoje = new Date();

  const [agendamentos, setAgendamentos] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  const [dataSelecionada, setDataSelecionada] = useState(
    formatarDataISO(hoje)
  );

  const [motivoBloqueioDia, setMotivoBloqueioDia] = useState("");

  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");

  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [periodoMotivo, setPeriodoMotivo] = useState("");

  const [novoHorarioExtra, setNovoHorarioExtra] = useState("");
  const [novoHorarioExtraMotivo, setNovoHorarioExtraMotivo] =
    useState("");

  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [modalFinanceiro, setModalFinanceiro] = useState(null);

  const [dadosFinanceiros, setDadosFinanceiros] = useState({
    valorTotal: "",
    valorSinal: "",
    formaPagamentoSinal: "",
    restantePago: false,
    formaPagamentoRestante: "",
  });

  /*
   * ============================================================
   * NOVO AGENDAMENTO MANUAL
   * ============================================================
   */

  const [modalNovoAgendamento, setModalNovoAgendamento] =
    useState(false);

  const [novoAgendamento, setNovoAgendamento] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    data: formatarDataISO(hoje),
    horario: "",
    observacoes: "",
    valorTotal: "",
    valorSinal: "",
    formaPagamentoSinal: "",
    restantePago: false,
    formaPagamentoRestante: "",
  });

  /*
   * ============================================================
   * AGENDAMENTOS
   * ============================================================
   */

  useEffect(() => {
    const consulta = query(
      collection(db, "agendamentos"),
      orderBy("criadoEm", "desc")
    );

    const unsubscribe = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setAgendamentos(lista);
      },
      (error) => {
        console.error(error);
        setErro("Não foi possível carregar os agendamentos.");
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * ============================================================
   * HORÁRIOS
   * ============================================================
   */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "horariosOcupados"),
      (snapshot) => {
        const lista = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setHorariosOcupados(lista);
      },
      (error) => {
        console.error(error);
        setErro("Não foi possível carregar os horários.");
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * ============================================================
   * SINCRONIZAÇÃO
   * ============================================================
   */

  useEffect(() => {
    let desmontado = false;

    async function sincronizarHorarios() {
      try {
        const snapshot = await getDocs(
          collection(db, "horariosOcupados")
        );

        if (desmontado) return;

        const existentes = new Map();

        snapshot.docs.forEach((item) => {
          existentes.set(item.id, {
            id: item.id,
            ...item.data(),
          });
        });

        const ativos = agendamentos.filter(
          (agendamento) =>
            agendamento.status !== "cancelado" &&
            agendamento.status !== "excluido" &&
            agendamento.data &&
            agendamento.horario
        );

        const batch = writeBatch(db);

        const slotsAtivos = new Set();

        ativos.forEach((agendamento) => {
          const slotId = criarIdHorario(
            agendamento.data,
            agendamento.horario
          );

          slotsAtivos.add(slotId);

          const existente = existentes.get(slotId);

          const dados = {
            data: agendamento.data,
            horario: agendamento.horario,
            agendamentoId: agendamento.id,
          };

          if (agendamento.clienteId) {
            dados.clienteId = agendamento.clienteId;
          }

          if (existente?.horarioExtra) {
            dados.horarioExtra = true;
          }

          if (existente?.bloqueado) {
            dados.bloqueado = true;
            dados.motivo = existente.motivo || "";
          }

          batch.set(
            doc(db, "horariosOcupados", slotId),
            dados,
            { merge: true }
          );
        });

        existentes.forEach((slot, slotId) => {
          if (
            slot.agendamentoId &&
            !slotsAtivos.has(slotId) &&
            !slot.bloqueado &&
            !slot.horarioExtra
          ) {
            batch.delete(
              doc(db, "horariosOcupados", slotId)
            );
          }
        });

        if (ativos.length > 0 || existentes.size > 0) {
          await batch.commit();
        }
      } catch (error) {
        console.error("Erro ao sincronizar:", error);
      }
    }

    sincronizarHorarios();

    return () => {
      desmontado = true;
    };
  }, [agendamentos]);

  /*
   * ============================================================
   * CALENDÁRIO
   * ============================================================
   */

  const diasDoMes = useMemo(() => {
    const primeiroDia = criarDataLocal(
      anoAtual,
      mesAtual,
      1
    );

    const ultimoDia = criarDataLocal(
      anoAtual,
      mesAtual + 1,
      0
    );

    const dias = [];

    for (let i = 0; i < primeiroDia.getDay(); i += 1) {
      dias.push({
        vazio: true,
        id: `vazio-${i}`,
      });
    }

    for (
      let dia = 1;
      dia <= ultimoDia.getDate();
      dia += 1
    ) {
      const data = criarDataLocal(
        anoAtual,
        mesAtual,
        dia
      );

      dias.push({
        vazio: false,
        dia,
        data,
        dataISO: formatarDataISO(data),
      });
    }

    return dias;
  }, [anoAtual, mesAtual]);

  const mapaHorarios = useMemo(() => {
    const mapa = {};

    horariosOcupados.forEach((item) => {
      if (!item.data || !item.horario) return;

      if (!mapa[item.data]) {
        mapa[item.data] = {};
      }

      mapa[item.data][item.horario] = item;
    });

    return mapa;
  }, [horariosOcupados]);

  function obterHorario(dataISO, horario) {
    return mapaHorarios[dataISO]?.[horario] || null;
  }

  function horarioEstaOcupado(dataISO, horario) {
    return Boolean(
      obterHorario(dataISO, horario)?.agendamentoId
    );
  }

  function horarioEstaBloqueado(dataISO, horario) {
    return Boolean(
      obterHorario(dataISO, horario)?.bloqueado
    );
  }

  const extrasDoDia = useMemo(() => {
    return horariosOcupados
      .filter(
        (item) =>
          item.data === dataSelecionada &&
          item.horarioExtra === true
      )
      .sort((a, b) =>
        String(a.horario).localeCompare(
          String(b.horario)
        )
      );
  }, [horariosOcupados, dataSelecionada]);

  const todosHorariosDoDia = useMemo(() => {
    const extras = extrasDoDia.map(
      (item) => item.horario
    );

    return [...HORARIOS_PADRAO, ...extras].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [extrasDoDia]);

  function diaEstaBloqueado(dataISO) {
    return HORARIOS_PADRAO.every((horario) =>
      horarioEstaBloqueado(dataISO, horario)
    );
  }

  function diaTemBloqueio(dataISO) {
    return HORARIOS_PADRAO.some((horario) =>
      horarioEstaBloqueado(dataISO, horario)
    );
  }

  function diaTemAgendamento(dataISO) {
    return agendamentos.some(
      (agendamento) =>
        agendamento.data === dataISO &&
        agendamento.status !== "cancelado" &&
        agendamento.status !== "excluido"
    );
  }

  function diaTemExtra(dataISO) {
    return horariosOcupados.some(
      (item) =>
        item.data === dataISO &&
        item.horarioExtra === true
    );
  }

  /*
   * ============================================================
   * NAVEGAÇÃO
   * ============================================================
   */

  function mudarMes(direcao) {
    if (direcao === -1) {
      if (mesAtual === 0) {
        setMesAtual(11);
        setAnoAtual((ano) => ano - 1);
      } else {
        setMesAtual((mes) => mes - 1);
      }

      return;
    }

    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((ano) => ano + 1);
    } else {
      setMesAtual((mes) => mes + 1);
    }
  }

  function voltarParaHoje() {
    const agora = new Date();

    setMesAtual(agora.getMonth());
    setAnoAtual(agora.getFullYear());
    setDataSelecionada(formatarDataISO(agora));
  }

  function selecionarData(dataISO) {
    setDataSelecionada(dataISO);
    setMotivoBloqueioDia("");
    setNovoHorarioExtra("");
    setNovoHorarioExtraMotivo("");

    setNovoAgendamento((anterior) => ({
      ...anterior,
      data: dataISO,
      horario: "",
    }));
  }

  /*
   * ============================================================
   * ABRIR NOVO AGENDAMENTO
   * ============================================================
   */

  function abrirNovoAgendamento() {
    const primeiroHorarioDisponivel =
      todosHorariosDoDia.find(
        (horario) =>
          !horarioEstaOcupado(
            dataSelecionada,
            horario
          ) &&
          !horarioEstaBloqueado(
            dataSelecionada,
            horario
          )
      ) || "";

    setNovoAgendamento({
      nome: "",
      whatsapp: "",
      email: "",
      data: dataSelecionada,
      horario: primeiroHorarioDisponivel,
      observacoes: "",
      valorTotal: "",
      valorSinal: "",
      formaPagamentoSinal: "",
      restantePago: false,
      formaPagamentoRestante: "",
    });

    setErro("");
    setModalNovoAgendamento(true);
  }

  function fecharNovoAgendamento() {
    if (processando) return;

    setModalNovoAgendamento(false);
  }

  /*
   * ============================================================
   * CRM
   * ============================================================
   */

  async function encontrarOuCriarCliente(dados) {
    const snapshot = await getDocs(
      collection(db, "clientes")
    );

    const telefone = normalizarTelefone(
      dados.whatsapp
    );

    const nome = nomeNormalizado(
      dados.nome
    );

    let encontrado = null;

    snapshot.forEach((item) => {
      const cliente = item.data();

      const telefoneCliente =
        normalizarTelefone(cliente.whatsapp);

      const nomeCliente =
        nomeNormalizado(cliente.nome);

      if (
        telefone &&
        telefoneCliente &&
        telefone === telefoneCliente
      ) {
        encontrado = {
          id: item.id,
          ...cliente,
        };
      } else if (
        !telefone &&
        nome &&
        nome === nomeCliente
      ) {
        encontrado = {
          id: item.id,
          ...cliente,
        };
      }
    });

    if (encontrado) {
      await updateDoc(
        doc(db, "clientes", encontrado.id),
        {
          nome:
            dados.nome ||
            encontrado.nome ||
            "",

          whatsapp:
            dados.whatsapp ||
            encontrado.whatsapp ||
            "",

          instagram:
            dados.instagram ||
            encontrado.instagram ||
            "",

          email:
            dados.email ||
            encontrado.email ||
            "",

          atualizadoEm:
            serverTimestamp(),
        }
      );

      return encontrado.id;
    }

    const clienteRef = doc(
      collection(db, "clientes")
    );

    await setDoc(clienteRef, {
      nome: dados.nome || "",
      whatsapp: dados.whatsapp || "",
      instagram: dados.instagram || "",
      email: dados.email || "",
      observacoes: "",
      statusCliente: "novo",
      quantidadeTrabalhos: 0,
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    });

    return clienteRef.id;
  }

  /*
   * ============================================================
   * CRIAR AGENDAMENTO MANUAL
   * ============================================================
   */

  async function criarAgendamentoManual() {
    const nome = novoAgendamento.nome.trim();
    const whatsapp = novoAgendamento.whatsapp.trim();
    const data = novoAgendamento.data;
    const horario = novoAgendamento.horario;

    if (!nome) {
      setErro("Informe o nome do cliente.");
      return;
    }

    if (!data) {
      setErro("Informe a data do atendimento.");
      return;
    }

    if (!horario || !horarioValido(horario)) {
      setErro("Selecione um horário válido.");
      return;
    }

    const slotAtual = obterHorario(
      data,
      horario
    );

    if (
      slotAtual?.agendamentoId ||
      slotAtual?.bloqueado
    ) {
      setErro(
        "Esse horário não está disponível."
      );
      return;
    }

    const valorTotal = converterValor(
      novoAgendamento.valorTotal
    );

    const valorSinal = Math.min(
      converterValor(
        novoAgendamento.valorSinal
      ),
      valorTotal
    );

    const valorRestante = Math.max(
      valorTotal - valorSinal,
      0
    );

    try {
      setProcessando(true);
      setErro("");

      const clienteId =
        await encontrarOuCriarCliente({
          nome,
          whatsapp,
          email:
            novoAgendamento.email.trim(),
        });

      const agendamentoRef = doc(
        collection(db, "agendamentos")
      );

      await setDoc(agendamentoRef, {
        nome,
        whatsapp,
        email:
          novoAgendamento.email.trim(),

        data,
        horario,

        observacoes:
          novoAgendamento.observacoes.trim(),

        status: "pendente",

        clienteId,

        valorTotal,
        valorSinal,
        valorRestante,

        sinalPago:
          valorSinal > 0,

        formaPagamentoSinal:
          novoAgendamento.formaPagamentoSinal,

        restantePago:
          Boolean(
            novoAgendamento.restantePago
          ),

        formaPagamentoRestante:
          novoAgendamento.formaPagamentoRestante,

        criadoManualmente: true,

        criadoEm:
          serverTimestamp(),

        atualizadoEm:
          serverTimestamp(),
      });

      await setDoc(
        doc(
          db,
          "horariosOcupados",
          criarIdHorario(
            data,
            horario
          )
        ),
        {
          data,
          horario,
          agendamentoId:
            agendamentoRef.id,
          clienteId,
          ...(slotAtual?.horarioExtra
            ? {
                horarioExtra: true,
              }
            : {}),
          ...(slotAtual?.motivo
            ? {
                motivo:
                  slotAtual.motivo,
              }
            : {}),
          ...(slotAtual?.bloqueado
            ? {
                bloqueado: true,
              }
            : {}),
          atualizadoEm:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      setDataSelecionada(data);

      const partesData = data
        .split("-")
        .map(Number);

      setAnoAtual(partesData[0]);
      setMesAtual(partesData[1] - 1);

      setModalNovoAgendamento(false);

      setNovoAgendamento({
        nome: "",
        whatsapp: "",
        email: "",
        data,
        horario: "",
        observacoes: "",
        valorTotal: "",
        valorSinal: "",
        formaPagamentoSinal: "",
        restantePago: false,
        formaPagamentoRestante: "",
      });
    } catch (error) {
      console.error(
        "Erro ao criar agendamento manual:",
        error
      );

      setErro(
        "Não foi possível criar o agendamento."
      );
    } finally {
      setProcessando(false);
    }
  }

  async function vincularClienteAoAgendamento(
    agendamento
  ) {
    try {
      setProcessando(true);
      setErro("");

      const clienteId =
        await encontrarOuCriarCliente({
          nome: agendamento.nome,
          whatsapp: agendamento.whatsapp,
          instagram: agendamento.instagram,
          email: agendamento.email,
        });

      await updateDoc(
        doc(
          db,
          "agendamentos",
          agendamento.id
        ),
        {
          clienteId,
          atualizadoEm:
            serverTimestamp(),
        }
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível vincular o cliente ao CRM."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * FINANCEIRO
   * ============================================================
   */

  function abrirFinanceiro(agendamento) {
    setDadosFinanceiros({
      valorTotal:
        agendamento.valorTotal !== undefined
          ? String(agendamento.valorTotal)
          : "",

      valorSinal:
        agendamento.valorSinal !== undefined
          ? String(agendamento.valorSinal)
          : "",

      formaPagamentoSinal:
        agendamento.formaPagamentoSinal || "",

      restantePago:
        Boolean(
          agendamento.restantePago
        ),

      formaPagamentoRestante:
        agendamento.formaPagamentoRestante || "",
    });

    setModalFinanceiro(agendamento);
  }

  async function salvarFinanceiro() {
    if (!modalFinanceiro) return;

    try {
      setProcessando(true);
      setErro("");

      const valorTotal =
        converterValor(
          dadosFinanceiros.valorTotal
        );

      const valorSinal =
        converterValor(
          dadosFinanceiros.valorSinal
        );

      const valorRestante =
        Math.max(
          valorTotal - valorSinal,
          0
        );

      await updateDoc(
        doc(
          db,
          "agendamentos",
          modalFinanceiro.id
        ),
        {
          valorTotal,
          valorSinal,
          valorRestante,

          sinalPago:
            valorSinal > 0,

          formaPagamentoSinal:
            dadosFinanceiros.formaPagamentoSinal,

          restantePago:
            Boolean(
              dadosFinanceiros.restantePago
            ),

          formaPagamentoRestante:
            dadosFinanceiros.formaPagamentoRestante,

          atualizadoEm:
            serverTimestamp(),
        }
      );

      setModalFinanceiro(null);
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível salvar os dados financeiros."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * STATUS
   * ============================================================
   */

  async function alterarStatus(
    agendamento,
    novoStatus
  ) {
    if (!agendamento?.id) return;

    try {
      setProcessando(true);
      setErro("");

      await updateDoc(
        doc(
          db,
          "agendamentos",
          agendamento.id
        ),
        {
          status: novoStatus,
          atualizadoEm:
            serverTimestamp(),
        }
      );

      const slotId = criarIdHorario(
        agendamento.data,
        agendamento.horario
      );

      const slot = obterHorario(
        agendamento.data,
        agendamento.horario
      );

      const slotRef = doc(
        db,
        "horariosOcupados",
        slotId
      );

      if (
        novoStatus === "cancelado" ||
        novoStatus === "excluido"
      ) {
        if (slot?.horarioExtra) {
          await setDoc(
            slotRef,
            {
              data:
                agendamento.data,
              horario:
                agendamento.horario,
              horarioExtra: true,
              agendamentoId:
                deleteField(),
              clienteId:
                deleteField(),
              atualizadoEm:
                serverTimestamp(),
            },
            { merge: true }
          );
        } else if (slot?.bloqueado) {
          await updateDoc(
            slotRef,
            {
              agendamentoId:
                deleteField(),
              clienteId:
                deleteField(),
              atualizadoEm:
                serverTimestamp(),
            }
          );
        } else {
          await deleteDoc(
            slotRef
          );
        }

        return;
      }

      await setDoc(
        slotRef,
        {
          data:
            agendamento.data,

          horario:
            agendamento.horario,

          agendamentoId:
            agendamento.id,

          ...(agendamento.clienteId
            ? {
                clienteId:
                  agendamento.clienteId,
              }
            : {}),

          atualizadoEm:
            serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível alterar o status."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * CONCLUIR
   * ============================================================
   */

  async function concluirAtendimento(
    agendamento
  ) {
    const confirmar = window.confirm(
      `Marcar o atendimento de ${agendamento.nome} como concluído?`
    );

    if (!confirmar) return;

    try {
      setProcessando(true);
      setErro("");

      let clienteId =
        agendamento.clienteId;

      if (!clienteId) {
        clienteId =
          await encontrarOuCriarCliente({
            nome:
              agendamento.nome,
            whatsapp:
              agendamento.whatsapp,
            instagram:
              agendamento.instagram,
            email:
              agendamento.email,
          });
      }

      const clientesSnapshot =
        await getDocs(
          collection(
            db,
            "clientes"
          )
        );

      let clienteAtual = null;

      clientesSnapshot.forEach(
        (item) => {
          if (
            item.id === clienteId
          ) {
            clienteAtual =
              item.data();
          }
        }
      );

      const quantidadeAtual =
        Number(
          clienteAtual?.quantidadeTrabalhos ||
            0
        );

      const novaQuantidade =
        quantidadeAtual + 1;

      await setDoc(
        doc(
          db,
          "clientes",
          clienteId
        ),
        {
          quantidadeTrabalhos:
            novaQuantidade,

          statusCliente:
            obterStatusCliente(
              novaQuantidade
            ),

          ultimoAgendamento:
            agendamento.data || "",

          ultimoHorario:
            agendamento.horario || "",

          atualizadoEm:
            serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(
        doc(
          db,
          "agendamentos",
          agendamento.id
        ),
        {
          status:
            "concluido",

          clienteId,

          concluidoEm:
            serverTimestamp(),

          atualizadoEm:
            serverTimestamp(),
        }
      );

      const slotId =
        criarIdHorario(
          agendamento.data,
          agendamento.horario
        );

      const slot =
        obterHorario(
          agendamento.data,
          agendamento.horario
        );

      if (slot?.horarioExtra) {
        await updateDoc(
          doc(
            db,
            "horariosOcupados",
            slotId
          ),
          {
            agendamentoId:
              deleteField(),

            clienteId:
              deleteField(),

            atualizadoEm:
              serverTimestamp(),
          }
        );
      } else if (slot?.bloqueado) {
        await updateDoc(
          doc(
            db,
            "horariosOcupados",
            slotId
          ),
          {
            agendamentoId:
              deleteField(),

            clienteId:
              deleteField(),

            atualizadoEm:
              serverTimestamp(),
          }
        );
      } else {
        await deleteDoc(
          doc(
            db,
            "horariosOcupados",
            slotId
          )
        );
      }
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível concluir o atendimento."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * EXCLUIR
   * ============================================================
   */

  async function excluirAgendamento(
    agendamento
  ) {
    const confirmar =
      window.confirm(
        `Excluir o agendamento de ${agendamento.nome}?`
      );

    if (!confirmar) return;

    try {
      setProcessando(true);
      setErro("");

      await deleteDoc(
        doc(
          db,
          "agendamentos",
          agendamento.id
        )
      );

      const slotId =
        criarIdHorario(
          agendamento.data,
          agendamento.horario
        );

      const slot =
        obterHorario(
          agendamento.data,
          agendamento.horario
        );

      if (slot?.horarioExtra) {
        await setDoc(
          doc(
            db,
            "horariosOcupados",
            slotId
          ),
          {
            agendamentoId:
              deleteField(),

            clienteId:
              deleteField(),

            horarioExtra:
              true,

            atualizadoEm:
              serverTimestamp(),
          },
          { merge: true }
        );
      } else if (slot?.bloqueado) {
        await updateDoc(
          doc(
            db,
            "horariosOcupados",
            slotId
          ),
          {
            agendamentoId:
              deleteField(),

            clienteId:
              deleteField(),

            atualizadoEm:
              serverTimestamp(),
          }
        );
      } else {
        await deleteDoc(
          doc(
            db,
            "horariosOcupados",
            slotId
          )
        );
      }
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível excluir o agendamento."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * BATCH
   * ============================================================
   */

  async function executarBatch(
    operacoes
  ) {
    const limite = 400;

    for (
      let inicio = 0;
      inicio < operacoes.length;
      inicio += limite
    ) {
      const grupo =
        operacoes.slice(
          inicio,
          inicio + limite
        );

      const batch =
        writeBatch(db);

      grupo.forEach(
        (operacao) => {
          const referencia =
            doc(
              db,
              "horariosOcupados",
              operacao.id
            );

          if (
            operacao.tipo ===
            "delete"
          ) {
            batch.delete(
              referencia
            );
          }

          if (
            operacao.tipo ===
            "set"
          ) {
            batch.set(
              referencia,
              operacao.dados,
              {
                merge: true,
              }
            );
          }

          if (
            operacao.tipo ===
            "update"
          ) {
            batch.update(
              referencia,
              operacao.dados
            );
          }
        }
      );

      await batch.commit();
    }
  }

  /*
   * ============================================================
   * BLOQUEIO INDIVIDUAL
   * ============================================================
   */

  async function bloquearHorario(
    horario
  ) {
    const confirmar =
      window.confirm(
        `Bloquear o horário ${horario}?`
      );

    if (!confirmar) return;

    try {
      setProcessando(true);
      setErro("");

      const id =
        criarIdHorario(
          dataSelecionada,
          horario
        );

      await setDoc(
        doc(
          db,
          "horariosOcupados",
          id
        ),
        {
          data:
            dataSelecionada,

          horario,

          bloqueado:
            true,

          motivo:
            "",

          atualizadoEm:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível bloquear o horário."
      );
    } finally {
      setProcessando(false);
    }
  }

  async function liberarHorario(
    horario
  ) {
    try {
      setProcessando(true);
      setErro("");

      const id =
        criarIdHorario(
          dataSelecionada,
          horario
        );

      const item =
        obterHorario(
          dataSelecionada,
          horario
        );

      if (!item) return;

      const referencia =
        doc(
          db,
          "horariosOcupados",
          id
        );

      if (item.agendamentoId) {
        await updateDoc(
          referencia,
          {
            bloqueado:
              deleteField(),

            motivo:
              deleteField(),

            atualizadoEm:
              serverTimestamp(),
          }
        );

        return;
      }

      if (item.horarioExtra) {
        await updateDoc(
          referencia,
          {
            bloqueado:
              deleteField(),

            motivo:
              deleteField(),

            atualizadoEm:
              serverTimestamp(),
          }
        );

        return;
      }

      await deleteDoc(
        referencia
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível liberar o horário."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * BLOQUEAR DIA
   * ============================================================
   */

  async function bloquearDia() {
    const confirmar =
      window.confirm(
        `Bloquear os horários padrão de ${formatarDataCurta(
          dataSelecionada
        )}?`
      );

    if (!confirmar) return;

    try {
      setProcessando(true);
      setErro("");

      const operacoes =
        HORARIOS_PADRAO.map(
          (horario) => ({
            tipo: "set",

            id:
              criarIdHorario(
                dataSelecionada,
                horario
              ),

            dados: {
              data:
                dataSelecionada,

              horario,

              bloqueado:
                true,

              motivo:
                motivoBloqueioDia.trim(),

              atualizadoEm:
                serverTimestamp(),
            },
          })
        );

      await executarBatch(
        operacoes
      );

      setMotivoBloqueioDia("");
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível bloquear o dia."
      );
    } finally {
      setProcessando(false);
    }
  }

  async function liberarDia() {
    const confirmar =
      window.confirm(
        `Liberar os horários padrão de ${formatarDataCurta(
          dataSelecionada
        )}?`
      );

    if (!confirmar) return;

    try {
      setProcessando(true);
      setErro("");

      const operacoes = [];

      HORARIOS_PADRAO.forEach(
        (horario) => {
          const item =
            obterHorario(
              dataSelecionada,
              horario
            );

          if (!item) return;

          if (item.agendamentoId) {
            operacoes.push({
              tipo:
                "update",

              id:
                criarIdHorario(
                  dataSelecionada,
                  horario
                ),

              dados: {
                bloqueado:
                  deleteField(),

                motivo:
                  deleteField(),

                atualizadoEm:
                  serverTimestamp(),
              },
            });
          } else {
            operacoes.push({
              tipo:
                "delete",

              id:
                criarIdHorario(
                  dataSelecionada,
                  horario
                ),
            });
          }
        }
      );

      await executarBatch(
        operacoes
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível liberar o dia."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * HORÁRIO EXTRA
   * ============================================================
   */

  async function adicionarHorarioExtra() {
    const horario =
      novoHorarioExtra.trim();

    if (!horarioValido(horario)) {
      setErro(
        "Informe um horário válido."
      );

      return;
    }

    if (
      obterHorario(
        dataSelecionada,
        horario
      )
    ) {
      setErro(
        "Esse horário já existe neste dia."
      );

      return;
    }

    try {
      setProcessando(true);
      setErro("");

      const id =
        criarIdHorario(
          dataSelecionada,
          horario
        );

      await setDoc(
        doc(
          db,
          "horariosOcupados",
          id
        ),
        {
          data:
            dataSelecionada,

          horario,

          horarioExtra:
            true,

          bloqueado:
            false,

          motivo:
            novoHorarioExtraMotivo.trim(),

          criadoEm:
            serverTimestamp(),

          atualizadoEm:
            serverTimestamp(),
        }
      );

      setNovoHorarioExtra("");
      setNovoHorarioExtraMotivo("");
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível adicionar o horário."
      );
    } finally {
      setProcessando(false);
    }
  }

  async function removerHorarioExtra(
    horario
  ) {
    const item =
      obterHorario(
        dataSelecionada,
        horario
      );

    if (!item?.horarioExtra)
      return;

    if (item.agendamentoId) {
      window.alert(
        "Este horário possui um agendamento e não pode ser removido."
      );

      return;
    }

    const confirmar =
      window.confirm(
        `Remover o horário extra ${horario}?`
      );

    if (!confirmar) return;

    try {
      setProcessando(true);

      await deleteDoc(
        doc(
          db,
          "horariosOcupados",
          criarIdHorario(
            dataSelecionada,
            horario
          )
        )
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível remover o horário."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * PERÍODO
   * ============================================================
   */

  async function bloquearPeriodo() {
    if (
      !periodoInicio ||
      !periodoFim
    ) {
      setErro(
        "Informe o período."
      );

      return;
    }

    const inicio =
      new Date(
        `${periodoInicio}T00:00:00`
      );

    const fim =
      new Date(
        `${periodoFim}T00:00:00`
      );

    if (inicio > fim) {
      setErro(
        "A data inicial não pode ser maior que a final."
      );

      return;
    }

    const confirmar =
      window.confirm(
        `Bloquear os horários de ${formatarDataCurta(
          periodoInicio
        )} até ${formatarDataCurta(
          periodoFim
        )}?`
      );

    if (!confirmar) return;

    try {
      setProcessando(true);
      setErro("");

      const operacoes = [];

      let dataAtual =
        new Date(inicio);

      while (
        dataAtual <= fim
      ) {
        const dataISO =
          formatarDataISO(
            dataAtual
          );

        HORARIOS_PADRAO.forEach(
          (horario) => {
            operacoes.push({
              tipo: "set",

              id:
                criarIdHorario(
                  dataISO,
                  horario
                ),

              dados: {
                data:
                  dataISO,

                horario,

                bloqueado:
                  true,

                motivo:
                  periodoMotivo.trim(),

                atualizadoEm:
                  serverTimestamp(),
              },
            });
          }
        );

        dataAtual =
          adicionarDias(
            dataAtual,
            1
          );
      }

      await executarBatch(
        operacoes
      );

      setPeriodoInicio("");
      setPeriodoFim("");
      setPeriodoMotivo("");
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível bloquear o período."
      );
    } finally {
      setProcessando(false);
    }
  }

  async function liberarPeriodo() {
    if (
      !periodoInicio ||
      !periodoFim
    ) {
      setErro(
        "Informe o período."
      );

      return;
    }

    const inicio =
      new Date(
        `${periodoInicio}T00:00:00`
      );

    const fim =
      new Date(
        `${periodoFim}T00:00:00`
      );

    if (inicio > fim) {
      setErro(
        "A data inicial não pode ser maior que a final."
      );

      return;
    }

    const confirmar =
      window.confirm(
        `Liberar os horários de ${formatarDataCurta(
          periodoInicio
        )} até ${formatarDataCurta(
          periodoFim
        )}?`
      );

    if (!confirmar) return;

    try {
      setProcessando(true);
      setErro("");

      const operacoes = [];

      let dataAtual =
        new Date(inicio);

      while (
        dataAtual <= fim
      ) {
        const dataISO =
          formatarDataISO(
            dataAtual
          );

        HORARIOS_PADRAO.forEach(
          (horario) => {
            const item =
              obterHorario(
                dataISO,
                horario
              );

            if (!item) return;

            if (
              item.agendamentoId
            ) {
              operacoes.push({
                tipo:
                  "update",

                id:
                  criarIdHorario(
                    dataISO,
                    horario
                  ),

                dados: {
                  bloqueado:
                    deleteField(),

                  motivo:
                    deleteField(),

                  atualizadoEm:
                    serverTimestamp(),
                },
              });
            } else {
              operacoes.push({
                tipo:
                  "delete",

                id:
                  criarIdHorario(
                    dataISO,
                    horario
                  ),
              });
            }
          }
        );

        dataAtual =
          adicionarDias(
            dataAtual,
            1
          );
      }

      await executarBatch(
        operacoes
      );

      setPeriodoInicio("");
      setPeriodoFim("");
      setPeriodoMotivo("");
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível liberar o período."
      );
    } finally {
      setProcessando(false);
    }
  }

  /*
   * ============================================================
   * LISTA
   * ============================================================
   */

  const agendamentosFiltrados =
    useMemo(() => {
      return agendamentos.filter(
        (agendamento) => {
          if (
            filtroStatus ===
            "todos"
          ) {
            return true;
          }

          return (
            agendamento.status ===
            filtroStatus
          );
        }
      );
    }, [
      agendamentos,
      filtroStatus,
    ]);

  const agendamentosDoDia =
    useMemo(() => {
      return agendamentosFiltrados
        .filter(
          (agendamento) =>
            agendamento.data ===
            dataSelecionada
        )
        .sort((a, b) =>
          String(
            a.horario || ""
          ).localeCompare(
            String(
              b.horario || ""
            )
          )
        );
    }, [
      agendamentosFiltrados,
      dataSelecionada,
    ]);

  const quantidadeAtivos =
    agendamentos.filter(
      (item) =>
        item.status !==
          "cancelado" &&
        item.status !==
          "excluido"
    ).length;

  const quantidadePendentes =
    agendamentos.filter(
      (item) =>
        item.status ===
        "pendente"
    ).length;

  const quantidadeConfirmados =
    agendamentos.filter(
      (item) =>
        item.status ===
        "confirmado"
    ).length;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main className="admin-agendamento-page">

      {/* HEADER */}

      <header className="admin-agendamento-header">
        <button
          type="button"
          className="admin-agendamento-back"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <FiArrowLeft />
          <span>Voltar</span>
        </button>

        <div className="admin-agendamento-title-area">
          <h1 className="admin-agendamento-title">
            <FiCalendar />
            Agenda
          </h1>
        </div>

        <div className="admin-agendamento-counter">
          <FiUsers />

          <div>
            <strong>
              {quantidadeAtivos}
            </strong>

            <span>
              agendamentos ativos
            </span>
          </div>
        </div>
      </header>

      {/* ERRO */}

      {erro && (
        <div className="admin-agendamento-error">
          <FiX />

          <span>
            {erro}
          </span>

          <button
            type="button"
            onClick={() =>
              setErro("")
            }
          >
            <FiX />
          </button>
        </div>
      )}

      {/* DISPONIBILIDADE */}

      <section className="admin-disponibilidade">

        <div className="admin-disponibilidade-header">
          <div>
            <span className="admin-section-eyebrow">
              DISPONIBILIDADE
            </span>

            <h2 className="admin-disponibilidade-date">
              {formatarDataTexto(
                dataSelecionada
              )}
            </h2>
          </div>
        </div>

        <div className="admin-disponibilidade-content">

          {/* CALENDÁRIO */}

          <div className="admin-calendar-card">

            <div className="admin-calendar-top">
              <button
                type="button"
                className="admin-calendar-nav"
                onClick={() =>
                  mudarMes(-1)
                }
              >
                <FiChevronLeft />
              </button>

              <strong>
                {MESES[mesAtual]}{" "}
                {anoAtual}
              </strong>

              <button
                type="button"
                className="admin-calendar-nav"
                onClick={() =>
                  mudarMes(1)
                }
              >
                <FiChevronRight />
              </button>

              <button
                type="button"
                className="admin-calendar-today"
                onClick={
                  voltarParaHoje
                }
              >
                Hoje
              </button>
            </div>

            <div className="admin-calendar-weekdays">
              {DIAS_SEMANA.map(
                (dia) => (
                  <span key={dia}>
                    {dia}
                  </span>
                )
              )}
            </div>

            <div className="admin-calendar-grid">
              {diasDoMes.map(
                (item) => {
                  if (
                    item.vazio
                  ) {
                    return (
                      <div
                        key={
                          item.id
                        }
                        className="admin-calendar-day admin-calendar-day--empty"
                      />
                    );
                  }

                  const selecionado =
                    item.dataISO ===
                    dataSelecionada;

                  const hojeISO =
                    formatarDataISO(
                      new Date()
                    );

                  const bloqueado =
                    diaEstaBloqueado(
                      item.dataISO
                    );

                  const parcial =
                    diaTemBloqueio(
                      item.dataISO
                    );

                  const agendamento =
                    diaTemAgendamento(
                      item.dataISO
                    );

                  const extra =
                    diaTemExtra(
                      item.dataISO
                    );

                  return (
                    <button
                      type="button"
                      key={
                        item.dataISO
                      }
                      className={[
                        "admin-calendar-day",

                        selecionado
                          ? "admin-calendar-day--selected"
                          : "",

                        bloqueado
                          ? "admin-calendar-day--blocked"
                          : "",

                        parcial &&
                        !bloqueado
                          ? "admin-calendar-day--partial"
                          : "",

                        agendamento
                          ? "admin-calendar-day--appointment"
                          : "",

                        item.dataISO ===
                        hojeISO
                          ? "admin-calendar-day--today"
                          : "",
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " "
                        )}
                      onClick={() =>
                        selecionarData(
                          item.dataISO
                        )
                      }
                    >
                      <span className="admin-calendar-day-number">
                        {item.dia}
                      </span>

                      <div className="admin-calendar-day-indicators">

                        {agendamento && (
                          <span className="admin-calendar-dot admin-calendar-dot--appointment" />
                        )}

                        {extra && (
                          <span className="admin-calendar-dot admin-calendar-dot--extra" />
                        )}

                        {bloqueado && (
                          <span className="admin-calendar-dot admin-calendar-dot--blocked" />
                        )}

                      </div>
                    </button>
                  );
                }
              )}
            </div>

            <div className="admin-calendar-legend">

              <span>
                <i className="admin-calendar-legend-dot admin-calendar-legend-dot--appointment" />
                Agendamento
              </span>

              <span>
                <i className="admin-calendar-legend-dot admin-calendar-legend-dot--blocked" />
                Bloqueado
              </span>

              <span>
                <i className="admin-calendar-legend-dot admin-calendar-legend-dot--extra" />
                Extra
              </span>

            </div>
          </div>

          {/* PAINEL */}

          <aside className="admin-availability-panel">

            <div className="admin-selected-date">
              <div>
                <FiCalendar />
              </div>

              <section>
                <span>
                  DATA SELECIONADA
                </span>

                <strong>
                  {formatarDataCurta(
                    dataSelecionada
                  )}
                </strong>
              </section>
            </div>

            {/* DIA INTEIRO */}

            <div className="admin-block-day">

              <div className="admin-control-title">
                <div>
                  <FiLock />
                  <span>
                    Dia inteiro
                  </span>
                </div>

                <span
                  className={`admin-status-pill ${
                    diaEstaBloqueado(
                      dataSelecionada
                    )
                      ? "admin-status-pill--blocked"
                      : "admin-status-pill--available"
                  }`}
                >
                  {diaEstaBloqueado(
                    dataSelecionada
                  )
                    ? "Bloqueado"
                    : "Disponível"}
                </span>
              </div>

              <p className="admin-control-description">
                Bloqueie todos os horários
                padrão deste dia.
              </p>

              <input
                type="text"
                className="admin-control-input"
                placeholder="Motivo do bloqueio"
                value={
                  motivoBloqueioDia
                }
                onChange={(event) =>
                  setMotivoBloqueioDia(
                    event.target.value
                  )
                }
              />

              <div className="admin-control-buttons">

                {diaEstaBloqueado(
                  dataSelecionada
                ) ? (
                  <button
                    type="button"
                    className="admin-action-button admin-action-button--unlock"
                    onClick={
                      liberarDia
                    }
                    disabled={
                      processando
                    }
                  >
                    <FiUnlock />
                    Liberar dia
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-action-button admin-action-button--block"
                    onClick={
                      bloquearDia
                    }
                    disabled={
                      processando
                    }
                  >
                    <FiLock />
                    Bloquear dia
                  </button>
                )}

              </div>
            </div>

            {/* HORÁRIOS */}

            <div className="admin-hours-section">

              <div className="admin-hours-header">
                <div>
                  <span className="admin-section-eyebrow">
                    HORÁRIOS
                  </span>

                  <h3>
                    Disponibilidade
                  </h3>
                </div>

                <button
                  type="button"
                  className="admin-add-hour-button"
                  onClick={() =>
                    setNovoHorarioExtra(
                      "18:30"
                    )
                  }
                >
                  <FiPlus />
                  Adicionar
                </button>
              </div>

              {novoHorarioExtra && (
                <div className="admin-extra-hour-form">

                  <div className="admin-extra-hour-form-title">
                    <FiPlus />
                    <span>
                      Novo horário extra
                    </span>
                  </div>

                  <div className="admin-extra-hour-form-fields">

                    <label>
                      Horário

                      <input
                        type="time"
                        value={
                          novoHorarioExtra
                        }
                        onChange={(event) =>
                          setNovoHorarioExtra(
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      Observação

                      <input
                        type="text"
                        placeholder="Ex.: encaixe"
                        value={
                          novoHorarioExtraMotivo
                        }
                        onChange={(event) =>
                          setNovoHorarioExtraMotivo(
                            event.target.value
                          )
                        }
                      />
                    </label>

                  </div>

                  <div className="admin-extra-hour-form-actions">

                    <button
                      type="button"
                      onClick={() => {
                        setNovoHorarioExtra(
                          ""
                        );

                        setNovoHorarioExtraMotivo(
                          ""
                        );
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={
                        adicionarHorarioExtra
                      }
                      disabled={
                        processando
                      }
                    >
                      Adicionar horário
                    </button>

                  </div>
                </div>
              )}

              <div className="admin-hours-list">

                {todosHorariosDoDia.map(
                  (horario) => {
                    const item =
                      obterHorario(
                        dataSelecionada,
                        horario
                      );

                    const extra =
                      item?.horarioExtra ===
                      true;

                    const ocupado =
                      horarioEstaOcupado(
                        dataSelecionada,
                        horario
                      );

                    const bloqueado =
                      horarioEstaBloqueado(
                        dataSelecionada,
                        horario
                      );

                    const agendamento =
                      item?.agendamentoId
                        ? agendamentos.find(
                            (a) =>
                              a.id ===
                              item.agendamentoId
                          )
                        : null;

                    return (
                      <div
                        key={
                          horario
                        }
                        className={[
                          "admin-hour-row",

                          bloqueado
                            ? "admin-hour-row--blocked"
                            : "",

                          ocupado
                            ? "admin-hour-row--booked"
                            : "",

                          extra
                            ? "admin-hour-row--extra"
                            : "",
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            " "
                          )}
                      >

                        <div className="admin-hour-main">

                          <div className="admin-hour-icon">
                            <FiClock />
                          </div>

                          <div className="admin-hour-info">

                            <strong>
                              {horario}
                            </strong>

                            <div>

                              {extra && (
                                <span className="admin-extra-badge">
                                  EXTRA
                                </span>
                              )}

                              {ocupado && (
                                <span>
                                  {agendamento?.nome ||
                                    "Agendado"}
                                </span>
                              )}

                              {!ocupado &&
                                bloqueado && (
                                  <span>
                                    {item?.motivo ||
                                      "Bloqueado"}
                                  </span>
                                )}

                              {!ocupado &&
                                !bloqueado && (
                                  <span>
                                    Disponível
                                  </span>
                                )}

                            </div>

                          </div>
                        </div>

                        <div className="admin-hour-actions">

                          {bloqueado ? (
                            <button
                              type="button"
                              className="admin-hour-action admin-hour-action--unlock"
                              onClick={() =>
                                liberarHorario(
                                  horario
                                )
                              }
                            >
                              <FiUnlock />
                              Liberar
                            </button>
                          ) : (
                            !ocupado && (
                              <button
                                type="button"
                                className="admin-hour-action admin-hour-action--block"
                                onClick={() =>
                                  bloquearHorario(
                                    horario
                                  )
                                }
                              >
                                <FiLock />
                                Bloquear
                              </button>
                            )
                          )}

                          {extra &&
                            !ocupado && (
                              <button
                                type="button"
                                className="admin-hour-action admin-hour-action--delete"
                                onClick={() =>
                                  removerHorarioExtra(
                                    horario
                                  )
                                }
                              >
                                <FiX />
                                Remover
                              </button>
                            )}

                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            </div>

            {/* PERÍODO */}

            <div className="admin-period-section">

              <div>
                <span className="admin-section-eyebrow">
                  PERÍODO
                </span>

                <h3>
                  Bloqueio em período
                </h3>
              </div>

              <p className="admin-period-description">
                Bloqueie os horários padrão
                de vários dias.
              </p>

              <div className="admin-period-fields">

                <label>
                  De

                  <input
                    type="date"
                    value={
                      periodoInicio
                    }
                    onChange={(event) =>
                      setPeriodoInicio(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Até

                  <input
                    type="date"
                    value={
                      periodoFim
                    }
                    onChange={(event) =>
                      setPeriodoFim(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Motivo

                  <input
                    type="text"
                    placeholder="Ex.: férias"
                    value={
                      periodoMotivo
                    }
                    onChange={(event) =>
                      setPeriodoMotivo(
                        event.target.value
                      )
                    }
                  />
                </label>

              </div>

              <div className="admin-period-actions">

                <button
                  type="button"
                  className="admin-action-button admin-action-button--block"
                  onClick={
                    bloquearPeriodo
                  }
                >
                  <FiLock />
                  Bloquear
                </button>

                <button
                  type="button"
                  className="admin-action-button admin-action-button--unlock"
                  onClick={
                    liberarPeriodo
                  }
                >
                  <FiUnlock />
                  Liberar
                </button>

              </div>
            </div>

            {/* RESUMO */}

            <div className="admin-day-summary">

              <div>
                <span>
                  Horários
                </span>

                <strong>
                  {
                    todosHorariosDoDia.length
                  }
                </strong>
              </div>

              <div>
                <span>
                  Agendados
                </span>

                <strong>
                  {
                    todosHorariosDoDia.filter(
                      (horario) =>
                        horarioEstaOcupado(
                          dataSelecionada,
                          horario
                        )
                    ).length
                  }
                </strong>
              </div>

              <div>
                <span>
                  Bloqueados
                </span>

                <strong>
                  {
                    todosHorariosDoDia.filter(
                      (horario) =>
                        horarioEstaBloqueado(
                          dataSelecionada,
                          horario
                        )
                    ).length
                  }
                </strong>
              </div>

            </div>

          </aside>
        </div>
      </section>

      {/* ======================================================
          AGENDAMENTOS
      ====================================================== */}

      <section className="admin-agendamentos-section">

        <div className="admin-agendamentos-header">

          <div>
            <span className="admin-section-eyebrow">
              ATENDIMENTOS
            </span>

            <h2>
              Agendamentos
            </h2>

            <p>
              Gerencie seus clientes e
              atendimentos.
            </p>
          </div>

          <button
            type="button"
            className="admin-new-appointment-button"
            onClick={
              abrirNovoAgendamento
            }
          >
            <FiPlus />
            Novo agendamento
          </button>

          <div className="admin-agendamento-filtros">

            {STATUS_FILTROS.map(
              (filtro) => (
                <button
                  type="button"
                  key={
                    filtro.valor
                  }
                  className={
                    filtroStatus ===
                    filtro.valor
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFiltroStatus(
                      filtro.valor
                    )
                  }
                >
                  {
                    filtro.label
                  }
                </button>
              )
            )}

          </div>

        </div>

        {/* RESUMO */}

        <div className="admin-agenda-summary">

          <div className="admin-agenda-summary-card">
            <span>
              ATIVOS
            </span>

            <strong>
              {quantidadeAtivos}
            </strong>
          </div>

          <div className="admin-agenda-summary-card">
            <span>
              PENDENTES
            </span>

            <strong>
              {quantidadePendentes}
            </strong>
          </div>

          <div className="admin-agenda-summary-card">
            <span>
              CONFIRMADOS
            </span>

            <strong>
              {quantidadeConfirmados}
            </strong>
          </div>

        </div>

        {agendamentosDoDia.length ===
        0 ? (
          <div className="admin-agendamentos-empty">

            <FiCalendar />

            <h3>
              Nenhum atendimento neste dia
            </h3>

            <p>
              Você pode criar um
              agendamento manualmente.
            </p>

            <button
              type="button"
              className="admin-new-appointment-button admin-new-appointment-button--empty"
              onClick={
                abrirNovoAgendamento
              }
            >
              <FiPlus />
              Criar agendamento
            </button>

          </div>
        ) : (
          <div className="admin-agendamentos-list">

            {agendamentosDoDia.map(
              (agendamento) => {

                const valorTotal =
                  converterValor(
                    agendamento.valorTotal
                  );

                const valorSinal =
                  converterValor(
                    agendamento.valorSinal
                  );

                const valorRestante =
                  agendamento.valorRestante !==
                  undefined
                    ? converterValor(
                        agendamento.valorRestante
                      )
                    : Math.max(
                        valorTotal -
                          valorSinal,
                        0
                      );

                const clienteStatus =
                  agendamento.statusCliente ||
                  "novo";

                return (
                  <article
                    key={
                      agendamento.id
                    }
                    className={[
                      "admin-agendamento-card",
                      `admin-agendamento-card--${
                        agendamento.status ||
                        "pendente"
                      }`,
                    ].join(" ")}
                  >

                    {/* CLIENTE */}

                    <div className="admin-client-card-header">

                      <div className="admin-client-main">

                        <div className="admin-client-avatar">
                          {agendamento.nome
                            ? agendamento.nome
                                .charAt(
                                  0
                                )
                                .toUpperCase()
                            : "?"}
                        </div>

                        <div className="admin-client-identity">

                          <span className="admin-card-eyebrow">
                            CLIENTE
                          </span>

                          <h3>
                            {agendamento.nome ||
                              "Cliente"}
                          </h3>

                          <div className="admin-client-tags">

                            <span
                              className={`admin-client-status admin-client-status--${clienteStatus}`}
                            >
                              <FiUser />

                              {obterStatusClienteLabel(
                                clienteStatus
                              )}
                            </span>

                            <span
                              className={`admin-agendamento-status admin-agendamento-status--${
                                agendamento.status ||
                                "pendente"
                              }`}
                            >
                              {
                                obterNomeStatus(
                                  agendamento.status
                                )
                              }
                            </span>

                          </div>
                        </div>
                      </div>

                      <div className="admin-client-crm">

                        {agendamento.clienteId ? (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/crm?cliente=${agendamento.clienteId}`
                              )
                            }
                          >
                            <FiUsers />
                            Ver no CRM
                            <FiExternalLink />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              vincularClienteAoAgendamento(
                                agendamento
                              )
                            }
                            disabled={
                              processando
                            }
                          >
                            <FiPlus />
                            Vincular ao CRM
                          </button>
                        )}

                      </div>
                    </div>

                    {/* CONTATO */}

                    <div className="admin-client-contact">

                      {agendamento.whatsapp && (
                        <div className="admin-contact-item">

                          <FiMessageCircle />

                          <div>
                            <span>
                              WhatsApp
                            </span>

                            <strong>
                              {
                                agendamento.whatsapp
                              }
                            </strong>
                          </div>

                        </div>
                      )}

                      {agendamento.email && (
                        <div className="admin-contact-item">

                          <FiMail />

                          <div>
                            <span>
                              E-mail
                            </span>

                            <strong>
                              {
                                agendamento.email
                              }
                            </strong>
                          </div>

                        </div>
                      )}

                    </div>

                    {/* AGENDAMENTO */}

                    <div className="admin-appointment-box">

                      <div className="admin-box-heading">

                        <FiCalendar />

                        <div>
                          <span>
                            AGENDAMENTO
                          </span>

                          <strong>
                            Atendimento
                          </strong>
                        </div>

                      </div>

                      <div className="admin-appointment-details">

                        <div>
                          <span>
                            DATA
                          </span>

                          <strong>
                            {formatarDataCurta(
                              agendamento.data
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            HORÁRIO
                          </span>

                          <strong>
                            {
                              agendamento.horario
                            }
                          </strong>
                        </div>

                      </div>

                    </div>

                    {/* OBSERVAÇÕES */}

                    {agendamento.observacoes && (
                      <div className="admin-client-notes">

                        <span>
                          OBSERVAÇÕES
                        </span>

                        <p>
                          {
                            agendamento.observacoes
                          }
                        </p>

                      </div>
                    )}

                    {/* FINANCEIRO */}

                    <div className="admin-finance-card">

                      <div className="admin-finance-header">

                        <div className="admin-box-heading">

                          <FiDollarSign />

                          <div>
                            <span>
                              FINANCEIRO
                            </span>

                            <strong>
                              Valores do atendimento
                            </strong>
                          </div>

                        </div>

                        <button
                          type="button"
                          className="admin-finance-edit"
                          onClick={() =>
                            abrirFinanceiro(
                              agendamento
                            )
                          }
                        >
                          <FiEdit3 />
                          Editar
                        </button>

                      </div>

                      <div className="admin-finance-values">

                        <div className="admin-finance-value admin-finance-value--total">
                          <span>
                            VALOR TOTAL
                          </span>

                          <strong>
                            {valorTotal >
                            0
                              ? formatarMoeda(
                                  valorTotal
                                )
                              : "—"}
                          </strong>
                        </div>

                        <div className="admin-finance-value">
                          <span>
                            SINAL
                          </span>

                          <strong>
                            {valorSinal >
                            0
                              ? formatarMoeda(
                                  valorSinal
                                )
                              : "—"}
                          </strong>
                        </div>

                        <div className="admin-finance-value">
                          <span>
                            RESTANTE
                          </span>

                          <strong>
                            {formatarMoeda(
                              valorRestante
                            )}
                          </strong>
                        </div>

                      </div>

                      <div className="admin-finance-status">

                        <div
                          className={
                            agendamento.sinalPago
                              ? "paid"
                              : "pending"
                          }
                        >
                          <span>
                            {agendamento.sinalPago ? (
                              <FiCheck />
                            ) : (
                              <FiClock />
                            )}
                          </span>

                          <div>
                            <strong>
                              {agendamento.sinalPago
                                ? "Sinal pago"
                                : "Sinal pendente"}
                            </strong>

                            <small>
                              {agendamento.formaPagamentoSinal
                                ? `Via ${agendamento.formaPagamentoSinal}`
                                : "Forma de pagamento não informada"}
                            </small>
                          </div>
                        </div>

                        <div
                          className={
                            agendamento.restantePago
                              ? "paid"
                              : "pending"
                          }
                        >
                          <span>
                            {agendamento.restantePago ? (
                              <FiCheck />
                            ) : (
                              <FiClock />
                            )}
                          </span>

                          <div>
                            <strong>
                              {agendamento.restantePago
                                ? "Pagamento final pago"
                                : "Pagamento final pendente"}
                            </strong>

                            <small>
                              {agendamento.formaPagamentoRestante
                                ? `Via ${agendamento.formaPagamentoRestante}`
                                : "Ainda não registrado"}
                            </small>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* AÇÕES */}

                    <footer className="admin-agendamento-card-footer">

                      <span className="admin-agendamento-created">
                        {agendamento.criadoEm?.seconds
                          ? `Criado em ${new Date(
                              agendamento.criadoEm.seconds *
                                1000
                            ).toLocaleDateString(
                              "pt-BR"
                            )}`
                          : ""}
                      </span>

                      <div className="admin-agendamento-actions">

                        {agendamento.status ===
                          "pendente" && (
                          <button
                            type="button"
                            className="admin-agendamento-action admin-agendamento-action--confirm"
                            onClick={() =>
                              alterarStatus(
                                agendamento,
                                "confirmado"
                              )
                            }
                            disabled={
                              processando
                            }
                          >
                            <FiCheck />
                            Confirmar
                          </button>
                        )}

                        {agendamento.status ===
                          "confirmado" && (
                          <button
                            type="button"
                            className="admin-agendamento-action admin-agendamento-action--confirm"
                            onClick={() =>
                              concluirAtendimento(
                                agendamento
                              )
                            }
                            disabled={
                              processando
                            }
                          >
                            <FiCheck />
                            Concluir
                          </button>
                        )}

                        {agendamento.status !==
                          "cancelado" &&
                          agendamento.status !==
                            "concluido" &&
                          agendamento.status !==
                            "excluido" && (
                            <button
                              type="button"
                              className="admin-agendamento-action admin-agendamento-action--cancel"
                              onClick={() =>
                                alterarStatus(
                                  agendamento,
                                  "cancelado"
                                )
                              }
                              disabled={
                                processando
                              }
                            >
                              Cancelar
                            </button>
                          )}

                        <button
                          type="button"
                          className="admin-agendamento-action admin-agendamento-action--delete"
                          onClick={() =>
                            excluirAgendamento(
                              agendamento
                            )
                          }
                          disabled={
                            processando
                          }
                        >
                          Excluir
                        </button>

                      </div>
                    </footer>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* ======================================================
          MODAL NOVO AGENDAMENTO
      ====================================================== */}

      {modalNovoAgendamento && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              fecharNovoAgendamento();
            }
          }}
        >
          <div className="admin-modal admin-new-appointment-modal">

            <div className="admin-modal-header">

              <div>
                <span className="admin-section-eyebrow">
                  NOVO ATENDIMENTO
                </span>

                <h2>
                  Novo agendamento
                </h2>

                <p>
                  Cadastre manualmente um
                  atendimento na agenda.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  fecharNovoAgendamento
                }
                disabled={
                  processando
                }
              >
                <FiX />
              </button>

            </div>

            <div className="admin-modal-form">

              {/* CLIENTE */}

              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FiUser />
                  <div>
                    <span>
                      CLIENTE
                    </span>
                    <strong>
                      Dados do cliente
                    </strong>
                  </div>
                </div>

                <div className="admin-form-grid">

                  <label>
                    Nome *

                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={
                        novoAgendamento.nome
                      }
                      onChange={(event) =>
                        setNovoAgendamento(
                          (anterior) => ({
                            ...anterior,
                            nome:
                              event.target.value,
                          })
                        )
                      }
                    />
                  </label>

                  <label>
                    WhatsApp

                    <input
                      type="tel"
                      placeholder="(34) 99999-9999"
                      value={
                        novoAgendamento.whatsapp
                      }
                      onChange={(event) =>
                        setNovoAgendamento(
                          (anterior) => ({
                            ...anterior,
                            whatsapp:
                              event.target.value,
                          })
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field-full">
                    E-mail

                    <input
                      type="email"
                      placeholder="cliente@email.com"
                      value={
                        novoAgendamento.email
                      }
                      onChange={(event) =>
                        setNovoAgendamento(
                          (anterior) => ({
                            ...anterior,
                            email:
                              event.target.value,
                          })
                        )
                      }
                    />
                  </label>

                </div>
              </div>

              {/* DATA E HORÁRIO */}

              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FiCalendar />
                  <div>
                    <span>
                      AGENDA
                    </span>
                    <strong>
                      Data e horário
                    </strong>
                  </div>
                </div>

                <div className="admin-form-grid">

                  <label>
                    Data *

                    <input
                      type="date"
                      value={
                        novoAgendamento.data
                      }
                      onChange={(event) => {
                        const novaData =
                          event.target.value;

                        setNovoAgendamento(
                          (anterior) => ({
                            ...anterior,
                            data:
                              novaData,
                            horario:
                              "",
                          })
                        );

                        if (
                          novaData
                        ) {
                          const partes =
                            novaData
                              .split("-")
                              .map(
                                Number
                              );

                          setAnoAtual(
                            partes[0]
                          );

                          setMesAtual(
                            partes[1] - 1
                          );

                          setDataSelecionada(
                            novaData
                          );
                        }
                      }}
                    />
                  </label>

                  <label>
                    Horário *

                    <select
                      value={
                        novoAgendamento.horario
                      }
                      onChange={(event) =>
                        setNovoAgendamento(
                          (anterior) => ({
                            ...anterior,
                            horario:
                              event.target.value,
                          })
                        )
                      }
                    >
                      <option value="">
                        Selecione
                      </option>

                      {HORARIOS_PADRAO.map(
                        (horario) => {
                          const ocupado =
                            horarioEstaOcupado(
                              novoAgendamento.data,
                              horario
                            );

                          const bloqueado =
                            horarioEstaBloqueado(
                              novoAgendamento.data,
                              horario
                            );

                          return (
                            <option
                              key={
                                horario
                              }
                              value={
                                horario
                              }
                              disabled={
                                ocupado ||
                                bloqueado
                              }
                            >
                              {horario}
                              {ocupado
                                ? " — ocupado"
                                : bloqueado
                                ? " — bloqueado"
                                : ""}
                            </option>
                          );
                        }
                      )}

                      {horariosOcupados
                        .filter(
                          (item) =>
                            item.data ===
                              novoAgendamento.data &&
                            item.horarioExtra ===
                              true
                        )
                        .sort(
                          (a, b) =>
                            a.horario.localeCompare(
                              b.horario
                            )
                        )
                        .map(
                          (item) => {
                            const ocupado =
                              Boolean(
                                item.agendamentoId
                              );

                            const bloqueado =
                              Boolean(
                                item.bloqueado
                              );

                            return (
                              <option
                                key={
                                  item.horario
                                }
                                value={
                                  item.horario
                                }
                                disabled={
                                  ocupado ||
                                  bloqueado
                                }
                              >
                                {item.horario}
                                {" — extra"}
                                {ocupado
                                  ? " — ocupado"
                                  : bloqueado
                                  ? " — bloqueado"
                                  : ""}
                              </option>
                            );
                          }
                        )}

                    </select>
                  </label>

                </div>
              </div>

              {/* FINANCEIRO */}

              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FiDollarSign />
                  <div>
                    <span>
                      FINANCEIRO
                    </span>
                    <strong>
                      Valores do atendimento
                    </strong>
                  </div>
                </div>

                <div className="admin-form-grid">

                  <label>
                    Valor total

                    <div className="admin-input-money">
                      <span>
                        R$
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={
                          novoAgendamento.valorTotal
                        }
                        onChange={(event) =>
                          setNovoAgendamento(
                            (anterior) => ({
                              ...anterior,
                              valorTotal:
                                event.target.value,
                            })
                          )
                        }
                      />
                    </div>
                  </label>

                  <label>
                    Valor do sinal

                    <div className="admin-input-money">
                      <span>
                        R$
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={
                          novoAgendamento.valorSinal
                        }
                        onChange={(event) =>
                          setNovoAgendamento(
                            (anterior) => ({
                              ...anterior,
                              valorSinal:
                                event.target.value,
                            })
                          )
                        }
                      />
                    </div>
                  </label>

                  <label>
                    Forma de pagamento do sinal

                    <select
                      value={
                        novoAgendamento.formaPagamentoSinal
                      }
                      onChange={(event) =>
                        setNovoAgendamento(
                          (anterior) => ({
                            ...anterior,
                            formaPagamentoSinal:
                              event.target.value,
                          })
                        )
                      }
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

                      <option value="cartao">
                        Cartão
                      </option>

                      <option value="transferencia">
                        Transferência
                      </option>
                    </select>
                  </label>

                  <div className="admin-new-appointment-summary">

                    <div>
                      <span>
                        RESTANTE
                      </span>

                      <strong>
                        {formatarMoeda(
                          Math.max(
                            converterValor(
                              novoAgendamento.valorTotal
                            ) -
                              converterValor(
                                novoAgendamento.valorSinal
                              ),
                            0
                          )
                        )}
                      </strong>
                    </div>

                  </div>

                </div>

                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={
                      novoAgendamento.restantePago
                    }
                    onChange={(event) =>
                      setNovoAgendamento(
                        (anterior) => ({
                          ...anterior,
                          restantePago:
                            event.target.checked,
                        })
                      )
                    }
                  />

                  <span>
                    Pagamento restante já realizado
                  </span>
                </label>

                {novoAgendamento.restantePago && (
                  <label>
                    Forma de pagamento restante

                    <select
                      value={
                        novoAgendamento.formaPagamentoRestante
                      }
                      onChange={(event) =>
                        setNovoAgendamento(
                          (anterior) => ({
                            ...anterior,
                            formaPagamentoRestante:
                              event.target.value,
                          })
                        )
                      }
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

                      <option value="cartao">
                        Cartão
                      </option>

                      <option value="transferencia">
                        Transferência
                      </option>
                    </select>
                  </label>
                )}
              </div>

              {/* OBSERVAÇÕES */}

              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FiMessageCircle />
                  <div>
                    <span>
                      DETALHES
                    </span>
                    <strong>
                      Observações
                    </strong>
                  </div>
                </div>

                <label>
                  Observações do atendimento

                  <textarea
                    rows="4"
                    placeholder="Ex.: tatuagem no braço, tamanho aproximado, referência..."
                    value={
                      novoAgendamento.observacoes
                    }
                    onChange={(event) =>
                      setNovoAgendamento(
                        (anterior) => ({
                          ...anterior,
                          observacoes:
                            event.target.value,
                        })
                      )
                    }
                  />
                </label>
              </div>

            </div>

            <div className="admin-modal-actions">

              <button
                type="button"
                onClick={
                  fecharNovoAgendamento
                }
                disabled={
                  processando
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  criarAgendamentoManual
                }
                disabled={
                  processando
                }
              >
                <FiCheck />

                {processando
                  ? "Salvando..."
                  : "Criar agendamento"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================
          MODAL FINANCEIRO
      ====================================================== */}

      {modalFinanceiro && (
        <div className="admin-modal-overlay">

          <div className="admin-modal admin-finance-modal">

            <div className="admin-modal-header">

              <div>
                <span className="admin-section-eyebrow">
                  FINANCEIRO
                </span>

                <h2>
                  {modalFinanceiro.nome ||
                    "Cliente"}
                </h2>

                <p>
                  Configure os valores deste
                  atendimento.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalFinanceiro(
                    null
                  )
                }
              >
                <FiX />
              </button>

            </div>

            <div className="admin-modal-form">

              <div className="admin-finance-form-highlight">

                <span>
                  VALOR TOTAL
                </span>

                <div>
                  <span>
                    R$
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={
                      dadosFinanceiros.valorTotal
                    }
                    onChange={(event) =>
                      setDadosFinanceiros(
                        (anterior) => ({
                          ...anterior,
                          valorTotal:
                            event.target.value,
                        })
                      )
                    }
                  />
                </div>

              </div>

              <label>
                Valor do sinal

                <div className="admin-input-money">

                  <span>
                    R$
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={
                      dadosFinanceiros.valorSinal
                    }
                    onChange={(event) =>
                      setDadosFinanceiros(
                        (anterior) => ({
                          ...anterior,
                          valorSinal:
                            event.target.value,
                        })
                      )
                    }
                  />

                </div>
              </label>

              <label>
                Forma de pagamento do sinal

                <select
                  value={
                    dadosFinanceiros.formaPagamentoSinal
                  }
                  onChange={(event) =>
                    setDadosFinanceiros(
                      (anterior) => ({
                        ...anterior,
                        formaPagamentoSinal:
                          event.target.value,
                      })
                    )
                  }
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

                  <option value="cartao">
                    Cartão
                  </option>

                  <option value="transferencia">
                    Transferência
                  </option>
                </select>
              </label>

              <div className="admin-finance-modal-summary">

                <div>
                  <span>
                    TOTAL
                  </span>

                  <strong>
                    {formatarMoeda(
                      converterValor(
                        dadosFinanceiros.valorTotal
                      )
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    SINAL
                  </span>

                  <strong>
                    {formatarMoeda(
                      converterValor(
                        dadosFinanceiros.valorSinal
                      )
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    RESTANTE
                  </span>

                  <strong>
                    {formatarMoeda(
                      Math.max(
                        converterValor(
                          dadosFinanceiros.valorTotal
                        ) -
                          converterValor(
                            dadosFinanceiros.valorSinal
                          ),
                        0
                      )
                    )}
                  </strong>
                </div>

              </div>

              <label className="admin-checkbox-label">

                <input
                  type="checkbox"
                  checked={
                    dadosFinanceiros.restantePago
                  }
                  onChange={(event) =>
                    setDadosFinanceiros(
                      (anterior) => ({
                        ...anterior,
                        restantePago:
                          event.target.checked,
                      })
                    )
                  }
                />

                <span>
                  Pagamento restante já realizado
                </span>

              </label>

              {dadosFinanceiros.restantePago && (
                <label>
                  Forma de pagamento restante

                  <select
                    value={
                      dadosFinanceiros.formaPagamentoRestante
                    }
                    onChange={(event) =>
                      setDadosFinanceiros(
                        (anterior) => ({
                          ...anterior,
                          formaPagamentoRestante:
                            event.target.value,
                        })
                      )
                    }
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

                    <option value="cartao">
                      Cartão
                    </option>

                    <option value="transferencia">
                      Transferência
                    </option>
                  </select>
                </label>
              )}

            </div>

            <div className="admin-modal-actions">

              <button
                type="button"
                onClick={() =>
                  setModalFinanceiro(
                    null
                  )
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  salvarFinanceiro
                }
                disabled={
                  processando
                }
              >
                <FiCheck />
                Salvar financeiro
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}

export default AgendamentoAdmin;