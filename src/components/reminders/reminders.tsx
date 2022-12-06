import {
  component$,
  useStore,
  useStylesScoped$,
  $,
  useResource$,
  Resource,
  useClientEffect$,
} from "@builder.io/qwik";
import styles from "./reminders.css?inline";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "~/firebase";
import { Reminder, ReminderRow } from "./reminder.model";

export interface ReminderProps {
  displayAddReminder: boolean;
  showOnlyFutureReminder: boolean;
  limitReminders: number | null;
}

export const Reminders = component$((props: ReminderProps) => {
  useStylesScoped$(styles);
  const state = useStore({
    date: new Date().valueOf(),
    address: undefined,
    info: undefined,
    note: undefined,
    submitCount: 0,
    user: "",
  });

  useClientEffect$(() => {
    state.user = String(localStorage.getItem("uid"));
    state.submitCount += 1;
  });

  const handleInputChange = $((event: any) => {
    const target = event.target;
    const value =
      target.type === "date" ? new Date(target.value).valueOf() : target.value;
    const name: "address" | "info" | "note" = target.name;
    state[name] = value;
  });

  const submitWeight = $(async (event: any) => {
    event.preventDefault();
    state.submitCount += 1;
    try {
      await addDoc(collection(db, "appointment"), {
        date: state.date,
        address: state.address,
        info: state.info,
        note: state.note,
        userId: state.user,
      });
    } catch (err) {
      alert(err);
    }
  });

  const reminderResouce: any = useResource$(async ({ track }) => {
    track(() => state.submitCount);

    const colRef = collection(db, "appointment");
    // const limit: number = props.limitReminders ? props.limitReminders : 100; TODO: Add limit
    let queryValue = query(colRef, orderBy("date", "desc"));

    if (props.showOnlyFutureReminder) {
      queryValue = query(
        colRef,
        orderBy("date", "desc"),
        where("date", ">=", new Date().valueOf())
      );
    }

    const res = await getDocs(queryValue);

    const newData = [] as Reminder[];
    res.forEach((r) => {
      // TODO: Fix query - composite indexes
      if ((r.data() as Reminder).userId == state.user) {
        newData.push({ ...r.data(), id: r.id } as ReminderRow);
      }
    });

    return newData;
  });

  return (
    <div>
      {!props.showOnlyFutureReminder && (
        <div style="margin-top: 20px">
          <div style="float:left;margin-right:10px; margin-bottom: 20px">
            <label style="font-size: 12px" for="info">
              Info
            </label>
            <input
              style="width: 80px"
              type="text"
              id="info"
              value={state.info}
              name="info"
              onChange$={handleInputChange}
            />
          </div>
          <div style="float:left;margin-right:10px; margin-bottom: 20px">
            <label style="font-size: 12px" for="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={new Date(state.date).toISOString().substring(0, 10)}
              name="date"
              onChange$={handleInputChange}
            />
          </div>
          <div style="float:left;margin-right:10px; margin-bottom: 20px">
            <label style="font-size: 12px" for="address">
              Address
            </label>
            <input
              style="width: 80px"
              type="text"
              id="address"
              value={state.address}
              name="address"
              onChange$={handleInputChange}
            />
          </div>
          <div style="float:left;margin-right:10px; margin-bottom: 20px">
            <label style="font-size: 12px" for="note">
              Note
            </label>
            <input
              style="width: 120px"
              type="text"
              id="note"
              value={state.note}
              name="note"
              onChange$={handleInputChange}
            />
          </div>
          <div style="float: right; margin-right:15px; margin-top: 7px; width: 50px">
            <button
              id="submitBtn"
              onClick$={submitWeight}
              style={{
                "background-color": "#04AA6D",
                border: "none",
                color: "white",
                padding: "4px 8px",
                "text-decoration": "none",
                margin: "4px 2px",
                cursor: "pointer",
              }}
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      <Resource
        value={reminderResouce}
        onPending={() => <>Loading...</>}
        onRejected={(error) => <>Error: {error.message}</>}
        onResolved={(repos: ReminderRow[]) => {
          const maxHeight = props.showOnlyFutureReminder ? "100px" : "300px";
          return (
            <div style={{ maxHeight, overflow: "scroll", clear: "both" }}>
              <ol style={{ margin: "5px", padding: "5px" }}>
                {repos.map((repo) => {
                  const opacity =
                    repo.date >= new Date().setUTCHours(0, 0, 0, 0).valueOf()
                      ? 1
                      : 0.5;
                  return (
                    <>
                      <li style={{ opacity: opacity }}>
                        <p style={{ fontSize: "16px", fontWeight: "600" }}>
                          {repo.info}
                        </p>
                        <p>
                          {new Date(repo.date).toISOString().substring(0, 10)} [
                          {repo.address}]
                        </p>
                        <p>** {repo.note}</p>
                      </li>
                    </>
                  );
                })}
              </ol>
            </div>
          );
        }}
      />
    </div>
  );
});
