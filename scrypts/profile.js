window.onload = () => {
    var main = document.createElement('main');
    {
        var infoCard = document.createElement('div');
        infoCard.classList.add('info-card');
        {
            let loginInput = document.createElement('input')
            loginInput.type = 'text'
            loginInput.value = localStorage.getItem('login')
            loginInput.placeholder = 'Login'
            loginInput.classList.add('login')
            loginInput.onchange = () => {
                localStorage.setItem('login', loginInput.value)
            }

            let emailInput = document.createElement('input')
            emailInput.type = 'email'
            emailInput.value = localStorage.getItem('email')
            emailInput.placeholder = 'E@mail.com'
            emailInput.classList.add('email')
            emailInput.onchange = () => {
                localStorage.setItem('email', emailInput.value)
            }

            let name = document.createElement('h2')
            name.textContent = 'Profile'
            infoCard.appendChild(name)

            infoCard.appendChild(loginInput)
            infoCard.appendChild(emailInput)
        }
        main.appendChild(infoCard);
    }

    document.body.insertBefore(main, document.body.childNodes.item(1))
}