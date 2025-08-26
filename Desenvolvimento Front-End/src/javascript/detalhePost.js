document.addEventListener('DOMContentLoaded', async function() {
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        window.location.href = 'postagens.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
        if (!response.ok) throw new Error('Post não encontrado');
        
        const post = await response.json();
        renderPostDetails(post);
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        document.getElementById('postDetails').innerHTML = `
            <div class="text-center text-red-500">
                Erro ao carregar os detalhes da postagem. Tente novamente mais tarde.
            </div>
        `;
    }
});

function renderPostDetails(post) {
    const dataFormatada = post.data_criacao ? new Date(post.data_criacao).toLocaleDateString() : 'Não informada';
    const nomeUsuario = post.usuario?.nome || 'Usuário não identificado';

    document.getElementById('postDetails').innerHTML = `
        <h1 class="text-3xl font-bold mb-6">${post.titulo}</h1>
        
        <div class="mb-8">
            <img src="${post.imagem || '../img/Sem Foto.png'}" 
                 alt="Imagem da postagem" 
                 class="w-full h-96 object-cover rounded-xl">
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="space-y-2">
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Categoria:</strong> ${post.categoria}</p>
                <p><strong>Tipo:</strong> ${post.tipo}</p>
            </div>
            <div class="space-y-2">
                <p><strong>Usuário:</strong> ${nomeUsuario}</p>
                <p><strong>Localização:</strong> ${post.localizacao}</p>
                <p><strong>Urgência:</strong> <span class="${getUrgencyClass(post.urgencia)}">${post.urgencia}</span></p>
            </div>
        </div>
        
        <div class="border-t pt-6">
            <h2 class="text-xl font-semibold mb-4">Descrição</h2>
            <p class="text-gray-700 whitespace-pre-wrap">${post.descricao}</p>
        </div>
    `;

    // Setup contatar button
    document.getElementById('contatarButton').addEventListener('click', () => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado) {
            alert('Você precisa estar logado para contatar o usuário.');
            window.location.href = 'login.html';
            return;
        }
        // Add contact logic here
    });
}

function getUrgencyClass(urgencia) {
    if (!urgencia) return 'text-gray-500';
    
    const classes = {
        'ALTA': 'text-red-600 font-bold',
        'MEDIA': 'text-yellow-600 font-bold',
        'BAIXA': 'text-green-600 font-bold'
    };
    
    return classes[urgencia.toUpperCase()] || 'text-gray-500';
}
