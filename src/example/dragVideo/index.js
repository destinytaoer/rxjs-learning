import { fromEvent, filter, map, takeUntil, concatMap, withLatestFrom } from 'rxjs';

const anchor = document.getElementById('anchor');
const video = document.getElementById('video');

const scroll = fromEvent(document, 'scroll');
scroll.pipe(map((e) => anchor.getBoundingClientRect().bottom < 0)).subscribe((isOutOfView) => {
  if (isOutOfView) {
    video.classList.add('video-fixed');
  } else {
    video.classList.remove('video-fixed');
  }
});

const mouseDown = fromEvent(video, 'mousedown');
const mouseMove = fromEvent(document, 'mousemove');
const mouseUp = fromEvent(document, 'mouseup');

const dragging = mouseDown.pipe(
  // 只有当 video fixed 时, 才可拖拽
  filter(() => video.classList.contains('video-fixed')),
  concatMap(() => mouseMove.pipe(takeUntil(mouseUp)))
);

const validValue = (value, min, max) => {
  return Math.max(Math.min(value, max), min);
};
console.log(window.innerWidth, window.innerHeight);
console.log(video.getBoundingClientRect());
dragging
  .pipe(
    withLatestFrom(mouseDown, (move, down) => {
      // top --> min: 0 max: window.innerHeight - video.height
      // left --> min 0 max: window.innerWidth - video.width
      return {
        x: validValue(move.clientX - down.offsetX, 0, window.innerWidth - 320),
        y: validValue(move.clientY - down.offsetY, 0, window.innerHeight - 180),
      };
    })
  )
  .subscribe((pos) => {
    video.style.left = pos.x + 'px';
    video.style.top = pos.y + 'px';
  });
