
public enum ShipType {

    CRUISER(2),
    SUBMARINE(3),
    DEESTROYER(4),
    BATTLESHIP(5),
    AIRCRAFT(6);

    private final int size;

    private ShipType(int hp) {
        this.size = hp;
    }

    public int getSize() {
        return size;
    }

}
