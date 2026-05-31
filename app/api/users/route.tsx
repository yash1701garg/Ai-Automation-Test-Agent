import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    const user = await currentUser();

    try {
        const userResult = await db.select().from(users).where(eq(users.email, user?.primaryEmailAddress?.emailAddress??''));

        if(userResult.length==0){
            const newUser = await db.insert(users).values({
                email: user?.primaryEmailAddress?.emailAddress??'',
                name: user?.firstName ?? 'New User'
            }).returning()

            return NextResponse.json({user:newUser[0],created:true});   
        }else{
            return NextResponse.json({user:userResult[0],created:false})
        }

    } catch (error) {
        console.log('error in user route',error);
        return NextResponse.json({error:'Failed to save user'},{status:500})
    }
}