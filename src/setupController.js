import { Player } from "./player.js";
import { GameBoard } from "./gameBoard.js";
import { SetupView } from "./setupView.js";

class SetupController {
  constructor(advance) {
    this.view = new SetupView({
      leftCallback: (e) => this.#handleForm(e, "left"),
      rightCallback: (e) => this.#handleForm(e, "right"),
    });
    this.advance = advance;
    this.players = {};
  }

  #createFormConfig(playerId) {
    return {
      playerId,
      formId: playerId + "-form",
      boardId: playerId + "-board",
      fields: [
        {
          label: "Computer?",
          name: "isComputer",
          id: playerId + "-isComputer",
          type: "checkbox",
        },
        {
          label: "Computer Difficulty",
          name: "computerDifficulty",
          id: playerId + "computerDifficulty",
          type: "select",
          options: [
            { value: 1, text: "Easy" },
            { value: 2, text: "Medium" },
            { value: 3, text: "Hard" },
          ],
        },
      ],
      submit: (e, formConfig) => this.#handleForm(e, formConfig),
    };
  }

  #handleForm(e, formConfig) {
    e.preventDefault();
    const form = document.querySelector("#" + formConfig.formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const board = new GameBoard(formConfig.boardId);
    const isHuman = !data.isComputer;
    let computerStrategy;
    console.log(data.computerDifficulty);
    switch (+data.computerDifficulty) {
      case 1:
        computerStrategy = ["random", false];
        break;
      case 2:
        computerStrategy = ["random", true];
        break;
      case 3:
        computerStrategy = ["randomCheckerBoard", true];
        break;
      default:
        computerStrategy = ["random", true];
        break;
    }
    console.log(computerStrategy);
    const player = new Player(board, isHuman, ...computerStrategy);
    this.players[formConfig.playerId] = player;
    this.view.hideForm(formConfig.boardId);
    if (Object.entries(this.players).length == 2) {
      this.advance();
    }
  }

  takeOverDisplay() {
    const leftConfig = this.#createFormConfig("left");
    this.view.showForm(leftConfig);
    const rightConfig = this.#createFormConfig("right");
    this.view.showForm(rightConfig);
  }
}

export { SetupController };
