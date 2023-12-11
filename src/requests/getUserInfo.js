const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    const API_URL = "http://192.168.242.67:8000/api/users/get_user_info";

    if (!token) {
        return <></>
    } else {
        const resp = await fetch(API_URL, {
            method: "GET",
            headers: {
                "X-Authorization": `Bearer ${token}`
            }
        });

        const data = await resp.json();

        return data;
    }
};

export default getUserInfo;
