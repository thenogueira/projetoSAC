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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const email = document.getElementById('email').value.trim();
        const senha_hash = document.getElementById('senha_hash').value.trim();

        if (!email || !senha_hash) {
            mostrarMensagem('Preencha todos os campos!', 'erro');
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

                mostrarMensagem('Login realizado com sucesso!', 'sucesso');
                setTimeout(() => {
                    window.location.href = 'postagens.html'; // Redireciona para a página principal
                }, 1500);
            } else {
                const error = await response.json();
                mostrarMensagem(`Erro no login: ${error.message}`, 'erro');
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            mostrarMensagem('Erro ao realizar login. Tente novamente mais tarde.', 'erro');
        }
    });
});
