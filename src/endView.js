class EndView {
  constructor(boardView, rematch, reset) {
    this.boardView = boardView;
    this.rematch = rematch;
    this.reset = reset;
  }

  #createWinMsg() {
    const card = document.createElement("div");
    const msg = document.createElement("p");
    msg.innerText = "You Win!";

    const rematchButton = document.createElement("button");
    rematchButton.addEventListener("click", (e) => this.rematch(e));
    rematchButton.innerText = "Rematch";

    const newGameButton = document.createElement("button");
    newGameButton.addEventListener("click", (e) => this.reset(e));
    newGameButton.innerText = "New Game";

    const buttonContainer = document.createElement("div");
    buttonContainer.appendChild(rematchButton);
    buttonContainer.appendChild(newGameButton);

    card.appendChild(msg);
    card.appendChild(buttonContainer);

    return card;
  }

  #createLossMsg() {
    const card = document.createElement("div");
    const msg = document.createElement("p");
    msg.innerText = "You Lose";
    card.appendChild(msg);
    return card;
  }

  displayEndMessage(player, isWinner) {
    const board = document.querySelector("#" + player.board.id);
    this.boardView.showShips(player.board);
    this.boardView.fade(player.board);

    let msg;
    if (isWinner) {
      msg = this.#createWinMsg();
    } else {
      msg = this.#createLossMsg();
    }
    msg.classList.add("end-card");

    board.appendChild(msg);
  }
}

export { EndView };
