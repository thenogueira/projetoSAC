document.addEventListener('DOMContentLoaded', () => {
    const menuAntigo = document.getElementById('menu-antigo');
    const menuNovo = document.getElementById('menu-novo');
    const profileName = document.getElementById('profileName');
    const profileImage = document.getElementById('profileImage');

    // Recupera o usuário do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado && usuarioLogado.nome) {
        // Usuário logado → mostra menu novo
        if (menuAntigo) {
            menuAntigo.classList.remove('flex');
            menuAntigo.classList.add('hidden');
        }
        if (menuNovo) {
            menuNovo.classList.remove('hidden');
            menuNovo.classList.add('flex');
        }

        // Preenche nome e imagem do usuário, se existir
        if (profileName && usuarioLogado.nome) {
            profileName.textContent = usuarioLogado.nome;
        }
        if (profileImage && usuarioLogado.foto) {
            profileImage.src = usuarioLogado.foto;
        }

    } else {
        // Usuário não logado → mostra menu antigo
        if (menuAntigo) {
            menuAntigo.classList.remove('hidden');
            menuAntigo.classList.add('flex');
        }
        if (menuNovo) {
            menuNovo.classList.remove('flex');
            menuNovo.classList.add('hidden');
        }
    }

    let menu = document.querySelector('div#menu')

    let imagem = document.querySelector('div#imagem')

    menu.addEventListener('click', clicar)

    function clicar(){

    menu.classList.toggle("expandir")

    imagem.classList.toggle("dep")

    }

    const botaoSair = document.getElementById('logout')

    if (botaoSair) {
        botaoSair.addEventListener('click', (e) => {
            e.preventDefault(); // Evita comportamento padrão
            localStorage.removeItem('usuarioLogado'); // Remove usuário
            // Atualiza a tela
            if (menuNovo) {
                menuNovo.classList.remove('flex');
                menuNovo.classList.add('hidden');
            }
            if (menuAntigo) {
                menuAntigo.classList.remove('hidden');
                menuAntigo.classList.add('flex');
            }
        });
    }

});


