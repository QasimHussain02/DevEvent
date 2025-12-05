import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {v2 as cloudinary} from "cloudinary";
import Event from "@/database/event.model"

export async function POST(req: NextRequest){
    try {
       await connectDB();
       const formData = await req.formData();
       let event;
       try{
           event = Object.fromEntries(formData.entries());

       }
       catch(err){
           return NextResponse.json({message:"Events not fetched", status:404});
       }
       const file = formData.get("image") as File;
       if(!file){
           return NextResponse.json({message:"No image file uploaded", status:400});
       }
        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        console.log(agenda)
       const arrayBuffer = await file.arrayBuffer();
       const buffer = Buffer.from(arrayBuffer);
       const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({resource_type:"image",folder:"my-app"},(error, result) => {
              if(error){
                  return reject(error);
              }
              resolve(result);
          }).end(buffer);
       });
       event.image= (uploadResult as {secure_url:string}).secure_url
       const eventData = await Event.create({...event,tags:tags,agenda:agenda});
       return NextResponse.json({message:"Event created successfully",event:eventData});
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({message:"Event couldnt be created" ,e: error instanceof Error? error: "unknown"} , {status:404});
    }
}
export async function GET(){
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({message:"event fetched successfully" , events:events});
    }
    catch(err){
        return Response.json({message:"Could not fetch data"} , {status:404});
    }
}