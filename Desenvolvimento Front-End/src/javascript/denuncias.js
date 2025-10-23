// ====== Função de Modal Customizado ======
function mostrarModal(titulo, mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMensagem');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalIcon = document.getElementById('modalIcon');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Define ícone e cor conforme tipo
    let iconClass = 'fa-info-circle text-blue-500';
    if (tipo === 'sucesso') iconClass = 'fa-check-circle text-green-500';
    else if (tipo === 'erro') iconClass = 'fa-times-circle text-red-500';
    else if (tipo === 'aviso') iconClass = 'fa-exclamation-circle text-yellow-500';

    modalIcon.className = `fas ${iconClass} text-2xl mr-3 mt-1`;
    modalTitle.textContent = titulo;
    modalContent.textContent = mensagem;

    modal.classList.remove('hidden');

    modalCloseBtn.onclick = () => modal.classList.add('hidden');
}


document.addEventListener("DOMContentLoaded", () => {
    // VERIFICAÇÃO DE LOGIN - BLOQUEIO TOTAL DE ACESSO
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!usuarioLogado) {
        mostrarModal('Erro', 'Você precisa fazer login para acessar esta página', 'erro');
        window.location.href = 'login.html';
        return;
    }

    // FUNÇÃO MELHORADA PARA VERIFICAR LOGIN EM TEMPO REAL
    function verificarLoginTempoReal() {
        const token = localStorage.getItem('authToken');
        const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
        
        if (!token || !usuarioAtual) {
            mostrarModal('Erro', 'Você precisa fazer login para interagir', 'erro');
            localStorage.removeItem('authToken');
            localStorage.removeItem('usuarioLogado');
            sessionStorage.clear();
            
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // OBSERVADOR PARA DETECTAR MUDANÇAS NO LOCALSTORAGE (DESLOGAR)
    function configurarObservadorLogout() {
        window.addEventListener('storage', function(e) {
            if (e.key === 'usuarioLogado' && !e.newValue) {
                mostrarModal('Erro', 'Sessão expirada. Faça login novamente para interagir.', 'erro');
                window.location.href = 'login.html';
            }
        });
    
        // Também verifica periodicamente (a cada 2 segundos)
        setInterval(() => {
            const token = localStorage.getItem('authToken');
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
            if (!token || !usuario) {
                mostrarModal('Erro', 'Sessão expirada. Faça login novamente.', 'erro');
                window.location.href = 'login.html';
                window.location.href = 'login.html';
            }
        }, 2000);
    }


    const form = document.querySelector("form");
    const denunciaSelect = document.getElementById("denuncia");
    const idInput = document.getElementById("idDenunciar");
    const descricaoTextarea = document.querySelector("textarea");

    // Pega informações do usuário logado
    const nomeUsuario = usuarioLogado?.nome || "Usuário não identificado";
    const idUsuario = usuarioLogado?.id || usuarioLogado?.idUsuario || "N/A";

    // Preenche automaticamente os campos se veio de uma denúncia (post ou comentário)
    const denunciaSalva = localStorage.getItem("denunciaTipo");
    const idSalvo = localStorage.getItem("denunciaId");

    if (denunciaSalva && idSalvo) {
        document.getElementById("denuncia").value = denunciaSalva;
        document.getElementById("idDenunciar").value = idSalvo;

        // Limpa o localStorage depois de preencher
        localStorage.removeItem("denunciaTipo");
        localStorage.removeItem("denunciaId");
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // VERIFICAÇÃO DE LOGIN ANTES DE ENVIAR
        if (!verificarLoginTempoReal()) return;

        const tipoDenuncia = denunciaSelect.value;
        const idDenuncia = idInput.value.trim();
        const descricao = descricaoTextarea.value.trim();

        if (!idDenuncia || !descricao) {
             mostrarModal('Erro', 'Por favor, preencha todos os campos antes de enviar.', 'erro');
            return;
        }

        // Inicializa EmailJS
        emailjs.init({ publicKey: "p5rXmRz_6dNTCypQq" });

        // Corpo do e-mail (incluindo nome e ID do usuário)
        const conteudo = `
      Nova denúncia recebida no site SAC:
      ------------------------------
      Usuário que denunciou: ${nomeUsuario}
      ID do perfil: ${idUsuario}
      Tipo de denúncia: ${tipoDenuncia}
      ID do item denunciado: ${idDenuncia}
      Descrição: ${descricao}
      ------------------------------
      Enviado em: ${new Date().toLocaleString("pt-BR")}
    `;

        const params = {
            tipoDenuncia,
            idDenuncia,
            descricao,
            nomeUsuario,
            idUsuario,
            dataEnvio: new Date().toLocaleString("pt-BR"),
            to_email: "sistemadeapoiocomunitario@gmail.com",
            conteudo
        };

        try {
            await emailjs.send("service_k6ww4io", "template_hjltlm8", params);
            mostrarModal('Sucesso!', '✅ Denúncia enviada com sucesso!', 'sucesso');
            form.reset();
        } catch (error) {
            mostrarModal('Erro', '❌ Ocorreu um erro ao enviar sua denúncia. Tente novamente mais tarde.', 'erro');
        }
    });
    // Configurar observador de logout
    configurarObservadorLogout();
});

