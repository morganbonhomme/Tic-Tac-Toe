const Gameboard = (() => {
  let board = [];

  const restart = () => {
   return board = [];
  }

  const push = (index, symbol) => {
    board[index] = symbol;
  }
return {board, restart, push};
})();


const Player = (name, symbol) => {
  return {name, symbol};
}


const Play = (() => {
  const player1 = Player("Player1", "o");
  const player2 = Player("Player2", "x");
  let turn = 0;
 
  const newTurn = () => {
    return turn ++;
  }

  const currentPlayer = () => {
    if (turn % 2 === 0) { 
      newTurn();
      return player2.symbol;
    } else {
      newTurn();
      return player1.symbol;
    }
  }

  const checkWinner = () => { 
    let isWinner = false;
    let winningBoxes = [];
    let symbol;

    // checking rows 
    for (let i = 0; i < 7; i +=3 ) {
      let a = Gameboard.board[i];
      let b = Gameboard.board[i+1];
      let c = Gameboard.board[i+2];
      if (a == b && b == c && (a === player1.symbol|| a === player2.symbol)) {
        isWinner = true;
        winningBoxes = [i, i+1, i+2];
        symbol = a;
      }
    }

     // checking columns 
     for (let i = 0; i < 3; i +=1) {
      let a = Gameboard.board[i];
      let b = Gameboard.board[i+3];
      let c = Gameboard.board[i+6];
   
      if (a == b && b == c && (a === player1.symbol|| a === player2.symbol)) {
        isWinner = true;
        winningBoxes = [i, i+3, i+6];
        symbol = a;
      }
    }

    // checking diagonals 
    let a = Gameboard.board[0];
    let b = Gameboard.board[4];
    let c = Gameboard.board[8];
    if (a == b && b == c && (a === player1.symbol|| a === player2.symbol)) {
      isWinner = true;
      winningBoxes = [0, 4, 8];
      symbol = a;
    }
    
    let d = Gameboard.board[2];
    let e = Gameboard.board[4];
    let f = Gameboard.board[6]; 
    if (d == e && e == f && (d === player1.symbol|| d === player2.symbol)) {
      isWinner = true;
      winningBoxes = [2, 4, 6];
      symbol = d;
    }

    return {isWinner, winningBoxes, symbol};
  };
  return {turn, player1, player2, newTurn, currentPlayer, checkWinner}
})();

const displayController = (() => {

  let game = true;
  let turn = Play.newTurn();

  // DOM elements
  const boxes = document.querySelectorAll(".box");
  const player1 = document.querySelector(".player1");
  const player2 = document.querySelector(".player2");
  const restart = document.querySelector("#restart");
  const winnerAnnouncement = document.querySelector(".winnerAnnouncement")

  // bind events
  restart.addEventListener('click', e => {clearBoard()});
    if (game === true) {
    boxes.forEach(box => {
      box.addEventListener("click", e => { 
        if (game === true) 
        {play(e)}
      });
    });}

  const displayTurn = () => {
    if (turn % 2 === 0) {
      player1.className = "player1";
      player2.className = " player2 player2turn";
    } else {  
      player1.className = "player1 player1turn";
      player2.className = "player2";
    }
    turn++
  }
  
  const render = () => {
    Gameboard.board.forEach((element, index) => {
      if (element == Play.player1.symbol) {
        boxes[index].firstElementChild.className = "fas fa-circle";
      } else if (element == Play.player2.symbol)  {
        boxes[index].firstElementChild.className = "fas fa-times";
      }
    })
  };

  const play = event => {
    console.log(turn)
    const coordinate = parseInt(event.target.id);
    if (Gameboard.board[coordinate] === undefined ) {
      Gameboard.push(coordinate, Play.currentPlayer());
    };
    if (Play.checkWinner().isWinner) {
      winner(Play.checkWinner().winningBoxes, Play.checkWinner().symbol);
    }  else if (turn === 8) { 
      winnerAnnouncement.textContent = "It's a tie !"
      endGame()
    }
    render();
    displayTurn();
  };

  

 const winner = (winningBoxes, winningPlayer) => { 
    winningBoxes.forEach(element => {
      boxes[element].style.backgroundColor = "#ffd082";
    })
    if (winningPlayer === Play.player1.symbol) {
      winnerAnnouncement.textContent = "Player 1 wins !"
    } else if (winningPlayer === Play.player2.symbol) {
      winnerAnnouncement.textContent = "Player 2 wins !"
    }
    endGame()
  } 

  const clearBoard = () => {
    winnerAnnouncement.textContent = "";
    for (let i = 0; i <  Gameboard.board.length; i ++) {
      Gameboard.board[i] = undefined;
      boxes[i].firstElementChild.className = "";
      boxes[i].style.backgroundColor = "transparent";
    }
    render();
    turn = 0;
    game = true;
    displayTurn()
  }

  const endGame = () => {
   game = false;
   turn = 0;
   displayTurn()
  };

})();




