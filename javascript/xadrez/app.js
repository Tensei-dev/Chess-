/*
 FRONTEND CHESS CLIENT

 Connects UI to backend chess.js engine

 Human move → backend validates → returns FEN
 Robot move → backend validates → returns FEN

 UI always renders from FEN

**/

/*
 CONFIGURATION
**/

const API_URL = "http://localhost:3000/game";

let gameId = null;

let selectedSquare = null;

/*
 INITIALIZE GAME
**/
let CASAS = [];

window.onload = async () => {

  CASAS = document.querySelectorAll(".casa");

  CASAS.forEach(square => {
    square.addEventListener("click", onSquareClick);
  });

  const res = await fetch(API_URL,{method:"POST"});

  const game = await res.json();

    console.log("GAME:", game);
    console.log("FEN:", game.fen);
  gameId = game.id;

  renderBoardFromFEN(game.fen);

};


/**
 HANDLE HUMAN CLICK
**/

async function onSquareClick(){

  const clickedSquare = this.id;


  /***
   SELECT PIECE
    ***/

  if(selectedSquare === null){

    const hasPiece =
      this.querySelector("img");

    if(!hasPiece)
      return;

    selectedSquare = clickedSquare;

    this.classList.add("marked");

    return;

  }



  /***
   MOVE PIECE
  ***/

  const from = convertToChess(selectedSquare);

  const to = convertToChess(clickedSquare);
  document
    .getElementById(selectedSquare)
    .classList.remove("marked");


  selectedSquare = null;
  const moveResult =
    await sendMove(from,to);


  if(!moveResult){

    console.log("invalid");

    return;
  }

  renderBoardFromFEN(moveResult.fen);
  checkGameStatus(moveResult);

  if(moveResult.status === "ONGOING")

    await robotMove();

}

/*
 SEND MOVE TO BACKEND
**/

async function sendMove(from,to){

  const res = await fetch(`${API_URL}/${gameId}/move`,{

    method:"POST",

    headers:{

      "Content-Type":"application/json"

    },

    body: JSON.stringify({

      from,

      to,

      promotion:"q"

    })

  });


  if(res.status !== 200){

    console.log("Illegal move");

    return null;

  }


  return await res.json();

}



/*
 ROBOT MOVE
 Robot move comes from backend using same endpoint
*/

async function robotMove(){


  const res = await fetch(`${API_URL}/${gameId}`);


  const game = await res.json();


  if(game.status !== "ONGOING") return;


  // Ask backend to make robot move
  const robot = await fetch(`${API_URL}/${gameId}/robot`,{

    method:"POST"

  });


  const moveResult = await robot.json();

  renderBoardFromFEN(moveResult.fen);

  checkGameStatus(moveResult);
}



/*
 RENDER BOARD FROM FEN
 This ensures frontend always reflects backend state
*/

function renderBoardFromFEN(fen){

  clearBoard();

  const rows = fen.split(" ")[0].split("/");

  for(let y=0;y<8;y++){

    let x=0;

    for(const char of rows[y]){

      if(isNaN(char)){

        const id = `${x+1}-${8-y}`;
        placePiece(id,char);
        x++;

      }

      else{
        x += Number(char);
      }

    }

  }

}

/*
 PLACE PIECE IMAGE
*/

function placePiece(id,char){

  const square = document.getElementById(id);
  const img = document.createElement("img");
  const color = char === char.toUpperCase()
    ? "white"
    : "black";

  const type = getPieceType(char.toLowerCase());
  img.src = `./img/${color}-${type}.png`;
  img.classList.add("piece-chess");
  square.appendChild(img);

}

/*
 CLEAR BOARD
*/

function clearBoard(){

  CASAS.forEach(square=>{
    square.innerHTML="";
  });

}

/*
 CHECK STATUS
*/
function checkGameStatus(game){

  if(game.status === "FINISHED")
    alert("CHECKMATE");

  if(game.status === "DRAW")
    alert("DRAW");
}

/*
 CONVERSION FUNCTIONS
*/
function convertToChess(id){

  const [x,y] = id.split("-");
  const file = String.fromCharCode(96 + Number(x));
  return file+y;
}

function getPieceType(letter){

  switch(letter){
    case "p": return "pawn";
    case "r": return "tower";
    case "n": return "horse";
    case "b": return "bishop";
    case "q": return "queen";
    case "k": return "king";
  }

}
