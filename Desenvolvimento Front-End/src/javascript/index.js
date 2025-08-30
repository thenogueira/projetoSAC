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
    const card = document.createElement('div');
    card.className = `flex flex-col rounded-xl overflow-hidden shadow-lg ${isLarge ? 'h-full' : 'h-80'}`;

    const imgContainer = document.createElement('div');
    imgContainer.className = `${isLarge ? 'flex-1' : 'h-40'} overflow-hidden bg-gray-100`;
    imgContainer.innerHTML = `<img class="w-full h-full object-cover" src="${post.imagem || '../img/Sem Foto.png'}" alt="${post.titulo || 'Postagem sem título'}">`;

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
        EVENTO: 'bg-purple-100 text-purple-800'
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

// ================================
// MENU DO USUÁRIO
// ================================
// Seleciona o botão que abre o menu (a div que contém a foto e o nome)
let expandir = document.querySelector('div#expandir')

let menu = document.querySelector('div#menu')

let imagem = document.querySelector('div#imagem')

menu.addEventListener('click', clicar)

function clicar(){

    menu.classList.toggle("expandir")

    imagem.classList.toggle("dep")

}


// const usuarioButton = document.querySelector('#logado > div > div > a > div.flex.gap-3');

// // Seleciona o menu que vai aparecer
// const menu = document.querySelector('#expandir .menu');

// // Evento de clique no usuário
// usuarioButton.addEventListener('click', function(e){
//     e.preventDefault(); // previne o href "#"
//     menu.classList.toggle('expandir'); // adiciona ou remove a classe expandir
// });



// ================================
// INICIA FETCH AUTOMATICAMENTE
// ================================
fetchPostagens();

