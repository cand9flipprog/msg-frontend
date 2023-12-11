import { useLocation, Link } from "react-router-dom";
import { AiOutlineHome, AiOutlinePoweroff, AiOutlineMessage, AiOutlineSetting, AiOutlineContacts } from "react-icons/ai";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import getUserInfo from "../requests/getUserInfo";

const NavBar = () => {
    const location = useLocation();
    const [userInfo, setUserInfo] = useState('');
    const [avatar, setAvatar] = useState('');

    const [, pathname] = location.pathname.split("/");

    const onLogout = () => {
        localStorage.removeItem("token");
        window.location.pathname = "/login";
    }

    useEffect(() => {
        const userData = async () => {
            const userInfo = await getUserInfo();
            setUserInfo(userInfo);
        }

        userData();
    }, []);


    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    if (!localStorage.getItem("token")) {
        return null;
    }

    return (
        <section className="flex flex-col w-64 gap-6 h-auto">
            <div className="flex flex-col items-center">
                <Avatar avatar={userInfo.avatar} />
                <span>{userInfo.name} {userInfo.surname}</span>
            </div>
            <div className="block ml-auto mr-auto items-center">
                <Link to="/home">
                    <div className="mb-5">
                        <span className={`flex gap-2 items-center cursor-pointer hover:text-[#39b2e8] ${pathname.toUpperCase() === "HOME" ? "text-[#39b2e8]" : null}`}><AiOutlineHome />HOME</span>
                    </div>
                </Link>

                <Link to="/chat">
                    <div className="mb-5">
                        <span className={`flex gap-2 items-center cursor-pointer hover:text-[#39b2e8] ${pathname.toUpperCase() === "CHAT" ? "text-[#39b2e8]" : null}`}><AiOutlineMessage />CHAT</span>
                    </div>
                </Link>

                <Link to="/contacts">
                    <div className="mb-5">
                        <span className={`flex gap-2 items-center cursor-pointer hover:text-[#39b2e8] ${pathname.toUpperCase() === "CONTACTS" ? "text-[#39b2e8]" : null}`}><AiOutlineContacts />CONTACTS</span>
                    </div>
                </Link>

                <Link to="/settings">
                    <div className="mb-5">
                        <span className={`flex gap-2 items-center cursor-pointer hover:text-[#39b2e8] ${pathname.toUpperCase() === "SETTINGS" ? "text-[#39b2e8]" : null}`}><AiOutlineSetting />SETTINGS</span>
                    </div>
                </Link>

                <div className="mb-5">
                    <span className="flex gap-2 items-center cursor-pointer hover:text-red-500" onClick={onLogout}><AiOutlinePoweroff />LOG OUT</span>
                </div>
            </div >
        </section >
    )
};

export default NavBar;
