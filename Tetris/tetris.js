var tetris = document.querySelector("#tetris");
var tetrisData = [];
var currentBlock;
var nextBlock;
var currentTopLeft = [0, 3];

//==================block 모양 생성==================
var blocks = [
  {
    name: "s",
    center: false,
    numCode: 1,
    color: "red",
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ],
    ],
  },
  {
    name: "t",
    center: true,
    numCode: 2,
    color: "orange",
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: "z",
    center: true,
    numCode: 3,
    color: "yellow",
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: "zr",
    center: true,
    numCode: 4,
    color: "green",
    startRow: 1,
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
    ],
  },
  {
    name: "l",
    center: true,
    numCode: 5,
    color: "blue",
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
    ],
  },
  {
    name: "lr",
    center: true,
    numCode: 6,
    color: "navy",
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: "b",
    center: true,
    numCode: 7,
    color: "violet",
    currentShapeIndex: 0,
    shape: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
    ],
  },
];

const colors = ["red", "orange", "yellow", "green", "blue", "navy", "violet"];

const isActiveBlock = (value) => value > 0 && value < 10;
const isInvalidBlock = (value) => value == undefined || value >= 10;

function init() {
  const fragment = document.createDocumentFragment();
  [...Array(20).keys()].forEach((col, i) => {
    const tr = document.createElement("tr");
    fragment.appendChild(tr);
    [...Array(10).keys()].forEach((row, j) => {
      const td = document.createElement("td");
      tr.appendChild(td);
    });
    const column = Array(10).fill(0);
    tetrisData.push(column);
  });
  tetris.appendChild(fragment);
}

//==================block 화면에 생성==================
function draw() {
  tetrisData.forEach((col, i) => {
    col.forEach((row, j) => {
      if (row > 0) {
        tetris.children[i].children[j].className =
          tetrisData[i][j] >= 10
            ? colors[tetrisData[i][j] / 10 - 1]
            : colors[tetrisData[i][j] - 1];
      } else {
        tetris.children[i].children[j].className = "";
      }
    });
  });
}

//==================다음 block 생성==================
function drawNext() {
  const nextTable = document.getElementById("next-table");
  nextTable.querySelectorAll("tr").forEach((col, i) => {
    Array.from(col.children).forEach((row, j) => {
      if (nextBlock.shape[0][i] && nextBlock.shape[0][i][j] > 0) {
        nextTable.querySelectorAll("tr")[i].children[j].className =
          colors[nextBlock.numCode - 1];
      } else {
        nextTable.querySelectorAll("tr")[i].children[j].className = "white";
      }
    });
  });
}

//==================block 생성==================
function generate() {
  if (!currentBlock) {
    currentBlock = blocks[Math.floor(Math.random() * blocks.length)];
  } else {
    currentBlock = nextBlock;
  }
  currentBlock.currentShapeIndex = 0;
  nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
  currentTopLeft = [-1, 3]; //기준점 설정

  let isGameOver = false; // 블록 기준점에 다른 블록이 존재하면 game over
  currentBlock.shape[0].slice(1).forEach((col, i) => {
    col.forEach((row, j) => {
      if (row && tetrisData[i][j + 3]) isGameOver = true;
    });
  });

  currentBlock.shape[0].slice(1).forEach((col, i) => {
    col.forEach((row, j) => {
      if (row) tetrisData[i][j + 3] = currentBlock.numCode;
    });
  });
  console.log("generate", JSON.parse(JSON.stringify(currentBlock)));
  if (isGameOver) {
    clearInterval(int);
    draw();
    alert("game over");
  } else {
    draw();
  }
}

//==================줄이 다 찼는지 확인==================
function checkRows() {
  const fullRows = [];

  tetrisData.forEach((col, i) => {
    let count = 0;
    col.forEach((row, j) => {
      // 찼는지 확인
      if (row > 0) {
        count++;
      }
    });
    if (count == 10) {
      fullRows.push(i);
    }
  });

  const fullRowsCount = fullRows.length;
  tetrisData = tetrisData.filter((row, i) => !fullRows.includes(i)); //채워진 줄 삭제
  for (let i = 0; i < fullRowsCount; i++) {
    // 상단에 반칸 생성
    tetrisData.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }

  let score = parseInt(document.getElementById("score").textContent, 10);
  score += fullRowsCount ** 2;
  document.getElementById("score").textContent = String(score);
}

//==================한 칸 아래로 내리기==================
function tick() {
  const nextTopLeft = [currentTopLeft[0] + 1, currentTopLeft[1]];
  const activeBlocks = [];
  let canGoDown = true;
  let currentBlockShape = currentBlock.shape[currentBlock.currentShapeIndex];

  for (
    let i = currentTopLeft[0];
    i < currentTopLeft[0] + currentBlockShape.length;
    i++
  ) {
    if (i < 0 || i >= 20) continue;
    for (
      let j = currentTopLeft[1];
      j < currentTopLeft[1] + currentBlockShape.length;
      j++
    ) {
      if (isActiveBlock(tetrisData[i][j])) {
        activeBlocks.push([i, j]);
        if (isInvalidBlock(tetrisData[i + 1] && tetrisData[i + 1][j])) {
          canGoDown = false;
        }
      }
    }
  }

  if (!canGoDown) {
    activeBlocks.forEach((blocks) => {
      tetrisData[blocks[0]][blocks[1]] *= 10;
    });
    checkRows(); //지워질 줄이 있는지 확인
    generate();
    return false;
  } else if (canGoDown) {
    for (let i = tetrisData.length - 1; i >= 0; i--) {
      const col = tetrisData[i];
      col.forEach((row, j) => {
        if (row < 10 && tetrisData[i + 1] && tetrisData[i + 1][j] < 10) {
          tetrisData[i + 1][j] = row;
          tetrisData[i][j] = 0;
        }
      });
    }
    currentTopLeft = nextTopLeft;
    draw();
    return true;
  }
}

