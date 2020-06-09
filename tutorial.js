// Outline the content to be added to the GIS Data Hub window
let tutorialContent = [
    ["Welcome to Dynamic Pathfinder", "./images/testgif.gif", "Welcome to Dynamic Pathfinder, a visualization tool for search algorithms. Here, you can visualize both weighted and unweighted algorithms, and create obstacles for the search algorithms to navigate. Click 'next' to learn more."],
    ["Select and Algorithm", "", "Before running a search, you must select one of the following five algorithms at the top of your screen:<br><br><strong>Djkstra's Algorithm </strong> (weighted): the father of pathfinding algorithms, guarantees the shortest path.<br><br><strong>A* Search </strong> (weighted): a modified version of Dijkstra's algorithm which uses a heuristic to find the shortest path while visiting fewer nodes. A* Search uses the Manhattan heuristic by default.<br><br><strong>Greedy Best-First Search </strong> (weighted): a heuristic heavy form of the A* Search algorithm, which does not guarantee the shortest path. Greedy Best-First Search uses the Manhattan heuristic by default.<br><br><strong>Breadth-First Search </strong> (unweighted): explores all neighboring nodes at the present depth prior to exploring nodes at the next depth level, guarantees the shortest path.<br><br><strong>Depth-First Search </strong> (unweighted): explores every pathway to the maximum possible depth before backtracking and exploring a new pathway"],
    ["Add Walls and Weights", "./images/testgif.gif", "Add walls or weights by clicking on the grid. Walls will be added when an unweighted search algorithm is currently selected, and weights will be added otherwise. Walls are impenetrable, while weights can be moved through with a default 'cost' of 5."],
    ["Add a Pattern", "./images/testgif.gif", "Add a pattern/maze to the board by selecting one from the top toolbar. All patterns/mazes are generated randomly."],
    ["Move the Start and Target Nodes", "./images/testgif.gif", "Move the start and target node by clicking on them with your mouse and dragging them to any empty node on the grid"],
    ["Run a Search or Clear the Board", "./images/testgif.gif", "To run a search, click once on the 'run search' button. You will not be able to make any other actions while the search is running. To clear all nodes on the board, press the 'clear board' button."],
    ["Automatic Recomputation", "./images/testgif.gif", "Once a search has finished running, you can drag the start and target node into any unocupied square, which will cause the search space and shortest-path to automatically recompute."],
    ["Enjoy!", "./images/testgif.gif", 'Please enjoy this application! If you would like to see the source code, you can find that on my <a href="https://github.com/Austin-T/Pathfinder">github</a>.']
];

// The GIS Data Hub Modal Popup Window
let tutorial = {
    close: document.getElementById("exit"),
    page: document.getElementById("page"),
    previous: document.getElementById("previous"),
    next: document.getElementById("next"),
    modal: document.getElementById("tutorial"),
    title: document.getElementById("title"),
    text: document.getElementById("text"),
    image: document.getElementById("image"),
    content: tutorialContent,
    totalPages: tutorialContent.length
}


tutorial.close.addEventListener('click', function () {
    // Hide the modal window when 'closed' is clicked
    tutorial.modal.className = "modal modal-hidden";
});

tutorial.previous.addEventListener('click', function () {
    // Go to the previous page when 'previous is clicked
    previousPage(tutorial);
});

tutorial.next.addEventListener('click', function () {
    // Go to the next page when 'next' is clicked
    nextPage(tutorial);
});


function previousPage(tutorial) {
    // This function changes the content of the modal popup
    // window to reflect the previous page, on the condition
    // that a previous page does exist

    let currentPage = Number(tutorial.page.innerHTML[0]);
    let nextPage = currentPage - 1;

    if (nextPage == 0) {
        // we do not want to do any actions here
        return;
    }
    if (nextPage == 1) {
        // set the 'previous' button to a dead button
        tutorial.previous.className = "smallDeadButton";
    }
    if (currentPage == tutorial.totalPages) {
        // set the 'next' button to a live button
        tutorial.next.className = "smallButton";
    }

    // Reset the title
    tutorial.title.innerHTML = tutorial.content[nextPage - 1][0];

    // Reset the image
    tutorial.image.src = tutorial.content[nextPage - 1][1];
    if (tutorial.content[nextPage - 1][1] == "") {
        document.getElementById("modalImage").style.display = "none";
        document.getElementById("modalText").style.height = "400px";
    } else {
        document.getElementById("modalImage").style.display = "block";
        document.getElementById("modalText").style.height = "100px";
    }

    // Reset the text
    tutorial.text.innerHTML = tutorial.content[nextPage - 1][2];

    // Reset the page number
    tutorial.page.innerHTML = String(nextPage) + "/" + String(tutorial.totalPages);
    
}

function nextPage(tutorial) {
    // This function changes the content of the modal popup
    // window to reflect the next page, on the condition
    // that the next does exist

    let currentPage = Number(tutorial.page.innerHTML[0]);
    let nextPage = currentPage + 1;

    if (currentPage == tutorial.totalPages) {
        // we do not want to do any actions here
        return;
    }
    if (nextPage == tutorial.totalPages) {
        // set the 'next' button to a dead button
        tutorial.next.className = "smallDeadButton";
    }
    if (currentPage == 1) {
        // set the 'previous' button to a live button
        tutorial.previous.className = "smallButton";
    }

    // Reset the title
    tutorial.title.innerHTML = tutorial.content[nextPage - 1][0];

    // Reset the image
    tutorial.image.src = tutorial.content[nextPage - 1][1];
    if (tutorial.content[nextPage - 1][1] == "") {
        document.getElementById("modalImage").style.display = "none";
        document.getElementById("modalText").style.height = "400px";
    } else {
        document.getElementById("modalImage").style.display = "block";
        document.getElementById("modalText").style.height = "100px";
    }

    // Reset the text
    tutorial.text.innerHTML = tutorial.content[nextPage - 1][2];

    // Reset the page number
    tutorial.page.innerHTML = String(nextPage) + "/" + String(tutorial.totalPages);
    
}