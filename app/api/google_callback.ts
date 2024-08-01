
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query;

    if (!code) {
        return res.redirect("/login?error=missing_code");
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            code: code as string,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string,
            grant_type: "authorization_code",
        }).toString(),
    });

    const data = await response.json();

    if (data.access_token) {
        res.redirect("/?login_success");
    } else {
        res.redirect("/login?error=authentication_failed");
    }
}
