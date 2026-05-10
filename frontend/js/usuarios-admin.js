async function carregarUsuarios() {

    try {

        const response = await fetch(
            'http://localhost:3000/admin/usuarios'
        )


        const usuarios = await response.json()

        const tabela = document.getElementById('tabelaUsuarios')

        const totalUsuarios =
            document.getElementById('totalUsuarios')

        totalUsuarios.innerText = usuarios.length

        tabela.innerHTML = ''

        usuarios.forEach(usuario => {

            tabela.innerHTML += `

                <tr>

                    <td>${usuario.id}</td>

                    <td>${usuario.nome}</td>

                    <td>${usuario.role}</td>

                    <td>${usuario.telefone}</td>

                    <td>

                     <button class="excluir"
                       onclick="excluirUsuario(${usuario.id})">
                            Excluir
                     </button>

            </td>

                </tr>

            `
        })

    } catch (error) {

        console.log(error)

    }

}

async function excluirUsuario(id) {

    try {

        const response = await fetch(

            `http://localhost:3000/admin/usuarios/${id}`,

            {
                method: 'DELETE'
            }

        )

        const data = await response.json()


        carregarUsuarios()

    } catch (error) {

        console.log(error)

    }

}

carregarUsuarios()