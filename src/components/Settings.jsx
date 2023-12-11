import { useEffect, useState, useRef } from "react";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import getUserInfo from "../requests/getUserInfo.js";

const Settings = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userInfo, setUserInfo] = useState('');

    const notificationRef = useRef(null);

    const API_URL = "http://192.168.242.67:8000/api/users";

    useEffect(() => {
        const getUserData = async () => {
            const userData = await getUserInfo();

            setUserInfo(userData);

            setName(userData.name);
            setSurname(userData.surname);
            setEmail(userData.email);
        }

        getUserData();
    }, []);

    const fetchAPI = async (method, endpoint, body) => {
        const resp = await fetch(`${API_URL}/${endpoint}`, {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await resp.json();

        if (resp.status === 200) {
            NotificationManager.success(data.success, "Success", 2000, () => { }, notificationRef.current);
        } else {
            NotificationManager.error(data.error, "Error", 2000, () => { }, notificationRef.current);
        }

        return data;
    };

    const onUpdateUserInfo = (userId, name, surname) => {
        fetchAPI("PATCH", "update_user_info", { userId: userId, name: name, surname: surname });
    };

    const onUpdateEmail = (userId, email) => {
        fetchAPI("PATCH", "update_email", { userId: userId, email: email });
    };

    const onUpdateAvatar = (userId, avatar) => {
        fetchAPI("PATCH", "update_avatar", { userId: userId, avatarUrl: avatar });
    };

    return (
        <section>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <span>User info</span>
                    <input type="text" placeholder="Name" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" defaultValue={userInfo.name} onChange={(ev) => setName(ev.target.value)} />
                    <input type="text" placeholder="Surname" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" defaultValue={userInfo.surname} onChange={(ev) => setSurname(ev.target.value)} />
                    <button className="bg-blue-400 px-2 py-2 rounded-md text-white hover:bg-blue-500" onClick={() => onUpdateUserInfo(userInfo.id_user, name, surname)}>Update user info</button>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Email</span>
                    <input type="email" placeholder="Email" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" defaultValue={userInfo.email} onChange={(ev) => setEmail(ev.target.value)} />
                    <button className="bg-blue-400 px-2 py-2 rounded-md text-white hover:bg-blue-500" onClick={() => onUpdateEmail(userInfo.id_user, email)}>Update email</button>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Avatar</span>
                    <input type="text" placeholder="Avatar URL" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" onChange={(ev) => setAvatarUrl(ev.target.value)} />
                    <button className="bg-blue-400 px-2 py-2 rounded-md text-white hover:bg-blue-500" onClick={() => onUpdateAvatar(userInfo.id_user, avatarUrl)}>Update avatar</button>
                </div>
            </div>
            <NotificationContainer ref={notificationRef} />
        </section>
    )
};

export default Settings;
