import ExploreButton from "@/components/ExploreButton";
import EventCard from "@/components/EventCard";
import {IEvent} from "@/database";
import {NextResponse} from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_PUBLIC_URL;

const Page = async () => {
    try {
        const data = await fetch(`${BASE_URL}/api/event`);
        var {events} = await data.json();
    }
    catch (error) {
        return NextResponse.json({ error:"could not fetch events" }, {status:400});
    }


    return (
      <section>
          <h1 className={"text-center"}>The hub for every web dev <br /> Event You Can't Miss</h1>
          <p className={"text-center mt-5 text-xl"}>Hackathons,Events,meetups, All in one place</p>
          <ExploreButton />
          <div className={"mt-20 space-y-5"}>
              <h2 className={"text-2xl font-bold"}>Featured Events</h2>
              <ul className={"events list-none"}>
                  {events.map((element : IEvent)=>(
                      <li key={element.title}> <EventCard {...element} /> </li>
                  ))}
              </ul>
          </div>
      </section>
    )
}

export default Page;

