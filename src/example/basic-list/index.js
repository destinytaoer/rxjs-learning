import {
    BehaviorSubject, combineLatest,
    concatMap,
    debounceTime,
    distinctUntilChanged,
    filter,
    fromEvent,
    map, mapTo, merge, scan, share,
    shareReplay, startWith,
    switchMap, take, tap,
    withLatestFrom
} from "rxjs";
import {getSearchResult, getSuggestions} from "./dataUtils";
import {
    fillAutoSuggestions,
    fillSearchResult, loaded,
    loading,
    updateForksSort,
    updatePageNumber,
    updateStarsSort
} from "./domUtils";

const searchInput = document.querySelector('#keyword')
const searchInput$ = fromEvent(searchInput, 'input')
const searchValue$ = searchInput$.pipe(
    // 获取输入框的值
    map(e => e.target.value),
)

// auto complete 功能
searchValue$.pipe(
    // 减少请求
    debounceTime(700),
    // 过滤空的查询
    filter(value => value),
    // 与上一次查询的值一样时, 不重新进行查询
    distinctUntilChanged(),
    // 转换为请求
    switchMap(getSuggestions),
).subscribe({
    next: fillAutoSuggestions,
})

const searchBtn = document.querySelector('#search')
const searchBtnClick$ = fromEvent(searchBtn, 'click');

// 点击搜索查询
const searchByKeyword$ = searchBtnClick$.pipe(
    // 获取最新的 searchValue
    // withLatestFrom(
    //     // 需要增加初始值, 避免在 searchValue$ 没有发送值的情况下, 触发 click 无效的问题
    //     // 当然, 初始值为空也会被后面过滤掉
    //     searchValue$.pipe(startWith(''))
    // ),
    // map(([, y]) => y),

    // 另外一个获取 value 的方法, 利用 shareReplay 和 take
    // 把 searchValue 改造成每次订阅时, 都发送最后一次的值
    // 这种方式更复杂, 且强行加上了 share 相关的 subject 概念
    // switchMap(() =>
    //     searchValue$.pipe(
    //         // 这里还需要加上初始值, 因为在没有发送过值的情况下, 是获取不到的
    //         startWith(''),
    //         shareReplay(1),
    //         take(1)
    //     )
    // ),

    // 或者直接获取 dom 的值更简单
    map(() => searchInput.value),
    // tap(console.log),
    // 去掉空值
    filter(value => value),
)

// 使用 BehaviorSubject 具有初始值, 来保存排序相关的值
const sortBy$ = new BehaviorSubject({sort: 'stars', order: 'desc'});

const sortStars = document.querySelector('#sort-stars')
const sortForks = document.querySelector('#sort-forks')
const sortStart$ = fromEvent(sortStars, 'click').pipe(mapTo('stars'))
const sortForks$ = fromEvent(sortForks, 'click').pipe(mapTo('forks'))

// 合并 sortStars$ 和 sortForks$, 执行相同的逻辑就可以进行 merge
const currentSort$ = merge(sortStart$, sortForks$)
currentSort$.subscribe((sortField) => {
    if (sortField === sortBy$.value.sort) {
        sortBy$.next({
            sort: sortField,
            order: sortBy$.value.order === 'asc' ? 'desc' : 'asc'
        });
    } else {
        sortBy$.next({
            sort: sortField,
            order: 'desc'
        });
    }
})

// 更新排序按钮
const sortByStars$ = sortBy$.pipe(filter(sort => sort.sort === 'stars'))
sortByStars$.subscribe(sort => {
    updateStarsSort(sort);
});
const sortByForks$ = sortBy$.pipe(filter(sort => sort.sort === 'forks'))
sortByForks$.subscribe(sort => {
    updateForksSort(sort);
});

// 页数
const perPage = document.querySelector('#per-page')
const perPage$ = fromEvent(perPage, 'change').pipe(
    map(event => +event.target.value)
);

// 页码
const previous = document.querySelector('#previous-page')
const next = document.querySelector('#next-page')
const previousPage$ = fromEvent(previous, 'click').pipe(mapTo(-1));
const nextPage$ = fromEvent(next, 'click').pipe(mapTo(1));

const initPage = 1
const currentPage$ = merge(previousPage$, nextPage$).pipe(
    // 相当于 reduce
    scan((acc, cur) => {
        const nextPage = acc + cur;
        // 限制最小为 1
        return Math.max(1, nextPage);
    }, initPage)
)
// 更新页码
currentPage$.subscribe(updatePageNumber)

// 将所有条件都组合起来, 每次条件更新都获取到最新的值的组合
// 注意:所有 Observable 参数都需要有值才会去搜索, 所以部分参数需要指定默认值
const search$ = combineLatest([
    searchByKeyword$,
    sortBy$,
    currentPage$.pipe(startWith(1)),
    perPage$.pipe(startWith(10))
]);

// 将搜索条件转换为搜索请求
const searchResult$ = search$.pipe(
    tap(console.log),
    switchMap(([keyword, sort, page, perPage]) =>
        getSearchResult(keyword, sort.sort, sort.order, page, perPage)
    ),
    // 由于 searchResult 需要被订阅两次, 但是 ajax 请求本身是 cold Observable, 需要通过 share 转换为 hot
    share(),
);

search$.subscribe({
    next: () => {
        // 开始搜索
        loading()
    }
})
// 拿到搜索结果去展示
searchResult$.subscribe({
    next: (result) => {
        // 结束搜索
        loaded()
        // 填充数据
        fillSearchResult(result.data)
    }
})
// 错误处理
const errorResult$ = searchResult$.pipe(
    filter(result => !result.success)
)
errorResult$.subscribe(result => {
    alert(result.message);
});
