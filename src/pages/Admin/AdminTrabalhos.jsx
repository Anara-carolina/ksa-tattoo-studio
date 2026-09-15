import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaImage,
  FaTimes,
  FaTrash,
  FaEdit,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import "./AdminTrabalhos.css";

const CATEGORIAS = [
  "Blackwork",
  "Old School",
  "Maori",
  "Fine Line",
  "Ornamental",
];

function AdminTrabalhos() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState("");
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [destinos, setDestinos] = useState({
    portfolio: true,
    home: false,
    flash: false,
  });
  const [preco, setPreco] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [trabalhos, setTrabalhos] = useState([]);

  const abrirFormulario = () => {
    setMostrarFormulario(true);
  };

  const fecharFormulario = () => {
    setMostrarFormulario(false);
    limparFormulario();
  };

  const limparFormulario = () => {
    setImagem(null);
    setPreview("");
    setNome("");
    setCategoria("");
    setDestinos({
      portfolio: true,
      home: false,
      flash: false,
    });
    setPreco("");
    setTamanho("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const selecionarImagem = (event) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    setImagem(arquivo);

    const url = URL.createObjectURL(arquivo);
    setPreview(url);
  };

  const alternarDestino = (campo) => {
    setDestinos((anterior) => ({
      ...anterior,
      [campo]: !anterior[campo],
    }));
  };

  const salvarTrabalho = (event) => {
    event.preventDefault();

    if (!imagem || !nome || !categoria) {
      return;
    }

    const novoTrabalho = {
      id: Date.now(),
      nome,
      categoria,
      imagem: preview,
      destinos,
      preco,
      tamanho,
      ativo: true,
    };

    setTrabalhos((anterior) => [novoTrabalho, ...anterior]);

    fecharFormulario();
  };

  const excluirTrabalho = (id) => {
    const confirmar = window.confirm(
      "Deseja realmente excluir este trabalho?"
    );

    if (!confirmar) return;

    setTrabalhos((anterior) =>
      anterior.filter((trabalho) => trabalho.id !== id)
    );
  };

  const alternarVisibilidade = (id) => {
    setTrabalhos((anterior) =>
      anterior.map((trabalho) =>
        trabalho.id === id
          ? { ...trabalho, ativo: !trabalho.ativo }
          : trabalho
      )
    );
  };

  return (
    <main className="admin-trabalhos-page">
      <header className="admin-trabalhos-header">
        <button
          type="button"
          className="admin-voltar"
          onClick={() => navigate("/admin/dashboard")}
        >
          <FaArrowLeft />
          <span>Voltar ao painel</span>
        </button>

        <div className="admin-trabalhos-header-brand">
          <span>KSA STUDIO</span>
          <small>GERENCIAMENTO DE TRABALHOS</small>
        </div>

        <div className="admin-trabalhos-header-space" />
      </header>

      <section className="admin-trabalhos-content">
        <div className="admin-trabalhos-title-area">
          <div>
            <span className="admin-section-label">PORTFÓLIO / CONTEÚDO</span>

            <h1>Trabalhos</h1>

            <p>
              Adicione e organize as imagens que serão utilizadas no site.
            </p>
          </div>

          <button
            type="button"
            className="admin-add-button"
            onClick={abrirFormulario}
          >
            <FaPlus />
            <span>Adicionar imagem</span>
          </button>
        </div>

        {mostrarFormulario && (
          <section className="admin-trabalho-form-card">
            <div className="admin-form-header">
              <div>
                <span>NOVO TRABALHO</span>
                <h2>Adicionar imagem</h2>
              </div>

              <button
                type="button"
                className="admin-close-button"
                onClick={fecharFormulario}
                aria-label="Fechar"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={salvarTrabalho}>
              <div className="admin-form-grid">
                <div className="admin-upload-area">
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={selecionarImagem}
                    hidden
                  />

                  {preview ? (
                    <div className="admin-image-preview">
                      <img src={preview} alt="Pré-visualização" />

                      <button
                        type="button"
                        className="admin-change-image"
                        onClick={() => inputRef.current?.click()}
                      >
                        <FaEdit />
                        Trocar imagem
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="admin-upload-placeholder"
                      onClick={() => inputRef.current?.click()}
                    >
                      <FaImage />

                      <strong>Adicionar imagem</strong>

                      <span>
                        Clique para selecionar uma imagem do computador
                      </span>

                      <small>JPG, PNG ou WEBP</small>
                    </button>
                  )}
                </div>

                <div className="admin-form-fields">
                  <div className="admin-field">
                    <label htmlFor="nome">Nome / identificação</label>

                    <input
                      id="nome"
                      type="text"
                      placeholder="Ex.: Pantera em blackwork"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor="categoria">Categoria</label>

                    <select
                      id="categoria"
                      value={categoria}
                      onChange={(event) => setCategoria(event.target.value)}
                    >
                      <option value="">Selecione uma categoria</option>

                      {CATEGORIAS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Onde essa imagem aparecerá?</label>

                    <div className="admin-destinos">
                      <label className="admin-checkbox">
                        <input
                          type="checkbox"
                          checked={destinos.portfolio}
                          onChange={() => alternarDestino("portfolio")}
                        />

                        <span>Portfólio</span>
                      </label>

                      <label className="admin-checkbox">
                        <input
                          type="checkbox"
                          checked={destinos.home}
                          onChange={() => alternarDestino("home")}
                        />

                        <span>Home</span>
                      </label>

                      <label className="admin-checkbox">
                        <input
                          type="checkbox"
                          checked={destinos.flash}
                          onChange={() => alternarDestino("flash")}
                        />

                        <span>Flash</span>
                      </label>
                    </div>
                  </div>

                  {destinos.flash && (
                    <div className="admin-flash-fields">
                      <div className="admin-field">
                        <label htmlFor="preco">Preço</label>

                        <input
                          id="preco"
                          type="text"
                          placeholder="Ex.: R$ 150"
                          value={preco}
                          onChange={(event) => setPreco(event.target.value)}
                        />
                      </div>

                      <div className="admin-field">
                        <label htmlFor="tamanho">Tamanho</label>

                        <input
                          id="tamanho"
                          type="text"
                          placeholder="Ex.: até 8 cm"
                          value={tamanho}
                          onChange={(event) => setTamanho(event.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={fecharFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-save-button"
                  disabled={!imagem || !nome || !categoria}
                >
                  <FaPlus />
                  Adicionar trabalho
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="admin-lista-section">
          <div className="admin-lista-header">
            <div>
              <span>IMAGENS CADASTRADAS</span>
              <h2>Trabalhos</h2>
            </div>

            <strong>{trabalhos.length} imagens</strong>
          </div>

          {trabalhos.length === 0 ? (
            <div className="admin-empty-state">
              <FaImage />

              <h3>Nenhum trabalho cadastrado</h3>

              <p>
                As imagens adicionadas aparecerão aqui para você organizar.
              </p>

              <button
                type="button"
                onClick={abrirFormulario}
                className="admin-empty-button"
              >
                <FaPlus />
                Adicionar primeira imagem
              </button>
            </div>
          ) : (
            <div className="admin-trabalhos-grid">
              {trabalhos.map((trabalho) => (
                <article
                  key={trabalho.id}
                  className={`admin-trabalho-card ${
                    !trabalho.ativo ? "inativo" : ""
                  }`}
                >
                  <div className="admin-trabalho-image">
                    <img src={trabalho.imagem} alt={trabalho.nome} />

                    {!trabalho.ativo && (
                      <div className="admin-inativo-overlay">
                        <span>OCULTO</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-trabalho-info">
                    <span className="admin-trabalho-categoria">
                      {trabalho.categoria}
                    </span>

                    <h3>{trabalho.nome}</h3>

                    <div className="admin-trabalho-destinos">
                      {trabalho.destinos.portfolio && (
                        <span>Portfólio</span>
                      )}

                      {trabalho.destinos.home && <span>Home</span>}

                      {trabalho.destinos.flash && <span>Flash</span>}
                    </div>

                    {trabalho.destinos.flash &&
                      (trabalho.preco || trabalho.tamanho) && (
                        <div className="admin-trabalho-flash-info">
                          {trabalho.preco && <span>{trabalho.preco}</span>}

                          {trabalho.tamanho && (
                            <span>{trabalho.tamanho}</span>
                          )}
                        </div>
                      )}
                  </div>

                  <div className="admin-trabalho-actions">
                    <button
                      type="button"
                      title={
                        trabalho.ativo
                          ? "Ocultar trabalho"
                          : "Mostrar trabalho"
                      }
                      onClick={() => alternarVisibilidade(trabalho.id)}
                    >
                      {trabalho.ativo ? <FaEye /> : <FaEyeSlash />}
                    </button>

                    <button
                      type="button"
                      title="Editar"
                      onClick={() =>
                        alert(
                          "A edição será conectada ao Firebase na próxima etapa."
                        )
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      title="Excluir"
                      className="delete"
                      onClick={() => excluirTrabalho(trabalho.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminTrabalhos;