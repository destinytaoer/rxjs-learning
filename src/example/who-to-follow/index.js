import {combineLatestWith, fromEvent, map, mapTo, merge, mergeWith, share, startWith, switchMap} from "rxjs";
import {ajax} from "rxjs/ajax";

const refreshButton = document.querySelector(".refresh");
const closeButton1 = document.querySelector(".close1");
const closeButton2 = document.querySelector(".close2");
const closeButton3 = document.querySelector(".close3");

const refreshClick$ = fromEvent(refreshButton, "click");
const close1Click$ = fromEvent(closeButton1, "click");
const close2Click$ = fromEvent(closeButton2, "click");
const close3Click$ = fromEvent(closeButton3, "click");

const renderSuggestion = (suggestedUser, selector) => {
    console.log("render", selector)
    const suggestionEl = document.querySelector(selector);
    if (suggestedUser === null) {
        suggestionEl.style.visibility = "hidden";
    } else {
        suggestionEl.style.visibility = "visible";
        const usernameEl = suggestionEl.querySelector(".username");
        usernameEl.href = suggestedUser.html_url;
        usernameEl.textContent = suggestedUser.login;
        const imgEl = suggestionEl.querySelector("img");
        imgEl.src = "";
        imgEl.src = suggestedUser.avatar_url;
    }
};

const getUsers = () => {
    const randomOffset = Math.floor(Math.random() * 500);
    return ajax("https://api.github.com/users?since" + randomOffset);
}

const getRandomUserFormList = (users) => {
    const randomIndex = Math.floor(Math.random() * users.length)
    return users[randomIndex]
}

const request$ = refreshClick$.pipe(
    // 初始自动请求一次
    startWith("startup click"),
);

const response$ = request$.pipe(
    switchMap(() => getUsers()),
    map((response) => response.response),
    // 由于会被订阅三次, 所以使用 share 来共享
    share()
);

// response$.subscribe((users) => {
//     console.log("from response", users)
//     renderSuggestion(getRandomUserFormList(users), '.suggestion1')
//     renderSuggestion(getRandomUserFormList(users), '.suggestion2')
//     renderSuggestion(getRandomUserFormList(users), '.suggestion3')
// })

// 三个建议项需要独立的 close
// close1Click$.pipe(
//     startWith("start up click"),
//     // 每次 close 的时候, 从最新 response 中取一个值来渲染
//     combineLatestWith(response$),
//     map(([, users]) => getRandomUserFormList(users))
// ).subscribe((user) => {
//     console.log("from close", user)
//     renderSuggestion(user, '.suggestion1')
// })
//
// close2Click$.pipe(
//     startWith("start up click"),
//     // 每次 close 的时候, 从最新 response 中取一个值来渲染
//     combineLatestWith(response$),
//     map(([, users]) => getRandomUserFormList(users))
// ).subscribe((user) => {
//     console.log("from close", user)
//     renderSuggestion(user, '.suggestion2')
// })
//
// close3Click$.pipe(
//     startWith("start up click"),
//     // 每次 close 的时候, 从最新 response 中取一个值来渲染
//     combineLatestWith(response$),
//     map(([, users]) => getRandomUserFormList(users))
// ).subscribe((user) => {
//     console.log("from close", user)
//     renderSuggestion(user, '.suggestion3')
// })

// const suggestion1$ = close1Click$.pipe(
//     startWith("start up click"),
//     mapTo('suggestion1'),
//     // 每次 close 的时候, 从最新 response 中取一个值来渲染
//     combineLatestWith(response$),
//     map(([value, users]) => [getRandomUserFormList(users), value])
// )
//
// const suggestion2$ = close2Click$.pipe(
//     startWith("start up click"),
//     mapTo('suggestion2'),
//     combineLatestWith(response$),
//     map(([value, users]) => [getRandomUserFormList(users), value])
// )
//
// const suggestion3$ = close3Click$.pipe(
//     startWith("start up click"),
//     mapTo('suggestion3'),
//     combineLatestWith(response$),
//     map(([value, users]) => [getRandomUserFormList(users), value])
// )

// 封装 creation
const createSuggestionStream = (number) => {
    const closeButton = document.querySelector(`.close${number}`);
    const closeClick$ = fromEvent(closeButton, "click");
    return closeClick$.pipe(
        startWith("start up click"),
        // 映射成某个值, 来代替 renderSuggestion 时的 selector
        mapTo(`.suggestion${number}`),
        // 每次 close 的时候, 从最新 response 中取一个值来渲染
        combineLatestWith(response$.pipe(
            // 每次 refresh 时, 将值置为 null
            mergeWith(refreshClick$.pipe(map(() => null))),
            // 初始值设置为 null
            startWith(null),
        )),
        map(([selector, users]) => [getRandomUserFormList(users), selector])
    )
}
const suggestion1$ = createSuggestionStream(1)
const suggestion2$ = createSuggestionStream(2)
const suggestion3$ = createSuggestionStream(3)

// 简化subscribe
merge(suggestion1$, suggestion2$, suggestion3$)
    .subscribe(([user, selector]) => {
        renderSuggestion(user, selector)
    })
