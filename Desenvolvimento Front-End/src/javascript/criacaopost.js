document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('postForm');
    const toggleLocalizacaoBtn = document.getElementById('toggleLocalizacaoBtn');
    const localizacaoContainer = document.getElementById('localizacaoContainer');

    // Alterna a visibilidade do contêiner de localização
    toggleLocalizacaoBtn.addEventListener('click', function () {
        if (localizacaoContainer.classList.contains('hidden')) {
            localizacaoContainer.classList.remove('hidden');
            toggleLocalizacaoBtn.textContent = 'Fechar Localização';
        } else {
            localizacaoContainer.classList.add('hidden');
            toggleLocalizacaoBtn.textContent = 'Inserir Localização';
        }
    });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const usuarioData = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioData || !usuarioData.id) {
            alert('Usuário não identificado. Faça login ou cadastre-se.');
            window.location.href = 'login.html';
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Usuário não autenticado. Faça login novamente.');
            window.location.href = 'login.html';
            return;
        }

        console.log('ID do usuário logado:', usuarioData.id); // Log para depuração

        const titulo = document.getElementById('titulo').value.trim();
        const categoria = document.getElementById('categoria').value.trim();
        const tipo = document.getElementById('tipo').value.trim();
        const estado = document.getElementById('estado').value.trim();
        const lugar = document.getElementById('casa').value.trim();
        const estado_doacao = "DISPONIVEL"; // Valor fixo para o estado da doação
        const descricao = document.getElementById('descricao').value.trim();
        const imagem = document.getElementById('imagem').files[0];

        if (!titulo || !categoria || !tipo || !estado || !lugar || !descricao) {
            alert('Preencha todos os campos!');
            return;
        }

        let imagemBase64 = null;
        if (imagem) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagemBase64 = e.target.result;
                saveAndSendPost();
            };
            reader.readAsDataURL(imagem);
        } else {
            saveAndSendPost();
        }

        async function saveAndSendPost() {
            const post = {
                usuario_id: usuarioData.id, // Use o ID do usuário logado
                titulo,
                descricao,
                tipo,
                categoria,
                localizacao: { estado, lugar },
                estado_doacao,
                imagem: imagemBase64,
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString(),
            };

            try {
                // Envia o post para o backend
                const response = await fetch('http://localhost:8080/ocorrencias/criar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
                    },
                    body: JSON.stringify(post),
                });

                if (response.ok) {
                    alert('Postagem criada com sucesso!');
                    form.reset();
                    window.location.href = 'postagens.html'; // Redireciona para a página de postagens
                } else {
                    const error = await response.json();
                    alert(`Erro ao criar postagem: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
                alert('Erro ao criar postagem. Tente novamente mais tarde.');
            }
        }
    });
});