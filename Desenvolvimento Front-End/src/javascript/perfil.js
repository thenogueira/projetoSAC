document.addEventListener('DOMContentLoaded', function () {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileContainer = document.getElementById('editProfileContainer');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('cadastroTemp'));
    if (userData) {
        document.getElementById('profileName').textContent = userData.nome;
        document.getElementById('profileImage').src = userData.profileImage || '../img/default-profile.png';
    }

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