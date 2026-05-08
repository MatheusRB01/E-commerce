import { getToken } from './auth.js'

const token = getToken()

async function checkAdmin() {
  const res = await fetch('http://localhost:3000/auth/perfil', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()

  console.log('RESPOSTA:', data)

  if (!res.ok) {
    window.location.href = 'login.html'
    return
  }

  if (!data.user) {
    window.location.href = 'login.html'
    return
  }

  if (data.user.role !== 'admin') {
    window.location.href = 'admin.html'
  }
  
}

checkAdmin()