document.addEventListener('DOMContentLoaded', async () => {
  const postDetails = document.getElementById('postDetails');
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Funções auxiliares para formatação
  function formatarTipo(tipo) {
      if (!tipo) return 'Não informado';
      
      // Converte para o formato de exibição (primeira letra maiúscula)
      const tipoLower = tipo.toLowerCase();
      if (tipoLower === 'doacao' || tipo === 'DOACAO') {
          return 'Doação';
      } else if (tipoLower === 'pedido' || tipo === 'PEDIDO') {
          return 'Pedido';
      }
      return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
  }

  // ====== FUNÇÃO CORRIGIDA: Buscar dados do usuário ======
  async function buscarDadosUsuario(usuarioId) {
    try {
      // Usa o mesmo endpoint do perfil.js que funciona
      const resp = await fetch(`http://localhost:8080/usuarios/listar/${usuarioId}`);
      
      if (!resp.ok) {
        throw new Error(`Erro ${resp.status}: Usuário não encontrado`);
      }
      
      const usuario = await resp.json();
      console.log('Usuário encontrado:', usuario);
      
      return usuario;
      
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  if (!postId) {
    postDetails.innerHTML = `<p class="text-center text-red-500">
      Nenhum post selecionado. Volte para a página de postagens e escolha um.
    </p>`;
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
    if (!response.ok) throw new Error(`Erro ao buscar post. Status: ${response.status}`);
    const post = await response.json();

    console.log("Post recebido:", post);

    const dataCriacao = post.data_criacao
      ? new Date(post.data_criacao).toLocaleDateString('pt-BR')
      : 'Data não informada';

    const nomeUsuario = post.usuarioNome || 'Usuário não identificado';
    const idLogado = userLogado?.id || userLogado?.idUsuario || null;

    // ===== Função para extrair imagens =====
    function extractImagesFromPost(obj) {
      const resultados = [];
      const seen = new Set();

      function pushIfValid(url) {
        if (!url || typeof url !== 'string') return;
        url = url.trim();
        if (!url) return;
        if (url === '../img/defaultPhoto.png') return;
        if (seen.has(url)) return;
        seen.add(url);
        resultados.push(url);
      }

      function processPossibleArray(field) {
        if (!field && field !== '') return;
        if (Array.isArray(field)) {
          field.forEach(item => {
            if (typeof item === 'string') pushIfValid(item);
            else if (item && typeof item === 'object') {
              if (item.url) pushIfValid(item.url);
              if (item.src) pushIfValid(item.src);
              if (item.path) pushIfValid(item.path);
            }
          });
          return;
        }
        if (typeof field === 'string') {
          let parsed;
          try {
            parsed = JSON.parse(field);
            if (Array.isArray(parsed)) {
              parsed.forEach(p => typeof p === 'string' && pushIfValid(p));
              return;
            }
          } catch (e) {}
          pushIfValid(field);
        }
      }

      processPossibleArray(obj.imagens);
      processPossibleArray(obj.imagem);
      processPossibleArray(obj.fotos);
      processPossibleArray(obj.photos);
      processPossibleArray(obj.images);
      processPossibleArray(obj.anexos);
      processPossibleArray(obj.arquivos);
      processPossibleArray(obj.attachments);
      processPossibleArray(obj.gallery);
      processPossibleArray(obj.galeria);

      for (const k in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        const val = obj[k];
        if (!val) continue;
        if (typeof val === 'string') {
          const looksLikeImage = /^(data:image\/[a-zA-Z]+;base64,)|\.(png|jpe?g|gif|webp|svg)(\?.*)?$|\/uploads\//i.test(val);
          if (looksLikeImage) pushIfValid(val);
        } else if (Array.isArray(val)) {
          val.forEach(item => {
            if (typeof item === 'string') {
              const looksLikeImage = /^(data:image\/[a-zA-Z]+;base64,)|\.(png|jpe?g|gif|webp|svg)(\?.*)?$|\/uploads\//i.test(item);
              if (looksLikeImage) pushIfValid(item);
            } else if (item && typeof item === 'object') {
              if (item.url) pushIfValid(item.url);
              if (item.src) pushIfValid(item.src);
              if (item.path) pushIfValid(item.path);
            }
          });
        } else if (val && typeof val === 'object') {
          if (val.url) pushIfValid(val.url);
          if (val.src) pushIfValid(val.src);
          if (val.path) pushIfValid(val.path);
        }
      }

      function deepScan(o, depth = 0) {
        if (!o || depth > 4) return;
        if (typeof o === 'string') {
          const looksLikeImage = /^(data:image\/[a-zA-Z]+;base64,)|https?:\/\/.*\.(png|jpe?g|gif|webp|svg)(\?.*)?$|\/uploads\//i.test(o);
          if (looksLikeImage) pushIfValid(o);
        } else if (Array.isArray(o)) {
          o.forEach(i => deepScan(i, depth + 1));
        } else if (typeof o === 'object') {
          for (const key in o) {
            if (Object.prototype.hasOwnProperty.call(o, key)) deepScan(o[key], depth + 1);
          }
        }
      }
      deepScan(obj, 0);

      return resultados;
    }

    const todasImagens = extractImagesFromPost(post) || []; // garante array
    console.log('Imagens extraídas do post:', todasImagens);

    let imagens = [];
    try {
      imagens = post.imagens ? JSON.parse(post.imagens) : [];
    } catch {
      imagens = post.imagem ? [post.imagem] : [];
    }
    if (!Array.isArray(imagens)) imagens = []; // fallback

    let imagemPostHtml = "";
    if (todasImagens?.length > 0) { // uso seguro de ?.length
      const mostrarBotao = todasImagens.length > 4;
      imagemPostHtml = `
        <hr class="text-minitexto my-8">
        <section class="flex gap-10 items-center justify-start relative imagem-scroll-wrapper">
          <div class="imagem-scroll-container flex gap-10 items-center justify-start overflow-x-auto no-scrollbar pb-2">
            ${todasImagens.map(img => `
              <div class="w-55 h-55 bg-fundo2 rounded-2xl overflow-hidden flex-shrink-0">
                <img class="w-full h-full object-cover" 
                     src="${img}" 
                     alt="Imagem da postagem" 
                     onerror="this.src='../img/defaultPhoto.png'">
              </div>
            `).join('')}
          </div>
          ${mostrarBotao ? `
            <button id="botaoRolarImagens" class="absolute right-[-15px] bg-black rounded-4xl p-2 hover:bg-destaque transition">
              <img src="../img/right.png" alt="Ver mais">
            </button>
          ` : ''}
        </section>
      `;
    }

    // ===== Renderização principal =====
    postDetails.innerHTML = `
      <div class="flex justify-between mb-6 w-full items-center">
        <div class="flex flex-col">
          <h1 class="text-4xl mb-1">${post.titulo || 'Sem título'}</h1>
          <p class="text-minitexto">Data da postagem: ${dataCriacao}</p>
        </div>

        <a href="#" id="denunciarPost">
          <span class="icon">
            <i class="fa-solid fa-circle-exclamation text-red-500 text-3xl"></i>
          </span>
        </a>
      </div>

      <div class="flex items-center justify-between mb-6 w-full mt-8">
        <div class="flex gap-5 items-center">
          <div class="rounded-full overflow-hidden w-14 h-14 bg-gray-300">
            <img class="object-cover w-full h-full" 
                src="../img/defaultPhoto.png" 
                alt="Imagem do post"
                onerror="this.src='../img/defaultPhoto.png'">
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-bold cursor-pointer hover:underline" id="nomeUsuarioLink">${nomeUsuario}</span>
            <span class="text-xl"><strong>ID Postagem:</strong> ${post.id}</span>
          </div>
        </div>
        <div class="flex gap-3" id="botoesContainer">
          ${
            idLogado && post.usuarioId === idLogado
              ? `
                <button id="editarButton" class="bg-fundo1 border border-black py-2 px-4 rounded-xl hover:bg-destaque hover:text-white">Editar</button>
              `
              : `
                <button id="contatarButton" class="bg-fundo1 border border-black py-2 px-4 rounded-xl hover:bg-destaque hover:text-white">Contactar</button>
              `
          }
        </div>
      </div>

      <hr class="text-minitexto mt-6 mb-10">

      <div>
        <ul class="text-xl mb-8">
          <li class="flex items-center gap-2 mb-4"><p class="font-bold">Tipo:</p> <p>${formatarTipo(post.tipo)}</p></li>
          <li class="flex items-center gap-2 mb-4"><p class="font-bold">Categoria:</p> <p>${post.categoria ? post.categoria.charAt(0).toUpperCase() + post.categoria.slice(1).toLowerCase() : 'Não informada'}</p></li>
          <li class="flex items-center gap-2 mb-4"><p class="font-bold">Localização:</p> <p>${post.localizacao || 'Não informada'}</p></li>
        </ul>

        <label class="text-xl font-bold">Descrição</label>
        <p class="border border-black w-full rounded-xl py-2 px-4 mt-2">
          ${post.descricao || 'Sem descrição disponível.'}
        </p>
      </div>

      ${imagemPostHtml}

      <div class="mt-8 flex justify-start">
        <button onclick="history.back()" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Voltar
        </button>
      </div>
    `;

    // Botão de denúncia
    const denunciarButton = document.getElementById("denunciarPost");
    if (denunciarButton) {
      denunciarButton.addEventListener("click", (e) => {
        e.preventDefault();
        // Salva o ID e o tipo no localStorage
        localStorage.setItem("denunciaTipo", "postagem");
        localStorage.setItem("denunciaId", post.id);

        // Redireciona para a página de denúncias
        window.location.href = "denuncias.html";
      });
    }

    const nomeUsuarioLink = document.getElementById('nomeUsuarioLink');
    if (nomeUsuarioLink && post.usuarioId) {
      nomeUsuarioLink.addEventListener('click', () => {
        window.location.href = `perfil.html?id=${post.usuarioId}`;
      });
    }

    // Botão rolar imagens
    const botaoRolar = document.getElementById('botaoRolarImagens');
    if (botaoRolar) {
      botaoRolar.addEventListener('click', () => {
        const container = postDetails.querySelector('.imagem-scroll-container');
        if (container) {
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      });
    }

    document.getElementById('editarButton')?.addEventListener('click', () => {
      window.location.href = `editPost.html?id=${post.id}`;
    });

    // ====== CONFIGURAÇÃO DO BOTÃO CONTACTAR CORRIGIDA ======
    document.getElementById('contatarButton')?.addEventListener('click', async () => {
      if (!post.usuarioId) {
        alert('Não foi possível encontrar o email do usuário.');
        return;
      }

      try {
        console.log('Buscando dados do usuário ID:', post.usuarioId);
        
        // Busca os dados completos do usuário (mesma lógica do perfil.js)
        const usuarioDados = await buscarDadosUsuario(post.usuarioId);
        
        if (!usuarioDados) {
          alert('Não foi possível encontrar o usuário para contato.');
          return;
        }

        // Pega o email do usuário (mesma lógica do perfil.js)
        const emailDoUsuario = usuarioDados.email;
        
        if (!emailDoUsuario) {
          alert('Este usuário não possui email cadastrado para contato.');
          return;
        }

        console.log('Email encontrado:', emailDoUsuario);

        // Cria o assunto e corpo do email (mesmo formato do perfil.js)
        const assunto = `Interesse na postagem: ${post.titulo || 'Sem título'}`;
        const corpo = `Olá ${usuarioDados.nome || 'usuário'}!\n\nTenho interesse na sua postagem "${post.titulo || 'Sem título'}" no SAC.\n\nPostagem ID: ${post.id}\n\nAtenciosamente,\n${userLogado?.nome || 'Usuário SAC'}`;

        // Cria o link do Gmail (mesma lógica do perfil.js)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailDoUsuario)}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
        
        console.log('Abrindo Gmail:', gmailUrl);
        
        // Abre nova aba com o Gmail (mesmo comportamento do perfil.js)
        window.open(gmailUrl, '_blank');
        
      } catch (error) {
        console.error('Erro ao contactar:', error);
        alert('Erro ao tentar contactar o usuário. Tente novamente mais tarde.');
      }
    });

  } catch (error) {
    postDetails.innerHTML = `<p class="text-center text-red-500">
      Ocorreu um erro ao carregar a postagem.<br>
      <small>${error.message}</small>
    </p>`;
    console.error('Erro detalhado:', error);
  }
});