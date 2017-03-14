public class Coordinate {

    private final Letter letter;

    private final int digit;

    public Coordinate(Letter letter, int digit) {
        this.letter = letter;
        this.digit = digit;
    }

    public Letter getLetter() {
        return letter;
    }

    public int getDigit() {
        return digit;
    }

    public Coordinate findNextVertical() {
        return new Coordinate(letter.next(), digit);
    }

    public Coordinate findNextHorizontal() {
        return new Coordinate(letter, digit + 1);
    }

    @Override
    public int hashCode() {
        String hash = letter.toString() + digit;
        return hash.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Coordinate other = (Coordinate) obj;
        if (this.letter != other.letter) {
            return false;
        }
        return this.digit == other.digit;
    }

    @Override
    public String toString() {
        return letter + String.valueOf(digit);
    }
    

}
