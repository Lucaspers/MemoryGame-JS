var memoryCards;
var prevCard = undefined;
var loadingFlip = false;
var winCounter = 0;

function loadCards() {
    fetch("./cards.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(cards) {
        memoryCards = cards;
        renderCards();
    });
    
}

function initSite() {
    loadCards();
}

function renderCards(){
    var mainContainer = document.getElementById("mainContainer");
    mainContainer.innerHTML = "";

    var cardList = [];
    var id = 0
    for (var i = 0; i < memoryCards.length; i++) {
        cardList.push(createMemoryCard(memoryCards[i], id));
        id++;
        cardList.push(createMemoryCard(memoryCards[i], id));
        id++;
    }
    var shuffledList = shuffle(cardList);
    shuffledList.forEach(cardContainer => {
        mainContainer.appendChild(cardContainer);    
    });
}

function shuffle(cardList) {

    var j, x, i;
    for (i = cardList.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = cardList[i];
        cardList[i] = cardList[j];
        cardList[j] = x;
    }
    return cardList;
}  

function createMemoryCard(card, id) {

    var flipCard = document.createElement("div");
    flipCard.classList = "flip-card";
    
    var flipCardInner = document.createElement("div");
    flipCardInner.classList = "flip-card-inner";
    flipCardInner.data = {key: card.key, id: id};
    flipCardInner.onclick = function() {
        onCardClick(this);
    }
    
    var flipCardFront = document.createElement("div");
    flipCardFront.classList = "flip-card-front";

    var flipCardBack = document.createElement("div");
    flipCardBack.classList = "flip-card-back";

    var flipCardFrontImg = document.createElement("img");
    flipCardFrontImg.classList = "flip-card-front-img";
    flipCardFrontImg.src = "./images/bild-background.jpg";

    var flipCardBackImg = document.createElement("img");
    flipCardBackImg.classList = "flip-card-back-img";
    flipCardBackImg.src = "./images/" + card.img;

    flipCardFront.appendChild(flipCardFrontImg);
    flipCardBack.appendChild(flipCardBackImg);

    flipCardInner.appendChild(flipCardFront);
    flipCardInner.appendChild(flipCardBack);

    flipCard.appendChild(flipCardInner);

    return flipCard;
}

function onCardClick(flipCardInner) {
    if (!loadingFlip && !(prevCard && flipCardInner.data.id == prevCard.data.id)) {
        flipCardInner.classList += " animate";
        
        if(prevCard) {
            if(flipCardInner.data.key != prevCard.data.key){
                loadingFlip = true;
                setTimeout(() => {
                    flipCardInner.classList = "flip-card-inner";
                    prevCard.classList = "flip-card-inner";
                    prevCard = undefined;
                    loadingFlip = false;
                    console.log("No match");
                }, 1300);
            } else {
                flipCardInner.onclick = "";
                prevCard.onclick = "";
                
                prevCard = undefined;

                winCounter++;
                checkWin();
                console.log(winCounter);
            }
        } else {
            prevCard = flipCardInner;
        }

    }
}

function checkWin() {
    if(winCounter == memoryCards.length) {
        WinModal();
    }
}

function WinModal() {
    var modalDiv = document.createElement("div");
    modalDiv.classList = "modalDiv";

    var modalContentDiv = document.createElement("div");
    modalContentDiv.classList = "modalContentDiv";

    var modalText =document.createElement("h2");
    modalText.classList = "modalText";
    modalText.innerHTML = "Grattis du har vunnit!";

    var modalButton = document.createElement("button");
    modalButton.classList = "modalButton";
    modalButton.innerHTML = "Börja om";
    modalButton.onclick = function() {
        reloadGame(modalDiv);
    }
    document.body.appendChild(modalDiv);

    modalDiv.appendChild(modalContentDiv);
    modalContentDiv.appendChild(modalText);
    modalContentDiv.appendChild(modalButton);
}

function reloadGame(modalDiv) {
    modalDiv.parentNode.removeChild(modalDiv);
    winCounter = 0
    renderCards();
}