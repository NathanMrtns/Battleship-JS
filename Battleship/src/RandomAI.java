import java.util.Random;

public class RandomAI extends Player {

	public RandomAI(Board board) {
		super(board);
	}

	@Override
	public void solveBoard() {
		Random randLetter = new Random();
		Random randNumber = new Random();

		// Randomly shooting in the board
		while (this.board.getNShips() > 0) {
			Letter coordY = Letter.valueOf(randLetter.nextInt(10));
			int coordX = randNumber.nextInt(10) + 1;
			Coordinate c = new Coordinate(coordY, coordX);
			if (!board.getShots().contains(c)) {
				board.shoot(c);
			}
		}
	}

	@Override
	public String getAIType() {
		return "Busca Cega";
	}
}
