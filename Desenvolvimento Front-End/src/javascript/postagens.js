document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');
    const postsContainerErro = document.getElementById('postsContainerErro');
    const postsContainerReal = document.getElementById('postsContainerReal');
    const filtroForm = document.getElementById('filtroForm');
    const botaoCarregarMais = document.getElementById('carregarMais');

    if (!postsContainer) {
        console.error('Elemento postsContainer não encontrado no DOM.');
        return;
    }

    let posts = [];
    let paginaAtual = 1;
    const limitePorPagina = 6;
    let filtrosAtuais = {};

    const user = JSON.parse(localStorage.getItem('usuarioLogado'));

    function abrirDetalhesPost(post) {
        window.location.href = `post.html?id=${post.id}`;
    }

    async function carregarPosts(filtros = {}, append = false) {
        try {
            let urlBase = 'http://localhost:8080/ocorrencias';
            let urlFinal = `${urlBase}/listar`; // padrão

            // Limpa filtros vazios
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtros).filter(([_, v]) => v && v.trim() !== "")
            );

            // Adiciona paginação
            filtrosLimpos.page = paginaAtual;
            filtrosLimpos.limit = limitePorPagina;

            // Decide o endpoint de acordo com o filtro usado
            if (filtrosLimpos.data && Object.keys(filtrosLimpos).length === 3) { // page + limit contam
                urlFinal = `${urlBase}/por-data?data=${filtrosLimpos.data}&page=${paginaAtual}&limit=${limitePorPagina}`;
            } else if (filtrosLimpos.tipo && Object.keys(filtrosLimpos).length === 3) {
                urlFinal = `${urlBase}/por-tipo?tipo=${filtrosLimpos.tipo.toUpperCase()}&page=${paginaAtual}&limit=${limitePorPagina}`;
            } else if (filtrosLimpos.categoria && Object.keys(filtrosLimpos).length === 3) {
                urlFinal = `${urlBase}/por-categoria?categoria=${encodeURIComponent(filtrosLimpos.categoria)}&page=${paginaAtual}&limit=${limitePorPagina}`;
            } else if (Object.keys(filtrosLimpos).length > 0) {
                const params = new URLSearchParams(filtrosLimpos).toString();
                urlFinal = `${urlBase}/listar?${params}`;
            }

            console.log('🔗 Endpoint usado:', urlFinal);

            const response = await fetch(urlFinal);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const novosPosts = await response.json();
            if (!append) postsContainerReal.innerHTML = '';
            if (novosPosts.length === 0 && !append) {
                postsContainerReal.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-8">Nenhuma postagem encontrada.</p>';
                botaoCarregarMais.style.display = 'none';
                return;
            }

            renderizarPosts(novosPosts, append);

            // esconder botão se não vier o limite completo
            botaoCarregarMais.style.display = novosPosts.length < limitePorPagina ? 'none' : 'block';

        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            postsContainerErro.innerHTML = `<p class="text-center text-red-500 py-8">Erro ao carregar as postagens. Detalhes: ${error.message}</p>`;
        }
    }

    function renderizarPosts(listaPosts, append = false) {
        if (!append) postsContainerReal.innerHTML = '';

        listaPosts.forEach(post => {
            const postElement = document.createElement('figure');
            postElement.classList.add('w-75', 'h-65', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto', 'cursor-pointer');

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

            const nomeUsuario = post.usuario?.nome || 'Desconhecido';

            // imagem
            let imagemSrc = '../img/Sem Foto.png';
            if (post.imagem) {
                try {
                    if (Array.isArray(post.imagem)) {
                        imagemSrc = post.imagem[0];
                    } else {
                        const imagensArray = JSON.parse(post.imagem);
                        if (Array.isArray(imagensArray) && imagensArray.length > 0) {
                            imagemSrc = imagensArray[0];
                        }
                    }
                } catch (e) {
                    console.warn('Erro ao ler imagens do post', e);
                    imagemSrc = post.imagem;
                }
            }

            postElement.innerHTML = `
                <div class="w-full h-full overflow-hidden rounded-t-xl">
                    <img class="w-full h-full object-cover bg-fundo1" src="${imagemSrc}" alt="Imagem da ocorrência">
                </div>
                <div class="rounded-b-xl drop-shadow-black shadow-lg">
                    <figcaption class="pl-2 pt-4 pb-0.5 text-neutral-950">${post.titulo || ''}</figcaption>
                    <figcaption class="pl-2 pb-0.5 text-neutral-700">Data: ${dataFormatada}</figcaption>
                    <figcaption class="pl-2 pb-6 text-neutral-700">Usuário: ${nomeUsuario}</figcaption>
                </div>
            `;

            postElement.addEventListener('click', () => abrirDetalhesPost(post));
            postsContainerReal.appendChild(postElement);
        });
    }

    // Filtros
    if (filtroForm) {
        filtroForm.addEventListener('submit', function (e) {
            e.preventDefault();
            paginaAtual = 1;

            let categoria = filtroForm.categoria.value;
            let tipo = filtroForm.tipo.value;
            let data = filtroForm.data.value;

            // Ajustes de backend
            if (categoria === "todas") categoria = "";
            else categoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);

            if (tipo === "todos") tipo = "";
            else tipo = tipo.toUpperCase();

            filtrosAtuais = { categoria, tipo, data };
            carregarPosts(filtrosAtuais, false);
        });
    }

    // Botão "Mostrar Mais"
    if (botaoCarregarMais) {
        botaoCarregarMais.addEventListener('click', () => {
            paginaAtual++;
            carregarPosts(filtrosAtuais, true);
        });
    }

    // Carrega posts iniciais
    carregarPosts();
});