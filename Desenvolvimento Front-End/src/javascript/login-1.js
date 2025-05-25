document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const email = document.getElementById('email').value.trim();
        const senha_hash = document.getElementById('senha_hash').value.trim();

        if (!email || !senha_hash) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha_hash }),
            });

                if (response.ok) {
        const data = await response.json();
        console.log('Token recebido:', data.token); // Log para depuração
        console.log('Objeto completo retornado:', data); 

        // Armazena o token no localStorage
        localStorage.setItem('authToken', data.token);

        // Armazena os dados do usuário (INCLUI o ID REAL do banco)
        localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));

        alert('Login realizado com sucesso!');
        window.location.href = 'postagens.html'; // Redireciona para a página principal
            } else {
                const error = await response.json();
                alert(`Erro no login: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            alert('Erro ao realizar login. Tente novamente mais tarde.');
        }
    });
});
