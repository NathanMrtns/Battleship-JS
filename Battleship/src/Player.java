
public abstract class Player {
	
	protected Board board;
	
	public Player(Board board) {
		this.board = board;
	}
	
	public int getNumberOfShots() {
		return this.board.getShots().size();
	}
	
	public abstract void solveBoard();
	
	public abstract String getAIType();
	

}
