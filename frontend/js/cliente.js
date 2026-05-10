function checkAuth() {
  const token = localStorage.getItem("token")

  if (!token) {
    window.location.replace("login.html")
    return null
  }

  return token
}

const token = checkAuth()

let usuarioLogado = JSON.parse(localStorage.getItem("user"))

// =========================
// SOCKET
// =========================
const socket = io("http://localhost:3000", {
  transports: ["websocket"]
})

socket.on("connect", () => {
  console.log("Socket conectado ✅")
})

// =========================
// USUÁRIO
// =========================
async function carregarUsuario() {
  try {
    const res = await fetch("http://localhost:3000/auth/perfil", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      localStorage.clear()
      window.location.replace("login.html")
      return
    }

    const data = await res.json()

    usuarioLogado = data.user

    localStorage.setItem("user", JSON.stringify(usuarioLogado))

    atualizarNome(usuarioLogado)

  } catch (err) {
    console.error("Erro ao carregar usuário:", err)
  }
}

function atualizarNome(user) {
  const userName = document.getElementById("userName")

  if (userName) {
    userName.innerHTML = `👤 ${user.nome}`
  }
}

// =========================
// LOGOUT
// =========================
const logoutBtn = document.querySelector(".logout")

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault()

    localStorage.clear()
    window.location.replace("login.html")
  })
}

// =========================
// BLOQUEAR VOLTAR
// =========================
window.history.pushState(null, null, window.location.href)

window.onpopstate = () => {
  window.history.go(1)
}

// =========================
// CHAT - ABRIR/FECHAR
// =========================
const abrirChat = document.getElementById("abrirChat")
const fecharChat = document.getElementById("fecharChat")
const chatBox = document.getElementById("chatBox")

if (abrirChat && fecharChat && chatBox) {

  abrirChat.addEventListener("click", () => {
    chatBox.classList.add("active")
  })

  fecharChat.addEventListener("click", () => {
    chatBox.classList.remove("active")
  })
}

// =========================
// ENVIAR MENSAGEM
// =========================
function enviarMensagem() {
  const input = document.getElementById("inputMensagem")

  const texto = input.value.trim()
  if (!texto || !usuarioLogado) return

  socket.emit("mensagem", {
    from: usuarioLogado.id,
    to: 1,
    text: texto
  })

  input.value = ""
}

document.getElementById("btnEnviar")?.addEventListener("click", enviarMensagem)

// =========================
// RECEBER MENSAGEM
// =========================
socket.on("novaMensagem", (msg) => {
  mostrarMensagem(msg)
})

// =========================
// RENDER MENSAGEM (CORRETO)
// =========================
function mostrarMensagem(msg) {

  const box = document.getElementById("mensagens")
  if (!box) return

  const div = document.createElement("div")

  const meuId = usuarioLogado?.id
  const isMine = msg.from === meuId

  div.classList.add("message", isMine ? "mine" : "other")

  div.innerText = msg.text ?? ""

  box.appendChild(div)

  box.scrollTop = box.scrollHeight
}

// =========================
// INIT
// =========================
carregarUsuario()