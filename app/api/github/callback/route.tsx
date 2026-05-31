import { NextRequest,NextResponse } from "next/server";
export async function GET(request:NextRequest){
    const code = request.nextUrl.searchParams.get("code");

    console.log('code',code)
    if(!code){
        return NextResponse.redirect(new URL('/worspace/error?message=missing code',request.url));

    }


    const res = await fetch('https://github.com/login/oauth/access_token',
    {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "accept":"application/json"
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            // redirect_uri: process.env.GITHUB_REDIRECT_URI,
        }) 
    })
    
    const data = await res.json()
    console.log("token data", data)

    const accessToken = data.access_token;

    if (data.error || !data.access_token || !accessToken) {
        return NextResponse.redirect(new URL('/workspace/error?message=failed to fetch token',request.url))
    }


    const response = NextResponse.redirect(new URL('/workspace', request.url));

    //store token in cookies or local storage
    response.cookies.set('github_token', accessToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, //30 days
        path:'/',
        sameSite:'lax'
    });

    return response;

    // const userRes = await fetch('https://api.github.com/user',{
    //     headers:{
    //         Authorization: `Bearer ${accessToken}`
    //     }
    // })



    // const userData = await userRes.json()
    // console.log("User Data",userData)
}