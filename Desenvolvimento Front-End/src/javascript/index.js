const myObserver = new IntersectionObserver( (adoleta) => {
    adoleta.forEach( (adoleta) => {
        if(adoleta.isIntersecting ){// === true
            adoleta.target.classList.add('publicado')
        } else{
            adoleta.target.classList.remove('publicado')
        }
    })

})

const publicados = document.querySelectorAll('.publique')

publicados.forEach( (publicados) => myObserver.observe(publicados))


const myObserverA = new IntersectionObserver( (adoletaA) => {
    adoletaA.forEach( (adoletaA) => {
        if(adoletaA.isIntersecting ){// === true
            adoletaA.target.classList.add('publicados')
        } else{
            adoletaA.target.classList.remove('publicados')
        }
    })

})

const publicadosA = document.querySelectorAll('.publiques')

publicadosA.forEach( (publicadosA) => myObserverA.observe(publicadosA))


const myObserverB = new IntersectionObserver( (adoletaB) => {
    adoletaB.forEach( (adoletaB) => {
        if(adoletaB.isIntersecting ){// === true
            adoletaB.target.classList.add('publicadoB')
        } else{
            adoletaB.target.classList.remove('publicadoB')
        }
    })

})

const publicadosB = document.querySelectorAll('.publiqueB')

publicadosB.forEach( (publicadosB) => myObserverB.observe(publicadosB))




async function fetchPostagens() {
    try {
        const response = await fetch('http://localhost:8080/ocorrencias/listar');
        method: 'GET'
        if (!response.ok) {
            throw new Error('Erro ao buscar postagens');
        }

        const postagens = await response.json();
        renderPostagens(postagens);
    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
    }
}

function renderPostagens(postagens) {
    const container = document.querySelector('div#postsContainer');
    container.innerHTML = ''; // Limpa o conteúdo existente

    postagens.forEach((postagem) => {
        const article = document.createElement('article');
        article.className = 'flex flex-2 min-w-[50%] p-0';

        article.innerHTML = `
            <div class="rounded-xl bg-fundo1">
                <img class="rounded-xl rounded-b-none" src="${postagem.imagem}" alt="">
                <p class="indent-2 text-[40px] mt-10 mb-5">${postagem.titulo}</p>
            </div>
        `;

        container.appendChild(article);
    });
}

let expandir = document.querySelector('div#expandir')

let menu = document.querySelector('div.menu')

let imagem = document.querySelector('div.imagem')

expandir.addEventListener('click', clicar)

function clicar(){
    menu.classList.toggle("expandir")

    imagem.classList.toggle("imagem-dep")

}

// Chama a função para buscar e renderizar as postagens ao carregar a página
document.addEventListener('DOMContentLoaded', fetchPostagens);


document.addEventListener('DOMContentLoaded', function () {

    // MENU DINÂMICO
    const menu = document.querySelector('#menu');

    if (1 + 2 == 3) {
        const menuLogado = document.createElement('div');

        menuLogado.classList.add('flex', 'items-center', 'gap-15', 'relative', 'py-2');

        menuLogado.innerHTML = `<a href="postagens.html" class=" hover:text-gray-800">Postagens</a>
                <a href="duvidas.html" class=" hover:text-gray-800">Duvidas</a>
                <span class="separator">|</span>
                <a href="index.html" class="text-destaque font-alfa text-4xl">SAC</a>
                <span class="separator">|</span>
                <a href="ajuda.html" class=" hover:text-gray-800 ">Ajuda</a>
                <div>
                    
                    <a href="#">
                    <div class="flex gap-3" >
                        <div class="p-0 rounded-full overflow-hidden imagem bg-black" id="imagem">
                            <img id="profileImage" class="object-cover w-full h-full" src="" alt="Foto de Perfil" width="10" height="10">
                        </div>
                            <!-- Foto de Perfil  -->
                        <div class="flex flex-col">
                            <span id="profileName">Satoru Gojo</span>
                                <!-- puxar do banco  -->
                        </div>
                    </div>
                </a>

                <div class="menu-grande" id="expandir">
                    <div class="menu p-0">
                        <a href="#">
                            <div class="flex gap-3" >
                                <div class="p-0 rounded-full overflow-hidden imagem bg-black" id="imagem">
                                    <img id="profileImage" class="object-cover w-full h-full" src="" alt="Foto de Perfil" width="10" height="10">
                                </div>
                                 <!-- Foto de Perfil  -->
                                <div class="flex flex-col">
                                    <span id="profileName">Satoru Gojo</span>
                                     <!-- puxar do banco  -->
                                </div>
                            </div>
                
                            <hr class="my-6">
                
                            <div>
                                <ul>
                                    <li class="item">
                                        <a href="perfil.html" class="link">
                                            <div class="flex items-center">
                                                <span class="icon"><i class="fa-solid fa-circle-user"></i></span>
                                                <span class="text">Perfil</span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                                <ul>
                                    <li class="item">
                                        <a href="criandoPost.html">
                                            <div class="flex items-center">
                                                <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                                                <span class="text">Criar Postagem</span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                                <ul>
                                    <li class="item">
                                        <a href="#">
                                            <div class="flex items-center">
                                                <span class="icon"><i class="fa-solid fa-gear"></i></span>
                                                <span class="text">Configurações</span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                                <ul>
                                    <li class="item">
                                        <a href="#">
                                            <div class="flex items-center">
                                                <span class="icon"><i class="fa-solid fa-door-open"></i></span>
                                                <span class="text">Sair da Conta</span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </a>
                    </div>
                </div>

                </div>
            </div>`;

        menu.appendChild(menuLogado);
    } else {
        const menuDeslogado = document.createElement('div');

        menuDeslogado.classList.add('flex', 'items-center', 'gap-15', 'px-6', 'py-2');

        menuDeslogado.innerHTML = `<a href="postagens.html" class=" hover:text-gray-800">Postagens</a>
                <a href="duvidas.html" class=" hover:text-gray-800">Duvidas</a>
                <span class="separator">|</span>
                <a href="index.html" class="text-destaque font-alfa text-4xl">SAC</a>
                <span class="separator">|</span>
                <a href="ajuda.html" class=" hover:text-gray-800 ">Ajuda</a>
                <a href="cadastro-1.html" class="py-1.25 px-2 rounded-lg bg-fundo1">Cadastre-se</a>`;

        menu.appendChild(menuDeslogado);
    }

});
