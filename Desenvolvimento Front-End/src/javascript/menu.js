document.addEventListener('DOMContentLoaded', () => {
    const menuAntigo = document.getElementById('menu-antigo');
    const menuNovo = document.getElementById('menu-novo');

    // Pega o usuário logado do localStorage
    const user = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (user && user.nome) {
        // Está logado: esconde menu antigo, mostra novo
        if (menuAntigo) menuAntigo.style.display = 'none';
        if (menuNovo) menuNovo.style.display = 'flex'; // ou 'block' conforme layout
    } else {
        // Não está logado: mostra menu antigo, esconde novo
        if (menuAntigo) menuAntigo.style.display = 'flex'; // ou 'block'
        if (menuNovo) menuNovo.style.display = 'none';
    }
});
