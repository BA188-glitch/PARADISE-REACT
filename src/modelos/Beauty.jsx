import './Beauty.css'

function Beauty() {
const servicos = [
{
nome: 'Cabelo & Styling',
descricao: 'Cortes, escovas e penteados para valorizar sua beleza.',
preco: 'A partir de R$ 80',
numero: '01',
},
{
nome: 'Nail Design',
descricao: 'Unhas cuidadas com acabamento delicado e sofisticado.',
preco: 'A partir de R$ 45',
numero: '02',
},
{
nome: 'Maquiagem',
descricao: 'Produções personalizadas para momentos especiais.',
preco: 'A partir de R$ 120',
numero: '03',
},
{
nome: 'Skin Care',
descricao: 'Cuidados faciais pensados para sua rotina de beleza.',
preco: 'A partir de R$ 90',
numero: '04',
},
]

return (
<><div className="demo-navigation"><a href="/sites-premium">← Voltar à vitrine</a><span>Modelo demonstrativo · sem pedidos ou agendamentos reais</span></div><main className="beauty-site">
<header className="beauty-header">
<a className="beauty-logo" href="#beauty-inicio">
PARADISE
<span>BEAUTY STUDIO</span>
</a>

    <nav className="beauty-nav">
      <a href="#beauty-inicio">Início</a>
      <a href="#beauty-servicos">Serviços</a>
      <a href="#beauty-sobre">O espaço</a>
      <a href="#beauty-galeria">Galeria</a>
      <a href="#beauty-contato">Contato</a>
    </nav>

    <a className="beauty-header-cta" href="#beauty-contato">
      AGENDAR HORÁRIO ↗
    </a>
  </header>

  <section className="beauty-hero" id="beauty-inicio">
    <div className="beauty-hero-content">
      <span className="beauty-eyebrow">
        SUA BELEZA, SUA ESSÊNCIA
      </span>

      <h1>
        A beleza de
        <br />
        ser <em>você.</em>
      </h1>

      <p>
        Um momento só seu. Descubra uma experiência de beleza
        pensada para valorizar sua essência, sua confiança e
        sua individualidade.
      </p>

      <div className="beauty-hero-actions">
        <a className="beauty-button-primary" href="#beauty-contato">
          DESCUBRA SUA EXPERIÊNCIA ↗
        </a>

        <a className="beauty-button-secondary" href="#beauty-servicos">
          Explorar serviços
        </a>
      </div>

      <div className="beauty-hero-note">
        <span>01</span>
        <div>
          <strong>SEU MOMENTO DE CUIDADO</strong>
          <small>Beleza que começa em você.</small>
        </div>
      </div>
    </div>

    <div className="beauty-hero-visual">
      <div className="beauty-image-frame">
        <div className="beauty-image-placeholder">
          <span>PB</span>
          <small>BEAUTY IS AN EXPERIENCE</small>
        </div>
        <div className="beauty-image-caption">
          <span>THE BEAUTY EDIT</span>
          <span>COLLECTION Nº 01</span>
        </div>
      </div>

      <div className="beauty-floating-note">
        <span>✳</span>
        <p>
          <strong>Beleza autêntica.</strong>
          <small>Do seu jeito.</small>
        </p>
      </div>
    </div>

    <span className="beauty-hero-side-text">
      BEAUTY · CARE · CONFIDENCE
    </span>
  </section>

  <section className="beauty-intro">
    <span className="beauty-eyebrow">UM CONVITE PARA VOCÊ</span>

    <h2>
      Cuidar de si é uma forma
      <br />
      de <em>florescer.</em>
    </h2>

    <p>
      Mais do que serviços de beleza, criamos experiências
      que celebram quem você é. Cada detalhe é pensado para
      você se sentir bem, por dentro e por fora.
    </p>
  </section>

  <section className="beauty-services" id="beauty-servicos">
    <div className="beauty-section-heading">
      <div>
        <span className="beauty-eyebrow">NOSSO UNIVERSO</span>
        <h2>Seu ritual de <em>beleza.</em></h2>
      </div>

      <p>
        Cuidados personalizados para acompanhar você em
        todos os momentos.
      </p>
    </div>

    <div className="beauty-service-grid">
      {servicos.map((servico) => (
        <article className="beauty-service-card" key={servico.numero}>
          <span className="beauty-service-number">
            {servico.numero}
          </span>

          <div className="beauty-service-symbol">
            {servico.numero === '01' && '✳'}
            {servico.numero === '02' && '◇'}
            {servico.numero === '03' && '✧'}
            {servico.numero === '04' && '❋'}
          </div>

          <h3>{servico.nome}</h3>

          <p>{servico.descricao}</p>

          <div className="beauty-service-footer">
            <span>{servico.preco}</span>
            <a
              href="#beauty-contato"
              aria-label={`Consultar ${servico.nome}`}
            >
              ↗
            </a>
          </div>
        </article>
      ))}
    </div>

    <p className="beauty-demo-note">
      MODELO DEMONSTRATIVO · SERVIÇOS E PREÇOS EDITÁVEIS
    </p>
  </section>

  <section className="beauty-about" id="beauty-sobre">
    <div className="beauty-about-visual">
      <div className="beauty-about-monogram">P<span>.</span></div>
      <span>UM ESPAÇO PARA FLORESCER</span>
    </div>

    <div className="beauty-about-content">
      <span className="beauty-eyebrow">SOBRE O ESPAÇO</span>

      <h2>
        Seu tempo.
        <br />
        Seu cuidado.
        <br />
        <em>Sua essência.</em>
      </h2>

      <p>
        A PARADISE BEAUTY nasce da ideia de que beleza e
        bem-estar caminham juntos. Um ambiente acolhedor,
        serviços personalizados e atenção aos detalhes
        transformam cada visita em um momento especial.
      </p>

      <a className="beauty-text-link" href="#beauty-contato">
        CONHEÇA NOSSA PROPOSTA ↗
      </a>
    </div>
  </section>

  <section className="beauty-gallery" id="beauty-galeria">
    <div className="beauty-section-heading">
      <div>
        <span className="beauty-eyebrow">INSPIRAÇÃO</span>
        <h2>Detalhes que <em>encantam.</em></h2>
      </div>

      <p>
        Uma prévia da identidade visual do seu futuro espaço.
      </p>
    </div>

    <div className="beauty-gallery-grid">
      <div className="beauty-gallery-item beauty-gallery-one">
        <span>01 / HAIR</span>
        <strong>Seu estilo,<br />sua assinatura.</strong>
      </div>

      <div className="beauty-gallery-item beauty-gallery-two">
        <span>02 / NAILS</span>
        <strong>Delicadeza<br />nos detalhes.</strong>
      </div>

      <div className="beauty-gallery-item beauty-gallery-three">
        <span>03 / CARE</span>
        <strong>Um ritual<br />só seu.</strong>
      </div>
    </div>

    <p className="beauty-demo-note">
      ESPAÇOS VISUAIS ILUSTRATIVOS · SUBSTITUIR POR FOTOS REAIS
    </p>
  </section>

  <section className="beauty-contact" id="beauty-contato">
    <span className="beauty-eyebrow">SEU MOMENTO COMEÇA AQUI</span>

    <h2>
      Você merece
      <br />
      esse <em>momento.</em>
    </h2>

    <p>
      Entre em contato para conhecer os serviços e consultar
      horários disponíveis.
    </p>

    <a className="beauty-button-primary" href="/ondemand">
      PERSONALIZAR ESTE MODELO ↗
    </a>

    <small>
      Contato ilustrativo. Personalize com os dados do estabelecimento.
    </small>
  </section>

  <footer className="beauty-footer">
    <a className="beauty-logo" href="#beauty-inicio">
      PARADISE
      <span>BEAUTY STUDIO</span>
    </a>

    <p>BELEZA QUE CELEBRA QUEM VOCÊ É.</p>

    <span>PARADISE © 2026</span>
  </footer>
</main></>

)
}

export default Beauty