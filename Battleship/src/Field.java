
public enum Field {

    EMPTY('-'),
    MISS('M'),
    HIT('H'),
    SHIP('S'),
    SUNK('X');

    private final char flag;

    private Field(char flag) {
        this.flag = flag;
    }

    public char getFlag() {
        return flag;
    }

}
