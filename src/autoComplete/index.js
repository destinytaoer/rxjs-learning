import { fromEvent, debounceTime, switchMap, map, filter } from 'rxjs';
const url = 'https://zh.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&origin=*';

const getSuggestList = (keyword) =>
  fetch(url + '&search=' + keyword, { method: 'GET', mode: 'cors' }).then((res) => res.json());

const searchDOM = document.getElementById('search');
const listDOM = document.getElementById('suggest-list');
const render = (suggestArr = []) => {
  listDOM.innerHTML = suggestArr.map((item) => '<li>' + item + '</li>').join('');
};

const keyword = fromEvent(searchDOM, 'input');
const selectItem = fromEvent(listDOM, 'click');

keyword
  .pipe(
    debounceTime(300),
    switchMap((e) => getSuggestList(e.target.value)).pipe(map((e, res) => res[1]))
  )
  .subscribe((list) => render(list));

selectItem
  .pipe(
    filter((e) => e.target.matches('li')),
    map((e) => e.target.innerText)
  )
  .subscribe((value) => {
    searchDOM.value = value;
    render();
  });
