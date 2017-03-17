import java.util.Random;

public class BattleshipsWithAI {
	


    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
    	
    	int games = 10;
    	int numberOfPlays = 0;
    	
        for(int i=0; i< games; i++){
	
	        Board board = new Board();
	        Player ai = new RandomAI(board);
	        //Player ai = new FirstHeuristicAI(board);
	        
	        board.putShip(ShipType.CRUISER, new Coordinate(Letter.A, 1), true);
	        board.putShip(ShipType.DEESTROYER, new Coordinate(Letter.C, 5), true);
	        board.putShip(ShipType.SUBMARINE, new Coordinate(Letter.D, 10), true);
	        board.putShip(ShipType.BATTLESHIP, new Coordinate(Letter.H, 2), false);
	        board.putShip(ShipType.AIRCRAFT, new Coordinate(Letter.B, 8), true);
	        
	        print(board);
	        ai.solveBoard();
	        print(board);
	        
	        numberOfPlays += ai.getNumberOfShots();
	        System.out.println("M�todo Utilizado: " + ai.getAIType());
	        System.out.println("Finalizado em: " + ai.getNumberOfShots() + " jogadas! \n"); 
        }
        
        System.out.println("Media de jogadas em " + games + " jogos: " + numberOfPlays/games);

    }

    private static void print(Board board) {
        Field[][] map = board.print();
        System.out.print("  ");
        for (int i = 1; i < 11; i++) {
            System.out.print(i+ " ");
        }
        System.out.println();
        Letter letter = Letter.A;
        for (Field[] row : map) {
            System.out.print(letter + " ");
            for (Field field : row) {
                System.out.print(field.getFlag() + " ");
            }
            System.out.println();
            if (letter != Letter.J) {
                letter = letter.next();
            }
        }
        System.out.println();
    }

}
