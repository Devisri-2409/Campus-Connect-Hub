import api from "./api";

// Get All Study Groups
export const getAllGroups = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get("/groups", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data.groups;
};

// Create Study Group
export const createGroup = async (groupData) => {

    const token = localStorage.getItem("token");

    const response = await api.post(
        "/groups",
        groupData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};
// Join Study Group
export const joinGroup = async (groupId) => {

    const token = localStorage.getItem("token");

    const response = await api.post(
        `/groups/${groupId}/join`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};
export const leaveGroup = async (groupId) => {

    const token = localStorage.getItem("token");

    return await api.delete(`/groups/${groupId}/leave`, {

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

};
export const deleteGroup = async (groupId) => {

    const token = localStorage.getItem("token");

    return await api.delete(`/groups/${groupId}/`, {

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

};