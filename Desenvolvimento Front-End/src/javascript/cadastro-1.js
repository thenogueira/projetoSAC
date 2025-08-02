// function mostrarMensagem(texto, tipo = 'erro') {
//     const modalFundo = document.getElementById('fundo');
//     const modalCaixa = document.getElementById('modalCaixa');
//     const modalTexto = document.getElementById('modalMensagem');
//     modalTexto.textContent = texto;
//     modalFundo.className = 'w-dvw h-dvh bg-black absolute opacity-50'
//     modalCaixa.className = 'fixed inset-0 flex items-center justify-center z-50';
//     modalTexto.className = tipo === 'erro'
//         ? 'bg-red-100 text-red-800 px-8 py-6 rounded-xl text-center shadow-lg '
//         : 'bg-green-100 text-green-800 px-8 py-6 rounded-xl text-center shadow-lg';
//     modalCaixa.classList.remove('hidden');
//     setTimeout(() => {
//         modalCaixa.classList.add('hidden');
//     }, 4000);

//     modalFundo.classList.remove('hidden');
//     setTimeout(() => {
//         modalFundo.classList.add('hidden');
//     }, 4000);
// }

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Objeto que armazena referências aos elementos do modal de mensagem
     * @type {Object}
     * @property {HTMLElement} modal - Elemento do modal principal
     * @property {HTMLElement} content - Elemento do conteúdo da mensagem
     * @property {HTMLElement} title - Elemento do título do modal
     * @property {HTMLElement} icon - Elemento do ícone do modal
     * @property {HTMLElement} closeBtn - Botão de fechar o modal
     */
    const modalElements = {
        modal: document.getElementById('modalMensagem'),
        content: document.getElementById('modalContent'),
        title: document.getElementById('modalTitle'),
        icon: document.getElementById('modalIcon'),
        closeBtn: document.getElementById('modalCloseBtn')
    };

    /**
     * Exibe uma mensagem no modal personalizado
     * @function mostrarMensagem
     * @param {string} titulo - Título da mensagem
     * @param {string} texto - Corpo da mensagem
     * @param {string} [tipo='erro'] - Tipo da mensagem ('erro' ou outro valor para sucesso)
     */

    function mostrarMensagem(titulo, texto, tipo = 'erro') {
        // Verifica se todos os elementos do modal existem
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
            console.error('Elementos do modal não encontrados!');
            alert(`${titulo}: ${texto}`); // Fallback básico
            return;
        }

        // Configura o ícone e cores baseado no tipo de mensagem
        modalElements.icon.className = tipo === 'erro' 
            ? 'fas fa-exclamation-circle text-red-500 text-2xl mr-3 mt-1'
            : 'fas fa-check-circle text-green-500 text-2xl mr-3 mt-1';

        // Define o conteúdo do modal
        modalElements.title.textContent = titulo;
        modalElements.content.textContent = texto;

        // Exibe o modal
        modalElements.modal.classList.remove('hidden');

        // Fecha automaticamente após 5 segundos
        setTimeout(() => {
            modalElements.modal.classList.add('hidden');
        }, 5000);
    }

    // Botão de fechar "OK"
    if (modalElements.closeBtn) {
        modalElements.closeBtn.addEventListener('click', () => {
            modalElements.modal.classList.add('hidden');
        });
    }


    const toggleDocumentoBtn = document.getElementById('toggleDocumentoBtn');
    const tipoDocumentoContainer = document.getElementById('tipoDocumentoContainer');

    toggleDocumentoBtn.addEventListener('click', function () {
        if (tipoDocumentoContainer.classList.contains('hidden')) {
            tipoDocumentoContainer.classList.remove('hidden');
        } else {
            tipoDocumentoContainer.classList.add('hidden');
        }
    });




    

    const continueBtn = document.getElementById('continueBtn');
    continueBtn.addEventListener('click', function () {
        const nome = document.getElementById('nome').value.trim();
        const numeroDocumento = document.getElementById('numeroDocumento').value.trim();
        const tipoDocumento = document.querySelector('input[name="tipoDocumento"]:checked').value;

        
        if (!nome || !numeroDocumento || 
           (tipoDocumento === "CPF" && numeroDocumento.length !== 11) || 
           (tipoDocumento === "CNPJ" && numeroDocumento.length !== 14)){
            mostrarMensagem('Erro', 'Preencha todos os campos da forma correta', 'erro')
            return;
        }

        // Armazena os dados no localStorage
        const dadosCadastro = { 
            nome, 
            tipoDocumento, 
            numeroDocumento, 
            profileImage: '../img/default-profile.png' // Default profile image
        };
        localStorage.setItem('usuarioCadastro', JSON.stringify(dadosCadastro));

        // Redireciona para a segunda etapa
        window.location.href = 'cadastro-2.html';

    
    });
});
