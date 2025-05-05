document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');

    if (!postsContainer) {
        console.error('Elemento postsContainer não encontrado no DOM.');
        return;
    }

    try {
        // Busca as ocorrências do backend
        const response = await fetch('http://localhost:8080/ocorrencias/listar');
        if (!response.ok) {
            throw new Error('Erro ao buscar ocorrências do backend');
        }

        const posts = await response.json();

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-center text-gray-500">Nenhuma postagem encontrada.</p>';
            return;
        }

        // Gera o HTML para cada ocorrência
        posts.forEach(post => {
            const postElement = document.createElement('figure'); // <figcaption class="indent-2 pb-4">Urgência: <strong class="${getUrgencyClass(post.urgencia)}">${post.urgencia}</strong></figcaption>
            postElement.classList.add('shadow-lg', 'drop-shadow-black', 'w-[300px]', 'h-auto', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto');
            postElement.innerHTML = `
                <img class="w-100 rounded-t-xl" src="${post.imagem || '../img/default-image.png'}" alt="Imagem da ocorrência">
                <figcaption class="indent-2 pt-2 pb-0 font-bold">${post.titulo}</figcaption>
                <p class="indent-2 text-sm text-gray-600">${post.descricao}</p>
                <p class="indent-2 text-xs text-gray-400">Data: ${new Date(post.data).toLocaleDateString()}</p>
                <p class="indent-2 text-xs text-gray-500">Usuário: ${post.usuario || 'Desconhecido'}</p>
            `;
            postsContainer.appendChild(postElement); 
        });
    } catch (error) {
        console.error('Erro ao carregar as ocorrências:', error);
        postsContainer.innerHTML = '<p class="text-center text-red-500">Erro ao carregar as postagens. Tente novamente mais tarde.</p>';
    }

    // Função para definir a classe de cor com base na urgência
    // function getUrgencyClass(urgencia) {
    //     if (!urgencia) {
    //         return 'text-gray-500 font-medium'; // Classe padrão para valores indefinidos
    //     }
    //     switch (urgency.toLowerCase()) {
    //         case 'alta':
    //             return 'text-red-600 font-medium';
    //         case 'média':
    //             return 'text-amber-500 font-medium';
    //         case 'baixa':
    //             return 'text-blue-600 font-medium';
    //         default:
    //             return 'text-gray-500 font-medium'; // Classe padrão para valores inválidos
    //     }
    // }
});