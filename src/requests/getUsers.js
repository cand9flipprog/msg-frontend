const getUsers = async () => {
    const API_URL = "http://192.168.242.67:8000/api/users";

    const resp = await fetch(API_URL, {
        method: "GET",
    });

    const data = await resp.json();

    return data;
};

export default getUsers;
