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

        const usuarioDataRaw = localStorage.getItem('usuarioLogado');
        let usuarioData;
        try {
            usuarioData = JSON.parse(usuarioDataRaw);
        } catch (error) {
            console.error('Erro ao analisar os dados do usuário:', error);
            alert('Usuário não identificado. Faça login ou cadastre-se.');
            window.location.href = 'login.html';
            return;
        }

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

        // Extrai o número do ID se ele estiver no formato "user_1747312194400"
        let usuarioId = usuarioData.id;
        if (typeof usuarioId === 'string' && usuarioId.startsWith('user_')) {
            usuarioId = parseInt(usuarioId.replace('user_', ''), 10);
        }

        console.log('ID do usuário logado (convertido):', usuarioId); // Log para depuração

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
                usuario: {
                    id: usuarioId
                },
                titulo,
                descricao,
                tipo,
                categoria,
                localizacao: `${estado}, ${lugar}`,
                estado_doacao,
                imagem: imagemBase64,
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString(),
            };

            console.log('Dados do post:', post); // Log para depuração
            console.log('JSON enviado:', JSON.stringify(post, null, 2));

            try {
                const response = await fetch('http://localhost:8080/ocorrencias/criar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(post),
                });

                if (response.ok) {
                    alert('Postagem criada com sucesso!');
                    form.reset();
                    window.location.href = 'postagens.html';
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
