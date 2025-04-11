document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert('Preencha todos os campos!');
        return;
    }

    let usuario = verificarLogin(email, senha); // Chama a função do CRUD

    if (usuario) {
        alert('Login realizado com sucesso!');
        window.location.href = 'cadastro-1.html'; // Redireciona para a página principal
    } else {
        alert('Email ou senha incorretos!');
    }
});
