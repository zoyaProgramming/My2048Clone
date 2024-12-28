import { createContext, useContext, useEffect, useReducer, useRef, useState, } from "react";
import { T } from "../test";

let animations = [];


function Tile({ value, setA, css, index , refreshState, setRefresh}) {


  
  let myRef = useRef(null);

  let s = "";
  /*if (Array.isArray(css)) {
    for (let string of css) {
      s = s + string;
    }
  }*/
  let a = refreshState;
  animations[index] = { ref: myRef, value: value !== undefined ? value : null };
  if (myRef.current !== null) {

  }
  //  animations[animations.length] = {ref: myRef, value: value!==undefined?value:null};

  if (value !== undefined) {
    let color = `rgb(${255},${228/Math.log2(value)}, ${200/Math.log2(value)})`;
    return (
      <div id = {Math.random()} key={Math.random()} ref={myRef} onKeyUp={() => { }} className={"inner-div--square" + s + " light"} onClick={() => {

      }} style ={{backgroundColor: color}}>
        <span>{value}</span>
      </div>)

  }
  else{
  return <div key={Math.random()} className={"inner-div--square"}></div>}
}
function newArray1() {
  let myArr = Array.apply(null, Array(16));
  let randIndex = Math.floor(Math.random() * myArr.length);
  let randIndex2 = Math.floor(Math.random() * (myArr.length - 1));
  myArr[randIndex] = { val: 2, css: [], changed: false};
  randIndex2 = randIndex2 < randIndex ? randIndex2 : (randIndex2 + 1)
  myArr[randIndex2] = { val: 2, css: [], changed: false };  
  
  return [myArr, [randIndex, randIndex2]];
}
function newArray() {
  let myArr = Array.apply(null, Array(16));
  myArr[0] = { val: 2, css: [], changed: false };  
  myArr[2] = { val: 2, css: [], changed: false };  
  
  
  return [myArr, [0, 2]];
}

function getIndexByCoordinates(x, y, size = 4) {
  return y * size + x;
}
function getCoordinatesByIndex(index, size) {
  // the fuck is this 
  // returns an x + y position from an array index
  let x = index % size;
  return [x, Math.floor(index/ size)];
}
const MyContext = createContext(null);
export { MyContext };



export default function Layout() {
  let [arr, taken] = newArray();
  const [state, setState] = useState({ arr: arr, numFree: 14, taken: taken , score: 2});
  let [greatestState, setGreatestState] = useState(2);
  let [refreshState, setRefresh] = useState(0);
  useDocument(state, setState, refreshState, setRefresh);
  let tiles = state.arr.map((tile, index) => {
    if (!tile) {
      
      
      return (<Tile index={index} refreshState={refreshState} setRefresh={setRefresh}></Tile>);
    } else {
      
      return (<Tile index={index} value={tile.val} css={tile.css ? tile.css : []}></Tile>)
    }
  })
  return (
    <>
    <h1 className="h1--display-score">{state.score}</h1>
    <button onClick={() => {setRefresh(refreshState + 1)}}> click me!!</button>
    <div className="outer-div--square" >
      {tiles}
    </div></>
  );
}



