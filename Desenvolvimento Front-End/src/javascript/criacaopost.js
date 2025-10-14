document.addEventListener('DOMContentLoaded', function() {

  // =========================
  // Modal de mensagem
  // =========================
  const modalElements = {
    modal: document.getElementById('modalMensagem'),
    content: document.getElementById('modalContent'),
    title: document.getElementById('modalTitle'),
    icon: document.getElementById('modalIcon'),
    closeBtn: document.getElementById('modalCloseBtn')
  };

  function mostrarMensagem(titulo, texto, tipo = 'erro') {
    if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
      console.error('Elementos do modal não encontrados!');
      alert(`${titulo}: ${texto}`);
      return;
    }

    modalElements.icon.className = tipo === 'erro' 
      ? 'fas fa-exclamation-circle text-red-500 text-2xl mr-3 mt-1'
      : 'fas fa-check-circle text-green-500 text-2xl mr-3 mt-1';

    modalElements.title.textContent = titulo;
    modalElements.content.textContent = texto;
    modalElements.modal.classList.remove('hidden');

    setTimeout(() => modalElements.modal.classList.add('hidden'), 5000);
  }

  if (modalElements.closeBtn && modalElements.modal) {
    modalElements.closeBtn.addEventListener('click', () => {
      modalElements.modal.classList.add('hidden');
    });
  }

  // =========================
  // Pré-visualização das imagens (imagem3)
  // =========================
  const imagemInput = document.getElementById('imagem3');
  const previewContainer = document.getElementById('previewContainer');
  const botaoSelecionarImagem = document.getElementById('botaoSelecionarImagem');

  let arquivosSelecionados = []; // Array de File objects

  if (botaoSelecionarImagem && imagemInput) {
    botaoSelecionarImagem.addEventListener('click', (e) => {
      e.preventDefault();
      imagemInput.click();
    });

    imagemInput.addEventListener('change', (event) => {
      const novosArquivos = Array.from(event.target.files || []);
      if (novosArquivos.length > 0) {
        arquivosSelecionados.push(...novosArquivos);
        atualizarPreview();
      }
      imagemInput.value = '';
    });
  }

  // Atualiza a área de preview com Tailwind
  function atualizarPreview() {
    if (!previewContainer) return;
    previewContainer.innerHTML = '';

    previewContainer.className = 'flex flex-wrap gap-6 justify-start items-start';

    arquivosSelecionados.forEach((arquivo, index) => {
      const reader = new FileReader();
      reader.onload = e => {
        const divImagem = document.createElement('div');
        divImagem.className = 'relative bg-fundo2 overflow-hidden rounded-xl flex-shrink-0 w-50 h-50';

        divImagem.innerHTML = `
          <img src="${e.target.result}" class="w-full h-full object-cover rounded-xl" alt="Pré-visualização">
          <div class="absolute top-2 right-2 flex gap-1">
            <button type="button" data-index="${index}" class="botao-excluir bg-black/70 hover:bg-black text-white rounded-md text-xs px-2 py-[2px]">✕</button>
            <button type="button" data-index="${index}" class="botao-trocar bg-black/70 hover:bg-black text-white rounded-md text-xs px-2 py-[2px]">↻</button>
          </div>
        `;

        previewContainer.appendChild(divImagem);
      };
      reader.readAsDataURL(arquivo);
    });
  }

  // Event delegation para botões
  if (previewContainer) {
    previewContainer.addEventListener('click', (e) => {
      const excluirBtn = e.target.closest('.botao-excluir');
      const trocarBtn = e.target.closest('.botao-trocar');

      if (excluirBtn && previewContainer.contains(excluirBtn)) {
        const idx = parseInt(excluirBtn.dataset.index, 10);
        if (!Number.isNaN(idx)) {
          arquivosSelecionados.splice(idx, 1);
          atualizarPreview();
        }
        return;
      }

      if (trocarBtn && previewContainer.contains(trocarBtn)) {
        const idx = parseInt(trocarBtn.dataset.index, 10);
        if (!Number.isNaN(idx)) {
          trocarImagem(idx);
        }
        return;
      }
    });
  }

  // Função trocar imagem
  function trocarImagem(index) {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/*';
    tempInput.onchange = (event) => {
      const arquivo = event.target.files && event.target.files[0];
      if (arquivo) {
        arquivosSelecionados[index] = arquivo;
        atualizarPreview();
      }
      tempInput.remove();
    };
    tempInput.click();
  }

  // =========================
  // Formulário de post
  // =========================
  const form = document.getElementById('postForm');

  if (form) {
    const toggleLocalizacaoBtn = document.getElementById('toggleLocalizacaoBtn');
    const localizacaoContainer = document.getElementById('localizacaoContainer');

    if (toggleLocalizacaoBtn && localizacaoContainer) {
      toggleLocalizacaoBtn.addEventListener('click', function () {
        if (localizacaoContainer.classList.contains('hidden')) {
          localizacaoContainer.classList.remove('hidden');
          toggleLocalizacaoBtn.textContent = 'Fechar Localização';
        } else {
          localizacaoContainer.classList.add('hidden');
          toggleLocalizacaoBtn.textContent = 'Inserir Localização';
        }
      });
    }

    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      const usuarioDataRaw = localStorage.getItem('usuarioLogado');
      let usuarioData;
      try {
        usuarioData = JSON.parse(usuarioDataRaw);
      } catch (error) {
        mostrarMensagem('Erro', `Erro ao analisar os dados do usuário: ${error.message}`, 'erro');
        window.location.href = 'login.html';
        return;
      }

      if (!usuarioData || !usuarioData.id) {
        mostrarMensagem('Erro', 'Usuário não identificado. Faça login ou cadastre-se.', 'erro');
        window.location.href = 'login.html';
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        mostrarMensagem('Erro', 'Usuário não autenticado. Faça login novamente.', 'erro');
        window.location.href = 'login.html';
        return;
      }

      const titulo = document.getElementById('titulo')?.value.trim() || '';
      const categoria = document.getElementById('categoria')?.value.trim() || '';
      const tipo = document.getElementById('tipo')?.value.trim() || '';
      const estado = document.getElementById('estado')?.value.trim() || '';
      const lugar = document.getElementById('casa')?.value.trim() || '';
      const descricao = document.getElementById('descricao')?.value.trim() || '';
      const estado_doacao = "DISPONIVEL";

      if (!titulo || !categoria || !tipo || !estado || !lugar || !descricao) {
        mostrarMensagem('Erro', 'Preencha todos os campos!', 'erro');
        return;
      }

      async function converterImagensParaBase64(arquivos) {
        return Promise.all(
          arquivos.map(arquivo => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(arquivo);
          }))
        );
      }

      async function saveAndSendPost(imagensBase64 = []) {
        // Salva TODAS as imagens como JSON string no campo "imagem"
        const post = {
          usuario: { id: usuarioData.id },
          titulo,
          descricao,
          tipo,
          categoria,
          localizacao: `${estado}, ${lugar}`,
          estado_doacao,
          imagem: JSON.stringify(imagensBase64),
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
        };

        try {
          const response = await fetch('http://localhost:8080/ocorrencias/criar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(post),
          });

          if (response.ok) {
            mostrarMensagem('Sucesso', 'Postagem criada com sucesso!', 'sucesso');
            form.reset();
            arquivosSelecionados = [];
            previewContainer.innerHTML = '';
            window.location.href = 'postagens.html';
          } else {
            let error = { message: 'Erro desconhecido do servidor' };
            try { error = await response.json(); } catch {}
            mostrarMensagem('Erro', `Erro ao criar postagem: ${error.message}`, 'erro');
          }
        } catch (error) {
          mostrarMensagem('Erro', 'Erro ao criar postagem. Tente novamente mais tarde.', 'erro');
        }
      }

      const imagensBase64 = arquivosSelecionados.length > 0 
        ? await converterImagensParaBase64(arquivosSelecionados)
        : [];
      saveAndSendPost(imagensBase64);
    });
  }

  // =========================
  // Botão criar - animação
  // =========================
  const criarBtn = document.querySelector('#criarBtn');
  if (criarBtn) {
    criarBtn.addEventListener("mousedown", () => {
      criarBtn.classList.remove('text-[18px]');
      criarBtn.classList.add('text-[16px]');
    });
    criarBtn.addEventListener("mouseup", () => {
      criarBtn.classList.remove('text-[16px]');
      criarBtn.classList.add('text-[18px]');
    });
  }

});

async function buscarCEP() {
      const cep = document.getElementById("cep").value.replace(/\D/g, "");

      const url = `https://viacep.com.br/ws/${cep}/json/`;

      try {
        const response = await fetch(url);
        const dados = await response.json();

        if ("erro" in dados) {
          alert("CEP não encontrado!");
          return;
        }

        // Preenche os campos
        document.getElementById("casa").value = dados.logradouro;
        document.getElementById("bairro").value = dados.bairro;
        document.getElementById("estado").value = dados.uf;

      } catch (error) {
       
      }
    }
