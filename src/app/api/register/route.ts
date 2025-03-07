import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req) {
    const { username, email, password } = await req.json();
    if (username && password && email) {
        return new Response(JSON.stringify(
            { error: "All inputs are required" }),
            { status: 400 },
        );
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
        if (users.some((user) => user.username === username)) {
            return new Response(JSON.stringify(
                { error: "User already exists with this username" }), 
                { status: 400 },
            );
        };
        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
        };

        users.push(newUser);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        return new Response(JSON.stringify(
            { username, email }),
            { status: 201 },
        );

    } catch (error) {
        return new Response(JSON.stringify(
            { error: "Error during registration" }), 
            { status: 500 },
        );
    }
};
