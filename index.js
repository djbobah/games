import { data } from "./data.js";
console.log(data);

const gameName = document.querySelector(".game-name");
const dragObject = document.querySelector(".drag-object");
const taskAndProgress = document.querySelector(".task-and-progress");
const targetObject = document.querySelector(".target-object");

const targetArea = document.querySelector(".target-area");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const message = document.querySelector(".message");

gameName.innerHTML = data.textTitle;

console.log();

taskAndProgress.querySelector(".task").innerHTML = data.textTask0;

targetObject.style.backgroundImage = `url(${data.linkBackground})`;

let holdStartTime;
let holdDuration = 3000; // Duration to hold in milliseconds (3 seconds)
let holding = false;
let progressInterval;

dragObject.addEventListener("mousedown", (e) => {
  const offsetX = dragObject.getBoundingClientRect().left;
  const offsetY = dragObject.getBoundingClientRect().top;

  function onMouseMove(e) {
    dragObject.style.left = `${e.clientX - offsetX}px`;
    dragObject.style.top = `${e.clientY - offsetY}px`;

    const dragRect = dragObject.getBoundingClientRect();

    // console.log(targetArea.getBoundingClientRect());
    const targetRect = targetArea.getBoundingClientRect();
    if (
      dragRect.left >= targetRect.left &&
      dragRect.top >= targetRect.top &&
      dragRect.right <= targetRect.right &&
      dragRect.bottom <= targetRect.bottom
    ) {
      if (!holding) {
        holdStartTime = Date.now();
        holding = true;
        message.textContent = "Keep holding...";
        progressInterval = setInterval(updateProgress, 100);
      }
    } else {
      if (holding) {
        holding = false;
        message.textContent = "Drag the object to the target area and hold!";
        clearInterval(progressInterval);
        progress.style.width = "0";
      }
    }
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    if (holding) {
      holding = false;
      const holdTime = Date.now() - holdStartTime;
      clearInterval(progressInterval);
      progress.style.width = "0";

      if (holdTime >= holdDuration) {
        message.textContent = "Bleeding stopped! Well done!";
      } else {
        message.textContent = "You need to hold longer to stop the bleeding!";
      }
    }

    dragObject.style.left = "50px";
    dragObject.style.top = "50px";
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

function updateProgress() {
  const elapsedTime = Date.now() - holdStartTime;
  const progressPercentage = Math.min((elapsedTime / holdDuration) * 100, 100);
  progress.style.width = `${progressPercentage}%`;
}
