import { getToken }
  from "./auth.js"

const token =
  getToken()

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

    upgrade: false,

    autoConnect: false

  }
)

// ====================================
// VARIÁVEIS
// ====================================

let usuario =
  null

let chatAtual =
  null

// ====================================
// SOCKET CONNECT
// ====================================

socket.on(
  "connect",
  () => {

    console.log(
      "🟢 Admin conectado"
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
      "🔴 Admin desconectado"
    )

  }
)

// ====================================
// INIT
// ====================================

async function init() {

  await checkAdmin()

  socket.connect()

}

// ====================================
// CHECK ADMIN
// ====================================

async function checkAdmin() {

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

    const data =
      await res.json()

    if (
      !res.ok ||
      !data.user
    ) {

      window.location.href =
        "login.html"

      return

    }

    if (
      data.user.role !==
      "admin"
    ) {

      window.location.href =
        "login.html"

      return

    }

    usuario =
      data.user

    document.querySelector(
      ".user"
    ).innerHTML =
      `👤 ${usuario.nome}`

  } catch (err) {

    console.error(err)

  }

}

// ====================================
// NOVA MSG
// ====================================

socket.on(
  "novaMensagem",
  msg => {

    console.log(
      "📩 Nova mensagem:",
      msg
    )

    const clienteId =

      Number(msg.from) ===
      Number(usuario.id)

        ? Number(msg.to)

        : Number(msg.from)

    const clienteElemento =
      criarBotaoCliente(
        clienteId
      )

    // =================================
    // NOVA MENSAGEM
    // =================================

    if (
      Number(chatAtual) !==
      Number(clienteId)
    ) {

      clienteElemento.classList.add(
        "nova-msg"
      )

      let badge =
        clienteElemento.querySelector(
          ".badge"
        )

      if (!badge) {

        badge =
          document.createElement(
            "span"
          )

        badge.classList.add(
          "badge"
        )

        badge.innerText = "1"

        clienteElemento.appendChild(
          badge
        )

      } else {

        badge.innerText =

          Number(
            badge.innerText
          ) + 1

      }

      return

    }

    adicionarMensagemNaTela(
      msg
    )

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

      adicionarMensagemNaTela(
        msg
      )

    })

  }
)

// ====================================
// CRIAR CLIENTE
// ====================================

function criarBotaoCliente(
  clienteId
) {

  const area =
    document.getElementById(
      "listaClientes"
    )

  if (!area) return

  // remove vazio
  const vazio =
    area.querySelector(
      ".cliente-vazio"
    )

  if (vazio) {

    vazio.remove()

  }

  // verifica existente
  let cliente =
    document.querySelector(
      `[data-id="${clienteId}"]`
    )

  if (cliente) {

    return cliente

  }

  cliente =
    document.createElement(
      "div"
    )

  cliente.classList.add(
    "cliente-item"
  )

  cliente.dataset.id =
    clienteId

  cliente.innerHTML = `

    <div class="cliente-avatar">
      👤
    </div>

    <div>
      <strong>
        Cliente ${clienteId}
      </strong>

      <p>
        Online
      </p>
    </div>

  `

  cliente.onclick = () => {

    abrirChat(clienteId)

  }

  area.prepend(cliente)

  return cliente

}

// ====================================
// ABRIR CHAT
// ====================================

window.abrirChat =
  function (userId) {

    chatAtual =
      Number(userId)

    const box =
      document.getElementById(
        "mensagens"
      )

    box.innerHTML = ""

    // remove alerta
    const clienteElemento =
      document.querySelector(
        `[data-id="${userId}"]`
      )

    if (clienteElemento) {

      clienteElemento.classList.remove(
        "nova-msg"
      )

      const badge =
        clienteElemento.querySelector(
          ".badge"
        )

      if (badge) {

        badge.remove()

      }

    }

    socket.emit(
      "buscarMensagens",
      chatAtual
    )

  }

// ====================================
// ADD MSG
// ====================================

function adicionarMensagemNaTela(
  msg
) {

  const box =
    document.getElementById(
      "mensagens"
    )

  if (!box) return

  const div =
    document.createElement(
      "div"
    )

  div.classList.add(
    "message"
  )

  const minhaMensagem =

    Number(msg.from) ===
    Number(usuario.id)

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

  if (!chatAtual) {

    alert(
      "Selecione um cliente"
    )

    return

  }

  socket.emit(
    "mensagem",
    {

      to: chatAtual,

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
// CLIENTES ONLINE
// ====================================

socket.on(
  "clientesOnline",
  clientesIds => {

    console.log(
      "🟢 Online:",
      clientesIds
    )

    const area =
      document.getElementById(
        "listaClientes"
      )

    if (!area) return

    // remove vazio
    const vazio =
      area.querySelector(
        ".cliente-vazio"
      )

    if (vazio) {

      vazio.remove()

    }

    // clientes existentes
    const existentes =
      new Set()

    document
      .querySelectorAll(
        ".cliente-item"
      )
      .forEach(item => {

        existentes.add(
          Number(
            item.dataset.id
          )
        )

      })

    // adiciona apenas novos
    clientesIds.forEach(id => {

      if (
        existentes.has(
          Number(id)
        )
      ) {

        return

      }

      criarBotaoCliente(id)

    })

  }
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

window.addEventListener(
  "DOMContentLoaded",
  init
)