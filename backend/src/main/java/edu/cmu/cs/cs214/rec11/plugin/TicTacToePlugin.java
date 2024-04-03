package edu.cmu.cs.cs214.rec11.plugin;

import edu.cmu.cs.cs214.rec11.framework.core.GameFramework;
import edu.cmu.cs.cs214.rec11.framework.core.GamePlugin;
import edu.cmu.cs.cs214.rec11.games.TicTacToe;

public class TicTacToePlugin implements GamePlugin<String> {
    private static final String GAME_NAME = "Tic Tac Toe";
    private static final String GAME_START_FOOTER = "New game start!";

    private GameFramework framework;
    private TicTacToe game;

    @Override
    public String getGameName() {
        return GAME_NAME;
    }

    @Override
    public int getGridWidth() {
        return TicTacToe.SIZE;
    }

    @Override
    public int getGridHeight() {
        return TicTacToe.SIZE;
    }

    @Override
    public void onRegister(GameFramework f) {
        framework = f;
    }

    @Override
    public void onNewGame() {
        game = new TicTacToe();
        TicTacToe.Player curPlayer;
        curPlayer = game.currentPlayer();
        framework.setFooterText(GAME_START_FOOTER + "Player " + curPlayer + "'s turn.");
    }

    @Override
    public void onNewMove() {
        TicTacToe.Player curPlayer;
        curPlayer = game.currentPlayer();
        framework.setFooterText("Player " + curPlayer + "'s turn.");
    }

    @Override
    public boolean isMoveValid(int x, int y) {
        return game.isValidPlay(x, y);
    }

    @Override
    public boolean isMoveOver() {
        return true;
    }

    @Override
    public void onMovePlayed(int x, int y) {
        framework.setSquare(x, y, game.currentPlayer().toString());
        game.play(x, y);
    }

    @Override
    public boolean isGameOver() {
        return game.isOver();
    }

    @Override
    public String getGameOverMessage() {
        TicTacToe.Player player = game.winner();
        if (player == null) {
            return "Tie!";
        }
        return "Winner is: Player " + player.toString();
    }

    @Override
    public void onGameClosed() {
        framework.setFooterText("Game over");
    }

    @Override
    public String currentPlayer() {
        return "Player " + game.currentPlayer().toString();
    }
}
