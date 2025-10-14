
document.addEventListener('DOMContentLoaded', () => {
    const menuAntigo = document.getElementById('menu-antigo');
    const menuNovo = document.getElementById('menu-novo');
    const profileName = document.getElementById('profileName');
    const profileImage = document.getElementById('profileImage');

    // Recupera o usuário do localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    let primeiroNome = "";
    let primeiroSobrenome = "";

    // helper: define partículas/conectores comuns (em minúsculo)
    const conectores = new Set([
      "de","da","do","dos","das",
      "van","von","del","la","le","el"
    ]);

    // helper: capitaliza corretamente (primeira letra maiúscula, resto minúsculo)
    function capitalize(word) {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

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

        // separa o nome em partes, removendo espaços extras
        const partesNome = usuarioLogado.nome.trim().split(/\s+/).filter(Boolean);

        primeiroNome = partesNome[0] || "";
        // lógica para formar o "primeiroSobrenome" conforme solicitado:
        if (partesNome.length > 1) {
          const segunda = partesNome[1];
          const segundaLower = segunda.toLowerCase();

          if (conectores.has(segundaLower)) {
            // caso: conector (ex: "de") → tentamos pegar a próxima parte também
            if (partesNome.length > 2) {
              // conector em minúscula + próximo sobrenome capitalizado
              primeiroSobrenome = `${segundaLower} ${capitalize(partesNome[2])}`;
            } else {
              // só existe o conector sem sobrenome seguinte → mostrar apenas o conector (raro)
              primeiroSobrenome = segundaLower;
            }
          } else {
            // caso padrão: mostrar apenas a segunda parte (primeiro sobrenome), capitalizada
            primeiroSobrenome = capitalize(segunda);
          }
        } else {
          primeiroSobrenome = "";
        }

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
            // Mostra o sobrenome com fade-in rápido após 0.175s
            setTimeout(() => {
                if (sobrenomeSpan) {
                    sobrenomeSpan.textContent = primeiroSobrenome ? " " + primeiroSobrenome : "";
                    sobrenomeSpan.style.opacity = 1; // fade-in
                }
            }, 175);
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

