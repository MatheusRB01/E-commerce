// ====================================
// AUTH
// ====================================

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
// CARRINHO
// ====================================

let carrinho = JSON.parse(
  localStorage.getItem("carrinho")
) || []

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

          <div class="produto-content">

            <h3>
              ${p.nome}
            </h3>

            <p class="preco">
              R$ ${Number(p.preco).toFixed(2)}
            </p>

            <p class="descricao">
              ${p.descricao || ""}
            </p>

            <button
              class="add-cart"
              onclick='adicionarCarrinho(
                ${JSON.stringify(p)}
              )'
            >
              Adicionar ao Carrinho
            </button>

          </div>

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
// CARRINHO
// ====================================

function toggleCarrinho() {

  const carrinhoBox =
    document.getElementById(
      "carrinho"
    )

  carrinhoBox.classList.toggle(
    "active"
  )

}

// ====================================
// ADICIONAR
// ====================================

function adicionarCarrinho(produto) {

  carrinho.push(produto)

  salvarCarrinho()

  atualizarCarrinho()

}

// ====================================
// REMOVER
// ====================================

function removerCarrinho(index) {

  carrinho.splice(index, 1)

  salvarCarrinho()

  atualizarCarrinho()

}

// ====================================
// SALVAR
// ====================================

function salvarCarrinho() {

  localStorage.setItem(
    "carrinho",
    JSON.stringify(carrinho)
  )

}

// ====================================
// ATUALIZAR CARRINHO
// ====================================

function atualizarCarrinho() {

  const cartItems =
    document.getElementById(
      "cart-items"
    )

  const cartCount =
    document.getElementById(
      "cart-count"
    )

  const cartTotal =
    document.getElementById(
      "cart-total"
    )

  if (!cartItems) return

  cartItems.innerHTML = ""

  let total = 0

  carrinho.forEach(
    (produto, index) => {

      total += Number(
        produto.preco
      )

      cartItems.innerHTML += `

        <div class="cart-item">

          <img
            src="http://localhost:3000/uploads/${produto.imagem}"
            alt="${produto.nome}"
          >

          <div class="cart-info">

            <h4>
              ${produto.nome}
            </h4>

            <p>
              R$ ${Number(produto.preco).toFixed(2)}
            </p>

            <button
              class="remove-btn"
              onclick="removerCarrinho(${index})"
            >
              Remover
            </button>

          </div>

        </div>

      `

    }
  )

  cartCount.innerText =
    carrinho.length

  cartTotal.innerText =
    total.toFixed(2)

}

// ====================================
// FINALIZAR COMPRA
// ====================================

function finalizarCompra() {

  if (carrinho.length === 0) {

    alert(
      "Seu carrinho está vazio"
    )

    return

  }

  let mensagem =
    "🛒 *Novo Pedido*%0A%0A"

  carrinho.forEach(produto => {

    mensagem +=
      `• ${produto.nome} - R$ ${Number(produto.preco).toFixed(2)}%0A`

  })

  const total =
    carrinho.reduce(
      (acc, item) => {

        return acc + Number(item.preco)

      },
      0
    )

  mensagem +=
    `%0A💰 Total: R$ ${total.toFixed(2)}`

  window.open(
    `https://wa.me/5511966733218?text=${mensagem}`,
    "_blank"
  )

  // LIMPA O CARRINHO
  carrinho = []

  salvarCarrinho()

  atualizarCarrinho()
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
// CHAT
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
// MSG
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

socket.on(
  "novaMensagem",
  msg => {

    mostrarMensagem(msg)

  }
)

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

document
  .getElementById(
    "btnEnviar"
  )

  ?.addEventListener(
    "click",
    enviarMensagem
  )

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

atualizarCarrinho()

// ====================================
// FUNÇÕES GLOBAIS
// ====================================

window.adicionarCarrinho =
  adicionarCarrinho

window.removerCarrinho =
  removerCarrinho

window.toggleCarrinho =
  toggleCarrinho

window.finalizarCompra =
  finalizarCompra