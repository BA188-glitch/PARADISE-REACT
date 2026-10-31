import './Barber.css'

function Barber() {
const servicos = [
{ nome: 'Corte masculino', descricao: 'Estilo clássico ou moderno, do seu jeito.', preco: 'R$ 40' },
{ nome: 'Barba', descricao: 'Acabamento preciso e cuidado completo.', preco: 'R$ 30' },
{ nome: 'Corte + barba', descricao: 'A combinação perfeita para renovar o visual.', preco: 'R$ 60' },
]

return ( <><div className="demo-navigation"><a href="/sites-premium">← Voltar à vitrine</a><span>Modelo demonstrativo · sem pedidos ou agendamentos reais</span></div><main className="barber-site"> <header className="barber-header"> <a className="barber-logo" href="#inicio">
BARBER<span>STUDIO</span> </a>

```
    <nav className="barber-nav">
      <a href="#inicio">Início</a>
      <a href="#servicos">Serviços</a>
      <a href="#sobre">Sobre</a>
      <a href="#contato">Contato</a>
    </nav>

    <a className="barber-header-button" href="#contato">
      Agendar horário ↗
    </a>
  </header>

  <section className="barber-hero" id="inicio">
    <div className="barber-hero-content">
      <span className="barber-eyebrow">✦ ESTILO • PRECISÃO • PERSONALIDADE</span>

      <h1>
        SEU ESTILO.
        <br />
        SUAS <span>REGRAS.</span>
      </h1>

      <p>
        Mais do que um corte, uma experiência feita para destacar
        quem você é.
      </p>

      <div className="barber-hero-actions">
        <a className="barber-button-primary" href="#contato">
          Agendar meu horário ↗
        </a>
        <a className="barber-button-secondary" href="#servicos">
          Conhecer serviços
        </a>
      </div>

      <div className="barber-rating">
        <span>★★★★★</span>
        <p>SEU PRÓXIMO VISUAL COMEÇA AQUI</p>
      </div>
    </div>

    <div className="barber-hero-visual">
      <div className="barber-visual-frame">
        <div className="barber-visual-circle">BS</div>
        <span className="barber-visual-top">BARBER STUDIO</span>
        <span className="barber-visual-bottom">EST. 2026</span>
      </div>
      <div className="barber-floating-card">
        <span>✦</span>
        <div>
          <strong>Seu melhor estilo</strong>
          <small>Começa nos detalhes.</small>
        </div>
      </div>
    </div>

    <div className="barber-hero-number">01 / 03</div>
  </section>

  <section className="barber-services" id="servicos">
    <div className="barber-section-heading">
      <div>
        <span className="barber-eyebrow">NOSSO TRABALHO</span>
        <h2>Serviços em <span>destaque.</span></h2>
      </div>
      <p>
        Cuidado, técnica e personalidade em cada detalhe.
      </p>
    </div>

    <div className="barber-service-grid">
      {servicos.map((servico, index) => (
        <article className="barber-service-card" key={servico.nome}>
          <span className="barber-service-number">0{index + 1}</span>
          <div className="barber-service-icon">
            {index === 0 ? '✂' : index === 1 ? '◈' : '✦'}
          </div>
          <h3>{servico.nome}</h3>
          <p>{servico.descricao}</p>
          <div className="barber-service-footer">
            <strong>{servico.preco}</strong>
            <a href="#contato" aria-label={`Agendar ${servico.nome}`}>
              ↗
            </a>
          </div>
        </article>
      ))}
    </div>

    <p className="barber-demo-note">
      MODELO DEMONSTRATIVO — SERVIÇOS E PREÇOS EDITÁVEIS
    </p>
  </section>

  <section className="barber-about" id="sobre">
    <div className="barber-about-mark">BS<span>.</span></div>
    <div>
      <span className="barber-eyebrow">A EXPERIÊNCIA</span>
      <h2>Não é só cortar.<br />É <span>marcar presença.</span></h2>
      <p>
        Um espaço pensado para quem valoriza o próprio estilo.
        Atendimento personalizado, atenção aos detalhes e um visual
        que combina com você.
      </p>
    </div>
  </section>

  <section className="barber-contact" id="contato">
    <span className="barber-eyebrow">SEU PRÓXIMO VISUAL</span>
    <h2>Vamos renovar<br />seu <span>estilo?</span></h2>
    <p>
      Entre em contato e escolha o melhor horário para você.
    </p>
    <a className="barber-button-primary" href="/ondemand">
      Personalizar este modelo ↗
    </a>
    <small>Contato ilustrativo — será personalizado para cada cliente.</small>
  </section>

  <footer className="barber-footer">
    <a className="barber-logo" href="#inicio">
      BARBER<span>STUDIO</span>
    </a>
    <p>ESTILO FEITO PARA VOCÊ.</p>
    <span>DEMO CRIADA POR PARADISE © 2026</span>
  </footer>
</main></>

)
}

export default Barber
