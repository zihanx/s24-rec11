interface GameState {
  name: string;
  footer: string;
  cells: Cell[];
  plugins: Plugin[];
  numColStyle: string;
  currentPlayer: string;
  gameOverMsg: string;
  showDropdown: boolean;
}
  
interface Cell {
  text: string;
  playable: boolean;
  x: number;
  y: number;
}

interface Plugin {
    name: string;
}
  
export type { GameState, Cell, Plugin }