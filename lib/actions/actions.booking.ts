'use server'
import connectDB from "@/lib/mongodb";
import {Booking} from "@/database";

export const bookingEvent = async ({eventId,slug,email} : {eventId: string,slug: string, email: string})=>{
    try {
        await connectDB();
       await Booking.create({eventId,slug,email})
        return {success: true};
    }
    catch (error) {
        return {success: false};
    }
}