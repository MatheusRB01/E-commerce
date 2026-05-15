const API = "http://localhost:3000/produtos"

const form =
  document.getElementById("form")

const lista =
  document.querySelector("#lista")

let produtos = []

let editandoId = null

let usuarioLogado = null

let conversaAtual = null

let notificacoes = {}

const ADMIN_ID = 1

// ========================================
// SOCKET
// ========================================

const token =
  localStorage.getItem("token")

const socket = io(
  "http://localhost:3000",
  {

    auth: {
      token
    },

    transports: ["websocket"],

    upgrade: false

  }
)

// ========================================
// CARREGAR USUÁRIO
// ========================================

async function carregarUsuario() {

  try {

    if (!token) return

    const response =
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
      await response.json()

    usuarioLogado =
      data.user

    console.log(
      "👤 Usuário:",
      usuarioLogado
    )

    const userBox =
      document.querySelector(".user")

    if (userBox) {

      userBox.innerHTML =
        `👤 ${usuarioLogado.nome}`

    }

    // ====================================
    // CLIENTE ABRE CHAT COM ADMIN
    // ====================================

    if (
      usuarioLogado.role === "cliente"
    ) {

      conversaAtual = ADMIN_ID

      socket.emit(
        "buscarMensagens",
        ADMIN_ID
      )

    }

  } catch (error) {

    console.error(error)

  }

}

// ========================================
// CARREGAR PRODUTOS
// ========================================

async function carregarProdutos() {

  const res =
    await fetch(API)

  produtos =
    await res.json()

  lista.innerHTML = ""

  produtos.forEach((p, index) => {

    const div =
      document.createElement("div")

    div.classList.add(
      "produto"
    )

    div.innerHTML = `

      ${p.imagem
        ? `
          <img
            src="http://localhost:3000/uploads/${p.imagem}"
            alt="${p.nome}"
          >
        `
        : ""
      }

      <div class="produto-content">

        <h3>${p.nome}</h3>

        <p class="preco">
          R$ ${p.preco}
        </p>

        <p class="descricao">
          ${p.descricao || ""}
        </p>

      </div>

      <button
        class="btn-edit"
        data-id="${p.id}"
      >
        ✏️
      </button>

      <button
        class="btn-delete"
        data-id="${p.id}"
      >
        🗑️
      </button>

    `

    lista.appendChild(div)

    requestAnimationFrame(() => {

      setTimeout(() => {

        div.classList.add(
          "show"
        )

      }, index * 100)

    })

  })

  // ====================================
  // DELETE
  // ====================================

  document
    .querySelectorAll(
      ".btn-delete"
    )

    .forEach(btn => {

      btn.addEventListener(
        "click",
        async () => {

          const id =
            btn.getAttribute(
              "data-id"
            )

          await deletar(id)

        }
      )

    })

  // ====================================
  // EDITAR
  // ====================================

  document
    .querySelectorAll(
      ".btn-edit"
    )

    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const id =
            btn.getAttribute(
              "data-id"
            )

          const produto =
            produtos.find(
              p => p.id == id
            )

          document
            .getElementById("nome")
            .value = produto.nome

          document
            .getElementById("valor")
            .value = produto.preco

          document
            .getElementById("descri")
            .value =
            produto.descricao

          editandoId = id

          const botao =
            form.querySelector(
              "button"
            )

          botao.textContent =
            "Atualizar produto"

          botao.style.backgroundColor =
            "#f59e0b"

        }
      )

    })

}

// ========================================
// SUBMIT
// ========================================

form.addEventListener(
  "submit",
  async e => {

    e.preventDefault()

    const botao =
      form.querySelector(
        "button"
      )

    const formData =
      new FormData()

    formData.append(
      "nome",
      document
        .getElementById("nome")
        .value
    )

    formData.append(
      "preco",
      document
        .getElementById("valor")
        .value
    )

    formData.append(
      "descricao",
      document
        .getElementById("descri")
        .value
    )

    const file =
      document
        .getElementById(
          "imagem"
        )
        .files[0]

    if (file) {

      formData.append(
        "imagem",
        file
      )

    }

    // ====================================
    // EDITAR
    // ====================================

    if (editandoId) {

      await fetch(
        `${API}/${editandoId}`,
        {

          method: "PUT",

          body: formData

        }
      )

      editandoId = null

      botao.textContent =
        "Alterado ✅"

    }

    // ====================================
    // CRIAR
    // ====================================

    else {

      await fetch(API, {

        method: "POST",

        body: formData

      })

      botao.textContent =
        "Cadastrado ✅"

    }

    botao.style.backgroundColor =
      "#10b981"

    setTimeout(() => {

      botao.textContent =
        "Cadastrar produto"

      botao.style.backgroundColor =
        "#3b82f6"

    }, 2000)

    form.reset()

    carregarProdutos()

  }
)

// ========================================
// DELETAR
// ========================================

async function deletar(id) {

  await fetch(
    `${API}/${id}`,
    {

      method: "DELETE"

    }
  )

  carregarProdutos()

}

// ========================================
// PREVIEW IMAGEM
// ========================================

const inputImagem =
  document.getElementById(
    "imagem"
  )

const preview =
  document.getElementById(
    "preview-img"
  )

const container =
  document.getElementById(
    "preview-container"
  )

if (inputImagem) {

  inputImagem.addEventListener(
    "change",
    () => {

      const file =
        inputImagem.files[0]

      if (!file) return

      const url =
        URL.createObjectURL(file)

      preview.src = url

      container.style.display =
        "block"

    }
  )

}

// ========================================
// LOGOUT
// ========================================

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
        "pagina inicial.html"
      )

    }
  )

}

// ========================================
// CHAT
// ========================================

