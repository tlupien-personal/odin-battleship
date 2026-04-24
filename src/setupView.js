class SetupView {
  #createLabel(config) {
    const label = document.createElement("label");
    label.innerText = config.label;
    label.setAttribute("for", config.id);
    return label;
  }

  #createInput(config) {
    const row = document.createElement("div");
    row.classList.add(`${config.type}-row`);
    const input = document.createElement("input");
    const label = this.#createLabel(config);

    input.id = config.id;
    input.setAttribute("type", config.type);
    input.setAttribute("name", config.name);

    row.appendChild(label);
    row.appendChild(input);
    return row;
  }

  #createDropdown(config) {
    const row = document.createElement("div");
    row.classList.add(`${config.type}-row`);
    const label = this.#createLabel(config);
    const select = document.createElement("select");

    select.id = config.id;
    select.setAttribute("name", config.name);

    for (const optionConfig of config.options) {
      const option = document.createElement("option");
      option.setAttribute("value", optionConfig.value);
      option.innerText = optionConfig.text;
      select.appendChild(option);
    }

    row.appendChild(label);
    row.appendChild(select);
    return row;
  }

  #createForm(formConfig) {
    const form = document.createElement("form");
    form.id = formConfig.formId;
    form.classList.add("board-overlay");

    for (const field of formConfig.fields) {
      if (field.type === "select") {
        const row = this.#createDropdown(field);
        form.appendChild(row);
      } else {
        const row = this.#createInput(field);
        form.appendChild(row);
      }
    }

    const button = document.createElement("button");
    button.innerText = "Ready";
    button.addEventListener("click", (e) => formConfig.submit(e, formConfig));
    form.appendChild(button);

    return form;
  }

  showForm(formConfig) {
    const container = document.querySelector("#" + formConfig.boardId);
    container.innerText = "";
    container.classList.remove("attack-border");
    container.classList.remove("defense-border");
    const form = this.#createForm(formConfig);
    container.appendChild(form);
  }

  hideForm(boardId) {
    const container = document.querySelector("#" + boardId);
    container.innerText = "";
    const p = document.createElement("p");
    p.classList.add("ready-msg");
    p.classList.add("board-overlay");
    p.innerText = "Ready!";
    container.appendChild(p);
  }
}

export { SetupView };
