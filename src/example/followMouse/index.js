import {delay, fromEvent, map} from "rxjs";

const imgList = document.getElementsByTagName('img');
const movePos = fromEvent(document, "mousemove").pipe(
  map(
    (e) => ({x: e.clientX, y: e.clientY})
  )
);

function followMouse(DOMArr) {
  const delayTime = 600;
  DOMArr.forEach((img, index) => {
    movePos.pipe(delay(delayTime * (Math.pow(0.65, index) + Math.cos(index / 4)) / 2)).subscribe((pos) => {
      img.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    })
  })
}

followMouse(Array.from(imgList))
