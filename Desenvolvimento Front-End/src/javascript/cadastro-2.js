document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastroForm');

    const dadosCadastro = JSON.parse(localStorage.getItem('usuarioCadastro'));
    if (!dadosCadastro) {
        mostrarMensagem('Erro: Nenhum dado encontrado da primeira etapa. Retornando ao início.', 'erro');
        setTimeout(() => {
            window.location.href = 'cadastro-1.html';
        }, 2000);
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
            mostrarMensagem('Preencha todos os campos!', 'erro');
            return;
        }

        if (senha_hash !== confirmarSenha) {
            mostrarMensagem('As senhas não coincidem!', 'erro');
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
                mostrarMensagem('Cadastro concluído com sucesso!', 'sucesso');
                form.reset();

                // Salvar o ID do usuário no localStorage
                localStorage.setItem('usuarioLogado', JSON.stringify({ id: userId, email }));

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                const error = await response.json();
                mostrarMensagem(`Erro ao salvar cadastro: ${error.message}`, 'erro');
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            mostrarMensagem('Erro ao salvar cadastro. Tente novamente mais tarde.', 'erro');
        }
    });
});

function mostrarMensagem(texto, tipo = 'erro') {
    const modalFundo = document.getElementById('fundo');
    const modalCaixa = document.getElementById('modalCaixa');
    const modalTexto = document.getElementById('modalMensagem');
    modalTexto.textContent = texto;
    modalFundo.className = 'w-dvw h-dvh bg-black absolute opacity-50 z-50'
    modalCaixa.className = 'fixed inset-0 flex items-center justify-center z-50';
    modalTexto.className = tipo === 'erro'
        ? 'bg-red-100 text-red-800 px-8 py-6 rounded-xl text-center shadow-lg '
        : 'bg-green-100 text-green-800 px-8 py-6 rounded-xl text-center shadow-lg';
    modalCaixa.classList.remove('hidden');
    setTimeout(() => {
        modalCaixa.classList.add('hidden');
    }, 4000);

    modalFundo.classList.remove('hidden');
    setTimeout(() => {
        modalFundo.classList.add('hidden');
    }, 4000);
}