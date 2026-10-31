import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, lazy, Suspense } from 'react'
import { ManagedSections } from './StoreContext'
const Admin = lazy(() => import('./Admin'))
import { supabase } from './supabase'
import Login from './Login'
import Commerce from './Commerce'
import './App.css'
import SitesPremium from './SitesPremium'
import Barber from './modelos/Barber'
import Beauty from './modelos/Beauty'
import Food from './modelos/Food'
import ParadiseBackground from './ParadiseBackground'
import OnDemand from './OnDemand'
import Servicos from './Servicos.jsx'


function Home() {
  const navigate = useNavigate()

  return (
    <main className="paradise">
      <ParadiseBackground />

      <header className="navbar">
        <a href="#inicio" className="brand">
          <span>PARADISE</span>
          <small>DIGITAL EXPERIENCE</small>
        </a>

        <nav>
          <a href="#inicio">Início</a>
          <a href="/sites-premium">Vitrine</a>

          <a href="#sobre">Sobre</a>
          <a href="/servicos">Serviços</a>
          <a href="/ondemand">On-Demand</a>
          <a href="/checkout" className="cart-link">
            <span>Checkout</span>
          </a>
        </nav>

        <button className="account-button" onClick={() => navigate('/minha-conta')}>
          MINHA CONTA <span>↗</span>
        </button>
      </header>

      <ManagedSections page="home"><section className="hero-section" id="inicio">
        <div className="hero-content">
          <div className="status">
            <span className="status-dot"></span>
            A NEW DIGITAL EXPERIENCE
          </div>

          <h1>
            YOUR WORLD.
            <br />
            YOUR <span>PARADISE.</span>
          </h1>

          <p>
            Mais do que uma experiência digital.
            <br />
            Um universo criado para sair do comum.
          </p>

          <div className="hero-actions">
            <a href="#universo" className="primary-button">
              EXPLORAR UNIVERSO <span>↗</span>
            </a>
            <a href="#sobre" className="secondary-button">
              DESCOBRIR MAIS
            </a>
          </div>

          <div className="hero-footer">
            <span>INDEPENDENT BY DESIGN</span>
            <span>EST. PARADISE®</span>
          </div>
        </div>

        <div className="aura-visual" aria-label="Visual abstrato roxo">
          <div className="aura-ring ring-one"></div>
          <div className="aura-ring ring-two"></div>
          <div className="aura-core"><span>P</span></div>
          <div className="visual-label label-top">THE WORLD IS YOUR</div>
          <div className="visual-label label-bottom">BEYOND ORDINARY</div>
        </div>

        <div className="vertical-label">PARADISE DIGITAL UNIVERSE</div>
      </section>

      <section className="intro-section" id="universo">
        <span className="section-index">A tecnologia nas suas mãos</span>

        <div>
          <h2>
            NÃO SIGA O PADRÃO.
            <br />
            <span>CRIE O SEU UNIVERSO.</span>
          </h2>
          <p>
            Transforme sua IDENTIDADE digital AQUI.
            Explore o universo PARADISE.
          </p>
        </div>

        <a href="#sobre" className="round-link" aria-label="Saiba mais">↘</a>
      </section>

      </ManagedSections><footer className="site-footer" id="sobre">
        <a href="#inicio" className="footer-brand">PARADISE®</a>
        <span>BUILT BEYOND THE ORDINARY.</span><a href="/admin">Administração</a>
      </footer>
    </main>
  )
}

function RecuperarSenha() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function recuperar(event) {
    event.preventDefault()
    setMensagem('')
    setCarregando(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/redefinir-senha` }
      )

      if (error) throw error

      setMensagem(
        'Se houver uma conta associada a esse e-mail, enviaremos as instruções. Confira também o spam.'
      )
    } catch (error) {
      console.error('Erro na recuperação:', error)
      setMensagem('Não foi possível enviar o e-mail. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <a href="/" className="login-brand">
        PARA<span>DISE</span><small>DIGITAL EXPERIENCE</small>
      </a>

      <section className="login-card">
        <span className="login-eyebrow">ACCOUNT RECOVERY</span>
        <h1>Recupere sua <span>conta.</span></h1>
        <p className="login-subtitle">
          Informe seu e-mail para receber o link de recuperação.
        </p>

        <form onSubmit={recuperar}>
          <label htmlFor="recuperar-email">E-mail</label>
          <input
            id="recuperar-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit" disabled={carregando}>
            {carregando ? 'ENVIANDO...' : 'ENVIAR LINK ↗'}
          </button>
        </form>

        {mensagem && (
          <p className="login-message" role="status">
            {mensagem}
          </p>
        )}

        <button
          className="login-text-button"
          onClick={() => navigate('/login')}
        >
          Voltar ao login
        </button>
      </section>

      <footer className="login-footer">
        <span>SECURE ACCESS</span>
        <span>AURA + EGO BASED</span>
      </footer>
    </main>
  )
}

function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /><Route path="/admin" element={<Suspense fallback={<p>Carregando painel…</p>}><Admin /></Suspense>} />
      <Route path="/checkout" element={<Commerce mode="checkout" />} /><Route path="/minha-conta" element={<Commerce mode="account" />} /><Route path="/criar-conta" element={<Commerce mode="signup" />} /><Route path="/redefinir-senha" element={<Commerce mode="reset" />} /><Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/sites-premium" element={<SitesPremium />} />
      <Route path="/sites-premium/barber" element={<Barber />} />
      <Route path="/sites-premium/beauty" element={<Beauty />} />
      <Route path="/sites-premium/food" element={<Food />} />
      <Route path="/ondemand" element={<OnDemand />} />
      <Route path="/servicos" element={<Servicos />} />

      <Route path="*" element={<main className="login-page"><section className="login-card"><h1>Página não encontrada</h1><p>Confira o endereço ou volte para a página inicial.</p><a href="/">Voltar ao início ↗</a></section></main>} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Rotas />
    </BrowserRouter>
  )
}

export default App
