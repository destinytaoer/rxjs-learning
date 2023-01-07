import { Observable, of, range, from, fromEvent, interval, timer } from 'rxjs';

// const source = new Observable((observer) => {
//   observer.next('Jerry');
//   observer.next('Anna');
// });
// console.log('start');
// source.subscribe(console.log);
// console.log('end');

// of(1, 2, 3).subscribe(console.log);
// range(1, 3).subscribe(console.log);

// 数组
// from([1, 2, 3]).subscribe(console.log);

// 字符串
// from("hello world!").subscribe(console.log);

// promise
// from(
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("promise");
//     }, 1000);
//   })
// ).subscribe(console.log);

// fromEvent(document.body, "click").subscribe(console.log);

// interval(1000).subscribe(console.log)
// timer(1000).subscribe(console.log);
// timer(1000, 1000).subscribe(console.log);
