document.addEventListener('DOMContentLoaded', async function () {
    const postDetails = document.getElementById('postDetails');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Controle do menu
    if (userLogado) {
        document.getElementById('menu-antigo').classList.add('hidden');
        document.getElementById('menu-novo').classList.remove('hidden');
        document.getElementById('profileName').textContent = userLogado.nome;
        document.getElementById('profileImage').src =
            userLogado.profileImage || '../img/pessoa sem foto.png';
    }

    if (!postId) {
        postDetails.innerHTML = `<p class="text-center text-red-500">
            Nenhum post selecionado. Volte para a página de postagens e escolha um.
        </p>`;
        return;
    }

    try {
        // === 1. Buscar o post ===
        const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
        if (!response.ok) throw new Error(`Erro ao buscar post. Status: ${response.status}`);
        const post = await response.json();

        // === 2. Buscar o usuário dono do post ===
        let usuario = null;
        if (post.usuario?.id) {
            try {
                const userResp = await fetch(`http://localhost:8080/usuarios/${post.usuario.id}`);
                if (userResp.ok) {
                    usuario = await userResp.json();
                }
            } catch (e) {
                console.warn("Erro ao buscar usuário:", e.message);
            }
        }

        const dataCriacao = post.data
            ? new Date(post.data).toLocaleDateString('pt-BR')
            : 'Data não informada';

        const nomeUsuario = usuario?.nome || 'Usuário não identificado';
        const emailUsuario = usuario?.email || '';

        // Corrigir ID do logado (pode estar salvo diferente)
        const idLogado = userLogado?.id || userLogado?.idUsuario || null;

        // === 3. Montagem da galeria de imagens ===
        let imagensHtml = '';
        if (Array.isArray(post.imagens) && post.imagens.length > 0) {
            const imagensValidas = post.imagens.filter(img => img && img !== '../img/Sem Foto.png');
            if (imagensValidas.length > 0) {
                imagensHtml = `
                    <hr class="text-minitexto my-12">
                    <section class="flex gap-10 items-center justify-end relative flex-wrap">
                        ${imagensValidas
                            .map(
                                img => `
                                <div class="w-55 h-55 bg-fundo2 rounded-3xl overflow-hidden">
                                    <img class="w-full h-full object-cover" src="${img}" alt="Imagem da ocorrência">
                                </div>
                            `
                            )
                            .join('')}
                    </section>
                `;
            }
        }

        // === 4. Montagem do HTML ===
        postDetails.innerHTML = `
            <h1 class="text-4xl mb-1">${post.titulo || 'Sem título'}</h1>
            <p class="text-minitexto">Data da postagem: ${dataCriacao}</p>

            <!-- Perfil + Contato + Ações -->
            <div class="flex items-center justify-between mb-6 w-full mt-8">
                <div class="flex gap-5 items-center">
                    <div class="rounded-full overflow-hidden w-14 h-14 bg-gray-300">
                        <img class="object-cover w-full h-full" src="${usuario?.profileImage || '../img/pessoa sem foto.png'}" alt="Foto de Perfil">
                    </div>
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold">${nomeUsuario}</span>
                        <span class="text-xl">☆☆☆☆☆</span>
                    </div>
                </div>
                <div class="flex gap-3">
                    ${
                        emailUsuario
                            ? `<button id="contatarButton" class="bg-fundo1 border border-black py-2 px-4 rounded-xl hover:bg-destaque hover:text-white">Contactar</button>`
                            : `<button disabled class="bg-gray-300 py-2 px-4 rounded-xl opacity-50 cursor-not-allowed">Contactar</button>`
                    }
                    ${
                        idLogado && post.usuario?.id === idLogado
                            ? `
                            <button id="editarButton" class="px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500">Editar</button>
                            <button id="excluirButton" class="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-white">Excluir</button>
                            `
                            : ''
                    }
                </div>
            </div>

            <hr class="text-minitexto my-12">

            <div>
                <ul class="text-xl mb-8">
                    <li class="flex items-center gap-2 mb-4"><p class="font-bold tracking-wide">Tipo:</p> <p>${post.tipo || 'Não informado'}</p></li>
                    <li class="flex items-center gap-2 mb-4"><p class="font-bold tracking-wide ">Categoria:</p> <p>${post.categoria || 'Não informada'}</p></li>
                    <li class="flex items-center gap-2 mb-4"><p class="font-bold tracking-wide ">Localização:</p> <p>${post.localizacao || 'Não informada'}</p></li>
                </ul>

                <label class="text-xl font-bold tracking-wide">Descrição</label>
                <p id="descricaoPost" class="border border-black w-full rounded-xl py-2 px-4 mt-2">
                    ${post.descricao || 'Sem descrição disponível.'}
                </p>
            </div>

            ${imagensHtml}
        `;

        // === 5. Botão de contato ===
        if (emailUsuario) {
            document.getElementById('contatarButton')?.addEventListener('click', () => {
                const mailtoLink = `mailto:${emailUsuario}?subject=Contato sobre sua postagem no SAC&body=Olá ${nomeUsuario}, vi sua postagem e gostaria de conversar.`;
                window.location.href = mailtoLink;
            });
        }

        // === 6. Botão editar ===
        document.getElementById('editarButton')?.addEventListener('click', () => {
            window.location.href = `editPost.html?id=${post.id}`;
        });

        // === 7. Botão excluir ===
        document.getElementById('excluirButton')?.addEventListener('click', async () => {
            if (confirm('Deseja realmente excluir este post?')) {
                try {
                    const delResponse = await fetch(
                        `http://localhost:8080/ocorrencias/deletar/${post.id}`,
                        { method: 'DELETE' }
                    );

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
    } catch (error) {
        postDetails.innerHTML = `<p class="text-center text-red-500">
            Ocorreu um erro ao carregar a postagem.<br>
            <small>${error.message}</small>
        </p>`;
    }
});