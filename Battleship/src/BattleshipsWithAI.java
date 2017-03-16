import java.util.Random;

public class BattleshipsWithAI {
	


    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
    	
    	int games = 1;
    	int numberOfPlays = 0;
    	
        for(int i=0; i< games; i++){
	
	        Board board = new Board();
	        Player ai = new RandomAI(board);
	        
	        board.putShip(ShipType.CRUISER, new Coordinate(Letter.A, 1), true);
	        board.putShip(ShipType.DEESTROYER, new Coordinate(Letter.C, 5), true);
	        
	        board.shoot(new Coordinate(Letter.A, 10));
	
	        ai.solveBoard();
	        print(board);
	        numberOfPlays += ai.getNumberOfShots();
	        System.out.println("Método Utilizado: " + ai.getAIType());
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