// problem: the
function useDocument(state, setState, refresh, setRefresh) {
  let [doc, setDoc] = useState(null);
  useEffect(() => {
    function moveAndAnimateTiles(event){ 
      //setRefresh(refresh + 1);
      let potentialValues = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if(!potentialValues.includes(event.code)){
        return null;
      }
      let stateAfterMovement = getStateAfterMovement(state, setState, event.code);
      
      animations.map((ref, index) => {
        if (ref.ref.current == null) {
          return null;
       
        
        } else if (ref && !isNaN(stateAfterMovement.transf[index])) {
          
          function getChangePixels(destinationIndex){
              let boundingRect = ref.ref.current.getBoundingClientRect();
              const delta = boundingRect.width + (boundingRect.width / 10);
              let [posX, posY] = getCoordinatesByIndex(index, 4);
              let [targetX, targetY] = getCoordinatesByIndex(destinationIndex, 4);
              let result = [(delta * (targetX - posX)), (delta * (targetY - posY))];
              if(isNaN(result[0]) || isNaN(result[1])){
                throw new Error("error getting the change in pixels for tile " + index + "'s movement: One of the deltas is NaN")
              }

              return result;
            
          }
          function getChangePixels2(destinationIndex, index){
            let boundingRect = ref.ref.current.getBoundingClientRect();
            const delta = boundingRect.width + (boundingRect.width / 10);
            let [posX, posY] = getCoordinatesByIndex(index, 4);
            let [targetX, targetY] = getCoordinatesByIndex(destinationIndex, 4);
            let result = [(delta * (targetX - posX)), (delta * (targetY - posY))];
            if(isNaN(result[0]) || isNaN(result[1])){
              throw new Error("error getting the change in pixels for tile " + index + "'s movement: One of the deltas is NaN")
            }

            return result;
          
        }
        ;
          let [deltaX, deltaY] = getChangePixels(stateAfterMovement.transf[index]);
          let keyframes = [{transform: `translate(${deltaX}px, ${deltaY}px)`}]
          ref.ref.current.animate(keyframes, {duration: 150, fill: "forwards" });
        } else if(ref){
          
          
        }
      });
      setTimeout(() => {
        
       let stateWithNewTiles = getRandomTilesLocation(stateAfterMovement, setState);

        setState(stateWithNewTiles );
      }, 150);
      document.removeEventListener("keyup", moveAndAnimateTiles)
      //pickRandom(state, setState)
    }
    document.addEventListener("keyup", moveAndAnimateTiles)
  }, [state])
  return doc;
}
function getRandomTilesLocation(data) {
  // broken
  // oh my lord 
  let newArr = [...data.arr]
  
  
  let newTaken = [JSON.parse(JSON.stringify(data.taken))]
  newTaken = [...Object.values(data.taken)]
  // random is the index of the 
  for (let i = 0; i < 1; i++) {
    newTaken = newTaken.sort((elem1, elem2)=> {
      if(elem1==elem2){
        return 0;
      } else if(elem1>elem2){
        return 1;
      } else {
        return -1
      }
    }
    );
    let randomTileIndex = Math.floor(Math.random() * (16 - newTaken.length));
    console.log(newTaken)
   // 
    if (newTaken.length && randomTileIndex < newTaken[0]) {
    //  
      newArr[randomTileIndex] = { val: 2 , changed: false};
      newTaken[newTaken.length] = randomTileIndex;
    } else {
      let numEmptyTiles = 0;
      let newIndex = 0;
      
      
      for (let j = 0; (numEmptyTiles <= randomTileIndex && newTaken.length > 0 && j<=16); j++) {
        // x is the number of tiles that aren't taken
        // searches through the array of  
        // 2048 tiles and checks if they're filled
        //  if they're not filled,
        // 7.4 + 12 + 18 + 
        // 
        if (!newTaken.includes(j) && j <= 15 && j>=0) {
          numEmptyTiles++;
  
          newIndex = j;
        } else if(j==16) {
          return { arr: newArr, taken: newTaken, numFree: 0, score: data.score};
          //
        }
      }
      
      newArr[newIndex] = {val: 2, changed: false};
      newTaken[newTaken.length] = newIndex;
    } 
  }
  
  //
  
  return { arr: newArr, taken: newTaken, numFree: data.numFree - 1, score: data.score};
// setData({ arr: newArr, taken: newTaken, numFree: newTaken.length });
///{ arr: [...arr], numFree: numFree, transf: original}


}


