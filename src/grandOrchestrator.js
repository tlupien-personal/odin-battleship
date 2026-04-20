import { PlacementController } from "./placementController.js";
import { SetupController } from "./setupController.js";
import { GameController } from "./gameController.js";
import { EndController } from "./endController.js";
import { BoardView } from "./boardView.js";

class GrandOrchestrator {
  constructor() {
    this.setupController = new SetupController(() => this.setupAdvance());
    this.setupController.takeOverDisplay();
    this.boardView = new BoardView();
  }

  setupAdvance() {
    this.placementController = new PlacementController(
      this.boardView,
      this.setupController.players.left,
      this.setupController.players.right,
      () => this.placementAdvance(),
    );
    this.placementController.takeOverDisplay();
  }

  placementAdvance() {
    this.gameController = new GameController(
      this.boardView,
      this.placementController.left,
      this.placementController.right,
      () => this.gameAdvance(),
    );
    this.gameController.takeOverDisplay();
  }

  gameAdvance() {
    this.endController = new EndController(
      this.gameController.attacker,
      this.gameController.defender,
      this.boardView,
      () => this.endRematch(),
      () => this.endReset(),
    );
    this.endController.takeOverDisplay();
  }

  endRematch() {
    this.setupAdvance();
  }

  endReset() {
    this.setupController = new SetupController(() => this.setupAdvance());
    this.setupController.takeOverDisplay();
  }
}

export { GrandOrchestrator };
