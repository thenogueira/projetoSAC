document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Captura os dados do formulário
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        // Validação básica
        if (!email || !senha) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            // Envia os dados para o backend para validação
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                // Login bem-sucedido
                const data = await response.json();
                alert('Login realizado com sucesso!');
                console.log('Usuário logado:', data);
                window.location.href = 'dashboard.html'; // Redireciona para a página principal
            } else {
                // Login falhou
                const error = await response.json();
                alert(`Erro no login: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            alert('Erro ao realizar login. Tente novamente mais tarde.');
        }
    });
});
