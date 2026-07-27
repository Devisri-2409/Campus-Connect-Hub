import api from "./api";

// Get All Sessions
export const getAllSessions = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get("/sessions", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data.sessions;
};

// Create Session
export const createSession = async (sessionData) => {

    const token = localStorage.getItem("token");

    const response = await api.post(
        "/sessions",
        sessionData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// Delete Session
export const deleteSession = async (sessionId) => {

    const token = localStorage.getItem("token");

    const response = await api.delete(
        `/sessions/${sessionId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};