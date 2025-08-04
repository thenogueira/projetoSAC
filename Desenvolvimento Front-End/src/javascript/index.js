/**
 * Observador de Intersecção para animar elementos quando ficam visíveis no viewport.
 * Adiciona/remove a classe 'publicado' dependendo da visibilidade do elemento.
 */
const myObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add('publicado')
        } else {
            entry.target.classList.remove('publicado')
        }
    })
})

// Observa todos os elementos com classe '.publique'
const publicados = document.querySelectorAll('.publique')
publicados.forEach((element) => myObserver.observe(element))

/**
 * Segundo Observador de Intersecção com configuração independente.
 * Gerencia elementos com classe diferente do primeiro observador.
 */
const myObserverA = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add('publicados')
        } else {
            entry.target.classList.remove('publicados')
        }
    })
})

// Observa todos os elementos com classe '.publiques'
const publicadosA = document.querySelectorAll('.publiques')
publicadosA.forEach((element) => myObserverA.observe(element))

/**
 * Terceiro Observador de Intersecção para outro conjunto de elementos.
 * Mantém a mesma lógica mas com classes diferentes.
 */
const myObserverB = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add('publicadoB')
        } else {
            entry.target.classList.remove('publicadoB')
        }
    })
})

// Observa todos os elementos com classe '.publiqueB'
const publicadosB = document.querySelectorAll('.publiqueB')
publicadosB.forEach((element) => myObserverB.observe(element))






/**
 * Busca postagens recentes da API.
 * @async
 * @function fetchPostagens
 * @throws {Error} Quando ocorre erro na requisição HTTP
 * @returns {Promise<void>}
 */
async function fetchPostagens() {
    try {
        console.log("Iniciando busca de postagens...");
        const response = await fetch('http://localhost:8080/ocorrencias/recentes');
        
        console.log("Status da resposta:", response.status);
        
        if (!response.ok) {
            console.error("Erro na resposta:", response.statusText);
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        
        const postagens = await response.json();
        console.log("Postagens recebidas:", postagens);
        
        renderPostagens(postagens);
    } catch (error) {
        console.error("Erro completo:", error);
        renderPostagens(getFallbackPostagens());
    }
}

/**
 * Renderiza as postagens no container especificado.
 * @function renderPostagens
 * @param {Array<Object>} postagens - Array de objetos contendo dados das postagens
 */
function renderPostagens(postagens) {
    const container = document.getElementById('postsContainer');
    if (!container) {
        console.error("Container de postagens não encontrado!");
        return;
    }

    // Limpa o container
    container.innerHTML = '';

    // Se não houver postagens, mostra mensagem
    if (!postagens || postagens.length === 0) {
        container.innerHTML = '<p class="text-center py-8">Nenhuma postagem encontrada</p>';
        return;
    }

    // Cria a estrutura do layout
    const wrapper = document.createElement('div');
    wrapper.className = 'w-full h-[86.67%] flex flex-col lg:flex-row gap-4 lg:gap-10';
    
    // Coluna principal (postagem destacada)
    const mainPost = document.createElement('div');
    mainPost.className = 'lg:w-[55%] w-full';
    
    // Grid de postagens secundárias
    const gridPosts = document.createElement('div');
    gridPosts.className = 'lg:w-[45%] w-full grid grid-cols-1 sm:grid-cols-2 gap-4';

    // Adiciona a primeira postagem como destaque
    if (postagens[0]) {
        mainPost.appendChild(createPostCard(postagens[0], true));
    }

    // Adiciona as demais postagens ao grid
    postagens.slice(1, 5).forEach(post => {
        if (post) {
            gridPosts.appendChild(createPostCard(post, false));
        }
    });

    // Monta o layout
    wrapper.appendChild(mainPost);
    wrapper.appendChild(gridPosts);
    container.appendChild(wrapper);
}

/**
 * Cria um card de postagem HTML.
 * @function createPostCard
 * @param {Object} post - Dados da postagem
 * @param {boolean} isLarge - Indica se o card deve ser maior (destaque)
 * @returns {HTMLElement} Elemento HTML do card criado
 */
function createPostCard(post, isLarge) {
    const card = document.createElement('div');
    card.className = `flex flex-col rounded-xl overflow-hidden shadow-lg ${isLarge ? 'h-full' : 'h-80'}`;
    
    // Imagem
    const imgContainer = document.createElement('div');
    imgContainer.className = `${isLarge ? 'flex-1' : 'h-40'} overflow-hidden bg-gray-100`;
    imgContainer.innerHTML = `<img class="w-full h-full object-cover" src="${post.imagem || '../img/Sem Foto.png'}" alt="${post.titulo || 'Postagem sem título'}">`;
    
    // Conteúdo
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
        <p class="text-sm text-gray-600 mt-2">
            <strong>Data:</strong> ${formatarData(post.data_criacao)}
        </p>
        <p class="text-sm text-gray-600">
            <strong>Por:</strong> ${post.usuario?.nome || post.usuarioNome || 'Anônimo'}
        </p>
    `;
    
    card.appendChild(imgContainer);
    card.appendChild(content);
    return card;
}

/**
 * Retorna classes CSS baseadas no tipo de postagem.
 * @function getTypeColorClass
 * @param {string} tipo - Tipo da postagem (DOACAO, NECESSIDADE, etc)
 * @returns {string} Classes CSS correspondentes ao tipo
 */
function getTypeColorClass(tipo) {
    if (!tipo) return 'bg-gray-100 text-gray-800';
    
    const colors = {
        DOACAO: 'bg-green-100 text-green-800',
        NECESSIDADE: 'bg-red-100 text-red-800',
        VOLUNTARIADO: 'bg-blue-100 text-blue-800',
        EVENTO: 'bg-purple-100 text-purple-800'
    };
    
    return colors[tipo] || 'bg-gray-100 text-gray-800';
}

/**
 * Retorna postagens de fallback quando a API falha.
 * @function getFallbackPostagens
 * @returns {Array<Object>} Array de postagens mockadas
 */
function getFallbackPostagens() {
    return [
        {
            titulo: "Necessitamos de doações de alimentos",
            imagem: "../img/Sem Foto.png",
            data_criacao: new Date().toISOString(),
            tipo: "NECESSIDADE",
            localizacao: "São Paulo, SP",
            usuarioNome: "Comunidade Local"
        },
        // Adicione mais postagens mockadas conforme necessário
    ];
}

/**
 * Formata uma string de data para o formato brasileiro.
 * @function formatarData
 * @param {string} dataString - Data em formato ISO ou similar
 * @returns {string} Data formatada ou mensagem de erro
 */
function formatarData(dataString) {
    if (!dataString) return "Não informada";
    
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error("Erro ao formatar data:", e);
        return dataString;
    }
}

let expandir = document.querySelector('div#expandir')

let menu = document.querySelector('div.menu')

let imagem = document.querySelector('div.imagem')

expandir.addEventListener('click', clicar)

function clicar(){
    menu.classList.toggle("expandir")

    imagem.classList.toggle("imagem-dep")

}
