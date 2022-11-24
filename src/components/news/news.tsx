import {
  component$,
  useStore,
  $,
  useResource$,
  Resource,
  ResourceReturn,
} from "@builder.io/qwik";
import { NEWS_API_KEY } from "~/keys";
import { NewsModel } from "./news.model";

export default component$(() => {
  const state = useStore({
    searchValue: "",
    newsList: [] as NewsModel[],
  });

  const searchChanged = $(() => {
    return fetch(
      `https://newsapi.org/v2/everything?q='diabetes ${state.searchValue}'&from=2022-11-09&to=2022-11-09&sortBy=popularity&apiKey=${NEWS_API_KEY}`
    )
      .then((res) => res.json())
      .then((res: { articles: NewsModel[] }) => {
        state.newsList = res.articles;
        return res.articles;
      })
      .catch(console.log);
  });

  const newsResource = useResource$(({ track }) => {
    track(() => state.searchValue);
    return searchChanged();
  });

  return (
    <div>
      <div class="topnav">
        <input
          style={{ width: "300px" }}
          placeholder="Search news here"
          value={state.searchValue}
          onInput$={(event) =>
            (state.searchValue = (event.target as HTMLInputElement).value)
          }
        />
      </div>

      {
        <Resource
          value={newsResource as ResourceReturn<NewsModel[]>}
          onPending={() => <>Loading...</>}
          onRejected={(error) => <>Error: {error.message}</>}
          onResolved={(newsList: NewsModel[]) => {
            return (
              <div
                style={{
                  height: "200px",
                  overflow: "scroll",
                  overflowX: "hidden",
                  paddingTop: "20px",
                }}
              >
                {newsList?.map((news) => {
                  return (
                    <li>
                      [{news.source.name}] {news.title}
                      <a target="_blank" href={news.url}>
                        [details]
                      </a>
                    </li>
                  );
                })}
              </div>
            );
          }}
        />
      }
      <p>Add Reminders Here</p>
      <p>Add Other Modules in Tabs Here</p>
    </div>
  );
});
