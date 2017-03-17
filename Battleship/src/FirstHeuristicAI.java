import java.util.Random;

public class FirstHeuristicAI extends Player {

	ShootResult shotResult;

	public FirstHeuristicAI(Board board) {
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
				shotResult = board.shoot(c);

				// Acertou algum navio
				if (shotResult.equals(ShootResult.HIT)) {

					// Posicao que o navio foi acertado
					Coordinate lastHit = c;
					Coordinate cima = c.findPrevVertical();
					Coordinate direita = c.findPrevHorizontal();
					Coordinate baixo = c.findNextVertical();
					Coordinate esquerda = c.findPrevHorizontal();
					
					shotResult = board.shoot(cima);

					// Atira na posicao acima do acerto
					if (shotResult.equals(ShootResult.HIT)) {

						cima = cima.findPrevVertical();
						// Continua atirando pra cima
						while (true) {

							shotResult = board.shoot(cima);

							// Verifica se afundou o navio
							if (shotResult.equals(ShootResult.SUNK)) {
								break;
							} else {

								if (shotResult.equals(ShootResult.HIT)) {
									cima = cima.findPrevVertical();
								} else {

									// Resto do navio está em baixo
									while (true) {

										// Atira pra baixo
										shotResult = board.shoot(baixo);

										if (shotResult.equals(ShootResult.SUNK)) {
											break;
										} else {

											baixo = baixo.findNextVertical();
										}
									}

									break;
								}
							}
						}
					} else {
						// Atira na direita
						shotResult = board.shoot(direita);

						if (shotResult.equals(ShootResult.HIT)) {

							direita = direita.findNextHorizontal();

							// Continua a atirar na direita
							while (true) {

								shotResult = board.shoot(direita);

								// Verifica se afundou o navio
								if (shotResult.equals(ShootResult.SUNK)) {
									break;
								} else {

									if (shotResult.equals(ShootResult.HIT)) {
										direita = direita.findNextHorizontal();
									} else {

										// Resto do navio está na esquerda
										while (true) {

											// Atira pra esquerda
											shotResult = board.shoot(esquerda);

											if (shotResult.equals(ShootResult.SUNK)) {
												break;
											} else {

												esquerda = esquerda.findPrevHorizontal();
											}
										}

										break;
									}
								}
							}
						} else {

							// Atira pra baixo
							shotResult = board.shoot(baixo);

							if (shotResult.equals(ShootResult.HIT)) {

								baixo = baixo.findNextVertical();

								// Continua a atirar pra baixo
								while (true) {

									shotResult = board.shoot(baixo);

									if (shotResult.equals(ShootResult.SUNK)) {
										break;
									} else {

										if (shotResult.equals(ShootResult.HIT)) {
											baixo = baixo.findNextVertical();
										} else {

											// Resto do navio está em cima
											while (true) {

												// Atira pra cima
												shotResult = board.shoot(cima);

												if (shotResult.equals(ShootResult.SUNK)) {
													break;
												} else {

													cima = cima.findPrevVertical();
												}
											}

											break;
										}
									}
								}
							} else {

								// Atira pra esquerda
								shotResult = board.shoot(esquerda);

								if (shotResult.equals(ShootResult.HIT)) {

									esquerda = esquerda.findPrevHorizontal();

									// Continua a atirar pra esquerda
									while (true) {

										shotResult = board.shoot(esquerda);

										if (shotResult.equals(ShootResult.SUNK)) {
											break;
										} else {

											if (shotResult.equals(ShootResult.HIT)) {
												esquerda = esquerda.findPrevHorizontal();
											} else {

												// Resto do navio está na
												// direita
												while (true) {

													// Atira pra direita
													shotResult = board.shoot(direita);

													if (shotResult.equals(ShootResult.SUNK)) {
														break;
													} else {

														direita = direita.findNextHorizontal();
													}
												}
												break;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	@Override
	public String getAIType() {
		return "Heurística 01";
	}
}
