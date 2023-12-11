import { useEffect, useState, useRef } from "react";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import getUserInfo from "../requests/getUserInfo.js";
import getUsers from "../requests/getUsers.js";

const Contacts = () => {
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(0);
    const [searchValue, setSearchValue] = useState('');

    const notificationRef = useRef(null);

    const API_URL = "http://192.168.242.67:8000/api";

    useEffect(() => {
        const fetchData = async () => {
            const users = await getUsers();
            const currentUser = await getUserInfo();

            const contacts = await fetch(`${API_URL}/contacts`);

            const data = await contacts.json();

            setCurrentUserId(currentUser.id_user);
            setUsers(users);
            setContacts(data);
        };

        fetchData();
    }, []);

    const onAddContact = async (currentUserId, targetUserId) => {
        const resp = await fetch(`${API_URL}/users/add_contact`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                currentUserId: currentUserId,
                targetUserId: targetUserId
            })
        });

        console.log(resp.status);

        const data = await resp.json();

        if (resp.status === 200) {

            NotificationManager.success(data.success, "Success", 3000, () => { }, notificationRef.current);
        } else {
            NotificationManager.error(data.error, "Error", 3000, () => { }, notificationRef.current);
        }

        return data;
    };

    console.log(contacts);

    const filteredUsers = users.filter((user) => {
        if (user.id_user !== currentUserId) {
            return (
                user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.surname.toLowerCase().includes(searchValue.toLowerCase())
            );
        }
    });

    return (
        <section className="flex justify-between">
            <div className="flex flex-col">
                <span>Users</span>
                <input type="text" className="w-64 px-2 border-solid border border-zinc-300 rounded-md" placeholder="Input user" value={searchValue} onChange={(ev) => setSearchValue(ev.target.value)} />
                <ol>
                    {searchValue ? filteredUsers.map((item, index) => (
                        <li key={index} className="flex items-center object-cover gap-2 mt-4">
                            <img src={item.avatar} alt="avatar" width={32} height={32} />
                            <span>{item.name} {item.surname}</span>
                            <button
                                className="bg-zinc-300 cursor-pointer rounded-md px-2 text-sm py-1 hover:bg-zinc-500"
                                id={item.id_user}
                                onClick={(ev) => {
                                    onAddContact(currentUserId, parseInt(ev.target.id))
                                }}
                            >
                                Add contact
                            </button>
                        </li>
                    )) : null}
                </ol>
            </div>
            <div>
                <span>My contacts</span>
                <ol>
                </ol>
            </div>
            <NotificationContainer />
        </section>
    )
};

export default Contacts;
