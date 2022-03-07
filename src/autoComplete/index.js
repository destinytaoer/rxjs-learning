import {
  fromEvent,
  debounceTime,
  switchMap,
  map,
  filter,
  from,
  withLatestFrom,
  connectable,
} from 'rxjs';

const url = 'https://zh.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&origin=*';

const getSuggestList = (keyword) =>
  fetch(url + '&search=' + keyword, {method: 'GET', mode: 'cors'}).then((res) => res.json());

const searchDOM = document.getElementById('search');
const listDOM = document.getElementById('suggest-list');
const render = (suggestArr = []) => {
  listDOM.innerHTML = suggestArr.map((item) => '<li>' + item + '</li>').join('');
};

const keyword = fromEvent(searchDOM, 'input');
const selectItem = fromEvent(listDOM, 'click');

const searchObservable = connectable(keyword.pipe(
  debounceTime(300), // 防抖
  switchMap(
    // 每次的输入转化为每个请求, 但是只需要最新的请求即可, 所以使用 switch
    e => from(getSuggestList(e.target.value)).pipe(
      // 每个请求映射成返回的结果列表
      map(res => res[1])
    )
  )
));
searchObservable.subscribe({
  next: render
})

searchObservable.connect();

selectItem.pipe(
  // 只需要选中的元素是 li
  filter(e => {
    return e.target.matches("li")
  }),
  map(e => e.target.innerText)
).subscribe({
  next: (value) => {
    searchDOM.value = value;
  }
})
const focus = fromEvent(searchDOM, "focus");
const blur = fromEvent(document, "click");

focus.pipe(
  withLatestFrom(searchObservable),
  map(([, list]) => list)
).subscribe({
  next: render
})

blur.pipe(filter(e => e.target !== searchDOM))
  .subscribe({
    next: () => {
      render()
    }
  })
