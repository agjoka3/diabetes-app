import { component$, useStore, $, useWatch$ } from "@builder.io/qwik";
import { NEWS_API_KEY } from "~/keys";
import { NewsModel } from "./news.model";

export default component$(() => {
  const state = useStore({
    searchValue: "",
    newsList: [] as NewsModel[],
  });

  const searchChanged = $(() => {
    fetch(
      `https://newsapi.org/v2/everything?q='diabetes ${state.searchValue}'&from=2022-11-09&to=2022-11-09&sortBy=popularity&apiKey=${NEWS_API_KEY}`
    )
      .then((res) => res.json())
      .then((res: { articles: NewsModel[] }) => {
        state.newsList = res.articles;
        console.log("CHECK : ", res);
      })
      .catch(console.log);
  });

  useWatch$(({ track }) => {
    console.log("Use watch!!");
    track(() => state.searchValue);
    searchChanged();
    const timer = setTimeout(() => {
      console.log("POP: ", state.searchValue);
      // searchChanged();
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <div>
      <div class="topnav">
        <input
          value={state.searchValue}
          onInput$={(event) =>
            (state.searchValue = (event.target as HTMLInputElement).value)
          }
        />
      </div>

      <div>
        {(state.newsList || []).map((news: NewsModel) => {
          // TODO: Refactor in a new component
          return (
            <div>
              <li>
                [{news.source.name}] {news.title}
              </li>
            </div>
          );
        })}
      </div>
    </div>
  );
});