const abrirChatBtn =
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
  abrirChatBtn &&
  fecharChat &&
  chatBox
) {

  abrirChatBtn.addEventListener(
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

// ========================================
// RENDERIZAR MENSAGEM
// ========================================

function renderMensagem(msg) {

  const box =
    document.getElementById(
      "mensagens"
    )

  if (!box) return

  const div =
    document.createElement(
      "div"
    )

  // mensagem minha
  if (

    usuarioLogado &&

    Number(msg.from) ===
    Number(usuarioLogado.id)

  ) {

    div.classList.add(
      "message",
      "mine"
    )

  }

  // mensagem recebida
  else {

    div.classList.add(
      "message",
      "other"
    )

  }

  div.innerHTML = `

    <p>${msg.text}</p>

    <small>
      ${msg.createdAt
        ? new Date(
            msg.createdAt
          ).toLocaleTimeString()
        : ""
      }
    </small>

  `

  box.appendChild(div)

  box.scrollTop =
    box.scrollHeight

}

// ========================================
// HISTÓRICO
// ========================================

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

      renderMensagem(msg)

    })

  }
)

// ========================================
// ENVIAR MENSAGEM
// ========================================

function enviarMensagem() {

  const input =
    document.getElementById(
      "inputMensagem"
    )

  if (!input) return

  const texto =
    input.value.trim()

  if (!texto) return

  // ====================================
  // CLIENTE
  // ====================================

  if (

    usuarioLogado &&

    usuarioLogado.role === "cliente"

  ) {

    socket.emit(
      "mensagem",
      {

        to: ADMIN_ID,

        text: texto

      }
    )

  }

  // ====================================
  // ADMIN
  // ====================================

  else {

    if (!conversaAtual) {

      alert(
        "Selecione uma conversa"
      )

      return

    }

    socket.emit(
      "mensagem",
      {

        to: conversaAtual,

        text: texto

      }
    )

  }

  input.value = ""

}

// ========================================
// NOVA MENSAGEM
// ========================================

socket.on(
  "novaMensagem",
  msg => {

    console.log(
      "📩 Nova mensagem:",
      msg
    )

    // ====================================
    // ADMIN
    // ====================================

    if (

      usuarioLogado &&

      usuarioLogado.role === "admin"

    ) {

      const clienteId =

        Number(msg.from) === Number(usuarioLogado.id)

          ? Number(msg.to)

          : Number(msg.from)

      const clienteElemento =

        document.querySelector(
          `.cliente-item[data-id="${clienteId}"]`
        )

      // ====================================
      // NOVA MENSAGEM
      // ====================================

      if (

        Number(conversaAtual) !==
        Number(clienteId)

      ) {

        if (clienteElemento) {

          clienteElemento.classList.add(
            "nova-mensagem"
          )

        }

      }

      // ====================================
      // NÃO RENDERIZA
      // ====================================

      if (

        Number(conversaAtual) !==
        Number(clienteId)

      ) {

        return

      }

    }

    renderMensagem(msg)

  }
)

// ========================================
// ENTER ENVIA
// ========================================

const inputMensagem =
  document.getElementById(
    "inputMensagem"
  )

if (inputMensagem) {

  inputMensagem.addEventListener(
    "keypress",
    e => {

      if (e.key === "Enter") {

        e.preventDefault()

        enviarMensagem()

      }

    }
  )

}

// ========================================
// BOTÃO ENVIAR
// ========================================

const btnEnviar =
  document.getElementById(
    "btnEnviar"
  )

if (btnEnviar) {

  btnEnviar.addEventListener(
    "click",
    enviarMensagem
  )

}

// ========================================
// CARREGAR CLIENTES
// ========================================

async function carregarClientes() {

  try {

    const res =
      await fetch(
        "http://localhost:3000/usuarios"
      )

    const usuarios =
      await res.json()

    const listaClientes =
      document.getElementById(
        "listaClientes"
      )

    if (!listaClientes) return

    listaClientes.innerHTML = ""

    // ====================================
    // FILTRA CLIENTES
    // ====================================

    const clientes =
      usuarios.filter(user =>

        user.role === "cliente"

      )

    if (!clientes.length) {

      listaClientes.innerHTML = `

        <div class="cliente-vazio">

          Nenhum cliente encontrado

        </div>

      `

      return

    }

    clientes.forEach(cliente => {

      const div =
        document.createElement("div")

      div.classList.add(
        "cliente-item"
      )

      // ====================================
      // DATA ID
      // ====================================

      div.dataset.id =
        cliente.id

      div.innerHTML = `

        <div class="cliente-avatar">

          ${cliente.nome
            .charAt(0)
            .toUpperCase()}

        </div>

        <div>

          <strong>
            ${cliente.nome}
          </strong>

          <br>

          <small>
            ID: ${cliente.id}
          </small>

        </div>

      `

      // ====================================
      // ABRIR CONVERSA
      // ====================================

      div.addEventListener(
        "click",
        () => {

          // remove active
          document
            .querySelectorAll(
              ".cliente-item"
            )

            .forEach(el => {

              el.classList.remove(
                "active"
              )

            })

          div.classList.add(
            "active"
          )

          // remove bolinha
          div.classList.remove(
            "nova-mensagem"
          )

          conversaAtual =
            cliente.id

          const mensagens =
            document.getElementById(
              "mensagens"
            )

          mensagens.innerHTML = ""

          socket.emit(
            "buscarMensagens",
            cliente.id
          )

          console.log(
            "💬 Conversa aberta:",
            cliente.nome
          )

        }
      )

      listaClientes.appendChild(
        div
      )

    })

  } catch (error) {

    console.error(
      "Erro clientes:",
      error
    )

  }

}

carregarUsuario()

carregarProdutos()

carregarClientes()