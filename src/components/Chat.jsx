import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { CiLocationArrow1 } from "react-icons/ci";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { io } from "socket.io-client";
import getUserInfo from "../requests/getUserInfo.js";

const Chat = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(0);
    const [currentChatId, setCurrentChatId] = useState(0);
    const [value, setValue] = useState("");

    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const API_URL = "http://192.168.242.67:8000";

    useEffect(() => {
        const respChat = async () => {
            const resp = await fetch(`${API_URL}/api/users/chats`);
            const data = await resp.json();

            for (const item of data) {
                if (item.chat_name === id) {
                    setCurrentChatId(item.id_chat);
                }
            }
        };

        respChat();
    }, [id]);

    useEffect(() => {
        const respMessages = async () => {
            const resp = await fetch(`${API_URL}/api/messages`);
            const data = await resp.json();

            const chatMessages = data.filter((item) => item.chat_id === currentChatId);
            setMessages(chatMessages);

            const currentUserInfo = await getUserInfo();
            setCurrentUserId(currentUserInfo.id_user);
        };

        respMessages();
    }, [currentChatId]);

    useEffect(() => {
        const newSocket = io(API_URL, { query: { chat_id: currentChatId } });
        setSocket(newSocket);

        newSocket.emit("join chat", { chat_id: currentChatId });

        return () => {
            newSocket.disconnect();
        };
    }, [currentChatId]);

    useEffect(() => {
        if (socket) {
            socket.on("chat message", (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            socket.on("error", (errMsg) => {
                NotificationManager.error(errMsg, "Success", 3000, () => { });
            })
        }

        return () => {
            if (socket) {
                socket.off("chat message");
            }
        };
    }, [socket]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (message) => {
        socket.emit("chat message", {
            chat_id: currentChatId,
            user_id: currentUserId,
            message: message,
            message_date: new Date()
        });
    };

    const convertDate = (date) => {
        const [newDate, splitDate] = String(date).split("T");
        const [time, splitTime] = String(splitDate).split(".");

        return time;
    };

    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex flex-col flex-grow overflow-y-auto" ref={messagesContainerRef}>
                {messages.map((item, idx) => (
                    <div key={idx} className={`${currentUserId === item.user_id ? "text-right" : "text-left"} mt-4`}>
                        <span className={`text-white px-2 py-2 rounded-full ${currentUserId === item.user_id ? "bg-[#0d66a1] rounded-full" : "bg-slate-400"}`}>
                            {item.message}
                        </span>
                        <span className="ml-4 mr-4">
                            {convertDate(item.message_date).slice(0, -3)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex gap w-full">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message here"
                    className="border-solid border-b-2 border-slate-400 outline-none"
                    value={value}
                    onChange={(ev) => setValue(ev.target.value)}
                    onKeyDown={(ev) => {
                        if (ev.key === "Enter") {
                            if (ev.target.value.trim() === "") {
                                return;
                            } else {
                                sendMessage(ev.target.value);
                                setValue("");
                                inputRef.current.focus();
                            }
                        }
                    }}
                />
                <CiLocationArrow1
                    className="w-8 h-8 px-2 bg-[#2A8BF2] rounded-full cursor-pointer"
                    onClick={() => {
                        if (value.trim() === "") {
                            return;
                        } else {
                            sendMessage(value);
                            setValue("");
                            inputRef.current.focus();
                        }
                    }}
                />
            </div>
            <NotificationContainer />
        </div>
    );
};

export default Chat;
