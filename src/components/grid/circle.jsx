export default function Circle(){
  
  return(
    <div>
      <form>
        <label htmlFor="x">x: </label>
        <input name="x" id="x"></input>
        <label htmlFor="y">y: </label>
        <input name="y" id="y"></input>
        <label htmlFor="radius">radius: </label>
        <input name="radius" id="radius"></input>
        <button type="submit"onClick={(event)=> {onSubmit(event)}}></button>
      </form>
      <canvas id="canvas"height={500} width={500}></canvas>
    </div>
  )
}
function onSubmit(event){
  const canvas = document.getElementById("canvas");
  let [height, width] = [canvas.getBoundingClientRect().height, canvas.getBoundingClientRect().width];
  const ctx = canvas.getContext("2d");
  let form = event.target.form;
  let formData = new FormData(form);
  let [x, y, radius] = [formData.get("x"),formData.get("y"), formData.get("radius")];
  ctx.beginPath();
  ctx.arc(x*10+50, y*10+50, radius*10, 0,2*Math.PI);
  ctx.stroke();
  event.preventDefault();
  console.log(`x: ${x}, y: ${y}, radius: ${radius}`)
  console.log("yes");
}