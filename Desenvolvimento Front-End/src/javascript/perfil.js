document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    // Exemplo de carregamento de dados do perfil
    fetch('http://localhost:8080/usuarios/perfil', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar perfil');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('profileName').textContent = data.nome;
            document.getElementById('profileEmail').textContent = data.email;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar perfil. Faça login novamente.');
            window.location.href = 'login.html';
        });

    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileContainer = document.getElementById('editProfileContainer');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (userData) {
        document.getElementById('profileName').textContent = userData.nome;
        document.getElementById('profileImage').src = userData.profileImage || '../img/default-profile.png';
        document.getElementById('profileDescription').textContent = userData.descricao || 'Sem descrição disponível.';
    } else {
        alert('Usuário não identificado. Faça login novamente.');
        window.location.href = 'login.html';
    }
    login
    // Toggle edit profile container visibility
    editProfileBtn.addEventListener('click', function () {
        if (editProfileContainer.classList.contains('hidden')) {
            editProfileContainer.classList.remove('hidden');
        } else {
            editProfileContainer.classList.add('hidden');
        }
    });

    // Save profile changes
    saveProfileBtn.addEventListener('click', function () {
        const newName = document.getElementById('editName').value.trim();
        const newDescription = document.getElementById('editDescription').value.trim();
        const newPhoto = document.getElementById('editPhoto').files[0];

        // Update name
        if (newName) {
            document.getElementById('profileName').textContent = newName;
            userData.nome = newName;
        }

        // Update description
        if (newDescription) {
            document.getElementById('profileDescription').textContent = newDescription;
        }

        // Update photo
        if (newPhoto) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('profileImage').src = e.target.result;
                userData.profileImage = e.target.result;
            };
            reader.readAsDataURL(newPhoto);
        }

        // Save updated data to localStorage
        localStorage.setItem('cadastroTemp', JSON.stringify(userData));

        // Hide edit container
        editProfileContainer.classList.add('hidden');
        alert('Perfil atualizado com sucesso!');
    });
});