function getStateAfterMovement(inp, setState, type) {
  // glitches: 
  let arr = [...inp.arr];
  let numFree = inp.numFree;
  let taken = [...inp.taken];
  let score = inp.score;
  
  
  let deltaX=0;
  let deltaY=0;

  let m = 0; // right to left or left to right
  let animation = [];
  let original = [];
  switch (type) {
    case "ArrowUp":
      deltaY = -1;
      break;
    case "ArrowDown":
      deltaY = 1;
      m = 3;
      break;
    case "ArrowRight":
      deltaX = 1;
      m = 3;
      animation[0] = " animation";
      break;
    case "ArrowLeft":
      deltaX = -1;
      break;
  }

  let orderedNodesArray = createOrderedArray(arr, m, deltaX, deltaY);
  
  let s = ""

  for(let z = 0; z < arr.length; z++){
    let a = arr[z];
    if(a !== null && a !== undefined && typeof a.val == "number"){
      arr[z].changed = false;
    } 
    z++;
  }

  let references = {}; // one destination, multiple references
  for(let i = 0 ; i < orderedNodesArray.length; i++ ){
    let index = orderedNodesArray[i];
    if (arr[index] != null && arr[index] !== undefined) {
      s += index + "   ";
    }

    function tilePositionInsideBoard(m, posX, posY){

      return m == 0 ? (deltaY == 0 ? posX > m : posY > m) : (deltaY == 0 ? posX < m : posY < m);

    }

    function moveTile(arr, index){ 
      let tile = arr[index];
      if (tile !== null && tile !== undefined && typeof tile.val == "number") {
    //    s += index.toString() + "   ";
        let temp = tile.val;
        let [posX, posY] = getCoordinatesByIndex(index, 4);
        let isTilePositionInsideBoard = tilePositionInsideBoard(m, posX, posY)
        while (isTilePositionInsideBoard) {
        // while within the bounds of the 2048 tilse
          
          let a = getIndexByCoordinates(posX, posY); //  fthe index each time
          temp = arr[a].val;
          
          let b = getIndexByCoordinates(posX + deltaX, posY + deltaY);
          let index1 = taken.indexOf(a);
          
          if(arr[b] == undefined || arr[b] == null){
              // if the original 2 are 2 and 5, it will say 2, 5, and 6 are the original 2
              if (index1 >=0){
                taken.splice(index1, 1);
              }
              
              let changed = false;
              if (arr[a].changed){
                let existingReferences = references[a];
                let currentI = original.indexOf(a);
                if(Array.isArray(existingReferences) && existingReferences.includes(currentI)){
                  
                  references[b] = Array.isArray(references[b])?references[b]:[];
                  
                  references[b] = references[b].concat(existingReferences);
                  references[a] = null;
                  changed = true;
                }
              }
              if(!taken.includes(b)){
                taken[taken.length + 1] = b;
              }
              arr[b] = { val: temp, changed: changed};
              original[index] = b;
              
              arr[a] = undefined;
              //references[b][references[b].length] = index; 

          } else if ((arr[b].val !== undefined)&&(arr[b].val == arr[a].val) && arr[a].changed==false && arr[b].changed == false){
            
            if (index1 >=0){
              taken.splice(index1, 1);
            }
            arr[a] = undefined;
            
            if(!taken.includes(b)){
              taken[taken.length + 1] = b;
            }
            
            arr[b] = { val: temp + arr[b].val, changed: true };
            
            original[index] = b;

            references[b] = Array.isArray(references[b])?references[b]:[];
            if(!references[b].includes(index)){
              references[b][references[b].length] = index;
            }
            
    

            if(arr[b].val >inp.score){
              
              score = arr[b].val;
            }
            
          }
            posY += deltaY;
            posX += deltaX;
            isTilePositionInsideBoard = tilePositionInsideBoard(m, posX, posY);
        }

        // gives us the transformation;
        
      } else {
      
        let indexFound = taken.indexOf(index)
        
        if(indexFound >= 0){
          taken.splice(indexFound, 1);
        }
      }
    }
    //for(let k = 0;k< 4; k++){
    
      moveTile(arr, index)
   //}
  }
 // 
  let z = 0;
  for(let reference in references){
    let val = references[reference];
    if(val !== null){
      for(let originalPos of val){
        if(!original.includes(originalPos) && originalPos >= 0){
          original[originalPos] = Number.parseInt(reference);
        }
      }
    }
  }


  for(let a of arr){
    if(a !== null && a !== undefined && typeof a.val == "number"){
      arr[z].changed = false;
    }
    z++;
  }
   
   taken = JSON.parse(JSON.stringify(taken)).filter(element=> element !==null);

  console.log(taken)
  
  
  
  return ({ arr: JSON.parse(JSON.stringify(arr)), numFree, taken: taken, numFree: numFree, transf: [...original], score: score})

}

