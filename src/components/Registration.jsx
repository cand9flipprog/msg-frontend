import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

const Registration = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const notificationRef = useRef(null);

    const API_URL = "http://192.168.242.67:8000/api/users/register";

    const onRegister = async (name, surname, email, password) => {
        const resp = await fetch(API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                email: email,
                password: password
            })
        });

        const data = await resp.json();

        if (resp.status === 200) {
            NotificationManager.success(data.success, "Success", 4000, () => { }, notificationRef.current);

            setName('');
            setSurname('');
            setEmail('');
            setPassword('');
        } else {
            NotificationManager.error(data.error, "Error", 4000, () => { }, notificationRef.current);
        };

        console.log(data);
    };

    const onRegisterSubmit = (event) => {
        event.preventDefault();

        onRegister(name, surname, email, password);
    };

    return (
        <section className="block ml-auto mr-auto">
            <form className="flex flex-col items-center gap-4" onSubmit={onRegisterSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" onChange={(ev) => setName(ev.target.value)} />

                <label htmlFor="surname">Surname</label>
                <input type="text" name="surname" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" onChange={(ev) => setSurname(ev.target.value)} />

                <label htmlFor="email">Email</label>
                <input type="email" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" onChange={(ev) => setEmail(ev.target.value)} />

                <label htmlFor="password">Password</label>
                <input type={showPassword ? "text" : "password"} name="password" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" onChange={(ev) => setPassword(ev.target.value)} />
                <span className={`cursor-pointer ${showPassword ? "hover:text-red-400" : "hover:text-blue-400"}`} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide password' : 'Show password'}</span>

                <button className="w-64 px-2 py-2 bg-zinc-100 hover:bg-zinc-300" onClick={onRegisterSubmit}>Register</button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4">
                <span>Already have account?</span>
                <Link to="/login" className="hover:text-blue-400">Sign in</Link>
            </div>
            <NotificationContainer ref={notificationRef} />
        </section>
    )
};

export default Registration;
