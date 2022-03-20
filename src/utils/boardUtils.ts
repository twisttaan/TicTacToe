import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  APIMessageComponentButtonInteraction,
  Snowflake,
} from "discord-api-types/v9";
import { Player, TicTacToeBoard } from "../types/board";
import { SnowflakeUtil } from "./SnowflakeUtil";

const games = new Map<Snowflake, TicTacToeBoard>();

/** Converts a TicTacToeBoard to an Action row to be sent to Discord.
 
    ## Example Response:
```json
    [
      {
        components: [
          {
            custom_id: "tictac1",
            disabled: false,
            label: "⭕",
            style: 1,
            type: 2,
          },
          {
            custom_id: "tictac2",
            disabled: false,
            label: "⭕",
            style: 1,
            type: 2,
          },
          {
            custom_id: "tictac3",
            disabled: false,
            label: "❌",
            style: 1,
            type: 2,
          },
        ],
        type: 1,
      },
      {
        components: [
          {
            custom_id: "tictac4",
            disabled: false,
            label: "⭕",
            style: 1,
            type: 2,
          },
          {
            custom_id: "tictac5",
            disabled: false,
            label: "❌",
            style: 1,
            type: 2,
          },
          {
            custom_id: "tictac6",
            disabled: false,
            label: "❌",
            style: 1,
            type: 2,
          },
        ],
        type: 1,
      },
      {
        components: [
          {
            custom_id: "tictac7",
            disabled: false,
            label: "⭕",
            style: 1,
            type: 2,
          },
          {
            custom_id: "tictac8",
            disabled: false,
            label: "❌",
            style: 1,
            type: 2,
          },
          {
            custom_id: "tictac9",
            disabled: false,
            label: "❌",
            style: 1,
            type: 2,
          },
        ],
        type: 1,
      },
    ];
```
*/
export function ticTacToeBoardToActionRow(
  board: TicTacToeBoard,
  stateflake: Snowflake,
): APIActionRowComponent<APIMessageActionRowComponent>[] {
  const rows: APIActionRowComponent<APIMessageActionRowComponent>[] = [];
  for (let i = 0; i < 3; i++) {
    const row: APIActionRowComponent<APIMessageActionRowComponent> = {
      type: 1,
      components: [],
    };
    for (let j = 0; j < 3; j++) {
      const slot = board.rows[i].slots[j];
      const component: APIMessageActionRowComponent = {
        custom_id: `button_${i}_${j}_${stateflake}`,
        disabled: false,
        label:
          slot.player === Player.None
            ? "☐"
            : Player.X === slot.player
            ? "❌"
            : "⭕",
        style: 1,
        type: 2,
      };
      row.components.push(component);
    }
    rows.push(row);
  }
  return rows;
}

/** Checks if a game has been finished or not. */
export function isGameFinished(
  interaction: APIMessageComponentButtonInteraction,
): boolean {
  const state = games.get(interaction.data.custom_id.split("_")[3]);
  if (!state) {
    return false;
  }
  if (isWinning(state, Player.X)) {
    return true;
  }
  if (isWinning(state, Player.O)) {
    return true;
  }
  if (isDraw(state)) {
    return true;
  }
  return false;
}

/** Plays a turn */
function playTurn(
  board: TicTacToeBoard,
  row: number,
  column: number,
  player: Player,
): TicTacToeBoard {
  const newBoard = { ...board };
  newBoard.rows[row].slots[column].player = player;
  return newBoard;
}

/** Create a new board */
export function newBoard(): TicTacToeBoard {
  return {
    rows: [
      {
        slots: [
          { player: Player.None },
          { player: Player.None },
          { player: Player.None },
        ],
      },
      {
        slots: [
          { player: Player.None },
          { player: Player.None },
          { player: Player.None },
        ],
      },
      {
        slots: [
          { player: Player.None },
          { player: Player.None },
          { player: Player.None },
        ],
      },
    ],
  } as TicTacToeBoard;
}

/** Create a new game */
export function newGame(): APIActionRowComponent<APIMessageActionRowComponent>[] {
  const gameID = SnowflakeUtil.generate();
  games.set(gameID, newBoard());
  return ticTacToeBoardToActionRow(newBoard(), gameID);
}

/** Plays a turn from an interaction */
export function playTurnFromInteraction(
  interaction: APIMessageComponentButtonInteraction,
): TicTacToeBoard {
  const [row, slot] = interaction.data.custom_id.split("_").slice(1);
  const board = games.get(interaction.data.custom_id.split("_")[3]);
  if (board === undefined) {
    throw new Error("Board not found");
  }
  console.log(`Playing turn R:${row} S:${slot}`);
  console.log(board);
  if (board.rows[parseInt(row)].slots[parseInt(slot)].player !== Player.None) {
    throw new Error("Slot already taken");
  }
  const newBoard = playTurn(board, parseInt(row), parseInt(slot), Player.X);
  games.set(interaction.data.custom_id.split("_")[2], newBoard);
  return newBoard;
}

function isWinning(board: TicTacToeBoard, player: Player): boolean {
  for (let i = 0; i < 3; i++) {
    if (
      board.rows[i].slots[0].player === player &&
      board.rows[i].slots[1].player === player &&
      board.rows[i].slots[2].player === player
    ) {
      return true;
    } else if (
      board.rows[0].slots[i].player === player &&
      board.rows[1].slots[i].player === player &&
      board.rows[2].slots[i].player === player
    ) {
      return true;
    }
  }
  if (
    board.rows[0].slots[0].player === player &&
    board.rows[1].slots[1].player === player &&
    board.rows[2].slots[2].player === player
  ) {
    return true;
  } else if (
    board.rows[0].slots[2].player === player &&
    board.rows[1].slots[1].player === player &&
    board.rows[2].slots[0].player === player
  ) {
    return true;
  }
  return false;
}

function isDraw(board: TicTacToeBoard): boolean {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board.rows[i].slots[j].player === Player.None) {
        return false;
      }
    }
  }
  return true;
}
