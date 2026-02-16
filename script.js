// list of possible orders (what appears in top plate)
var orders = [
  { sashimi: "salmon",     side: "none",   img: "IMAGE_ORDER_SALMON" },
  { sashimi: "salmon",     side: "wasabi", img: "IMAGE_ORDER_SALMON_WASABI" },
  { sashimi: "salmon",     side: "red",    img: "IMAGE_ORDER_SALMON_RED" },
  { sashimi: "tuna",       side: "none",   img: "IMAGE_ORDER_TUNA" },
  { sashimi: "tuna",       side: "wasabi", img: "IMAGE_ORDER_TUNA_WASABI" },
  { sashimi: "tuna",       side: "red",    img: "IMAGE_ORDER_TUNA_RED" },
  { sashimi: "yellowtail", side: "none",   img: "IMAGE_ORDER_YELLOWTAIL" },
  { sashimi: "yellowtail", side: "wasabi", img: "IMAGE_ORDER_YELLOWTAIL_WASABI" },
  { sashimi: "yellowtail", side: "red",    img: "IMAGE_ORDER_YELLOWTAIL_RED" }
];

var currentOrder = null;
var selectedSashimi = null; // "salmon", "tuna", "yellowtail"
var selectedSide = "none";  // "none", "wasabi", "red"
var score = 0;
var timeLeft = 60;
var timerId = null;

var orderImage = document.getElementById("orderImage");
var orderCircle = document.getElementById("orderCircle");
var scoreText   = document.getElementById("score");
var timerText   = document.getElementById("timer");
var msg         = document.getElementById("message");

// choose a random order and show its image in the top plate
function newOrder() {
  var index = Math.floor(Math.random() * orders.length);
  currentOrder = orders[index];
  orderImage.src = currentOrder.img;
  orderCircle.classList.remove("correct");
}

// HUD text
function updateScore() {
  scoreText.textContent = "Score: " + score;
}

function updateTimer() {
  timerText.textContent = "Time: " + timeLeft;
}

function startTimer() {
  updateTimer();
  timerId = setInterval(function () {
    timeLeft--;
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTimer();
      clearInterval(timerId);
      msg.textContent = "Time is up!";
    } else {
      updateTimer();
    }
  }, 1000);
}

// clear selection
function clearSelection() {
  selectedSashimi = null;
  selectedSide = "none";
  document.querySelectorAll(".ingredient").forEach(function (btn) {
    btn.classList.remove("selected");
  });
  msg.textContent = "";
  orderCircle.classList.remove("correct");
}

// handle ingredient clicks
var ingredients = document.querySelectorAll(".ingredient");

ingredients.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var type = this.getAttribute("data-type");
    var side = this.getAttribute("data-side");

    // sashimi (orange / pink / white slices)
    if (type !== "none") {
      ingredients.forEach(function (b) {
        if (b.getAttribute("data-type") !== "none") {
          b.classList.remove("selected");
        }
      });
      this.classList.add("selected");
      selectedSashimi = type;
    }

    // sides (wasabi / red flakes)
    if (side !== "none") {
      ingredients.forEach(function (b) {
        if (b.getAttribute("data-side") !== "none") {
          b.classList.remove("selected");
        }
      });
      this.classList.add("selected");
      selectedSide = side;
    }
  });
});

// check button: compare your combo with current order
document.getElementById("checkBtn").addEventListener("click", function () {
  if (timeLeft <= 0) {
    msg.textContent = "Game over. Refresh to play again.";
    return;
  }

  if (!selectedSashimi) {
    msg.textContent = "Pick a sashimi first.";
    return;
  }

  if (
    selectedSashimi === currentOrder.sashimi &&
    selectedSide === currentOrder.side
  ) {
    score++;
    updateScore();
    msg.textContent = "Correct!";
    orderCircle.classList.add("correct"); // green overlay
    setTimeout(function () {
      clearSelection();
      newOrder();
    }, 600);
  } else {
    msg.textContent = "Wrong combo. Try again.";
    orderCircle.classList.remove("correct");
  }
});

// clear button
document.getElementById("clearBtn").addEventListener("click", function () {
  clearSelection();
});

// start
newOrder();
startTimer();
