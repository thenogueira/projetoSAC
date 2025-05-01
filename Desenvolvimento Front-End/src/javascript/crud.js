document.addEventListener('DOMContentLoaded', function () {
    const saveBtn = document.getElementById('saveBtn');
    const listBtn = document.getElementById('listBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const output = document.getElementById('output');

    // Função para salvar os dados
    saveBtn.addEventListener('click', function () {
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

        if (!email || !senha || !confirmarSenha) {
            alert('Preencha todos os campos!');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        const cadastro = { email, senha };
        let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
        cadastros.push(cadastro);
        localStorage.setItem('cadastros', JSON.stringify(cadastros));

        alert('Cadastro salvo com sucesso!');
        document.getElementById('cadastroForm').reset();
    });

    // Função para listar os dados
    listBtn.addEventListener('click', function () {
        const cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
        if (cadastros.length === 0) {
            output.innerHTML = '<p>Nenhum cadastro encontrado.</p>';
            return;
        }

        output.innerHTML = '<ul>' + cadastros.map((c, index) => `
            <li>
                <strong>${index + 1}. Email:</strong> ${c.email}, 
                <strong>Senha:</strong> ${c.senha}
            </li>
        `).join('') + '</ul>';
    });

    // Função para atualizar um cadastro
    updateBtn.addEventListener('click', function () {
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

        if (!email) {
            alert('Informe o email para atualizar o cadastro!');
            return;
        }

        if (senha && senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
        const index = cadastros.findIndex(c => c.email === email);

        if (index === -1) {
            alert('Cadastro não encontrado!');
            return;
        }

        cadastros[index] = { email, senha: senha || cadastros[index].senha };
        localStorage.setItem('cadastros', JSON.stringify(cadastros));

        alert('Cadastro atualizado com sucesso!');
        document.getElementById('cadastroForm').reset();
    });

    // Função para excluir um cadastro
    deleteBtn.addEventListener('click', function () {
        const email = document.getElementById('email').value.trim();

        if (!email) {
            alert('Informe o email para excluir o cadastro!');
            return;
        }

        let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
        const index = cadastros.findIndex(c => c.email === email);

        if (index === -1) {
            alert('Cadastro não encontrado!');
            return;
        }

        cadastros.splice(index, 1);
        localStorage.setItem('cadastros', JSON.stringify(cadastros));

        alert('Cadastro excluído com sucesso!');
        document.getElementById('cadastroForm').reset();
    });
});