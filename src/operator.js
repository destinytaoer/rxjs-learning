import {
  concatMap,
  map,
  takeUntil,
  fromEvent,
  interval,
  mergeAll,
  take,
  first,
  of,
  concatAll,
  skip,
  takeLast,
  last,
  concatWith,
  startWith,
  mergeWith,
  mergeMap,
  combineLatestWith,
  zipWith,
  from,
  withLatestFrom,
  scan,
  buffer, bufferTime, bufferCount
} from 'rxjs';

const observer = {
  next: (value) => {
    console.log(value);
  },
  error: (err) => {
    console.log('Error: ' + err);
  },
  complete: () => {
    console.log('complete');
  }
}
// take
// interval(1000).pipe(take(3)).subscribe(observer)
// first
// interval(1000).pipe(first()).subscribe(observer)

// takeUntil: 直到某件事发生, 直接完成当前 observable
// const click = fromEvent(document, "click");
//
// interval(500).pipe(takeUntil(click)).subscribe(observer)

// skip: 跳过前 n 个
// interval(1000).pipe(skip(3)).subscribe(observer);

// takeLast: 取最后 n 个值
// 注意只有当 Observable 结束后, 才能知道哪些是最后的值, 结果是同步输出最后 n 个值, 并直接完成
// interval(1000).pipe(take(5), takeLast(2)).subscribe(observer)
// source : ----0----1----2----3----4----5|
// takeLast(2)
// example: ------------------------------(45)|

// last: 取最后一个值
// interval(1000).pipe(take(5), last()).subscribe(observer)

// startWith: 设置初始值, 这个值会立即发送出去
// interval(1000).pipe(startWith(100)).subscribe(observer)

// concatWith: 按顺序进行拼接 Observable, 逐个处理 Observable, 并将结果进行拼接
// const source1 = of(3)
// const source2 = of(4, 5, 6)
// interval(1000).pipe(take(3), concatWith(source1, source2)).subscribe(observer);
// source : ----0----1----2|
// source2: (3)|
// source3: (456)|
// concat()
// example: ----0----1----2(3456)|

// concatAll: 按顺序将二维 Observable 拆开, 二维 Observable 将按顺序执行
// const click = fromEvent(document, "click");
// click.pipe(map(() => of([1, 2, 3])), concatAll()).subscribe(observer)

// concatMap: map + concatAll
// const click = fromEvent(document, "click");
// click.pipe(concatMap(() => of([1, 2, 3]))).subscribe(observer)


// mergeWith: 同时处理多个 Observable, 输出结果合并
// interval(500).pipe(take(3), mergeWith(interval(300).pipe(take(6)))).subscribe(observer)
// source : ----0----1----2|
// source2: --0--1--2--3--4--5|
// merge()
// example: --0-01--21-3--(24)--5|

// mergeAll:
// interval(1000).pipe(
//   map(e => interval(500).pipe(take(15))),
//   mergeAll()
// ).subscribe(res => {
//   console.log(res)
// })
//
// interval(500).subscribe((res) => console.log("=====", res))

// mergeMap: map + mergeAll
// interval(1000).pipe(
//   mergeMap(e => interval(500).pipe(take(15))),
// ).subscribe(res => {
//   console.log(res)
// })
//
// interval(500).subscribe((res) => console.log("=====", res))

// combineLatestWith: 每发出一个结果, 就进行一个合并, 将所有 Observable 的最新值封装成一个数组返回
// interval(500).pipe(
//   take(3),
//   combineLatestWith(
//     interval(300).pipe(take(6)),
//   ),
//   map(([x, y]) => x + y)
// ).subscribe(observer)
// source : ----0----1----2|
// newest : --0--1--2--3--4--5|
//
// combineLatest(newest, (x, y) => x + y);
//
// example: ----01--23-4--(56)--7|
// interval(100).subscribe((res) => console.log("=====", res))

// zipWith: 取每个 observable 相同顺位的元素并传入 callback，也就是说每个 observable 的第 n 个元素会一起被传入 callback
// 最终结果的长度和 Observable 最少结果数一致
// interval(500).pipe(
//   take(3),
//   zipWith(interval(300).pipe(take(6))),
//   map(([x, y]) => x + y)
// ).subscribe(observer);
// source : ----0----1----2|
// newest : --0--1--2--3--4--5|
// zip(newest, (x, y) => x + y)
// example: ----0----2----4|

// withLatestFrom: 与 combineLatestWit 类似, 不过有主从关系, 只有当主 Observable 发出值时, 才会发送 combine 结果
// const some = from([0, 1, 0, 0, 0, 1]).pipe(
//   zipWith(interval(300)),
//   map(([x, y]) => x)
// )
// const main = from("hello").pipe(
//   zipWith(interval(500)),
//   map(([x, y]) => x),
//   withLatestFrom(some),
//   map(([x, y]) => {
//     return y === 1 ? x.toUpperCase() : x;
//   })
// ).subscribe(observer)
// main   : ----h----e----l----l----o|
// some   : --0--1--0--0--0--1|
//
// withLatestFrom(some, (x, y) =>  y === 1 ? x.toUpperCase() : x);
//
// example: ----h----e----l----L----O|


// scan: 同数组的 reduce
// from("hello").pipe(
//   zipWith(interval(1000)),
//   map(([x]) => x),
//   scan((acc, value) => acc + value)
// ).subscribe(observer)


// buffer: 缓存元素, 当传入的 Observable(辅助) 发送值之前, 缓存主 Observable 发送的值到一个数组中, 当辅助 Observable 发送值时, 才将缓存的数组发送出来
// interval(300).pipe(
//   buffer(interval(1000))
// ).subscribe(observer)

// bufferTime: 缓存一定时间内 Observable 发送的值
// interval(300).pipe(
//   // buffer(interval(1000))
//   // => 等同于
//   bufferTime(1000)
// ).subscribe(observer)

// bufferCount: 缓存一定数量的值
// interval(300).pipe(
//   bufferCount(3) // 每 3 个发送一次
// ).subscribe(observer)

// delay
