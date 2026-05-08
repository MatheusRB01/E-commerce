import { setToken } from './auth.js'

/* =========================
TOGGLE LOGIN / REGISTER
========================= */

const links =
  document.querySelectorAll(".toggle-link")

const loginFormEl =
  document.getElementById("loginForm")

const registerFormEl =
  document.getElementById("registerForm")

links.forEach(link => {

  link.addEventListener("click", (e) => {

    e.preventDefault()

    const target =
      link.dataset.target

    if (target === "register") {

      loginFormEl.classList.remove(
        "active"
      )

      registerFormEl.classList.add(
        "active"
      )

    }

    if (target === "login") {

      registerFormEl.classList.remove(
        "active"
      )

      loginFormEl.classList.add(
        "active"
      )

    }

  })

})

/* =========================
LOGIN
========================= */

const loginForm =
  document.getElementById('loginForm')

loginForm.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault()

    const email =
      document.getElementById(
        'email'
      ).value

    const senha =
      document.getElementById(
        'senha'
      ).value

    try {

      const res = await fetch(
        'http://localhost:3000/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            email,
            senha
          })
        }
      )

      const data =
        await res.json()

      if (data.token) {

        // TOKEN
        setToken(data.token)

        // USUÁRIO
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        )

        // ATUALIZA NOME NA HORA
        const userName =
          document.getElementById(
            "userName"
          )

        if (userName) {

          userName.innerHTML =
            `👤 ${data.user.nome}`

        }

        // DECODIFICAR TOKEN
        const payload = JSON.parse(
          atob(
            data.token.split('.')[1]
          )
        )

        // REDIRECIONAR
        if (
          payload.role === 'admin'
        ) {

          window.location.href =
            'index.html'

        } else {

          window.location.href =
            'cliente.html'

        }

      } else {

        alert(
          data.error ||
          'Erro no login'
        )

      }

    } catch (error) {

      console.log(error)

    }

  }
)