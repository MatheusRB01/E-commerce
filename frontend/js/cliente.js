/* =========================
🔐 PROTEÇÃO GLOBAL
========================= */
function checkAuth() {
  const token = localStorage.getItem("token")

  if (!token) {
    window.location.replace("login.html")
  }

  return token
}

const token = checkAuth()

async function carregarUsuario() {

  try {

    const res = await fetch("http://localhost:3000/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.status === 401) {
      localStorage.clear()
      window.location.replace("login.html")
      return
    }

    const user = await res.json()

    const userName = document.getElementById("userName")

    if (userName) {
      userName.innerHTML = `${user.nome}`
    }

  } catch (err) {
    console.error("Erro ao carregar usuário:", err)
  }
}

carregarUsuario()

/* =========================
🚪 LOGOUT
========================= */
const logoutBtn = document.querySelector(".logout")

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault()

    localStorage.clear()

    window.location.replace("login.html")
  })
}

 const userBox =
      document.querySelector(".userName")

    if (userBox) {

      userBox.innerHTML =
        `👤 ${data.nome}`

    }

const API = "http://localhost:3000/produtos"
const lista = document.getElementById("lista")

const user = JSON.parse(
  localStorage.getItem("user")
)

if (user) {

  const userName =
    document.getElementById("userName")

  if (userName) {

    userName.innerHTML =
      `${user.nome}`

  }

}

/* =========================
🚫 BLOQUEAR BOTÃO VOLTAR
========================= */
window.history.pushState(null, null, window.location.href)
window.onpopstate = () => {
  window.history.go(1)
}

