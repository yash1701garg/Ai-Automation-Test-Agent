import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookie = await cookies();
    const token = cookie.get('github_token')?.value;
    console.log("Token when we called the get repos api endpoint : ",token);
    if (!token) {
        return new NextResponse(JSON.stringify({ error: "No token found" }), {
            status: 401,
        });
    }
    let page = 1;
    const allRepos = [];
    while(true){
    const res = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&order=desc`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
        },
    });

    // Handle expired/revoked tokens
    if (res.status === 401) {
        console.error("GitHub token is invalid or expired. User needs to re-authenticate.");
        return NextResponse.json(
            { error: "GitHub token expired or invalid. Please re-authenticate.", requiresReauth: true },
            { status: 401 }
        );
    }

    if (!res.ok) {
        console.error(`GitHub API error: ${res.status} ${res.statusText}`);
        return NextResponse.json(
            { error: `GitHub API error: ${res.status}` },
            { status: res.status }
        );
    }

    const repos = await res.json();
    if(!repos.length) break;
    allRepos.push(...repos);
    page++;
    }
    return NextResponse.json(allRepos.map(r=>({
        id:r.id,
        name:r.name,
        fullName:r.full_name,
        html_url:r.html_url,
        language:r.language,
        createdAt:r.created_at,
        updatedAt:r.updated_at,
        default_branch:r.default_branch,
        private:r.private,
        owner:r.owner.login,
    })));
}