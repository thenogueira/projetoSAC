// ================================
// OBSERVADORES DE INTERSECÇÃO
// ================================
const observerFactory = (className, addClass) => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(addClass);
            } else {
                entry.target.classList.remove(addClass);
            }
        });
    });
    document.querySelectorAll(className).forEach(el => observer.observe(el));
};

observerFactory('.publique', 'publicado');
observerFactory('.publiques', 'publicados');
observerFactory('.publiqueB', 'publicadoB');

// ================================
// VERIFICAR SE USUÁRIO ESTÁ LOGADO
// ================================
function usuarioEstaLogado() {
    const token = localStorage.getItem('authToken');
    const usuario = localStorage.getItem('usuarioLogado');
    return !!(token && usuario);
}

// ================================
// MOSTRAR/OCULTAR BOTÃO CADASTRO
// ================================
function toggleBotaoCadastro() {
    const botaoCadastroSection = document.querySelector('aside');
    if (botaoCadastroSection) {
        if (usuarioEstaLogado()) {
            botaoCadastroSection.style.display = 'none';
        } else {
            botaoCadastroSection.style.display = 'flex';
        }
    }
}

// ================================
// FETCH POSTAGENS
// ================================
async function fetchPostagens() {
    try {
        const response = await fetch('http://localhost:8080/ocorrencias/recentes');
        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
        const postagens = await response.json();
        renderPostagens(postagens);
    } catch (error) {
        console.error("Erro ao buscar postagens:", error);
        renderPostagens(getFallbackPostagens());
    }
}

function primeiroESobrenomeCompleto(nome) {
    if (!nome) return 'Desconhecido';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0];
    return `${partes[0]} ${partes[partes.length - 1]}`;
}

// ================================
// RENDER POSTAGENS
// ================================
function renderPostagens(postagens) {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!postagens || postagens.length === 0) {
        container.innerHTML = '<p class="text-center py-8">Nenhuma postagem encontrada</p>';
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'w-full h-[86.67%] flex flex-col lg:flex-row gap-4 lg:gap-10';

    const mainPost = document.createElement('div');
    mainPost.className = 'lg:w-[55%] w-full';

    const gridPosts = document.createElement('div');
    gridPosts.className = 'lg:w-[45%] w-full grid grid-cols-1 sm:grid-cols-2 gap-4';

    if (postagens[0]) mainPost.appendChild(createPostCard(postagens[0], true));
    postagens.slice(1, 5).forEach(post => {
        if (post) gridPosts.appendChild(createPostCard(post, false));
    });

    wrapper.appendChild(mainPost);
    wrapper.appendChild(gridPosts);
    container.appendChild(wrapper);
}

function createPostCard(post, isLarge) {

    const card = document.createElement('figure');
    card.classList.add(
        'flex', 'flex-col', 'justify-center',
        'rounded-xl', 'cursor-pointer', 'overflow-hidden',
        'shadow-md', 'bg-white'
    );

    // CORREÇÃO AQUI 👇
    if (isLarge) {
        card.classList.add('w-full', 'h-full');
    } else {
        card.classList.add('w-full', 'h-full');
    }

    // 📅 Data formatada
    const dataCriacao = post.data_criacao
        ? new Date(post.data_criacao).toLocaleDateString('pt-BR')
        : 'Data não informada';

    const nomeUsuario = post.usuario && post.usuario.nome
        ? primeiroESobrenomeCompleto(post.usuario.nome)
        : (post.usuarioNome || 'Desconhecido');

    let tipoFormatado = '';
    if (post.tipo === 'DOACAO') tipoFormatado = 'Doação';
    else if (post.tipo === 'PEDIDO') tipoFormatado = 'Pedido';
    else tipoFormatado = post.tipo
        ? post.tipo.charAt(0).toUpperCase() + post.tipo.slice(1).toLowerCase()
        : '';

    let imagemSrc = '../img/Sem Foto.png';
    if (post.imagem) {
        try {
            if (Array.isArray(post.imagem) && post.imagem.length > 0) {
                imagemSrc = post.imagem[0];
            } else if (typeof post.imagem === 'string' && post.imagem.trim() !== '') {
                const possivelArray = JSON.parse(post.imagem);
                if (Array.isArray(possivelArray) && possivelArray.length > 0) {
                    imagemSrc = possivelArray[0];
                } else {
                    imagemSrc = post.imagem;
                }
            }
        } catch (e) {
            console.warn('⚠️ Erro ao processar imagem do post:', e);
            imagemSrc = post.imagem;
        }
    }

    card.innerHTML = `
        <div class="w-full ${isLarge ? 'h-[80%]' : 'h-[70%]'} overflow-hidden rounded-t-xl">
            <img class="w-full h-full object-cover bg-fundo1 transition-transform duration-500 hover:scale-105" 
                 src="${imagemSrc}" 
                 alt="${post.titulo || 'Imagem da postagem'}"
                 onerror="this.src='../img/Sem Foto.png'">
        </div>
        <div class="rounded-b-xl bg-white drop-shadow-black shadow-md">
            <figcaption class="pl-2 pt-3 pb-0.5 text-neutral-950 font-semibold truncate">
                ${post.titulo || 'Sem título'}
            </figcaption>
            <figcaption class="pl-2 pb-0.5 text-neutral-700 text-sm">
                Usuário: ${nomeUsuario}
            </figcaption>
            <figcaption class="pl-2 pb-0.5 text-neutral-700 text-sm">
                Tipo: ${tipoFormatado}
            </figcaption>
            <figcaption class="pl-2 pb-3 text-neutral-700 text-sm">
                Data: ${dataCriacao}
            </figcaption>

        </div>
    `;

    card.addEventListener('click', () => abrirDetalhesPost(post));

    return card;
}


function getTypeColorClass(tipo) {
    if (!tipo) return 'bg-gray-100 text-gray-800';
    const colors = {
        DOACAO: 'bg-green-100 text-green-800',
        NECESSIDADE: 'bg-red-100 text-red-800',
        VOLUNTARIADO: 'bg-blue-100 text-blue-800',
        EVENTO: 'bg-purple-100 text-purple-800',
        PEDIDO: 'bg-orange-100 text-orange-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
}

function getFallbackPostagens() {
    return [
        {
            titulo: "Necessitamos de doações de alimentos",
            imagem: "../img/Sem Foto.png",
            data_criacao: new Date().toISOString(),
            tipo: "NECESSIDADE",
            localizacao: "São Paulo, SP",
            usuarioNome: "Comunidade Local"
        }
    ];
}

function formatarData(dataString) {
    if (!dataString) return "Não informada";
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
    } catch(e) { return dataString; }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    fetchPostagens();
    toggleBotaoCadastro();
});