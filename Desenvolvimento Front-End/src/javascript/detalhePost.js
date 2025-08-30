document.addEventListener('DOMContentLoaded', async function () {
    const postDetails = document.getElementById('postDetails');
    const contatarButton = document.getElementById('contatarButton');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Mostrar menu correto (logado ou visitante)
    if (userLogado) {
        document.getElementById('menu-antigo').classList.add('hidden');
        document.getElementById('menu-novo').classList.remove('hidden');
        document.getElementById('profileName').textContent = userLogado.nome;
        document.getElementById('profileImage').src = userLogado.profileImage || '../img/pessoa sem foto.png';
    }

    if (!postId) {
        postDetails.innerHTML = `<p class="text-center text-red-500">
            Nenhum post selecionado. Volte para a página de postagens e escolha um.
        </p>`;
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
        if (!response.ok) throw new Error(`Erro ao buscar post. Status: ${response.status}`);
        const post = await response.json();

        // Formatando data e hora no formato brasileiro
        const dataCriacao = post.data
            ? new Date(post.data).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
              })
            : 'Data não informada';

        const nomeUsuario = post.usuario?.nome || 'Desconhecido';
        const emailUsuario = post.usuario?.email || '';
        const imagem = post.imagem || '../img/Sem Foto.png';

        postDetails.innerHTML = `
            <div class="overflow-hidden rounded-xl">
                <img class="w-full h-64 object-cover bg-fundo1" src="${imagem}" alt="Imagem da ocorrência">
            </div>
            <h1 class="text-2xl font-bold text-neutral-950">${post.titulo || 'Sem título'}</h1>
            <p class="text-neutral-700">Data: ${dataCriacao}</p>
            <p class="text-neutral-700">Usuário: ${nomeUsuario}</p>
            <p class="text-neutral-800 mt-4">${post.descricao || 'Sem descrição disponível.'}</p>
            <p class="text-neutral-700">Tipo: ${post.tipo || 'Não especificado'}</p>
            <p class="text-neutral-700">Categoria: ${post.categoria || 'Não especificada'}</p>
            <p class="text-neutral-700">Localização: ${post.localizacao || 'Não informada'}</p>
            <div id="acoesPost" class="mt-6 flex gap-3"></div>
        `;

        // Mostrar botões de editar/excluir apenas se o post for do usuário logado
        if (userLogado && post.usuario?.id === userLogado.id) {
            const acoes = document.getElementById('acoesPost');

            const editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar';
            editarBtn.className = 'px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500';
            editarBtn.addEventListener('click', () => {
                window.location.href = `editPost.html?id=${post.id}`;
            });

            const excluirBtn = document.createElement('button');
            excluirBtn.textContent = 'Excluir';
            excluirBtn.className = 'px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-white';
            excluirBtn.addEventListener('click', async () => {
                if (confirm('Deseja realmente excluir este post?')) {
                    try {
                        const delResponse = await fetch(`http://localhost:8080/ocorrencias/deletar/${post.id}`, {
                            method: 'DELETE'
                        });

                        if (!delResponse.ok) {
                            throw new Error(`Erro ao deletar post. Status: ${delResponse.status}`);
                        }

                        alert('Post excluído com sucesso!');
                        window.location.href = 'postagens.html';
                    } catch (err) {
                        alert('Erro ao deletar post: ' + err.message);
                    }
                }
            });

            acoes.appendChild(editarBtn);
            acoes.appendChild(excluirBtn);
        }

        // Ação para contatar usuário (abre email)
        if (emailUsuario && contatarButton) {
            contatarButton.addEventListener('click', () => {
                const mailtoLink = `mailto:${emailUsuario}?subject=Contato sobre sua postagem no SAC&body=Olá ${nomeUsuario}, vi sua postagem e gostaria de conversar.`;
                window.location.href = mailtoLink;
            });
        } else {
            contatarButton.disabled = true;
            contatarButton.classList.add('opacity-50', 'cursor-not-allowed');
            contatarButton.title = 'Usuário não disponível para contato.';
        }

    } catch (error) {
        postDetails.innerHTML = `<p class="text-center text-red-500">
            Ocorreu um erro ao carregar a postagem.<br>
            <small>${error.message}</small>
        </p>`;
    }
});
