export type TicTacToeRow = {
  slots: TicTacToeSlot[];
};

export type TicTacToeSlot = {
  player: Player;
};

export enum Player {
  None = 0,
  X = 1,
  O = 2,
}

export type TicTacToeBoard = {
  rows: TicTacToeRow[];
};
