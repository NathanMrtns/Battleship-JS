import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class Ship {

    private final ShipType shipType;

    private final Map<Coordinate, Boolean> body;

    public Ship(ShipType shipType, Coordinate coordinate, boolean vertical) {
        this.shipType = shipType;
        Coordinate calculatedCoordinate = coordinate;
        this.body = new HashMap<>(shipType.getSize());
        for (int n = 0; n < shipType.getSize(); n++) {
            this.body.put(calculatedCoordinate, false);
            if (vertical) {
                calculatedCoordinate = calculatedCoordinate.findNextVertical();
            } else {
                calculatedCoordinate = calculatedCoordinate.findNextHorizontal();
            }
        }
    }

    public ShipType getShipType() {
        return shipType;
    }

    public boolean isAlive() {
        return this.body.containsValue(false);
    }

    public boolean matchesCoordinate(Coordinate coordinate) {
        return this.body.containsKey(coordinate);
    }

    public boolean shot(Coordinate coordinate) {
        if (this.body.containsKey(coordinate)) {
            this.body.put(coordinate, Boolean.TRUE);
            return true;
        }
        return false;
    }

    public Map<Coordinate, Boolean> getBody() {
        return Collections.unmodifiableMap(body);
    }
}
