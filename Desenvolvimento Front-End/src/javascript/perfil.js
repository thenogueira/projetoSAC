document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('authToken');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

    const urlParams = new URLSearchParams(window.location.search);
    const idDoUsuarioUrl = urlParams.get('id');

    // Elementos do DOM
    const userPostsContainer = document.getElementById('userPostsContainer');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileContainer = document.getElementById('editProfileContainer');
    const editDescription = document.getElementById('editDescription');
    const profileDescEl = document.getElementById('profileMainDescription');
    const containerComentarios = document.getElementById('containerComentarios');

    const profileImageEls = document.querySelectorAll('#profileImageEls');
    const profileNameEls = document.querySelectorAll('.profileName');

    const btnPostagens = document.getElementById('contactarPerfil'); // Postagens
    const btnComentarios = document.getElementById('comentariosPerfil'); // Comentários

    const caminhoFotoPadrao = '../img/defaultImagePerfil.png';

    let usuario = usuarioLogado;

    // Buscar outro usuário pelo ID da URL
    if (idDoUsuarioUrl && usuarioLogado?.id != Number(idDoUsuarioUrl)) {
        try {
            const resp = await fetch(`http://localhost:8080/usuarios/listar/${idDoUsuarioUrl}`, {
                headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' }
            });
            if (resp.ok) usuario = await resp.json();
        } catch {
            usuario = usuarioLogado;
        }
    }

    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    // Verificar se é o próprio perfil
    const isOwnProfile = (usuario.id || usuario.usuarioId) === (usuarioLogado.id || usuarioLogado.usuarioId);

    // Função para preencher dados do perfil
    function fillProfileUI(data) {
        profileDescEl.textContent = data.descricao || 'Sem descrição disponível.';

        profileImageEls.forEach(img => {
            img.src = (data.fotoPerfil && data.fotoPerfil.trim() !== "") ? data.fotoPerfil : caminhoFotoPadrao;
            img.alt = data.nome || 'Usuário';
        });

        profileNameEls.forEach(el => el.textContent = data.nome || 'Usuário');

        if (editProfileBtn) {
            editProfileBtn.style.display = 'block';
            if (isOwnProfile) {
                editProfileBtn.textContent = 'Editar Perfil';
                editProfileBtn.style.cursor = 'pointer';
            } else {
                editProfileBtn.textContent = `ID do Perfil: ${data.id || 'Desconhecido'}`;
                editProfileBtn.style.cursor = 'default';
            }
        }
    }

    fillProfileUI(usuario);

    // Botão de editar (somente para o próprio usuário)
    if (isOwnProfile && editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            editProfileContainer.classList.toggle('hidden');
            editDescription.value = usuario.descricao || '';
            editPhoto.value = ''; // Limpa o input de foto ao abrir
        });
    }

    // Salvar alterações (somente descrição)
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        try {
            const file = document.getElementById('fileInput')?.files[0];
            let base64Image = null;

            // Se houver imagem, converte pra Base64
            if (file) {
                base64Image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]); // remove o prefixo data:image/jpeg;base64,
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            const updateData = {
                descricao: editDescription.value,
                fotoPerfil: base64Image // manda como string base64
            };

            console.log("Enviando para o backend:", updateData);

            const resp = await fetch(`http://localhost:8080/usuarios/atualizar/${usuario.id || usuario.usuarioId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!resp.ok) throw new Error('Erro ao atualizar perfil');

            const updatedUser = await resp.json();

            // Atualiza UI e localStorage
            usuario = updatedUser;
            fillProfileUI(updatedUser);
            localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));

            editProfileContainer.classList.add('hidden');
            alert('Perfil atualizado com sucesso!');
        } catch (err) {
            console.error(err);
            alert('Erro ao atualizar perfil. Tente novamente.');
        }
    });
}



    

    // ======= Buscar e renderizar postagens do usuário =======
    async function fetchUserPosts() {
        try {
            const resp = await fetch('http://localhost:8080/ocorrencias/listar', {
                headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' }
            });
            if (!resp.ok) throw new Error(`Erro ao buscar postagens. Status: ${resp.status}`);
            const posts = await resp.json();
            const userId = usuario.id || usuario.usuarioId;
            return posts.filter(p => p.usuario && (p.usuario.id === userId || p.usuarioId === userId));
        } catch {
            return [];
        }
    }

    async function fetchUserComments() {
    try {
        const resp = await fetch(`http://localhost:8080/comentarios/usuario/${usuario.id || usuario.usuarioId}`, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        });
        if (!resp.ok) throw new Error(`Erro ao buscar comentários. Status: ${resp.status}`);
        return await resp.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}


    function renderUserPosts(posts) {
        userPostsContainer.innerHTML = '';

        if (!posts || posts.length === 0) {
            userPostsContainer.innerHTML = '<p class="text-sm text-gray-500 col-span-full text-center">Nenhuma postagem encontrada.</p>';
            return;
        }

        posts.forEach(post => {
            const postId = encodeURIComponent(post.id || '');
            const nomeUsuario = post.usuario?.nome || 'Usuário Desconhecido';

            let dataFormatada = "Data não informada";
            const dataCampo = post.data_criacao || post.data || post.createdAt;
            if (dataCampo) {
                const dataObj = new Date(dataCampo);
                if (!isNaN(dataObj.getTime())) {
                    dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: "2-digit", month: "2-digit", year: "numeric" });
                }
            }

            let imagemSrc = '../img/Sem Foto.png';
            if (post.imagem) {
                try {
                    if (Array.isArray(post.imagem) && post.imagem.length > 0) imagemSrc = post.imagem[0];
                    else {
                        const imgs = JSON.parse(post.imagem);
                        if (Array.isArray(imgs) && imgs.length > 0) imagemSrc = imgs[0];
                    }
                } catch {
                    if (typeof post.imagem === 'string' && post.imagem.trim() !== '') imagemSrc = post.imagem;
                }
            }

            const postElement = document.createElement('figure');
            postElement.classList.add('w-75', 'h-65', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto', 'cursor-pointer');

            postElement.innerHTML = `
                <div class="w-full h-full overflow-hidden rounded-t-xl">
                    <img class="w-full h-full object-cover bg-fundo1" src="${imagemSrc}" alt="${post.titulo || 'Postagem'}" onerror="this.src='../img/Sem Foto.png'">
                </div>
                <div class="rounded-b-xl drop-shadow-black shadow-lg">
                    <figcaption class="pl-2 pt-4 pb-0.5 text-neutral-950">${post.titulo || ''}</figcaption>
                    <figcaption class="pl-2 pb-0.5 text-neutral-700">Data: ${dataFormatada}</figcaption>
                    <figcaption class="pl-2 pb-6 text-neutral-700">Usuário: ${nomeUsuario}</figcaption>
                </div>
            `;

            postElement.addEventListener('click', () => {
                window.location.href = `detalhePost.html?id=${postId}`;
            });

            userPostsContainer.appendChild(postElement);
        });
    }

    // Função para criar comentário no layout desejado
    function createCommentElementLayout(usuarioComentador, comentario, idComentario) {
        const commentEl = document.createElement('div');
        commentEl.classList.add('flex', 'flex-col', 'gap-2', 'w-full', 'mb-4');

        commentEl.innerHTML = `
            <div class="flex gap-4 items-center">
                <div class="rounded-full overflow-hidden w-14 h-14 bg-gray-300">
                    <img class="object-cover w-full h-full" src="${usuarioComentador.fotoPerfil || '../img/defaultImagePerfil.png'}" alt="${usuarioComentador.nome || 'Usuário'}" width="50" height="50">
                </div>
                
                <div class="flex flex-col">
                    <span class="text-xl">${usuarioComentador.nome || 'Usuário'}</span>
                    <span>ID Comentário: #${idComentario}</span>
                </div>
            </div>
            
            <div class="border-1 border-black rounded-2xl p-2">
                <p contenteditable="true" class="editableComentario">${comentario}</p>
            </div>
        `;
        return commentEl;
    }

    function renderUserComments(comments) {
    containerComentarios.innerHTML = '';

    // Renderizar comentários existentes
    if (!comments || comments.length === 0) {
        containerComentarios.innerHTML = '<p class="text-sm text-gray-500 col-span-full text-center">Nenhum comentário encontrado.</p>';
    } else {
        comments.forEach(c => {
            const commentEl = createCommentElementLayout(c.usuario || {nome: 'Usuário', fotoPerfil: '../img/defaultImagePerfil.png'}, c.texto, c.id);
            containerComentarios.appendChild(commentEl);
        });
    }

    // Adicionar eventos de denúncia aos comentários renderizados
    const denunciarBtns = containerComentarios.querySelectorAll('.denunciarComentario');
    denunciarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const comentarioId = btn.getAttribute('data-id');

            // Salva o tipo e ID da denúncia no localStorage
            localStorage.setItem('denunciaTipo', 'comentario');
            localStorage.setItem('denunciaId', comentarioId);

            // Redireciona para a página de denúncias
            window.location.href = 'denuncias.html';
        });
    });


    // Botão "Adicionar Comentário" apenas em perfis de outros usuários
    if (!isOwnProfile) {
    const addBtnContainer = document.createElement('div');
    addBtnContainer.classList.add('flex', 'flex-col', 'gap-2', 'w-full', 'items-center', 'justify-center', 'mt-4');

    addBtnContainer.innerHTML = `
        <button id="addComentario" class="border-1 px-6 py-4 rounded-xl hover:bg-gray-300">Adicionar comentário</button>
    `;
    containerComentarios.appendChild(addBtnContainer);

    const addComentarioBtn = addBtnContainer.querySelector('#addComentario');

    addComentarioBtn.addEventListener('click', () => {
        // Criar layout para novo comentário
        const novoComentarioLayout = document.createElement('div');
        novoComentarioLayout.classList.add('flex', 'flex-col', 'gap-2', 'w-full');

        novoComentarioLayout.innerHTML = `
            <div class="flex gap-4 items-center">
                <div class="rounded-full overflow-hidden w-14 h-14 bg-gray-300">
                    <img class="object-cover w-full h-full" src="${usuarioLogado.fotoPerfil || '../img/defaultImagePerfil.png'}" alt="${usuarioLogado.nome || 'Usuário'}" width="50" height="50">
                </div>
                <div class="flex flex-col">
                    <span class="text-xl">${usuarioLogado.nome || 'Usuário'}</span>
                    <span>ID Comentário: #--</span>
                </div>
            </div>
            <div class="border-1 border-black rounded-2xl p-2 flex flex-col gap-2">
                <textarea id="novoComentarioTexto" class="w-full border p-2 rounded" placeholder="Escreva seu comentário..."></textarea>
                <button id="enviarComentarioBtn" class="border-1 px-6 py-2 rounded-xl hover:bg-gray-300 self-end">Enviar</button>
            </div>
        `;

        // Substitui o botão pelo formulário
        addBtnContainer.replaceWith(novoComentarioLayout);

        const enviarBtn = novoComentarioLayout.querySelector('#enviarComentarioBtn');
        enviarBtn.addEventListener('click', async () => {
            const texto = document.getElementById('novoComentarioTexto').value.trim();
            if (!texto) return;

            try {
                const resp = await fetch('http://localhost:8080/comentarios', {
                    method: 'POST',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        texto: texto,
                        usuarioId: usuarioLogado.id,
                        usuarioAlvoId: usuario.id
                    })
                });

                if (!resp.ok) throw new Error('Erro ao enviar comentário');
                const novoComentario = await resp.json();

                // Cria o elemento do comentário recém-enviado
                const commentEl = createCommentElementLayout(
                    usuarioLogado,
                    novoComentario.texto,
                    novoComentario.id
                );

                // Substitui o formulário pelo comentário
                novoComentarioLayout.replaceWith(commentEl);

                // Adiciona o botão novamente abaixo
                containerComentarios.appendChild(addBtnContainer);

                alert('Comentário enviado com sucesso!');
            } catch (err) {
                console.error(err);
                alert('Erro ao enviar comentário. Tente novamente.');
            }
        });




        });
    }
}

