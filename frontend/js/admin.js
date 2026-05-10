import { getToken } from './auth.js'

const token = getToken()

// =========================
// SOCKET
// =========================
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  autoConnect: false,
  auth: {
    token
  }
})

// =========================
// VARIÁVEIS
// =========================
let usuario = null
let chatAtual = null

// =========================
// SOCKET CONNECT
// =========================
socket.on("connect", () => {
  console.log("🟢 Admin conectado")
})

// =========================
// SOCKET DISCONNECT
// =========================
socket.on("disconnect", () => {
  console.log("🔴 Admin desconectado")
})

// =========================
// INIT
// =========================
async function init() {

  await checkAdmin()

  socket.connect()

  // =========================
  // RECEBER MENSAGEM
  // =========================
  socket.on("novaMensagem", (msg) => {

    console.log("📩 RECEBIDO:", msg)

    // padroniza
    const mensagem = {
      from: Number(msg.from || msg.de),
      to: Number(msg.to || msg.para),
      text: msg.text || msg.texto
    }

    // valida
    if (!mensagem.text) {
      console.log("❌ Mensagem inválida")
      return
    }

    // verifica se pertence ao chat atual
    if (
      Number(mensagem.from) !== Number(chatAtual) &&
      Number(mensagem.to) !== Number(chatAtual)
    ) {
      return
    }

    // salva
    salvarMensagem(mensagem)

    // renderiza
    adicionarMensagemNaTela(mensagem)
  })
}

// =========================
// CHECK ADMIN
// =========================
async function checkAdmin() {

  try {

    const res = await fetch(
      "http://localhost:3000/auth/perfil",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await res.json()

    if (!res.ok || !data.user) {
      window.location.href = "login.html"
      return
    }

    if (data.user.role !== "admin") {
      window.location.href = "login.html"
      return
    }

    usuario = data.user

    console.log("👤 ADMIN:", usuario)

    localStorage.setItem(
      "user",
      JSON.stringify(usuario)
    )

  } catch (err) {

    console.error("❌ Erro auth:", err)

    window.location.href = "login.html"
  }
}

// =========================
// PEGAR CHAVE DO CHAT
// =========================
function getChatKey(userId) {

  const ids = [
    Number(usuario.id),
    Number(userId)
  ].sort((a, b) => a - b)

  return `chat_${ids[0]}_${ids[1]}`
}

// =========================
// ADICIONAR MENSAGEM NA TELA
// =========================
function adicionarMensagemNaTela(msg) {

  const box =
    document.getElementById("mensagens")

  if (!box) return

  const div =
    document.createElement("div")

  div.classList.add("message")

  // minha mensagem
  if (
    Number(msg.from) ===
    Number(usuario.id)
  ) {

    div.classList.add("me")

  } else {

    div.classList.add("other")
  }

  div.innerText = msg.text

  box.appendChild(div)

  box.scrollTop = box.scrollHeight
}

// =========================
// ABRIR CHAT
// =========================
window.abrirChat = function(userId) {

  chatAtual = Number(userId)

  console.log("💬 CHAT:", chatAtual)

  carregarMensagens()
}

// =========================
// ENVIAR MENSAGEM
// =========================
function enviarMensagem() {

  const input =
    document.getElementById("inputMensagem")

  if (!input) return

  const texto = input.value.trim()

  if (!texto) return
  if (!usuario?.id) return
  if (!chatAtual) return

  // cria mensagem
  const mensagem = {
    from: Number(usuario.id),
    to: Number(chatAtual),
    text: texto
  }

  console.log("📤 ENVIANDO:", mensagem)

  // envia socket
  socket.emit("mensagem", mensagem)

  // salva
  salvarMensagem(mensagem)

  // renderiza instantâneo
  adicionarMensagemNaTela(mensagem)

  // limpa input
  input.value = ""
}

// =========================
// ENTER PRA ENVIAR
// =========================
function ativarEnter() {

  const input =
    document.getElementById("inputMensagem")

  if (!input) return

  input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
      enviarMensagem()
    }

  })
}

// =========================
// SALVAR MENSAGEM
// =========================
function salvarMensagem(msg) {

  const chatKey =
    getChatKey(
      msg.from === usuario.id
        ? msg.to
        : msg.from
    )

  const mensagens =
    JSON.parse(
      localStorage.getItem(chatKey)
    ) || []

  // evita duplicação
  const existe = mensagens.find(m =>

    Number(m.from) === Number(msg.from) &&
    Number(m.to) === Number(msg.to) &&
    m.text === msg.text

  )

  if (existe) {
    return
  }

  mensagens.push(msg)

  localStorage.setItem(
    chatKey,
    JSON.stringify(mensagens)
  )

  console.log("💾 Mensagem salva")
}

// =========================
// CARREGAR MENSAGENS
// =========================
function carregarMensagens() {

  const box =
    document.getElementById("mensagens")

  if (!box) return

  box.innerHTML = ""

  const chatKey =
    getChatKey(chatAtual)

  const mensagens =
    JSON.parse(
      localStorage.getItem(chatKey)
    ) || []

  mensagens.forEach(msg => {
    adicionarMensagemNaTela(msg)
  })

  console.log("📦 Mensagens carregadas")
}

// =========================
// DOM READY
// =========================
window.addEventListener("DOMContentLoaded", () => {

  console.log("✅ DOM carregado")

  const btnEnviar =
    document.getElementById("btnEnviar")

  btnEnviar?.addEventListener(
    "click",
    enviarMensagem
  )

  ativarEnter()

  init()
})