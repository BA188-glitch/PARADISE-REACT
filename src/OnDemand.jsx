
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OnDemand.css'

export default function OnDemand() {
  const navigate = useNavigate()
  const [descricao, setDescricao] = useState('')

  function handleCriarSite(e) {
    e.preventDefault()

    if (!descricao.trim()) return

    navigate('/ondemand/projeto', {
      state: { descricao },
    })
  }

  return (
    <main className="ondemand">
      <header className="ondemand-header">
        <button
          className="ondemand-logo"
          onClick={() => navigate('/')}
        >
          PARADISE<span>.</span>
        </button>

        <span className="ondemand-badge">
          AI WEBSITE BUILDER
        </span>

        <button
          className="ondemand-back"
          onClick={() => navigate('/')}
        >
          Voltar ao início
        </button>
      </header>

      <section className="ondemand-hero">
        <div className="ondemand-label">
          <span className="ondemand-dot" />
          SUA IDEIA GANHA VIDA
        </div>

        <h1>
          Seu próximo projeto começa
          <span> com uma ideia.</span>
        </h1>

        <p className="ondemand-subtitle">
          Descreva o site que você imagina. A inteligência artificial
          ajudará a transformar sua ideia em um projeto.
        </p>

        <form
          className="ondemand-prompt"
          onSubmit={handleCriarSite}
        >
          <label htmlFor="descricao-site">
            O que vamos criar hoje?
          </label>

          <textarea
            id="descricao-site"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex.: Quero um site moderno para minha barbearia, com preços, galeria de cortes, localização e agendamento pelo WhatsApp..."
            rows={5}
            maxLength={3000}
          />

          <div className="ondemand-prompt-footer">
            <span>{descricao.length}/3000 caracteres</span>

            <button
              type="submit"
              disabled={!descricao.trim()}
            >
              Criar meu projeto <span>↗</span>
            </button>
          </div>
        </form>

        <div className="ondemand-suggestions">
          <span>Precisa de inspiração?</span>

          {[
            'Site para barbearia',
            'Loja virtual',
            'Portfólio profissional',
            'Site para restaurante',
          ].map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() =>
                setDescricao(
                  `Quero criar ${sugestao.toLowerCase()}, com visual moderno, adaptado para celulares e informações fáceis de atualizar.`
                )
              }
            >
              {sugestao}
            </button>
          ))}
        </div>

        <div className="ondemand-features">
          <div>
            <span>✦</span>
            <p>Criação assistida por IA</p>
          </div>

          <div>
            <span>◈</span>
            <p>Projetos personalizados</p>
          </div>

          <div>
            <span>↗</span>
            <p>Preparado para evoluir</p>
          </div>
        </div>
      </section>

      <footer className="ondemand-footer">
        <span>PARADISE © 2026</span>
        <span>Transformando ideias em projetos.</span>
      </footer>
    </main>
  )
}

