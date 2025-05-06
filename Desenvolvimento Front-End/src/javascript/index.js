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
        const response = await fetch('http://localhost:8080/postagens');
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
    const container = document.querySelector('.w-vh.h-dvh.flex.gap-5.items-center.px-30.justify-center.bg-amber-50');
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

// Chama a função para buscar e renderizar as postagens ao carregar a página
document.addEventListener('DOMContentLoaded', fetchPostagens);

