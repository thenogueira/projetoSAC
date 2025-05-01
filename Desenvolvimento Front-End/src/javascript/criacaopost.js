document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('postForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Captura os dados do formulário
        const titulo = document.getElementById('titulo').value.trim();
        const categoria = document.getElementById('categoria').value.trim();
        const tipo = document.getElementById('tipo').value.trim();
        const localizacao = document.getElementById('localizacao').value.trim();
        const urgencia = document.getElementById('urgencia').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        // Validação básica
        if (!titulo || !categoria || !tipo || !localizacao || !urgencia || !descricao) {
            alert('Preencha todos os campos!');
            return;
        }

        // Cria o objeto do post
        const post = {
            titulo,
            categoria,
            tipo,
            localizacao,
            urgencia,
            descricao,
            data: new Date().toISOString(), // Adiciona a data de criação
        };

        try {
            // Envia os dados para o backend
            const response = await fetch('http://localhost:8080/ocorrencias/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                alert('Postagem criada com sucesso!');
                form.reset(); // Limpa o formulário
            } else {
                const error = await response.json();
                alert(`Erro ao criar postagem: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao criar postagem. Tente novamente mais tarde.');
        }
    });
});