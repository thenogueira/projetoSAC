// ====== Função de Modal Customizado ======
function mostrarModal(titulo, mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMensagem');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalIcon = document.getElementById('modalIcon');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Define ícone e cor conforme tipo
    let iconClass = 'fa-info-circle text-blue-500';
    if (tipo === 'sucesso') iconClass = 'fa-check-circle text-green-500';
    else if (tipo === 'erro') iconClass = 'fa-times-circle text-red-500';
    else if (tipo === 'aviso') iconClass = 'fa-exclamation-circle text-yellow-500';

    modalIcon.className = `fas ${iconClass} text-2xl mr-3 mt-1`;
    modalTitle.textContent = titulo;
    modalContent.textContent = mensagem;

    // Resetar botão do modal para o padrão
    modalCloseBtn.innerHTML = '';
    const btnOk = document.createElement('button');
    btnOk.textContent = 'OK';
    btnOk.className = 'px-4 py-2 bg-destaque text-white rounded-md';
    btnOk.onclick = () => modal.classList.add('hidden');
    modalCloseBtn.appendChild(btnOk);

    modal.classList.remove('hidden');
}

// ====== Função de Modal de Confirmação Personalizado ======
function mostrarModalConfirmacao(mensagem, callbackConfirmar) {
    const modal = document.getElementById('modalMensagem');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalIcon = document.getElementById('modalIcon');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Configurar modal de confirmação
    modalIcon.className = 'fas fa-question-circle text-blue-500 text-2xl mr-3 mt-1';
    modalTitle.textContent = 'SAC - Confirmação';
    modalContent.textContent = mensagem;

    // Criar botões personalizados
    modalCloseBtn.innerHTML = '';
    modalCloseBtn.className = 'flex justify-center gap-4 mt-4';
    
    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.className = 'px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100';
    btnCancelar.onclick = () => {
        modal.classList.add('hidden');
    };

    const btnConfirmar = document.createElement('button');
    btnConfirmar.textContent = 'Confirmar';
    btnConfirmar.className = 'px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50';
    btnConfirmar.onclick = async () => {
        modal.classList.add('hidden');
        await callbackConfirmar();
    };

    modalCloseBtn.appendChild(btnCancelar);
    modalCloseBtn.appendChild(btnConfirmar);

    modal.classList.remove('hidden');
}

// ====== Função de Modal de Edição Personalizado ======
function mostrarModalEdicao(textoAtual, callbackEditar) {
    const modal = document.getElementById('modalMensagem');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalIcon = document.getElementById('modalIcon');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Configurar modal de edição
    modalIcon.className = 'fas fa-edit text-blue-500 text-2xl mr-3 mt-1';
    modalTitle.textContent = 'SAC - Editar Comentário';
    
    // Criar textarea para edição
    modalContent.innerHTML = '';
    
    const textarea = document.createElement('textarea');
    textarea.value = textoAtual;
    textarea.className = 'w-full p-2 border border-gray-300 rounded-md resize-none';
    textarea.rows = 4;
    textarea.placeholder = 'Digite o novo texto do comentário...';
    
    modalContent.appendChild(textarea);

    // Criar botões personalizados
    modalCloseBtn.innerHTML = '';
    modalCloseBtn.className = 'flex justify-center gap-4 mt-4';
    
    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.className = 'px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100';
    btnCancelar.onclick = () => {
        modal.classList.add('hidden');
    };

    const btnSalvar = document.createElement('button');
    btnSalvar.textContent = 'Salvar';
    btnSalvar.className = 'px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50';
    btnSalvar.onclick = async () => {
        const novoTexto = textarea.value.trim();
        if (!novoTexto) {
            mostrarModal('Atenção', '⚠️ O comentário não pode estar vazio!', 'aviso');
            return;
        }
        modal.classList.add('hidden');
        await callbackEditar(novoTexto);
    };

    modalCloseBtn.appendChild(btnCancelar);
    modalCloseBtn.appendChild(btnSalvar);

    modal.classList.remove('hidden');
    
    // Focar no textarea
    setTimeout(() => textarea.focus(), 100);
}


