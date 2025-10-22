// config-1.js

// VERIFICAÇÃO DE LOGIN - BLOQUEIO TOTAL DE ACESSO
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
if (!usuarioLogado) {
    alert('Você precisa fazer login para acessar esta página');
    window.location.href = 'login.html';
}

// Elementos do modal
const modalElements = {
    modal: null,
    content: null,
    title: null,
    icon: null,
    closeBtn: null,
    confirmBtn: null,
    cancelBtn: null
};

// Variável para armazenar a callback de confirmação
let confirmCallback = null;

// FUNÇÃO PARA VERIFICAR LOGIN EM TEMPO REAL - ADICIONADA
// FUNÇÃO MELHORADA PARA VERIFICAR LOGIN EM TEMPO REAL
function verificarLoginTempoReal() {
    const token = localStorage.getItem('authToken');
    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    
    if (!token || !usuarioAtual) {
        alert('Você precisa fazer login para interagir');
        // Limpa qualquer dado residual
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuarioLogado');
        sessionStorage.clear();
        
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// OBSERVADOR PARA DETECTAR MUDANÇAS NO LOCALSTORAGE (DESLOGAR)
function configurarObservadorLogout() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'usuarioLogado' && !e.newValue) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        }
    });
    
    // Também verifica periodicamente (a cada 2 segundos)
    setInterval(() => {
        const token = localStorage.getItem('authToken');
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
        if (!token || !usuario) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        }
    }, 2000);
}

// Função para obter o ID do usuário logado
function obterIdUsuario() {
    // Verificar se existe um usuário logado no localStorage/sessionStorage
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    
    if (usuarioLogado) {
        try {
            const usuario = JSON.parse(usuarioLogado);
            return usuario.id || usuario._id;
        } catch (error) {
            console.error('Erro ao parsear usuário logado:', error);
        }
    }
    
    // Tentar pegar de outras fontes comuns
    return localStorage.getItem('userId') || 
           sessionStorage.getItem('userId') || 
           localStorage.getItem('usuarioId') || 
           sessionStorage.getItem('usuarioId');
}

// Função para inicializar o modal
function inicializarModal() {
    // Criar elementos do modal - CORRIGIDO: Adicionei FLEX
    const modalHTML = `
    
    <div id="confirmModal" class="fixed inset-0 items-center justify-center z-50 hidden">
        <!-- Fundo escuro semi-transparente -->
        <div class="absolute inset-0 bg-black opacity-50"></div>

        <!-- Conteúdo do modal -->
        <div class="relative bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
            <div class="flex items-start">
            <span id="modalIcon" class="fas fa-exclamation-circle text-yellow-500 text-2xl mr-3 mt-1"></span>
            <div class="flex-1">
                <h3 id="modalTitle" class="text-lg font-bold mb-2"></h3>
                <p id="modalContent" class="text-gray-600 mb-4 whitespace-pre-line"></p>
            </div>
            </div>
            <div class="flex justify-end gap-3">
            <button id="modalCancel" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-250">
                Cancelar
            </button>
            <button id="modalConfirm" class="px-4 py-2 bg-destaque text-white rounded-md hover:bg-opacity-90 transition duration-250">
                Confirmar
            </button>
            </div>
        </div>
        </div>
    `;
    
    // Adicionar modal ao DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar elementos do modal
    modalElements.modal = document.getElementById('confirmModal');
    modalElements.title = document.getElementById('modalTitle');
    modalElements.content = document.getElementById('modalContent');
    modalElements.icon = document.getElementById('modalIcon');
    modalElements.closeBtn = document.getElementById('modalCancel');
    modalElements.confirmBtn = document.getElementById('modalConfirm');
    modalElements.cancelBtn = document.getElementById('modalCancel');
    
    // Event listeners do modal
    modalElements.confirmBtn.addEventListener('click', function() {
        if (confirmCallback) {
            confirmCallback(true);
        }
        modalElements.modal.classList.add('hidden');
        modalElements.modal.classList.remove('flex');
    });
    
    modalElements.cancelBtn.addEventListener('click', function() {
        if (confirmCallback) {
            confirmCallback(false);
        }
        modalElements.modal.classList.add('hidden');
        modalElements.modal.classList.remove('flex');
    });
    
    // Fechar modal ao clicar fora
    modalElements.modal.addEventListener('click', function(e) {
        if (e.target === modalElements.modal) {
            if (confirmCallback) {
                confirmCallback(false);
            }
            modalElements.modal.classList.add('hidden');
            modalElements.modal.classList.remove('flex');
        }
    });
}

