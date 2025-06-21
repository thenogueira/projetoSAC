document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');

    const postsContainerErro = document.querySelector('div#postsContainerErro')

    const postsContainerReal = document.querySelector('div#postsContainerReal')

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

            postElement.classList.add('w-75', 'h-65', 'flex', 'flex-col', 'justify-center', 'rounded-xl', 'm-auto'); 

            // const divElement1 = document.createElement('div');

            // divElement1.classList.add('w-75', 'h-50');

            // postElement.appendChild(divElement1);


            postElement.innerHTML = `
                <div class="w-full h-full overflow-hidden rounded-t-xl">
                    <img class="w-full h-full object-cover bg-fundo1" src="${post.imagem || '../img/Sem Foto.png'}" alt="Imagem da ocorrência">
                </div>

                <div class="rounded-b-xl drop-shadow-black shadow-lg">
                    <figcaption class="indent-2 pt-4 pb-0.5 text-neutral-950">${post.titulo}</figcaption>

                    <figcaption class="indent-2 pb-0.5 text-neutral-700">Data: ${new Date(post.data).toLocaleDateString()}</figcaption>

                    <figcaption class="indent-2 pb-6 text-neutral-700">Usuário: ${post.usuario || 'Desconhecido'}</figcaption>
                </div>
            `;

            // <p class="indent-2 text-sm text-neutral-700">${post.descricao}</p>
            
            postsContainerReal.appendChild(postElement); 
            
        });

    } catch (error) {
        console.error('Erro ao carregar as ocorrências:', error);
        postsContainerErro.innerHTML = '<p class="text-center text-red-500">Erro ao carregar as postagens. Tente novamente mais tarde.</p>';
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