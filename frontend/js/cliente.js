/* =========================
🔐 PROTEÇÃO GLOBAL
========================= */

function checkAuth() {

  const token =
    localStorage.getItem("token")

  if (!token) {

    window.location.replace(
      "login.html"
    )

  }

  return token
}

const token = checkAuth()

/* =========================
👤 CARREGAR USUÁRIO
========================= */

async function carregarUsuario() {

  try {

    const res = await fetch(
      'http://localhost:3000/auth/perfil',
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )

    // TOKEN INVÁLIDO
    if (res.status === 401) {

      localStorage.clear()

      window.location.replace(
        "login.html"
      )

      return
    }

    const data =
      await res.json()

    const user =
      data.user

    // SALVAR LOCALMENTE
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    )

    atualizarNome(user)

  } catch (err) {

    console.error(
      "Erro ao carregar usuário:",
      err
    )

  }

}

/* =========================
👤 ATUALIZAR NOME
========================= */

function atualizarNome(user) {

  // HEADER
  const userName =
    document.getElementById(
      "userName"
    )

  if (userName) {

    userName.innerHTML =
      `👤 ${user.nome}`

  }

  // OUTRA BOX
  const userBox =
    document.querySelector(
      ".userName"
    )

  if (userBox) {

    userBox.innerHTML =
      `👤 ${user.nome}`

  }

}

/* =========================
📦 USUÁRIO LOCAL
========================= */

const user = JSON.parse(
  localStorage.getItem("user")
)

if (user) {

  atualizarNome(user)

}

/* =========================
🚪 LOGOUT
========================= */

const logoutBtn =
  document.querySelector(
    ".logout"
  )

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    (e) => {

      e.preventDefault()

      localStorage.clear()

      window.location.replace(
        "login.html"
      )

    }
  )

}

/* =========================
🚫 BLOQUEAR VOLTAR
========================= */

window.history.pushState(
  null,
  null,
  window.location.href
)

window.onpopstate = () => {

  window.history.go(1)

}

/* =========================
🚀 INICIAR
========================= */

carregarUsuario()

/* =========================
🛒 PRODUTOS
========================= */

const API =
  "http://localhost:3000/produtos"

const lista =
  document.getElementById(
    "lista"
  )