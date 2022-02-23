import { concatMap, takeUntil, fromEvent, withLatestFrom } from 'rxjs';

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
    withLatestFrom(mouseDown, (move, down) => {
      // top --> min: 0 max: window.innerHeight - video.height
      // left --> min 0 max: window.innerWidth - video.width
      return {
        x: move.clientX - down.offsetX,
        y: move.clientY - down.offsetY,
      };
    })
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
