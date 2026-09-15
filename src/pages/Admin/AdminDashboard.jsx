
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
  FaSignOutAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaFileMedical,
  FaUsers,
  FaMoneyBillWave,
  FaBoxOpen,
  FaImage,
} from "react-icons/fa";

import { auth, db } from "../../lib/firebase";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  const [
    quantidadeAgendamentos,
    setQuantidadeAgendamentos,
  ] = useState(0);

  const [
    quantidadeAnamneses,
    setQuantidadeAnamneses,
  ] = useState(0);

  /* =========================================================
     VERIFICAR USUÁRIO LOGADO
  ========================================================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUsuario(user);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     CONTAR AGENDAMENTOS EM TEMPO REAL
  ========================================================= */

  useEffect(() => {
    const agendamentosRef = collection(
      db,
      "agendamentos"
    );

    const unsubscribe = onSnapshot(
      agendamentosRef,
      (snapshot) => {
        setQuantidadeAgendamentos(
          snapshot.size
        );
      },
      (error) => {
        console.error(
          "Erro ao contar agendamentos:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     CONTAR ANAMNESES EM TEMPO REAL
  ========================================================= */

  useEffect(() => {
    const anamnesesRef = collection(
      db,
      "anamneses"
    );

    const unsubscribe = onSnapshot(
      anamnesesRef,
      (snapshot) => {
        setQuantidadeAnamneses(
          snapshot.size
        );
      },
      (error) => {
        console.error(
          "Erro ao contar anamneses:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/admin");
    } catch (error) {
      console.error(
        "Erro ao sair:",
        error
      );
    }
  };

  /* =========================================================
     MÓDULOS
  ========================================================= */

  const modulos = [
    {
      titulo: "Contatos",
      descricao: "Mensagens e pedidos de orçamento",
      icon: <FaEnvelope />,
      numero: "00",
    },

    {
      titulo: "Agenda",
      descricao: "Agenda inteligente e horários",
      icon: <FaCalendarAlt />,
      numero: String(
        quantidadeAgendamentos
      ).padStart(2, "0"),
      rota: "/admin/agendamento",
    },

    {
      titulo: "Anamneses",
      descricao: "Formulários dos clientes",
      icon: <FaFileMedical />,
      numero: String(
        quantidadeAnamneses
      ).padStart(2, "0"),
      rota: "/admin/anamneses",
    },

    {
      titulo: "CRM",
      descricao: "Clientes, histórico e relacionamento",
      icon: <FaUsers />,
      numero: "00",
      rota: "/admin/crm",
    },

    {
      titulo: "Caixa",
      descricao: "Entradas e saídas",
      icon: <FaMoneyBillWave />,
      numero: "R$ 0",
    },

    {
      titulo: "Estoque",
      descricao: "Materiais e produtos",
      icon: <FaBoxOpen />,
      numero: "00",
    },

    {
      titulo: "Trabalhos",
      descricao: "Tatuagens realizadas",
      icon: <FaImage />,
      numero: "00",
      rota: "/admin/trabalhos",
    },
  ];

  /* =========================================================
     DASHBOARD
  ========================================================= */

  return (
    <main className="admin-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="admin-dashboard-header">

        <div className="admin-dashboard-brand">

          <span>
            KSA STUDIO
          </span>

          <small>
            PAINEL ADMINISTRATIVO
          </small>

        </div>

        <div className="admin-dashboard-user">

          {usuario?.photoURL && (
            <img
              src={usuario.photoURL}
              alt=""
            />
          )}

          <div>

            <strong>
              {usuario?.displayName ||
                "Administrador"}
            </strong>

            <span>
              {usuario?.email}
            </span>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
          >
            <FaSignOutAlt />
          </button>

        </div>

      </header>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <section className="admin-dashboard-content">

        {/* ===================================================
            INTRO
        =================================================== */}

        <div className="admin-dashboard-intro">

          <div>

            <span>
              VISÃO GERAL
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Gerencie o KSA Studio em um único lugar.
            </p>

          </div>

          <div className="admin-dashboard-date">

            KSA STUDIO

            <small>
              2026
            </small>

          </div>

        </div>

        {/* ===================================================
            RESUMO
        =================================================== */}

        <div className="admin-dashboard-summary">

          <div>

            <span>
              CONTATOS
            </span>

            <strong>
              00
            </strong>

          </div>

          <div>

            <span>
              AGENDA
            </span>

            <strong>
              {String(
                quantidadeAgendamentos
              ).padStart(2, "0")}
            </strong>

          </div>

          <div>

            <span>
              ANAMNESES
            </span>

            <strong>
              {String(
                quantidadeAnamneses
              ).padStart(2, "0")}
            </strong>

          </div>

          <div>

            <span>
              CAIXA
            </span>

            <strong>
              R$ 0
            </strong>

          </div>

        </div>

        {/* ===================================================
            MÓDULOS
        =================================================== */}

        <div className="admin-dashboard-section-title">

          <span>
            GERENCIAMENTO
          </span>

          <h2>
            Módulos
          </h2>

        </div>

        <div className="admin-dashboard-modules">

          {modulos.map((modulo) => (

            <button
              type="button"
              className="admin-module-card"
              key={modulo.titulo}
              onClick={() => {

                if (modulo.rota) {
                  navigate(modulo.rota);
                }

              }}
            >

              <div className="admin-module-icon">
                {modulo.icon}
              </div>

              <div className="admin-module-content">

                <span>
                  {modulo.titulo}
                </span>

                <small>
                  {modulo.descricao}
                </small>

              </div>

              <strong>
                {modulo.numero}
              </strong>

            </button>

          ))}

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;