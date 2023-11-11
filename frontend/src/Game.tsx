import React, { useState, useEffect } from 'react';
import './Game.css'; // import the css file to enable your styles.
import { GameState, Cell } from './game';

const Game: React.FC = () => {
  const [state, setState] = useState<GameState>({
    cells: [],
    name : "A Game Framework",
    footer : "No game is running",
    plugins : [],
    numColStyle : "auto",
    currentPlayer : "",
    gameOverMsg : "",
    showDropdown: false,
  })

  useEffect(() => {
    async function start(){
      const response = await fetch("start");
    
      const json = await response.json();
      setState((prevState) => ({...prevState, plugins: json["plugins"]}))
    }
    start()
  }, [])

  async function play(x: number, y: number) {
      const response = await fetch(`/play?x=${x}&y=${y}`)
      const json = await response.json();
      setState((prevState) => ({...prevState,  cells: json["cells"], 
                                              plugins: json["plugins"], 
                                              name: json["name"],
                                              footer:json["footer"], 
                                              currentPlayer : json["currentPlayer"],
                                              numColStyle : json["numColStyle"],
                                              gameOverMsg : json["gameOverMsg"] 
                                }))
    }

  const createCell = (cell: Cell, index: number) => {
    const playableText = cell.playable ? 'playable' : '';
    if (cell.playable)
      /**
       * key is used for React when given a list of items. It
       * helps React to keep track of the list items and decide
       * which list item need to be updated.
       * @see https://reactjs.org/docs/lists-and-keys.html#keys
       */
      return (
        <div key={index}>
          <button type="button" onClick={() => play(cell.x, cell.y)}>
            <div className={`cell ${playableText}`}>{cell.text}</div>
          </button>
        </div>
      )
    else
      return (
        <div className={`cell ${playableText}`}>{cell.text}</div>
      )
  }

  async function choosePlugin(i: number) {
    const response = await fetch(`/plugin?i=${i}`)
    const json = await response.json();
    setState((prevState) => ({...prevState, cells: json["cells"], 
                    plugins: json["plugins"], 
                    name: json["name"],
                    footer:json["footer"],
                    numColStyle : json["numColStyle"],
                    currentPlayer : json["currentPlayer"],
                    gameOverMsg : json["gameOverMsg"],
                    showDropdown: false, 
                  }))
  }
  

  const createInstructions = () => {
    if (state.gameOverMsg) {
      return (
        <div id="game_over_message">{state.gameOverMsg}</div>
      )
    }
    else if (state.currentPlayer) {
      return (
        <div id="current_player_name">Current player is {state.currentPlayer}</div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }

  const createDropdown = () => {
    if (state.plugins.length === 0) {
      return (
        <span>No games loaded</span>
      )
    }
    else {
      return (
        <div>
          {state.plugins.map((plugin, index) => createPlugin(plugin.name, index))}
        </div>
      )
    }
  }

  const createPlugin = (name: string, index: number) => {
    return (
      <div key={index}>
        <button type="button" onClick={() => choosePlugin(index)}>{name}</button>
      </div>
    )
  }

  const toggleDropdown = () => {
    setState((prevState) => ({...prevState, showDropdown: !state.showDropdown}))
  }

  return (
    <div>
      <div id="game_name">{state.name}</div>

      {createInstructions()}

      <div id="board" style={{gridTemplateColumns: state.numColStyle.valueOf()}}>
        {state.cells.map((cell, i) => createCell(cell, i))}
      </div>

      <div id="footer">{state.footer}</div>

      <div id="bottombar">
        <button className="dropbtn" onClick={/* get the function, not call the function */toggleDropdown}>New Game</button>
        <div id="dropdown-content" className={state.showDropdown ? "show" : "hide"}>
          {createDropdown()}
        </div>
     </div>

    </div>
  )
}

export default Game
