import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../requests/getUserInfo.js";

const ChatSkeleton = () => {
    const [chats, setChats] = useState([]);
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    const API_URL = "http://192.168.242.67:8000/api/users/chats";

    useEffect(() => {
        const fetchData = async () => {
            const respChats = await fetch(API_URL).then(resp => resp.json()).then(async data => {
                const updatedChats = await Promise.all(data.map(async (item) => {
                    const interlocutorInfo = await getUserInfo();

                    return {
                        ...item,
                        interlocutorName: interlocutorInfo.name,
                        interlocutorSurname: interlocutorInfo.surname,
                        lastMessage: "Hello!",
                    };
                }));

                setChats(updatedChats);
            });

            const respUserInfo = await getUserInfo();

            setUserId(respUserInfo.id_user);

            return { respChats, respUserInfo };
        }

        fetchData();
    }, []);

    const openChat = (id) => {
        navigate(`/chat/${id}`);
    };

    const convertDate = (date) => {
        const [newDate, splitDate] = String(date).split("T");

        return newDate;
    };

    return (
        <div>
            {chats.map((item, idx) => (
                <div key={idx} className="cursor-pointer mt-5" onClick={() => openChat(item.chat_name)}>
                    {userId === item.current_user_id || userId === item.target_user_id ? (
                        <div className="px-4 py-2 border-solid border-2 border-slate-300 flex flex-col items-center justify-center gap-2">
                            <span>{item.chat_name}</span>
                            <span>{`${item.interlocutorName} ${item.interlocutorSurname}`}</span>
                            <span>{item.lastMessage}</span>
                            <span>{convertDate(item.created_date)}</span>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default ChatSkeleton;
