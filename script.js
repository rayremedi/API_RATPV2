// variable linked to the the select tag
let selectLine = document.querySelector("#selectLine");
let selectStation = document.querySelector("#selectStation");
let selectDestination = document.querySelector("#selectDestination");
let button = document.querySelector("#button");
let lineResult = document.querySelector("#lineResult");
let destinationResult = document.querySelector("#destinationResult");
let stationResult = document.querySelector("#stationResult");
let firsttimeResult = document.querySelector("#time");
let scdtimeResult = document.querySelector("#time2");
let lineValue = selectLine.value;
let background = document.querySelector(".result-footer");
let backgroundColorBis = ["#82C8E6", "#81DC73"];
let resultRender = document.querySelector(".result");
let backgroundColor = [
  "#FFBE00",
  "#0055C8",
  "#6E6E00",
  "#A0006E",
  "#FF5A00",
  "#81DC73",
  "#FF81B4",
  "#D282BE",
  "#D2D200",
  "#DC9600",
  "#6E491E",
  "#00643B",
  "#82C8E6",
  "#640082"
];



function Init() {
  getLines();
  getLineValue();
  searchTime()
  changeBackground()

}

function getLines() {
  //request GET =>  to get all metro's lines
  fetch("https://api-ratp.pierre-grimaud.fr/v4/lines/metros", {
    method: "get"
  })
    .then(response => response.json())
    .then(data => {
    
      //show data result in browser's console
      // console.log(data.result); //
      // declared a variable for metros arrays
      let allMetroLines = data.result.metros;
      //use forEach method  that apply a function for each elements of arrays
      allMetroLines.forEach(element => {
        //use createElement method to create an option tag
        let lineOption = document.createElement("option");
        // use createTextNode method to create a node text
        let lineNumber = document.createTextNode(element.code);
        //use the appendChild method to append the node text to the option tag
        lineOption.appendChild(lineNumber);
        //use the appendChild method to append the option tag to the select tag
        selectLine.appendChild(lineOption);
      });
    });
}

function getLineValue() {
  //add an event listener change on the selectLine
  selectLine.addEventListener("change", () => {
    // declare a variable for the value of selectLine
    let lineValue = selectLine.value;
    fetch(
      //request GET =>  to get all metro's stations from the value of selectLine
      `https://api-ratp.pierre-grimaud.fr/v4/stations/metros/${lineValue}`,
      {
        method: "get"
      }
    )
      .then(response => response.json())
      .then(data => {
        // console.log(data.result);
        //use the childNodes Property to send a node list
        //add a condition that state if selectStation returns a node list of children
        //while selectStation returns the first node child,remove the old first node Child
        if (selectStation.childNodes) {
          console.log(selectStation.firstChild)
          while (selectStation.firstChild) {
            selectStation.removeChild(selectStation.firstChild);
          }
        }
        const allMetroStations = data.result.stations;
        allMetroStations.forEach(element => {
          let stationOption = document.createElement("option");
          let stationName = document.createTextNode(element.name);
          stationOption.appendChild(stationName);
          selectStation.appendChild(stationOption);
        });
      });
    fetch(
      //request GET =>  to get all metro's destinations from the value of selectLine
      `https://api-ratp.pierre-grimaud.fr/v4/destinations/metros/${lineValue}`,
      {
        method: "get"
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data.result);
        if (selectDestination.childNodes) {
          while (selectDestination.firstChild) {
            selectDestination.removeChild(selectDestination.firstChild);
          }
        }
        const allMetroDestinations = data.result.destinations;
        allMetroDestinations.forEach(element => {
          let destinationOption = document.createElement("option");
          let destinationName = document.createTextNode(element.name);
          destinationOption.appendChild(destinationName);
          selectDestination.appendChild(destinationOption);
        });
      });
  });
}



function searchTime() {
  button.addEventListener("click", () => {
    let lineValue = selectLine.value;
    const lineImage = document.querySelector("#lineImage");
    lineImage.setAttribute("src",`./img/${lineValue}.svg`)
    let destinationValue = selectDestination.value;
    let stationValue = selectStation.value;
    // console.log(selectDestination.childNodes.label)

    //Conditions to change the destinationValue to A or R depending of the selected destinations
    if (destinationValue === selectDestination.childNodes.label) {
      console.log("voieA");
      destinationValue = "A"
    } else {
      console.log("voieR");
      destinationValue = "R"

    }
    if (lineValue == "3b") {
      background.style.backgroundColor = backgroundColorBis[0];
    } else if (lineValue == "7b") {
      background.style.backgroundColor = backgroundColorBis[1];
    }
    
    background.style.backgroundColor = backgroundColor[parseInt(lineValue - 1)];
    resultRender.style.opacity = "1";
    searchTime();
    setInterval(searchTime, 30000);
    
    fetch(`https://api-ratp.pierre-grimaud.fr/v4/schedules/metros/${lineValue}/${stationValue}/${destinationValue}`,{
      method:"get"
    })
    .then(response=>response.json())
    .then(data=>{
      console.log(data.result)
      destinationResult.innerHTML = "Direction : " + selectDestination.value;
      stationResult.innerHTML = "Station : " + selectStation.value;
      firsttimeResult.innerHTML = data.result.schedules[0].message;
      scdtimeResult.innerHTML = data.result.schedules[1].message;

      if (
        data.result.schedules[0].message === "Train a quai" ||
        data.result.schedules[0].message === "Train a l'approche" ||
        data.result.schedules[0].message === "Train retarde"
      ) {
        firsttimeResult.classList.add("here");
      } else {
        firsttimeResult.classList.remove("here");
      }
      if (
        data.result.schedules[1].message === "Train a quai" ||
        data.result.schedules[1].message === "Train a l'approche" ||
        data.result.schedules[1].message === "Train retarde"

      ) {
        scdtimeResult.classList.add("here");
      } else {
        scdtimeResult.classList.remove("here");
      }
    })
  });
}
Init()