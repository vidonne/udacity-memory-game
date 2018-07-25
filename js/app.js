/*
 * Globals
 */
const deck = document.querySelector('.deck'); //Create a list that holds all of your cards
let openCards = []; //Empty array for open cards
let moves = 0; //Set moves to 0
const movesNumber = document.querySelector('.moves'); //Select the HTML element for moves
movesNumber.innerHTML = moves; //Apply moves value to HTML
let timerOff = true; //Set the condition to start timer on first click
let time = 0; //Set time variable to 0
let clockId; //Set a clockId to be use to stop the time
const stars = document.querySelectorAll('.stars li'); //Select all stars
let starCount = 3; //Set base number of stars
const modal = document.querySelector('.modal_backgroud'); //Select the HTML element the modal

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Creation of the Deck of shuffled cards
function shuffleDeck() {
  //Go select all the cards on the deck and transform it into an array
  const cardsToShuffle = [...document.querySelectorAll('.deck li')];
  //Shuffle the cards using the provided shuffle() function
  const cardsShuffled = shuffle(cardsToShuffle);
  // Append every card to the deck
  for (card of cardsShuffled) {
    deck.appendChild(card);
    card.classList.remove('match', 'open', 'show');
  }
}
shuffleDeck();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 deck.addEventListener('click', function(event) {
   //Verify that target is a card and not anything else
   const clickTarget = event.target;
   if(isClickable(clickTarget)) {
     //Added if to limit to the 1st click only.
     if (timerOff) {
       timerStart();
       timerOff = false;
     }
     toggleSymbol(clickTarget);
     cardList(clickTarget);
     if (openCards.length === 2) {
       checkMatch();
     }
   }
 });

//Check all conditions if card is clickable
function isClickable(clickTarget){
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    openCards.length < 2 &&
    !openCards.includes(clickTarget)
  );
};

//Toggle CSS classes to show symbol
function toggleSymbol(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
};

//Add card to openCards array
function cardList(clickTarget) {
  openCards.push(clickTarget);
};

//Check if cards match
function checkMatch() {
  if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
    match();
  } else {
    noMatch();
  }
  addMove();
  movesCheck();
  gameOver();
};

//If match add class .match and empty array
function match() {
  openCards[0].classList.toggle('match');
  openCards[1].classList.toggle('match');
  toggleSymbol(openCards[0]);
  toggleSymbol(openCards[1]);
  openCards = [];
};

//If no match toggle class .open and .show and empty array
//Add setTimeout function to actually see the cards.
function noMatch() {
  setTimeout(function() {
    toggleSymbol(openCards[0]);
    toggleSymbol(openCards[1]);
    openCards = [];
  }, 800);
};

//Increase number of Moves
function addMove() {
  moves ++;
  movesNumber.innerHTML = moves;
};

//Star rating remove a star when passing a certain number of moves
//First check the number of moves and call hideStar function
function movesCheck() {
  if (moves === 12 || moves === 24) {
    hideStar();
    starCount--;
  }
};

//Check if winning
function gameOver() {
  if (document.querySelectorAll('.match').length === 16) {
    timerStop();
    finalScore();
    toggleModal();
  }
};

function hideStar() {
  //Loop in stars and if not already hidden hide it and break loop.
  for (star of stars) {
    if (star.style.visibility !== 'hidden') {
      star.style.visibility = 'hidden';
      break;
    }
  }
};

//Timer start after first click
function timerStart() {
  clockId = setInterval(function() {
    time ++;
    displayTime();
  }, 1000);
};

//Format time to display
function displayTime() {
  const clock = document.querySelector('.clock');
  let formatMinutes = digit(Math.floor(time/60));
  let formatSeconds = digit(time % 60);
  clock.innerHTML = `${formatMinutes}:${formatSeconds}`;
};

//Add 0 in front of single digit
function digit(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
};

//Stop timer
function timerStop() {
  clearInterval(clockId);
};

//Congratulations popup toggle
function toggleModal() {
  modal.classList.toggle('hide');
};

//Close modal with click on X and anywhere else but the popup.
document.querySelector('.modal_close').addEventListener('click', toggleModal);

window.addEventListener('click', function(event) {
  if (event.target == modal) {
    toggleModal();
  }
});

//Replay modal button
document.querySelector('.modal_replay').addEventListener('click', function() {
  resetGame();
  toggleModal();
});

//Replay general button
document.querySelector('.restart').addEventListener('click', resetGame);

//Get score and show them in modal
function finalScore() {
  const timeScore = document.querySelector('.modal_time');
  const timeClock = document.querySelector('.clock').innerHTML;
  const moveScore = document.querySelector('.modal_move');
  const startScore = document.querySelector('.modal_star');
  timeScore.innerHTML = timeClock;
  moveScore.innerHTML = moves;
  startScore.innerHTML = starCount;
}

/*
 * Resets
 */

//Reset Game
function resetGame() {
  resetTime();
  resetMoves();
  resetStars();
  shuffleDeck();
};

//Reset clock and time
function resetTime() {
  timerStop();
  timerOff = true;
  time = 0;
  displayTime();
};

//Reset moves
function resetMoves() {
  moves = 0;
  movesNumber.innerHTML = moves;
};

//Reset stars
function resetStars() {
  starCount = 3;
  //Loop in stars and if hidden show it.
  for (star of stars) {
    if (star.style.visibility === 'hidden') {
      star.style.visibility = 'visible';
    }
  }
}