//==========================================
//==========================================
//==================게임실행==================
let int = setInterval(tick, 2000);
init();
generate();

document.getElementById("stop").addEventListener("click", function () {
  clearInterval(int);
});
document.getElementById("start").addEventListener("click", function () {
  if (int) {
    clearInterval(int);
  }
  int = setInterval(tick, 2000);
});

//==================방향키 조작=================
window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "ArrowLeft": {
      const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] - 1];
      let isMovable = true;
      let currentBlockShape =
        currentBlock.shape[currentBlock.currentShapeIndex];
      for (
        let i = currentTopLeft[0];
        i < currentTopLeft[0] + currentBlockShape.length;
        i++
      ) {
        if (!isMovable) break;
        for (
          let j = currentTopLeft[1];
          j < currentTopLeft[1] + currentBlockShape.length;
          j++
        ) {
          if (!tetrisData[i] || !tetrisData[i][j]) continue;
          if (
            isActiveBlock(tetrisData[i][j]) &&
            isInvalidBlock(tetrisData[i] && tetrisData[i][j - 1])
          ) {
            isMovable = false;
          }
        }
      }
      console.log("left", "isMovable", isMovable);
      if (isMovable) {
        currentTopLeft = nextTopLeft;
        tetrisData.forEach((col, i) => {
          for (var j = 0; j < col.length; j++) {
            const row = col[j];
            if (tetrisData[i][j - 1] === 0 && row < 10) {
              tetrisData[i][j - 1] = row;
              tetrisData[i][j] = 0;
            }
          }
        });
        draw();
      }
      break;
    }
    case "ArrowRight": {
      const nextTopLeft = [currentTopLeft[0], currentTopLeft[1] + 1];
      let isMovable = true;
      let currentBlockShape =
        currentBlock.shape[currentBlock.currentShapeIndex];
      for (
        let i = currentTopLeft[0];
        i < currentTopLeft[0] + currentBlockShape.length;
        i++
      ) {
        if (!isMovable) break;
        for (
          let j = currentTopLeft[1];
          j < currentTopLeft[1] + currentBlockShape.length;
          j++
        ) {
          if (!tetrisData[i] || !tetrisData[i][j]) continue;
          if (
            isActiveBlock(tetrisData[i][j]) &&
            isInvalidBlock(tetrisData[i] && tetrisData[i][j + 1])
          ) {
            isMovable = false;
          }
        }
      }
      if (isMovable) {
        currentTopLeft = nextTopLeft;
        tetrisData.forEach((col, i) => {
          for (var j = col.length - 1; j >= 0; j--) {
            const row = col[j];
            if (tetrisData[i][j + 1] === 0 && row < 10) {
              tetrisData[i][j + 1] = row;
              tetrisData[i][j] = 0;
            }
          }
        });
        draw();
      }
      break;
    }
    case "ArrowDown": {
      tick();
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "ArrowUp": {
      let currentBlockShape =
        currentBlock.shape[currentBlock.currentShapeIndex];
      let isChangeable = true;
      const nextShapeIndex =
        currentBlock.currentShapeIndex + 1 === currentBlock.shape.length
          ? 0
          : currentBlock.currentShapeIndex + 1;
      const nextBlockShape = currentBlock.shape[nextShapeIndex];
      for (
        let i = currentTopLeft[0];
        i < currentTopLeft[0] + currentBlockShape.length;
        i++
      ) {
        if (!isChangeable) break;
        for (
          let j = currentTopLeft[1];
          j < currentTopLeft[1] + currentBlockShape.length;
          j++
        ) {
          if (!tetrisData[i]) continue;
          if (
            nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]] > 0 &&
            isInvalidBlock(tetrisData[i] && tetrisData[i][j])
          ) {
            isChangeable = false;
          }
        }
      }

      if (isChangeable) {
        while (currentTopLeft[0] < 0) {
          tick();
        }
        for (
          let i = currentTopLeft[0];
          i < currentTopLeft[0] + currentBlockShape.length;
          i++
        ) {
          for (
            let j = currentTopLeft[1];
            j < currentTopLeft[1] + currentBlockShape.length;
            j++
          ) {
            if (!tetrisData[i]) continue;
            let nextBlockShapeCell =
              nextBlockShape[i - currentTopLeft[0]][j - currentTopLeft[1]];
            if (nextBlockShapeCell > 0 && tetrisData[i][j] === 0) {
              tetrisData[i][j] = currentBlock.numCode;
            } else if (
              nextBlockShapeCell === 0 &&
              tetrisData[i][j] &&
              tetrisData[i][j] < 10
            ) {
              tetrisData[i][j] = 0;
            }
          }
        }
        currentBlock.currentShapeIndex = nextShapeIndex;
      }
      draw();
      break;
    }
    case "Space":
      while (tick()) {}
      break;
  }
});
