for (var i = 1; i <= 9; i++) {
  $(".grid").append("<div class=square id=s" + i + " data-position=" + i + "></div>")
}

var finished = false;
//when flag is set to true it means the computer has taken the center position.
var flag = false;
//restart game: play button
$(".btnPlay").on("click", function() {
  finished = false;
  $(".btnResult").html("");
  var lastClass = $(".btnResult").attr("class").split(" ").pop();
  $(".btnResult").removeClass(lastClass);
  $(".container2").hide()
  $(".container1").show();
  $(".grid").hide();
  $(".level").val("select");
  $(".square").removeClass("x-mark o-mark marked");

})

//after selecting difficulty
$(".level").on("change", function() {
  $(".container1").hide();
  $(".rules").show();
  $(".grid").show();
})

//runs the userTurn function after user chooses a position
$(".square").on("click", userTurn);

function userTurn() {
  //check if game is still live
  if (!finished) {
    //gets class of selected square and stores it as a variable the "thisClass"
    var thisClass = $(this).attr("class");

    //checks if "marked" is a listed class of the chosen square.
    if (thisClass.indexOf("marked") < 0) {

      //adds class of "x-marked" and "marked" to chosen square
      $(this).addClass("x-mark marked");

      //checks for winner after third turn
      trackWinner($(this).data("position"), "x-mark");

      //determines computer's move depending on level of difficulty
      if ($(".level").val() == "easy") {
        placeRandom();
      } else {
        computerTurnHard()
      }

    } else {
      alert("Already Selected!");
    }
  }
  //checks for a draw.
  if ($(".marked").length == 9 && finished == false) {
    displayResult("Draw", "draw")
    finished = true;
  }
}

function placeRandom() {
  //returns array of elements without class "marked"
  var pcOptions = $(".square:not(.marked)");

  var randomNumber = Math.floor(Math.random() * pcOptions.length);

  //randomly select unmarked element from the array;
  var pcRandomChoice = pcOptions[randomNumber];

  $(pcRandomChoice).addClass("o-mark marked");

  //needed to check if pcWins after 3rd turn
  var currentPos = $(pcRandomChoice).data("position");
  trackWinner(currentPos, "o-mark")

}

function computerTurnHard() {
  var userWinningPositions = {
    1: [
      [2, 3],
      [4, 7],
      [5, 9]
    ],
    2: [
      [1, 3],
      [5, 8]
    ],
    3: [
      [1, 2],
      [6, 9],
      [5, 7]
    ],
    4: [
      [1, 7],
      [5, 6]
    ],
    5: [
      [2, 8],
      [4, 6],
      [1, 9],
      [3, 7]
    ],
    6: [
      [3, 9],
      [4, 5]
    ],
    7: [
      [8, 9],
      [1, 4],
      [3, 5]
    ],
    8: [
      [2, 5],
      [7, 9]
    ],
    9: [
      [3, 6],
      [7, 8]
    ]
  }
  var usersChoice = $(".x-mark");
  console.log("users choice: " + usersChoice)

  //Places user positions in an array
  var arrUsersChoice = [];
  usersChoice.map(function() {
    arrUsersChoice.push($(this).data("position"))
  });
  //converts above array to a string
  var joinedArr = arrUsersChoice.join("");
  console.log(joinedArr);

  //runs if user has made at least one selection
  if (usersChoice.length == 1) {
    //checks whether or not user selects position #5 which is middle box
    //if center box is not chosen by user, computer will select center as it is the most important position
    if ($(".x-mark").attr("id") != "s5") {
      //set flag to true when computer takes center position.
      flag = true;
      $("#s5").addClass("o-mark marked");
    } else {
      //if center box is chosen by user, computer will default to 1st box as it is the 2nd most important position.
      $("#s1").addClass("o-mark marked");
    }
  } else if (usersChoice.length == 2) { //if user has made second choice
    //iterates throught the possible winning array combos.
    for (var x in userWinningPositions) {
      $.each(userWinningPositions[x], function(key, winningArrays) {
        //if the user's selections("joinedArr") matches any of the winningArr values, the computer will use it's 2nd turn to block the user's winning position(x).
        if (joinedArr == winningArrays.join("")) {
          $("#s" + x).addClass("o-mark marked");
          return false;
        }
      })
    }
    //determines the computer's 2nd turn if the user is not in a position to immediately win.
    if ($(".o-mark").length == 1) {
      if (joinedArr == "24" || joinedArr == "27" || joinedArr == "34") {
        $("#s1").addClass("o-mark marked");
      } else if (joinedArr == "16" || joinedArr == "26" || joinedArr == "29") {
        $("#s3").addClass("o-mark marked");
      } else if (joinedArr == "48" || joinedArr == "49" || joinedArr == "18") {
        $("#s7").addClass("o-mark marked");
      } else if (joinedArr == "68" || joinedArr == "67" || joinedArr == "38") {
        $("#s9").addClass("o-mark marked");
      } else if (joinedArr == "37") {
        $("#s4").addClass("o-mark marked");
      } else if (joinedArr == "19") {
        $("#s6").addClass("o-mark marked");
      } else {
        placeRandom();
      }
    }
  } else if (usersChoice.length == 3) {//after the user's 3rd turn
    for (var y in userWinningPositions) {
      //possibleValues creates an array of the different two-position combinations to see if the user is in a position to win.
      // Which combination of user choices puts the user closest to winning? Position 0&1, poisiton 0&2, or position 1&2. Put these in the array called possibleValues
      var possibleValues = [joinedArr[0] + joinedArr[1], joinedArr[0] + joinedArr[2], joinedArr[1] + joinedArr[2]];
      $.each(userWinningPositions[y], function(index, winningArrays) {
        for (var i = 0; i < possibleValues.length; i++) {
          //if any combination of the user's selections("possibleValues") matches any of the winningArr values,
          //the computer will use it's 3rd turn to block the user's winning position(y).Assuming (y) is not an already "marked" position
          if (possibleValues[i] == winningArrays.join("") && $("#s" + y).attr("class").indexOf("marked") < 0) {
            $("#s" + y).addClass("o-mark marked");
            trackWinner(Number(y), "o-mark")
          }
        }
      })
    }
    if ($(".o-mark").length == 2) {
      if (flag == true) {
        findCenterWinningPosition();
      } else {
        placeRandom()
      }
    }
  } else if (usersChoice.length == 4) {
    for (var z in userWinningPositions) {
      var possibleValues = [joinedArr[0] + joinedArr[1], joinedArr[0] + joinedArr[2], joinedArr[0] + joinedArr[3], joinedArr[1] + joinedArr[2], joinedArr[1] + joinedArr[3], joinedArr[2] + joinedArr[3]];
      $.each(userWinningPositions[z], function(index, winningArrays) {
        if ($(".o-mark").length == 4) {
          return false
        } else {
          for (var j = 0; j < possibleValues.length; j++) {
            if (possibleValues[j] == winningArrays.join("") && $("#s" + z).attr("class").indexOf("marked") < 0) {
              $("#s" + z).addClass("o-mark marked");
              trackWinner(Number(z), "o-mark");
              return false;
            }
          }
        }
      })
    }
    if ($(".o-mark").length == 3) {
      if (flag == true) {
        findCenterWinningPosition();
      } else {
        placeRandom()
      }
    }
  }
}

