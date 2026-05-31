import { NextRequest, NextResponse} from "next/server";
import {db} from "@/db";
import {userRepos} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request:NextRequest){
    try {
        const {repoId, userId, repoName, repoFullName, repoUrl, repoLanguage, private_, defaultBranch, owner} = await request.json();

        const result = await db.insert(userRepos).values({
            repoId: String(repoId),
            userId,
            repoName,
            repoFullName,
            repoUrl,
            repoLanguage,
            private_: private_ ?? false,
            defaultBranch,
            owner, 
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Repository added successfully",
            data: result[0],
        });
    } catch (error: any) {
        console.error("Error adding repo:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to add repository" },
            { status: 500 }
        );
    }
}

export async function GET(request:NextRequest){
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");
    if(!userId){
        return NextResponse.json({
            success: false,
            message: "User ID is required",
        });
    }
    const result = await db.select().from(userRepos).where(eq(userRepos.userId, Number(userId)));
    return NextResponse.json({
        success: true,
        message: "Repository fetched successfully",
        data: result,
    });
}
    