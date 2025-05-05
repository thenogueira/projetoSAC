document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('postForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve user data from localStorage
        const userData = JSON.parse(localStorage.getItem('cadastroTemp'));
        if (!userData || !userData.nome) {
            alert('Usuário não identificado. Faça login ou cadastre-se.');
            return;
        }

        // Capture form data
        const titulo = document.getElementById('titulo').value.trim();
        const categoria = document.getElementById('categoria').value.trim();
        const tipo = document.getElementById('tipo').value.trim();
        const localizacao = document.getElementById('localizacao').value.trim();
        const urgencia = document.getElementById('urgencia').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        // Validate form data
        if (!titulo || !categoria || !tipo || !localizacao || !urgencia || !descricao) {
            alert('Preencha todos os campos!');
            return;
        }

        // Create post object
        const post = {
            usuario: userData.nome,
            titulo,
            categoria,
            tipo,
            localizacao,
            urgencia,
            descricao,
            data: new Date().toISOString(),
            
        };

        try {
            // Send post data to the backend API
            const response = await fetch('http://localhost:8080/ocorrencias/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                alert('Postagem criada com sucesso!');
                form.reset(); // Clear the form
                window.location.href = 'postagens.html'; // Redirect to the posts page
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