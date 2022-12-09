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
      `https://api.newscatcherapi.com/v2/search?q=diabetes`,
      {
        mode: 'cors', 
        headers: {
          'x-api-key': NEWS_API_KEY,
          'User-Agent' : 'diabetes-app',
          'Accept': '*/*',
        },
      }
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
    <>
      <div>
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
                  height: "220px",
                  overflow: "scroll",
                  overflowX: "hidden",
                  paddingTop: "20px",
                }}
              >
                {newsList?.map((news) => {
                  return (
                    <li>
                      [{news.author}] {news.title}
                      <a target="_blank" href={news.link}>
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
    </>
  );
});
