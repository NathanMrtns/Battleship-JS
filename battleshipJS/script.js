/*

Inspiration: http://www.datagenetics.com/blog/december32011/

*/

(function(document) {
    'use strict';

    var SHIP = 0,
        MISS = 1,
        HIT = 2,
        isHunting = true,
        hitsMade,
        hitsToWin,
        ships = [5, 4, 3, 3, 2],
        // TODO: look into Int8Array on these big matrices for performance
        positions = [],
        shipPositions = {},
        triedPos = [],
        probabilities = [],
        hitsSkewProbabilities = true,
        skewFactor = 2,
        boardSize = 10,
        classMapping = ['ship', 'miss', 'hit'],
        board,
        resultMsg,
        volleyButton,
        checkMean = false,
        BLIND = 3,
        PROB = 4,
        HUNT = 5,
        iaType = PROB;

    // run immediately
    initialize();

    function initialize() {
        board = document.getElementById('board');
        resultMsg = document.getElementById('result');
        volleyButton = document.getElementById('volley');
        volleyButton.onclick = (checkMean ? runcheckMean : beginVolley);
        setupBoard();
    }

    function setupBoard() {
        // initialize positions matrix
        for (var y = 0; y < boardSize; y++) {
            positions[y] = [];
            for (var x = 0; x < boardSize; x++) {
                positions[y][x] = null;
            }
        }

        triedPos = [];

        // determine hits to win given the set of ships
        hitsMade = hitsToWin = 0;
        for (var i = 0, l = ships.length; i < l; i++) {
            hitsToWin += ships[i];
        }

        distributeShips();
        recalculateProbabilities();
        redrawBoard(false);
    }

    var carrier;
    var carrierHits = 5;
    var isCarrierAlive = true;
    var battleship;
    var battleShipHits = 4;
    var isBattleshipAlive = true;
    var cruiser;
    var cruiserHits = 3;
    var isCruiserAlive = true;
    var submarine;
    var submarineHits = 3;
    var isSubmarineAlive = true;
    var destroyer;
    var destroyerHits = 2;
    var isDestroyerAlive = true;

    function distributeShips() {
        var pos, shipPlaced, vertical;
        if(iaType == PROB || iaType == BLIND){
          for (var i = 0, l = ships.length; i < l; i++) {
              shipPlaced = false;
              vertical = randomBoolean();
              while (!shipPlaced) {
                  var shipPositions = [];
                  pos = getRandomPosition();
                  shipPlaced = placeShip(pos, ships[i], vertical);
              }
          }
        }else{
          placeShip([0,1], 5, true); // [0,1], [0,2], [0,3] , [0,4], [0,5]
          placeShip([9,5], 4, true); // [9,5], [9,6], [9,7], [9,8]
          placeShip([2,8], 3, false); // [2,8], [3,8], [4,8]
          placeShip([5,2], 3, false); //[5,2], [6,2], [7,2]
          placeShip([3,5], 2, true); //[3,5], [3,6]

          carrier = ["[0,1]", "[0,2]", "[0,3]" , "[0,4]", "[0,5]"];
          battleship = ["[9,5]", "[9,6]", "[9,7]", "[9,8]"];
          cruiser = ["[2,8]", "[3,8]", "[4,8]"];
          submarine = ["[5,2]", "[6,2]", "[7,2]"];
          destroyer = ["[3,5]", "[3,6]"];
        }
    }


    function placeShip(pos, shipSize, vertical) {
        // "pos" is ship origin
        var x = pos[0],
            y = pos[1],
            z = (vertical ? y : x),
            end = z + shipSize - 1;

        if (shipCanOccupyPosition(SHIP, pos, shipSize, vertical)) {
            var shipAttribute;
            if (shipPositions["ship-" + shipSize] != undefined) {
                shipAttribute = "ship-" + shipSize + "-2";
            } else {
                shipAttribute = "ship-" + shipSize;
            }

            var currentPos = [];
            for (var i = z; i <= end; i++) {
                if (vertical) {
                    positions[x][i] = SHIP;
                    currentPos.push("[" + x + "," + i + "]");
                    if (shipPositions[shipAttribute] == undefined) {
                        shipPositions[shipAttribute] = "";
                    } else {
                        shipPositions[shipAttribute] = (currentPos.toString());
                    }
                } else {
                    positions[i][y] = SHIP;
                    currentPos.push("[" + x + "," + i + "]");
                    if (shipPositions[shipAttribute] == undefined) {
                        shipPositions[shipAttribute] = "";
                    } else {
                        shipPositions[shipAttribute] = (currentPos.toString());
                    }
                }
            }
            return true;
        }
        return false;
    }

    function redrawBoard(displayProbability) {
        if (checkMean) return; // no need to draw when testing thousands of boards
        var boardHTML = '';
        for (var y = 0; y < boardSize; y++) {
            boardHTML += '<tr>';
            for (var x = 0; x < boardSize; x++) {
                var thisPos = positions[x][y];
                boardHTML += '<td class="';
                if (thisPos !== null) boardHTML += classMapping[thisPos];
                boardHTML += '">';
                if (displayProbability && thisPos != MISS && thisPos !== HIT) boardHTML += probabilities[x][y];
                boardHTML += '</td>';
            }
            boardHTML += '</tr>';
        }
        board.innerHTML = boardHTML;
    }

    function recalculateProbabilities() {
        var hits = [];

        // reset probabilities
        for (var y = 0; y < boardSize; y++) {
            probabilities[y] = [];
            for (var x = 0; x < boardSize; x++) {
                probabilities[y][x] = 0;
                // we remember hits as we find them for skewing
                if (hitsSkewProbabilities && positions[x][y] === HIT) {
                    hits.push([x, y]);
                }
            }
        }

        // calculate probabilities for each type of ship
        for (var i = 0, l = ships.length; i < l; i++) {
            for (var y = 0; y < boardSize; y++) {
                for (var x = 0; x < boardSize; x++) {
                    // horizontal check
                    if (shipCanOccupyPosition(MISS, [x, y], ships[i], false)) {
                        increaseProbability([x, y], ships[i], false);
                    }
                    // vertical check
                    if (shipCanOccupyPosition(MISS, [x, y], ships[i], true)) {
                        increaseProbability([x, y], ships[i], true);
                    }
                }
            }
        }

        // skew probabilities for positions adjacent to hits
        if (hitsSkewProbabilities) {
            skewProbabilityAroundHits(hits);
        }
    }

    function increaseProbability(pos, shipSize, vertical) {
        // "pos" is ship origin
        var x = pos[0],
            y = pos[1],
            z = (vertical ? y : x),
            end = z + shipSize - 1;

        for (var i = z; i <= end; i++) {
            if (vertical) probabilities[x][i]++;
            else probabilities[i][y]++;
        }
    }

    function skewProbabilityAroundHits(toSkew) {
        var uniques = [];

        // add adjacent positions to the positions to be skewed
        for (var i = 0, l = toSkew.length; i < l; i++) {
            toSkew = toSkew.concat(getAdjacentPositions(toSkew[i]));
        }

        // store uniques to avoid skewing positions multiple times
        // TODO: do A/B testing to see if doing this with strings is efficient
        for (var i = 0, l = toSkew.length; i < l; i++) {
            var uniquesStr = uniques.join('|').toString();
            if (uniquesStr.indexOf(toSkew[i].toString()) === -1) {
                uniques.push(toSkew[i]);

                // skew probability
                var x = toSkew[i][0],
                    y = toSkew[i][1];
                probabilities[x][y] *= skewFactor;
            }
        }
    }

    function getAdjacentPositions(pos) {
        var x = pos[0],
            y = pos[1],
            adj = [];

        if (y + 1 < boardSize) adj.push([x, y + 1]);
        if (y - 1 >= 0) adj.push([x, y - 1]);
        if (x + 1 < boardSize) adj.push([x + 1, y]);
        if (x - 1 >= 0) adj.push([x - 1, y]);

        return adj;
    }

    function shipCanOccupyPosition(criteriaForRejection, pos, shipSize, vertical) { // TODO: criteriaForRejection is an awkward concept, improve
        // "pos" is ship origin
        var x = pos[0],
            y = pos[1],
            z = (vertical ? y : x),
            end = z + shipSize - 1;

        // board border is too close
        if (end > boardSize - 1) return false;

        // check if there's an obstacle
        for (var i = z; i <= end; i++) {
            var thisPos = (vertical ? positions[x][i] : positions[i][y]);
            if (thisPos === criteriaForRejection) return false;
        }

        return true;
    }

    function beginVolley() {
        var heuristic = "";
        if (hitsMade > 0) setupBoard();
        resultMsg.innerHTML = '';
        volleyButton.disabled = true;
        var moves = 0,
            volley = setInterval(function() {
                if(iaType == PROB){
                  fireAtBestPosition();
                  moves++;
                  heuristic = "using  <b>PROBABILISTIC</b>"
                } else if(iaType == BLIND){
                  if (fireAtRandomPosition()) moves++;
                  heuristic = "using  <b>BLIND SEARCH</b>"
                } else if(iaType == HUNT){
                  if(fireAndTarget()) moves++;
                  heuristic = "using  <b>HUNT AND TARGET</b>"
                }
                if (hitsMade === hitsToWin) {
                    resultMsg.innerHTML = 'All ships sunk in <b>' + moves + ' moves</b>,' + heuristic;
                    clearInterval(volley);
                    clearHuntVars();
                    volleyButton.disabled = false;
                }
            }, 500);
    }

    function fireAtBestPosition() {
        var pos = getBestUnplayedPosition(),
            x = pos[0],
            y = pos[1];

        if (positions[x][y] === SHIP) {
            positions[x][y] = HIT;
            hitsMade++;
        } else positions[x][y] = MISS;

        recalculateProbabilities();
        redrawBoard(false);
    }

    function fireAtRandomPosition() {
        var randX = Math.floor(Math.random() * 10);
        var randY = Math.floor(Math.random() * 10);
        var pos = "[" + randX + "," + randY + "]";
        if (triedPos.indexOf(pos) == -1) {
            triedPos.push(pos);
            if (positions[randX][randY] === SHIP) {
                positions[randX][randY] = HIT;
                hitsMade++;
            } else positions[randX][randY] = MISS;

            recalculateProbabilities();
            redrawBoard(false);
            return true;
        } else {
            return false;
        }
    }

    function decreaseShipHealth(position){
      if(carrier.indexOf(position)!= -1){
        carrierHits--;
        if(carrierHits==0){
          isCarrierAlive = false
          return true;
        }
      }else if(battleship.indexOf(position) != -1){
        battleShipHits--;
        if(battleShipHits==0){
          isBattleshipAlive = false
          return true;
        }
      }else if(cruiser.indexOf(position) != -1){
        cruiserHits--;
        if(cruiserHits == 0){
           isCruiserAlive = false;
           return true;
        }
      }else if(submarine.indexOf(position) != -1){
        submarineHits--;
        if(submarineHits == 0){
          isSubmarineAlive = false;
          return true;
        }
      }else if(destroyer.indexOf(position)!= -1){
        destroyerHits--;
        if(destroyerHits == 0 ){
          isSubmarineAlive = false;
          return true;
        }
      }
      return false; //ship did not sink
    }

    var firstShipHit;
    var lastHitStatus = MISS;
    var direction = "up";
    var lastHit;

    function fireAndTarget() {
        var x, y, pos, randomPos;
        var validMove = false;

        if (!isHunting && direction == "up") {
            if(lastHit[1]-1 < 0){
              direction = "right"
              return false;
            }
            pos = lastHit,
            x = pos[0];
            y = pos[1] - 1; //fireUp
            if(triedPos.indexOf("["+x+","+y+"]") != -1) validMove=false;
            else {
              triedPos.push("["+x+","+y+"]");
              validMove = true;
            }
        } else if(!isHunting && direction == "right") {
            if(lastHit[0]+1 > 9){
              direction = "down"
              return false;
            }
            pos = lastHit;
            x = pos[0]+1;
            y = pos[1]; //fireRight
            if(triedPos.indexOf("["+x+","+y+"]") != -1) validMove=false;
            else {
              triedPos.push("["+x+","+y+"]");
              validMove = true;
            }
        } else if(!isHunting && direction == "down"){
            if(lastHit[1]+1 > 9){
              direction = "left"
              return false;
            }
            pos = lastHit;
            x = pos[0];
            y = pos[1]+1; //fireDown
            if(triedPos.indexOf("["+x+","+y+"]") != -1) validMove=false;
            else {
              triedPos.push("["+x+","+y+"]");
              validMove = true;
            }
        } else if(!isHunting && direction == "left"){
            if(lastHit[0]-1 < 0){
              isHunting = true
              return false;
            }
            pos = lastHit;
            x = pos[0]-1;
            y = pos[1]; //fireLeft
            if(triedPos.indexOf("["+x+","+y+"]") != -1) validMove=false;
            else {
              triedPos.push("["+x+","+y+"]");
              validMove = true;
            }
        }else{
            pos = getRandomPosition();
            randomPos = "[" + pos[0] + "," + pos[1] + "]";
            if (triedPos.indexOf(randomPos) != -1) {
              return false;
            }else{
              triedPos.push(randomPos);
              validMove = true;
              x = pos[0];
              y = pos[1];
            }
        }

        if(positions[x][y]===HIT){
          isHunting = true
          return false;
        }

        if (positions[x][y] === SHIP) {
            positions[x][y] = HIT;
            lastHit = [x, y];

            if (isHunting) {
                firstShipHit = [x, y];
                direction = "up";
            }

            if(decreaseShipHealth("["+x+","+y+"]")){
              isHunting = true;
              direction = "up";
            }else{
              isHunting = false;
            }

            hitsMade++;
        } else {
          if(positions[x][y] = MISS){
            positions[x][y] = MISS
            lastHitStatus = MISS
            if(firstShipHit != undefined && lastHitStatus == MISS) changeDirection();
            lastHit = firstShipHit;
          }
        }

        redrawBoard(false);
        return validMove;
    }

    function clearHuntVars(){
      firstShipHit = [];
      lastHitStatus = MISS;
      lastHit = [];
      direction = "up";
      triedPos = [];
      isHunting = true;
    }

    function changeDirection(){
      if(direction == "up"){
        direction = "right";
      }else if(direction == "right"){
        direction = "down";
      }else if(direction == "down"){
        direction = "left";
      }else{
        isHunting = true;
        direction = "up";
      }
    }

    function getBestUnplayedPosition() {
        var bestProb = 0,
            bestPos;

        // so far there is no tie-breaker -- first position
        // with highest probability on board is returned
        for (var y = 0; y < boardSize; y++) {
            for (var x = 0; x < boardSize; x++) {
                if (!positions[x][y] && probabilities[x][y] > bestProb) {
                    bestProb = probabilities[x][y];
                    bestPos = [x, y];
                }
            }
        }

        return bestPos;
    }

    function getRandomPosition() {
        var x = Math.floor(Math.random() * 10),
            y = Math.floor(Math.random() * 10);

        return [x, y];
    }

    function randomBoolean() {
        return (Math.round(Math.random()) == 1);
    }

    function runcheckMean() {
        var heuristic = "";
        var elapsed, sum = 0,
            runs = (hitsSkewProbabilities ? 50 : 100);

        elapsed = (new Date()).getTime();

        for (var i = 0; i < runs; i++) {
            var moves = 0;
            setupBoard();
            while (hitsMade < hitsToWin) {
              if(iaType == PROB){
                fireAtBestPosition();
                moves++;
                heuristic = "using  <b>PROBABILISTIC</b>"
              } else if(iaType == BLIND){
                if (fireAtRandomPosition()) moves++;
                heuristic = "using  <b>BLIND SEARCH</b>"
              } else if(iaType == HUNT){
                if(fireAndTarget()) moves++;
                heuristic = "using  <b>HUNT AND TARGET</b>"
              }
            }
            sum += moves;
        }

        elapsed = (new Date()).getTime() - elapsed;
        console.log('Test duration: ' + elapsed + 'ms ' + heuristic );

        resultMsg.innerHTML = 'Average moves: <b>' + (sum / runs) + "</b> " + heuristic;
    }

}(document));
