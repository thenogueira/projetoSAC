// postagens.js - VERSÃO CORRIGIDA (DATA E USUÁRIO)
document.addEventListener('DOMContentLoaded', function () {
    const postsContainerReal = document.getElementById('postsContainerReal');
    const postsContainerErro = document.getElementById('postsContainerErro');
    const filtroForm = document.getElementById('filtroForm');
    const botaoCarregarMais = document.getElementById('carregarMais');

    if (!postsContainerReal) {
        console.error('Elemento postsContainerReal não encontrado no DOM.');
        return;
    }

    // paginação
    let paginaAtual = 1;
    const limitePorPagina = 12;
    let todasPostagens = [];
    let postagensFiltradas = [];
    let totalPaginas = 1;

    // guarda os filtros aplicados no momento
    let filtrosAtuais = {};

    const STORAGE_KEY = 'postagens_filtros_v1';
    const STORAGE_PAGE = 'postagens_pagina_v1';

    // CORREÇÃO: Esconde o botão "Mostrar Mais" desde o início
    if (botaoCarregarMais) {
        botaoCarregarMais.style.display = 'none';
    }

    // abre detalhes salvando estado atual
    function abrirDetalhesPost(post) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrosAtuais));
        localStorage.setItem(STORAGE_PAGE, String(paginaAtual));
        window.location.href = `post.html?id=${post.id}`;
    }

    // função utilitária: limpa objetos (remove chaves com string vazia)
    function limparFiltros(obj) {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && String(v).trim() !== ''));
    }

    // Função para montar endpoint - SÓ USA ENDPOINTS ESPECÍFICOS PARA FILTROS ÚNICOS
    function montarEndpointParaFiltros(filtros, page, limit) {
        const urlBase = 'http://localhost:8080/ocorrencias';
        const filtrosLimpos = limparFiltros(filtros);
        const chaves = Object.keys(filtrosLimpos);

        // Só usa endpoints específicos para filtros únicos
        if (chaves.length === 1) {
            const chave = chaves[0];
            const valor = filtrosLimpos[chave];
            
            switch (chave) {
                case 'data':
                    return `${urlBase}/por-data?data=${encodeURIComponent(valor)}`;
                case 'localizacao':
                    return `${urlBase}/por-localizacao?localizacao=${encodeURIComponent(valor)}`;
                case 'categoria':
                    return `${urlBase}/por-categoria?categoria=${encodeURIComponent(valor)}`;
                case 'tipo':
                    return `${urlBase}/por-tipo?tipo=${encodeURIComponent(valor.toUpperCase())}`;
                default:
                    return null;
            }
        }

        // Para múltiplos filtros, usa paginação no frontend
        return null;
    }

    // Função para obter data da postagem - CORREÇÃO APLICADA
    function obterDataPostagem(post) {
        // CORREÇÃO: Ordem de prioridade melhorada
        const dataCampo = post.dataCriacao || post.data_criacao || post.data || post.dataOcorrencia;
        
        if (dataCampo) {
            try {
                const d = new Date(dataCampo);
                if (!isNaN(d.getTime())) {
                    return dataCampo;
                }
            } catch (e) {
                console.warn('Erro ao converter data:', e);
            }
        }
        
        return null;
    }

    // Função para formatar data
    function formatarData(dataCampo) {
        if (!dataCampo) return "Data não informada";
        
        try {
            const d = new Date(dataCampo);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
        } catch (e) {
            console.warn('Erro ao formatar data:', e);
        }
        
        return "Data não informada";
    }

    // Função para obter nome do usuário - CORREÇÃO DEFINITIVA
    function obterNomeUsuario(post) {
        // Cenário 1: Quando não usa filtro - usuario é um objeto com nome
        if (post.usuario && typeof post.usuario === 'object') {
            if (post.usuario.nome && post.usuario.nome.trim() !== '') {
                return post.usuario.nome;
            }
            if (post.usuario.username && post.usuario.username.trim() !== '') {
                return post.usuario.username;
            }
        }
        
        // Cenário 2: Quando usa filtro - usuario pode vir como string ou ID
        if (post.usuario && typeof post.usuario === 'string' && post.usuario.trim() !== '') {
            return post.usuario;
        }
        
        // CORREÇÃO: Verifica propriedades específicas de respostas filtradas
        if (post.usuarioNome && post.usuarioNome.trim() !== '') {
            return post.usuarioNome;
        }
        
        if (post.nomeUsuario && post.nomeUsuario.trim() !== '') {
            return post.nomeUsuario;
        }
        
        if (post.autor && post.autor.trim() !== '') {
            return post.autor;
        }
        
        // CORREÇÃO: Verifica se tem ID do usuário para mostrar algo mais útil
        if (post.usuarioId) {
            return `Usuário ${post.usuarioId}`;
        }
        
        if (post.usuario_id) {
            return `Usuário ${post.usuario_id}`;
        }
        
        // CORREÇÃO: Verifica outras propriedades que podem conter o nome
        const propriedadesPossiveis = ['user', 'userName', 'user_name', 'author', 'criador', 'owner'];
        for (let prop of propriedadesPossiveis) {
            if (post[prop] && typeof post[prop] === 'string' && post[prop].trim() !== '') {
                return post[prop];
            }
        }
        
        return 'Desconhecido';
    }

    // Função de filtros no frontend - PARA MÚLTIPLOS FILTROS
    function aplicarFiltrosNoFrontend(postagens, filtros) {
        console.log('🎯 Aplicando filtros múltiplos no frontend:', filtros);
        
        const filtrosLimpos = limparFiltros(filtros);
        
        // Se não há filtros, retorna todas as postagens
        if (Object.keys(filtrosLimpos).length === 0) {
            return postagens;
        }
        
        return postagens.filter(post => {
            // Filtro por categoria
            if (filtrosLimpos.categoria && filtrosLimpos.categoria !== '') {
                if (!post.categoria || post.categoria !== filtrosLimpos.categoria) {
                    return false;
                }
            }

            // Filtro por tipo
            if (filtrosLimpos.tipo && filtrosLimpos.tipo !== '') {
                if (!post.tipo || post.tipo !== filtrosLimpos.tipo) {
                    return false;
                }
            }

            // Filtro por localização no frontend
            if (filtrosLimpos.localizacao && filtrosLimpos.localizacao !== '') {
                if (!post.localizacao) {
                    return false;
                }
                
                try {
                    let estadoPost = post.localizacao;
                    if (post.localizacao.includes(',')) {
                        estadoPost = post.localizacao.split(',')[0].trim();
                    }
                    
                    estadoPost = estadoPost.toUpperCase().trim();
                    const estadoFiltro = filtrosLimpos.localizacao.toUpperCase().trim();
                    
                    if (estadoPost !== estadoFiltro) {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            }

            // Filtro por urgência
            if (filtrosLimpos.urgencia && filtrosLimpos.urgencia !== '') {
                if (!post.urgencia || post.urgencia !== filtrosLimpos.urgencia) {
                    return false;
                }
            }

            // Filtro por data no frontend (quando usado com outros filtros)
            if (filtrosLimpos.data && filtrosLimpos.data !== '') {
                const postData = obterDataPostagem(post);
                if (!postData) {
                    return false;
                }
                
                try {
                    const dataFiltro = new Date(filtrosLimpos.data);
                    let dataPost;
                    
                    if (typeof postData === 'string') {
                        const dataLimpa = postData.split('T')[0];
                        dataPost = new Date(dataLimpa + 'T00:00:00');
                    } else {
                        dataPost = new Date(postData);
                    }
                    
                    const filtroFormatado = dataFiltro.toISOString().split('T')[0];
                    const postFormatado = dataPost.toISOString().split('T')[0];
                    
                    if (filtroFormatado !== postFormatado) {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            }

            return true;
        });
    }

    // Pega postagens da página atual
    function getPostagensDaPagina(postagens, pagina, limite) {
        const inicio = (pagina - 1) * limite;
        const fim = inicio + limite;
        return postagens.slice(inicio, fim);
    }

    // Carrega todas as postagens uma vez
    async function carregarTodasPostagens() {
        try {
            console.log('📥 Carregando TODAS as postagens...');
            const response = await fetch('http://localhost:8080/ocorrencias/listar');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Dados não são um array');
            }

            console.log(`✅ Carregadas ${data.length} postagens no total`);
            return data;
        } catch (err) {
            console.error('Erro ao carregar todas as postagens:', err);
            postsContainerErro.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao carregar postagens. Detalhes: ${err.message}</p>`;
            return [];
        }
    }

    // CORREÇÃO: Função para carregar posts com endpoints específicos - TRATA 404 CORRETAMENTE
    async function carregarComEndpointEspecifico(endpoint) {
        try {
            console.log('🔗 Usando endpoint específico:', endpoint);
            const response = await fetch(endpoint);
            
            // CORREÇÃO: 404 não é erro, só significa "nenhuma postagem encontrada"
            if (response.status === 404) {
                console.log('ℹ️  Nenhuma postagem encontrada com os filtros selecionados');
                return []; // Retorna array vazio
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Dados não são um array');
            }

            return data;
        } catch (err) {
            console.error('Erro ao carregar com endpoint específico:', err);
            throw err;
        }
    }

    // CORREÇÃO: Função para carregar a página atual
    function carregarPaginaAtual() {
        console.log(`📄 Carregando página ${paginaAtual} de ${totalPaginas}`);
        
        const postagensDaPagina = getPostagensDaPagina(postagensFiltradas, paginaAtual, limitePorPagina);
        
        // SEMPRE limpa o container antes de renderizar
        postsContainerReal.innerHTML = '';

        if (postagensDaPagina.length === 0) {
            postsContainerReal.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-8">Nenhuma postagem encontrada nesta página.</p>';
        } else {
            renderizarPosts(postagensDaPagina, false);
        }

        // CORREÇÃO: Atualiza navegação APÓS renderizar
        atualizarNavegacaoPaginas();
    }

    // CORREÇÃO: Função principal com tratamento melhor de erros
    async function carregarEPaginarPosts(filtros = {}) {
        try {
            postsContainerErro.innerHTML = '';

            const filtrosLimpos = limparFiltros(filtros);
            const endpointEspecifico = montarEndpointParaFiltros(filtros, paginaAtual, limitePorPagina);
            
            // Se tem endpoint específico E é um filtro único
            if (endpointEspecifico && Object.keys(filtrosLimpos).length === 1) {
                try {
                    const data = await carregarComEndpointEspecifico(endpointEspecifico);
                    
                    // Para endpoints específicos, sempre substitui (não append)
                    postsContainerReal.innerHTML = '';
                    
                    if (data.length === 0) {
                        postsContainerReal.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-8">Nenhuma postagem encontrada com os filtros selecionados.</p>';
                        // Remove navegação se existir
                        const navegacaoAnterior = document.getElementById('navegacao-paginas');
                        if (navegacaoAnterior) navegacaoAnterior.remove();
                        return;
                    }

                    // Endpoints específicos mostram TODAS as postagens de uma vez
                    renderizarPosts(data, false);
                    // Remove navegação se existir
                    const navegacaoAnterior = document.getElementById('navegacao-paginas');
                    if (navegacaoAnterior) navegacaoAnterior.remove();
                    return;
                } catch (err) {
                    // CORREÇÃO: Mostra mensagem amigável em vez de erro técnico
                    console.warn('Filtro não retornou resultados:', err.message);
                    postsContainerReal.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-8">Nenhuma postagem encontrada com os filtros selecionados.</p>';
                    // Remove navegação se existir
                    const navegacaoAnterior = document.getElementById('navegacao-paginas');
                    if (navegacaoAnterior) navegacaoAnterior.remove();
                    return;
                }
            }

            // Para múltiplos filtros ou nenhum filtro, usa paginação no frontend
            if (todasPostagens.length === 0) {
                todasPostagens = await carregarTodasPostagens();
                if (todasPostagens.length === 0) {
                    postsContainerReal.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-8">Nenhuma postagem encontrada.</p>';
                    return;
                }
            }

            // Aplica filtros no frontend se houver
            if (Object.keys(filtrosLimpos).length > 0) {
                console.log('🎯 Aplicando múltiplos filtros no frontend...', filtrosLimpos);
                postagensFiltradas = aplicarFiltrosNoFrontend(todasPostagens, filtros);
                console.log(`✅ ${postagensFiltradas.length} postagens após filtro`);
            } else {
                postagensFiltradas = [...todasPostagens];
                console.log('✅ Sem filtros - usando todas as postagens');
            }

            // CORREÇÃO: Calcula paginação corretamente
            totalPaginas = Math.ceil(postagensFiltradas.length / limitePorPagina);
            
            // CORREÇÃO: Garante que página atual é válida
            if (paginaAtual > totalPaginas) {
                paginaAtual = totalPaginas;
            }
            if (paginaAtual < 1) {
                paginaAtual = 1;
            }

            console.log(`📊 Total: ${postagensFiltradas.length} postagens, ${totalPaginas} páginas, Página atual: ${paginaAtual}`);

            // CORREÇÃO: Usa a função carregarPaginaAtual
            carregarPaginaAtual();

        } catch (err) {
            // CORREÇÃO: Tratamento mais amigável de erros
            console.error('Erro ao carregar posts:', err);
            postsContainerErro.innerHTML = `<p class="text-center text-red-500 py-4">Erro ao carregar as postagens. Tente novamente mais tarde.</p>`;
        }
    }

    // CORREÇÃO: Função para atualizar navegação
    function atualizarNavegacaoPaginas() {
        // Remove navegação anterior se existir
        const navegacaoAnterior = document.getElementById('navegacao-paginas');
        if (navegacaoAnterior) {
            navegacaoAnterior.remove();
        }

        // Só mostra navegação se tiver mais de uma página E estiver usando paginação frontend
        if (totalPaginas <= 1) {
            return;
        }

        const navegacaoContainer = document.createElement('div');
        navegacaoContainer.id = 'navegacao-paginas';
        navegacaoContainer.className = 'flex justify-center items-center gap-4 my-8';

        // Botão Anterior
        const btnAnterior = document.createElement('button');
        btnAnterior.innerHTML = '&laquo; Anterior';
        btnAnterior.className = `px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 duration-250 ${paginaAtual === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
        btnAnterior.disabled = paginaAtual === 1;
        
        // CORREÇÃO: Evento do botão Anterior
        btnAnterior.addEventListener('click', () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                localStorage.setItem(STORAGE_PAGE, String(paginaAtual));
                console.log(`⬅️ Indo para página ${paginaAtual}`);
                carregarPaginaAtual();
            }
        });

        // Indicador de página
        const indicadorPagina = document.createElement('span');
        indicadorPagina.className = 'px-4 py-2 text-gray-700';
        indicadorPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

        // Botão Próxima
        const btnProxima = document.createElement('button');
        btnProxima.innerHTML = 'Próxima &raquo;';
        btnProxima.className = `px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 duration-250 ${paginaAtual === totalPaginas ? 'opacity-50 cursor-not-allowed' : ''}`;
        btnProxima.disabled = paginaAtual === totalPaginas;
        
        // CORREÇÃO: Evento do botão Próxima
        btnProxima.addEventListener('click', () => {
            if (paginaAtual < totalPaginas) {
                paginaAtual++;
                localStorage.setItem(STORAGE_PAGE, String(paginaAtual));
                console.log(`➡️ Indo para página ${paginaAtual}`);
                carregarPaginaAtual();
            }
        });

        navegacaoContainer.appendChild(btnAnterior);
        navegacaoContainer.appendChild(indicadorPagina);
        navegacaoContainer.appendChild(btnProxima);

        // CORREÇÃO: Insere a navegação ANTES do botão "Criar Postagens"
        const linkCriar = document.getElementById('linkCriar');
        if (linkCriar && linkCriar.parentNode) {
            linkCriar.parentNode.parentNode.insertBefore(navegacaoContainer, linkCriar.parentNode);
        } else {
            // Fallback: insere após o container de posts
            postsContainerReal.parentNode.insertBefore(navegacaoContainer, postsContainerReal.nextSibling);
        }
    }

    function renderizarPosts(listaPosts, append = false) {
        // Garante que não append limpa o container
        if (!append) {
            postsContainerReal.innerHTML = '';
        }

        console.log('🎨 Renderizando', listaPosts.length, 'postagens');

        listaPosts.forEach((post, index) => {
            const dataReal = obterDataPostagem(post);
            const dataFormatada = formatarData(dataReal);
            const nomeUsuario = obterNomeUsuario(post);

            const postElement = document.createElement('figure');
            postElement.classList.add('w-75', 'h-65', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto', 'cursor-pointer');

            let imagemSrc = '../img/Sem Foto.png';
            if (post.imagem) {
                try {
                    if (Array.isArray(post.imagem) && post.imagem.length > 0) {
                        imagemSrc = post.imagem[0];
                    } else {
                        const arr = JSON.parse(post.imagem || '[]');
                        if (Array.isArray(arr) && arr.length > 0) imagemSrc = arr[0];
                    }
                } catch (e) {
                    if (typeof post.imagem === 'string' && post.imagem.trim() !== '') imagemSrc = post.imagem;
                }
            }

            if (!imagemSrc || imagemSrc === '../img/Sem Foto.png') {
                imagemSrc = '../img/Sem Foto.png';
            }

            postElement.innerHTML = `
                <div class="w-full h-full overflow-hidden rounded-t-xl">
                    <img class="w-full h-full object-cover bg-fundo1" src="${imagemSrc}" alt="Imagem da ocorrência" onerror="this.src='../img/Sem Foto.png'">
                </div>
                <div class="rounded-b-xl drop-shadow-black shadow-lg">
                    <figcaption class="pl-2 pt-4 pb-0.5 text-neutral-950">${post.titulo || 'Sem título'}</figcaption>
                    <figcaption class="pl-2 pb-0.5 text-neutral-700">Data: ${dataFormatada}</figcaption>
                    <figcaption class="pl-2 pb-0.5 text-neutral-700">Localização: ${post.localizacao || 'Não informada'}</figcaption>
                    <figcaption class="pl-2 pb-6 text-neutral-700">Usuário: ${nomeUsuario}</figcaption>
                </div>
            `;

            postElement.addEventListener('click', () => abrirDetalhesPost(post));
            postsContainerReal.appendChild(postElement);
        });

        console.log('✅ Renderização concluída - Total de elementos no DOM:', postsContainerReal.children.length);
    }

    // Adiciona estados brasileiros ao filtro de localização
    function popularEstadosBrasileiros() {
        const selectLocalizacao = document.getElementById('localizacao');
        if (!selectLocalizacao) return;

        selectLocalizacao.innerHTML = '<option value="todas">Todos os estados</option>';

        const estados = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ];

        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado;
            option.textContent = estado;
            selectLocalizacao.appendChild(option);
        });
    }

    // LÊ filtros salvos (para persistência ao voltar)
    function carregarFiltrosSalvosSeExistirem() {
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedPage = localStorage.getItem(STORAGE_PAGE);
        if (saved) {
            try {
                const obj = JSON.parse(saved);
                filtrosAtuais = obj;
                if (filtroForm) {
                    if (filtrosAtuais.categoria !== undefined) filtroForm.categoria.value = filtrosAtuais.categoria || 'Todas';
                    if (filtrosAtuais.tipo !== undefined) filtroForm.tipo.value = filtrosAtuais.tipo || 'todos';
                    if (filtrosAtuais.data !== undefined) filtroForm.data.value = filtrosAtuais.data || '';
                    if (filtrosAtuais.localizacao !== undefined) {
                        filtroForm.localizacao.value = filtrosAtuais.localizacao || 'todas';
                    }
                    if (filtrosAtuais.urgencia !== undefined) filtroForm.urgencia.value = filtrosAtuais.urgencia || 'todas';
                }
            } catch (e) {
                console.warn('Erro ao ler filtros salvos:', e);
            }
        }
        if (savedPage) {
            const p = parseInt(savedPage, 10);
            if (!Number.isNaN(p) && p > 0) paginaAtual = p;
        }
    }

    // Remove filtros salvos
    function limparFiltrosSalvos() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_PAGE);
    }

    // Função para limpar filtros
    function limparTodosFiltros() {
        console.log('🔧 Limpando filtros...');
        
        if (filtroForm) {
            filtroForm.reset();
            filtroForm.categoria.value = 'Todas';
            filtroForm.tipo.value = 'todos';
            filtroForm.data.value = '';
            filtroForm.localizacao.value = 'todas';
            filtroForm.urgencia.value = 'todas';
        }
        
        paginaAtual = 1;
        filtrosAtuais = {};
        limparFiltrosSalvos();
        carregarEPaginarPosts({});
        console.log('✅ Filtros limpos!');
    }

    // Evento submit do formulário de filtros
    if (filtroForm) {
        filtroForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            let categoria = filtroForm.categoria.value || '';
            let tipo = filtroForm.tipo.value || '';
            let data = filtroForm.data.value || '';
            let localizacao = filtroForm.localizacao.value || '';
            let urgencia = filtroForm.urgencia.value || '';

            // Ajusta valores
            if (categoria === 'Todas') categoria = '';
            if (tipo === 'todos') tipo = '';
            if (localizacao === 'todas') localizacao = '';
            if (urgencia === 'todas') urgencia = '';

            filtrosAtuais = { categoria, tipo, data, localizacao, urgencia };
            console.log('🎯 Filtros aplicados:', filtrosAtuais);

            // CORREÇÃO: Sempre volta para página 1 ao aplicar filtro
            paginaAtual = 1;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrosAtuais));
            localStorage.setItem(STORAGE_PAGE, String(paginaAtual));
            carregarEPaginarPosts(filtrosAtuais);
        });
    }

    // Inicialização
    function inicializar() {
        popularEstadosBrasileiros();
        
        const botaoLimparFiltros = document.getElementById('limparFiltros');
        if (botaoLimparFiltros) {
            console.log('🔧 Botão limpar filtros encontrado, adicionando evento...');
            botaoLimparFiltros.addEventListener('click', limparTodosFiltros);
        } else {
            console.error('❌ Botão limpar filtros não encontrado!');
        }
        
        carregarFiltrosSalvosSeExistirem();

        if (!filtrosAtuais || Object.keys(limparFiltros(filtrosAtuais)).length === 0) {
            filtrosAtuais = {};
        }

        carregarEPaginarPosts(filtrosAtuais);
    }

    // Inicia a aplicação
    inicializar();
});