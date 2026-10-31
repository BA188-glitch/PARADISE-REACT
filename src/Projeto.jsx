import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Projeto.css'

export default function Projeto() {
  const navigate = useNavigate()
  const location = useLocation()

  const descricaoInicial = location.state?.descricao || ''
  const [mensagem, setMensagem] = useState('')
  const [historico, setHistorico] = useState([])

  function enviarMensagem(e) {
    e.preventDefault()

    if (!mensagem.trim()) return

    setHistorico((anterior) => [
      ...anterior,
      {
        id: Date.now(),
        texto: mensagem.trim(),
      },
    ])

    setMensagem('')
  }

  return (
    <main className="projeto-page">
      <header className="projeto-header">
        <button
          className="projeto-logo"
          onClick={() => navigate('/')}
        >
          PARADISE<span>.</span>
        </button>

        <div className="projeto-status">
          <span className="projeto-status-dot" />
          Área de criação
        </div>

        <button
          className="projeto-voltar"
          onClick={() => navigate('/ondemand')}
        >
          Voltar
        </button>
      </header>

      <div className="projeto-workspace">
        <aside className="projeto-sidebar">
          <span className="projeto-label">SEU PROJETO</span>

          <h2>Meu novo site</h2>

          <div className="projeto-descricao">
            <span>DESCRIÇÃO INICIAL</span>
            <p>
              {descricaoInicial ||
                'Você ainda não descreveu seu projeto.'}
            </p>
          </div>

          <div className="projeto-nota">
            <span>✦</span>
            <p>
              Esta área será conectada à inteligência artificial
              para gerar e editar seu site.
            </p>
          </div>

          <button
            className="projeto-novo"
            onClick={() => navigate('/ondemand')}
          >
            + Novo projeto
          </button>
        </aside>

        <section className="projeto-main">
          <div className="projeto-main-header">
            <div>
              <span className="projeto-label">
                PARADISE ON-DEMAND
              </span>
              <h1>Área de criação</h1>
            </div>

            <span className="projeto-em-desenvolvimento">
              PROTÓTIPO
            </span>
          </div>

          <div className="projeto-preview">
            <div className="projeto-preview-toolbar">
              <div className="projeto-browser-dots">
                <i />
                <i />
                <i />
              </div>

              <div className="projeto-preview-address">
                Pré-visualização do projeto
              </div>
            </div>

            <div className="projeto-preview-content">
              <div className="projeto-preview-icon">✦</div>

              <h2>Seu próximo projeto começa aqui.</h2>

              <p>
                A pré-visualização do site aparecerá nesta área
                quando a geração real estiver implementada.
              </p>

              <div className="projeto-preview-prompt">
                <span>IDEIA DO PROJETO</span>
                <p>
                  {descricaoInicial ||
                    'Descreva o site que deseja criar.'}
                </p>
              </div>
            </div>
          </div>

          <section className="projeto-chat">
            <div className="projeto-chat-heading">
              <div>
                <h2>Converse sobre seu projeto</h2>
                <p>
                  Prepare suas instruções para as próximas etapas.
                </p>
              </div>

              <span>IA · EM BREVE</span>
            </div>

            <div className="projeto-chat-messages">
              {historico.length === 0 ? (
                <div className="projeto-chat-empty">
                  <span>✧</span>
                  <p>
                    Quer mudar alguma coisa? Escreva sua ideia
                    abaixo. Por enquanto, as mensagens não alteram
                    o site automaticamente.
                  </p>
                </div>
              ) : (
                historico.map((item) => (
                  <div
                    className="projeto-chat-message"
                    key={item.id}
                  >
                    {item.texto}
                  </div>
                ))
              )}
            </div>

            <form
              className="projeto-chat-form"
              onSubmit={enviarMensagem}
            >
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Ex.: adicione uma seção de contato..."
                rows={2}
                aria-label="Instrução para o projeto"
              />

              <button
                type="submit"
                disabled={!mensagem.trim()}
              >
                Enviar ↗
              </button>
            </form>
          </section>
        </section>
      </div>
    </main>
  )
}

