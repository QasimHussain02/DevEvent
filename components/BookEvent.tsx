'use client';
import {bookingEvent} from "@/lib/actions/actions.booking";
import {useState} from "react";
import posthog from "posthog-js";

const BookEvent = ({eventId,slug} : {eventId:string,slug:string}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = async (event: React.FormEvent) => {
       event.preventDefault();
        const {success} = await bookingEvent({eventId,slug,email});
        if (success) {
            setSubmitted(true)
            posthog.capture("event booked",{eventId,slug,email})
            setEmail("");
            }
        else{
            console.error("booking event failed");
            posthog.captureException("could not book")
        }
    }
    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>

    )
}
export default BookEvent
