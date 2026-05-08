function setToken(token) {
  localStorage.setItem('token', token)
}

const registerForm = document.getElementById('registerForm')

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nome = document.getElementById('regNome').value
    const email = document.getElementById('regEmail').value
    const senha = document.getElementById('regSenha').value
    const telefone = document.getElementById('regTell').value

    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, telefone })
    })

    const data = await res.json()

    if (data.token) {
      setToken(data.token)

      const payload = JSON.parse(atob(data.token.split('.')[1]))

      if (payload.role === 'admin') {
        window.location.href = 'index.html'
      } else {
        window.location.href = 'cliente.html'
      }

    } else {
      alert(data.error || 'Erro no login')
    }
  })
}