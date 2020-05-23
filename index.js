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

    clearBoard(){
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
}



window.addEventListener('load', function() {

    // Create a Pathfinder Object
    let pathfinder = new Pathfinder(20, 50, document.getElementById("board"));

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
        // TODO
    });


});
