document.addEventListener('DOMContentLoaded', function() {
    // Agora o evento será associado somente depois que o DOM for totalmente carregado
    const cadastroForm = document.getElementById('cadastroForm');

    if (cadastroForm) {  // Verifique se o formulário existe no DOM
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let email = document.getElementById('email').value.trim();
            let senha = document.getElementById('senha').value.trim();
            let confirmarSenha = document.getElementById('confirmarSenha').value.trim();

            if (!email || !senha || !confirmarSenha) {
                alert('Preencha todos os campos!');
                return;
            }

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            // Recupera os dados temporários do cadastro
            let dadosTemp = JSON.parse(localStorage.getItem('cadastroTemp'));
            if (dadosTemp) {
                alert('Erro ao recuperar dados do cadastro. Retornando ao início.');
                window.location.href = 'cadastro-1.html';
                return;
            }

            let dadosCadastroCompleto = {
                ...dadosTemp, // Dados do cadastro anterior (nome, CPF, etc.)
                email,
                senha
            };

            // Envia os dados para o servidor usando fetch
            fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosCadastroCompleto), // Envia todos os dados juntos
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar os dados');
                }
                return response.json();
            })
            .then(data => {
                // Caso a resposta seja bem-sucedida
                console.log('Cadastro completo com sucesso:', data);
                localStorage.removeItem('cadastroTemp'); // Remove os dados temporários
                alert('Cadastro realizado com sucesso!');
                window.location.href = 'login.html'; // Redireciona para a página de login
            })
            .catch(error => {
                console.error('Erro ao completar o cadastro:', error);
                alert('Ocorreu um erro ao tentar completar o cadastro. Tente novamente.');
            });
        });
    } else {
        console.error('Formulário não encontrado no DOM');
    }
});
