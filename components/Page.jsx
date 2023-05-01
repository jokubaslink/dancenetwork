import { UseAuth} from "@/context/AuthContext";
import Image from "next/image";
import noUserImg from "../assets/Avatar.png";
import { useEffect, useState } from "react";
import Timestamp from "./Timestamp";
import Feed from "./Feed";
import Post from "./Post";
import { db } from "@/firebase";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRouter } from "next/router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

export default function Page({ type, data }) {
  const { currentUser } = UseAuth();
  const [posts, setPosts] = useState();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    getEvents();

  }, []);

  function getEvents() {
    if (type === "bookmarks") {
      const eventsArray = [];
      let counter = 0;
      data.forEach((event) => {
        counter++;
        const eventObject = {
          id: counter,
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        };
        eventsArray.push(eventObject);
      });
      setEvents(eventsArray);
    }
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex-col flex  border-gray-500 p-6 border-b-2">
        <div className="flex items-center md:space-x-4">
          {currentUser.photoURL ? (
            <Image
              className="rounded-full hidden md:block  border-black border-2 h-[50px]"
              height={50}
              width={50}
              src={currentUser.photoURL}
              alt='User Profile Picture'
            />
          ) : (
            <Image
              className="rounded-full hidden md:block border-black border-2"
              alt='User Profile Picture'
              height={50}
              width={50}
              src={noUserImg}
            />
          )}
          <h2 className="mr-4 md:mr-0">Username: {currentUser.displayName}</h2>
          {type === "bookmarks" && (
            <button onClick={() => setCalendarOpen(!calendarOpen)}>
              <CalendarMonthIcon />
            </button>
          )}

          {type === "profile" && (
            <button onClick={() => router.push("/settings")}>
              <SettingsIcon />
            </button>
          )}
        </div>
      </div>
      {/*  */}
      <div className="border-b-2 border-gray-500">
        {type === "profile" ? (
          <h2 className="font-bold text-xl m-2">
            {currentUser.displayName}'s posts:
          </h2>
        ) : (
          <h2 className="font-bold text-xl m-2">
            {currentUser.displayName}'s bookmarks:
          </h2>
        )}
      </div>
      <div>
        {!calendarOpen && (
          <>
            {data.length > 0 &&
              data.map((post) => (
                <Post post={post} id={post.postId} key={post.postId} />
              ))}
            {data.length === 0 && (
              <div className="pt-16">
                <h2 className="text-2xl text-center">
                  {type === "profile"
                    ? "There is no created posts!"
                    : "There is no bookmarked posts!"}
                </h2>
              </div>
            )}
          </>
        )}
        {/* ! BOOKMARK NEPASALINA IS PAGE! */}
        {calendarOpen && (
          <div className="w-full h-[800px]">
            <Calendar
              events={events}
              localizer={localizer}
              views={["month", "week", "day"]}
              startAccessor="start"
              endAccessor="end"
            />
          </div>
        )}

        <div className="flex flex-col p-4 h-64 space-y-2"></div>
      </div>
    </div>
  );
}