function getMoveUp(inp, setState, type) {
  let arr = [...inp.arr];
  let numFree = inp.numFree;
  let taken = [...inp.taken];
  let score = inp.score;
  
  
  let deltaX=0;
  let deltaY=-1;

  let m = 0; // goes until this number
  let animation = [];
  let original = [];


  let orderedNodesArray = createOrderedArray(arr, m, deltaX, deltaY);
  
  let s = ""

  // none of the tiles have been added together yet
  for(let i = 0; i < arr.length; i++){
    let a = arr[i];
    if(a !== null && a !== undefined && typeof a.val == "number"){
      arr[i].changed = false;
    }
    i++;
  }

  let references = {}; // one destination, multiple references
  for(let index of orderedNodesArray){
    if (arr[index] != null && arr[index] !== undefined) {
      s += index + "   ";
    }

    function tilePositionInsideBoard(posY){
      return  posY > 0;
    }

    function moveTile(arr, index){ 
      let tile = arr[index];
      if (tile !== null && tile !== undefined && typeof tile.val == "number") {
    //    s += index.toString() + "   ";
        
        let [posX, posY] = getCoordinatesByIndex(index, 4);
        while (posY > 0) {
        // while within the bounds of the 2048 tilse
        // the index of the original position
          let indexBeforeMovement = getIndexByCoordinates(posX, posY); //  fthe index each time
          let temp = arr[indexBeforeMovement].val;
          let indexAfterMovement = getIndexByCoordinates(posX, posY - 1);
        
          if (taken.indexOf(indexBeforeMovement) >= 0){
            taken.splice(taken.indexOf(indexBeforeMovement), 1);
          }
          if(arr[indexAfterMovement] == undefined){
              // if the original 2 are 2 and 5, it will say 2, 5, and 6 are the original 2
              let changed = false;
              if (arr[indexBeforeMovement].changed){
                let existingReferences = references[indexBeforeMovement];
                let currentI = original.indexOf(indexBeforeMovement);
                if(Array.isArray(existingReferences) && existingReferences.includes(currentI)){
                  references[indexAfterMovement] = Array.isArray(references[indexAfterMovement])?references[indexAfterMovement]:[];
                  references[indexAfterMovement] = references[indexAfterMovement].concat(existingReferences);
                  references[indexBeforeMovement] = null;
                  changed = true;
                }
              }
              taken[taken.length + 1] = indexAfterMovement;
              arr[indexAfterMovement] = { val: temp, changed: changed};
              original[index] = indexAfterMovement;
              arr[indexBeforeMovement] = undefined;
              //references[b][references[b].length] = index; 
          // this covers the case where the two tiles have the same value and there hasn't already been a sum
          } else if ((arr[indexAfterMovement].val == arr[indexBeforeMovement].val) && arr[indexAfterMovement].changed==false){
            
            arr[indexBeforeMovement] = undefined;
            taken[taken.length + 1] = indexAfterMovement;
            arr[indexAfterMovement] = { val: temp + arr[indexAfterMovement].val, changed: true };
            original[index] = indexAfterMovement;

            references[indexAfterMovement] = Array.isArray(references[indexAfterMovement])?references[indexAfterMovement]:[];
            references[indexAfterMovement][references[indexAfterMovement].length] = index;

            if(arr[indexAfterMovement].val >inp.score){
              
              score = arr[indexAfterMovement].val;
            }
            
          }
            posY += deltaY;
            posX += deltaX;
        }

        // gives us the transformation;
        
      } else {
        let indexFound = taken.indexOf(index)
        if(index >= 0){
        //
          taken.splice(indexFound, 1);
        }
      }
    }
    for(let k = 0;k< 4; k++){
      moveTile()
    }
  }
 // 
  let z = 0;
  for(let reference in references){
    let val = references[reference];
    if(val !== null){
      for(let originalPos of val){
        original[originalPos] = Number.parseInt(reference);
      }
    }
  }
  for(let a of arr){
    if(a !== null && a !== undefined && typeof a.val == "number"){
      if(original.includes())
      arr[z].changed = false;
    }
    z++;
  }
  return ({ arr: [...arr], numFree, taken: taken, numFree: numFree, transf: original, score: score})
}



function createOrderedArray(arr, start, x, y) {
  let q = []
  
  if(start == 0){ // right to left, up to down
    for(let i = 0; i< 4; i++){ // left to right 
      {
        let len = q.length;
        if(x == 0){
          
          q[len] = getIndexByCoordinates(0, i, 4);
          q[len+1] = getIndexByCoordinates(1, i, 4);
          q[len+2] = getIndexByCoordinates(2, i, 4);
          q[len+3]  = getIndexByCoordinates(3, i, 4);
        } else {
          q[len] = getIndexByCoordinates(i, 0, 4);
          q[len+1] = getIndexByCoordinates(i, 1, 4);
          q[len+2]= getIndexByCoordinates(i, 2, 4);
          q[len+3]  = getIndexByCoordinates(i, 3, 4);
        }
      }

    }
  } else if(start == 3){
    for(let i = 3; i>= 0; i--){
      let len = q.length;
      {  if(x == 0){
          q[len] = getIndexByCoordinates(0, i, 4);
          q[len+1] = getIndexByCoordinates(1, i, 4);
          q[len+2] = getIndexByCoordinates(2, i, 4);
          q[len+3]  = getIndexByCoordinates(3, i, 4);
        } else {
          q[len] = getIndexByCoordinates(i, 0, 4);
          q[len+1] = getIndexByCoordinates(i, 1, 4);
          q[len+2]= getIndexByCoordinates(i, 2, 4);
          q[len+3]  = getIndexByCoordinates(i, 3, 4);
        }
      }
    }
  }
  //
  return q;
}