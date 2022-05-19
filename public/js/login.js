let tooglePassword = document.getElementById('showPassword');
let password = document.getElementById('password')
tooglePassword.addEventListener('click', function(e) {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type)
    this.classList.toggle("fa-eye")
    this.classList.toggle("fa-eye-slash")
}); 
 