/* var myModule = (function() {
  'use strict';
  
  let board = [];
  let i = 0;

  // cacheDom
  const boxes = document.querySelectorAll(".box");
  const player1 = document.querySelector(".player1");
  const player2 = document.querySelector(".player2");
  const restart = document.querySelector("#restart");
  const winnerAnnouncement = document.querySelector(".winnerAnnouncement")
  
  // bindEvents
  boxes.forEach(box => {
    box.addEventListener("click", e => { play(e)
    })
  });
  restart.addEventListener("click", e => {clearBoard()});
  
  function render() {
    board.forEach((element, index) => {
      if (element === "o") {
        boxes[index].firstElementChild.className = "fas fa-circle";
      } else if (element === "x") {
        boxes[index].firstElementChild.className = "fas fa-times";
      }
    })
  };
  
  function chooseToken() {
    if (i % 2 === 0) {
      i += 1;
      player1.className = "player1";
      player2.className = " player2 player2turn";
      return "x"
    } else {
      i += 1;
      player1.className = "player1 player1turn";
      player2.className = "player2";
      return "o"
    }
  }
  
  function play(event) {
    const coordinate = parseInt(event.target.id);
    if (board[coordinate] === undefined ) {
      board[coordinate] = chooseToken();}
    render();
    rowCheck();
    columnCheck();
    diagnonalCheck();
  }

  function winner(i, j, k, winningPlayer) { 
    const winningBoxes = [i, j, k];
    winningBoxes.forEach(element => {
      boxes[element].style.backgroundColor = "#ffd082";
    })
    if (winningPlayer === "x") {
      winnerAnnouncement.textContent = "Player 1 wins !"
    } else if (winningPlayer === "o") {
      winnerAnnouncement.textContent = "Player 2 wins !"
    }
  } 

  function rowCheck() { 
    for (let i =0; i < 7; i +=3 ) {
      if (board[i] == board [i+1] && board [i+1] == board[i+2] && (board[i] === "x" || board[i] === "o")) {
        winner(i, i+1, i+2, board[i]);
      }
    }
  }

  function columnCheck() {
    for (let i =0; i < 3; i +=1 ) {
      if (board[i] == board [i+3] && board [i+3] == board[i+6] && (board[i] === "x" || board[i] === "o")) {
        winner(i, i+3, i+6, board[i]);

      }
    }
  }

  function diagnonalCheck() {
    if (board[0] == board [4] && board [4] == board[8] && (board[4] === "x" || board[4] === "o")) {
      winner(0, 4, 8, board[i]);
    } else if (board[2] == board [4] && board [4] == board[6] && (board[4] === "x" || board[4] === "o")) {
      winner(2, 4, 6, board[i]);
    }
  } 

  function clearBoard() {
    for (let i = 0; i < board.length; i ++) {
      board[i] = undefined;
      boxes[i].firstElementChild.className = "";
      boxes[i].style.backgroundColor = "transparent";
    }
    winnerAnnouncement.textContent = ""
    render();
  }
})();




 */