document.addEventListener('DOMContentLoaded', async function () {
    // VERIFICAÇÃO DE LOGIN - BLOQUEIO TOTAL DE ACESSO
    const token = localStorage.getItem('authToken');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    
    if (!usuarioLogado) {
        mostrarModal('Erro', 'Você precisa fazer login para acessar esta página', 'erro');
        window.location.href = 'login.html';
        return;
    }

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

    const btnPostagens = document.getElementById('postagensPerfil'); // Postagens
    const btnComentarios = document.getElementById('comentariosPerfil'); // Comentários
    const btnContactar = document.getElementById('contactarPerfil'); // Contactar

    const caminhoFotoPadrao = '../img/defaultImagePerfil.png';

    let usuario = usuarioLogado;

    // FUNÇÃO MELHORADA PARA VERIFICAR LOGIN EM TEMPO REAL
    function verificarLoginTempoReal() {
        const token = localStorage.getItem('authToken');
        const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
        
        if (!token || !usuarioAtual) {
            mostrarModal('Erro', 'Você precisa fazer login para interagir', 'erro');
            // Limpa qualquer dado residual
            localStorage.removeItem('authToken');
            localStorage.removeItem('usuarioLogado');
            sessionStorage.clear();
            
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // OBSERVADOR PARA DETECTAR MUDANÇAS NO LOCALSTORAGE (DESLOGAR)
    function configurarObservadorLogout() {
        window.addEventListener('storage', function(e) {
            if (e.key === 'usuarioLogado' && !e.newValue) {
                mostrarModal('Erro', 'Sessão expirada. Faça login novamente.', 'erro');
                window.location.href = 'login.html';
            }
        });
        
        // Também verifica periodicamente (a cada 2 segundos)
        setInterval(() => {
            const token = localStorage.getItem('authToken');
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
            if (!token || !usuario) {
                mostrarModal('Erro', 'Sessão expirada. Faça login novamente.', 'erro');
                window.location.href = 'login.html';
            }
        }, 2000);
    }

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
        console.log('Atualizando UI com dados:', data);
        
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

    // Botão de editar (somente para o próprio usuário) - COM VERIFICAÇÃO
    if (isOwnProfile && editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            if (!verificarLoginTempoReal()) return;
            editProfileContainer.classList.toggle('hidden');
            editDescription.value = usuario.descricao || '';
            // Limpa o input de foto ao abrir
            const editPhoto = document.getElementById('editPhoto');
            if (editPhoto) editPhoto.value = '';
        });
    }

    // Salvar alterações (descrição) - COM VERIFICAÇÃO
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async () => {
            if (!verificarLoginTempoReal()) return;
            
            try {
                const updateData = {};
                const novaDescricao = editDescription.value;
                
                if (novaDescricao !== usuario.descricao) {
                    updateData.descricao = novaDescricao;
                }
                
                const photoInput = document.getElementById('editPhoto');
                if (photoInput && photoInput.files[0]) {
                    mostrarModal('Erro', 'Upload de foto será implementado em breve. Por enquanto, apenas a descrição será atualizada.', 'erro');
                    photoInput.value = '';
                }
                
                if (Object.keys(updateData).length === 0) {
                    editProfileContainer.classList.add('hidden');
                    return;
                }

                console.log('Enviando atualização:', updateData);

                const resp = await fetch(`http://localhost:8080/usuarios/atualizar/${usuario.id || usuario.usuarioId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });

                if (!resp.ok) {
                    const errorText = await resp.text();
                    throw new Error(`Erro ${resp.status}: ${errorText}`);
                }

                const updatedUser = await resp.json();
                console.log('Resposta do servidor:', updatedUser);

                // ATUALIZAR MANUALMENTE A DESCRIÇÃO NO OBJETO USUÁRIO
                usuario.descricao = novaDescricao;
                
                // Atualizar a UI manualmente também
                profileDescEl.textContent = novaDescricao || 'Sem descrição disponível.';
                
                // Atualizar localStorage
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                
                console.log('Usuário atualizado no localStorage:', usuario);
                
                editProfileContainer.classList.add('hidden');
                mostrarModal('Sucesso!', '✅ Descrição atualizada com sucesso!', 'sucesso');
                
            } catch (err) {
                console.error('Erro:', err);
                mostrarModal('Erro', '❌ Erro ao atualizar: ' + err.message, 'erro');
            }
        });
    }

    // Botão cancelar edição
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editProfileContainer.classList.add('hidden');
        });
    }

    // Botão Contactar - Abrir Gmail - COM VERIFICAÇÃO
    if (btnContactar) {
        btnContactar.addEventListener('click', () => {
            if (!verificarLoginTempoReal()) return;
            
            // Só funciona se não for o próprio perfil
            if (!isOwnProfile) {
                const emailDoUsuario = usuario.email;
                
                if (emailDoUsuario) {
                    // Criar link do Gmail
                    const assunto = `Contato via SAC - Interesse em conversar`;
                    const corpo = `Olá ${usuario.nome || 'usuário'}!\n\nVi seu perfil no SAC e gostaria de entrar em contato com você.\n\nAtenciosamente,\n${usuarioLogado.nome || 'Usuário SAC'}`;
                    
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailDoUsuario)}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
                    
                    // Abrir nova aba com o Gmail
                    window.open(gmailUrl, '_blank');
                } else {
                    mostrarModal('Erro', '❌ Este usuário não possui email cadastrado para contato.', 'erro');
                }
            } else {
                // Se for o próprio perfil, mostrar mensagem diferente
                mostrarModal('Erro', '❌ Este é o seu próprio perfil!', 'erro');
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
                if (!verificarLoginTempoReal()) return;
                window.location.href = `detalhePost.html?id=${postId}`;
            });

            userPostsContainer.appendChild(postElement);
        });
    }

    // =========================
    // FUNÇÕES PARA EDITAR E DELETAR COMENTÁRIOS - CORRIGIDAS
    // =========================

    // Função para deletar comentário - CORRIGIDA
    async function deletarComentario(comentarioId, elementoDiv) {
        if (!verificarLoginTempoReal()) return false;
        
        // Modal de confirmação personalizado
        mostrarModalConfirmacao(
            'Tem certeza que deseja excluir este comentário?\n\nEsta ação não pode ser desfeita.',
            async () => {
                try {
                    // CORREÇÃO: Endpoint correto para deletar comentário
                    const resp = await fetch(`http://localhost:8080/comentarios/${comentarioId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!resp.ok) {
                        throw new Error(`Erro ${resp.status} ao deletar comentário`);
                    }

                    // Remover o comentário da UI
                    elementoDiv.remove();
                    
                    // Se não houver mais comentários, mostrar mensagem
                    if (containerComentarios.children.length === 0) {
                        containerComentarios.innerHTML = '<p class="text-sm text-gray-500 col-span-full text-center">Nenhum comentário encontrado.</p>';
                    }
                    
                    mostrarModal('Sucesso!', '✅ Comentário excluído com sucesso!', 'sucesso');
                    return true;
                } catch (err) {
                    console.error('Erro ao deletar comentário:', err);
                    mostrarModal('Erro', '❌ Erro ao excluir comentário. Tente novamente.', 'erro');
                    return false;
                }
            }
        );
    }

    // Função para editar comentário - CORRIGIDA
    async function editarComentario(comentarioId, elementoTexto) {
        if (!verificarLoginTempoReal()) return false;

        // Obter o texto atual do elemento DOM
        const textoAtual = elementoTexto.textContent || elementoTexto.innerText;
        
        // Modal de edição personalizado
        mostrarModalEdicao(textoAtual, async (novoTexto) => {
            try {
                const resp = await fetch(`http://localhost:8080/comentarios/${comentarioId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        texto: novoTexto.trim()
                    })
                });

                if (!resp.ok) {
                    throw new Error(`Erro ${resp.status} ao editar comentário`);
                }

                // Atualizar a UI imediatamente
                elementoTexto.textContent = novoTexto.trim();
                
                mostrarModal('Sucesso!', '✅ Comentário editado com sucesso!', 'sucesso');
                return true;
            } catch (err) {
                console.error('Erro ao editar comentário:', err);
                mostrarModal('Erro', '❌ Erro ao editar comentário. Tente novamente.', 'erro');
                return false;
            }
        });
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

        // Adicionar eventos de denúncia aos comentários renderizados - COM VERIFICAÇÃO
        const denunciarBtns = containerComentarios.querySelectorAll('.denunciarComentario');
        denunciarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!verificarLoginTempoReal()) return;
                
                const comentarioId = btn.getAttribute('data-id');

                // Salva o tipo e ID da denúncia no localStorage
                localStorage.setItem('denunciaTipo', 'comentario');
                localStorage.setItem('denunciaId', comentarioId);

                // Redireciona para a página de denúncias
                window.location.href = 'denuncias.html';
            });
        });

        // Botão "Adicionar Comentário" apenas em perfis de outros usuários - COM VERIFICAÇÃO
        if (!isOwnProfile) {
            const addBtnContainer = document.createElement('div');
            addBtnContainer.classList.add('flex', 'flex-col', 'gap-2', 'w-full', 'items-center', 'justify-center', 'mt-4');

            addBtnContainer.innerHTML = `
                <button id="addComentario" class="border-1 px-6 py-4 rounded-xl hover:bg-gray-300">Adicionar comentário</button>
            `;
            containerComentarios.appendChild(addBtnContainer);

            const addComentarioBtn = addBtnContainer.querySelector('#addComentario');

            addComentarioBtn.addEventListener('click', () => {
                if (!verificarLoginTempoReal()) return;
                
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
                    if (!verificarLoginTempoReal()) return;
                    
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

                        mostrarModal('Sucesso!', '✅ Comentário enviado com sucesso!', 'sucesso');
                    } catch (err) {
                        console.error(err);
                        mostrarModal('Erro', '❌ Erro ao enviar comentário. Tente novamente.', 'erro');
                    }
                });
            });
        }
    }

    // Função auxiliar para renderizar comentários existentes com o mesmo layout
    function createCommentElementLayout(usuarioComent, texto, id) {
        const div = document.createElement('div');
        div.classList.add('flex', 'flex-col', 'gap-2', 'w-full', 'mb-4');

        // Verificar se o comentário pertence ao usuário logado
        const isMyComment = usuarioComent.id === usuarioLogado.id || 
                           usuarioComent.usuarioId === usuarioLogado.id;

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

                <div class="flex gap-2 items-center">
                    ${isMyComment ? `
                        <!-- Botões de editar e deletar (apenas para comentários do usuário logado) -->
                        <button class="editarComentario text-blue-500 hover:text-blue-700" data-id="${id}">
                            <i class="fa-solid fa-pen-to-square text-lg"></i>
                        </button>
                        <button class="deletarComentario text-red-500 hover:text-red-700" data-id="${id}">
                            <i class="fa-solid fa-trash text-lg"></i>
                        </button>
                    ` : ''}
                    
                    <!-- Botão de denúncia (sempre visível) -->
                    <a href="#" class="denunciarComentario" data-id="${id}">
                        <span class="icon">
                            <i class="fa-solid fa-circle-exclamation text-red-500 text-2xl"></i>
                        </span>
                    </a>
                </div>
            </div>

            <div class="border-1 border-black rounded-2xl p-2">
                <p class="comentario-texto">${texto}</p>
            </div>
        `;

        // Adicionar eventos para os botões de editar e deletar (se existirem)
        if (isMyComment) {
            const editarBtn = div.querySelector('.editarComentario');
            const deletarBtn = div.querySelector('.deletarComentario');
            const textoElement = div.querySelector('.comentario-texto');

            editarBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const comentarioId = editarBtn.getAttribute('data-id');
                
                const sucesso = await editarComentario(comentarioId, textoElement);
                if (sucesso) {
                    console.log('Comentário atualizado com sucesso');
                }
            });

            deletarBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const comentarioId = deletarBtn.getAttribute('data-id');
                
                const sucesso = await deletarComentario(comentarioId, div);
                if (sucesso) {
                    console.log('Comentário deletado com sucesso');
                }
            });
        }

        return div;
    }

    async function enviarComentario(texto) {
        try {
            // Pegando a primeira postagem para associar o comentário
            const posts = await fetchUserPosts();
            if (!posts.length) return mostrarModal('Erro', '❌ Não há postagens para comentar.', 'erro');

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

            mostrarModal('Sucesso!', '✅ Comentário enviado com sucesso!', 'sucesso');
        } catch (err) {
            console.error(err);
            mostrarModal('Erro', '❌ Erro ao enviar comentário. Tente novamente.', 'erro');
        }
    }

    // Eventos dos botões - COM VERIFICAÇÃO
    btnPostagens.addEventListener('click', async () => {
        if (!verificarLoginTempoReal()) return;
        containerComentarios.classList.add('hidden'); // esconde comentários
        userPostsContainer.classList.remove('hidden'); // mostra posts
        const posts = await fetchUserPosts();
        renderUserPosts(posts);
    });

    btnComentarios.addEventListener('click', async () => {
        if (!verificarLoginTempoReal()) return;
        userPostsContainer.classList.add('hidden'); // esconde posts
        containerComentarios.classList.remove('hidden'); // mostra comentários
        containerComentarios.classList.add('grid');
        const comments = await fetchUserComments();
        renderUserComments(comments);
    });

    // Carregar posts inicialmente
    const initialPosts = await fetchUserPosts();
    renderUserPosts(initialPosts);

    // Configurar observador de logout
    configurarObservadorLogout();
});