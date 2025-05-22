document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastroForm');

    const dadosCadastro = JSON.parse(localStorage.getItem('usuarioCadastro'));
    if (!dadosCadastro) {
        alert('Erro: Nenhum dado encontrado da primeira etapa. Retornando ao início.');
        window.location.href = 'cadastro-1.html';
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha_hash = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
        const tipoConta = dadosCadastro.tipoConta;
        const statusConta = dadosCadastro.statusConta;

        if (!email || !senha_hash || !confirmarSenha) {
            alert('Preencha todos os campos!');
            return;
        }

        if (senha_hash !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        // Gerar um ID único para o usuário
        const userId = `user_${Date.now()}`; // Exemplo: user_1681234567890

        const dadosCompletos = { id: userId, email, senha_hash, tipoConta, ...dadosCadastro, statusConta };

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosCompletos),
            });

            if (response.ok) {
                alert('Cadastro concluído com sucesso!');
                form.reset();

                // Salvar o ID do usuário no localStorage
                localStorage.setItem('usuarioLogado', JSON.stringify({ id: userId, email }));

                window.location.href = 'login.html';
            } else {
                const error = await response.json();
                alert(`Erro ao salvar cadastro: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao salvar cadastro. Tente novamente mais tarde.');
        }
    });
});