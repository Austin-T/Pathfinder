class Pathfinder {
    constructor(height, width, boardDiv, nodesVisited, pathwayCost) {
        // This function creates an instance of the Pathfinder object.
        // Parameters:
        // height - an integer representing the amount of rows in the board.
        // width - an integer representing the amount of columns in the board.
        // boardDiv - a div object to display the pathfinder within.
        // Output: None.

        this.height = height;   // the amount of row in the board
        this.width = width;     // the amount of columns in the board

        this.nodesVisited = nodesVisited; // a div element where the number of nodes visited should be modified
        this.pathwayCost = pathwayCost; // a div element where the pathway cost should be modified

        this.boardD = boardDiv; // a div element representing the board
        this.boardL = [];       // an array representing the board

        this.rowWidth = "100%"; // the width of the rows inside of the board div
        this.rowHeight = String(100 / this.height) + "%"; // the total percent of the div height occupied by one row
        this.rowDisplay = "flex"; // the display style of a row in the board

        this.squareWidth = String(100 / this.width) + "%"; // the total percent of the div width occupied by one square
        this.squareHeight = "100%"; // the total percent of the row height occupied by a square

        this.mousedown = false;     // indicates if the mouse is currently pressed down
        this.currentPressedSquare = null;   // indicates the status of the currently pressed square

        this.algorithm = null;
        this.algoType = "wall"; // indicates wether the current selected algoritm is for walls or weights

        this.start = null;  // assigned to the square which is the start
        this.target = null; // asigned to the square which is the target

        this.computing = false; // a true or false boolean indicating if there is an computation in progress
        
        this.squaresToAnimate = []; // a list of square objects to animate
        this.delayTime = 20; // the amount of milliseconds between the animation of each node

        this.weightValue = 5; // The weighted cost of travelling through a weighted square on the grid

        this.animating = false; // indecates wether nodes should be aniated in sequence or not at all
    }
    initialize() {
        // This function initializes the pithfinder object: a grid is created with
        // numerous nodes, event listeners are created for each node, and then a start
        // and target square are set in their defualt positions.
        // Parameters: None.
        // Ouptut: None.

        this.createGrid();
        this.addEventListeners();
        this.setDefaultSquares();
    }
    createGrid() {
        // This function is responsible for creating an html grid which represents the
        // pathfinder. A secondary grid is also created as a list, which stores the properties
        // and div of every square in the board. This function should be called as a subproces
        // of initilaize().
        // Parameters: None.
        // Output: None.

        // For each row in the board
        for (let i = 0; i < this.height; i++) {
            // create a new row
            let newRowD = document.createElement("div");
            let newRowL = [];

            // style the row
            newRowD.style.width = this.rowWidth;
            newRowD.style.height = this.rowHeight;
            newRowD.style.display = this.rowDisplay;

            // append the row to the board
            this.boardD.appendChild(newRowD);
            this.boardL.push(newRowL);

            // For each column in the board
            for (let j = 0; j < this.width; j++) {
                // create one square
                let newSquareD = document.createElement("div");
                let newSquareL = {
                    x: j,
                    y: i,
                    div: newSquareD,
                    start: false,
                    target: false,
                    path: false,
                    wall: false,
                    weight: false,
                    visited: false,
                    previous: null,
                    distance: Infinity,
                    heuristic: Infinity
                }

                // style the square
                newSquareD.className = "unvisited";
                newSquareD.style.width = this.squareWidth;
                newSquareD.style.height = this.squareHeight;

                // append the square to the row
                newRowD.appendChild(newSquareD);
                newRowL.push(newSquareL);
            }
        }
    }
    addEventListeners() {
        // This function creates an event listener for every div which exists in 
        // the pathfinder board. This function should only be called after this.createGrid()
        // has been executed. This function is a subprocess of this.initialize()
        // Parameters: None.
        // Output: None.

        // For each row in the board
        for (let i = 0; i < this.height; i++) {
            // For each column in the board
            for (let j = 0; j < this.width; j++) {
                let square = this.boardL[i][j];
                // create event listeners for every square in the board
                square.div.onmousedown = (e) => {
                    // A mouse down event has occured while the cursor is ontop of the given
                    // square
                    if (this.computing) return;
                    e.preventDefault();
                    this.mousedown = true;
                    if (square.start) {
                        this.currentPressedSquare = "start";
                    } else if (square.target) {
                        this.currentPressedSquare = "target";
                    } else {
                        this.currentPressedSquare = "normal";
                        this.changeNormalSquare(square);
                    }
                }
                square.div.onmouseenter = () => {
                    // The cursor has entered the given square and it may be either "mousedown"
                    // or "mouseup" as denoted by 'this.mousedown'
                    if (this.computing) return;
                    if (this.mousedown && this.currentPressedSquare == "normal") {
                        this.changeNormalSquare(square);
                    } else if (this.mousedown) {
                        this.changeSpecialSquare(square);
                        // add more code here for recomputation of the pathfinder ----------------------------------------------
                    }
                }
                square.div.onmouseleave = () => {
                    // The cursor has entered the given square and it may be either "mousedown"
                    // or "mouseup" as denoted by 'this.mousedown'
                    //if (this.mousedown && board.currentPressedSquare != "normal") {
                    //    this.changeSpecialSquare(square);
                    //}
                }
                square.div.onmouseup = () => {
                    // A mouse up event has occured while the cursor is ontop of the given
                    // square
                    if (this.computing) return;
                    this.mousedown = false;
                    if (this.currentPressedSquare == "start") {
                        this.start = square;
                    } else if (this.currentPressedSquare == "target") {
                        this.target = square;
                    }
                    this.currentPressedSquare = "normal";
                }
            }
        }
    }
    setDefaultSquares() {
        // This function sets a start-sqaure and target-sqaure in 
        // default positions on the board. The function should be called
        // as a subprocess of initialize after this.createGrid() and 
        // this.addEventListeners.
        // Parameters: None.
        // Output: None.

        this.boardL[10][10].div.className = "start";
        this.boardL[10][10].start = true;
        this.start = this.boardL[10][10];
        this.boardL[10][40].div.className = "target";
        this.boardL[10][40].target = true;
        this.target = this.boardL[10][40];
    }
    changeNormalSquare(square){
        // This function converts the wall or weight property of a given square to
        // the "unvisited" property, and vice versa. This process is called by
        // event listeners.
        // Parameters:
        // square - a square object
        // Outputs: None.

        if (square.start || square.target) return;

        if (this.algoType == "wall"){
            if (square.wall) {
                // swap wall-square for empty-square
                square.wall = false;
                square.div.className = "unvisited";
            } else {
                // swap empty-square for wall-square
                square.wall = true;
                square.div.className = "wall";
            }
        } else {
            if (square.weight) {
                // swap weight square for empty-square
                square.weight = false;
                square.div.className = "unvisited";
            } else {
                // swap empty-square for weight-square
                square.weight = true;
                square.div.className = "weight";
            }
        }
    }
    changeSpecialSquare(square){
        // This function adjusts the position of special squares "start" and "target".
        // The function is called by event listeners.
        // Parameters:
        // square - a square object
        // Output: None.
        debugger;
        if (this.currentPressedSquare == "start") {
            // We are adjusting the position of the starting sqaure.
            // The start node will replace an existing squares other than the target
            if (square.target || square.wall || square.weight) return;

            // reset the old square
            this.start.start = false;
            this.start.div.className = "unvisited";

            // update the new square
            square.start = true;
            square.div.className = "start";
            this.start = square;

            // If the currently pressed square is "visited" this inidicates that it has just been
            // discovered by a pathfinding algorithm. We would like to do an automatic recomputation
            // of the algorithm in this case with the start square in the new position
            if (this.target.visited) {
                this.runSearch(false);
            }
            

        } else {
            // we are adjusting the position of the target node
            // The start node will replace an existing squares other than the target
            if (square.start || square.wall || square.weight) return;

            // reset the old square
            this.target.target = false;
            this.target.div.className = "unvisited";
            

            // update the new square
            square.target = true;
            square.div.className = "target";
            this.target = square;

            // If the currently pressed square is "visited" this inidicates that it has just been
            // discovered by a pathfinding algorithm. We would like to do an automatic recomputation
            // of the algorithm in this case with the target square in the new position
            if (this.start.visited) {
                this.runSearch(false);
            }
        }
    }
    clearBoard() {
        // This function finds every square in the board which is either a wall,
        // visited, or a path, and resets that square to unvisited
        // Parameters: None.
        // Output: None.

        // reset the nodes-visited and pathway-cost
        this.nodesVisited.innerHTML = "0";
        this.pathwayCost.innerHTML = "0";

        // For each row in the board
        for (let i = 0; i < this.height; i++) {
            // For each column in the board
            for (let j = 0; j < this.width; j++) {
                let square = this.boardL[i][j];
                // reset every board with a wall or a weight
                if (square.wall || square.weight) {
                    this.changeNormalSquare(square);
                } else if (square.visited || square.path) {
                    if (square.target) {
                        square.div.className = "target";
                    } else if (square.start) {
                        square.div.className = "start"
                    } else {
                        square.div.className = "unvisited";
                    }
                }
                square.wall = false;
                square.weight = false;
                square.visited = false;
                square.path = false;
            }
        }
    }
    clearVisited() {
        // This funciton clears any square in the board wich has been marked as
        // "visited" or "path". The function should be called before any recomputation
        // of a path so that the new "visited" and "path" squares can be displayed.
        // Parameters: None.
        // Output: None.

        // reset the nodes-visited and pathway-cost
        this.nodesVisited.innerHTML = "0";
        this.pathwayCost.innerHTML = "0";

        // For each row in the board
        for (let i = 0; i < this.height; i++) {
            // For each column in the board
            for (let j = 0; j < this.width; j++) {
                let square = this.boardL[i][j];
                // reset every board with a wall or a weight
                if (square.visited || square.path) {
                    if (square.target) {
                        square.div.className = "target";
                    } else if (square.start) {
                        square.div.className = "start";
                    } else if (square.wall) {
                        square.div.className = "wall";
                    } else if (square.weight) {
                        square.div.className = "weight";
                    } else {
                        square.div.className = "unvisited";
                    }
                    square.visited = false;
                    square.path = false;
                }
            }
        }
    }
    resetBoard(algorithm) {
        // Depending on the current state of the board an the algorithm passed
        // into the function, this function may change all wall squares to weighted
        // squares or visa versa.
        // Parameters:
        // algortihm - a string object representing an algorithm (e.g. "BreadthFirstSearch").
        // Output: None.

        this.clearVisited();

        this.algorithm = algorithm;

        if (algorithm == "BreadthFirstSearch" || algorithm == "DepthFirstSearch") {
            // We want to reset any weighted square to a wall
            this.algoType = "wall";
            // For each row in the board
            for (let i = 0; i < this.height; i++) {
                // For each column in the board
                for (let j = 0; j < this.width; j++) {
                    let square = this.boardL[i][j];
                    // reset every board with a weight to a wall
                    if (square.weight) {
                        square.weight = false;
                        square.wall = true;
                        square.div.className = "wall";
                    }
                }
            }
        } else {
            // Wewant to reset any wall square to a weighted square
            this.algoType = "weight";
            // For each row in the board
            for (let i = 0; i < this.height; i++) {
                // For each column in the board
                for (let j = 0; j < this.width; j++) {
                    let square = this.boardL[i][j];
                    // reset every board with a wall to a weight
                    if (square.wall) {
                        square.wall = false;
                        square.weight = true;
                        square.div.className = "weight";
                    }
                }
            }
        }
    }
    visitSquare(square) {
        // this function "visits" a single square in the board by setting its
        // visited attribute to true and change its className so that it displays
        // properly on the board.
        // Parameter:
        // square - a square object
        // Output: None.

        square.visited = true;

        if (this.animating) {
            if (square.weight) {
                this.squaresToAnimate.push([square, "weightVisited", "visit"]);
            } else if (square.target) {
                this.squaresToAnimate.push([square, "targetVisited", "visit"]);
            } else if (square.start) {
                this.squaresToAnimate.push([square, "startVisited", "visit"]);
            } else {
                this.squaresToAnimate.push([square, "visited", "visit"]);
            }
        } else {
            if (square.weight) {
                square.div.className = "weightVisited";
            } else if (square.target) {
                square.div.className = "targetVisited";
            } else if (square.start) {
                square.div.className = "startVisited";
            } else {
                square.div.className = "visited";
            }
            this.nodesVisited.innerHTML = String(Number(this.nodesVisited.innerHTML) + 1);
        }
    }
    addToPath(square) {
        // this function adds a single square in the board to the path by setting its
        // path attribute to true and change its className so that it displays
        // properly on the board.
        // Parameter:
        // square - a square object
        // Output: None.

        square.path = true;

        if (this.animating) {
            if (square.weight) {
                this.squaresToAnimate.push([square, "weightPath", "path"]);
            } else if (square.target) {
                this.squaresToAnimate.push([square, "targetPath", "path"]);
            } else if (square.start) {
                this.squaresToAnimate.push([square, "startPath", "path"]);
            } else {
                this.squaresToAnimate.push([square, "path", "path"]);
            }
        } else {
            let addToPath = 1;
            if (square.weight) {
                square.div.className = "weightPath";
                addToPath = this.weightValue;
            } else if (square.target) {
                square.div.className = "targetPath";
            } else if (square.start) {
                square.div.className = "startPath";
            } else {
                square.div.className = "path";
            }
            this.pathwayCost.innerHTML = String(Number(this.pathwayCost.innerHTML) + addToPath);
        }
    }
    setPattern(pattern) {
        // This function checks the name of the parameter 'pattern' and calls
        // The appropriate function to create a pattern on the board.
        // Paremeters:
        // pattern - a string representing the desired patttern (e.g. "stairPattern").
        // Output: None.

        this.clearBoard();

        switch(pattern){
            case "stairPattern":
                this.createStairPattern();
                break;
            case "randomMaze":
                this.createRandomMaze();
                break;
            case "recursiveDivisionMazeHor":
                this.createRDMaze("horizontal");
                break;
            case "recursiveDivisionMazeVert":
                this.createRDMaze("vertical");
                break;
            default:
                alert("The requested pattern could not be created.");
        }
    }
    createStairPattern(){
        // This function creates a stair pattern on the board. The function is called
        // exclusively as a subprocess of this.setPattern().
        // Parameters: None.
        // Output: None.

        let xPos = 0;   // the x coordinate of the current square
        let yPos = 3;   // the y coordinate of the current square

        while (xPos < this.width) {
            let totalSteps = Math.floor((Math.random() * 13) + 7); // a random number from 7 to 20
            let i = 0;
            let yMove = 1;
            while (i < totalSteps && xPos < this.width) {
                this.changeNormalSquare(this.boardL[yPos][xPos]);
                if (yPos == this.height - 1) yMove = -1;
                if (yPos == 0) yMove = 1;
                yPos += yMove;
                xPos++;
                i++;
            }
        }
    }
    createRDMaze(skew) {
        // This function creates a maze on the board using recursive division. The maze
        // is either vertically skewed or horizontally skewed. The function is calles as
        // a subprocess of this.setPattern().
        // Parameters:
        // skew - a string representing the desired skew: "vertical" or "horizontal".
        // Output: None.

        // Fill board perimeter with walls
        for (let i = 0; i < this.height; i++) this.changeNormalSquare(this.boardL[i][0]);
        for (let i = 1; i < this.width; i++) this.changeNormalSquare(this.boardL[0][i]);
        for (let i = 1; i < this.width; i++) this.changeNormalSquare(this.boardL[this.height - 1][i]);
        for (let i = 1; i < this.height - 1; i++) this.changeNormalSquare(this.boardL[i][this.width - 1]);

        // recursively divide and fill the remaining spaces
        if (skew == "horizontal") {
            this.recursiveDivide([0, this.width - 1], [0, this.height - 1], "y");
        } else {
            this.recursiveDivide([0, Math.floor((this.width - 1)/3)], [0, this.height - 1], "y");
            this.recursiveDivide([(Math.floor((this.width - 1)/3) - 2), ((2 * Math.floor((this.width - 1)/3)) + 2)], [0, this.height - 1], "y");
            this.recursiveDivide([(2 * Math.floor((this.width - 1)/3)), this.width - 1], [0, this.height - 1], "y");
        }

    }
    recursiveDivide(xRange, yRange, direction) {
        // This function resursively divides a given range using the this.changeNormalSquare()
        // method. The function is called exclusively as a subprocess of createRDMaze().
        // Parameters:
        // xRange - a list of two integers, the first one represents the lower bound of the range
        // and the second one represents the upperbound (e.g [0, 25]).
        // yRange - a list of two integers, the first one represents the lower bound of the range
        // and the second one represents the upperbound (e.g [0, 25]).
        // direction - a character (either "y" or "x") representing the axis upon which the square
        // should be divided.
        // Output: None.

        if (direction == "y") {
            // base case
            if (xRange[0] >= xRange[1] - 2) return; 
            // an even number between xRang[0] and xRange[1]
            let division = xRange[0] + (Math.floor((Math.random() * (xRange[1] - xRange[0])) / 2) * 2);
            if (division == xRange[0]) division += 2;
            if (division == xRange[1]) division -= 2; // TODO find a simpler way of creating the maze
            // fill in a new wall
            for (let i = yRange[0] + 1; i < yRange[1]; i++) this.changeNormalSquare(this.boardL[i][division]);
            // pick one square from the wall to remove at random
            let removal = yRange[0] + (Math.floor((Math.random() * (yRange[1] - yRange[0])) / 2) * 2) + 1;
            if (removal <= yRange[0]) removal += 2;
            if (removal >= yRange[1]) removal -= 2;
            // make one hole in the wall
            this.changeNormalSquare(this.boardL[removal][division]);
            // recurse
            this.recursiveDivide([xRange[0], division], yRange, "x");
            this.recursiveDivide([division, xRange[1]], yRange, "x");

        } else {
            // base case
            if (yRange[0] >= yRange[1] - 2) return; 
            // an even number between xRang[0] and xRange[1]
            let division = yRange[0] + (Math.floor((Math.random() * (yRange[1] - yRange[0])) / 2) * 2);
            if (division == yRange[0]) division += 2;
            if (division == yRange[1]) division -= 2; // TODO find a simpler way of creating the maze
            // fill in a new wall
            for (let i = xRange[0] + 1; i < xRange[1]; i++) this.changeNormalSquare(this.boardL[division][i]);
            // pick one square from the wall to remove at random
            let removal = xRange[0] + (Math.floor((Math.random() * (xRange[1] - xRange[0])) / 2) * 2) + 1;
            if (removal <= xRange[0]) removal += 2;
            if (removal >= xRange[1]) removal -= 2;
            // make one hole in the wall
            this.changeNormalSquare(this.boardL[division][removal]);
            // recurse
            this.recursiveDivide(xRange, [yRange[0], division], "y");
            this.recursiveDivide(xRange, [division, yRange[1]], "y");
        }
    }
    createRandomMaze() {
        // This function selects random nodes on the board to fill in as either weights or walls
        // to create a "random maze".The function is called exclusively as a subprocess of
        // this.setPattern().
        // Parameters: None.
        // Output: None.

        let fillFactor = 30; // the total percentage of sqaures to fill as a wall

        // For each row in the board
        for (let i = 0; i < this.height; i++) {
            // For each column in the board
            for (let j = 0; j < this.width; j++) {
                // generate a random number to see if the square should be filled
                let random = Math.random() * 100;
                if (random < fillFactor) this.changeNormalSquare(this.boardL[i][j]);
            }
        }
    }
    runSearch(animating) {
        // This function runs a search from the start node to the target node using the 
        // currently selected algorithm specifid by this.algorithm.
        // Parameters:
        // animating - a boolean (true or false) representing wethter the visited nodes
        // should be animated or not.
        // Output: None.

        this.animating = animating;
        this.computing = true;
        this.clearVisited();

        switch(this.algorithm) {
            case "Dijkstra":
                this.dijkstrasAlgorithm();
                break;
            case "A*Search":
                this.aStarSearch();
                break;
            case "BestFirstSearch":
                this.bestFirstSearch();
                break;
            case "BreadthFirstSearch":
                this.breadthFirstSearch();
                break;
            case "DepthFirstSearch":
                this.depthFirstSearch();
                break;
            default:
                alert("Unable to run the selected search");
        }

        if (animating) {
            this.animateSquares();
        } else {
            this.computing = false;
        }
    }
    depthFirstSearch() {
        // This function runs a depth-first search from the start node to the target node.
        // The process is called as a subprocess of this.runSearch().
        // Parameters: None.
        // Output: None.

        let x = this.start.x;
        let y = this.start.y;

        this.start.visited = true;
        this.start.div.className = "startVisited";

        let targetFound = false;
        let stack = [this.start];

        while(!targetFound) {
            // select an unvisited square adjacent to the current square and push it to the stack
            if (this.emptySquare(x, y - 1)) {
                // The top square has not been visited
                this.visitSquareDFS(this.boardL[y - 1][x], stack);
                y--;
            } else  if (this.emptySquare(x + 1, y )) {
                // The right square has not been visited
                this.visitSquareDFS(this.boardL[y][x + 1], stack);
                x++;
            } else  if (this.emptySquare(x, y + 1)) {
                // The bottom square has not been visited
                this.visitSquareDFS(this.boardL[y + 1][x], stack);
                y++;
            } else  if (this.emptySquare(x - 1, y)) {
                // The left square has not been visited
                this.visitSquareDFS(this.boardL[y][x - 1], stack);
                x--;
            } else if (stack[stack.length - 1].target) {
                // we have reached the target
                targetFound = true;
                this.visitSquare(this.target);
                // draw out the pathway
                this.backtrace();
            } else if (stack.length == 1) {
                // no pathway has been found
                this.pathwayCost.innerHTML  = "No Path Found";
                targetFound = true;
            } else {
                // All possible squares have been visited. Pop one square from the stack
                stack.pop();
                x = stack[stack.length - 1].x;
                y = stack[stack.length - 1].y;
            }
        }
    }
    breadthFirstSearch() {
        // This function runs a breadth-first search from the start node to the target node.
        // The process is called as a subprocess of this.runSearch().
        // Parameters: None.
        // Output: None.

        this.start.visited = true;
        this.start.div.className = "startVisited";
        
        let targetFound = false;
        let queue = [this.start];

        while(!targetFound) {
            // Dequeue an element from the queue
            if (queue.length == 0) {
                // no pathway has been found
                this.pathwayCost.innerHTML = "No Path Found";
                targetFound = true;
                break;
            }
            let dequeue = queue.shift();
            let x = dequeue.x;
            let y = dequeue.y;

            // select an unvisited squares adjacent to the current square and enqueue them
            if (this.emptySquare(x, y - 1)) {
                // The top square has not been visited
                this.visitSquareBFS(dequeue, this.boardL[y - 1][x], queue);
                if (this.boardL[y - 1][x].target) {
                    this.visitSquare(this.target);
                    targetFound = true;
                    this.backtrace();
                    break;
                }
            }
            if (this.emptySquare(x + 1, y)) {
                // The right square has not been visited
                this.visitSquareBFS(dequeue, this.boardL[y][x + 1], queue);
                if (this.boardL[y][x + 1].target) {
                    this.visitSquare(this.target);
                    targetFound = true;
                    this.backtrace();
                    break;
                }
            }
            if (this.emptySquare(x, y + 1)) {
                // The bottom square has not been visited
                this.visitSquareBFS(dequeue, this.boardL[y + 1][x], queue);
                if (this.boardL[y + 1][x].target) {
                    this.visitSquare(this.target);
                    targetFound = true;
                    this.backtrace();
                    break;
                }
            }
            if (this.emptySquare(x - 1, y)) {
                // The left square has not been visited
                this.visitSquareBFS(dequeue, this.boardL[y][x - 1], queue);
                if (this.boardL[y][x - 1].target) {
                    this.visitSquare(this.target);
                    targetFound = true;
                    this.backtrace();
                    break;
                }
            }

            if (queue.length == 0) {
                // no pathway has been found
                this.pathwayCost.innerHTML  = "No Path Found";
                targetFound = true;
            }
        }
    }
    emptySquare(x, y) {
        // This function returns true if the x and y coordinates corespond to an
        // empty square in the board which has not already been visited or occupied
        // by a wall.
        // Parameters:
        // x - an integer representing the x coordinate of the desired square in the board.
        // y - an integer representing the y coordinate of the desired square in the board.
        // Output:
        // true - when square is empty and unvisited
        // false - when square is either occupied by a wall, visited, or out of bounds

        if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
            // the index is out of range
            return false;
        } else if (this.boardL[y][x].visited || this.boardL[y][x].wall) {
            // this position is occupied
            return false;
        } else {
            // the position is empty
            return true;
        }
    }
    visitSquareDFS(square, stack){
        // This function converts an unvisited square to a visited square for a depth
        // first search and adds it to the stack.
        // Parameters:
        // square - a square object
        // stack - an array representing a stack
        // Output: None.

        square.previous = stack[stack.length - 1];
        stack.push(square);
        this.visitSquare(square);
    }
    visitSquareBFS(lastSquare, nextSquare, queue){
        // This function converts an unvisited square to a visited square for a depth
        // first search and adds it to the queue.
        // Parameters:
        // lastSquare - a square object thats just been removed from the queue.
        // nextSquare - an unvisited square object which is a neighbor of lastSquare.
        // stack - an array representing a queue.
        // Output: None.

        nextSquare.previous = lastSquare;
        queue.push(nextSquare);
        this.visitSquare(nextSquare);
    }
    dijkstrasAlgorithm() {
        // This function finds the shortest distance between a start node and a target
        // node. The function is called exclusively as a subprocess of this.runSearch().
        // We stop checking all the nodes when each empty node surrounding the target has
        // been visited
        // Parameters: None.
        // Output: None.

        // let the distance of all squares from the start be infinity
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.boardL[i][j].distance = Infinity;
                this.boardL[i][j].visited = false;
            }
        }

        // let the distance from the start square to itself be zero
        this.start.distance = 0;

        let targetFound = false;
        while (!targetFound) {
            // visit the square with the smallest known distance from the start vertex
            let smallestFound = null;
            let smallestValue = Infinity;
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (!this.boardL[i][j].visited && this.boardL[i][j].distance < smallestValue) {
                        smallestFound = this.boardL[i][j];
                        smallestValue = this.boardL[i][j].distance;
                    }
                }
            }
            this.visitSquare(smallestFound);

            let y = smallestFound.y;
            let x = smallestFound.x;

            // Update the unvisited neighbors of the current square
            this.dijkstraUpdate(smallestFound, x, y - 1);
            this.dijkstraUpdate(smallestFound, x - 1, y);
            this.dijkstraUpdate(smallestFound, x + 1, y);
            this.dijkstraUpdate(smallestFound, x, y + 1);

            if (this.target.distance != Infinity) {
                // The target has been found (optimally in this case)
                this.visitSquare(this.target);
                this.backtrace();
                targetFound = true;
            }
        }
    }
    dijkstraUpdate(previousSquare, x, y) {
        // This function records the distance to the starting node of a square
        // wich neighbors 'previousSquare, if that distance is shorter than its previosuly
        // recorded distance. If the distance of the square is updated then its
        // "previous" is set to 'previousSquare'.
        // Parameters:
        // previousSquare - a square object.
        // x - an integer representing the x coordinate of the neighbor square in the board.
        // y - an integer representing the y coordinate of the neighbor square in the board.
        // Output: None.

        if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
            // the index is out of range
            return;
        }
        let nextSquare = this.boardL[y][x];
        if (nextSquare.weight) {
            if (previousSquare.distance + this.weightValue < nextSquare.distance) {
                nextSquare.distance = previousSquare.distance + this.weightValue;
                nextSquare.previous = previousSquare;
            }
        } else {
            if (previousSquare.distance + 1 < nextSquare.distance) {
                nextSquare.distance = previousSquare.distance + 1;
                nextSquare.previous = previousSquare;
            }
        }
    }
    aStarSearch() {
        // This function finds the shortest distance between a start node and a target
        // node. The function is called exclusively as a subprocess of this.runSearch().
        // We stop checking all the nodes when each empty node surrounding the target has
        // been visited.
        // Parameters: None.
        // Output: None.

        // let the distance of all squares from the start be infinity
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.boardL[i][j].distance = Infinity;
                this.boardL[i][j].visited = false;
                this.boardL[i][j].heuristic = this.distanceToTarget(this.boardL[i][j]);
            }
        }

        // let the distance from the start square to itself be zero
        this.start.distance = 0;
        
        let targetFound = false;
        while (!targetFound) {
            // visit the square with the smallest known distance from the start vertex
            let smallestFound = null;
            let smallestValue = Infinity;
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    if (!this.boardL[i][j].visited && this.boardL[i][j].distance + this.boardL[i][j].heuristic < smallestValue) {
                        smallestFound = this.boardL[i][j];
                        smallestValue = this.boardL[i][j].distance + this.boardL[i][j].heuristic;
                    }
                }
            }
            this.visitSquare(smallestFound);

            let y = smallestFound.y;
            let x = smallestFound.x;

            // Update the unvisited neighbors of the current square
            this.aStarUpdate(smallestFound, x, y - 1);
            this.aStarUpdate(smallestFound, x - 1, y);
            this.aStarUpdate(smallestFound, x + 1, y);
            this.aStarUpdate(smallestFound, x, y + 1);

            if (this.target.distance != Infinity) {
                // The target has been found (optimally in this case)
                this.visitSquare(this.target);
                this.backtrace();
                targetFound = true;
            }
        }
    }
    aStarUpdate(previousSquare, x, y) {
        // This function records the distance to the starting node of a square
        // wich neighbors 'previousSquare', if that distance is shorter than its previosuly
        // recorded distance. If the distance of the square is updated then its
        // "previous" is set to 'previousSquare'.
        // Parameters:
        // previousSquare - a square object.
        // x - an integer representing the x coordinate of the neighbor square in the board.
        // y - an integer representing the y coordinate of the neighbor square in the board.
        // Output: None.

        if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
            // the index is out of range
            return;
        }
        let nextSquare = this.boardL[y][x];
        if (nextSquare.weight) {
            if (previousSquare.distance + this.weightValue < nextSquare.distance) {
                nextSquare.distance = previousSquare.distance + this.weightValue;
                nextSquare.previous = previousSquare;
            }
        } else {
            if (previousSquare.distance + 1 < nextSquare.distance) {
                nextSquare.distance = previousSquare.distance + 1;
                nextSquare.previous = previousSquare;
            }
        }
    }
    bestFirstSearch() {
        // This function finds the shortest distance between a start node and a target
        // node. The function is called exclusively as a subprocess of this.runSearch().
        // We stop checking all the nodes when the target has been visited
        // Parameters: None.
        // Output: None.

        // set the heuristic for each node in the board
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.boardL[i][j].visited = false;
                if (this.boardL[i][j].weight) {
                    this.boardL[i][j].heuristic = this.distanceToTarget(this.boardL[i][j]) + this.weightValue;
                } else {
                    this.boardL[i][j].heuristic = this.distanceToTarget(this.boardL[i][j]);
                }
            }
        }

        // create a list of unvisited squares which are surrounding ones which have been visited already
        let nextToVisit = [this.start];
        
        let targetFound = false;
        while (!targetFound) {
            // visit the square with the smallest heuristic value
            let smallestFound = null;
            let smallestValue = Infinity;
            for (let i = 0; i < nextToVisit.length; i++) {
                if (nextToVisit[i].heuristic < smallestValue) {
                    smallestFound = nextToVisit[i];
                    smallestValue = nextToVisit[i].heuristic;
                }
            }

            this.visitSquare(smallestFound);
            nextToVisit.splice(nextToVisit.indexOf(smallestFound), 1);

            let x = smallestFound.x;
            let y = smallestFound.y;
            if (this.emptySquare(x, y - 1)) {
                nextToVisit.push(this.boardL[y - 1][x]);
                this.boardL[y - 1][x].previous = smallestFound;
            }
            if (this.emptySquare(x, y + 1)) {
                nextToVisit.push(this.boardL[y + 1][x]);
                this.boardL[y + 1][x].previous = smallestFound;
            }
            if (this.emptySquare(x - 1, y)) {
                nextToVisit.push(this.boardL[y][x - 1]);
                this.boardL[y][x - 1].previous = smallestFound;
            }
            if (this.emptySquare(x + 1, y)) {
                nextToVisit.push(this.boardL[y][x + 1]);
                this.boardL[y][x + 1].previous = smallestFound;
            }

            if (this.target.visited) {
                // The target has been found (optimally in this case)
                this.backtrace();
                targetFound = true;
            }
        }
    }
    distanceToTarget(square) {
        // This function calculates the distance (number of squares) between a given
        // square and the target square. The function is called exclusively as a 
        // subprocess of A* Search in order to calculate the heuristic value for a square.
        // Parameters:
        // Square - a square object
        // Output:
        // totalDistance - a integer representing the distance between the squar and the target

        let totalDistance = Math.abs(square.x - this.target.x) + Math.abs(square.y - this.target.y);
        return totalDistance;
    }
    backtrace() {
        // This function backtraces from the target square to the start square and
        // highlights every square along the path.
        // Parameters: None.
        // Output: None.

        let currentSquare = this.target;

        while (true) {
            this.addToPath(currentSquare);
            if (currentSquare.start) break;
            currentSquare = currentSquare.previous;
        }
    }
    inProgress() {
        // This function returns true if there is currently an computation in progress
        // and false otherwise.
        // Parameters: None.
        // Output:
        // true - when the program is currently computing a shortest-path or animating.
        // false - when the pathfinder is at rest.

        return this.computing;
    }
    animateSquares() {
        // This function animates every node which has been added to this.squaresToAnimate.
        // The function is called exclusively as a subprocess of this.runSearch().
        // Parameters: None.
        // Output: None.

        for (let i = 0; i <= this.squaresToAnimate.length; i++) {
            setTimeout(() => {
                // Animate every square in the squares to animate list
                if (i == this.squaresToAnimate.length) {
                    // Reset the list when the last square is reached.
                    // The reset must occur in the timeout function. Otherwise,
                    // the reset will be executed asynchronously before the animation
                    // is finished.
                    this.squaresToAnimate = [];
                    this.computing = false;
                } else if (this.squaresToAnimate[i][2] == "visit") {
                    this.squaresToAnimate[i][0].div.className = this.squaresToAnimate[i][1];
                    this.nodesVisited.innerHTML = String(Number(this.nodesVisited.innerHTML) + 1);
                } else if (this.squaresToAnimate[i][1] == "weightPath") {
                    this.squaresToAnimate[i][0].div.className = this.squaresToAnimate[i][1];
                    this.pathwayCost.innerHTML = String(Number(this.pathwayCost.innerHTML) + this.weightValue);
                } else {
                    this.squaresToAnimate[i][0].div.className = this.squaresToAnimate[i][1];
                    this.pathwayCost.innerHTML = String(Number(this.pathwayCost.innerHTML) + 1);
                }
            }, this.delayTime * i);
        }
    }
}



