import { useState } from "react";
import { register } from "../services/authService";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password });
            alert("Register success");
        } catch (err) {
            alert("Register failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
                <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}