// Função para mostrar modal de confirmação
function mostrarConfirmacao(titulo, texto, tipo = 'warning') {
    if (!verificarLoginTempoReal()) return Promise.resolve(false);
    
    return new Promise((resolve) => {
        // Configurar ícone baseado no tipo
        let iconClass = 'fas fa-exclamation-circle text-yellow-500 text-2xl mr-3 mt-1';
        if (tipo === 'error') {
            iconClass = 'fas fa-exclamation-circle text-red-500 text-2xl mr-3 mt-1';
        } else if (tipo === 'success') {
            iconClass = 'fas fa-check-circle text-green-500 text-2xl mr-3 mt-1';
        } else if (tipo === 'info') {
            iconClass = 'fas fa-info-circle text-blue-500 text-2xl mr-3 mt-1';
        }
        
        modalElements.icon.className = iconClass;
        modalElements.title.textContent = titulo;
        modalElements.content.textContent = texto;
        
        // Mostrar botões de confirmação/cancelamento
        modalElements.confirmBtn.classList.remove('hidden');
        modalElements.cancelBtn.classList.remove('hidden');
        
        // Armazenar callback
        confirmCallback = (confirmed) => {
            resolve(confirmed);
        };
        
        // Mostrar modal centralizado
        modalElements.modal.classList.remove('hidden');
        modalElements.modal.classList.add('flex');
    });
}

// Função para mostrar mensagem simples (sem confirmação)
function mostrarMensagem(titulo, texto, tipo = 'error') {
    if (!verificarLoginTempoReal()) return;
    
    if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
        console.error('Elementos do modal não encontrados!');
        alert(`${titulo}: ${texto}`);
        return;
    }

    let iconClass = 'fas fa-exclamation-circle text-red-500 text-2xl mr-3 mt-1';
    if (tipo === 'success') {
        iconClass = 'fas fa-check-circle text-green-500 text-2xl mr-3 mt-1';
    } else if (tipo === 'warning') {
        iconClass = 'fas fa-exclamation-triangle text-yellow-500 text-2xl mr-3 mt-1';
    } else if (tipo === 'info') {
        iconClass = 'fas fa-info-circle text-blue-500 text-2xl mr-3 mt-1';
    }

    modalElements.icon.className = iconClass;
    modalElements.title.textContent = titulo;
    modalElements.content.textContent = texto;
    
    // Esconder botões de confirmação/cancelamento
    modalElements.confirmBtn.classList.add('hidden');
    modalElements.cancelBtn.classList.add('hidden');
    
    // Mostrar apenas um botão de OK
    const okButton = modalElements.cancelBtn.cloneNode(true);
    okButton.textContent = 'OK';
    okButton.classList.remove('hidden');
    okButton.id = 'modalOk';
    
    // Substituir os botões
    const buttonContainer = modalElements.confirmBtn.parentElement;
    buttonContainer.innerHTML = '';
    buttonContainer.appendChild(okButton);
    
    // Garantir que o modal esteja centralizado e visível
    modalElements.modal.classList.remove('hidden');
    modalElements.modal.classList.add('flex');
    
    // Event listener para o botão OK
    okButton.addEventListener('click', () => {
        modalElements.modal.classList.add('hidden');
        modalElements.modal.classList.remove('flex');
        // Restaurar botões originais
        setTimeout(() => {
            buttonContainer.innerHTML = `
                <button id="modalCancel" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-250">
                    Cancelar
                </button>
                <button id="modalConfirm" class="px-4 py-2 bg-destaque text-white rounded-md hover:bg-opacity-90 transition duration-250">
                    Confirmar
                </button>
            `;
            // Reconfigurar event listeners
            modalElements.closeBtn = document.getElementById('modalCancel');
            modalElements.confirmBtn = document.getElementById('modalConfirm');
            modalElements.cancelBtn = document.getElementById('modalCancel');
            
            modalElements.confirmBtn.addEventListener('click', function() {
                if (confirmCallback) {
                    confirmCallback(true);
                }
                modalElements.modal.classList.add('hidden');
                modalElements.modal.classList.remove('flex');
            });
            
            modalElements.cancelBtn.addEventListener('click', function() {
                if (confirmCallback) {
                    confirmCallback(false);
                }
                modalElements.modal.classList.add('hidden');
                modalElements.modal.classList.remove('flex');
            });
        }, 100);
    });

    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (modalElements.modal && modalElements.modal.classList.contains('flex')) {
            modalElements.modal.classList.add('hidden');
            modalElements.modal.classList.remove('flex');
        }
    }, 5000);
}