//this function allows the computer to attempt to win but can only run if the computer has the center position marked.
function findCenterWinningPosition() {
  //defines the multiple combinations of winning from position #5(center position)
  var centerWins = {
    1: 9,
    2: 8,
    3: 7,
    4: 6
  };
  var couldFind = false;
  //loops through the centerWins object. Checks if the computer has secured one of the centerWins key/value pairs and if the the other is unmarked.
  //for example it will check if position 1 is "o-marked" AND if position 9, is empty and vice-versa.
  for (var k in centerWins) {
    if ($("#s" + k).attr("class").indexOf("o-mark") >= 0 && $("#s" + centerWins[k]).attr("class").indexOf("marked") < 0) {
      $("#s" + centerWins[k]).addClass("o-mark marked");
      couldFind = true
      trackWinner(centerWins[Number(k)], "o-mark");
      return false
    } else if ($("#s" + k).attr("class").indexOf("marked") < 0 && $("#s" + centerWins[k]).attr("class").indexOf("o-mark") >= 0) {
      $("#s" + k).addClass("o-mark marked");
      couldFind = true
      trackWinner(Number(k), "o-mark");
      return false
    }
  }
  //if a center winning move cannot be made, the computer will place a mark elsewhere randomly.
  if (couldFind == false) {
    placeRandom();
  }

}

function trackWinner(pos, mark) {
  //array of winning possitions.
  var winningPos = [
    [1, 2, 3],
    [1, 4, 7],
    [1, 5, 9],
    [2, 5, 8],
    [3, 6, 9],
    [3, 5, 7],
    [4, 5, 6],
    [7, 8, 9]
  ];

  //trackWinner() only runs after the third turn
  if ($(".x-mark").length >= 3 || $(".o-mark").length >= 3) {

    $.each(winningPos, function(key, arr) {
      if (finished == true) {
        return false
      } else {

        //checks each winning position array to see if the current position(pos) is included in any of them.
        if (arr.indexOf(pos) >= 0) {
          console.log(mark);
          console.log(arr);

          var marksInARow = 0;
          //takes all the arrays where the current position is found and checks the classNames for each item in each array..
          $.each(arr, function(index, value) {
            var classNames = $("#s" + value).attr("class");

            //loops through and checks for multiple x-mark or o-mark in the arrays where there current position is found. Depends on who picked last.
            if (classNames.indexOf(mark) >= 0) {
              marksInARow++;

              //Ends game if 3 consecutive x-marks or o-marks are found
              if (marksInARow == 3) {
                finished = true;
                if (mark == "x-mark") {
                  console.log("You Win")
                  displayResult("You Win", "win")
                }
                if (mark == "o-mark") {
                  console.log("You Lose")
                  displayResult("You Lost", "lost")
                  return false;
                }
              }
            }
          })
        }
      }
    })
  }
}

function displayResult(message, className) {
  $(".rules").hide();
  $(".container2").show();
  $(".btnResult").html(message);
  $(".btnResult").addClass(className);

}