window.addEventListener('load', function() {

    // Create a Pathfinder Object
    const board = document.getElementById("board");
    const nodesVisited = document.getElementById("nodesVisited");
    const pathwayCost = document.getElementById("pathwayCost");
    let pathfinder = new Pathfinder(21, 51, board, nodesVisited, pathwayCost);

    // Initialize the pathfinder
    pathfinder.initialize();

    const colors = {
        darkBlue: "rgba(0, 0, 40)",
        lightBlue: "rgba(0, 153, 255)"
    };
    
    const djikstras = "Djikstra's Algorithm is <strong>weighted</strong> and <strong>guaruntees</strong> the shortest path";
    const aStar = "A* Search is <strong>weighted</strong> and <strong>guaruntees</strong> the shortest path";
    const bestFirst = "Best-First Search is <strong>weighted</strong> and <strong>does not guaruntee</strong> the shortest path";
    const breadthFirst = "Breadth-First Search is <strong>unweighted</strong> and <strong>guaruntees</strong> the shortest path";
    const depthFirst = "Depth-First Search is <strong>unweighted</strong> and <strong>does not guaruntee</strong> the shortest path";

    // The following section of code is resposible for managing the selection of an algorithm and pattern
    // by the user. The code also is responsible for clearing the board and running the search.
    
    let selectedAlgo = null;    // the current algorithm selected by the user
    let selectedPatt = null;    // the current pattern selected by the used
    
    const algorithms = document.getElementsByClassName("algorithm");
    const patterns = document.getElementsByClassName("pattern");
    const clearBoard = document.getElementById("clearBoard");
    const runSearch = document.getElementById("runSearch");
    const infoText = document.getElementById("infoText");
    
    for (let i = 0; i < algorithms.length; i++) {
        // For each algorithm button, set the background color to dark blue
        algorithms[i].style.backgroundColor = colors.darkBlue;
    
        // Create an event listener to detect clicks
        algorithms[i].addEventListener('click', function() {
            // Do not allow any actions to occur if the pathfinder is currently animating
            if (pathfinder.inProgress()) {
                alert("Wait for the animation to end.");
                return;
            }
            // Revert the style of the previously selected algorithm to its original styling
            if (selectedAlgo) selectedAlgo.style.backgroundColor = colors.darkBlue;
    
            // Change the color of the newly selected algorithm to new styling
            algorithms[i].style.backgroundColor = colors.lightBlue;
    
            // change the value of the currently selected algorithm
            selectedAlgo = algorithms[i];

            // allow the board to adjust for a change in algorithm
            pathfinder.resetBoard(selectedAlgo.id);

            // update the algorithm information
            switch (algorithms[i].id) {
                case "Dijkstra":
                    infoText.innerHTML = djikstras;
                    break;
                case "A*Search":
                    infoText.innerHTML = aStar;
                    break;
                case "BestFirstSearch":
                    infoText.innerHTML = bestFirst;
                    break;
                case "BreadthFirstSearch":
                    infoText.innerHTML = breadthFirst;
                    break;
                case "DepthFirstSearch":
                    infoText.innerHTML = depthFirst;
                    break;
                default:
                    infoText.innerHTML = "unexpected input"
            }
        });
    }
    
    for (let i = 0; i < patterns.length; i++) {
        // For each pattern button, set the background color to dark blue
        patterns[i].style.backgroundColor = colors.darkBlue;
    
        // Create an event listener to detect clicks
        patterns[i].addEventListener('click', function() {
            // Do not allow any actions to occur if the pathfinder is currently animating
            if (pathfinder.inProgress()) {
                alert("Wait for the animation to end.");
                return;
            }
            // Revert the style of the previously selected pattern to its original styling
            if (selectedPatt) selectedPatt.style.backgroundColor = colors.darkBlue;
    
            // Change the color of the newly selected pattern to new styling
            patterns[i].style.backgroundColor = colors.lightBlue;
    
            // change the value of the currently selected pattern
            selectedPatt = patterns[i];

            // Set the appropriate pattern on the board
            pathfinder.setPattern(patterns[i].id);
        });
    }
    
    clearBoard.addEventListener('click', function() {
        // Do not allow any actions to occur if the pathfinder is currently animating
        if (pathfinder.inProgress()) {
            alert("Wait for the animation to end.");
            return;
        }

        // clear the board
        pathfinder.clearBoard();
    
        // reset the color of the previously selected pattern
        if (selectedPatt) selectedPatt.style.backgroundColor = colors.darkBlue;
    
        // set the presviously selected pattern to Null
        selectedPatt = null;
    });
    
    runSearch.addEventListener('click', function() {
        // Do not allow any actions to occur if the pathfinder is currently animating
        if (pathfinder.inProgress()) {
            alert("Wait for the animation to end.");
            return;
        }

        // Check if an appropriate algorithm has been selected
        if (!selectedAlgo) {
            alert("You must select an algorithm before running a search.");
            return;
        }
        // Run the appropriate search with animation
        pathfinder.runSearch(true);
    });
});
