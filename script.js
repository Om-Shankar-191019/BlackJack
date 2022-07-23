
// game: black jack----

let blackjackgame = {
    "you":{"scoreSpan":"#your-blackjack-result","div":"#your-box","score":0},
    "dealer":{"scoreSpan":"#dealer-blackjack-result","div":"#dealer-box","score":0},
    "cards":["a","2","3","4","5","6","7","8","9","10","j","q","k"],
    "cardMap":{"a":[1,11],"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"j":10,"q":10,"k":10},
    "wins":0,
    "losses":0,
    "draws":0,
    "isStand":false,
    "turnOver":false,
}

const YOU = blackjackgame["you"];
const DEALER = blackjackgame["dealer"];

// const hitSound  = new Audio('static/sounds/put2.mp3');
// const winSound = new Audio('static/sounds/win2.mp3');
// const lossSound = new Audio('static/sounds/cowLost2.mp3');
const hitSound  = new Audio('http://commondatastorage.googleapis.com/codeskulptor-assets/Collision8-Bit.ogg');
const winSound = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav');
const lossSound = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/explosion_02.wav');
document.querySelector("#blackjack-hit-button").addEventListener("click",blackjackhit);
document.querySelector("#blackjack-stand-button").addEventListener("click",dealerLogic);
document.querySelector("#blackjack-deal-button").addEventListener("click",blackjackdeal);


function blackjackhit(){
    if(blackjackgame['isStand']===false)
    {
        let card = randomCard();
        showCard(YOU,card);
        updateScore(card,YOU);
        showScore(YOU);
    }
}

function randomCard(){
    return blackjackgame['cards'][getRandom(0,12)];
}

function showCard(activePlayer,card){
    if(activePlayer['score'] <=21)
    {
        let cardImage = document.createElement("img");
        cardImage.src=`https://www.improvemagic.com/wp-content/uploads/2020/11/s${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackdeal(){
   if(blackjackgame['turnOver']===true)
   {
        let yourImages = document.querySelector("#your-box").querySelectorAll("img");
        for(let i=0;i<yourImages.length;i++)
        {
            yourImages[i].remove();
        }

        let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");
        for(let i=0;i<dealerImages.length;i++)
        {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector("#your-blackjack-result").textContent = 0;
        document.querySelector("#dealer-blackjack-result").textContent = 0;
        document.querySelector("#your-blackjack-result").style.color = "#ffffff";
        document.querySelector("#dealer-blackjack-result").style.color = "#ffffff";

        document.querySelector("#blackjack-result").textContent = "Let's Play";
        document.querySelector("#blackjack-result").style.color = "black";

        blackjackgame['isStand'] = false;
        blackjackgame['turnOver'] = false;
   }    
}

function updateScore(card,activePlayer){
    if(card=='a')
    {
        if(activePlayer['score'] + blackjackgame['cardMap'][card][1] <=21)
            activePlayer['score'] += blackjackgame['cardMap'][card][1];
        else
            activePlayer['score'] += blackjackgame['cardMap'][card][0];
    }
    else
        activePlayer['score'] += blackjackgame['cardMap'][card];
}

function showScore(activePlayer){
    if(activePlayer['score']>21)
    {
        document.querySelector(activePlayer['scoreSpan']).textContent = "BUST";
        document.querySelector(activePlayer['scoreSpan']).style.color = "red";
    }
    else
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic(){
    blackjackgame['isStand']=true;
    while(DEALER['score']<16 && blackjackgame['isStand']===true)
    {
        let card = randomCard();
        showCard(DEALER,card);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    blackjackgame['turnOver']=true;
    let winner = computeWinner();
    showResult(winner);
    
}

function computeWinner(){
    let winner;

    if(YOU['score']<=21)
    {
        if(YOU['score']>DEALER['score'] || DEALER['score']>21)
        {
            blackjackgame["wins"]++;
            winner = YOU;
        }
        else if(YOU['score']<DEALER['score'])
        {
            winner = DEALER;
            blackjackgame["losses"]++;
        }
        else if(YOU['score']==DEALER['score'])
        {
            blackjackgame["draws"]++;
        }
    }
    else if(YOU['score']>21 && DEALER['score']<=21)
    {
        winner=DEALER;
        blackjackgame["losses"]++;
    }
    else if(YOU['score']>21 && DEALER['score']>21)
    {
        
        blackjackgame["draws"]++;
    }

    // console.log("winner is: ", winner);

    return winner;
}

function showResult(winner){
    let message,messageColor;
    if(winner===YOU)
    {
        document.querySelector("#win").textContent = blackjackgame["wins"];
        message="You Won!";
        messageColor = "green";
        winSound.play();
    }
    else if(winner===DEALER)
    {
        document.querySelector("#loss").textContent = blackjackgame["losses"];
        message = "You Lost#";
        messageColor = "red";
        lossSound.play();
    }
    else
    {
        document.querySelector("#draw").textContent = blackjackgame["draws"];
        message = "You drew^^";
        messageColor = "blue";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
}

function getRandom(first,last){
    var r = Math.random()*(last+1-first);
    return(Math.floor(r)+first)
}
