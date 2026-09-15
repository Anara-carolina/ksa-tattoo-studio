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
  FaArrowLeft,
  FaCalendarAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaExclamationTriangle,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaPlus,
  FaRegCalendarAlt,
  FaSyncAlt,
  FaTimes,
  FaTrash,
  FaUnlock,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";

import { db } from "../../lib/firebase";

import "./AgendamentoAdmin.css";

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const HORARIOS_PADRAO = [
  "09:00",
  "10:30",
  "14:00",
  "15:30",
  "17:00",
];

const nomesMeses = [
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

const nomesDiasSemana = [
  "DOM",
  "SEG",
  "TER",
  "QUA",
  "QUI",
  "SEX",
  "SÁB",
];

/* =========================================================
   FUNÇÕES DE DATA
========================================================= */

const formatarDataISO = (data) => {
  const ano = data.getFullYear();

  const mes = String(
    data.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    data.getDate()
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
};

const criarDataLocal = (dataISO) => {
  if (!dataISO) return null;

  const [ano, mes, dia] =
    dataISO.split("-").map(Number);

  return new Date(
    ano,
    mes - 1,
    dia
  );
};

const formatarDataTexto = (dataISO) => {
  const data = criarDataLocal(dataISO);

  if (!data) return "";

  return data.toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

const formatarDataCurta = (dataISO) => {
  const data = criarDataLocal(dataISO);

  if (!data) return "";

  return data.toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};

const criarIdHorario = (
  data,
  horario
) => {
  return `${data}_${horario}`;
};

const criarIdHorarioExtra = (
  data,
  horario
) => {
  return `${data}_${horario}`;
};

const adicionarDias = (
  data,
  quantidade
) => {
  const novaData = new Date(data);

  novaData.setDate(
    novaData.getDate() + quantidade
  );

  return novaData;
};

/* =========================================================
   VERIFICAR HORÁRIO
========================================================= */

const horarioValido = (horario) => {
  if (!horario) return false;

  return /^([01]\d|2[0-3]):[0-5]\d$/.test(
    horario
  );
};

/* =========================================================
   COMPONENTE
========================================================= */

function AgendamentoAdmin() {
  const navigate = useNavigate();

  /* =======================================================
     AGENDAMENTOS
  ======================================================= */

  const [agendamentos, setAgendamentos] =
    useState([]);

  const [
    carregandoAgendamentos,
    setCarregandoAgendamentos,
  ] = useState(true);

  const [erro, setErro] = useState("");

  /* =======================================================
     HORÁRIOS
  ======================================================= */

  const [
    horariosOcupados,
    setHorariosOcupados,
  ] = useState([]);

  /* =======================================================
     CALENDÁRIO ADMINISTRATIVO
  ======================================================= */

  const hoje = new Date();

  hoje.setHours(
    0,
    0,
    0,
    0
  );

  const [mesAtual, setMesAtual] =
    useState(
      new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      )
    );

  const [
    dataSelecionada,
    setDataSelecionada,
  ] = useState(
    formatarDataISO(hoje)
  );

  /* =======================================================
     BLOQUEIO DE DIA
  ======================================================= */

  const [motivoBloqueio, setMotivoBloqueio] =
    useState("");

  const [
    processandoDisponibilidade,
    setProcessandoDisponibilidade,
  ] = useState(false);

  /* =======================================================
     BLOQUEIO DE PERÍODO
  ======================================================= */

  const [
    dataInicioPeriodo,
    setDataInicioPeriodo,
  ] = useState(
    formatarDataISO(hoje)
  );

  const [
    dataFimPeriodo,
    setDataFimPeriodo,
  ] = useState(
    formatarDataISO(hoje)
  );

  const [
    motivoPeriodo,
    setMotivoPeriodo,
  ] = useState("");

  /* =======================================================
     HORÁRIO EXTRA
  ======================================================= */

  const [
    mostrandoAdicionarHorario,
    setMostrandoAdicionarHorario,
  ] = useState(false);

  const [
    novoHorario,
    setNovoHorario,
  ] = useState("");

  const [
    motivoHorarioExtra,
    setMotivoHorarioExtra,
  ] = useState("");

  /* =======================================================
     FILTRO DOS AGENDAMENTOS
  ======================================================= */

  const [
    filtroStatus,
    setFiltroStatus,
  ] = useState("todos");

  /* =========================================================
     CARREGAR AGENDAMENTOS
  ========================================================= */

  useEffect(() => {
    const agendamentosRef =
      collection(
        db,
        "agendamentos"
      );

    const consulta = query(
      agendamentosRef,
      orderBy(
        "criadoEm",
        "desc"
      )
    );

    const unsubscribe =
      onSnapshot(
        consulta,
        (snapshot) => {
          const lista =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setAgendamentos(lista);
          setCarregandoAgendamentos(
            false
          );
        },
        (error) => {
          console.error(
            "Erro ao carregar agendamentos:",
            error
          );

          setErro(
            "Não foi possível carregar os agendamentos."
          );

          setCarregandoAgendamentos(
            false
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  /* =========================================================
     CARREGAR HORÁRIOS OCUPADOS
  ========================================================= */

  useEffect(() => {
    const horariosRef =
      collection(
        db,
        "horariosOcupados"
      );

    const unsubscribe =
      onSnapshot(
        horariosRef,
        (snapshot) => {
          const lista =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setHorariosOcupados(
            lista
          );
        },
        (error) => {
          console.error(
            "Erro ao carregar horários:",
            error
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  /* =========================================================
     SINCRONIZAR AGENDAMENTOS COM HORÁRIOS OCUPADOS
  ========================================================= */

  useEffect(() => {
    if (
      carregandoAgendamentos
    ) {
      return;
    }

    const sincronizar =
      async () => {
        try {
          const horariosRef =
            collection(
              db,
              "horariosOcupados"
            );

          const snapshot =
            await getDocs(
              horariosRef
            );

          const batch =
            writeBatch(db);

          const horariosEsperados =
            new Set();

          agendamentos.forEach(
            (agendamento) => {
              /*
                Somente agendamentos ativos
                ocupam o horário.
              */

              if (
                agendamento.status ===
                  "cancelado" ||
                agendamento.status ===
                  "excluido"
              ) {
                return;
              }

              if (
                !agendamento.data ||
                !agendamento.horario
              ) {
                return;
              }

              const id =
                criarIdHorario(
                  agendamento.data,
                  agendamento.horario
                );

              horariosEsperados.add(
                id
              );

              const slotRef =
                doc(
                  db,
                  "horariosOcupados",
                  id
                );

              /*
                merge preserva:
                - bloqueado
                - motivo
                - horário extra
              */

              batch.set(
                slotRef,
                {
                  data:
                    agendamento.data,

                  horario:
                    agendamento.horario,

                  agendamentoId:
                    agendamento.id,
                },
                {
                  merge: true,
                }
              );
            }
          );

          /*
            Remove horários antigos que não possuem
            mais agendamento.

            IMPORTANTE:
            bloqueios manuais NÃO são apagados.
          */

          snapshot.docs.forEach(
            (item) => {
              const dados =
                item.data();

              if (
                !horariosEsperados.has(
                  item.id
                ) &&
                dados.bloqueado !== true
              ) {
                /*
                  Horário extra disponível também
                  não deve ser apagado.
                */

                if (
                  dados.horarioExtra ===
                  true
                ) {
                  return;
                }

                batch.delete(
                  item.ref
                );
              }
            }
          );

          await batch.commit();
        } catch (error) {
          console.error(
            "Erro ao sincronizar horários:",
            error
          );
        }
      };

    sincronizar();
  }, [
    agendamentos,
    carregandoAgendamentos,
  ]);

  /* =========================================================
     CALENDÁRIO
  ========================================================= */

  const diasDoMes = useMemo(() => {
    const ano =
      mesAtual.getFullYear();

    const mes =
      mesAtual.getMonth();

    const primeiroDia =
      new Date(
        ano,
        mes,
        1
      );

    const ultimoDia =
      new Date(
        ano,
        mes + 1,
        0
      );

    const dias = [];

    const primeiroDiaSemana =
      primeiroDia.getDay();

    for (
      let i = 0;
      i < primeiroDiaSemana;
      i++
    ) {
      dias.push(null);
    }

    for (
      let dia = 1;
      dia <=
      ultimoDia.getDate();
      dia++
    ) {
      dias.push(
        new Date(
          ano,
          mes,
          dia
        )
      );
    }

    return dias;
  }, [mesAtual]);

  /* =========================================================
     MAPA DE HORÁRIOS
  ========================================================= */

  const mapaHorarios =
    useMemo(() => {
      const mapa = {};

      horariosOcupados.forEach(
        (item) => {
          if (
            item.data &&
            item.horario
          ) {
            mapa[
              criarIdHorario(
                item.data,
                item.horario
              )
            ] = item;
          }
        }
      );

      return mapa;
    }, [
      horariosOcupados,
    ]);

  /* =========================================================
     HORÁRIOS EXTRAS DE UMA DATA
  ========================================================= */

  const horariosExtrasDaData =
    useMemo(() => {
      if (!dataSelecionada) {
        return [];
      }

      return horariosOcupados
        .filter(
          (item) =>
            item.data ===
              dataSelecionada &&
            item.horarioExtra ===
              true
        )
        .sort(
          (a, b) =>
            a.horario.localeCompare(
              b.horario
            )
        );
    }, [
      horariosOcupados,
      dataSelecionada,
    ]);

  /* =========================================================
     TODOS OS HORÁRIOS DA DATA
  ========================================================= */

  const todosHorariosDaData =
    useMemo(() => {
      const extras =
        horariosExtrasDaData.map(
          (item) =>
            item.horario
        );

      return [
        ...new Set([
          ...HORARIOS_PADRAO,
          ...extras,
        ]),
      ].sort((a, b) =>
        a.localeCompare(b)
      );
    }, [
      horariosExtrasDaData,
    ]);

  /* =========================================================
     AGENDAMENTOS DA DATA
  ========================================================= */

  const agendamentosDaData =
    useMemo(() => {
      return agendamentos.filter(
        (item) =>
          item.data ===
          dataSelecionada
      );
    }, [
      agendamentos,
      dataSelecionada,
    ]);

  /* =========================================================
     VERIFICAR SE HORÁRIO ESTÁ OCUPADO
  ========================================================= */

  const obterHorario = (
    data,
    horario
  ) => {
    return (
      mapaHorarios[
        criarIdHorario(
          data,
          horario
        )
      ] || null
    );
  };

  const horarioEstaOcupado =
    (
      data,
      horario
    ) => {
      return Boolean(
        obterHorario(
          data,
          horario
        )
      );
    };

  const horarioEstaBloqueado =
    (
      data,
      horario
    ) => {
      const horarioItem =
        obterHorario(
          data,
          horario
        );

      return (
        horarioItem?.bloqueado ===
        true
      );
    };

  /* =========================================================
     VERIFICAR DIA INTEIRO BLOQUEADO
  ========================================================= */

  const diaEstaBloqueado =
    (dataISO) => {
      if (!dataISO) {
        return false;
      }

      return HORARIOS_PADRAO.every(
        (horario) =>
          horarioEstaBloqueado(
            dataISO,
            horario
          )
      );
    };

  /* =========================================================
     VERIFICAR SE TEM ALGUM BLOQUEIO
  ========================================================= */

  const diaTemBloqueio =
    (dataISO) => {
      if (!dataISO) {
        return false;
      }

      return horariosOcupados.some(
        (item) =>
          item.data ===
            dataISO &&
          item.bloqueado ===
            true
      );
    };

  /* =========================================================
     VERIFICAR SE TEM AGENDAMENTO
  ========================================================= */

  const diaTemAgendamento =
    (dataISO) => {
      if (!dataISO) {
        return false;
      }

      return agendamentos.some(
        (item) =>
          item.data ===
            dataISO &&
          item.status !==
            "cancelado" &&
          item.status !==
            "excluido"
      );
    };

  /* =========================================================
     NAVEGAÇÃO DO CALENDÁRIO
  ========================================================= */

  const mesAnterior = () => {
    setMesAtual(
      new Date(
        mesAtual.getFullYear(),
        mesAtual.getMonth() -
          1,
        1
      )
    );
  };

  const proximoMes = () => {
    setMesAtual(
      new Date(
        mesAtual.getFullYear(),
        mesAtual.getMonth() +
          1,
        1
      )
    );
  };

  const voltarParaHoje = () => {
    setMesAtual(
      new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      )
    );

    setDataSelecionada(
      formatarDataISO(hoje)
    );
  };

  /* =========================================================
     SELECIONAR DIA
  ========================================================= */

  const selecionarDia = (
    data
  ) => {
    if (!data) return;

    const dataISO =
      formatarDataISO(data);

    setDataSelecionada(
      dataISO
    );

    setErro("");
    setNovoHorario("");
    setMotivoHorarioExtra("");
    setMostrandoAdicionarHorario(
      false
    );
  };

  /* =========================================================
     EXECUTAR OPERAÇÕES EM LOTES
  ========================================================= */

  const executarOperacoes =
    async (
      operacoes
    ) => {
      const tamanhoLote = 400;

      for (
        let inicio = 0;
        inicio <
        operacoes.length;
        inicio +=
          tamanhoLote
      ) {
        const lote =
          operacoes.slice(
            inicio,
            inicio +
              tamanhoLote
          );

        const batch =
          writeBatch(db);

        lote.forEach(
          (operacao) => {
            if (
              operacao.tipo ===
              "set"
            ) {
              batch.set(
                operacao.ref,
                operacao.dados,
                {
                  merge:
                    true,
                }
              );
            }

            if (
              operacao.tipo ===
              "update"
            ) {
              batch.update(
                operacao.ref,
                operacao.dados
              );
            }

            if (
              operacao.tipo ===
              "delete"
            ) {
              batch.delete(
                operacao.ref
              );
            }
          }
        );

        await batch.commit();
      }
    };

  /* =========================================================
     BLOQUEAR HORÁRIO
  ========================================================= */

  const bloquearHorario =
    async (
      horario
    ) => {
      if (
        !dataSelecionada ||
        !horario
      ) {
        return;
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const slotId =
          criarIdHorario(
            dataSelecionada,
            horario
          );

        const slotRef =
          doc(
            db,
            "horariosOcupados",
            slotId
          );

        await setDoc(
          slotRef,
          {
            data:
              dataSelecionada,

            horario,

            bloqueado:
              true,

            motivo:
              motivoBloqueio.trim() ||
              "Bloqueio manual",

            criadoEm:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        setMotivoBloqueio("");
      } catch (error) {
        console.error(
          "Erro ao bloquear horário:",
          error
        );

        setErro(
          "Não foi possível bloquear o horário."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     LIBERAR HORÁRIO
  ========================================================= */

  const liberarHorario =
    async (
      horario
    ) => {
      if (
        !dataSelecionada ||
        !horario
      ) {
        return;
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const slotId =
          criarIdHorario(
            dataSelecionada,
            horario
          );

        const slot =
          obterHorario(
            dataSelecionada,
            horario
          );

        const slotRef =
          doc(
            db,
            "horariosOcupados",
            slotId
          );

        /*
          Se existe agendamento nesse horário,
          retiramos somente o bloqueio.

          O agendamento continua ocupando o horário.
        */

        if (
          slot?.agendamentoId
        ) {
          await updateDoc(
            slotRef,
            {
              bloqueado:
                deleteField(),

              motivo:
                deleteField(),
            }
          );

          return;
        }

        /*
          Se não existe agendamento,
          podemos remover completamente
          o documento.
        */

        if (
          slot?.horarioExtra ===
          true
        ) {
          /*
            Horário extra continua existindo.
            Apenas retiramos o bloqueio.
          */

          await updateDoc(
            slotRef,
            {
              bloqueado:
                deleteField(),

              motivo:
                deleteField(),
            }
          );

          return;
        }

        await deleteDoc(
          slotRef
        );
      } catch (error) {
        console.error(
          "Erro ao liberar horário:",
          error
        );

        setErro(
          "Não foi possível liberar o horário."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     BLOQUEAR DIA INTEIRO
  ========================================================= */

  const bloquearDiaInteiro =
    async () => {
      if (!dataSelecionada) {
        return;
      }

      const possuiAgendamento =
        diaTemAgendamento(
          dataSelecionada
        );

      if (
        possuiAgendamento
      ) {
        const confirmou =
          window.confirm(
            "Esta data possui agendamento(s). Deseja bloquear todos os horários mesmo assim?"
          );

        if (!confirmou) {
          return;
        }
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const operacoes =
          HORARIOS_PADRAO.map(
            (horario) => ({
              tipo: "set",

              ref: doc(
                db,
                "horariosOcupados",
                criarIdHorario(
                  dataSelecionada,
                  horario
                )
              ),

              dados: {
                data:
                  dataSelecionada,

                horario,

                bloqueado:
                  true,

                motivo:
                  motivoBloqueio.trim() ||
                  "Dia inteiro bloqueado",

                criadoEm:
                  serverTimestamp(),
              },
            })
          );

        await executarOperacoes(
          operacoes
        );

        setMotivoBloqueio("");
      } catch (error) {
        console.error(
          "Erro ao bloquear dia:",
          error
        );

        setErro(
          "Não foi possível bloquear a data."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     LIBERAR DIA INTEIRO
  ========================================================= */

  const liberarDiaInteiro =
    async () => {
      if (!dataSelecionada) {
        return;
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const operacoes =
          HORARIOS_PADRAO.map(
            (horario) => {
              const slot =
                obterHorario(
                  dataSelecionada,
                  horario
                );

              if (!slot) {
                return null;
              }

              const slotRef =
                doc(
                  db,
                  "horariosOcupados",
                  criarIdHorario(
                    dataSelecionada,
                    horario
                  )
                );

              /*
                Se há agendamento,
                preservamos o documento.
              */

              if (
                slot.agendamentoId
              ) {
                return {
                  tipo: "update",

                  ref: slotRef,

                  dados: {
                    bloqueado:
                      deleteField(),

                    motivo:
                      deleteField(),
                  },
                };
              }

              /*
                Se é somente bloqueio,
                apagamos o documento.
              */

              return {
                tipo: "delete",
                ref: slotRef,
              };
            }
          ).filter(Boolean);

        await executarOperacoes(
          operacoes
        );
      } catch (error) {
        console.error(
          "Erro ao liberar dia:",
          error
        );

        setErro(
          "Não foi possível liberar a data."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     ADICIONAR HORÁRIO EXTRA
  ========================================================= */

  const adicionarHorarioExtra =
    async () => {
      const horario =
        novoHorario.trim();

      if (
        !horarioValido(horario)
      ) {
        setErro(
          "Digite um horário válido no formato HH:MM."
        );

        return;
      }

      if (
        todosHorariosDaData.includes(
          horario
        )
      ) {
        setErro(
          "Esse horário já existe nesta data."
        );

        return;
      }

      if (!dataSelecionada) {
        setErro(
          "Selecione uma data primeiro."
        );

        return;
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const slotId =
          criarIdHorarioExtra(
            dataSelecionada,
            horario
          );

        const slotRef =
          doc(
            db,
            "horariosOcupados",
            slotId
          );

        await setDoc(
          slotRef,
          {
            data:
              dataSelecionada,

            horario,

            horarioExtra:
              true,

            bloqueado:
              false,

            motivo:
              motivoHorarioExtra.trim() ||
              "Horário extra",

            criadoEm:
              serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        setNovoHorario("");
        setMotivoHorarioExtra("");

        setMostrandoAdicionarHorario(
          false
        );
      } catch (error) {
        console.error(
          "Erro ao adicionar horário extra:",
          error
        );

        setErro(
          "Não foi possível adicionar o horário extra."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     REMOVER HORÁRIO EXTRA
  ========================================================= */

  const removerHorarioExtra =
    async (
      horario
    ) => {
      if (!dataSelecionada) {
        return;
      }

      const confirmou =
        window.confirm(
          `Remover o horário extra ${horario} desta data?`
        );

      if (!confirmou) {
        return;
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const slot =
          obterHorario(
            dataSelecionada,
            horario
          );

        if (!slot) {
          return;
        }

        /*
          Não permitimos apagar um horário
          extra que já possui agendamento.
        */

        if (
          slot.agendamentoId
        ) {
          setErro(
            "Esse horário possui um agendamento e não pode ser removido."
          );

          return;
        }

        const slotRef =
          doc(
            db,
            "horariosOcupados",
            criarIdHorario(
              dataSelecionada,
              horario
            )
          );

        await deleteDoc(
          slotRef
        );
      } catch (error) {
        console.error(
          "Erro ao remover horário extra:",
          error
        );

        setErro(
          "Não foi possível remover o horário extra."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     BLOQUEAR PERÍODO
  ========================================================= */

  const bloquearPeriodo =
    async () => {
      if (
        !dataInicioPeriodo ||
        !dataFimPeriodo
      ) {
        setErro(
          "Informe a data inicial e final."
        );

        return;
      }

      const inicio =
        criarDataLocal(
          dataInicioPeriodo
        );

      const fim =
        criarDataLocal(
          dataFimPeriodo
        );

      if (
        !inicio ||
        !fim
      ) {
        setErro(
          "Informe datas válidas."
        );

        return;
      }

      if (
        inicio > fim
      ) {
        setErro(
          "A data inicial não pode ser posterior à data final."
        );

        return;
      }

      const possuiAgendamento =
        agendamentos.some(
          (item) => {
            if (
              item.status ===
                "cancelado" ||
              item.status ===
                "excluido"
            ) {
              return false;
            }

            const data =
              criarDataLocal(
                item.data
              );

            return (
              data &&
              data >= inicio &&
              data <= fim
            );
          }
        );

      if (
        possuiAgendamento
      ) {
        const confirmou =
          window.confirm(
            "Existe pelo menos um agendamento dentro desse período. Deseja bloquear o período mesmo assim?"
          );

        if (!confirmou) {
          return;
        }
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const operacoes =
          [];

        let dataAtual =
          new Date(
            inicio
          );

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

                ref: doc(
                  db,
                  "horariosOcupados",
                  criarIdHorario(
                    dataISO,
                    horario
                  )
                ),

                dados: {
                  data:
                    dataISO,

                  horario,

                  bloqueado:
                    true,

                  motivo:
                    motivoPeriodo.trim() ||
                    "Período bloqueado",

                  criadoEm:
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

        await executarOperacoes(
          operacoes
        );

        setMotivoPeriodo("");
      } catch (error) {
        console.error(
          "Erro ao bloquear período:",
          error
        );

        setErro(
          "Não foi possível bloquear o período."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     LIBERAR PERÍODO
  ========================================================= */

  const liberarPeriodo =
    async () => {
      if (
        !dataInicioPeriodo ||
        !dataFimPeriodo
      ) {
        setErro(
          "Informe a data inicial e final."
        );

        return;
      }

      const inicio =
        criarDataLocal(
          dataInicioPeriodo
        );

      const fim =
        criarDataLocal(
          dataFimPeriodo
        );

      if (
        !inicio ||
        !fim ||
        inicio > fim
      ) {
        setErro(
          "Informe um período válido."
        );

        return;
      }

      const confirmou =
        window.confirm(
          "Liberar os bloqueios manuais desse período?"
        );

      if (!confirmou) {
        return;
      }

      setErro("");
      setProcessandoDisponibilidade(
        true
      );

      try {
        const operacoes =
          [];

        let dataAtual =
          new Date(
            inicio
          );

        while (
          dataAtual <= fim
        ) {
          const dataISO =
            formatarDataISO(
              dataAtual
            );

          HORARIOS_PADRAO.forEach(
            (horario) => {
              const slot =
                obterHorario(
                  dataISO,
                  horario
                );

              if (!slot) {
                return;
              }

              const slotRef =
                doc(
                  db,
                  "horariosOcupados",
                  criarIdHorario(
                    dataISO,
                    horario
                  )
                );

              if (
                slot.agendamentoId
              ) {
                operacoes.push({
                  tipo: "update",

                  ref: slotRef,

                  dados: {
                    bloqueado:
                      deleteField(),

                    motivo:
                      deleteField(),
                  },
                });
              } else {
                operacoes.push({
                  tipo: "delete",

                  ref: slotRef,
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

        await executarOperacoes(
          operacoes
        );
      } catch (error) {
        console.error(
          "Erro ao liberar período:",
          error
        );

        setErro(
          "Não foi possível liberar o período."
        );
      } finally {
        setProcessandoDisponibilidade(
          false
        );
      }
    };

  /* =========================================================
     STATUS DO AGENDAMENTO
  ========================================================= */

  const alterarStatus =
    async (
      id,
      novoStatus
    ) => {
      try {
        setErro("");

        const agendamento =
          agendamentos.find(
            (item) =>
              item.id === id
          );

        if (!agendamento) {
          return;
        }

        const agendamentoRef =
          doc(
            db,
            "agendamentos",
            id
          );

        await updateDoc(
          agendamentoRef,
          {
            status:
              novoStatus,
          }
        );

        if (
          !agendamento.data ||
          !agendamento.horario
        ) {
          return;
        }

        const slotId =
          criarIdHorario(
            agendamento.data,
            agendamento.horario
          );

        const slotRef =
          doc(
            db,
            "horariosOcupados",
            slotId
          );

        const slot =
          obterHorario(
            agendamento.data,
            agendamento.horario
          );

        /*
          CANCELAMENTO
        */

        if (
          novoStatus ===
          "cancelado"
        ) {
          if (
            slot?.bloqueado ===
            true
          ) {
            /*
              Preserva o bloqueio manual,
              mas remove o agendamento.
            */

            await updateDoc(
              slotRef,
              {
                agendamentoId:
                  deleteField(),
              }
            );
          } else {
            await deleteDoc(
              slotRef
            );
          }

          return;
        }

        /*
          REATIVAÇÃO
        */

        if (
          novoStatus ===
            "pendente" ||
          novoStatus ===
            "confirmado"
        ) {
          await setDoc(
            slotRef,
            {
              data:
                agendamento.data,

              horario:
                agendamento.horario,

              agendamentoId:
                id,
            },
            {
              merge: true,
            }
          );
        }
      } catch (error) {
        console.error(
          "Erro ao alterar status:",
          error
        );

        setErro(
          "Não foi possível alterar o status."
        );
      }
    };

  /* =========================================================
     EXCLUIR AGENDAMENTO
  ========================================================= */

  const excluirAgendamento =
    async (
      id
    ) => {
      const confirmou =
        window.confirm(
          "Tem certeza que deseja excluir este agendamento?"
        );

      if (!confirmou) {
        return;
      }

      try {
        setErro("");

        const agendamento =
          agendamentos.find(
            (item) =>
              item.id === id
          );

        if (!agendamento) {
          return;
        }

        const agendamentoRef =
          doc(
            db,
            "agendamentos",
            id
          );

        await deleteDoc(
          agendamentoRef
        );

        if (
          agendamento.data &&
          agendamento.horario
        ) {
          const slot =
            obterHorario(
              agendamento.data,
              agendamento.horario
            );

          const slotRef =
            doc(
              db,
              "horariosOcupados",
              criarIdHorario(
                agendamento.data,
                agendamento.horario
              )
            );

          if (
            slot?.bloqueado ===
            true
          ) {
            await updateDoc(
              slotRef,
              {
                agendamentoId:
                  deleteField(),
              }
            );
          } else {
            await deleteDoc(
              slotRef
            );
          }
        }
      } catch (error) {
        console.error(
          "Erro ao excluir agendamento:",
          error
        );

        setErro(
          "Não foi possível excluir o agendamento."
        );
      }
    };

  /* =========================================================
     DATA CRIADA
  ========================================================= */

  const formatarCriadoEm =
    (valor) => {
      if (
        !valor
      ) {
        return "—";
      }

      if (
        typeof valor.toDate ===
        "function"
      ) {
        return valor
          .toDate()
          .toLocaleString(
            "pt-BR"
          );
      }

      return "—";
    };

  /* =========================================================
     AGENDAMENTOS FILTRADOS
  ========================================================= */

  const agendamentosFiltrados =
    useMemo(() => {
      if (
        filtroStatus ===
        "todos"
      ) {
        return agendamentos;
      }

      return agendamentos.filter(
        (item) =>
          item.status ===
          filtroStatus
      );
    }, [
      agendamentos,
      filtroStatus,
    ]);

  /* =========================================================
     CONTADORES
  ========================================================= */

  const totalPendentes =
    agendamentos.filter(
      (item) =>
        item.status ===
        "pendente"
    ).length;

  const totalConfirmados =
    agendamentos.filter(
      (item) =>
        item.status ===
        "confirmado"
    ).length;

  const totalCancelados =
    agendamentos.filter(
      (item) =>
        item.status ===
        "cancelado"
    ).length;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="admin-agendamento-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
          <FaArrowLeft />
          VOLTAR
        </button>

        <div className="admin-agendamento-title">
          <span>
            KSA STUDIO
          </span>

          <h1>
            Agenda
          </h1>

          <p>
            Gerencie agendamentos e disponibilidade
          </p>
        </div>

        <div className="admin-agendamento-counter">
          <strong>
            {agendamentos.length}
          </strong>

          <span>
            SOLICITAÇÕES
          </span>
        </div>
      </header>

      {/* =====================================================
          ERRO
      ===================================================== */}

      {erro && (
        <div className="admin-agendamento-error">
          <FaExclamationTriangle />

          <span>
            {erro}
          </span>

          <button
            type="button"
            onClick={() =>
              setErro("")
            }
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* =====================================================
          GERENCIADOR DE DISPONIBILIDADE
      ===================================================== */}

      <section className="admin-disponibilidade">

        <div className="admin-disponibilidade-header">

          <div>
            <span className="admin-section-eyebrow">
              CONTROLE DA AGENDA
            </span>

            <h2>
              Disponibilidade
            </h2>

            <p>
              Libere horários extras, bloqueie horários ou reserve dias inteiros.
            </p>
          </div>

          <div className="admin-disponibilidade-date">
            <FaCalendarAlt />

            <div>
              <span>
                DATA SELECIONADA
              </span>

              <strong>
                {formatarDataCurta(
                  dataSelecionada
                )}
              </strong>
            </div>
          </div>

        </div>

        <div className="admin-disponibilidade-content">

          {/* =================================================
              CALENDÁRIO ADMIN
          ================================================= */}

          <div className="admin-calendar-card">

            <div className="admin-calendar-top">

              <button
                type="button"
                className="admin-calendar-nav"
                onClick={
                  mesAnterior
                }
                aria-label="Mês anterior"
              >
                <FaChevronLeft />
              </button>

              <div>
                <strong>
                  {
                    nomesMeses[
                      mesAtual.getMonth()
                    ]
                  }
                </strong>

                <span>
                  {mesAtual.getFullYear()}
                </span>
              </div>

              <button
                type="button"
                className="admin-calendar-nav"
                onClick={
                  proximoMes
                }
                aria-label="Próximo mês"
              >
                <FaChevronRight />
              </button>

            </div>

            <button
              type="button"
              className="admin-calendar-today"
              onClick={
                voltarParaHoje
              }
            >
              <FaRegCalendarAlt />
              IR PARA HOJE
            </button>

            <div className="admin-calendar-weekdays">
              {nomesDiasSemana.map(
                (dia) => (
                  <span key={dia}>
                    {dia}
                  </span>
                )
              )}
            </div>

            <div className="admin-calendar-grid">

              {diasDoMes.map(
                (data, index) => {
                  if (!data) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="admin-calendar-day admin-calendar-day--empty"
                      />
                    );
                  }

                  const dataISO =
                    formatarDataISO(
                      data
                    );

                  const selecionada =
                    dataISO ===
                    dataSelecionada;

                  const bloqueada =
                    diaEstaBloqueado(
                      dataISO
                    );

                  const temBloqueio =
                    diaTemBloqueio(
                      dataISO
                    );

                  const temAgendamento =
                    diaTemAgendamento(
                      dataISO
                    );

                  const ehHoje =
                    dataISO ===
                    formatarDataISO(
                      hoje
                    );

                  const classes = [
                    "admin-calendar-day",

                    selecionada
                      ? "admin-calendar-day--selected"
                      : "",

                    bloqueada
                      ? "admin-calendar-day--blocked"
                      : "",

                    temBloqueio &&
                    !bloqueada
                      ? "admin-calendar-day--partial"
                      : "",

                    temAgendamento
                      ? "admin-calendar-day--appointment"
                      : "",

                    ehHoje
                      ? "admin-calendar-day--today"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      type="button"
                      key={dataISO}
                      className={
                        classes
                      }
                      onClick={() =>
                        selecionarDia(
                          data
                        )
                      }
                    >
                      <span className="admin-calendar-day-number">
                        {data.getDate()}
                      </span>

                      <span className="admin-calendar-indicators">

                        {temAgendamento && (
                          <span className="admin-indicator admin-indicator--appointment" />
                        )}

                        {temBloqueio && (
                          <span className="admin-indicator admin-indicator--blocked" />
                        )}

                      </span>
                    </button>
                  );
                }
              )}

            </div>

            <div className="admin-calendar-legend">

              <div>
                <span className="admin-legend-dot admin-legend-dot--appointment" />
                Agendamento
              </div>

              <div>
                <span className="admin-legend-dot admin-legend-dot--blocked" />
                Bloqueio
              </div>

              <div>
                <span className="admin-legend-dot admin-legend-dot--selected" />
                Selecionado
              </div>

            </div>

          </div>

          {/* =================================================
              CONTROLE DA DATA
          ================================================= */}

          <div className="admin-availability-panel">

            <div className="admin-selected-date">

              <div className="admin-selected-date-icon">
                <FaCalendarAlt />
              </div>

              <div>
                <span>
                  DATA SELECIONADA
                </span>

                <h3>
                  {formatarDataTexto(
                    dataSelecionada
                  )}
                </h3>
              </div>

            </div>

            {/* ===============================================
                BLOQUEIO DO DIA
            =============================================== */}

            <div className="admin-block-day">

              <div className="admin-control-title">

                <div>
                  <span>
                    DIA INTEIRO
                  </span>

                  <h3>
                    {diaEstaBloqueado(
                      dataSelecionada
                    )
                      ? "Data bloqueada"
                      : "Data disponível"}
                  </h3>
                </div>

                <div
                  className={
                    diaEstaBloqueado(
                      dataSelecionada
                    )
                      ? "admin-status-pill admin-status-pill--blocked"
                      : "admin-status-pill admin-status-pill--available"
                  }
                >
                  {diaEstaBloqueado(
                    dataSelecionada
                  ) ? (
                    <>
                      <FaLock />
                      BLOQUEADO
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      DISPONÍVEL
                    </>
                  )}
                </div>

              </div>

              <div className="admin-control-description">
                {diaEstaBloqueado(
                  dataSelecionada
                )
                  ? "Todos os horários padrão desta data estão bloqueados."
                  : "Bloqueie todos os horários padrão desta data de uma vez."}
              </div>

              <input
                type="text"
                className="admin-control-input"
                value={
                  motivoBloqueio
                }
                onChange={(event) =>
                  setMotivoBloqueio(
                    event.target.value
                  )
                }
                placeholder="Motivo do bloqueio (opcional)"
              />

              <div className="admin-control-buttons">

                {diaEstaBloqueado(
                  dataSelecionada
                ) ? (
                  <button
                    type="button"
                    className="admin-action-button admin-action-button--unlock"
                    onClick={
                      liberarDiaInteiro
                    }
                    disabled={
                      processandoDisponibilidade
                    }
                  >
                    <FaUnlock />
                    LIBERAR DIA INTEIRO
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-action-button admin-action-button--block"
                    onClick={
                      bloquearDiaInteiro
                    }
                    disabled={
                      processandoDisponibilidade
                    }
                  >
                    <FaLock />
                    BLOQUEAR DIA INTEIRO
                  </button>
                )}

              </div>

            </div>

            {/* ===============================================
                HORÁRIOS
            =============================================== */}

            <div className="admin-hours-section">

              <div className="admin-hours-header">

                <div>
                  <span>
                    HORÁRIOS
                  </span>

                  <h3>
                    Controle dos horários
                  </h3>
                </div>

                <button
                  type="button"
                  className="admin-add-hour-button"
                  onClick={() =>
                    setMostrandoAdicionarHorario(
                      !mostrandoAdicionarHorario
                    )
                  }
                >
                  <FaPlus />
                  ADICIONAR HORÁRIO
                </button>

              </div>

              {/* =============================================
                  FORMULÁRIO HORÁRIO EXTRA
              ============================================= */}

              {mostrandoAdicionarHorario && (
                <div className="admin-extra-hour-form">

                  <div className="admin-extra-hour-form-title">
                    <FaPlus />

                    <div>
                      <strong>
                        Novo horário extra
                      </strong>

                      <span>
                        Esse horário ficará disponível somente nesta data.
                      </span>
                    </div>
                  </div>

                  <div className="admin-extra-hour-fields">

                    <div>
                      <label>
                        HORÁRIO
                      </label>

                      <input
                        type="time"
                        value={
                          novoHorario
                        }
                        onChange={(event) =>
                          setNovoHorario(
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label>
                        OBSERVAÇÃO
                      </label>

                      <input
                        type="text"
                        value={
                          motivoHorarioExtra
                        }
                        onChange={(event) =>
                          setMotivoHorarioExtra(
                            event.target.value
                          )
                        }
                        placeholder="Ex.: encaixe à noite"
                      />
                    </div>

                  </div>

                  <div className="admin-extra-hour-actions">

                    <button
                      type="button"
                      className="admin-extra-cancel"
                      onClick={() => {
                        setMostrandoAdicionarHorario(
                          false
                        );
                        setNovoHorario(
                          ""
                        );
                        setMotivoHorarioExtra(
                          ""
                        );
                      }}
                    >
                      CANCELAR
                    </button>

                    <button
                      type="button"
                      className="admin-extra-confirm"
                      onClick={
                        adicionarHorarioExtra
                      }
                      disabled={
                        processandoDisponibilidade
                      }
                    >
                      <FaPlus />
                      LIBERAR HORÁRIO
                    </button>

                  </div>

                </div>
              )}

              <div className="admin-hours-list">

                {todosHorariosDaData.map(
                  (horario) => {
                    const item =
                      obterHorario(
                        dataSelecionada,
                        horario
                      );

                    const bloqueado =
                      item?.bloqueado ===
                      true;

                    const agendado =
                      Boolean(
                        item?.agendamentoId
                      );

                    const extra =
                      item?.horarioExtra ===
                      true;

                    return (
                      <div
                        key={horario}
                        className={[
                          "admin-hour-row",

                          bloqueado
                            ? "admin-hour-row--blocked"
                            : "",

                          agendado
                            ? "admin-hour-row--booked"
                            : "",

                          extra
                            ? "admin-hour-row--extra"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >

                        <div className="admin-hour-main">

                          <div className="admin-hour-icon">
                            <FaClock />
                          </div>

                          <div className="admin-hour-info">

                            <strong>
                              {horario}
                            </strong>

                            <span>

                              {agendado
                                ? "Agendado"
                                : bloqueado
                                ? "Bloqueado manualmente"
                                : extra
                                ? "Horário extra"
                                : "Disponível"}

                            </span>

                          </div>

                          {extra && (
                            <span className="admin-extra-badge">
                              EXTRA
                            </span>
                          )}

                        </div>

                        <div className="admin-hour-actions">

                          {agendado ? (
                            <span className="admin-hour-status admin-hour-status--booked">
                              <FaCheck />
                              AGENDADO
                            </span>
                          ) : bloqueado ? (
                            <button
                              type="button"
                              className="admin-hour-action admin-hour-action--unlock"
                              onClick={() =>
                                liberarHorario(
                                  horario
                                )
                              }
                              disabled={
                                processandoDisponibilidade
                              }
                            >
                              <FaUnlock />
                              LIBERAR
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="admin-hour-action admin-hour-action--block"
                              onClick={() =>
                                bloquearHorario(
                                  horario
                                )
                              }
                              disabled={
                                processandoDisponibilidade
                              }
                            >
                              <FaLock />
                              BLOQUEAR
                            </button>
                          )}

                          {extra &&
                            !agendado && (
                              <button
                                type="button"
                                className="admin-hour-action admin-hour-action--delete"
                                onClick={() =>
                                  removerHorarioExtra(
                                    horario
                                  )
                                }
                                disabled={
                                  processandoDisponibilidade
                                }
                                title="Remover horário extra"
                              >
                                <FaTrash />
                              </button>
                            )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* ===============================================
                PERÍODO
            =============================================== */}

            <div className="admin-period-section">

              <div className="admin-control-title">

                <div>
                  <span>
                    PERÍODO
                  </span>

                  <h3>
                    Bloquear vários dias
                  </h3>
                </div>

                <FaRegCalendarAlt />
              </div>

              <div className="admin-period-description">
                Ideal para férias, viagens, feriados ou dias em que o studio não funcionará.
              </div>

              <div className="admin-period-fields">

                <div>
                  <label>
                    INÍCIO
                  </label>

                  <input
                    type="date"
                    value={
                      dataInicioPeriodo
                    }
                    onChange={(event) =>
                      setDataInicioPeriodo(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label>
                    FIM
                  </label>

                  <input
                    type="date"
                    value={
                      dataFimPeriodo
                    }
                    onChange={(event) =>
                      setDataFimPeriodo(
                        event.target.value
                      )
                    }
                  />
                </div>

              </div>

              <input
                type="text"
                className="admin-control-input"
                value={
                  motivoPeriodo
                }
                onChange={(event) =>
                  setMotivoPeriodo(
                    event.target.value
                  )
                }
                placeholder="Motivo do período (opcional)"
              />

              <div className="admin-period-actions">

                <button
                  type="button"
                  className="admin-action-button admin-action-button--block"
                  onClick={
                    bloquearPeriodo
                  }
                  disabled={
                    processandoDisponibilidade
                  }
                >
                  <FaLock />
                  BLOQUEAR PERÍODO
                </button>

                <button
                  type="button"
                  className="admin-action-button admin-action-button--unlock"
                  onClick={
                    liberarPeriodo
                  }
                  disabled={
                    processandoDisponibilidade
                  }
                >
                  <FaUnlock />
                  LIBERAR PERÍODO
                </button>

              </div>

            </div>

            {/* ===============================================
                RESUMO DO DIA
            =============================================== */}

            <div className="admin-day-summary">

              <div>
                <FaCalendarAlt />

                <span>
                  {agendamentosDaData.length}
                </span>

                <small>
                  agendamento(s)
                </small>
              </div>

              <div>
                <FaClock />

                <span>
                  {
                    todosHorariosDaData.filter(
                      (horario) =>
                        !horarioEstaOcupado(
                          dataSelecionada,
                          horario
                        )
                    ).length
                  }
                </span>

                <small>
                  horário(s) livres
                </small>
              </div>

              <div>
                <FaLock />

                <span>
                  {
                    todosHorariosDaData.filter(
                      (horario) =>
                        horarioEstaBloqueado(
                          dataSelecionada,
                          horario
                        )
                    ).length
                  }
                </span>

                <small>
                  bloqueado(s)
                </small>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          LISTA DE AGENDAMENTOS
      ===================================================== */}

      <section className="admin-agendamentos-section">

        <div className="admin-agendamentos-section-header">

          <div>
            <span className="admin-section-eyebrow">
              SOLICITAÇÕES RECEBIDAS
            </span>

            <h2>
              Agendamentos
            </h2>
          </div>

          <div className="admin-agendamento-filtros">

            <button
              type="button"
              className={
                filtroStatus ===
                "todos"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFiltroStatus(
                  "todos"
                )
              }
            >
              TODOS
            </button>

            <button
              type="button"
              className={
                filtroStatus ===
                "pendente"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFiltroStatus(
                  "pendente"
                )
              }
            >
              PENDENTES
              <span>
                {totalPendentes}
              </span>
            </button>

            <button
              type="button"
              className={
                filtroStatus ===
                "confirmado"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFiltroStatus(
                  "confirmado"
                )
              }
            >
              CONFIRMADOS
              <span>
                {totalConfirmados}
              </span>
            </button>

            <button
              type="button"
              className={
                filtroStatus ===
                "cancelado"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFiltroStatus(
                  "cancelado"
                )
              }
            >
              CANCELADOS
              <span>
                {totalCancelados}
              </span>
            </button>

          </div>

        </div>

        {carregandoAgendamentos ? (
          <div className="admin-agendamento-loading">
            <FaSyncAlt />

            <span>
              Carregando agendamentos...
            </span>
          </div>
        ) : agendamentosFiltrados.length ===
          0 ? (
          <div className="admin-agendamento-empty">

            <div>
              <FaCalendarAlt />
            </div>

            <h3>
              Nenhum agendamento encontrado
            </h3>

            <p>
              As solicitações recebidas aparecerão aqui.
            </p>

          </div>
        ) : (
          <div className="admin-agendamento-list">

            {agendamentosFiltrados.map(
              (agendamento) => {

                const status =
                  agendamento.status ||
                  "pendente";

                return (
                  <article
                    key={
                      agendamento.id
                    }
                    className={[
                      "admin-agendamento-card",
                      `admin-agendamento-card--${status}`,
                    ].join(" ")}
                  >

                    <div className="admin-card-top">

                      <div className="admin-card-client">

                        <div className="admin-client-avatar">
                          <FaUser />
                        </div>

                        <div>
                          <span>
                            CLIENTE
                          </span>

                          <h3>
                            {
                              agendamento.nome ||
                              "Sem nome"
                            }
                          </h3>
                        </div>

                      </div>

                      <span
                        className={[
                          "admin-status",
                          `admin-status--${status}`,
                        ].join(" ")}
                      >
                        {status ===
                          "pendente" &&
                          "PENDENTE"}

                        {status ===
                          "confirmado" &&
                          "CONFIRMADO"}

                        {status ===
                          "cancelado" &&
                          "CANCELADO"}

                        {![
                          "pendente",
                          "confirmado",
                          "cancelado",
                        ].includes(
                          status
                        ) &&
                          status.toUpperCase()}
                      </span>

                    </div>

                    <div className="admin-card-info">

                      <div className="admin-info-item">
                        <FaCalendarAlt />

                        <div>
                          <span>
                            DATA
                          </span>

                          <strong>
                            {
                              formatarDataCurta(
                                agendamento.data
                              )
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="admin-info-item">
                        <FaClock />

                        <div>
                          <span>
                            HORÁRIO
                          </span>

                          <strong>
                            {
                              agendamento.horario ||
                              "—"
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="admin-info-item">
                        <FaWhatsapp />

                        <div>
                          <span>
                            WHATSAPP
                          </span>

                          <strong>
                            {
                              agendamento.whatsapp ||
                              agendamento.telefone ||
                              "—"
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="admin-info-item">
                        <FaMapMarkerAlt />

                        <div>
                          <span>
                            LOCAL
                          </span>

                          <strong>
                            {
                              agendamento.localCorpo ||
                              agendamento.local ||
                              "—"
                            }
                          </strong>
                        </div>
                      </div>

                    </div>

                    <div className="admin-card-details">

                      <div>
                        <span>
                          TIPO DE TATUAGEM
                        </span>

                        <strong>
                          {
                            agendamento.tipoTatuagem ||
                            "Não informado"
                          }
                        </strong>
                      </div>

                      {agendamento.email && (
                        <div>
                          <span>
                            E-MAIL
                          </span>

                          <strong>
                            {
                              agendamento.email
                            }
                          </strong>
                        </div>
                      )}

                      {agendamento.observacoes && (
                        <div className="admin-details-full">
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

                    </div>

                    <div className="admin-card-footer">

                      <span className="admin-created">
                        SOLICITADO EM{" "}
                        {formatarCriadoEm(
                          agendamento.criadoEm
                        )}
                      </span>

                      <div className="admin-card-actions">

                        {status ===
                          "pendente" && (
                          <button
                            type="button"
                            className="admin-card-action admin-card-action--confirm"
                            onClick={() =>
                              alterarStatus(
                                agendamento.id,
                                "confirmado"
                              )
                            }
                          >
                            <FaCheck />
                            CONFIRMAR
                          </button>
                        )}

                        {status !==
                          "cancelado" && (
                          <button
                            type="button"
                            className="admin-card-action admin-card-action--cancel"
                            onClick={() =>
                              alterarStatus(
                                agendamento.id,
                                "cancelado"
                              )
                            }
                          >
                            <FaTimes />
                            CANCELAR
                          </button>
                        )}

                        {status ===
                          "cancelado" && (
                          <button
                            type="button"
                            className="admin-card-action admin-card-action--confirm"
                            onClick={() =>
                              alterarStatus(
                                agendamento.id,
                                "pendente"
                              )
                            }
                          >
                            <FaSyncAlt />
                            REATIVAR
                          </button>
                        )}

                        <button
                          type="button"
                          className="admin-card-action admin-card-action--delete"
                          onClick={() =>
                            excluirAgendamento(
                              agendamento.id
                            )
                          }
                        >
                          <FaTrash />
                          EXCLUIR
                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

    </main>
  );
}

export default AgendamentoAdmin;