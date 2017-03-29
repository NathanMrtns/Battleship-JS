import java.util.ArrayList;
import java.util.Random;

public class ProbabilityAI extends Player{
	
	ShootResult shotResult;
	ArrayList<Integer> extantShipLengths;
	int[][] probabilities = new int[10][10];

    public ProbabilityAI(Board board){
    	super(board);
    	extantShipLengths = board.getBoardShipSizes(); //gets all the ship sizes present on the board
    }

    @Override
    public void solveBoard() {
    	initialSetUp();
    	Coordinate foundShip = hunt();
    	
    }
    
	@Override
	public String getAIType() {
		return "Probabilistic Heuristic";
	}
	
	public Coordinate hunt() {
		Random randLetter = new Random();
		Random randNumber = new Random();

		// Randomly shooting in the board
		while (this.board.getNShips() > 0) {
			Letter coordY = Letter.valueOf(randLetter.nextInt(10));
			int coordX = randNumber.nextInt(10) + 1;
			Coordinate c = new Coordinate(coordY, coordX);
			if (!board.getShots().contains(c)) {
				shotResult = board.shoot(c);

				// Found a ship
				if (shotResult.equals(ShootResult.HIT)) {
					return c;
				}
			}
		}
		return null;
	}

	public void initialSetUp() {
		for(int i = 0; i < this.probabilities.length; i++) {
			for(int j = 0; j < this.probabilities.length; j++) {
				this.probabilities[i][j] = 0;
			}
		}
		
		int currentLength;
		for(int i = 0; i < this.probabilities.length; i++) {
			for(int j = 0; j < this.probabilities.length; j++) {
				for(int k = 0; k < this.board.getNShips(); k++) {
					currentLength = this.board.getBoardShipSizes().get(k);
					
					//horizontal
					if((j+currentLength-1) < (10-1)) {
						for(int l = 0; l < currentLength; l++) {
							this.probabilities[i][j+l]++;
						}
					}
					
					//vertical
					if((i+currentLength-1) < (10-1)) {
						for(int l = 0; l < currentLength; l++) {
							int var = i+l;
							this.probabilities[i+l][j]++;
						}
					}
				}
			}
		}
		printProb();
	}
	
	public void printProb() {
		for(int i = 0; i < this.probabilities.length; i++) {
			for(int j = 0; j < this.probabilities.length; j++) {
				System.out.print(probabilities[i][j] + " ");
			}
			System.out.println();
		}
	}

}
