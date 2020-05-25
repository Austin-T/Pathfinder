class Pathfinder {
    constructor(height, width, boardDiv) {
        // This function creates an instance of the Pathfinder object.
        // height - an integer representing the amount of rows in the board.
        // width - an integer representing the amount of columns in the board.
        // boardDiv - a div object to display the pathfinder within

        this.height = height;   // the amount of row in the board
        this.width = width;     // the amount of columns in the board

        this.boardD = boardDiv; // a div element representing the board
        this.boardL = [];       // an array representing the board

        this.rowWidth = "100%"; // the width of the rows inside of the board div
        this.rowHeight = String(100 / this.height) + "%"; // the total percent of the div height occupied by one row
        this.rowDisplay = "flex"; // the display style of a row in the board

        this.squareBorder = "1px solid grey"; // the border style of a square
        this.squareWidth = String(100 / this.width) + "%"; // the total percent of the div width occupied by one square
        this.squareHeight = "100%"; // the total percent of the row height occupied by a square



    //   this.start = null;
    //   this.target = null;
    //   this.object = null;
    //   this.boardArray = [];
    //   this.nodes = {};
    //   this.nodesToAnimate = [];
    //   this.objectNodesToAnimate = [];
    //   this.shortestPathNodesToAnimate = [];
    //   this.objectShortestPathNodesToAnimate = [];
    //   this.wallsToAnimate = [];
    //   this.mouseDown = false;
    //   this.pressedNodeStatus = "normal";
    //   this.previouslyPressedNodeStatus = null;
    //   this.previouslySwitchedNode = null;
    //   this.previouslySwitchedNodeWeight = 0;
    //   this.keyDown = false;
    //   this.algoDone = false;
    //   this.currentAlgorithm = null;
    //   this.currentHeuristic = null;
    //   this.numberOfObjects = 0;
    //   this.isObject = false;
    //   this.buttonsOn = false;
    //   this.speed = "fast";

    this.mousedown = false;     // indicates if the mouse is currently pressed down
    this.currentPressedSquare = null;   // indicates the status of the currently pressed square

    this.algorithm = null;
    this.algoType = "wall"; // indicates wether the current selected algoritm is for walls or weights

    this.start = null;  // assigned to the square which is the start
    this.target = null; // asigned to the square which is the target
    }
    
    initialise() {
        // This function initializes the pithfinder object: a grid is created with
        // numerous nodes, and event listeners are created for each node.

        this.createGrid();
        this.addEventListeners();
        this.setDefaultSquares();
    }
  
    createGrid() {
        // This function is responsible for creating an html grid which represents the
        // pathfinder. A secondary grid is also created as a list, which stores the properties
        // and div of every square in the board

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
                    wall: false,
                    weight: false,
                    visited: false,
                    previous: null,
                    next: null
                }

                // style the square
                newSquareD.style.border = this.squareBorder;
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
        // has been executed

        // For each row in the board
        for (let i = 0; i < this.height; i++) {
            // For each column in the board
            for (let j = 0; j < this.width; j++) {
                let square = this.boardL[i][j];
                // create event listeners for every square in the board
                square.div.onmousedown = (e) => {
                    // A mouse down event has occured while the cursor is ontop of the given
                    // square
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
        // default positions on the board.
        this.boardL[10][10].div.className = "start";
        this.boardL[10][10].start = true;
        this.start = this.boardL[10][10];
        this.boardL[10][40].div.className = "target";
        this.boardL[10][40].target = true;
        this.target = this.boardL[10][40];
    }

    changeNormalSquare(square){
        // This function converts the wall or weight property of a given square to
        // normal properties, and vice versa.
        if (square.start || square.target) return;

        if (this.algoType == "wall"){
            if (square.wall) {
                // swap wall-square for empty-square
                square.wall = false;
                square.div.className = "normal";
            } else {
                // swap empty-square for wall-square
                square.wall = true;
                square.div.className = "wall";
            }
        } else {
            if (square.weight) {
                // swap weight square for empty-square
                square.weight = false;
                square.div.className = "normal";
            } else {
                // swap empty-square for weight-square
                square.weight = true;
                square.div.className = "weight";
            }
        }
    }

    changeSpecialSquare(square){
        // This function adjusts the position of special squares such as "start" and "target"
        if (this.currentPressedSquare == "start") {
            // We are adjusting the position of the starting sqaure.
            // The start node will replace an existing squares other than the target
            if (square.target) return;

            // reset the old square
            this.start.start = false;
            this.start.div.className = "normal";

            // update the new square
            square.start = true;
            square.wall = false;
            square.weight = false;
            square.div.className = "start";
            this.start = square;

        } else {
            // we are adjusting the position of the target node
            // The start node will replace an existing squares other than the target
            if (square.start) return;

            // reset the old square
            this.target.start = false;
            this.target.div.className = "normal";

            // update the new square
            square.target = true;
            square.wall = false;
            square.weight = false;
            square.div.className = "target";
            this.target = square;

        }
    }

    clearBoard() {
        // This function finds every square in the board which is either a wall
        // or a weight, and resets that square empty

        // For each row in the board
        for (let i = 0; i < this.height; i++) {
            // For each column in the board
            for (let j = 0; j < this.width; j++) {
                let square = this.boardL[i][j];
                // reset every board with a wall or a weight
                if (square.wall || square.weight) {
                    this.changeNormalSquare(square);
                } else if (square.visited) {
                    if (!square.target && !square.start) square.div.className = "normal";
                    square.visited = false;
                }
            }
        }
    }

    resetBoard(algorithm) {
        // depending on the current state of the board an the algorithm passed
        // into the function, this function may change all wall squares to weighted
        // squares or visa versa
        this.algorithm = algorithm;

        if (algorithm == "BreadthFirstSearch" || algorithm == "DepthFirstSearch") {
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

    setPattern(pattern) {
        // This function checks the name of the parameter 'pattern' and calls
        // The appropriate function to create a pattern on the board

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
        // This function creates a stair pattern on the board

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
        // This function creates a maze on the board using recursive division

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
        // This function resursively divides a given range
        debugger;
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
        // to create a "random maze"

        let fillFactor = 40; // the total percentage of sqaures to fill as a wall

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
    runSearch(){
        // This function runs a search from the start node to the target node using the 
        // currently selected algorithm specifid by this.algorithm

        switch(this.algorithm) {
            case "Dijkstra":
                this.depthFirstSearch();
                break;
            case "A*Search":
                this.depthFirstSearch();
                break;
            case "Swarm":
                this.depthFirstSearch();
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
    }

    depthFirstSearch(){
        // This function runs a depth first search from the start node to the target node
        let x = this.start.x;
        let y = this.start.y;

        this.start.visited = true;

        let targetFound = false;
        let stack = [this.start];

        while(!targetFound) {
            // select an unvisited square adjacent to the current square and push it to the stack
            if (this.emptySquare(x, y - 1)) {
                // The top square has not been visited
                // stack[stack.length - 1].next = this.boardL[y - 1][x];
                // this.boardL[y - 1][x].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y - 1][x]);
                this.visitSquareDFS(this.boardL[y - 1][x], stack);
                y--;
            } else  if (this.emptySquare(x + 1, y )) {
                // The right square has not been visited
                // stack[stack.length - 1].next = this.boardL[y][x + 1];
                // this.boardL[y][x + 1].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y][x + 1]);
                this.visitSquareDFS(this.boardL[y][x + 1], stack);
                x++;
            }else  if (this.emptySquare(x, y + 1)) {
                // The bottom square has not been visited
                // stack[stack.length - 1].next = this.boardL[y + 1][x];
                // this.boardL[y + 1][x].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y + 1][x]);
                this.visitSquareDFS(this.boardL[y + 1][x], stack);
                y++;
            } else  if (this.emptySquare(x - 1, y)) {
                // The left square has not been visited
                // stack[stack.length - 1].next = this.boardL[y][x - 1];
                // this.boardL[y][x - 1].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y][x - 1]);
                this.visitSquareDFS(this.boardL[y][x - 1], stack);
                x--;
            } else {
                // All possible squares have been visited. Pop one square from the stack
                let previous = stack.pop();
                x = previous.x;
                y = previous.y;
            }

            if (stack == []) {
                // no pathway has been found
                alert("No pathway was found");
                targetFound = true;
            } else if (stack[stack.length - 1].target) {
                // we have reached the target
                alert("Pathway has been found");
                targetFound = true;
                // draw out the pathway
                // TODO
            }
        }
    }

    breadthFirstSearch() {
        // This function runs a breadth first search from the start node to the target node

        this.start.visited = true;
        
        let targetFound = false;
        let queue = [this.start];

        while(!targetFound) {
            // select an unvisited square adjacent to the current square and push it to the stack
            debugger;

            // Dequeue an element from the queue
            let dequeue = queue.shift();
            console.log(dequeue.x);
            let x = dequeue.x;
            let y = dequeue.y;

            if (this.emptySquare(x, y - 1)) {
                // The top square has not been visited
                // stack[stack.length - 1].next = this.boardL[y - 1][x];
                // this.boardL[y - 1][x].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y - 1][x]);
                this.visitSquareBFS(dequeue, this.boardL[y - 1][x], queue);
                if (this.boardL[y - 1][x].target) {
                    targetFound = true;
                    // TODO backtrace
                    break;
                }
            }
            if (this.emptySquare(x + 1, y)) {
                // The right square has not been visited
                // stack[stack.length - 1].next = this.boardL[y][x + 1];
                // this.boardL[y][x + 1].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y][x + 1]);
                this.visitSquareBFS(dequeue, this.boardL[y][x + 1], queue);
                if (this.boardL[y][x + 1].target) {
                    targetFound = true;
                    // TODO backtrace
                    break;
                }
            }
            if (this.emptySquare(x, y + 1)) {
                // The bottom square has not been visited
                // stack[stack.length - 1].next = this.boardL[y + 1][x];
                // this.boardL[y + 1][x].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y + 1][x]);
                this.visitSquareBFS(dequeue, this.boardL[y + 1][x], queue);
                if (this.boardL[y + 1][x].target) {
                    targetFound = true;
                    // TODO backtrace
                    break;
                }
            }
            if (this.emptySquare(x - 1, y)) {
                // The left square has not been visited
                // stack[stack.length - 1].next = this.boardL[y][x - 1];
                // this.boardL[y][x - 1].previous = stack[stack.length - 1];
                // stack.push(this.boardL[y][x - 1]);
                this.visitSquareBFS(dequeue, this.boardL[y][x - 1], queue);
                if (this.boardL[y][x - 1].target) {
                    targetFound = true;
                    // TODO backtrace
                    break;
                }
            }

            if (queue == []) {
                // no pathway has been found
                alert("No pathway was found");
                targetFound = true;
            }
        }
    }

    emptySquare(x, y) {
        // This function returns true if the x and y coordinates corespond to an
        // empty square in the board which has not already been visited, occupied
        // by a wall, or anything otherwise
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
        // first search and adds it to the stack
        stack[stack.length - 1].next = square;
        square.previous = stack[stack.length - 1];
        stack.push(square);
        if (!square.target) {
            square.visited = true;
            square.div.className = "visited";
        }
    }
    visitSquareBFS(lastSquare, nextSquare, queue){
        // This function converts an unvisited square to a visited square for a depth
        // first search and adds it to the queue
        lastSquare.next = nextSquare;
        nextSquare.previous = lastSquare;
        queue.push(nextSquare);
        if (!nextSquare.target) {
            nextSquare.visited = true;
            nextSquare.div.className = "visited";
        }
    }
}



window.addEventListener('load', function() {

    // Create a Pathfinder Object
    let pathfinder = new Pathfinder(21, 51, document.getElementById("board"));

    // Initialize the pathfinder
    pathfinder.initialise();

    const colors = {
        darkBlue: "rgba(0, 0, 40)",
        lightBlue: "rgba(0, 153, 255)"
    };
    
    const djikstras = "Djikstra's Algorithm is <strong>weighted</strong> and <strong>guaruntees</strong> the shortest path";
    const aStar = "A* Search is <strong>weighted</strong> and <strong>guaruntees</strong> the shortest path";
    const swarm = "Swarm Algorithm is <strong>weighted</strong> and <strong>does not guaruntee</strong> the shortest path";
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
                case "Swarm":
                    infoText.innerHTML = swarm;
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
        // clear the board
        pathfinder.clearBoard();
    
        // reset the color of the previously selected pattern
        if (selectedPatt) selectedPatt.style.backgroundColor = colors.darkBlue;
    
        // set the presviously selected pattern to Null
        selectedPatt = null;
    });
    
    runSearch.addEventListener('click', function() {
        // Check if an appropriate algorithm has been selected
        if (!selectedAlgo) {
            alert("You must select an algorithm before running a search.");
            return;
        }
        // Run the appropriate search
        pathfinder.runSearch();
    });


});
