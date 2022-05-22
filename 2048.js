var table = document.getElementById("table");
var data = [];

function clear() {
  var fragment = document.createDocumentFragment();
  [1, 2, 3, 4].forEach(function () {
    var rowData = [];
    data.push(rowData);
    var tr = document.createElement("tr");
    [1, 2, 3, 4].forEach(function () {
      rowData.push(0);
      var td = document.createElement("td");
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });
  table.appendChild(fragment);
}

function mkRandom() {
  var blankArr = [];
  data.forEach(function (rowData, i) {
    rowData.forEach(function (columData, j) {
      if (!columData) {
        blankArr.push([i, j]);
      }
    });
  });
  var randomSpace = blankArr[Math.floor(Math.random() * blankArr.length)];
  data[randomSpace[0]][randomSpace[1]] = 2;
  draw();
}

function draw() {
  data.forEach(function (rowData, i) {
    rowData.forEach(function (columData, j) {
      if (columData > 0) {
        table.children[i].children[j].textContent = columData;
      } else {
        table.children[i].children[j].textContent = "";
      }
    });
  });
}

clear();
mkRandom();
draw();

var dragStart = false;
var draging = false;

//===========================
// screenX : 모니터 기준 좌표
// pageX : 페이지 (스크롤 포함)
// clientX : 브라우저 화면 기준
// offsetX : 이벤트 타겟 기준
//===========================
var startCoordinate;
var endCoordinate;

window.addEventListener("mousedown", function (e) {
  console.log("mousedown", e);
  dragStart = true;
  startCoordinate = [e.clientX, e.clientY];
});

window.addEventListener("mousemove", function (e) {
  if (dragStart) {
    draging = true;
  }
});

window.addEventListener("mouseup", function (e) {
  console.log("mouseup", e);
  endCoordinate = [e.clientX, e.clientY];

  if (draging) {
    var direction;
    var gapX = endCoordinate[0] - startCoordinate[0];
    var gapY = endCoordinate[1] - startCoordinate[1];

    if (gapX < 0 && Math.abs(gapX) / Math.abs(gapY) > 1) {
      direction = "left";
    } else if (gapX > 0 && Math.abs(gapX) / Math.abs(gapY) > 1) {
      direction = "right";
    } else if (gapY > 0 && Math.abs(gapX) / Math.abs(gapY) < 1) {
      direction = "bottom";
    } else if (gapY < 0 && Math.abs(gapX) / Math.abs(gapY) < 1) {
      direction = "top";
    }
  }
  dragStart = false;
  draging = false;

  switch (direction) {
    case "left":
      break;
    case "right":
      break;
    case "bottom":
      break;
    case "top":
      var newData = [[], [], [], []];
      data.forEach(function (rowData, i) {
        rowData.forEach(function (columData, j) {
          if (columData) {
            newData[j].unshift(columData);
          }
        });
      });
      [1, 2, 3, 4].forEach(function (columData, i) {
        [1, 2, 3, 4].forEach(function (rowData, j) {
          data[j][i] = newData[i][j] || 0;
        });
      });
      break;
  }
  mkRandom();
});
