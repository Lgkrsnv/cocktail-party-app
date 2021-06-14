
const signupForm = document.querySelector('#signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const usernameInput = signupForm.querySelector('#validationDefaultUsername');
    const emailInput = signupForm.querySelector('#exampleInputEmail1');
    const passwordInput = signupForm.querySelector('#exampleInputPassword1');
    const passwordInput2 = signupForm.querySelector('#exampleInputPassword2');

    const emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/gm;
    const passwordRegExp = /[0-9a-zA-Z!@#$%^&*]{6,}/gm;

    if (usernameInput.value.length > 3) {
      usernameInput.classList.add('is-valid');
      if (usernameInput.classList.contains('is-invalid')) {
        usernameInput.classList.remove('is-invalid');
      }
    } else {
      usernameInput.classList.add('is-invalid');
      if (usernameInput.classList.contains('is-valid')) {
        usernameInput.classList.remove('is-valid');
      }
    }

      const validEmail = emailRegExp.test(emailInput.value);
      if (validEmail) {
        emailInput.classList.add('is-valid');
        if (emailInput.classList.contains('is-invalid')) {
          emailInput.classList.remove('is-invalid');
        }
      } else {
        emailInput.classList.add('is-invalid');  
        if (emailInput.classList.contains('is-valid')) {
          emailInput.classList.remove('is-valid');
        }  
      }

    const validPassword = passwordRegExp.test(passwordInput.value);
    if (validPassword) {
      passwordInput.classList.add('is-valid');
      if (passwordInput.classList.contains('is-invalid')) {
        passwordInput.classList.remove('is-invalid');
      }
    } else {
      passwordInput.classList.add('is-invalid'); 
      if (passwordInput.classList.contains('is-valid')) {
        passwordInput.classList.remove('is-valid');
      }     
    }

      if (passwordInput.value === passwordInput2.value) {
        passwordInput2.classList.add('is-valid');
        if (passwordInput2.classList.contains('is-invalid')) {
          passwordInput2.classList.remove('is-invalid');
        }
      } else {
        passwordInput2.classList.add('is-invalid');    
        if (passwordInput2.classList.contains('is-valid')) {
          passwordInput2.classList.remove('is-valid');
        }   
      }

    if (usernameInput.classList.contains('is-valid') && emailInput.classList.contains('is-valid') && passwordInput.classList.contains('is-valid') && passwordInput2.classList.contains('is-valid') ) {
      signupForm.classList.add('was-validated');
      const signupResponse = await fetch('/users/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
      const result = await signupResponse.json();
      if (result.status === 'notOk') {
        const registrationDiv = document.querySelector('#registration');
        registrationDiv.innerHTML += `
        <div class="alert alert-danger mt-3" role="alert">
        Ошибка! Поверьте введенные данные!
      </div>`
      } else if (result.status === 'ok') {
        signupForm.remove();
        const registrationDiv = document.querySelector('#registration');
        registrationDiv.innerHTML += `
        <div class="alert alert-success mt-3" role="alert">
        ВЫ ЗАРЕГИСТРИРОВАНЫ 
      </div><br><a href="/" class="btn btn-success">Main page</a>`
      }
    }
  })
}
