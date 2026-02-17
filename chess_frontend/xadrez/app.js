const CASAS = document.querySelectorAll('.casa');
CASAS.forEach(casa => casa.addEventListener('click', selecionarCasa))
const PIECES = {
    'PAWN': document.getElementsByClassName('pawn'),
    'HORSE': document.getElementsByClassName('horse'),
    'BISHOP': document.getElementsByClassName('bishop'),
    'TOWER': document.getElementsByClassName('tower'),
    'QUEEN': document.getElementsByClassName('queen'),
    'KING': document.getElementsByClassName('king'),
};
const ALLPIECES = ['pawn','horse','bishop','tower','queen','king'];
let lock = false;
let pieceMoving;
let newPlace;
let initialCoord = [];
let finalCoord = [];
let pieceType;

function selecionarCasa(){
    if(this.innerHTML) {
        this.classList.toggle('marked') 
        pieceMoving = this;
        lock = true;
    } else {
       if(lock === true && !this.innerHTML) {
        newPlace = this;
        lock = false;
        getCoordenates();
       }
    }
    return;
 };
function getCoordenates(){
    let initialHouse = pieceMoving.id.split('-');
    initialHouse.forEach(coord => initialCoord.push(+coord))
    let newHouseCoord = newPlace.id.split('-');
    newHouseCoord.forEach(coord => finalCoord.push(+coord));
    checkPiece();
}

function checkPiece(){
    let piece = pieceMoving.innerHTML;
    
    for(let i = 0; i < ALLPIECES.length; i++){
        piece.includes(ALLPIECES[i]) ? pieceType = ALLPIECES[i] : undefined;
    }
    console.log(pieceType);
    checkMove();
}

function checkMove(){
    switch(pieceType){
        case 'pawn':
            
            if(initialCoord[0] === finalCoord[0] && Math.abs(finalCoord[1]-initialCoord[1]) === 1){
                checkPath();
            } else {
                clean();
            }
            break;

        case 'bishop':
            if(Math.abs(finalCoord[0]-initialCoord[0]) === Math.abs(finalCoord[1]-initialCoord[1])){
                checkPath();
            } else {
                clean();
            }
            break;

        case 'horse':
            Math.abs(finalCoord[0]-initialCoord[0]) === 2 && Math.abs(finalCoord[1]-initialCoord[1]) === 1 ? checkPath() : undefined;
            Math.abs(finalCoord[1]-initialCoord[1]) === 2 && Math.abs(finalCoord[0]-initialCoord[0]) === 1 ? checkPath() : clean();
            break;

        case 'tower':
            if(initialCoord[0] === finalCoord[0] || finalCoord[1] === initialCoord[1]){
                checkPath();
            } else {
                clean();
            }
            break;

            case 'queen':
            console.log(initialCoord,finalCoord);
            (initialCoord[0] === finalCoord[0] || finalCoord[1] === initialCoord[1]) || (Math.abs(finalCoord[0]-initialCoord[0]) === Math.abs(finalCoord[1]-initialCoord[1])) ? checkPath() : clean();    
            break;

            case 'king':
            Math.abs(finalCoord[0]-initialCoord[0]) <= 1 && Math.abs(finalCoord[1]-initialCoord[1]) <= 1 ? checkPath() : clean();
            break;

        default:
            clean();
            break;
    }
}

let allCoord = [];
function checkPath(){
    let hasPiece = [];
    let a = initialCoord[0];    
    let b = initialCoord[1];
    for(let i = initialCoord[0]; i < finalCoord[0]; i++){
    allCoord.push([a++,b++]);
    }
    console.log(a,b);
    allCoord.forEach(coord => hasPiece.push(coord.join("-")));
    console.log(hasPiece)
    movePiece();
}

function movePiece(){
    newPlace.innerHTML = pieceMoving.innerHTML;
    pieceMoving.innerHTML = "";
    newPlace.classList.toggle('marked');
    setTimeout(clean,500);
};

function clean(){
    pieceMoving.classList.remove('marked');
    newPlace.classList.remove('marked');
    finalCoord= [];
    initialCoord = [];
    pieceType = '';
    return;
    };