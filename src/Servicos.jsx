import { useNavigate } from 'react-router-dom'
import './Servicos.css'

export default function Servicos() {
const navigate = useNavigate()

return (
<main className="servicos-page">
<header className="servicos-header">
<a href="/" className="servicos-logo">
PARADISE<span>.</span>
</a>

    <button
      className="servicos-voltar"
      onClick={() => navigate('/')}
    >
      ← Início
    </button>
  </header>

  <section className="servicos-hero">
    <span className="servicos-eyebrow">
      YOUR DIGITAL UNIVERSE
    </span>

    <h1>
      Transformamos ideias
      <br />
      em <span>experiências digitais.</span>
    </h1>

    <p>
      Soluções digitais pensadas para destacar seu negócio,
      fortalecer sua marca e criar novas possibilidades.
    </p>
  </section>

  <section className="servicos-lista">
    <article className="servico-card">
      <span className="servico-numero">01 / DEVELOPMENT</span>
      <div className="servico-icone">⌘</div>

      <h2>Desenvolvimento de sites</h2>

      <p>
        Sites modernos para empresas, profissionais e pequenos
        negócios que querem construir sua presença digital.
      </p>

      <button onClick={() => navigate('/ondemand')}>
        Solicitar um projeto <span>↗</span>
      </button>
    </article>

    <article className="servico-card">
      <span className="servico-numero">02 / DESIGN</span>
      <div className="servico-icone">✳</div>

      <h2>Personalização e identidade visual</h2>

      <p>
        Cores, tipografia, layout e elementos visuais alinhados
        à personalidade e aos objetivos da sua marca.
      </p>

      <button onClick={() => navigate('/ondemand')}>
        Personalizar meu site <span>↗</span>
      </button>
    </article>
  </section>

  <footer className="servicos-footer">
    <span>PARADISE®</span>
    <span>BUILT BEYOND THE ORDINARY.</span>
  </footer>
</main>

)
}