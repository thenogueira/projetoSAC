function mostrarMensagem(texto, tipo = 'erro') {
    const modalFundo = document.getElementById('fundo');
    const modalCaixa = document.getElementById('modalCaixa');
    const modalTexto = document.getElementById('modalMensagem');
    modalTexto.textContent = texto;
    modalFundo.className = 'w-dvw h-dvh bg-black absolute opacity-50'
    modalCaixa.className = 'fixed inset-0 flex items-center justify-center z-50';
    modalTexto.className = tipo === 'erro'
        ? 'bg-red-100 text-red-800 px-8 py-6 rounded-xl text-center shadow-lg '
        : 'bg-green-100 text-green-800 px-8 py-6 rounded-xl text-center shadow-lg';
    modalCaixa.classList.remove('hidden');
    setTimeout(() => {
        modalCaixa.classList.add('hidden');
    }, 4000);

    modalFundo.classList.remove('hidden');
    setTimeout(() => {
        modalFundo.classList.add('hidden');
    }, 4000);
}



document.addEventListener('DOMContentLoaded', function () {
    const toggleDocumentoBtn = document.getElementById('toggleDocumentoBtn');
    const tipoDocumentoContainer = document.getElementById('tipoDocumentoContainer');

    // Alterna a visibilidade do contêiner ao clicar no botão
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

        // Validação básica
        if (!nome || !numeroDocumento || 
            (tipoDocumento === "CPF" && numeroDocumento.length !== 11) || 
            (tipoDocumento === "CNPJ" && numeroDocumento.length !== 14)) {
            mostrarMensagem('Preencha todos os campos de maneira correta!', 'erro');
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