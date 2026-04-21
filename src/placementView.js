class PlacementView {
  #createButton(name, callback) {
    const button = document.createElement("button");
    button.addEventListener("click", (e) => callback(e));
    button.innerText = name;
    button.id = name.toLowerCase() + "-btn";
    return button;
  }

  addButtons(board, randomize, ready) {
    const display = document.querySelector("#" + board.id);
    const randomizeButton = this.#createButton("Randomize", randomize);
    const readyButton = this.#createButton("Ready", ready);
    display.appendChild(randomizeButton);
    display.appendChild(readyButton);
  }

  removeButtons(board) {
    const buttons = document.querySelectorAll("#" + board.id + " button");
    buttons.forEach((button) => button.remove());
  }
}

export { PlacementView };