// Função para mostrar modal de senha com validação REAL
function mostrarModalSenha(titulo, texto) {
    if (!verificarLoginTempoReal()) return Promise.resolve(null);
    
    return new Promise((resolve) => {
        // Criar modal específico para senha
        const senhaModalHTML = `
            <div id="senhaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
                    <div class="flex items-start mb-4">
                        <span class="fas fa-lock text-blue-500 text-2xl mr-3 mt-1"></span>
                        <div class="flex-1">
                            <h3 class="text-lg font-bold mb-2">${titulo}</h3>
                            <p class="text-gray-600 mb-2">${texto}</p>
                            <p id="senhaError" class="text-red-500 text-sm hidden mt-2"></p>
                        </div>
                    </div>
                    <input type="password" id="senhaAtualInput" 
                           class="w-full border border-gray-300 rounded-md p-2 mb-4" 
                           placeholder="Digite sua senha atual">
                    <div class="flex justify-end gap-3">
                        <button id="senhaModalCancel" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-250">
                            Cancelar
                        </button>
                        <button id="senhaModalConfirm" class="px-4 py-2 bg-destaque text-white rounded-md hover:bg-opacity-90 transition duration-250">
                            Verificar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        document.body.insertAdjacentHTML('beforeend', senhaModalHTML);
        
        const senhaModal = document.getElementById('senhaModal');
        const senhaInput = document.getElementById('senhaAtualInput');
        const senhaError = document.getElementById('senhaError');
        const confirmBtn = document.getElementById('senhaModalConfirm');
        const cancelBtn = document.getElementById('senhaModalCancel');
        
        let tentativas = 0;
        const MAX_TENTATIVAS = 3;
        
        // Focar no input
        setTimeout(() => senhaInput.focus(), 100);
        
        // Event listeners
        confirmBtn.addEventListener('click', async function() {
            const senha = senhaInput.value.trim();
            if (!senha) {
                senhaError.textContent = 'Por favor, digite sua senha atual.';
                senhaError.classList.remove('hidden');
                return;
            }
            
            // Mostrar loading
            const textoOriginal = confirmBtn.textContent;
            confirmBtn.textContent = 'Verificando...';
            confirmBtn.disabled = true;
            
            try {
                // VALIDAÇÃO REAL DA SENHA ATUAL
                console.log('🔐 Validando senha atual no modal...');
                
                // Obter email do usuário logado
                const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
                if (!usuarioLogado) {
                    throw new Error('Usuário não encontrado');
                }
                
                const usuario = JSON.parse(usuarioLogado);
                const email = usuario.email;
                
                if (!email) {
                    throw new Error('Email do usuário não encontrado');
                }
                
                // Tentar fazer login com a senha atual para validar
                const response = await fetch('http://localhost:8080/usuarios/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                });
                
                if (response.ok) {
                    console.log('✅ Senha validada com sucesso no modal');
                    senhaModal.remove();
                    resolve(senha);
                } else {
                    tentativas++;
                    const tentativasRestantes = MAX_TENTATIVAS - tentativas;
                    senhaError.textContent = `Senha incorreta. Tentativas restantes: ${tentativasRestantes}`;
                    senhaError.classList.remove('hidden');
                    senhaInput.value = '';
                    senhaInput.focus();
                    
                    if (tentativas >= MAX_TENTATIVAS) {
                        mostrarMensagem('Tentativas Esgotadas', 'Você excedeu o número máximo de tentativas. Tente novamente mais tarde.', 'error');
                        senhaModal.remove();
                        resolve(null);
                    }
                }
                
            } catch (error) {
                console.error('🚨 Erro na validação da senha:', error);
                senhaError.textContent = 'Erro ao validar senha. Tente novamente.';
                senhaError.classList.remove('hidden');
            } finally {
                // Restaurar botão
                confirmBtn.textContent = textoOriginal;
                confirmBtn.disabled = false;
            }
        });
        
        cancelBtn.addEventListener('click', function() {
            senhaModal.remove();
            resolve(null);
        });
        
        // Enter para confirmar
        senhaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });
        
        // Limpar erro ao digitar
        senhaInput.addEventListener('input', function() {
            senhaError.classList.add('hidden');
        });
        
        // Fechar ao clicar fora
        senhaModal.addEventListener('click', function(e) {
            if (e.target === senhaModal) {
                senhaModal.remove();
                resolve(null);
            }
        });
    });
}

// [TODO O RESTO DO CÓDIGO ORIGINAL PERMANECE EXATAMENTE IGUAL...]
// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    
    return digito2 === parseInt(cpf.charAt(10));
}

// [CONTINUAÇÃO DO CÓDIGO ORIGINAL...]
// Função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado === parseInt(digitos.charAt(1));
}

// [TODO O RESTO DO CÓDIGO ORIGINAL CONTINUA AQUI SEM ALTERAÇÕES...]
// Função para atualizar dados no backend
async function atualizarUsuario(dadosAtualizacao) {
    const userId = obterIdUsuario();
    
    if (!userId) {
        mostrarMensagem('Erro de Autenticação', 'Usuário não identificado. Faça login novamente.', 'error');
        return { success: false, error: 'Usuário não autenticado' };
    }
    
    console.log('📤 ENVIANDO PARA API:');
    console.log('URL:', `http://localhost:8080/usuarios/atualizar/${userId}`);
    console.log('Dados:', { ...dadosAtualizacao, senha: '***', password: '***', senhaAtual: '***', currentPassword: '***' });
    
    try {
        const response = await fetch(`http://localhost:8080/usuarios/atualizar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizacao)
        });
        
        console.log('📥 RESPOSTA DA API:');
        console.log('Status:', response.status);
        console.log('OK:', response.ok);
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ SUCESSO:', resultado);
            return { success: true, data: resultado };
        } else {
            const erro = await response.text();
            console.log('❌ ERRO DA API:', erro);
            return { success: false, error: erro };
        }
    } catch (error) {
        console.log('🚨 ERRO DE REDE:', error);
        return { success: false, error: error.message };
    }
}

// [CONTINUAÇÃO DO CÓDIGO ORIGINAL...]
// Função para aplicar máscara de CPF/CNPJ
function aplicarMascaraDocumento(valor, tipo) {
    valor = valor.replace(/\D/g, '');
    
    if (tipo === 'CPF') {
        if (valor.length <= 11) {
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
    } else if (tipo === 'CNPJ') {
        if (valor.length <= 14) {
            valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
            valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        }
    }
    
    return valor;
}

// ===== SISTEMA DE VALIDAÇÃO DE SENHA PARA ALTERAÇÕES =====

// Função para validar senha atual
async function validarSenhaAtual(senhaDigitada) {
    try {
        // Obter usuário logado
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        if (!usuarioLogado) {
            return { success: false, error: 'Usuário não autenticado' };
        }

        const usuario = JSON.parse(usuarioLogado);
        const email = usuario.email;

        if (!email) {
            return { success: false, error: 'Email do usuário não encontrado' };
        }

        console.log('🔐 Validando senha atual para:', email);

        // Fazer login com a senha digitada para validar
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                senha_hash: senhaDigitada
            })
        });

        if (response.ok) {
            console.log('✅ Senha atual validada com sucesso');
            return { success: true };
        } else {
            console.log('❌ Senha atual incorreta');
            return { 
                success: false, 
                error: 'Senha atual incorreta' 
            };
        }

    } catch (error) {
        console.error('🚨 Erro na validação:', error);
        return { 
            success: false, 
            error: 'Erro ao validar senha. Tente novamente.' 
        };
    }
}

// [TODO O RESTO DO CÓDIGO ORIGINAL CONTINUA...]
// Modal para solicitar senha atual
function mostrarModalSenha(titulo, texto) {
    if (!verificarLoginTempoReal()) return Promise.resolve(null);
    
    return new Promise((resolve) => {
        const modalHTML = `
            <div id="senhaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
                    <div class="flex items-start mb-4">
                        <span class="fas fa-lock text-blue-500 text-2xl mr-3 mt-1"></span>
                        <div class="flex-1">
                            <h3 class="text-lg font-bold mb-2">${titulo}</h3>
                            <p class="text-gray-600 mb-2">${texto}</p>
                            <p id="senhaError" class="text-red-500 text-sm hidden mt-2"></p>
                        </div>
                    </div>
                    <input type="password" id="senhaAtualInput" 
                           class="w-full border border-gray-300 rounded-md p-2 mb-4" 
                           placeholder="Digite sua senha atual">
                    <div class="flex justify-end gap-3">
                        <button id="senhaModalCancel" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-250">
                            Cancelar
                        </button>
                        <button id="senhaModalConfirm" class="px-4 py-2 bg-destaque text-white rounded-md hover:bg-opacity-90 transition duration-250">
                            Verificar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const senhaModal = document.getElementById('senhaModal');
        const senhaInput = document.getElementById('senhaAtualInput');
        const senhaError = document.getElementById('senhaError');
        const confirmBtn = document.getElementById('senhaModalConfirm');
        const cancelBtn = document.getElementById('senhaModalCancel');
        
        let tentativas = 0;
        const MAX_TENTATIVAS = 3;
        
        setTimeout(() => senhaInput.focus(), 100);
        
        // Event listener para verificar senha
        confirmBtn.addEventListener('click', async function() {
            const senha = senhaInput.value.trim();
            
            if (!senha) {
                senhaError.textContent = 'Por favor, digite sua senha atual.';
                senhaError.classList.remove('hidden');
                return;
            }
            
            // Mostrar loading
            const textoOriginal = confirmBtn.textContent;
            confirmBtn.textContent = 'Verificando...';
            confirmBtn.disabled = true;
            
            try {
                const validacao = await validarSenhaAtual(senha);
                
                if (validacao.success) {
                    senhaModal.remove();
                    resolve(senha); // Retorna a senha validada
                } else {
                    tentativas++;
                    const tentativasRestantes = MAX_TENTATIVAS - tentativas;
                    senhaError.textContent = `Senha incorreta. Tentativas restantes: ${tentativasRestantes}`;
                    senhaError.classList.remove('hidden');
                    senhaInput.value = '';
                    senhaInput.focus();
                    
                    if (tentativas >= MAX_TENTATIVAS) {
                        mostrarMensagem('Tentativas Esgotadas', 'Você excedeu o número máximo de tentativas. Tente novamente mais tarde.', 'erro');
                        senhaModal.remove();
                        resolve(null);
                    }
                }
                
            } catch (error) {
                console.error('Erro no modal:', error);
                senhaError.textContent = 'Erro ao validar senha. Tente novamente.';
                senhaError.classList.remove('hidden');
            } finally {
                confirmBtn.textContent = textoOriginal;
                confirmBtn.disabled = false;
            }
        });
        
        // Cancelar
        cancelBtn.addEventListener('click', function() {
            senhaModal.remove();
            resolve(null);
        });
        
        // Enter para confirmar
        senhaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });
        
        // Limpar erro ao digitar
        senhaInput.addEventListener('input', function() {
            senhaError.classList.add('hidden');
        });
        
        // Fechar ao clicar fora
        senhaModal.addEventListener('click', function(e) {
            if (e.target === senhaModal) {
                senhaModal.remove();
                resolve(null);
            }
        });
    });
}

