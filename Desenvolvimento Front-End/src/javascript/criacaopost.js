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
      mostrarModal(`${titulo}: ${texto}`);
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
  // AUTOCOMPLETE DE CEP
  // =========================
  function initCEPAutocomplete() {
    const cepInput = document.getElementById('cep');
    
    if (!cepInput) return;

    // Formatar CEP enquanto digita
    cepInput.addEventListener('input', function() {
      this.value = formatarCEP(this.value);
    });

    // Buscar CEP quando perder foco
    cepInput.addEventListener('blur', buscarCEP);

    // Buscar CEP com Enter
    cepInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        buscarCEP();
      }
    });
  }

  function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
      cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    }
    if (cep.length > 9) {
      cep = cep.substring(0, 9);
    }
    return cep;
  }

  async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');

    // Validação básica
    if (cep.length !== 8) {
      mostrarMensagemCEP('CEP deve ter 8 dígitos', 'erro');
      return;
    }

    try {
      mostrarLoadingCEP(true);
      
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      preencherCamposCEP(data);
      mostrarMensagemCEP('Endereço preenchido automaticamente!', 'sucesso');
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      mostrarMensagemCEP('CEP não encontrado. Preencha manualmente.', 'erro');
    } finally {
      mostrarLoadingCEP(false);
    }
  }

  function preencherCamposCEP(data) {
    const campos = {
      'estado': data.uf,
      'bairro': data.bairro,
      'casa': data.logradouro
    };
    
    for (const [id, valor] of Object.entries(campos)) {
      const campo = document.getElementById(id);
      if (campo && valor) {
        campo.value = valor;
        campo.classList.add('auto-filled');
        
        // Remove a classe após 3 segundos
        setTimeout(() => {
          campo.classList.remove('auto-filled');
        }, 3000);
      }
    }
  }

  function mostrarLoadingCEP(mostrar) {
    const cepInput = document.getElementById('cep');
    
    if (mostrar) {
      cepInput.classList.add('loading');
    } else {
      cepInput.classList.remove('loading');
    }
  }

  function mostrarMensagemCEP(mensagem, tipo) {
    // Remove mensagem anterior
    const mensagemAnterior = document.querySelector('.cep-mensagem');
    if (mensagemAnterior) {
      mensagemAnterior.remove();
    }
    
    // Cria nova mensagem
    const divMensagem = document.createElement('div');
    divMensagem.className = `cep-mensagem text-sm mt-1 p-2 rounded ${
      tipo === 'erro' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
    }`;
    divMensagem.textContent = mensagem;
    
    // Adiciona após o campo CEP
    const cepContainer = document.getElementById('cep').parentNode;
    cepContainer.appendChild(divMensagem);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
      if (divMensagem.parentNode) {
        divMensagem.remove();
      }
    }, 5000);
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

      console.log('=== DEBUG INICIO ===');
      
      const usuarioDataRaw = localStorage.getItem('usuarioLogado');
      console.log('usuarioDataRaw:', usuarioDataRaw);
      
      let usuarioData;
      try {
        usuarioData = JSON.parse(usuarioDataRaw);
        console.log('usuarioData:', usuarioData);
      } catch (error) {
        console.error('Erro ao parsear usuarioData:', error);
        mostrarMensagem('Erro', `Erro ao analisar os dados do usuário: ${error.message}`, 'erro');
        window.location.href = 'login.html';
        return;
      }

      const token = localStorage.getItem('authToken');
      console.log('Token:', token);
      
      if (!usuarioData || !usuarioData.id) {
        console.error('Usuário não identificado');
        mostrarMensagem('Erro', 'Usuário não identificado. Faça login ou cadastre-se.', 'erro');
        window.location.href = 'login.html';
        return;
      }

      if (!token) {
        console.error('Token não encontrado');
        mostrarMensagem('Erro', 'Usuário não autenticado. Faça login novamente.', 'erro');
        window.location.href = 'login.html';
        return;
      }

      console.log('=== DEBUG FIM ===');

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
          usuario: { 
            id: usuarioData.id,
            nome: usuarioData.nome || 'Usuário',
            email: usuarioData.email || ''
          },
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

        console.log('Enviando post:', post);
        console.log('Token enviado:', token);

        try {
          const response = await fetch('http://localhost:8080/ocorrencias/criar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(post),
          });

          console.log('Status da resposta:', response.status);
          console.log('Resposta OK?', response.ok);

          if (response.ok) {
            const responseData = await response.json();
            console.log('Resposta do servidor:', responseData);
            mostrarMensagem('Sucesso', 'Postagem criada com sucesso!', 'sucesso');
            form.reset();
            arquivosSelecionados = [];
            previewContainer.innerHTML = '';
            setTimeout(() => {
              window.location.href = 'postagens.html';
            }, 1500);
          } else {
            let errorText = await response.text();
            console.error('Erro do servidor:', errorText);
            
            // Tenta parsear como JSON, se não conseguir, usa o texto
            let error;
            try {
              error = JSON.parse(errorText);
            } catch {
              error = { message: errorText };
            }
            
            mostrarMensagem('Erro', `Erro ao criar postagem: ${error.message || 'Erro desconhecido'}`, 'erro');
            
            // Se for erro de autenticação, redireciona para login
            if (response.status === 403 || response.status === 401) {
              console.error('Erro de autenticação - limpando dados e redirecionando para login');
              localStorage.removeItem('authToken');
              localStorage.removeItem('usuarioLogado');
              setTimeout(() => {
                window.location.href = 'login.html';
              }, 2000);
            }
          }
        } catch (error) {
          console.error('Erro de rede:', error);
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

  // =========================
  // Botão Voltar
  // =========================
  // =========================
// BOTÃO VOLTAR - VERSÃO CORRIGIDA
// =========================
function inicializarBotaoVoltar() {
    const voltarBtn = document.getElementById('voltarBtn');
    console.log('🔄 Inicializando botão voltar...', voltarBtn);
    
    if (voltarBtn) {
        // Remover event listeners antigos para evitar duplicação
        const novoVoltarBtn = voltarBtn.cloneNode(true);
        voltarBtn.parentNode.replaceChild(novoVoltarBtn, voltarBtn);
        
        // Referência ao novo botão
        const botaoVoltar = document.getElementById('voltarBtn');
        
        // Event listener principal
        botaoVoltar.addEventListener('click', function(e) {
            console.log('🎯 Clique no botão voltar capturado!');
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'postagens.html';
        });
        
        // Animação (opcional)
        botaoVoltar.addEventListener("mousedown", () => {
            botaoVoltar.style.transform = 'scale(0.95)';
        });
        
        botaoVoltar.addEventListener("mouseup", () => {
            botaoVoltar.style.transform = 'scale(1)';
        });
        
        botaoVoltar.addEventListener("mouseleave", () => {
            botaoVoltar.style.transform = 'scale(1)';
        });
        
        console.log('✅ Botão voltar inicializado com sucesso!');
    } else {
        console.log('❌ Botão voltar não encontrado na inicialização');
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    inicializarBotaoVoltar();
});

// Também inicializar após um pequeno delay (para garantir)
setTimeout(inicializarBotaoVoltar, 100);

  // =========================
  // INICIALIZAR AUTOCOMPLETE DE CEP
  // =========================
  initCEPAutocomplete();

  // =========================
// DEBUG - Verificar se botão existe
// =========================
console.log('=== DEBUG BOTÃO VOLTAR ===');
console.log('Botão voltar encontrado:', voltarBtn);
console.log('Classes do botão voltar:', voltarBtn?.className);
console.log('Estilo display:', voltarBtn?.style.display);
console.log('Estilo visibility:', voltarBtn?.style.visibility);
console.log('Estilo opacity:', voltarBtn?.style.opacity);

if (voltarBtn) {
    // Forçar visibilidade
    voltarBtn.style.display = 'block';
    voltarBtn.style.visibility = 'visible';
    voltarBtn.style.opacity = '1';
    voltarBtn.style.position = 'static';
}
});
