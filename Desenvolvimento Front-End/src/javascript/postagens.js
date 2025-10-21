document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');
    const postsContainerErro = document.getElementById('postsContainerErro');
    const postsContainerReal = document.getElementById('postsContainerReal');
    const filtroForm = document.getElementById('filtroForm');
    const botaoCarregarMais = document.getElementById('carregarMais');

    // Se você não usa postsContainer, não deve impedir o script.
    // Verifica se o container onde vamos realmente renderizar existe.
    if (!postsContainerReal) {
        console.error('Elemento postsContainerReal não encontrado no DOM.');
        return;
    }

    let posts = [];
    let paginaAtual = 1;
    const limitePorPagina = 6;
    let filtrosAtuais = {};

    const user = JSON.parse(localStorage.getItem('usuarioLogado'));

    // --- sistema de primeiro nome + primeiro sobrenome (reaproveitável) ---
    const profileName = document.getElementById('profileName');
    const profileImage = document.getElementById('profileImage');

    const conectores = new Set([
        "de","da","do","dos","das","van","von","del","la","le","el"
    ]);

    function capitalize(word) {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    function primeiroESobrenomeCompleto(nomeCompleto) {
        if (!nomeCompleto || typeof nomeCompleto !== 'string') return '';
        const partes = nomeCompleto.trim().split(/\s+/).filter(Boolean);
        if (partes.length === 0) return '';
        const primeiro = capitalize(partes[0]);
        let sobrenome = '';
        if (partes.length > 1) {
            const segunda = partes[1];
            const segundaLower = segunda.toLowerCase();
            if (conectores.has(segundaLower)) {
                if (partes.length > 2) {
                    sobrenome = `${segundaLower} ${capitalize(partes[2])}`;
                } else {
                    sobrenome = segundaLower;
                }
            } else {
                sobrenome = capitalize(segunda);
            }
        }
        return `${primeiro} ${sobrenome}`.trim();
    }

    // Preenche profile na interface (se elementos existirem)
    if (user && user.nome) {
        if (profileName) profileName.textContent = primeiroESobrenomeCompleto(user.nome);
        if (profileImage && user.foto) profileImage.src = user.foto;
    }
    // --- fim do sistema de nomes ---

    function abrirDetalhesPost(post) {
        window.location.href = `post.html?id=${post.id}`;
    }

    async function carregarPosts(filtros = {}, append = false) {
        try {
            let urlBase = 'http://localhost:8080/ocorrencias';
            let urlFinal = `${urlBase}/listar`; // padrão

            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtros).filter(([_, v]) => v && v.trim() !== "")
            );

            filtrosLimpos.page = paginaAtual;
            filtrosLimpos.limit = limitePorPagina;

            if (filtrosLimpos.data && Object.keys(filtrosLimpos).length === 3) {
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
                if (botaoCarregarMais) botaoCarregarMais.style.display = 'none';
                return;
            }

            renderizarPosts(novosPosts, append);

            if (botaoCarregarMais) botaoCarregarMais.style.display = novosPosts.length < limitePorPagina ? 'none' : 'block';

        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            if (postsContainerErro) postsContainerErro.innerHTML = `<p class="text-center text-red-500 py-8">Erro ao carregar as postagens. Detalhes: ${error.message}</p>`;
        }
    }

    function renderizarPosts(listaPosts, append = false) {
        if (!append) postsContainerReal.innerHTML = '';

        listaPosts.forEach(post => {
            const postElement = document.createElement('figure');
            postElement.classList.add('w-75', 'h-65', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto', 'cursor-pointer');

            const dataCriacao = post.data_criacao
            ? new Date(post.data_criacao).toLocaleDateString('pt-BR')
            : 'Data não informada';

            // usa a função para cortar nome -> primeiro + sobrenome
            const nomeUsuario = post.usuario && post.usuario.nome
                ? primeiroESobrenomeCompleto(post.usuario.nome)
                : 'Desconhecido';

            let tipoFormatado = '';
            if (post.tipo === 'DOACAO') tipoFormatado = 'Doação';
            else if (post.tipo === 'PEDIDO') tipoFormatado = 'Pedido';
            else tipoFormatado = post.tipo ? post.tipo.charAt(0).toUpperCase() + post.tipo.slice(1).toLowerCase() : '';

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
                    <figcaption class="pl-2 pb-0.5 text-neutral-700 text-sm">Usuário: ${nomeUsuario}</figcaption>
                    <figcaption class="pl-2 pb-0.5 text-neutral-700 text-sm">Tipo: ${tipoFormatado}</figcaption>
                    <figcaption class="pl-2 pb-6  text-neutral-700 text-sm">Data: ${dataCriacao}</figcaption>
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

            if (categoria === "todas") categoria = "";
            else categoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);

            if (tipo === "todos") tipo = "";
            else tipo = tipo.toUpperCase();

            filtrosAtuais = { categoria, tipo, data };
            carregarPosts(filtrosAtuais, false);
        });
    }

    if (botaoCarregarMais) {
        botaoCarregarMais.addEventListener('click', () => {
            paginaAtual++;
            carregarPosts(filtrosAtuais, true);
        });
    }

    carregarPosts();
});
