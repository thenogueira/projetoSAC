document.addEventListener('DOMContentLoaded', function() {
document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let nome = document.getElementById('nome').value;
    let cpf = document.getElementById('cpf').value;
    let endereco = document.getElementById('endereco').value;

    if (!nome || !cpf || !endereco) {
        alert('Preencha todos os campos!');
        return;
    }

    let dadosCadastro = { nome, cpf, endereco };
    // Salva os dados temporariamente no localStorage
    localStorage.setItem('cadastroTemp', JSON.stringify(dadosCadastro));

    // Vai para a segunda etapa
    window.location.href = 'cadastro-2.html';
});
});
