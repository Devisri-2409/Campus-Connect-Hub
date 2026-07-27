import api from "./api";

export const getNotifications = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get("/notifications", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data.notifications;
};

export const markNotificationRead = async (id) => {

    const token = localStorage.getItem("token");

    return await api.put(
        `/notifications/${id}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};