document.addEventListener('DOMContentLoaded', async function () {
    const postsContainer = document.getElementById('postsContainer');

    const postsContainerErro = document.querySelector('div#postsContainerErro')

    const postsContainerReal = document.querySelector('div#postsContainerReal')

    if (!postsContainer) {
        console.error('Elemento postsContainer não encontrado no DOM.');
        return;
    }

    // Cria o modal de detalhes (apenas uma vez)
    let modalDetalhes = document.getElementById('modalDetalhesPost');
    if (!modalDetalhes) {
        modalDetalhes = document.createElement('div');
        modalDetalhes.id = 'modalDetalhesPost';
        modalDetalhes.className = 'hidden fixed inset-0 flex items-center justify-center bg-bla-40 z-50';
        modalDetalhes.innerHTML = `
            <div id="modalConteudoPost" class="bg-white max-w-lg w-full rounded-xl p-8 relative shadow-2xl">
                <button id="fecharModalDetalhes" class="absolute top-2 right-4 text-2xl text-gray-500 hover:text-black">&times;</button>
                <div id="detalhesPostContent"></div>
            </div>
        `;
        document.body.appendChild(modalDetalhes);

        // Fechar ao clicar no X
        modalDetalhes.querySelector('#fecharModalDetalhes').onclick = () => {
            modalDetalhes.classList.add('hidden');
        };
        // Fechar ao clicar fora do conteúdo
        modalDetalhes.addEventListener('click', function (e) {
            if (e.target === modalDetalhes) {
                modalDetalhes.classList.add('hidden');
            }
        });
    }

    function abrirModalDetalhes(post) {
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
        // Outras informações
        const descricao = post.descricao || '';
        const tipo = post.tipo || '';
        const categoria = post.categoria || '';
        const localizacao = post.localizacao || '';
        const urgencia = post.urgencia || post.urgência || '';
        const imagem = post.imagem || '../img/Sem Foto.png';

        document.getElementById('detalhesPostContent').innerHTML = `
            <h2 class="text-2xl font-bold mb-2">${post.titulo || ''}</h2>
            <img src="${imagem}" alt="Imagem da ocorrência" class="w-full h-56 object-cover rounded-lg mb-4 bg-fundo1">
            <p class="mb-1"><strong>Data:</strong> ${dataFormatada || 'Não informada'}</p>
            <p class="mb-1"><strong>Usuário:</strong> ${nomeUsuario}</p>
            <p class="mb-1"><strong>Tipo:</strong> ${tipo}</p>
            <p class="mb-1"><strong>Categoria:</strong> ${categoria}</p>
            <p class="mb-1"><strong>Localização:</strong> ${localizacao}</p>
            <p class="mb-1"><strong>Urgência:</strong> ${urgencia}</p>
            <p class="mb-3"><strong>Descrição:</strong><br>${descricao}</p>
        `;
        modalDetalhes.classList.remove('hidden');
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

            // Ao clicar, abre o modal de detalhes
            postElement.addEventListener('click', () => abrirModalDetalhes(post));

            postsContainerReal.appendChild(postElement); 
            
        });

    } catch (error) {
        console.error('Erro ao carregar as ocorrências:', error);
        postsContainerErro.innerHTML = '<p class="text-center text-red-500">Erro ao carregar as postagens. Tente novamente mais tarde.</p>';
    }


    

    let linkCriar = document.querySelector('#linkCriar')

    linkCriar.addEventListener("mousedown", function (){
        linkCriar.classList.add('text-[14px]')
    })

    linkCriar.addEventListener("mouseup", function (){
        linkCriar.classList.remove('text-[14px]')
    })

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