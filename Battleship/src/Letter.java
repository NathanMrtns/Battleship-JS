public enum Letter {

	A(0), B(1), C(2), D(3), E(4), F(5), G(6), H(7), I(8), J(9), X(12);

	private final int index;

	private Letter(int index) {
		this.index = index;
	}

	public int getIndex() {
		return index;
	}

	public static Letter valueOf(int value) {
		for (Letter valueEnum : Letter.values()) {
			if (valueEnum.getIndex() == value) {
				return valueEnum;
			}
		}
		throw new IllegalArgumentException(String.format("There is not Letter for value <%s>", value));
	}

	public Letter next() {
		int pos = this.getIndex() + 1;
		if (pos > 9) {
			return Letter.valueOf(12);
    	} else {
    		return Letter.valueOf(pos);
    	}
		
	}

	public Letter prev() {
		int pos = this.getIndex() - 1;
		if (pos < 0) {
			return Letter.valueOf(12);
    	} else {
    		return Letter.valueOf(pos);
    	}
	}
}
