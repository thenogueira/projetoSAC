document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');

    const postsContainerErro = document.querySelector('div#postsContainerErro')

    const postsContainerReal = document.querySelector('div#postsContainerReal')

    if (!postsContainer) {
        console.error('Elemento postsContainer não encontrado no DOM.');
        return;
    }

    function abrirDetalhesPost(post) {
        window.location.href = `detalhePost.html?id=${post.id}`;
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
            const postElement = document.createElement('figure');
            postElement.classList.add('w-75', 'h-65', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto', 'cursor-pointer');

            // Corrigir data
            let dataFormatada = '';
            if (post.data) {
                const dataObj = new Date(post.data);
                dataFormatada = isNaN(dataObj.getTime()) ? '' : dataObj.toLocaleDateString();
            }

            // Corrigir nome do usuário
            let nomeUsuario = '';
            if (typeof post.nome === 'string') {
                nomeUsuario = post.nome;
            } else if (post.usuario && typeof post.usuario.nome === 'string') {
                nomeUsuario = post.usuario.nome;
            } else {
                nomeUsuario = 'Desconhecido';
            }

            postElement.innerHTML = `
                <div class="w-full h-full overflow-hidden rounded-t-xl">
                    <img class="w-full h-full object-cover bg-fundo1" src="${post.imagem || '../img/Sem Foto.png'}" alt="Imagem da ocorrência">
                </div>
                <div class="rounded-b-xl drop-shadow-black shadow-lg">
                    <figcaption class="indent-2 pt-4 pb-0.5 text-neutral-950">${post.titulo || ''}</figcaption>
                    <figcaption class="indent-2 pb-0.5 text-neutral-700">Data: ${dataFormatada || 'Não informada'}</figcaption>
                    <figcaption class="indent-2 pb-6 text-neutral-700">Usuário: ${nomeUsuario}</figcaption>
                </div>
            `;

            // Ao clicar, abre a página de detalhes
            postElement.addEventListener('click', () => abrirDetalhesPost(post));

            postsContainerReal.appendChild(postElement); 
            
        });

    } catch (error) {
        console.error('Erro ao carregar as ocorrências:', error);
        postsContainerErro.innerHTML = '<p class="text-center text-red-500">Erro ao carregar as postagens. Tente novamente mais tarde.</p>';
    }
});