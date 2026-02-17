const API_URL = "http://localhost:3000";

let gameId = null;
let selectedSquare = null;

// Criar jogo ao carregar
window.onload = async () => {
  const response = await fetch(`${API_URL}/games`, {
    method: "POST",
  });

  const game = await response.json();
  gameId = game.id;

  renderBoard(game.fen);
  enableClicks();
};

// Renderizar baseado no FEN
function renderBoard(fen) {
  // Limpar todas as casas
  document.querySelectorAll(".casa").forEach((casa) => {
    casa.innerHTML = "";
  });

  const rows = fen.split(" ")[0].split("/");

  rows.forEach((row, rowIndex) => {
    let colIndex = 0;

    for (let char of row) {
      if (!isNaN(char)) {
        colIndex += parseInt(char);
      } else {
        const column = colIndex + 1;
        const line = 8 - rowIndex;

        const casa = document.getElementById(`${column}-${line}`);

        const img = document.createElement("img");
        img.src = getPieceImage(char);
        img.classList.add("piece-chess");

        casa.appendChild(img);

        colIndex++;
      }
    }
  });
}

// Mapear peças
function getPieceImage(char) {
  const pieces = {
    r: "img/black-tower.png",
    n: "img/black-horse.png",
    b: "img/black-bishop.png",
    q: "img/black-queen.png",
    k: "img/black-king.png",
    p: "img/black-pawn.png",
    R: "img/white-tower.png",
    N: "img/white-horse.png",
    B: "img/white-bishop.png",
    Q: "img/white-queen.png",
    K: "img/white-king.png",
    P: "img/white-pawn.png",
  };

  return pieces[char];
}

// Ativar clique nas casas
function enableClicks() {
  document.querySelectorAll(".casa").forEach((casa) => {
    casa.addEventListener("click", async () => {
      const id = casa.id; // exemplo: 5-2

      const [col, row] = id.split("-");
      const fromTo = `${String.fromCharCode(96 + parseInt(col))}${row}`;

      if (!selectedSquare) {
        selectedSquare = fromTo;
        casa.classList.add("marked");
        return;
      }

      await sendMove(selectedSquare, fromTo);

      document
        .querySelectorAll(".casa")
        .forEach((c) => c.classList.remove("marked"));

      selectedSquare = null;
    });
  });
}

// Enviar jogada
async function sendMove(from, to) {
  const response = await fetch(`${API_URL}/games/${gameId}/move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert("Movimento inválido");
    return;
  }

  renderBoard(data.fen);
}
