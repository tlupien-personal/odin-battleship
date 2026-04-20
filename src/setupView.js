class SetupView {
  constructor({ left, right }) {
    this.left = left;
    this.right = right;
  }

  #createForm(id) {
    const form = document.createElement("form");
    form.id = id + "-form";

    const label = document.createElement("label");
    label.setAttribute("for", "isHuman");
    label.innerText = "Human Player?";

    const input = document.createElement("input");
    input.id = id + "isHuman";
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "isHuman");
    // add event listener to show computer strategy dropdown

    const row = document.createElement("div");
    row.appendChild(label);
    row.appendChild(input);

    form.appendChild(row);

    const button = document.createElement("button");
    button.innerText = "Ready";
    button.addEventListener("click", (e) => this[id](e));
    form.appendChild(button);

    return form;
  }

  showForm(id) {
    const container = document.querySelector("#" + id + "-board");
    const form = this.#createForm(id);
    container.appendChild(form);
  }

  hideForm(id) {
    const container = document.querySelector("#" + id + "-board");
    container.innerText = "";
    const p = document.createElement("p");
    p.innerText = "Ready!";
    container.appendChild(p);
  }
}

export { SetupView };
