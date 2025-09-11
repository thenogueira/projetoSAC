document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const form = document.getElementById('editPostForm');
    const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!postId) {
        alert('Nenhum post selecionado!');
        window.location.href = 'postagens.html';
        return;
    }

    // Busca dados do post
    try {
        const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
        if (!response.ok) throw new Error(`Erro ao buscar post. Status: ${response.status}`);
        const post = await response.json();

        // Só permite edição se for o criador
        if (!userLogado || !post.usuario || userLogado.id !== post.usuario.id) {
            alert('Você não tem permissão para editar este post!');
            window.location.href = 'postagens.html';
            return;
        }

        // Preenche formulário
        form.titulo.value = post.titulo || '';
        form.descricao.value = post.descricao || '';

    } catch (error) {
        alert('Erro ao carregar post: ' + error.message);
        window.location.href = 'postagens.html';
        return;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const updatedPost = {
            titulo: form.titulo.value.trim(),
            descricao: form.descricao.value.trim()
        };

        try {
            const putResponse = await fetch(`http://localhost:8080/ocorrencias/editar/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost)
            });

            if (!putResponse.ok) throw new Error(`Erro ao atualizar post: ${putResponse.status}`);
            alert('Post atualizado com sucesso!');
            window.location.href = 'postagens.html';

        } catch (err) {
            alert('Erro ao atualizar post: ' + err.message);
        }
    });
});