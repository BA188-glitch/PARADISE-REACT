import { useNavigate } from 'react-router-dom'
import './SitesPremium.css'

const modelos = [
{
id: 1,
nome: 'PARADISE BARBER',
categoria: 'BELEZA & ESTILO',
descricao: 'Uma presença digital sofisticada para barbearias modernas.',
preco: 'Sob consulta',
estilo: 'barber',
etiqueta: 'MAIS VERSÁTIL',
},
{
id: 2,
nome: 'PARADISE BEAUTY',
categoria: 'BELEZA & BEM-ESTAR',
descricao: 'Elegância e personalidade para salões e profissionais da beleza.',
preco: 'Sob consulta',
estilo: 'beauty',
etiqueta: 'ELEGANTE',
},
{
id: 3,
nome: 'PARADISE FOOD',
categoria: 'GASTRONOMIA',
descricao: 'Apresente seu cardápio e facilite os pedidos dos clientes.',
preco: 'Sob consulta',
estilo: 'food',
etiqueta: 'COMERCIAL',
},
]

export default function SitesPremium() {
const navigate = useNavigate()

return (
<main className="premium-page">
<header className="premium-header">
<button
className="premium-logo"
onClick={() => navigate('/')}
>
PARADISE<span>.</span>
<small>DIGITAL EXPERIENCE</small>
</button>

    <nav className="premium-nav">
      <button onClick={() => navigate('/')}>
        Início
      </button>
      <a href="#catalogo">Modelos</a>
    </nav>

    <button
      className="premium-account"
      onClick={() => navigate('/login')}
    >
      MINHA CONTA ↗
    </button>
  </header>

  <section className="premium-hero">
    <span className="premium-eyebrow">
      <span /> PARADISE DIGITAL STUDIO
    </span>

    <h1>
      Seu negócio merece
      <span> uma presença extraordinária.</span>
    </h1>

    <p>
      Conheça nossos modelos de sites profissionais.
      Escolha um design, visualize a proposta e transforme
      sua ideia em uma presença digital.
    </p>

    <a className="premium-cta" href="#catalogo">
      EXPLORAR MODELOS <span>↘</span>
    </a>

    <div className="premium-stats">
      <div>
        <strong>DESIGN</strong>
        <span>Visual profissional</span>
      </div>

      <div>
        <strong>RESPONSIVO</strong>
        <span>Celular e computador</span>
      </div>

      <div>
        <strong>PERSONALIZÁVEL</strong>
        <span>Adaptado ao seu negócio</span>
      </div>
    </div>
  </section>

  <section className="premium-catalog" id="catalogo">
    <div className="premium-section-heading">
      <div>
        <span className="premium-eyebrow">
          COLEÇÃO EXCLUSIVA
        </span>

        <h2>Encontre seu próximo site.</h2>
      </div>

      <span className="premium-count">
        {String(modelos.length).padStart(2, '0')} MODELOS
      </span>
    </div>

    <div className="premium-grid">
      {modelos.map((modelo) => (
        <article className="premium-card" key={modelo.id}>
          <div className={`premium-preview ${modelo.estilo}`}>
            <div className="premium-browser">
              <div className="premium-browser-dots">
                <i />
                <i />
                <i />
              </div>

              <span>PRÉVIA DO MODELO</span>
            </div>

            <div className="premium-art">
              {modelo.estilo === 'barber' && (
                <>
                  <span className="art-overline">
                    EST. MMXXVI
                  </span>

                  <h3>
                    THE ART
                    <br />
                    OF GROOMING
                  </h3>

                  <span className="art-line" />

                  <p>STYLE · PRECISION · IDENTITY</p>
                </>
              )}

              {modelo.estilo === 'beauty' && (
                <>
                  <span className="art-overline">
                    BEAUTY STUDIO
                  </span>

                  <h3>
                    Be your
                    <br />
                    <em>own kind.</em>
                  </h3>

                  <span className="art-line" />

                  <p>YOUR BEAUTY, YOUR STORY</p>
                </>
              )}

              {modelo.estilo === 'food' && (
                <>
                  <span className="art-overline">
                    FRESH · LOCAL · AUTHENTIC
                  </span>

                  <h3>
                    GOOD FOOD.
                    <br />
                    GOOD MOOD.
                  </h3>

                  <span className="art-line" />

                  <p>MADE TO BE SHARED</p>
                </>
              )}
            </div>

            <span className="premium-tag">
              {modelo.etiqueta}
            </span>
          </div>

          <div className="premium-card-info">
            <span className="premium-category">
              {modelo.categoria}
            </span>

            <h3>{modelo.nome}</h3>

            <p>{modelo.descricao}</p>

            <div className="premium-card-footer">
              <span>{modelo.preco}</span>

              <div className="premium-card-actions">
                <button
                  className="premium-demo-button"
                  onClick={() =>
                    navigate(`/sites-premium/${modelo.estilo}`)
                  }
                >
                  VER DEMONSTRAÇÃO ↗
                </button>

                <button
                  onClick={() =>
                    navigate('/checkout?produto=' + modelo.estilo, {
                      state: {
                        modelo: modelo.nome,
                      },
                    })
                  }
                >
                  TENHO INTERESSE ↗
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>

  <section className="premium-custom">
    <span className="premium-eyebrow">
      SUA MARCA. SUA IDENTIDADE.
    </span>

    <h2>
      Gostou de um modelo,
      <br />
      mas quer algo exclusivo?
    </h2>

    <p>
      Podemos adaptar cores, textos, imagens e informações
      para aproximar o modelo da identidade do seu negócio.
    </p>

    <button onClick={() => navigate('/login')}>
      CONHECER AS OPÇÕES ↗
    </button>
  </section>

  <footer className="premium-footer">
    <span>PARADISE © 2026</span>
    <span>DESIGNED TO GO BEYOND.</span>
  </footer>
</main>

)
}

