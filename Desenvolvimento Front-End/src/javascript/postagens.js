document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('postsContainer');

    if (!postsContainer) {
        console.error('Elemento postsContainer não encontrado no DOM.');
        return;
    }

    // Retrieve posts from localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p class="text-center text-gray-500">Nenhuma postagem encontrada.</p>';
        return;
    }

    // Generate HTML for each post
    posts.forEach(post => {
        const postElement = document.createElement('figure');
        postElement.classList.add('shadow-lg', 'drop-shadow-black', 'w-[300px]', 'h-auto', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto');
        postElement.innerHTML = `
            <figcaption class="indent-2 pt-2 pb-0 font-bold">${post.titulo}</figcaption>
            <figcaption class="indent-2 pb-4">Urgência: <strong class="${getUrgencyClass(post.urgencia)}">${post.urgencia}</strong></figcaption>
            <p class="indent-2 text-sm text-gray-600">${post.descricao}</p>
            <p class="indent-2 text-xs text-gray-400">Data: ${post.data}</p>
            <p class="indent-2 text-xs text-gray-500">Usuário: ${post.usuario || 'Desconhecido'}</p>
        `;
        postsContainer.appendChild(postElement);
    });

    // Function to define urgency class
    function getUrgencyClass(urgency) {
        switch (urgency.toLowerCase()) {
            case 'alta':
                return 'text-red-600 font-medium';
            case 'média':
                return 'text-amber-500 font-medium';
            case 'baixa':
                return 'text-blue-600 font-medium';
            default:
                return 'text-gray-500 font-medium';
        }
    }
});