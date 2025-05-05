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
            alert('Preencha todos os campos de maneira correta!');
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