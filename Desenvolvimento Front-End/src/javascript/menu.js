document.addEventListener('DOMContentLoaded', () => {
    const menuAntigo = document.getElementById('menu-antigo');
    const menuNovo = document.getElementById('menu-novo');
    const profileName = document.getElementById('profileName');
    const profileImage = document.getElementById('profileImage');

    // Recupera o usuário do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    let primeiroNome = "";
    let primeiroSobrenome = "";

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

        // separa o nome em partes
        const partesNome = usuarioLogado.nome.trim().split(" ");
        primeiroNome = partesNome[0];
        primeiroSobrenome = partesNome.length > 1 ? partesNome[1] : "";

        // Inicialmente mostra só o primeiro nome, adiciona span para sobrenome
        if (profileName) {
            profileName.innerHTML = `<span>${primeiroNome}</span><span id="sobrenome" style="opacity:0; transition: opacity 0.1s;"></span>`;
        }

        // Preenche imagem do usuário
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

    let menu = document.querySelector('div#menu');
    let imagem = document.querySelector('div#imagem');

    if (menu) {
        menu.addEventListener('click', clicar);
    }

    function clicar() {
        menu.classList.toggle("expandir");
        imagem.classList.toggle("dep");

        const sobrenomeSpan = document.getElementById('sobrenome');

        if (menu.classList.contains("expandir")) {
            // Mostra o sobrenome com fade-in rápido após 0.25s
            setTimeout(() => {
                if (sobrenomeSpan) {
                    sobrenomeSpan.textContent = " " + primeiroSobrenome;
                    sobrenomeSpan.style.opacity = 1; // fade-in
                }
            }, 250);
        } else {
            // remove o sobrenome imediatamente ao fechar, sem fade-out
            if (sobrenomeSpan) {
                sobrenomeSpan.textContent = "";
                sobrenomeSpan.style.opacity = 0;
            }
        }
    }

    const botaoSair = document.getElementById('logout');

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
