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

    modal.classList.remove('hidden');

    modalCloseBtn.onclick = () => modal.classList.add('hidden');
}

function usuarioEstaLogado() {
    const token = localStorage.getItem('authToken');
    const usuario = localStorage.getItem('usuarioLogado');
    return !!(token && usuario);
}

// ================================
// FUNÇÃO DE VERIFICAÇÃO DE LOGIN PARA INTERAÇÕES - ADICIONADA
// ================================
function verificarLoginParaInteracao() {
    if (!usuarioEstaLogado()) {
        mostrarModal('Erro', 'Você precisa fazer login para interagir', 'erro');
        window.location.href = 'login.html';
        return false;

        
    }
    return true;
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

// ================================
// RENDER POSTAGENS - COM VERIFICAÇÃO DE LOGIN
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
    const card = document.createElement('div');
    card.className = `flex flex-col rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 ${isLarge ? 'h-full' : 'h-80'}`;
    
    // Tornar a postagem clicável - COM VERIFICAÇÃO DE LOGIN
    card.addEventListener('click', () => {
        if (!verificarLoginParaInteracao()) return;
        window.location.href = `postagens.html?id=${post.id || ''}`;
    });

    const imgContainer = document.createElement('div');
    imgContainer.className = `${isLarge ? 'flex-1' : 'h-40'} overflow-hidden bg-gray-100`;
    
    // Corrigir o problema das imagens
    let imagemUrl = '../img/Sem Foto.png'; // imagem padrão
    
    if (post.imagem) {
        try {
            // Se a imagem for um array/JSON string, pega a primeira imagem
            const imagens = JSON.parse(post.imagem);
            if (Array.isArray(imagens) && imagens.length > 0) {
                imagemUrl = imagens[0];
            } else if (typeof post.imagem === 'string' && post.imagem.startsWith('data:image')) {
                imagemUrl = post.imagem;
            }
        } catch (e) {
            // Se não for JSON, usa a string diretamente
            if (typeof post.imagem === 'string' && post.imagem.startsWith('data:image')) {
                imagemUrl = post.imagem;
            }
        }
    }
    
    imgContainer.innerHTML = `<img class="w-full h-full object-cover" src="${imagemUrl}" alt="${post.titulo || 'Postagem sem título'}" onerror="this.src='../img/Sem Foto.png'">`;

    const content = document.createElement('div');
    content.className = 'bg-white p-4';
    content.innerHTML = `
        <h3 class="font-bold ${isLarge ? 'text-xl' : 'text-lg'} truncate">${post.titulo || 'Sem título'}</h3>
        <div class="flex items-center justify-between my-2">
            <span class="text-xs px-2 py-1 rounded-full ${getTypeColorClass(post.tipo)}">
                ${post.tipo || 'Geral'}
            </span>
            <span class="text-xs text-gray-500 truncate">${post.localizacao || ''}</span>
        </div>
        <p class="text-sm text-gray-600 mt-2"><strong>Data:</strong> ${formatarData(post.data_criacao)}</p>
        <p class="text-sm text-gray-600"><strong>Por:</strong> ${post.usuario?.nome || post.usuarioNome || 'Anônimo'}</p>
    `;

    card.appendChild(imgContainer);
    card.appendChild(content);
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