document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastroForm');

    // Recupera os dados temporários do localStorage
    const dadosTemp = JSON.parse(localStorage.getItem('cadastroTemp'));
    if (!dadosTemp) {
        alert('Erro: Nenhum dado encontrado da primeira etapa. Retornando ao início.');
        window.location.href = 'cadastro-1.html';
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const email = document.getElementById('email').value.trim();
        const senha_hash = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
        const tipoConta = "USUARIO";
        const statusConta = "ATIVA";

        // Validação básica
        if (!email || !senha_hash || !confirmarSenha) {
            alert('Preencha todos os campos!');
            return;
        }

        if (senha_hash !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        // Combina os dados da primeira e segunda etapa
        const dadosCompletos = { email, senha_hash, tipoConta, ...dadosTemp, statusConta};

        try {
            // Envia os dados para o backend
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosCompletos),
            });

            if (response.ok) {
                alert('Cadastro concluído com sucesso!');
                localStorage.removeItem('cadastroTemp'); // Remove os dados temporários
                form.reset(); // Limpa o formulário
                window.location.href = 'login.html'; // Redireciona para a página de login
            } else {
                // Verifica se a resposta é JSON antes de tentar interpretá-la
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const error = await response.json();
                    alert(`Erro ao salvar cadastro: ${error.message}`);
                } else {
                    const errorText = await response.text();
                    alert(`Erro ao salvar cadastro: ${errorText}`);
                }
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao salvar cadastro. Tente novamente mais tarde.');
        }
    });
});