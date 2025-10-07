document.addEventListener('DOMContentLoaded', async () => {
  const postDetails = document.getElementById('postDetails');
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Controle do menu
  if (userLogado) {
    document.getElementById('menu-antigo').classList.add('hidden');
    document.getElementById('menu-novo').classList.remove('hidden');
    document.getElementById('profileName').textContent = userLogado.nome;
    document.getElementById('profileImage').src =
      userLogado.profileImage || '../img/defaultPhoto.png';
  }

  if (!postId) {
    postDetails.innerHTML = `<p class="text-center text-red-500">
      Nenhum post selecionado. Volte para a página de postagens e escolha um.
    </p>`;
    return;
  }

  try {
    // 1. Buscar post no backend
    const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
    if (!response.ok) throw new Error(`Erro ao buscar post. Status: ${response.status}`);
    const post = await response.json();

    console.log("Post recebido:", post); // DEBUG

    const dataCriacao = post.data_criacao
      ? new Date(post.data_criacao).toLocaleDateString('pt-BR')
      : 'Data não informada';

    const nomeUsuario = post.usuarioNome || 'Usuário não identificado';
    const emailUsuario = ""; // Email não está vindo no backend
    const idLogado = userLogado?.id || userLogado?.idUsuario || null;

// --- GALERIA DE IMAGENS ---
let imagemPostHtml = '';

const todasImagens = [];

// Adiciona a imagem principal se existir
if (post.imagem && post.imagem !== '../img/defaultPhoto.png') {
  todasImagens.push(post.imagem);
}

// Adiciona imagens extras se existirem
if (Array.isArray(post.imagens) && post.imagens.length > 0) {
  post.imagens.forEach(img => {
    if (img && img !== '../img/defaultPhoto.png') {
      todasImagens.push(img);
    }
  });
}

if (todasImagens.length > 0) {
  const mostrarBotao = todasImagens.length > 4;

  imagemPostHtml = `
    <hr class="text-minitexto my-8">

    <section class="flex gap-10 items-center justify-start relative overflow-hidden imagem-container">
      ${todasImagens.map(img => `
        <div class="w-55 h-55 bg-fundo2 rounded-2xl overflow-hidden flex-shrink-0">
          <img class="w-full h-full object-cover" 
               src="${img}" 
               alt="Imagem da postagem" 
               onerror="this.src='../img/defaultPhoto.png'">
        </div>
      `).join('')}

      ${mostrarBotao ? `
        <button id="botaoRolarImagens" class="absolute right-[-15px] bg-black rounded-4xl p-2 hover:bg-destaque transition">
          <img src="../img/right.png" alt="Ver mais">
        </button>
      ` : ''}
    </section>
  `;
}
    // --- FIM DA GALERIA DE IMAGENS ---

    // 3. Renderizar HTML principal
    postDetails.innerHTML = `
      <h1 class="text-4xl mb-1">${post.titulo || 'Sem título'}</h1>
      <p class="text-minitexto">Data da postagem: ${dataCriacao}</p>

      <div class="flex items-center justify-between mb-6 w-full mt-8">
        <div class="flex gap-5 items-center">
          <div class="rounded-full overflow-hidden w-14 h-14 bg-gray-300">
            <img class="object-cover w-full h-full" 
                 src="${post.usuarioImagem || '../img/defaultPhoto.png'}" 
                 alt="Foto de Perfil"
                 onerror="this.src='../img/defaultPhoto.png'">
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-bold">${nomeUsuario}</span>
            <span class="text-xl">☆☆☆☆☆</span>
          </div>
        </div>
        <div class="flex gap-3">
          ${
            idLogado && post.usuarioId === idLogado
              ? ""
              : emailUsuario
                ? `<button id="contatarButton" class="bg-fundo1 border border-black py-2 px-4 rounded-xl hover:bg-destaque hover:text-white">Contactar</button>`
                : `<button disabled class="bg-gray-300 py-2 px-4 rounded-xl opacity-50 cursor-not-allowed">Contactar</button>`
          }
          ${
            idLogado && post.usuarioId === idLogado
              ? `
              <button id="editarButton" class="px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500">Editar</button>
              <button id="excluirButton" class="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-white">Excluir</button>
              `
              : ''
          }
        </div>
      </div>

      <hr class="text-minitexto my-12">

      <div>
        <ul class="text-xl mb-8">
          <li class="flex items-center gap-2 mb-4"><p class="font-bold">Tipo:</p> <p>${post.tipo || 'Não informado'}</p></li>
          <li class="flex items-center gap-2 mb-4"><p class="font-bold">Categoria:</p> <p>${post.categoria || 'Não informada'}</p></li>
          <li class="flex items-center gap-2 mb-4"><p class="font-bold">Localização:</p> <p>${post.localizacao || 'Não informada'}</p></li>
        </ul>

        <label class="text-xl font-bold">Descrição</label>
        <p class="border border-black w-full rounded-xl py-2 px-4 mt-2">
          ${post.descricao || 'Sem descrição disponível.'}
        </p>
      </div>

      <!-- ✅ Imagem da postagem abaixo da descrição -->
      ${imagemPostHtml}
    `;

    // Botão de contato
    if (emailUsuario && !(idLogado && post.usuarioId === idLogado)) {
      document.getElementById('contatarButton')?.addEventListener('click', () => {
        const mailtoLink = `mailto:${emailUsuario}?subject=Contato sobre sua postagem no SAC&body=Olá ${nomeUsuario}, vi sua postagem e gostaria de conversar.`;
        window.location.href = mailtoLink;
      });
    }

    // Botão editar
    document.getElementById('editarButton')?.addEventListener('click', () => {
      window.location.href = `editPost.html?id=${post.id}`;
    });

    // Botão excluir
    document.getElementById('excluirButton')?.addEventListener('click', async () => {
      if (confirm('Deseja realmente excluir este post?')) {
        try {
          const delResponse = await fetch(`http://localhost:8080/ocorrencias/deletar/${post.id}`, {
            method: 'DELETE'
          });

          if (!delResponse.ok) throw new Error(`Erro ao deletar post. Status: ${delResponse.status}`);

          alert('Post excluído com sucesso!');
          window.location.href = 'postagens.html';
        } catch (err) {
          alert('Erro ao deletar post: ' + err.message);
        }
      }
    });

  } catch (error) {
    postDetails.innerHTML = `<p class="text-center text-red-500">
      Ocorreu um erro ao carregar a postagem.<br>
      <small>${error.message}</small>
    </p>`;
  }
});
