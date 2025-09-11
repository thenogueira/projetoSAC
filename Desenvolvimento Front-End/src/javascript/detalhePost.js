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
function renderPostDetails(post) {
    const dataFormatada = post.data_criacao ? new Date(post.data_criacao).toLocaleDateString() : 'Não informada';
    const nomeUsuario = post.usuario?.nome || 'Usuário não identificado';
    const loggedUser = JSON.parse(localStorage.getItem('usuarioLogado'));
    const isOwner = loggedUser && loggedUser.id === post.usuario?.id;

    document.getElementById('postDetails').innerHTML = `
        <h1 class="text-3xl font-bold mb-6">${post.titulo}</h1>
        
        <div class="mb-8">
            <img src="${post.imagem || '../img/Sem Foto.png'}" 
                 alt="Imagem da postagem" 
                 class="w-full h-96 object-cover rounded-xl">
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="space-y-2">
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Categoria:</strong> ${post.categoria}</p>
                <p><strong>Tipo:</strong> ${post.tipo}</p>
            </div>
            <div class="space-y-2">
                <p><strong>Usuário:</strong> ${nomeUsuario}</p>
                <p><strong>Localização:</strong> ${post.localizacao}</p>
                <p><strong>Urgência:</strong> <span class="${getUrgencyClass(post.urgencia)}">${post.urgencia}</span></p>
            </div>
        </div>
        
        <div class="border-t pt-6">
            <h2 class="text-xl font-semibold mb-4">Descrição</h2>
            <p class="text-gray-700 whitespace-pre-wrap">${post.descricao}</p>
        </div>

        ${isOwner ? `
        <div class="flex gap-4 mt-6">
            <a href="editarPost.html?id=${post.id}" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Editar Postagem
            </a>
            <button id="deletePost" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Deletar Postagem
            </button>
        </div>
        ` : ''}
    `;

    if (isOwner) {
        document.getElementById('deletePost')?.addEventListener('click', () => deletePost(post.id));
    }
}

function getUrgencyClass(urgencia) {
    if (!urgencia) return 'text-gray-500';
    
    const classes = {
        'ALTA': 'text-red-600 font-bold',
        'MEDIA': 'text-yellow-600 font-bold',
        'BAIXA': 'text-green-600 font-bold'
    };
    
    return classes[urgencia.toUpperCase()] || 'text-gray-500';
}

async function deletePost(postId) {
    if (!confirm('Tem certeza que deseja deletar esta postagem?')) return;

    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Postagem deletada com sucesso!');
            window.location.href = 'postagens.html';
        } else {
            throw new Error('Erro ao deletar postagem');
        }
    } catch (error) {
        alert('Erro ao deletar postagem: ' + error.message);
    }
}
