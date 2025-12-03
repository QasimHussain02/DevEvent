import React from 'react'
import Link from "next/link";
import Image from "next/image";
interface Props {
    title: string,
    image: string,
    slug: string,
    date: string,
    time: string,
    location: string,
}
const EventCard = ({title,image,slug,date,time,location} : Props) => {
    return (
        <Link href={`/events/${slug}`} id={"event-card"}>
            <Image src={image} alt={"logo"} height={410} width={300} />
            <div className={"flex flex-row gap-2"}>
                <Image src={"/icons/pin.svg"} alt={"location"} height={24} width={24} />
                <p>{location}</p>
            </div>
            <p className={"title"}>{title}</p>
            <div className={"datetime"}>
                <div>
                    <Image src={"/icons/clock.svg"} alt={"clock"} height={24} width={24} />
                    <p>{time}</p>

                </div>
                <div>
                    <Image src={"/icons/calendar.svg"} alt={"calender"} height={24} width={24} />
                    <p>{date}</p>

                </div>
            </div>
        </Link>
    )
}
export default EventCard
