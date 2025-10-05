document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');
    const postsContainerErro = document.getElementById('postsContainerErro');
    const postsContainerReal = document.getElementById('postsContainerReal');
    const filtroForm = document.getElementById('filtroForm');

    if (!postsContainer) {
        console.error('Elemento postsContainer não encontrado no DOM.');
        return;
    }

    let posts = [];

    const user = JSON.parse(localStorage.getItem('usuarioLogado'));

    function abrirDetalhesPost(post) {
        window.location.href = `post.html?id=${post.id}`;
    }

    async function carregarPosts(filtros = {}) {
        try {
            let url = 'http://localhost:8080/ocorrencias/listar';
            
            const params = new URLSearchParams(filtros).toString();
            if (params) url += `?${params}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            posts = await response.json();
            renderizarPosts(posts);

            const postAtualizado = JSON.parse(localStorage.getItem('postAtualizado'));
            if (postAtualizado) {
                const postElement = Array.from(postsContainerReal.children).find(p =>
                    p.querySelector('figcaption')?.textContent.includes(postAtualizado.tituloAntigo)
                );
                if (postElement) {
                    postElement.querySelector('figcaption').textContent = postAtualizado.tituloNovo;
                }
                localStorage.removeItem('postAtualizado');
            }

        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            postsContainerErro.innerHTML = `<p class="text-center text-red-500 py-8">Erro ao carregar as postagens. Detalhes: ${error.message}</p>`;
        }
    }

    function renderizarPosts(listaPosts) {
        postsContainerReal.innerHTML = '';

        if (!listaPosts.length) {
            postsContainerReal.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-8">Nenhuma postagem encontrada.</p>';
            return;
        }

        listaPosts.forEach(post => {
            const postElement = document.createElement('figure');
            postElement.classList.add('w-75', 'h-65', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto', 'cursor-pointer');

            // === Corrigir formatação da data ===
            let dataFormatada = "Data não informada";
            const dataCampo = post.data_criacao || post.data;
            if (dataCampo) {
                const data = new Date(dataCampo);
                if (!isNaN(data.getTime())) {
                    dataFormatada = data.toLocaleDateString('pt-BR', {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    });
                }
            }

            const nomeUsuario = post.nome || (post.usuario && post.usuario.nome) || 'Desconhecido';

            // === Imagem padrão mantém como antes ===
            let imagemSrc = '../img/Sem Foto.png';
            if (post.imagem) {
                if (post.imagem.startsWith('data:')) {
                    imagemSrc = post.imagem;
                } else if (post.imagem.startsWith('http') || post.imagem.startsWith('/')) {
                    imagemSrc = post.imagem;
                }
            }

            postElement.innerHTML = `
                <div class="w-full h-full overflow-hidden rounded-t-xl">
                    <img class="w-full h-full object-cover bg-fundo1" src="${imagemSrc}" alt="Imagem da ocorrência">
                </div>
                <div class="rounded-b-xl drop-shadow-black shadow-lg">
                    <figcaption class="indent-2 pt-4 pb-0.5 text-neutral-950">${post.titulo || ''}</figcaption>
                    <figcaption class="indent-2 pb-0.5 text-neutral-700">Data: ${dataFormatada}</figcaption>
                    <figcaption class="indent-2 pb-6 text-neutral-700">Usuário: ${nomeUsuario}</figcaption>
                </div>
            `;

            postElement.addEventListener('click', () => abrirDetalhesPost(post));
            postsContainerReal.appendChild(postElement);
        });
    }

    carregarPosts();

    if (filtroForm) {
        filtroForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const filtros = {
                categoria: filtroForm.categoria.value,
                data: filtroForm.dataFormatada.value,
                tipo: filtroForm.tipo.value,
                localizacao: filtroForm.localizacao.value,
                urgencia: filtroForm.urgencia.value
            };
            carregarPosts(filtros);
        });
    }
});
