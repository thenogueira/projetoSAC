document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const denunciaSelect = document.getElementById("denuncia");
  const idInput = document.getElementById("idDenunciar");
  const descricaoTextarea = document.querySelector("textarea");

  // Pega informações do usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const nomeUsuario = usuarioLogado?.nome || "Usuário não identificado";
  const idUsuario = usuarioLogado?.id || usuarioLogado?.idUsuario || "N/A";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const tipoDenuncia = denunciaSelect.value;
    const idDenuncia = idInput.value.trim();
    const descricao = descricaoTextarea.value.trim();

    if (!idDenuncia || !descricao) {
      alert("Por favor, preencha todos os campos antes de enviar.");
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
      alert("✅ Denúncia enviada com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      alert("❌ Ocorreu um erro ao enviar sua denúncia. Tente novamente mais tarde.");
    }
  });
});
