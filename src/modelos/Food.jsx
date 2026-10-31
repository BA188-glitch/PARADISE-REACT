import './Food.css'

function Food() {
const categorias = ['Todos', 'Pratos principais', 'Hambúrgueres', 'Bebidas']

const produtos = [
{
nome: 'Burger Paradise',
categoria: 'Hambúrgueres',
descricao: 'Blend artesanal, queijo, alface e molho especial.',
preco: 'R$ 32,90',
numero: '01',
simbolo: '🍔',
},
{
nome: 'Parmegiana da Casa',
categoria: 'Pratos principais',
descricao: 'Filé empanado, molho artesanal e queijo gratinado.',
preco: 'R$ 42,90',
numero: '02',
simbolo: '🍝',
},
{
nome: 'Batata Crocante',
categoria: 'Pratos principais',
descricao: 'Batatas douradas com tempero especial.',
preco: 'R$ 18,90',
numero: '03',
simbolo: '🍟',
},
{
nome: 'Limonada Fresh',
categoria: 'Bebidas',
descricao: 'Limonada refrescante preparada na hora.',
preco: 'R$ 9,90',
numero: '04',
simbolo: '🍋',
},
]

return (
<><div className="demo-navigation"><a href="/sites-premium">← Voltar à vitrine</a><span>Modelo demonstrativo · sem pedidos ou agendamentos reais</span></div><main className="food-site">
<header className="food-header">
<a className="food-logo" href="#food-inicio">
PARADISE<span>FOOD & CO.</span>
</a>

    <nav className="food-nav">
      <a href="#food-inicio">Início</a>
      <a href="#food-cardapio">Cardápio</a>
      <a href="#food-sobre">Nossa história</a>
      <a href="#food-contato">Contato</a>
    </nav>

    <a className="food-header-cta" href="#food-cardapio">
      VER CARDÁPIO ↗
    </a>
  </header>

  <section className="food-hero" id="food-inicio">
    <div className="food-hero-content">
      <span className="food-eyebrow">
        SABOR QUE SURPREENDE
      </span>

      <h1>
        Bom de
        <br />
        verdade.
        <br />
        <em>Feito com sabor.</em>
      </h1>

      <p>
        Ingredientes selecionados, combinações especiais
        e aquele sabor que transforma qualquer refeição
        em um momento memorável.
      </p>

      <div className="food-hero-actions">
        <a className="food-button-primary" href="#food-cardapio">
          EXPLORAR CARDÁPIO ↗
        </a>

        <a className="food-button-secondary" href="#food-sobre">
          Conheça a proposta
        </a>
      </div>

      <div className="food-hero-note">
        <span>✳</span>
        <div>
          <strong>FEITO PARA COMPARTILHAR</strong>
          <small>Seu próximo favorito está aqui.</small>
        </div>
      </div>
    </div>

    <div className="food-hero-visual">
      <div className="food-hero-art">
        <span className="food-art-label">THE SIGNATURE COLLECTION</span>
        <div className="food-art-circle">
          <span>GOOD</span>
          <strong>FOOD.</strong>
          <span>GOOD MOOD.</span>
        </div>
        <span className="food-art-bottom">FRESH · FLAVOR · EXPERIENCE</span>
      </div>

      <div className="food-floating-card">
        <span>✦</span>
        <div>
          <strong>Feito com carinho</strong>
          <small>Sabor em cada detalhe.</small>
        </div>
      </div>
    </div>
  </section>

  <section className="food-intro">
    <span className="food-eyebrow">NOSSA FILOSOFIA</span>
    <h2>
      Mais sabor.
      <br />
      Mais <em>momentos.</em>
    </h2>
    <p>
      Acreditamos que boa comida vai além do prato.
      Ela reúne pessoas, cria memórias e deixa qualquer
      encontro ainda mais especial.
    </p>
  </section>

  <section className="food-menu" id="food-cardapio">
    <div className="food-section-heading">
      <div>
        <span className="food-eyebrow">ESCOLHAS DA CASA</span>
        <h2>Nosso <em>cardápio.</em></h2>
      </div>

      <span className="food-menu-count">
        {String(produtos.length).padStart(2, '0')} ITENS
      </span>
    </div>

    <div className="food-category-list">
      {categorias.map((categoria) => (
        <span className="food-category" key={categoria}>
          {categoria}
        </span>
      ))}
    </div>

    <div className="food-product-grid">
      {produtos.map((produto) => (
        <article className="food-product-card" key={produto.numero}>
          <div className={`food-product-art food-product-art-${produto.numero}`}>
            <span className="food-product-number">
              {produto.numero}
            </span>
            <span className="food-product-symbol">
              {produto.simbolo}
            </span>
            <span className="food-product-category">
              {produto.categoria}
            </span>
          </div>

          <div className="food-product-info">
            <h3>{produto.nome}</h3>
            <p>{produto.descricao}</p>

            <div className="food-product-footer">
              <strong>{produto.preco}</strong>
              <a
                href="#food-contato"
                aria-label={`Consultar pedido de ${produto.nome}`}
              >
                ↗
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>

    <p className="food-demo-note">
      CARDÁPIO DEMONSTRATIVO · ITENS E PREÇOS EDITÁVEIS
    </p>
  </section>

  <section className="food-about" id="food-sobre">
    <div className="food-about-art">
      <span>PARADISE</span>
      <strong>GOOD<br />FOOD.</strong>
      <small>MADE TO BE SHARED</small>
    </div>

    <div className="food-about-content">
      <span className="food-eyebrow">A EXPERIÊNCIA</span>
      <h2>
        Cada prato
        <br />
        conta uma
        <br />
        <em>história.</em>
      </h2>
      <p>
        Uma proposta gastronômica que valoriza o sabor,
        a apresentação e a experiência de cada cliente.
        Um espaço para reunir amigos, família e bons momentos.
      </p>
      <a className="food-text-link" href="#food-cardapio">
        EXPLORAR NOSSO CARDÁPIO ↗
      </a>
    </div>
  </section>

  <section className="food-contact" id="food-contato">
    <span className="food-eyebrow">VAMOS MATAR A FOME?</span>
    <h2>
      Seu próximo
      <br />
      favorito está <em>aqui.</em>
    </h2>
    <p>
      Entre em contato para consultar o cardápio,
      fazer seu pedido ou conhecer nosso espaço.
    </p>
    <a className="food-button-primary" href="/ondemand">
      PERSONALIZAR ESTE MODELO ↗
    </a>
    <small>
      Contato ilustrativo. Configure o canal de pedidos antes de publicar.
    </small>
  </section>

  <footer className="food-footer">
    <a className="food-logo" href="#food-inicio">
      PARADISE<span>FOOD & CO.</span>
    </a>
    <p>BOM DE VERDADE. FEITO COM SABOR.</p>
    <span>PARADISE © 2026</span>
  </footer>
</main></>

)
}

export default Food