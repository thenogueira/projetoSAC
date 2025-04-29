document.addEventListener('DOMContentLoaded', function () {
    const continueBtn = document.getElementById('continueBtn');

    continueBtn.addEventListener('click', function () {
        const nome = document.getElementById('nome').value.trim();
        // const usuario = document.getElementById('USUARIO').value.trim();
        const numeroDocumento = document.getElementById('cpf').value.trim();
        const endereco = document.getElementById('endereco').value.trim();
        const tipoDocumento = "CPF";
        // Validação básica
        if (!nome || !cpf) {
            alert('Preencha todos os campos!');
            return;
        }

        // Armazena os dados no localStorage
        const dadosTemp = { nome, tipoDocumento, numeroDocumento};
        localStorage.setItem('cadastroTemp', JSON.stringify(dadosTemp));

        // Redireciona para a segunda etapa
        window.location.href = 'cadastro-2.html';
    });
});