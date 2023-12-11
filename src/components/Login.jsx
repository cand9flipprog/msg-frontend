import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const notificationRef = useRef(null);

    const API_URL = "http://192.168.242.67:8000/api/users/login";


    const onLogin = async (email, password) => {
        const resp = await fetch(API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await resp.json();

        if (resp.status === 200) {
            localStorage.setItem("token", data.token);

            NotificationManager.success(`${data.success} Redirect to home page in 3 seconds`, "Success", 2000, () => { }, notificationRef.current);

            setTimeout(() => {
                window.location.pathname = "/home";
            }, 3000)
        } else {
            NotificationManager.error(data.error, "Error", 3000, () => { }, notificationRef.current);
        }

        return data;
    };

    const onLoginSubmit = (event) => {
        event.preventDefault();

        onLogin(email, password);
    };

    return (
        <section className="block ml-auto mr-auto">
            <form method="POST" action="" className="flex flex-col justify-center gap-4 items-center" onSubmit={onLoginSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" onChange={(ev) => setEmail(ev.target.value)} />

                <label htmlFor="password">Password</label>
                <input type={showPassword ? 'text' : 'password'} name="password" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" onChange={(ev) => setPassword(ev.target.value)} />

                <span onClick={() => setShowPassword(!showPassword)} className={`cursor-pointer ${showPassword ? "hover:text-red-400" : "hover:text-blue-400"}
`}>{showPassword ? 'Hide password' : 'Show password'}</span>

                <button className="px-2 py-2 w-64 bg-zinc-100 rounded-md hover:bg-zinc-300">Login</button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4">
                <span>Have not account?</span>
                <Link to="/register" className="cursor-pointer hover:text-blue-400">Sign up</Link>
            </div>
            <NotificationContainer ref={notificationRef} />
        </section>
    )
};

export default Login;
