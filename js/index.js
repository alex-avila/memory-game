const grid = document.getElementById('grid')

const generateCards = () => {
    let html = ''
    for (let i = 0; i < 16; i++) {
        html += `<div class="card" data-name="hello">` + 
            `<div class="card__side card__front"></div>` + 
            `<div class="card__side card__back"></div>` +
            `</div>`
    }
    grid.innerHTML = html
}

const flip = e => {
    const card = e.path[1]
    card.classList.toggle('flipped')
}

generateCards()

for (let card of document.getElementsByClassName('card')) {
    card.addEventListener('click', flip)
}