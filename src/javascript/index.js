
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

