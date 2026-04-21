class EndView {
  constructor(rematch, reset) {
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

  displayEndMessage(boardId, isWinner) {
    const board = document.querySelector("#" + boardId);

    let msg;
    if (isWinner) {
      msg = this.#createWinMsg();
    } else {
      msg = this.#createLossMsg();
    }
    msg.classList.add("end-card");
    msg.classList.add("board-overlay");

    board.appendChild(msg);
  }
}

export { EndView };
