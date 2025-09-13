document.addEventListener('DOMContentLoaded', async function() {
    const postId = new URLSearchParams(window.location.search).get('id');
    const form = document.getElementById('editPostForm');
    const token = localStorage.getItem('authToken');
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!postId || !token || !usuario) {
        window.location.href = 'postagens.html';
        return;
    }

    // Load post data
    try {
        const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
        const post = await response.json();

        // Verify ownership
        if (post.usuario.id !== usuario.id) {
            alert('Você não tem permissão para editar esta postagem');
            window.location.href = 'postagens.html';
            return;
        }

        // Fill form with post data
        document.getElementById('titulo').value = post.titulo;
        document.getElementById('tipo').value = post.tipo;
        // ... fill other fields ...
    } catch (error) {
        console.error('Erro ao carregar postagem:', error);
        alert('Erro ao carregar dados da postagem');
        window.location.href = 'postagens.html';
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const updatedPost = {
            titulo: document.getElementById('titulo').value,
            tipo: document.getElementById('tipo').value,
            // ... get other field values ...
        };

        try {
            const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedPost)
            });

            if (response.ok) {
                alert('Postagem atualizada com sucesso!');
                window.location.href = `detalhePost.html?id=${postId}`;
            } else {
                throw new Error('Erro ao atualizar postagem');
            }
        } catch (error) {
            alert('Erro ao atualizar postagem: ' + error.message);
        }
    });
});
