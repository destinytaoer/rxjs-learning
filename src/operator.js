import { concatMap, map, takeUntil, fromEvent } from 'rxjs';

const dragBox = document.createElement('div');
dragBox.style.backgroundColor = 'lightblue';
dragBox.style.width = '100px';
dragBox.style.height = '100px';

document.body.appendChild(dragBox);

const mouseDown = fromEvent(dragBox, 'mousedown');
const mouseMove = fromEvent(document.body, 'mousemove');
const mouseUp = fromEvent(document.body, 'mouseup');

mouseDown
  .pipe(
    concatMap(() => mouseMove.pipe(takeUntil(mouseUp))),
    map((e) => ({ x: e.clientX, y: e.clientY }))
  )
  .subscribe({
    next: (e) => {
      console.log(e);
      dragBox.style.position = 'absolute';
      dragBox.style.left = e.x + 'px';
      dragBox.style.top = e.y + 'px';
    },
    complete: () => console.log('complete'),
  });