// [CONTINUAÇÃO DO CÓDIGO ORIGINAL...]
// Função para atualizar dados do usuário
async function atualizarUsuario(dadosAtualizacao) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        mostrarMensagem('Erro de Autenticação', 'Usuário não identificado. Faça login novamente.', 'erro');
        return { success: false, error: 'Usuário não autenticado' };
    }

    const usuario = JSON.parse(usuarioLogado);
    const userId = usuario.id;

    console.log('📤 ENVIANDO PARA API:');
    console.log('URL:', `http://localhost:8080/usuarios/atualizar/${userId}`);
    console.log('Dados:', { ...dadosAtualizacao, senha_hash: '***' });

    try {
        const response = await fetch(`http://localhost:8080/usuarios/atualizar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizacao)
        });

        console.log('📥 RESPOSTA DA API:');
        console.log('Status:', response.status);
        console.log('OK:', response.ok);

        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ SUCESSO:', resultado);
            
            // Atualizar dados no localStorage se necessário
            if (dadosAtualizacao.nome) {
                usuario.nome = dadosAtualizacao.nome;
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            }
            
            return { success: true, data: resultado };
        } else {
            const erro = await response.text();
            console.log('❌ ERRO DA API:', erro);
            return { success: false, error: erro };
        }
    } catch (error) {
        console.log('🚨 ERRO DE REDE:', error);
        return { success: false, error: error.message };
    }
}

// [TODO O RESTO DO CÓDIGO ORIGINAL PERMANECE EXATAMENTE IGUAL...]
// Funções específicas para cada tipo de alteração
async function alterarNomeComValidacao() {
    if (!verificarLoginTempoReal()) return;
    
    const nomeInput = document.getElementById('nome_conta');
    const novoNome = nomeInput?.value?.trim();
    
    if (!novoNome) {
        mostrarMensagem('Atenção', 'Por favor, insira um nome para alterar.', 'erro');
        return;
    }
    
    // 1. Pedir senha atual para confirmar identidade
    const senhaAtual = await mostrarModalSenha(
        'Confirmar Identidade',
        'Para alterar seu nome, digite sua senha atual:'
    );
    
    if (!senhaAtual) {
        mostrarMensagem('Alteração Cancelada', 'A alteração foi cancelada.', 'erro');
        return;
    }
    
    // Mostrar loading
    const botao = document.getElementById('altNome');
    const textoOriginal = botao.textContent;
    botao.textContent = 'Alterando...';
    botao.disabled = true;
    
    try {
        // 2. Se a senha estiver correta, proceder com a alteração
        const resultado = await atualizarUsuario({ nome: novoNome });
        
        if (resultado.success) {
            mostrarMensagem('Sucesso', 'Nome alterado com sucesso!', 'sucesso');
            nomeInput.value = '';
        } else {
            mostrarMensagem('Erro', `Não foi possível alterar o nome: ${resultado.error}`, 'erro');
        }
    } catch (error) {
        mostrarMensagem('Erro', 'Erro ao processar alteração.', 'erro');
    } finally {
        botao.textContent = textoOriginal;
        botao.disabled = false;
    }
}

// [CONTINUAÇÃO DO CÓDIGO ORIGINAL...]
async function alterarDocumentoComValidacao() {
    if (!verificarLoginTempoReal()) return;
    
    const documentoInput = document.getElementById('troca');
    const numeroDocumento = documentoInput?.value?.replace(/\D/g, '');
    const tipoDocumento = document.querySelector('input[name="novoTipoDocumento"]:checked')?.value;
    
    if (!numeroDocumento) {
        mostrarMensagem('Atenção', 'Por favor, insira um documento para alterar.', 'erro');
        return;
    }
    
    // 1. Pedir senha atual para confirmar identidade
    const senhaAtual = await mostrarModalSenha(
        'Confirmar Identidade',
        'Para alterar seu documento, digite sua senha atual:'
    );
    
    if (!senhaAtual) {
        mostrarMensagem('Alteração Cancelada', 'A alteração foi cancelada.', 'erro');
        return;
    }
    
    // Mostrar loading
    const botao = document.getElementById('altDocument');
    const textoOriginal = botao.textContent;
    botao.textContent = 'Alterando...';
    botao.disabled = true;
    
    try {
        // 2. Se a senha estiver correta, proceder com a alteração
        const resultado = await atualizarUsuario({ 
            numeroDocumento: numeroDocumento,
            tipoDocumento: tipoDocumento
        });
        
        if (resultado.success) {
            mostrarMensagem('Sucesso', 'Documento alterado com sucesso!', 'sucesso');
            documentoInput.value = '';
        } else {
            mostrarMensagem('Erro', `Não foi possível alterar o documento: ${resultado.error}`, 'erro');
        }
    } catch (error) {
        mostrarMensagem('Erro', 'Erro ao processar alteração.', 'erro');
    } finally {
        botao.textContent = textoOriginal;
        botao.disabled = false;
    }
}

// [TODO O RESTO DO CÓDIGO ORIGINAL CONTINUA...]
async function alterarSenhaComValidacao() {
    if (!verificarLoginTempoReal()) return;
    
    const senhaNovaInput = document.getElementById('senha_nova');
    const senhaNova = senhaNovaInput?.value?.trim();
    
    if (!senhaNova) {
        mostrarMensagem('Atenção', 'Por favor, insira uma nova senha.', 'erro');
        return;
    }
    
    if (senhaNova.length < 6) {
        mostrarMensagem('Senha Insuficiente', 'A nova senha deve ter pelo menos 6 caracteres.', 'erro');
        return;
    }
    
    // 1. Pedir senha atual para confirmar identidade
    const senhaAtual = await mostrarModalSenha(
        'Confirmar Alteração de Senha',
        'Para alterar sua senha, digite sua senha atual:'
    );
    
    if (!senhaAtual) {
        mostrarMensagem('Alteração Cancelada', 'A alteração foi cancelada.', 'erro');
        return;
    }
    
    // Verificar se nova senha é diferente da atual
    if (senhaAtual === senhaNova) {
        mostrarMensagem('Senha Inválida', 'A nova senha não pode ser igual à atual.', 'erro');
        return;
    }
    
    // Mostrar loading
    const botao = document.getElementById('altSenha');
    const textoOriginal = botao.textContent;
    botao.textContent = 'Alterando...';
    botao.disabled = true;
    
    try {
        // 2. Se a senha estiver correta, proceder com a alteração
        const resultado = await atualizarUsuario({ senha_hash: senhaNova });
        
        if (resultado.success) {
            mostrarMensagem('Sucesso', 'Senha alterada com sucesso!', 'sucesso');
            senhaNovaInput.value = '';
        } else {
            mostrarMensagem('Erro', `Não foi possível alterar a senha: ${resultado.error}`, 'erro');
        }
    } catch (error) {
        mostrarMensagem('Erro', 'Erro ao processar alteração.', 'erro');
    } finally {
        botao.textContent = textoOriginal;
        botao.disabled = false;
    }
}

// Event Listeners quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // VERIFICAÇÃO DE LOGIN NO CARREGAMENTO
    if (!usuarioLogado) {
        alert('Você precisa fazer login para acessar esta página');
        window.location.href = 'login.html';
        return;
    }

    // Inicializar modal
    inicializarModal();

        // ===== CONFIGURAÇÃO DOS BOTÕES DE ALTERAÇÃO =====
    
    // Botão Alterar Nome
    const altNomeBtn = document.getElementById('altNome');
    if (altNomeBtn) {
        altNomeBtn.addEventListener('click', alterarNomeComValidacao);
    }

    // Botão Alterar Documento
    const altDocumentBtn = document.getElementById('altDocument');
    if (altDocumentBtn) {
        altDocumentBtn.addEventListener('click', alterarDocumentoComValidacao);
    }

    // Botão Alterar Senha
    const altSenhaBtn = document.getElementById('altSenha');
    if (altSenhaBtn) {
        altSenhaBtn.addEventListener('click', alterarSenhaComValidacao);
    }

    
    // Verificar se usuário está logado
    const userId = obterIdUsuario();
    if (!userId) {
        mostrarMensagem('Acesso Negado', 'Você precisa estar logado para acessar esta página.', 'error');
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // [TODO O RESTO DO CÓDIGO ORIGINAL CONTINUA EXATAMENTE IGUAL...]
    // ===== ALTERAR NOME =====
    document.getElementById('altNome').addEventListener('click', async function(e) {
        e.preventDefault();
        
        const nomeInput = document.getElementById('nome_conta');
        const novoNome = nomeInput.value.trim();
        
        if (!novoNome) {
            mostrarMensagem('Atenção', 'Por favor, insira um nome para realizar a alteração.', 'warning');
            return;
        }
        
        // 1. Primeiro mostrar confirmação da alteração
        const confirmado = await mostrarConfirmacao(
            'Confirmar Alteração de Nome', 
            `Deseja realmente alterar seu nome para "${novoNome}"?`,
            'warning'
        );
        
        if (!confirmado) {
            mostrarMensagem('Alteração Cancelada', 'A alteração do nome foi cancelada. Seu nome permanece o mesmo.', 'info');
            return;
        }
        
        // 2. Depois pedir senha atual
        const senhaAtual = await mostrarModalSenha(
            'Confirmar Identidade',
            'Para confirmar a alteração, digite sua senha atual:'
        );
        
        if (!senhaAtual) {
            mostrarMensagem('Alteração Cancelada', 'A alteração do nome foi cancelada.', 'info');
            return;
        }
        
        // Mostrar loading no botão
        const botao = this;
        const textoOriginal = botao.textContent;
        botao.textContent = 'Alterando...';
        botao.disabled = true;
        
        // Enviar nome para atualização
        const resultado = await atualizarUsuario({ nome: novoNome });
        
        // Restaurar botão
        botao.textContent = textoOriginal;
        botao.disabled = false;
        
        if (resultado.success) {
            mostrarMensagem('Sucesso', 'Nome alterado com sucesso!', 'success');
            // Atualizar nome no perfil se necessário
            const elementosNome = document.querySelectorAll('#profileName');
            elementosNome.forEach(el => el.textContent = novoNome);
            // Limpar campo
            nomeInput.value = '';
        } else {
            // Se der erro relacionado a senha
            if (resultado.error && (resultado.error.includes('senha') || resultado.error.includes('Senha') || resultado.error.includes('autenticação'))) {
                mostrarMensagem('Senha Incorreta', 'A senha atual informada está incorreta. Verifique e tente novamente.', 'error');
            } else {
                mostrarMensagem('Erro', `Não foi possível alterar o nome: ${resultado.error}`, 'error');
            }
        }
    });
    
    // [TODO O RESTO COMPLETO DO CÓDIGO ORIGINAL CONTINUA AQUI...]
    // ===== ALTERAR DOCUMENTO =====
    document.getElementById('altDocument').addEventListener('click', async function(e) {
        e.preventDefault();
        
        const documentoInput = document.getElementById('troca');
        const numeroDocumento = documentoInput.value.replace(/\D/g, '');
        const tipoDocumento = document.querySelector('input[name="novoTipoDocumento"]:checked').value;
        
        if (!numeroDocumento) {
            mostrarMensagem('Atenção', 'Por favor, insira um documento para realizar a alteração.', 'warning');
            return;
        }
        
        // Validar documento
        let documentoValido = false;
        if (tipoDocumento === 'CPF') {
            documentoValido = validarCPF(numeroDocumento);
        } else {
            documentoValido = validarCNPJ(numeroDocumento);
        }
        
        if (!documentoValido) {
            mostrarMensagem('Documento Inválido', `${tipoDocumento} inválido. Por favor, verifique os dados informados.`, 'error');
            return;
        }
        
        // 1. Primeiro mostrar confirmação da alteração
        const confirmado = await mostrarConfirmacao(
            'Confirmar Alteração de Documento', 
            `Deseja realmente alterar para:\n${tipoDocumento}: ${aplicarMascaraDocumento(numeroDocumento, tipoDocumento)}?`,
            'warning'
        );
        
        if (!confirmado) {
            mostrarMensagem('Alteração Cancelada', 'A alteração do documento foi cancelada. Seu documento permanece o mesmo.', 'info');
            return;
        }
        
        // 2. Depois pedir senha atual
        const senhaAtual = await mostrarModalSenha(
            'Confirmar Identidade',
            'Para confirmar a alteração, digite sua senha atual:'
        );
        
        if (!senhaAtual) {
            mostrarMensagem('Alteração Cancelada', 'A alteração do documento foi cancelada.', 'info');
            return;
        }
        
        // Mostrar loading no botão
        const botao = this;
        const textoOriginal = botao.textContent;
        botao.textContent = 'Alterando...';
        botao.disabled = true;
        
        // Enviar documento para atualização
        const resultado = await atualizarUsuario({ 
            numeroDocumento: numeroDocumento 
        });
        
        // Restaurar botão
        botao.textContent = textoOriginal;
        botao.disabled = false;
        
        if (resultado.success) {
            mostrarMensagem('Sucesso', 'Documento alterado com sucesso!', 'success');
            // Limpar campo
            documentoInput.value = '';
        } else {
            // Se der erro relacionado a senha
            if (resultado.error && (resultado.error.includes('senha') || resultado.error.includes('Senha') || resultado.error.includes('autenticação'))) {
                mostrarMensagem('Senha Incorreta', 'A senha atual informada está incorreta. Verifique e tente novamente.', 'error');
            } else {
                mostrarMensagem('Erro', `Não foi possível alterar o documento: ${resultado.error}`, 'error');
            }
        }
    });
    
    // ===== ALTERAR SENHA =====
    document.getElementById('altSenha').addEventListener('click', async function(e) {
        e.preventDefault();
        
        const senhaNovaInput = document.getElementById('senha_nova');
        const senhaNova = senhaNovaInput.value.trim();
        
        if (!senhaNova) {
            mostrarMensagem('Atenção', 'Por favor, insira uma nova senha para realizar a alteração.', 'warning');
            return;
        }
        
        if (senhaNova.length < 6) {
            mostrarMensagem('Senha Insuficiente', 'A nova senha deve ter pelo menos 6 caracteres para garantir sua segurança.', 'warning');
            return;
        }
        
        // 1. Primeiro mostrar confirmação da alteração
        const confirmado = await mostrarConfirmacao(
            'Confirmar Alteração de Senha', 
            `Deseja realmente alterar sua senha?`,
            'warning'
        );
        
        if (!confirmado) {
            mostrarMensagem('Alteração Cancelada', 'A alteração da senha foi cancelada. Sua senha permanece a mesma.', 'info');
            return;
        }
        
        // 2. Depois pedir senha atual para confirmar identidade
        const senhaAtual = await mostrarModalSenha(
            'Confirmar Identidade',
            'Para confirmar a alteração da senha, digite sua senha atual:'
        );
        
        if (!senhaAtual) {
            mostrarMensagem('Alteração Cancelada', 'A alteração da senha foi cancelada.', 'info');
            return;
        }
        
        // Verificar se a nova senha é igual à atual
        if (senhaAtual === senhaNova) {
            mostrarMensagem('Senha Inválida', 'A nova senha não pode ser igual à senha atual. Por favor, escolha uma senha diferente.', 'warning');
            return;
        }
        
        // Mostrar loading no botão
        const botao = this;
        const textoOriginal = botao.textContent;
        botao.textContent = 'Alterando...';
        botao.disabled = true;
        
        try {
            console.log('🔐 Iniciando processo de alteração de senha...');
            
            // Tentar diferentes formatos que incluam a senha atual para validação
            const tentativasAlteracao = [
                { 
                    senha: senhaNova,
                    senhaAtual: senhaAtual
                },
                { 
                    password: senhaNova,
                    currentPassword: senhaAtual
                },
                { 
                    novaSenha: senhaNova,
                    senhaAtual: senhaAtual
                },
                { 
                    senha: senhaNova
                },
                { 
                    password: senhaNova
                }
            ];
            
            let resultado;
            let sucesso = false;
            
            for (let i = 0; i < tentativasAlteracao.length; i++) {
                console.log(`🔄 Tentativa ${i + 1} de alteração:`, Object.keys(tentativasAlteracao[i]));
                
                resultado = await atualizarUsuario(tentativasAlteracao[i]);
                
                if (resultado.success) {
                    sucesso = true;
                    console.log(`✅ Alteração bem-sucedida na tentativa ${i + 1}`);
                    break;
                } else {
                    console.log(`❌ Tentativa ${i + 1} falhou:`, resultado.error);
                    
                    // Se o erro for de senha atual, parar imediatamente
                    if (resultado.error && (
                        resultado.error.includes('senha atual') ||
                        resultado.error.includes('senhaAtual') ||
                        resultado.error.includes('current password') ||
                        resultado.error.includes('senha incorreta') ||
                        resultado.error.includes('password incorrect') ||
                        resultado.error.includes('incorreta')
                    )) {
                        console.log('🚫 Erro de senha atual detectado, interrompendo tentativas');
                        break;
                    }
                }
                
                if (i < tentativasAlteracao.length - 1) {
                    console.log(`⏭️ Tentando próximo formato...`);
                }
            }
            
            console.log('📊 Resultado final do processo:', { sucesso, erro: resultado?.error });
            
            if (sucesso) {
                mostrarMensagem(
                    'Senha Alterada com Sucesso', 
                    'Sua senha foi atualizada com sucesso!\n\nVocê já pode usar sua nova senha para fazer login.', 
                    'success'
                );
                
                // Limpar campo após sucesso
                senhaNovaInput.value = '';
                
            } else {
                console.error('❌ Todas as tentativas de alteração falharam:', resultado?.error);
                
                // Verificar se o erro é específico de senha atual
                if (resultado?.error && (
                    resultado.error.includes('senha atual') ||
                    resultado.error.includes('senhaAtual') ||
                    resultado.error.includes('current password') ||
                    resultado.error.includes('senha incorreta') ||
                    resultado.error.includes('password incorrect') ||
                    resultado.error.includes('incorreta')
                )) {
                    mostrarMensagem(
                        'Senha Atual Incorreta', 
                        'Não foi possível alterar a senha porque a senha atual informada está incorreta.\n\nPor favor, verifique e tente novamente.', 
                        'error'
                    );
                } else if (resultado?.error && (
                    resultado.error.includes('fraca') || 
                    resultado.error.includes('weak') || 
                    resultado.error.includes('mínimo') || 
                    resultado.error.includes('requisitos')
                )) {
                    mostrarMensagem(
                        'Senha Não Atende aos Requisitos', 
                        'A nova senha não atende aos requisitos de segurança.\n\nRecomendamos:\n• Mínimo de 6 caracteres\n• Letras maiúsculas e minúsculas\n• Números e caracteres especiais', 
                        'warning'
                    );
                } else if (resultado?.error && (
                    resultado.error.includes('senha') || 
                    resultado.error.includes('Senha') || 
                    resultado.error.includes('password') || 
                    resultado.error.includes('Password')
                )) {
                    mostrarMensagem(
                        'Erro na Alteração', 
                        'Não foi possível processar a alteração de senha.\n\nPor favor, verifique os dados e tente novamente.', 
                        'error'
                    );
                } else {
                    mostrarMensagem(
                        'Erro no Processamento', 
                        `Não foi possível completar a alteração:\n${resultado?.error || 'Erro desconhecido'}`,
                        'error'
                    );
                }
            }
            
        } catch (error) {
            console.error('🚨 Erro inesperado no processo:', error);
            mostrarMensagem(
                'Erro Inesperado', 
                'Ocorreu um erro inesperado durante o processo.\n\nPor favor, tente novamente em alguns instantes.', 
                'error'
            );
        } finally {
            // Restaurar botão
            botao.textContent = textoOriginal;
            botao.disabled = false;
        }
    });
    
    // ===== MÁSCARA PARA CPF/CNPJ =====
    const documentoInput = document.getElementById('troca');
    if (documentoInput) {
        documentoInput.addEventListener('input', function(e) {
            const tipoDocumento = document.querySelector('input[name="novoTipoDocumento"]:checked').value;
            e.target.value = aplicarMascaraDocumento(e.target.value, tipoDocumento);
        });
    }
    
    // ===== ATUALIZAR PLACEHOLDER DO DOCUMENTO =====
    const radioDocumentos = document.querySelectorAll('input[name="novoTipoDocumento"]');
    radioDocumentos.forEach(radio => {
        radio.addEventListener('change', function() {
            const placeholder = this.value === 'CPF' ? 'Novo CPF' : 'Novo CNPJ';
            if (documentoInput) {
                documentoInput.placeholder = placeholder;
                documentoInput.value = '';
            }
        });
    });
    // Configurar observador de logout
    configurarObservadorLogout();
});
