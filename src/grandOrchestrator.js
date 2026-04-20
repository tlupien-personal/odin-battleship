import { PlacementController } from "./placementController.js";
import { SetupController } from "./setupController.js";
import { GameController } from "./gameController.js";

class GrandOrchestrator {
  constructor() {
    this.setupController = new SetupController(() => this.setupAdvance());
    this.setupController.takeOverDisplay();
  }

  setupAdvance() {
    this.placementController = new PlacementController(
      this.setupController.players.left,
      this.setupController.players.right,
      () => this.placementAdvance(),
    );
    this.placementController.takeOverDisplay();
  }

  placementAdvance() {
    this.gameController = new GameController(
      this.placementController.left,
      this.placementController.right,
      () => this.gameAdvance(),
    );
    this.gameController.takeOverDisplay();
  }

  gameAdvance() {
    console.log("GAME OVER");
    // will later need the thing
  }
}

export { GrandOrchestrator };
