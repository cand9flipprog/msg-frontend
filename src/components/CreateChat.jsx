import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import getUsers from "../requests/getUsers.js";
import getUserInfo from "../requests/getUserInfo.js";
import ChatSkeleton from "./ChatSkeleton";

const CreateChat = () => {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const notificationRef = useRef(null);

    const API_URL = "http://192.168.242.67:8000/api";

    useEffect(() => {
        const fetchData = async () => {
            const users = await getUsers();
            const currentUser = await getUserInfo();
            const filteredUsers = users.filter(item => item.id_user !== currentUser.id_user);

            setUsers(filteredUsers);
            setCurrentUserId(currentUser.id_user);
        };

        fetchData();
    }, []);

    const onCreateChat = async (currentUserId, targetUserId) => {
        const generateUuid = uuidv4();

        const resp = await fetch(`${API_URL}/create_chat`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_name: generateUuid,
                current_id: currentUserId,
                target_id: targetUserId
            })
        });

        const data = await resp.json();

        if (resp.status === 200) {
            NotificationManager.success(data.success, "Success", 2000, () => { }, notificationRef.current);
        } else {
            NotificationManager.error(data.error, "Error", 2000, () => { }, notificationRef.current);
        }

        setShowModal(false);

        return data;
    };

    return (
        <div>
            <div>
                <button className="bg-zinc-300 hover:bg-zinc-500 rounded-md px-2 py-2" onClick={() => setShowModal(true)}>Create new chat</button>
            </div>
            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-4 rounded-md">
                        <div className="flex justify-between mb-2 flex-col">
                            <h2 className="text-lg font-semibold">Select a user to chat with</h2>
                            <button className="block ml-auto mr-auto bg-red-500 text-white px-2 py-2 w-2/4 cursor-pointer rounded-lg border-solid border-1 border-slate-400 hover:bg-red-600" onClick={() => setShowModal(false)}>Close</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {users.map((item, index) => (
                                <div key={index} className="flex flex-col gap-1 px-2 py-2 border-solid border border-slate-400 rounded-lg">
                                    <span>{item.name} {item.surname}</span>
                                    <button className="text-white px-1 py-1 bg-blue-400 rounded-md hover:bg-blue-500" id={item.id_user} onClick={(ev) => onCreateChat(currentUserId, parseInt(ev.target.id))}>
                                        Create chat
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <ChatSkeleton />
            <NotificationContainer />
        </div>
    );
};

export default CreateChat;
