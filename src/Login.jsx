import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from './supabase'
import './Login.css'

export default function Login() {
const navigate = useNavigate()
const [email, setEmail] = useState('')
const [senha, setSenha] = useState('')
const [mensagem, setMensagem] = useState('')
const [carregando, setCarregando] = useState(false)

async function handleLogin(e) {
e.preventDefault()
setMensagem('')
setCarregando(true)


try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  })

  if (error) throw error

  if (!data.user) {
    throw new Error('Não foi possível confirmar o usuário.')
  }

  setMensagem('Login realizado com sucesso!')

  navigate('/minha-conta')
} catch (error) {
  console.error('Erro no login:', error)
  setMensagem(
    error.message === 'Invalid login credentials'
      ? 'E-mail ou senha incorretos.'
      : 'Não foi possível entrar. Confira os dados e tente novamente.'
  )
} finally {
  setCarregando(false)
}


}

return ( <main className="login-page">
<button
type="button"
className="login-text-button"
onClick={() => navigate('/')}
>
← Voltar ao início </button>


  <section className="login-card">
    <a href="/criar-conta">Criar conta</a><h1>Acesse sua <span>conta.</span></h1>

    <form onSubmit={handleLogin}>
      <label htmlFor="login-email">E-mail</label>
      <input
        id="login-email"
        type="email"
        placeholder="Seu e-mail"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="login-senha">Senha</label>
      <input
        id="login-senha"
        type="password"
        placeholder="Sua senha"
        autoComplete="current-password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      <button type="submit" disabled={carregando}>
        {carregando ? 'ENTRANDO...' : 'ENTRAR ↗'}
      </button>
    </form>

    {mensagem && (
      <p className="login-message" role="status">
        {mensagem}
      </p>
    )}

    <button
      type="button"
      className="login-text-button"
      onClick={() => navigate('/recuperar-senha')}
    >
      Esqueceu a senha?
    </button>
  </section>
</main>


)
}

