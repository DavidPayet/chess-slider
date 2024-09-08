const hero = document.querySelector('.hero')
const chessPiecesContainer = document.querySelector('.chessPiecesContainer')
const movementsContainer = document.querySelector('.movementsContainer')
const nextBtn = document.querySelector('.next')
const prevBtn = document.querySelector('.prev')
const navToggler = document.querySelector('.navToggler')
const navigation = document.querySelector('nav')

navToggler.addEventListener('click', toggleNav)

function toggleNav(e) {
  e.stopPropagation()
  navToggler.classList.toggle('active')
  navigation.classList.toggle('active')
}

let isMouseDown = false

document.addEventListener('mousedown', () => {
  isMouseDown = true
})

document.addEventListener('mouseup', (e) => {
  if (
    isMouseDown &&
    navigation.classList.contains('active') &&
    !navigation.contains(e.target) &&
    e.target !== navToggler
  ) {
    navToggler.classList.remove('active')
    navigation.classList.remove('active')
  }

  isMouseDown = false
})

const getPieces = () => {
  fetch('/data/pieces.json')
    .then((res) => res.json())
    .then((pieces) => {
      pieces.forEach((piece) => {
        let onePiece = document.createElement('div')
        let pieceMovements = document.createElement('div')

        onePiece.className = 'piece'
        onePiece.style.backgroundImage = `url(${piece.bgUrl})`
        onePiece.innerHTML = `
          <div class="content">
            <p class="name">${piece.name}</p>
            <p class="description">${piece.description}</p>
          </div>
        `

        pieceMovements.className = 'movements'
        pieceMovements.innerHTML = `
          <p>${piece.name}</p>
          <p>${piece.description}</p>
        `

        chessPiecesContainer.appendChild(onePiece)
        movementsContainer.appendChild(pieceMovements)
      })
      document.body.appendChild(chessPiecesContainer, movementsContainer)
    })
    .catch((error) =>
      console.error('Erreur lors du chargement des pièces: ', error)
    )
}
getPieces()

nextBtn.onclick = function () {
  showSlider('next')
}

prevBtn.onclick = function () {
  showSlider('prev')
}

let autoNextSlide = setTimeout(() => {
  nextBtn.click()
}, 7000)

function showSlider(type) {
  const sliderPieces = chessPiecesContainer.querySelectorAll('.piece')

  if (type === 'next') {
    chessPiecesContainer.appendChild(sliderPieces[0])
    hero.classList.add('next')
  } else {
    chessPiecesContainer.prepend(sliderPieces[sliderPieces.length - 1])
    hero.classList.add('prev')
  }

  clearTimeout(autoNextSlide)

  autoNextSlide = setTimeout(() => {
    nextBtn.click()
  }, 7000)
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.isIntersecting && entry.target.classList.add('visible')
    })
  },
  { threshold: 0.4 }
)

document
  .querySelectorAll('.aboutContainer p')
  .forEach((p) => observer.observe(p))
