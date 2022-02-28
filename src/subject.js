import {
  AsyncSubject,
  BehaviorSubject,
  combineLatest,
  connect,
  connectable,
  interval,
  map,
  multicast,
  publish,
  refCount,
  ReplaySubject,
  share,
  Subject,
  take,
} from 'rxjs';

const observerA = {
  next(v) {
    console.log('A next:', v);
  },
  error(e) {
    console.log('A error:', e);
  },
  complete() {
    console.log('A complete!');
  },
};
const observerB = {
  next(v) {
    console.log('B next:', v);
  },
  error(e) {
    console.log('B error:', e);
  },
  complete() {
    console.log('B complete!');
  },
};

// const subject = new Subject();
// subject.subscribe(observerA);

// // 可以直接 next
// subject.next(1);

// // 也可以通过 Observable 订阅
// const observable = interval(1000).pipe(take(3));
// observable.subscribe(subject);

// setTimeout(() => {
//   subject.subscribe(observerB);
// }, 1000);

// BehaviorSubject 订阅时, 就会发送一个当前最新值. 初始化时, 需要给定一个最新值
// const behaviorSubject = new BehaviorSubject(0);

// behaviorSubject.subscribe(observerA);
// behaviorSubject.next();

// ReplaySubject 订阅时, 就会重复发送最后的几个值, 初始化时, 需要给定值的个数
// 如果值的个数不够, 则有多少发送多少
// const replaySubject = new ReplaySubject(2);
// replaySubject.subscribe(observerA);
// replaySubject.next(1); // A next: 1
// // replaySubject.next(2); // A next: 2
// // replaySubject.next(3); // A next: 3

// setTimeout(() => {
//   replaySubject.subscribe(observerB);
//   // B next: 2
//   // B next: 3
// }, 1000);

// AsyncSubject 订阅后, 只有当完成时, 才会发送最新的值并触发完成完成事件
// 如果当前订阅时, 已经处于完成状态, 那么会立即发送最新值并触发完成事件
// const asyncSubject = new AsyncSubject();

// asyncSubject.subscribe(observerA);
// asyncSubject.next(1);
// asyncSubject.next(2);
// asyncSubject.next(3);
// asyncSubject.complete();
// // "A next: 3"
// // "A complete!"

// setTimeout(() => {
//   asyncSubject.subscribe(observerB);
//   // "B next: 3"
//   // "B complete!"
// }, 3000);

// 使用快捷方式进行组播 multicast
// const source = interval(1000).pipe(take(3), multicast(new Subject()));

// source.subscribe(observerA); // subject.subscribe(observerA)

// source.connect(); // source.subscribe(subject)

// setTimeout(() => {
//   source.subscribe(observerB); // subject.subscribe(observerB)
// }, 1000);

// v8 废弃了 multicast 方法, 使用 connectable/connect 等方法代替
// const source = interval(1000).pipe(take(3));
// const connectableSource = connectable(source, {
//   connector: () => new Subject(),
// });

// const subscriptionA = connectableSource.subscribe(observerA); // subject.subscribe(observerA)

// const subscription = connectableSource.connect(); // source.subscribe(subject)
// // subscription.unsubscribe(); // 整体退订需要使用 connect 回传的 subscription
// setTimeout(() => {
//   const subscriptionB = connectableSource.subscribe(observerB); // subject.subscribe(observerB)
//   subscriptionA.unsubscribe(); // 单独退订需要使用 connectable.subscribe 回传的 subscription
//   subscriptionB.unsubscribe();
// }, 1000);

// refCount 建立一个只要有订阅就会自动 connect 的 observable
// 只要订阅数变成 0, 就会自动停止发送值
// const source = interval(1000).pipe(take(3), multicast(new Subject()), refCount());

// source.subscribe(observerA); // 一订阅就立即 connect

// // source.connect(); // 此时没有 connect 方法

// setTimeout(() => {
//   source.subscribe(observerB);
// }, 1000);

// v8 写法, 使用 share 方法
// const connectableSource = interval(1000).pipe(
//   take(3),
//   // share({
//   //   connector: () => new Subject(),
//   // })
//   // connector 如果是简单的 Subject 可以省略不写
//   share()
// );

// connectableSource.subscribe(observerA);

// // connectableSource.connect(); // 没有 connect 方法
// setTimeout(() => {
//   connectableSource.subscribe(observerB);
// }, 1000);

// publish 简化 multicast, 此时还是组播, 需要 connect
// // const source = interval(1000).pipe(take(3), multicast(new Subject()));
// // =>
// const source = interval(1000).pipe(take(3), publish());
// source.subscribe(observerA);
// source.connect();

// setTimeout(() => {
//   source.subscribe(observerB);
// }, 1000);
// // publish 同样被废弃了, 使用 connectable 代替

// 如果 publish 使用了 selector 参数, 此时还变成了单播
// const source = interval(1000).pipe(
//   take(3),
//   publish((v) => combineLatest([v, v]))
// );
// source.subscribe(observerA);

// 使用 connect 方法代替
// const source = interval(1000).pipe(
//   take(3),
//   connect((source) => combineLatest([source, source]))
// );
// source.subscribe(observerA);

// const source = interval(1000);
// const subject = new Subject();

// subject.subscribe(observerA);
// subject.subscribe(observerB);

// 使用 subject.pipe 处理后的 Observable 依然需要等待 subject 的派发
// 这里执行错误并不会影响到原来的 subject
// const example = subject.pipe(
//   map((v) => {
//     if (v === 1) {
//       throw new Error(1);
//     }
//     return v;
//   })
// );
// example.subscribe(
//   (x) => {
//     console.log('C next:', x);
//   },
//   (error) => console.log('C Error:' + error)
// );

// 如果订阅的 observer 的 next 报错,不会影响其他的 observer
// 但是执行 error, 因为实际上 subject 没有报错
// subject.subscribe({
//   next: () => {
//     throw new Error(1);
//   },
//   error: (e) => {
//     console.log('error', e);
//   },
// });

// source.subscribe(subject);
