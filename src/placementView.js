class PlacementView {
  #createButton(name, callback) {
    const button = document.createElement("button");
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      callback(e);
    });
    button.innerText = name;
    button.id = name.toLowerCase() + "-btn";
    return button;
  }

  addButtons(boardId, randomize, ready) {
    const display = document.querySelector("#" + boardId);
    const randomizeButton = this.#createButton("Randomize", randomize);
    const readyButton = this.#createButton("Ready", ready);
    display.appendChild(randomizeButton);
    display.appendChild(readyButton);
  }

  showMessage(boardId) {
    const board = document.querySelector("#" + boardId);
    board.innerText = "";
    const msg = document.createElement("p");
    msg.classList.add("ready-msg");
    msg.classList.add("board-overlay");
    msg.innerText = "Press Any Key to Rotate";
    board.appendChild(msg);
  }

  removeButtons(boardId) {
    const buttons = document.querySelectorAll("#" + boardId + " button");
    buttons.forEach((button) => button.remove());
  }
}

export { PlacementView };
