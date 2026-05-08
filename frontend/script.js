const API = 'http://localhost:3000/produtos'

const form = document.getElementById('form')
const lista = document.querySelector('#lista')

let produtos = []
let editandoId = null

async function carregarProdutos() {
  const res = await fetch(API)
  produtos = await res.json()

  lista.innerHTML = ''

  produtos.forEach((p, index) => {
    const div = document.createElement('div')
    div.classList.add('produto')

    div.innerHTML = `
      ${p.imagem ? `<img src="http://localhost:3000/uploads/${p.imagem}" alt="${p.nome}">` : ''}
      
      <div class="produto-content">
        <h3>${p.nome}</h3>
        <p class="preco">R$ ${p.preco}</p>
        <p class="descricao">${p.descricao || ''}</p>
      </div>

      <button class="btn-edit" data-id="${p.id}">✏️</button>
      <button class="btn-delete" data-id="${p.id}">🗑️</button>
    `

    lista.appendChild(div)

    // animação suave
    requestAnimationFrame(() => {
      setTimeout(() => {
        div.classList.add('show')
      }, index * 100)
    })
  })

  // DELETE
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id')
      await deletar(id)
    })
  })

  // EDITAR
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id')
      const produto = produtos.find(p => p.id == id)

      document.getElementById('nome').value = produto.nome
      document.getElementById('valor').value = produto.preco
      document.getElementById('descri').value = produto.descricao

      editandoId = id

      const botao = form.querySelector('button')
      botao.textContent = 'Atualizar produto'
      botao.style.backgroundColor = '#f59e0b'
    })
  })
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const botao = form.querySelector('button')

  const formData = new FormData()
  formData.append('nome', document.getElementById('nome').value)
  formData.append('preco', document.getElementById('valor').value)
  formData.append('descricao', document.getElementById('descri').value)

  const file = document.getElementById('imagem').files[0]
  if (file) formData.append('imagem', file)

  if (editandoId) {
    await fetch(`${API}/${editandoId}`, {
      method: 'PUT',
      body: formData
    })

    editandoId = null

    botao.textContent = 'Alteração concluída ✅'
    botao.style.backgroundColor = '#10b981'

  } else {
    await fetch(API, {
      method: 'POST',
      body: formData
    })

    botao.textContent = 'Produto cadastrado ✅'
    botao.style.backgroundColor = '#10b981'
  }

  setTimeout(() => {
    botao.textContent = 'Cadastrar produto'
    botao.style.backgroundColor = '#3b82f6'
  }, 2000)

  form.reset()
  carregarProdutos()
})

async function deletar(id) {
  await fetch(`${API}/${id}`, {
    method: 'DELETE'
  })

  carregarProdutos()
}

// PREVIEW DE IMAGEM
const inputImagem = document.getElementById('imagem')
const preview = document.getElementById('preview-img')
const container = document.getElementById('preview-container')
const texto = document.getElementById('upload-text')

inputImagem.addEventListener('change', () => {
  const file = inputImagem.files[0]
  if (!file) return

  const url = URL.createObjectURL(file)

  preview.src = url
  container.style.display = 'block'
  texto.textContent = `📁 ${file.name}`
})

const logoutBtn = document.querySelector(".logout")

if (logoutBtn) {

  logoutBtn.addEventListener("click", (e) => {

    e.preventDefault()

    localStorage.clear()

    window.location.replace("pagina inicial.html")

  })

}

   const userBox =
      document.querySelector(".user")

    if (userBox) {

      userBox.innerHTML =
        `👤 ${data.nome}`

    }


carregarProdutos()