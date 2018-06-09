const grid = document.getElementById('grid')
let firstCard = null
let secondCard = null
let isChecking = false
// when sets matched equals 8
// win
let setsMatched = 0
let win = false


// Functions
const generateCards = len => {
    // Generates 16 cards
    // every card has a pair that has the same data-name
    let html = ''
    let x = [...Array(len / 2).keys()]
    for (let i = 0; i < len; i++) {
        const randIndex = Math.floor(Math.random() * x.length)
        const selection = x.splice(randIndex, 1)
        if (i === 7) {
            x = [...Array(len / 2).keys()]
        }
        html += `<div class="card" data-name="${selection}">` + 
            `<div class="card__side card__front">${selection}</div>` + 
            `<div class="card__side card__back"></div>` +
            `</div>`
    }
    grid.innerHTML = html
}

const flip = e => {
    const card = e.path[1]
    if (!card.dataset.matched && !isChecking) {
        if (!firstCard) {
            card.classList.toggle('flipped')
            firstCard = card
        } else if (card !== firstCard) {
            card.classList.toggle('flipped')
            secondCard = card
            isChecking = true
            setTimeout(checkMatch, 600)
        }
    }
}

const checkMatch = () => {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        firstCard.dataset.matched = true
        secondCard.dataset.matched = true
        setsMatched++
        if (setsMatched === 8) {
            win = true
            console.log('You won')
            // win function
        }
        // animate cards (match!)
    } else {
        firstCard.classList.toggle('flipped')
        secondCard.classList.toggle('flipped')
        // animate cards (noMatch!)
    }
    firstCard = null
    secondCard = null
    isChecking = false
}


// Generate cards when page loads
generateCards(16)


// Add Event Listener to all Cards
for (let card of document.getElementsByClassName('card')) {
    card.addEventListener('click', flip)
}