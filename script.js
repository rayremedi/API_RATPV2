// variable linked to the the select tag
let selectLine = document.querySelector("#selectLine");
let selectStation = document.querySelector("#selectStation");
let selectDestination = document.querySelector("#selectDestination");
let btn = document.querySelector("#btn");
let lineResult = document.querySelector("#lineResult");
let destinationResult = document.querySelector("#destinationResult");
let stationResult = document.querySelector("stationResult");
let firsttimeResult = document.querySelector("#time");
let scdtimeResult = document.querySelector("#time2");

function Init() {
  getLines();
  getLineValue();
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
Init()

function getLineValue() {
  selectLine.addEventListener("change", () => {
    let lineValue = selectLine.value;
    fetch(
      `https://api-ratp.pierre-grimaud.fr/v4/stations/metros/${lineValue}`,
      {
        method: "get"
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.result);
        //use the childNodes Property to send a node list 
        //add a condition that state if selectStation returns a node lis of children 
        //while selectStation returns the first node child,remove the old first node Child
        if(selectStation.childNodes) {
        console.log(selectStation.childNodes)

          while(selectStation.firstChild){
            selectStation.removeChild(selectStation.firstChild);
            
          }
        }
        const allMetroStations = data.result.stations;
        allMetroStations.forEach(element=>{
          let stationOption = document.createElement("option");
          let stationName = document.createTextNode(element.name);
          stationOption.appendChild(stationName);
          selectStation.appendChild(stationOption);
        })
      });
  });
}
Init()