function checkAuth() {

  const token =
    localStorage.getItem("token")

  if (!token) {

    window.location.replace(
      "login.html"
    )

    return null

  }

  return token

}

const token =
  checkAuth()

// ====================================
// SOCKET
// ====================================

const socket = io(
  "http://localhost:3000",
  {

    auth: {
      token
    },

    transports: ["websocket"],

    reconnection: true,

    reconnectionAttempts: Infinity,

    reconnectionDelay: 1000

  }
)

// ====================================
// VARIÁVEIS
// ====================================

let usuarioLogado =
  null

const ADMIN_ID = 1

// ====================================
// SOCKET CONNECT
// ====================================

socket.on(
  "connect",
  () => {

    console.log(
      "🟢 Cliente conectado"
    )

  }
)

// ====================================
// SOCKET DISCONNECT
// ====================================

socket.on(
  "disconnect",
  () => {

    console.log(
      "🔴 Cliente desconectado"
    )

  }
)

// ====================================
// CARREGAR USUÁRIO
// ====================================

async function carregarUsuario() {

  try {

    const res =
      await fetch(
        "http://localhost:3000/auth/perfil",
        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }
      )

    if (!res.ok) {

      console.log(
        "Erro ao validar usuário"
      )

      return

    }

    const data =
      await res.json()

    usuarioLogado =
      data.user

    localStorage.setItem(
      "user",
      JSON.stringify(
        usuarioLogado
      )
    )

    atualizarNome(
      usuarioLogado
    )

    // ====================================
    // HISTÓRICO
    // ====================================

    socket.emit(
      "buscarMensagens",
      ADMIN_ID
    )

  } catch (err) {

    console.error(err)

  }

}

// ====================================
// ATUALIZA NOME
// ====================================

function atualizarNome(user) {

  const userName =
    document.getElementById(
      "userName"
    )

  if (userName) {

    userName.innerHTML =
      `👤 ${user.nome}`

  }

}

// ====================================
// PRODUTOS
// ====================================

async function carregarProdutos() {

  try {

    const res =
      await fetch(
        "http://localhost:3000/produtos"
      )

    const produtos =
      await res.json()

    const lista =
      document.getElementById(
        "lista"
      )

    if (!lista) return

    lista.innerHTML = ""

    produtos.forEach(p => {

      lista.innerHTML += `

        <div class="produto">

          <img
            src="http://localhost:3000/uploads/${p.imagem}"
            alt="${p.nome}"
          >

          <h3>
            ${p.nome}
          </h3>

          <p class="preco">
            R$ ${p.preco}
          </p>

          <p class="descricao">
            ${p.descricao || ""}
          </p>

        </div>

      `

    })

  } catch (err) {

    console.error(
      "Erro produtos:",
      err
    )

  }

}

// ====================================
// LOGOUT
// ====================================

const logoutBtn =
  document.querySelector(
    ".logout"
  )

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    e => {

      e.preventDefault()

      localStorage.clear()

      window.location.replace(
        "login.html"
      )

    }
  )

}

// ====================================
// CHAT ABRIR/FECHAR
// ====================================

const abrirChat =
  document.getElementById(
    "abrirChat"
  )

const fecharChat =
  document.getElementById(
    "fecharChat"
  )

const chatBox =
  document.getElementById(
    "chatBox"
  )

if (
  abrirChat &&
  fecharChat &&
  chatBox
) {

  abrirChat.addEventListener(
    "click",
    () => {

      chatBox.classList.add(
        "active"
      )

    }
  )

  fecharChat.addEventListener(
    "click",
    () => {

      chatBox.classList.remove(
        "active"
      )

    }
  )

}

// ====================================
// RENDER MSG
// ====================================

function mostrarMensagem(msg) {

  const box =
    document.getElementById(
      "mensagens"
    )

  if (!box) return

  const div =
    document.createElement(
      "div"
    )

  const minhaMensagem =

    Number(msg.from) ===
    Number(usuarioLogado.id)

  div.classList.add(
    "message"
  )

  if (minhaMensagem) {

    div.classList.add(
      "mine"
    )

  } else {

    div.classList.add(
      "other"
    )

  }

  div.innerText =
    msg.text

  box.appendChild(div)

  box.scrollTop =
    box.scrollHeight

}

// ====================================
// NOVA MSG
// ====================================

socket.on(
  "novaMensagem",
  msg => {

    mostrarMensagem(msg)

  }
)

// ====================================
// HISTÓRICO
// ====================================

socket.on(
  "historicoMensagens",
  mensagens => {

    const box =
      document.getElementById(
        "mensagens"
      )

    if (!box) return

    box.innerHTML = ""

    mensagens.forEach(msg => {

      mostrarMensagem(msg)

    })

  }
)

// ====================================
// ENVIAR MSG
// ====================================

function enviarMensagem() {

  const input =
    document.getElementById(
      "inputMensagem"
    )

  if (!input) return

  const texto =
    input.value.trim()

  if (!texto) return

  socket.emit(
    "mensagem",
    {

      to: ADMIN_ID,

      text: texto

    }
  )

  input.value = ""

}

// ====================================
// BOTÃO ENVIAR
// ====================================

document
  .getElementById(
    "btnEnviar"
  )

  ?.addEventListener(
    "click",
    enviarMensagem
  )

// ====================================
// ENTER
// ====================================

document
  .getElementById(
    "inputMensagem"
  )

  ?.addEventListener(
    "keydown",
    e => {

      if (e.key === "Enter") {

        enviarMensagem()

      }

    }
  )

// ====================================
// INIT
// ====================================

carregarUsuario()

carregarProdutos()