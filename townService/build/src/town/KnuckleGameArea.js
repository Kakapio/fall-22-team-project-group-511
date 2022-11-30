import InteractableArea from './InteractableArea';
export default class KnuckleGameArea extends InteractableArea {
  gameRunning;
  spectators;
  board1;
  board2;
  player1;
  player2;
  dieRoll;
  isItPlayerOneTurn;
  get isActive() {
    return this._occupants.length > 0;
  }
  get spectatorsByID() {
    return this.spectators.map(player => player.id);
  }
  constructor({ id }, coordinates, townEmitter) {
    super(id, coordinates, townEmitter);
    this.gameRunning = false;
    this.spectators = [];
    this.board1 = this.createBoard();
    this.board2 = this.createBoard();
    this.isItPlayerOneTurn = true;
  }
  toModel() {
    return {
      id: this.id,
      occupantsByID: this.occupantsByID,
      gameRunning: this.gameRunning,
      spectatorsByID: this.spectatorsByID,
      board1: this.board1,
      board2: this.board2,
      player1ID: this.player1?.id,
      player2ID: this.player2?.id,
      isItPlayerOneTurn: this.isItPlayerOneTurn,
    };
  }
  remove(player) {
    super.remove(player);
    if (this.player1?.id === player.id) {
      this.player1 = undefined;
    } else if (this.player2?.id === player.id) {
      this.player2 = undefined;
    } else {
      this.spectators.filter(p => p.id !== player.id);
    }
    if (this.gameRunning && (this.player1 === undefined || this.player2 === undefined)) {
      this.gameRunning = false;
      this.board1 = this.createBoard();
      this.board2 = this.createBoard();
      this.dieRoll = undefined;
      this.isItPlayerOneTurn = true;
      this._emitAreaChanged();
    }
  }
  add(player) {
    super.add(player);
    if (this.player1 === undefined) {
      this.player1 = player;
    } else if (this.player2 === undefined) {
      this.player2 = player;
    } else {
      this.spectators.push(player);
    }
  }
  rollDie(player) {
    if (!this.gameRunning || this.player1 === undefined || this.player2 === undefined) {
      return;
    }
    if (this.isItPlayerOneTurn && player.id !== this.player1.id) {
      return;
    }
    if (!this.isItPlayerOneTurn && player.id !== this.player2.id) {
      return;
    }
    const roll = Math.floor(Math.random() * 6) + 1;
    this.dieRoll = roll;
  }
  placeDie(player, row) {
    if (!this.gameRunning || this.player1 === undefined || this.player2 === undefined) {
      return false;
    }
    if (this.isItPlayerOneTurn && player.id !== this.player1.id) {
      return false;
    }
    if (!this.isItPlayerOneTurn && player.id !== this.player2.id) {
      return false;
    }
    if (this.dieRoll === undefined) {
      return false;
    }
    if (this.isItPlayerOneTurn) {
      const targetCol = this.board1[row].findIndex(e => e === 0);
      if (targetCol !== -1) {
        this.board1[row][targetCol] = this.dieRoll;
        while (this.board2[row].findIndex(e => e === this.dieRoll) !== -1) {
          const colToZero = this.board2[row].findIndex(e => e === this.dieRoll);
          this.board2[row][colToZero] = 0;
        }
        this.isItPlayerOneTurn = false;
      } else {
        return false;
      }
    } else {
      const targetCol = this.board2[row].findIndex(e => e === 0);
      if (targetCol !== -1) {
        this.board2[row][targetCol] = this.dieRoll;
        while (this.board1[row].findIndex(e => e === this.dieRoll) !== -1) {
          const colToZero = this.board1[row].findIndex(e => e === this.dieRoll);
          this.board1[row][colToZero] = 0;
        }
        this.isItPlayerOneTurn = true;
      } else {
        return false;
      }
    }
    this.dieRoll = undefined;
    return true;
  }
  startGame() {
    if (this.player1 === undefined || this.player2 === undefined || this.gameRunning) {
      return;
    } else {
      this.gameRunning = true;
    }
  }
  createBoard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
      board.push([0, 0, 0]);
    }
    return board;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS251Y2tsZUdhbWVBcmVhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rvd24vS251Y2tsZUdhbWVBcmVhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sZ0JBQWdCLE1BQU0sb0JBQW9CLENBQUM7QUFFbEQsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLGdCQUFnQjtJQUNwRCxXQUFXLENBQVU7SUFFckIsVUFBVSxDQUFXO0lBRXJCLE1BQU0sQ0FBYTtJQUVuQixNQUFNLENBQWE7SUFFbkIsT0FBTyxDQUFVO0lBRWpCLE9BQU8sQ0FBVTtJQUVqQixPQUFPLENBQVU7SUFFakIsaUJBQWlCLENBQVU7SUFHbEMsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFXLGNBQWM7UUFDdkIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBU0QsWUFDRSxFQUFFLEVBQUUsRUFBd0IsRUFDNUIsV0FBd0IsRUFDeEIsV0FBd0I7UUFFeEIsS0FBSyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRU0sT0FBTztRQUNaLE9BQU87WUFDTCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVB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
