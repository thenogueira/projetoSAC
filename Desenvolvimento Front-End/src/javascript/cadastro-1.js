document.addEventListener('DOMContentLoaded', function() {

    const modalElements = {
        modal: document.getElementById('modalMensagem'),
        content: document.getElementById('modalContent'),
        title: document.getElementById('modalTitle'),
        icon: document.getElementById('modalIcon'),
        closeBtn: document.getElementById('modalCloseBtn')
    };

    function mostrarMensagem(titulo, texto, tipo = 'erro') {
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) return;

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

    continueBtn.addEventListener('click', function() {
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
        if (tipoDocumento === 'CPF') {
            valido = isValidCPF(numeroDocumento);
            if (!valido) {
                showFieldError(numeroDocumentoEl, 'CPF inválido.');
                mostrarMensagem('Erro', 'CPF inválido.', 'erro');
                return;
            }
        } else if (tipoDocumento === 'CNPJ') {
            valido = isValidCNPJ(numeroDocumento);
            if (!valido) {
                showFieldError(numeroDocumentoEl, 'CNPJ inválido.');
                mostrarMensagem('Erro', 'CNPJ inválido.', 'erro');
                return;
            }
        }

        // Limpa apenas números
        const numeroDocumentoLimpo = numeroDocumento.replace(/\D/g, '');

        const dadosCadastro = {
            nome,
            tipoDocumento,
            numeroDocumento: numeroDocumentoLimpo,
            profileImage: '../img/default-profile.png'
        };
        localStorage.setItem('usuarioCadastro', JSON.stringify(dadosCadastro));

        window.location.href = 'cadastro-2.html';
    });
});