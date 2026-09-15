
import { useEffect, useMemo, useState } from "react";

import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";

import { db } from "../../lib/firebase";

import "./Agendamento.css";

/* =========================================================
   HORÁRIOS PADRÃO
========================================================= */

const horariosDemo = [
  "09:00",
  "10:30",
  "14:00",
  "15:30",
  "17:00",
];

/* =========================================================
   NOMES
========================================================= */

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

const nomesDias = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

/* =========================================================
   FUNÇÕES DE DATA
========================================================= */

function formatarDataISO(data) {
  if (
    !(data instanceof Date) ||
    Number.isNaN(data.getTime())
  ) {
    return "";
  }

  const ano = data.getFullYear();

  const mes = String(
    data.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    data.getDate()
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarDataBonita(dataISO) {
  if (!dataISO) {
    return "";
  }

  const partes = dataISO.split("-");

  if (partes.length !== 3) {
    return dataISO;
  }

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

/* =========================================================
   FUNÇÃO DE HORÁRIO
========================================================= */

function normalizarHorario(horario) {
  if (!horario) {
    return "";
  }

  return String(horario).trim();
}

/* =========================================================
   COMPONENTE
========================================================= */

function Agendamento() {
  const navigate = useNavigate();

  /* =======================================================
     HOJE
  ======================================================= */

  const hoje = useMemo(() => {
    const data = new Date();

    data.setHours(
      0,
      0,
      0,
      0
    );

    return data;
  }, []);

  /* =======================================================
     CALENDÁRIO
  ======================================================= */

  const [mesAtual, setMesAtual] =
    useState(
      hoje.getMonth()
    );

  const [anoAtual, setAnoAtual] =
    useState(
      hoje.getFullYear()
    );

  const [
    dataSelecionada,
    setDataSelecionada,
  ] = useState(null);

  const [
    horarioSelecionado,
    setHorarioSelecionado,
  ] = useState(null);

  /* =======================================================
     FIRESTORE
  ======================================================= */

  const [
    agendamentos,
    setAgendamentos,
  ] = useState([]);

  const [
    horariosOcupados,
    setHorariosOcupados,
  ] = useState([]);

  /* =======================================================
     FORMULÁRIO
  ======================================================= */

  const [nome, setNome] =
    useState("");

  const [whatsapp, setWhatsapp] =
    useState("");

  const [
    observacoes,
    setObservacoes,
  ] = useState("");

  /* =======================================================
     ESTADOS
  ======================================================= */

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  const [erro, setErro] =
    useState("");

  const [
    agendamentoEnviado,
    setAgendamentoEnviado,
  ] = useState(null);

  /* =========================================================
     FIRESTORE
  ========================================================= */

  useEffect(() => {
    const unsubscribeAgendamentos =
      onSnapshot(
        collection(
          db,
          "agendamentos"
        ),
        (snapshot) => {
          const dados =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setAgendamentos(
            dados
          );
        },
        (error) => {
          console.error(
            "Erro ao carregar agendamentos:",
            error
          );
        }
      );

    const unsubscribeHorarios =
      onSnapshot(
        collection(
          db,
          "horariosOcupados"
        ),
        (snapshot) => {
          const dados =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setHorariosOcupados(
            dados
          );
        },
        (error) => {
          console.error(
            "Erro ao carregar horários:",
            error
          );
        }
      );

    return () => {
      unsubscribeAgendamentos();
      unsubscribeHorarios();
    };
  }, []);

  /* =========================================================
     IDENTIFICAR HORÁRIO EXTRA
  ========================================================= */

  function horarioEhExtra(item) {
    if (!item) {
      return false;
    }

    return (
      item.horarioExtra === true ||
      item.tipo === "extra" ||
      item.extra === true
    );
  }

  /* =========================================================
     VERIFICAR SE EXTRA ESTÁ DISPONÍVEL
  ========================================================= */

  function horarioExtraDisponivel(item) {
    if (!item) {
      return false;
    }

    return (
      horarioEhExtra(item) &&
      item.bloqueado !== true &&
      item.disponivel !== false &&
      !item.agendamentoId
    );
  }

  /* =========================================================
     ENCONTRAR HORÁRIO
  ========================================================= */

  function encontrarHorario(
    dataISO,
    horario
  ) {
    const horarioNormalizado =
      normalizarHorario(
        horario
      );

    return horariosOcupados.find(
      (item) => {
        if (
          item?.data !== dataISO
        ) {
          return false;
        }

        return (
          normalizarHorario(
            item?.horario
          ) ===
          horarioNormalizado
        );
      }
    );
  }

  /* =========================================================
     VERIFICAR SE HORÁRIO ESTÁ INDISPONÍVEL
  ========================================================= */

  function horarioEstaOcupado(
    dataISO,
    horario
  ) {
    const item =
      encontrarHorario(
        dataISO,
        horario
      );

    if (!item) {
      return false;
    }

    if (
      horarioEhExtra(item)
    ) {
      return !horarioExtraDisponivel(
        item
      );
    }

    if (
      item.bloqueado === true
    ) {
      return true;
    }

    if (
      item.agendamentoId
    ) {
      return true;
    }

    return false;
  }

  /* =========================================================
     IDENTIFICAR EXTRA DA DATA
  ========================================================= */

  function horarioEhExtraDaData(
    dataISO,
    horario
  ) {
    const item =
      encontrarHorario(
        dataISO,
        horario
      );

    return horarioEhExtra(
      item
    );
  }

  /* =========================================================
     OBTER TODOS OS HORÁRIOS DA DATA
  ========================================================= */

  function obterHorariosDaData(
    dataISO
  ) {
    if (!dataISO) {
      return [];
    }

    const horarios = [
      ...horariosDemo,
    ];

    horariosOcupados
      .filter(
        (item) =>
          item?.data ===
            dataISO &&
          item?.horario &&
          horarioEhExtra(item)
      )
      .forEach((item) => {
        const horario =
          normalizarHorario(
            item.horario
          );

        if (!horario) {
          return;
        }

        if (
          !horarios.includes(
            horario
          )
        ) {
          horarios.push(
            horario
          );
        }
      });

    return horarios.sort(
      (a, b) => {
        const [
          horaA,
          minutoA,
        ] = a
          .split(":")
          .map(Number);

        const [
          horaB,
          minutoB,
        ] = b
          .split(":")
          .map(Number);

        return (
          horaA * 60 +
          minutoA -
          (horaB * 60 +
            minutoB)
        );
      }
    );
  }

  /* =========================================================
     HORÁRIOS DISPONÍVEIS
  ========================================================= */

  const horariosDisponiveis =
    useMemo(() => {
      if (
        !dataSelecionada
      ) {
        return [];
      }

      return obterHorariosDaData(
        dataSelecionada
      ).filter(
        (horario) =>
          !horarioEstaOcupado(
            dataSelecionada,
            horario
          )
      );
    }, [
      dataSelecionada,
      horariosOcupados,
    ]);

  /* =========================================================
     VERIFICAR SE DIA ESTÁ BLOQUEADO
  ========================================================= */

  function diaEstaBloqueado(
    dataISO
  ) {
    if (!dataISO) {
      return true;
    }

    return horariosDemo.every(
      (horario) =>
        horarioEstaOcupado(
          dataISO,
          horario
        ) &&
        (() => {
          const item =
            encontrarHorario(
              dataISO,
              horario
            );

          return (
            item?.bloqueado ===
            true
          );
        })()
    );
  }

  /* =========================================================
     VERIFICAR DISPONIBILIDADE DO DIA
  ========================================================= */

  function diaTemDisponibilidade(
    dataISO
  ) {
    if (
      diaEstaBloqueado(
        dataISO
      )
    ) {
      return false;
    }

    return (
      obterHorariosDaData(
        dataISO
      ).some(
        (horario) =>
          !horarioEstaOcupado(
            dataISO,
            horario
          )
      )
    );
  }

  /* =========================================================
     CALENDÁRIO
  ========================================================= */

  const calendario =
    useMemo(() => {
      const primeiroDia =
        new Date(
          anoAtual,
          mesAtual,
          1
        );

      const ultimoDia =
        new Date(
          anoAtual,
          mesAtual + 1,
          0
        );

      const dias = [];

      for (
        let i = 0;
        i <
        primeiroDia.getDay();
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
        const data =
          new Date(
            anoAtual,
            mesAtual,
            dia
          );

        data.setHours(
          0,
          0,
          0,
          0
        );

        const dataISO =
          formatarDataISO(
            data
          );

        dias.push({
          data,
          dataISO,
          dia,
          passado:
            data < hoje,
          hoje:
            dataISO ===
            formatarDataISO(
              hoje
            ),
          disponivel:
            data >= hoje &&
            diaTemDisponibilidade(
              dataISO
            ),
        });
      }

      return dias;
    }, [
      anoAtual,
      mesAtual,
      hoje,
      horariosOcupados,
    ]);

  /* =========================================================
     NAVEGAÇÃO DE MÊS
  ========================================================= */

  function voltarMes() {
    if (
      mesAtual === 0
    ) {
      setMesAtual(11);
      setAnoAtual(
        anoAtual - 1
      );
    } else {
      setMesAtual(
        mesAtual - 1
      );
    }
  }

  function avancarMes() {
    if (
      mesAtual === 11
    ) {
      setMesAtual(0);
      setAnoAtual(
        anoAtual + 1
      );
    } else {
      setMesAtual(
        mesAtual + 1
      );
    }
  }

  /* =========================================================
     SELECIONAR DIA
  ========================================================= */

  function selecionarDia(
    diaInfo
  ) {
    if (
      !diaInfo ||
      diaInfo.passado ||
      !diaInfo.disponivel
    ) {
      return;
    }

    setDataSelecionada(
      diaInfo.dataISO
    );

    setHorarioSelecionado(
      null
    );

    setErro("");
  }

  /* =========================================================
     ENVIO DO AGENDAMENTO
  ========================================================= */

  async function enviarAgendamento(
    event
  ) {
    event.preventDefault();

    setErro("");

    if (
      !dataSelecionada ||
      !horarioSelecionado
    ) {
      setErro(
        "Selecione uma data e um horário."
      );

      return;
    }

    if (!nome.trim()) {
      setErro(
        "Informe seu nome."
      );

      return;
    }

    if (
      !whatsapp.trim()
    ) {
      setErro(
        "Informe seu WhatsApp."
      );

      return;
    }

    if (
      horarioEstaOcupado(
        dataSelecionada,
        horarioSelecionado
      )
    ) {
      setErro(
        "Esse horário não está mais disponível. Escolha outro horário."
      );

      setHorarioSelecionado(
        null
      );

      return;
    }

    setEnviando(true);

    try {
      const data =
        dataSelecionada;

      const horario =
        normalizarHorario(
          horarioSelecionado
        );

      const slotId =
        `${data}_${horario}`;

      const slotRef =
        doc(
          db,
          "horariosOcupados",
          slotId
        );

      const agendamentoRef =
        doc(
          collection(
            db,
            "agendamentos"
          )
        );

      const resultado =
        await runTransaction(
          db,
          async (
            transaction
          ) => {
            const slotSnap =
              await transaction.get(
                slotRef
              );

            const slotExistente =
              slotSnap.exists()
                ? {
                    id: slotSnap.id,
                    ...slotSnap.data(),
                  }
                : null;

            const ehExtra =
              horarioEhExtra(
                slotExistente
              );

            if (ehExtra) {
              if (
                slotExistente.bloqueado ===
                true
              ) {
                throw new Error(
                  "HORARIO_OCUPADO"
                );
              }

              if (
                slotExistente.disponivel ===
                false
              ) {
                throw new Error(
                  "HORARIO_OCUPADO"
                );
              }

              if (
                slotExistente.agendamentoId
              ) {
                throw new Error(
                  "HORARIO_OCUPADO"
                );
              }
            } else {
              if (
                slotExistente
              ) {
                if (
                  slotExistente.bloqueado ===
                  true
                ) {
                  throw new Error(
                    "HORARIO_OCUPADO"
                  );
                }

                if (
                  slotExistente.agendamentoId
                ) {
                  throw new Error(
                    "HORARIO_OCUPADO"
                  );
                }

                throw new Error(
                  "HORARIO_OCUPADO"
                );
              }
            }

            const novoAgendamento = {
              nome:
                nome.trim(),

              whatsapp:
                whatsapp.trim(),

              data,

              horario,

              observacoes:
                observacoes.trim(),

              status:
                "pendente",

              criadoEm:
                serverTimestamp(),
            };

            transaction.set(
              agendamentoRef,
              novoAgendamento
            );

            if (ehExtra) {
              transaction.set(
                slotRef,
                {
                  ...slotExistente,

                  data,

                  horario,

                  agendamentoId:
                    agendamentoRef.id,

                  bloqueado:
                    false,
                },
                {
                  merge: true,
                }
              );
            } else {
              transaction.set(
                slotRef,
                {
                  data,

                  horario,

                  agendamentoId:
                    agendamentoRef.id,

                  criadoEm:
                    serverTimestamp(),
                }
              );
            }

            return {
              id:
                agendamentoRef.id,

              ...novoAgendamento,
            };
          }
        );

      setAgendamentoEnviado(
        resultado
      );

      setHorarioSelecionado(
        null
      );

      setErro("");
    } catch (error) {
      console.error(
        "Erro ao enviar agendamento:",
        error
      );

      if (
        error.message ===
        "HORARIO_OCUPADO"
      ) {
        setErro(
          "Esse horário acabou de ser reservado ou bloqueado. Escolha outro horário."
        );
      } else {
        setErro(
          "Não foi possível enviar seu agendamento. Tente novamente."
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  /* =========================================================
     TELA DE SUCESSO
  ========================================================= */

  if (
    agendamentoEnviado
  ) {
    return (
      <main className="agendamento-page">

        <section className="agendamento-main">

          <div className="agendamento-sucesso">

            <div className="agendamento-sucesso-icon">
              <FiCheck />
            </div>

            <span className="agendamento-eyebrow">
              Solicitação enviada
            </span>

            <h1>
              Seu pedido de agendamento
              <br />
              foi enviado!
            </h1>

            <div className="agendamento-line" />

            <div className="agendamento-resumo-final">

              <div className="agendamento-resumo-item">

                <FiCalendar />

                <div>

                  <span>
                    Data
                  </span>

                  <strong>
                    {formatarDataBonita(
                      agendamentoEnviado.data
                    )}
                  </strong>

                </div>

              </div>

              <div className="agendamento-resumo-item">

                <FiClock />

                <div>

                  <span>
                    Horário
                  </span>

                  <strong>
                    {agendamentoEnviado.horario}
                  </strong>

                </div>

              </div>

            </div>

            <div className="agendamento-confirmacao">

              <FiMessageCircle />

              <div>

                <h2>
                  Aguarde nossa confirmação pelo WhatsApp
                </h2>

                <p>
                  <strong>
                    O agendamento só será confirmado após a
                    confirmação pelo WhatsApp.
                  </strong>
                </p>

                <p>
                  Por lá vamos conversar sobre{" "}
                  <strong>
                    valores, sinal
                  </strong>{" "}
                  e todos os detalhes da sua tatuagem.
                </p>

                <p>
                  Assim que recebermos sua solicitação,
                  entraremos em contato para combinar tudo
                  com você.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="agendamento-continuar"
              onClick={() =>
                navigate("/")
              }
            >
              Voltar para o início
            </button>

          </div>

        </section>

      </main>
    );
  }

  /* =========================================================
     FORMULÁRIO
  ========================================================= */

  return (
    <main className="agendamento-page">

      <section className="agendamento-hero">

        <div className="agendamento-container">

          {/* =================================================
              BOTÃO VOLTAR
          ================================================= */}

          <button
            type="button"
            className="agendamento-voltar"
            onClick={() =>
              navigate(-1)
            }
            aria-label="Voltar para a página anterior"
          >
            <FiArrowLeft />

            <span>
              Voltar
            </span>
          </button>

          {/* =================================================
              CALENDÁRIO
          ================================================= */}

          <div className="agendamento-card">

            <div className="agendamento-card-header">

              <span className="agendamento-label">
                KSA STUDIO
              </span>

              <h1>
                Agendamento
              </h1>

              <p>
                Escolha a melhor data e horário para sua
                tatuagem.
              </p>

            </div>

            <div className="agendamento-hoje">

              <FiCalendar />

              <span>
                Hoje:{" "}
                {formatarDataBonita(
                  formatarDataISO(
                    hoje
                  )
                )}
              </span>

            </div>

            <div className="agendamento-calendar-navigation">

              <button
                type="button"
                className="calendar-arrow"
                onClick={
                  voltarMes
                }
                aria-label="Mês anterior"
              >
                <FiArrowLeft />
              </button>

              <strong>
                {nomesMeses[
                  mesAtual
                ]}{" "}
                {anoAtual}
              </strong>

              <button
                type="button"
                className="calendar-arrow"
                onClick={
                  avancarMes
                }
                aria-label="Próximo mês"
              >
                <FiArrowRight />
              </button>

            </div>

            <div className="agendamento-weekdays">

              {nomesDias.map(
                (dia) => (
                  <span key={dia}>
                    {dia}
                  </span>
                )
              )}

            </div>

            <div className="agendamento-calendar">

              {calendario.map(
                (
                  diaInfo,
                  index
                ) => {

                  if (
                    !diaInfo
                  ) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="calendar-day calendar-day--empty"
                      />
                    );
                  }

                  const selecionado =
                    dataSelecionada ===
                    diaInfo.dataISO;

                  let classe =
                    "calendar-day";

                  if (
                    diaInfo.passado
                  ) {
                    classe +=
                      " calendar-day--past";
                  } else if (
                    !diaInfo.disponivel
                  ) {
                    classe +=
                      " calendar-day--unavailable";
                  } else {
                    classe +=
                      " calendar-day--available";
                  }

                  if (
                    diaInfo.hoje
                  ) {
                    classe +=
                      " calendar-day--today";
                  }

                  if (
                    selecionado
                  ) {
                    classe +=
                      " calendar-day--selected";
                  }

                  return (
                    <button
                      type="button"
                      key={
                        diaInfo.dataISO
                      }
                      className={
                        classe
                      }
                      onClick={() =>
                        selecionarDia(
                          diaInfo
                        )
                      }
                      disabled={
                        diaInfo.passado ||
                        !diaInfo.disponivel
                      }
                    >

                      <span>
                        {
                          diaInfo.dia
                        }
                      </span>

                      {diaInfo.disponivel &&
                        !diaInfo.passado && (
                          <i className="calendar-day-dot" />
                        )}

                    </button>
                  );
                }
              )}

            </div>

            <div className="calendar-legend">

              <span className="legend-item">

                <i className="legend-dot legend-dot--available" />

                Disponível

              </span>

              <span className="legend-item">

                <i className="legend-dot legend-dot--unavailable-day" />

                Indisponível

              </span>

              <span className="legend-item">

                <i className="legend-dot legend-dot--selected" />

                Selecionado

              </span>

            </div>

          </div>

          {/* =================================================
              HORÁRIOS E FORMULÁRIO
          ================================================= */}

          <aside className="agendamento-side">

            {!dataSelecionada ? (

              <div className="agendamento-empty">

                <div className="agendamento-empty-icon">
                  <FiCalendar />
                </div>

                <h2>
                  Escolha uma data
                </h2>

                <p>
                  Selecione um dia no calendário
                  para visualizar os horários
                  disponíveis.
                </p>

              </div>

            ) : (

              <>

                <div className="agendamento-side-header">

                  <span>
                    DATA ESCOLHIDA
                  </span>

                  <h2>
                    {formatarDataBonita(
                      dataSelecionada
                    )}
                  </h2>

                </div>

                <div className="horarios-header">

                  <span>
                    HORÁRIOS
                  </span>

                </div>

                {horariosDisponiveis.length ===
                0 ? (

                  <div className="agendamento-horarios-esgotados">
                    Todos os horários deste dia estão
                    ocupados.
                  </div>

                ) : (

                  <div className="horarios-grid">

                    {obterHorariosDaData(
                      dataSelecionada
                    ).map(
                      (
                        horario
                      ) => {

                        const ocupado =
                          horarioEstaOcupado(
                            dataSelecionada,
                            horario
                          );

                        const extra =
                          horarioEhExtraDaData(
                            dataSelecionada,
                            horario
                          );

                        const selecionado =
                          horarioSelecionado ===
                          horario;

                        return (
                          <button
                            type="button"
                            key={
                              horario
                            }
                            className={`horario-button ${
                              selecionado
                                ? "horario-button--selected"
                                : ""
                            } ${
                              ocupado
                                ? "horario-button--unavailable"
                                : ""
                            }`}
                            onClick={() => {

                              if (
                                !ocupado
                              ) {
                                setHorarioSelecionado(
                                  horario
                                );

                                setErro(
                                  ""
                                );
                              }

                            }}
                            disabled={
                              ocupado
                            }
                          >

                            {horario}

                            {extra &&
                              !ocupado && (
                                <span className="horario-extra-label">
                                  EXTRA
                                </span>
                              )}

                          </button>
                        );
                      }
                    )}

                  </div>
                )}

                {horarioSelecionado && (

                  <div className="agendamento-dados-container">

                    <div className="agendamento-dados-card">

                      <div className="agendamento-dados-header">

                        <span>
                          HORÁRIO SELECIONADO
                        </span>

                        <strong>
                          {
                            horarioSelecionado
                          }
                        </strong>

                      </div>

                      <div className="agendamento-resumo">

                        <div className="agendamento-resumo-item">

                          <FiCalendar />

                          <span>
                            {formatarDataBonita(
                              dataSelecionada
                            )}
                          </span>

                        </div>

                        <div className="agendamento-resumo-item">

                          <FiClock />

                          <span>
                            {
                              horarioSelecionado
                            }
                          </span>

                        </div>

                      </div>

                      <form
                        className="agendamento-form"
                        onSubmit={
                          enviarAgendamento
                        }
                      >

                        <div className="agendamento-form-group">

                          <label htmlFor="nome">
                            Nome
                          </label>

                          <input
                            id="nome"
                            type="text"
                            value={
                              nome
                            }
                            onChange={(
                              event
                            ) =>
                              setNome(
                                event.target.value
                              )
                            }
                            placeholder="Seu nome"
                          />

                        </div>

                        <div className="agendamento-form-group">

                          <label htmlFor="whatsapp">
                            WhatsApp
                          </label>

                          <input
                            id="whatsapp"
                            type="tel"
                            value={
                              whatsapp
                            }
                            onChange={(
                              event
                            ) =>
                              setWhatsapp(
                                event.target.value
                              )
                            }
                            placeholder="(00) 00000-0000"
                          />

                        </div>

                        <div className="agendamento-form-group agendamento-form-group-full">

                          <label htmlFor="observacoes">
                            Observações
                          </label>

                          <textarea
                            id="observacoes"
                            value={
                              observacoes
                            }
                            onChange={(
                              event
                            ) =>
                              setObservacoes(
                                event.target.value
                              )
                            }
                            placeholder="Conte um pouco sobre a tatuagem que deseja..."
                            rows="4"
                          />

                        </div>

                        {erro && (

                          <div className="agendamento-erro">
                            {erro}
                          </div>

                        )}

                        <button
                          type="submit"
                          className="agendamento-enviar"
                          disabled={
                            enviando
                          }
                        >
                          {enviando
                            ? "Enviando..."
                            : "Enviar solicitação"}
                        </button>

                        <p className="agendamento-form-observacao">
                          O envio deste formulário é apenas uma
                          solicitação de agendamento. A confirmação
                          do horário será feita posteriormente pelo
                          WhatsApp, onde também serão combinados os
                          valores e o sinal.
                        </p>

                      </form>

                    </div>

                  </div>

                )}

              </>

            )}

          </aside>

        </div>

      </section>

    </main>
  );
}

export default Agendamento;
