import React, { useState, useEffect } from 'react';
import './Game.css'; // import the css file to enable your styles.
import { GameState, Cell, Plugin } from './gamecore';

export default function Game() {
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
  


  const toggleDropdown = () => {
    setState((prevState) => ({...prevState, showDropdown: !state.showDropdown}))
  }

  return (
    <div>
      <div id="game_name">{state.name}</div>

      <Instructions gameOverMsg={state.gameOverMsg} currentPlayer={state.currentPlayer} />

      <div id="board" style={{gridTemplateColumns: state.numColStyle.valueOf()}}>
        {state.cells.map((cell, i) => <DisplayCell cell={cell} index={i} play={play} />)}
      </div>

      <div id="footer">{state.footer}</div>

      <div id="bottombar">
        <button className="dropbtn" onClick={/* get the function, not call the function */toggleDropdown}>New Game</button>
        <div id="dropdown-content" className={state.showDropdown ? "show" : "hide"}>
          <Dropdown plugins={state.plugins} choosePlugin={choosePlugin} />
        </div>
     </div>

    </div>
  )
}


function DisplayCell({cell, index, play}: { cell: Cell, index: number, play: (x: number, y: number) => void }) {
  const playableText = cell.playable ? 'playable' : '';
  if (cell.playable)
    /**
     * key is used for React when given a list of items. It
     * helps React to keep track of the list items and decide
     * which list item need to be updated.
     * @see https://reactjs.org/docs/lists-and-keys.html#keys
     */
    return (
        <div className={`cell ${playableText}`} onClick={() => play(cell.x, cell.y)}>{cell.text}</div>
    )
  else
    return (
      <div className={`cell ${playableText}`}>{cell.text}</div>
    )
}


function Instructions({gameOverMsg, currentPlayer}: { gameOverMsg: string, currentPlayer: string }) {
  if (gameOverMsg) {
    return (
      <div id="game_over_message">{gameOverMsg}</div>
    )
  }
  else if (currentPlayer) {
    return (
      <div id="current_player_name">Current player is {currentPlayer}</div>
    )
  }
  else {
    return (
      <div></div>
    )
  }
}

function Dropdown({plugins, choosePlugin}:{plugins: Plugin[], choosePlugin: (i: number) => void}) {
  if (plugins.length === 0) {
    return (
      <span>No games loaded</span>
    )
  }
  else {
    return (
      <div>
        {plugins.map((plugin, index) => <PluginBtn name={plugin.name} index={index} choosePlugin={choosePlugin} />)}
      </div>
    )
  }
}

function PluginBtn({name, index, choosePlugin}: {name: string, index: number, choosePlugin: (i: number) => void}) {
  return (
    <div key={index}>
      <button type="button" onClick={() => choosePlugin(index)}>{name}</button>
    </div>
  )
}