// Função auxiliar para renderizar comentários existentes com o mesmo layout
function createCommentElementLayout(usuarioComent, texto, id) {
    const div = document.createElement('div');
    div.classList.add('flex', 'flex-col', 'gap-2', 'w-full', 'mb-4');

    div.innerHTML = `
        <div class="flex gap-4 items-center justify-between">
            <div class="flex gap-2">
                <div class="rounded-full overflow-hidden w-14 h-14 bg-gray-300 ">
                    <img class="object-cover w-full h-full" src="${usuarioComent.fotoPerfil || '../img/defaultImagePerfil.png'}" alt="${usuarioComent.nome || 'Usuário'}" width="50" height="50">
                
                </div>
                <div class="flex flex-col">
                    <span class="text-xl">${usuarioComent.nome || 'Usuário'}</span>
                    <span>ID Comentário: #${id || '--'}</span>
                </div>
            </div>

            <a href="#" class="denunciarComentario" data-id="${id}">
                <span class="icon">
                    <i class="fa-solid fa-circle-exclamation text-red-500 text-2xl"></i>
                </span>
            </a>
        </div>

        

        <div class="border-1 border-black rounded-2xl p-2">
            <p>${texto}</p>
        </div>
    `;
    return div;
}

    async function enviarComentario(texto) {
        try {
            // Pegando a primeira postagem para associar o comentário
            const posts = await fetchUserPosts();
            if (!posts.length) return alert('Não há postagens para comentar.');

            const ocorrenciaId = posts[0].id;

            const resp = await fetch('http://localhost:8080/comentarios/criar', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario_id: usuarioLogado.id,
                    ocorrencia_id: ocorrenciaId,
                    texto: texto
                })
            });

            if (!resp.ok) throw new Error('Erro ao enviar comentário');

            const comentarioCriado = await resp.json();

            const novoComentarioEl = createCommentElementLayout(usuarioLogado, comentarioCriado.texto, comentarioCriado.id);
            containerComentarios.prepend(novoComentarioEl);

            alert('Comentário enviado com sucesso!');
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar comentário. Tente novamente.');
        }
    }

    // Eventos dos botões
    btnPostagens.addEventListener('click', async () => {
        containerComentarios.classList.add('hidden'); // esconde comentários
        userPostsContainer.classList.remove('hidden'); // mostra posts
        const posts = await fetchUserPosts();
        renderUserPosts(posts);
    });

    btnComentarios.addEventListener('click', async () => {
        userPostsContainer.classList.add('hidden'); // esconde posts
        containerComentarios.classList.remove('hidden'); // mostra comentários
        containerComentarios.classList.add('grid');
        const comments = await fetchUserComments();
        renderUserComments(comments);
    });

    // Carregar posts inicialmente
    const initialPosts = await fetchUserPosts();
    renderUserPosts(initialPosts);
});
enviarBtn.addEventListener('click', async () => {
    const texto = document.getElementById('novoComentarioTexto').value.trim();
    if (!texto) return;

    try {
        const resp = await fetch('http://localhost:8080/comentarios', { // ✅ endpoint correto
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                texto: texto,
                usuarioId: usuarioLogado.id,        // ✅ nomes corretos
                usuarioAlvoId: usuario.id           // ✅ nomes corretos
            })
        });

        if (!resp.ok) throw new Error('Erro ao enviar comentário');
        const novoComentario = await resp.json();

        // Atualizar layout
        novoComentarioLayout.querySelector('span:nth-child(2)').textContent = `ID Comentário: #${novoComentario.id}`;
        novoComentarioLayout.querySelector('textarea').remove();
        novoComentarioLayout.querySelector('button').remove();

        const p = document.createElement('p');
        p.textContent = novoComentario.texto;
        p.classList.add('break-words');
        novoComentarioLayout.querySelector('.border-1').appendChild(p);

        alert('Comentário enviado com sucesso!');
    } catch (err) {
        console.error(err);
        alert('Erro ao enviar comentário. Tente novamente.');
    }
});
