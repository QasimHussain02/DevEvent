import ExploreButton from "@/components/ExploreButton";
import EventCard from "@/components/EventCard";
import events from "@/work/events";


const Page = () => {
    return (
      <section>
          <h1 className={"text-center"}>The hub for every web dev <br /> Event You Can't Miss</h1>
          <p className={"text-center mt-5 text-xl"}>Hackathons,Events,meetups, All in one place</p>
          <ExploreButton />
          <div className={"mt-20 space-y-5"}>
              <h2 className={"text-2xl font-bold"}>Featured Events</h2>
              <ul className={"events list-none"}>
                  {events.map((element)=>(
                      <li key={element.title}> <EventCard {...element} /> </li>
                  ))}
              </ul>
          </div>
      </section>
    )
}
export default Page
