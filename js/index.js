const grid = document.getElementById('grid'),
    moveCounter = document.getElementById('move-counter'),
    resetBtn = document.getElementById('reset-btn'),
    starOne = document.getElementById('star-1'),
    starTwo = document.getElementById('star-2'),
    starThree = document.getElementById('star-3'),
    timer = document.getElementById('timer'),
    modal = document.getElementById('modal'),
    playAgain = document.getElementById('play-again'),
    timeResult = document.getElementById('time-result'),
    starResult = document.getElementById('star-result')

// global game state
let gameState = {
    firstCard: null,
    secondCard: null,
    isChecking: false,
    setsMatched: 0,
    win: false,
    moves: 0,
    timer: new Date(0),
    stars: 3,
    interval: null
}

// initial game state for resetting
const initialGameState = { ...gameState }

let icons = [
    'ra-meat',
    'ra-cheese',
    'ra-toast',
    'ra-coffee-mug',
    'ra-beer',
    'ra-eggplant',
    'ra-chicken-leg',
    'ra-super-mushroom'
]

const generateCards = () => {
    let html = ''
    let iconsArr = [...icons]
    for (let i = 0; i < 16; i++) {
        const randIndex = Math.floor(Math.random() * iconsArr.length)
        const selection = iconsArr.splice(randIndex, 1)
        if (i === 7) {
            iconsArr = [...icons]
        }
        html += `<div class="card" data-name="${selection}">` +
            `<div class="card__side card__back"></div>` +
            `<div class="ra ${selection} card__side card__front"></div>` +
            `</div>`
    }
    grid.innerHTML = html
    // Add event listener to each card
    for (let card of document.getElementsByClassName('card')) {
        card.addEventListener('click', flip)
    }
}

const flip = e => {
    const card = e.path[1]
    if (gameState.moves === 0) {
        startTimer()
    }
    if (!card.dataset.matched && !gameState.isChecking) {
        if (!gameState.firstCard) {
            updateMovesAndStars(++gameState.moves)
            card.classList.toggle('flipped')
            gameState.firstCard = card
        } else if (card !== gameState.firstCard) {
            card.classList.toggle('flipped')
            gameState.secondCard = card
            gameState.isChecking = true
            setTimeout(checkMatch, 550)
        }
    }
}

const win = () => {
    clearInterval(gameState.interval)
    const time = gameState.timer
    const defaultText = time.getSeconds() + '<span class="time-unit">s</span>'
    timeResult.innerHTML = time.getMinutes() ?
        `${time.getMinutes()}<span class="time-unit">m</span> ${defaultText}` :
        defaultText
    starResult.textContent = `${gameState.stars} out of ${initialGameState.stars}`
    showModal()
}

const checkMatch = () => {
    let { firstCard, secondCard } = gameState
    if (firstCard.dataset.name === secondCard.dataset.name) {
        firstCard.classList.add('bounce')
        secondCard.classList.add('bounce')
        firstCard.dataset.matched = true
        secondCard.dataset.matched = true
        gameState.setsMatched++
        if (gameState.setsMatched === 8) {
            gameState.win = true
            win()
        }
        // animate cards (match!)
    } else {
        firstCard.classList.add('wiggle')
        secondCard.classList.add('wiggle')
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                firstCard.classList.remove('wiggle')
                secondCard.classList.remove('wiggle')
                firstCard.classList.toggle('flipped')
                secondCard.classList.toggle('flipped')
            }, 500)
        })
        // animate cards (noMatch!)
    }
    gameState.firstCard = null
    gameState.secondCard = null
    gameState.isChecking = false
}

const flipBackCards = () => {
    for (let card of document.getElementsByClassName('card')) {
        if (card.dataset.matched) {
            card.classList.toggle('flipped')
            card.dataset.matched = false
        }
    }
    if (gameState.firstCard) {
        gameState.firstCard.classList.toggle('flipped')
    }
}

const updateMovesAndStars = (moves) => {
    // This is bad code, I should fix this maybe
    moveCounter.textContent = moves === 1 ? `${moves} Move` : `${moves} Moves`
    if (moves < 17) {
        gameState.stars = 3
    } else if (moves < 22) {
        gameState.stars = 2
    } else {
        gameState.stars = 1
    }
    if (gameState.stars === 3) {
        starOne.classList.add('filled-star')
        starTwo.classList.add('filled-star')
        starTwo.classList.remove('empty-star')
        starThree.classList.add('filled-star')
        starThree.classList.remove('empty-star')
    }
    if (gameState.stars === 2) {
        starThree.classList.remove('filled-star')
        starThree.classList.add('empty-star')
    }
    if (gameState.stars === 1) {
        starTwo.classList.remove('filled-star')
        starTwo.classList.add('empty-star')
    }
}

const updateTimer = time => {
    let defaultText = time.getSeconds() + '<span class="time-unit">s</span>'
    timer.innerHTML = time.getMinutes() ?
        `${time.getMinutes()}<span class="time-unit">m</span> ${defaultText}` :
        defaultText
}

const startTimer = () => {
    gameState.interval = setInterval(() => {
        gameState.timer.setSeconds(gameState.timer.getSeconds() + 1)
        updateTimer(gameState.timer)
    }, 1000)
}

const reset = () => {
    flipBackCards()
    if (!gameState.win) {
        clearInterval(gameState.interval)
    }
    gameState = { ...initialGameState }
    // date object is acting weird so I'm hard resetting timer
    gameState.timer = new Date(0)
    updateTimer(gameState.timer)
    updateMovesAndStars(gameState.moves)
    setTimeout(generateCards, 500)
}

const beginGame = () => {
    // Create cards
    generateCards()

    // Set initial values
    updateMovesAndStars(gameState.moves)
    updateTimer(gameState.timer)

    // Add Event Listeners
    resetBtn.addEventListener('click', reset)

    playAgain.addEventListener('click', () => {
        hideModal()
        reset()
    })

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal()
        }
    })
}

const showModal = () => {
    modal.style.display = 'flex'
    modal.classList.add('fade-in')
    modal.classList.remove('hide')
}

const hideModal = () => {
    modal.classList.remove('fade-in')
    modal.classList.add('hide')
    // trigger display none slightly before hide animation ends
    setTimeout(() => modal.style.display = 'none', 465)
}

// Take care of creating cards setting values and adding event listeners
beginGame()


