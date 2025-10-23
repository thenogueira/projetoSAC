document.addEventListener('DOMContentLoaded', function() {

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

    if (modalElements.closeBtn) {
        modalElements.closeBtn.addEventListener('click', () => {
            modalElements.modal.classList.add('hidden');
        });
    }

    const toggleDocumentoBtn = document.getElementById('toggleDocumentoBtn');
    const tipoDocumentoContainer = document.getElementById('tipoDocumentoContainer');
    toggleDocumentoBtn.addEventListener('click', () => {
        tipoDocumentoContainer.classList.toggle('hidden');
    });

    function showFieldError(input, message) {
        if (!input) return;
        clearFieldError(input);
        const el = document.createElement('p');
        el.className = 'field-error text-red-600 text-sm mt-1';
        el.textContent = message;
        input.insertAdjacentElement('afterend', el);
    }

    function clearFieldError(input) {
        if (!input) return;
        const sib = input.nextElementSibling;
        if (sib && sib.classList && sib.classList.contains('field-error')) sib.remove();
    }

    // **Função para formatar CPF automaticamente**
    function formatarCPF(cpf) {
        // Remove tudo que não é dígito
        cpf = cpf.replace(/\D/g, '');
        
        // Aplica a formatação
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        
        return cpf;
    }

    // **Adiciona a formatação automática no campo de documento**
    const numeroDocumentoEl = document.getElementById('numeroDocumento');
    if (numeroDocumentoEl) {
        numeroDocumentoEl.addEventListener('input', function() {
            const tipoDocumento = document.querySelector('input[name="tipoDocumento"]:checked')?.value;
            
            // Aplica formatação apenas para CPF
            if (tipoDocumento === 'CPF') {
                const cursorPosition = this.selectionStart;
                const valorOriginal = this.value;
                
                this.value = formatarCPF(this.value);
                
                // Mantém a posição do cursor correta após formatação
                if (valorOriginal.length < this.value.length) {
                    this.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                }
            }
        });
    }

    // **Funções de validação internas**
    // Validação simplificada de CPF
    function isValidCPF(CPF) {
        CPF = CPF.replace(/\D/g, '');
        return CPF.length === 11 && !/^(\d)\1+$/.test(CPF);
    }

    // Validação simplificada de CNPJ
    function isValidCNPJ(CNPJ) {
        CNPJ = CNPJ.replace(/\D/g, '');
        return CNPJ.length === 14 && !/^(\d)\1+$/.test(CNPJ);
    }

    const continueBtn = document.getElementById('continueBtn');
    ['nome','numeroDocumento'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => clearFieldError(el));
    });

    continueBtn.addEventListener('click', async function() {
        const nome = document.getElementById('nome').value.trim();
        const numeroDocumentoEl = document.getElementById('numeroDocumento');
        const numeroDocumento = numeroDocumentoEl.value.trim();
        const tipoDocumento = document.querySelector('input[name="tipoDocumento"]:checked').value;

        clearFieldError(document.getElementById('nome'));
        clearFieldError(numeroDocumentoEl);

        if (!nome) {
            showFieldError(document.getElementById('nome'), 'Nome obrigatório.');
            mostrarMensagem('Erro', 'Preencha o nome corretamente!', 'erro');
            return;
        }

        if (!numeroDocumento) {
            showFieldError(numeroDocumentoEl, `${tipoDocumento} obrigatório.`);
            mostrarMensagem('Erro', `Preencha o ${tipoDocumento} corretamente!`, 'erro');
            return;
        }

        let valido = false;
        // **IMPORTANTE: Valida usando o número limpo (sem formatação)**
        const numeroDocumentoLimpo = numeroDocumento.replace(/\D/g, '');
        
        if (tipoDocumento === 'CPF') {
            valido = isValidCPF(numeroDocumentoLimpo);
            if (!valido) {
                showFieldError(numeroDocumentoEl, 'CPF inválido.');
                mostrarMensagem('Erro', 'CPF inválido.', 'erro');
                return;
            }
        } else if (tipoDocumento === 'CNPJ') {
            valido = isValidCNPJ(numeroDocumentoLimpo);
            if (!valido) {
                showFieldError(numeroDocumentoEl, 'CNPJ inválido.');
                mostrarMensagem('Erro', 'CNPJ inválido.', 'erro');
                return;
            }
        }

        // Verificar se documento já existe no banco
        try {
            // Verificar se documento já está cadastrado
            const response = await fetch(`http://localhost:8080/usuarios/verificar-documento/${numeroDocumentoLimpo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 409) {
                // Documento já existe
                showFieldError(numeroDocumentoEl, `${tipoDocumento} já cadastrado.`);
                mostrarMensagem('Erro', `${tipoDocumento} já está cadastrado no sistema.`, 'erro');
                return;
            } else if (!response.ok && response.status !== 404) {
                // Outro erro (404 é OK - documento não existe)
                throw new Error(`Erro ${response.status} ao verificar documento`);
            }

            // Se chegou aqui, documento não existe ou é 404 (pode prosseguir)
            const dadosCadastro = {
                nome,
                tipoDocumento,
                numeroDocumento: numeroDocumentoLimpo,
                profileImage: '../img/default-profile.png'
            };
            localStorage.setItem('usuarioCadastro', JSON.stringify(dadosCadastro));

            window.location.href = 'cadastro-2.html';

        } catch (error) {
            console.error('Erro ao verificar documento:', error);
            // Em caso de erro na verificação, permite prosseguir mas mostra alerta
            mostrarMensagem('Atenção', 'Não foi possível verificar se o documento já existe. Prosseguindo com cadastro...', 'erro');
            
            const dadosCadastro = {
                nome,
                tipoDocumento,
                numeroDocumento: numeroDocumentoLimpo,
                profileImage: '../img/default-profile.png'
            };
            localStorage.setItem('usuarioCadastro', JSON.stringify(dadosCadastro));

            setTimeout(() => {
                window.location.href = 'cadastro-2.html';
            }, 2000);
        }
    });
});