const http = require("http");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = require("../app");

async function runTests() {
  console.log("============================================================");
  console.log("   CAMPUS CONNECT HUB - POSTGRESQL API VERIFICATION SUITE   ");
  console.log("============================================================\n");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`🚀 Test server listening on ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;
  const testResults = [];

  function record(name, isSuccess, details = "") {
    if (isSuccess) {
      passed++;
      console.log(`✅ PASS: ${name}`);
      testResults.push({ name, status: "PASS", details });
    } else {
      failed++;
      console.error(`❌ FAIL: ${name} -> ${details}`);
      testResults.push({ name, status: "FAIL", details });
    }
  }

  let user1Token = "";
  let user1Id = null;
  let user2Token = "";
  let user2Id = null;
  let createdGroupId = null;
  let createdSessionId = null;
  let createdNoteId = null;

  try {
    // Test 1: Basic Health / Root
    const healthRes = await fetch(`${baseUrl}/test`);
    const healthText = await healthRes.text();
    record("Health Check (GET /test)", healthRes.status === 200 && healthText.includes("Backend Working"));

    // Test 2: User 1 Registration
    const user1Email = `tester_${Date.now()}@campus.edu`;
    const reg1Res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Devi Sri Test",
        email: user1Email,
        password: "Password@123",
        role_id: 2,
        department_id: 1,
      }),
    });
    const reg1Data = await reg1Res.json();
    record("User 1 Registration (POST /api/auth/register)", reg1Res.status === 201 && reg1Data.success === true, JSON.stringify(reg1Data));

    // Test 3: User 1 Login & JWT Generation
    const login1Res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user1Email,
        password: "Password@123",
      }),
    });
    const login1Data = await login1Res.json();
    user1Token = login1Data.token;
    user1Id = login1Data.user?.user_id;
    record("User 1 Login (POST /api/auth/login)", login1Res.status === 200 && !!user1Token && typeof user1Id === "number", `Token present: ${!!user1Token}, user_id: ${user1Id}`);

    // Test 4: Get Profile
    const profileRes = await fetch(`${baseUrl}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const profileData = await profileRes.json();
    record("Get Profile (GET /api/auth/profile)", profileRes.status === 200 && profileData.user?.email === user1Email);

    // Test 5: Update Profile
    const updateProfileRes = await fetch(`${baseUrl}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        phone: "9876543210",
        email: user1Email,
        bio: "CSBS Student & Full Stack Dev",
        skills: "React, Node, Postgres",
      }),
    });
    const updateProfileData = await updateProfileRes.json();
    record("Update Profile (PUT /api/auth/profile)", updateProfileRes.status === 200 && updateProfileData.success === true);

    // Test 6: Create Study Group with Unique Name
    const uniqueGroupName = `Postgres Circle ${Date.now()}`;
    const createGroupRes = await fetch(`${baseUrl}/api/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        group_name: uniqueGroupName,
        subject: "Database Systems",
        description: "Postgres testing group",
        department_id: 1,
        max_members: 15,
      }),
    });
    const createGroupData = await createGroupRes.json();
    record("Create Study Group (POST /api/groups)", createGroupRes.status === 201 && createGroupData.success === true);

    // Test 7: Get All Study Groups
    const getGroupsRes = await fetch(`${baseUrl}/api/groups`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const getGroupsData = await getGroupsRes.json();
    const foundGroup = getGroupsData.groups?.find((g) => g.group_name === uniqueGroupName);
    if (foundGroup) {
      createdGroupId = foundGroup.group_id;
    }
    record("Get All Study Groups (GET /api/groups)", getGroupsRes.status === 200 && !!foundGroup, `Found Group ID: ${createdGroupId}`);

    // Test 8: Register & Login Peer User (User 2)
    const user2Email = `peer_${Date.now()}@campus.edu`;
    await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Peer Student",
        email: user2Email,
        password: "Password@123",
        role_id: 2,
        department_id: 2,
      }),
    });
    const login2Res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user2Email,
        password: "Password@123",
      }),
    });
    const login2Data = await login2Res.json();
    user2Token = login2Data.token;
    user2Id = login2Data.user?.user_id;
    record("Peer Registration & Login", login2Res.status === 200 && !!user2Token);

    // Test 9: Peer Joins Group
    const joinRes = await fetch(`${baseUrl}/api/groups/${createdGroupId}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const joinData = await joinRes.json();
    record("Join Group (POST /api/groups/:id/join)", joinRes.status === 200 && joinData.success === true);

    // Test 10: Get My Groups for Peer
    const myGroupsRes = await fetch(`${baseUrl}/api/groups/my`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const myGroupsData = await myGroupsRes.json();
    const joinedGroup = myGroupsData.groups?.find((g) => g.group_id === createdGroupId);
    record("Get My Groups (GET /api/groups/my)", myGroupsRes.status === 200 && !!joinedGroup);

    // Test 11: Chat Messaging (Save & Fetch)
    const sendChatRes = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user2Token}`,
      },
      body: JSON.stringify({
        group_id: createdGroupId,
        message: "Hello group, happy to join the postgres study circle!",
      }),
    });
    const sendChatData = await sendChatRes.json();
    record("Send Chat Message (POST /api/chat)", sendChatRes.status === 200 && sendChatData.success === true);

    const getChatRes = await fetch(`${baseUrl}/api/chat/${createdGroupId}`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const getChatData = await getChatRes.json();
    const chatMsgFound = Array.isArray(getChatData) && getChatData.some((m) => m.message?.includes("postgres study circle"));
    record("Get Chat Messages (GET /api/chat/:groupId)", getChatRes.status === 200 && chatMsgFound);

    // Test 12: Study Sessions (Create, List)
    const createSessionRes = await fetch(`${baseUrl}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        title: "Database Indexing Workshop",
        description: "Hands-on session on B-tree and Hash indexes",
        session_date: "2026-11-01",
        session_time: "16:00:00",
        location: "Virtual Room A",
        meeting_link: "https://meet.campus.edu/db-index",
        group_id: createdGroupId,
      }),
    });
    const createSessionData = await createSessionRes.json();
    record("Create Study Session (POST /api/sessions)", createSessionRes.status === 200 && createSessionData.success === true);

    const getSessionsRes = await fetch(`${baseUrl}/api/sessions`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const getSessionsData = await getSessionsRes.json();
    const foundSession = getSessionsData.sessions?.find((s) => s.title === "Database Indexing Workshop");
    if (foundSession) {
      createdSessionId = foundSession.session_id;
    }
    record("Get All Sessions (GET /api/sessions)", getSessionsRes.status === 200 && !!foundSession);

    // Test 13: Notes Sharing (Create, List, Delete)
    const formData = new FormData();
    formData.append("title", "PostgreSQL Architecture Notes");
    formData.append("summary", "Complete guide to PostgreSQL MVCC and Storage Engines");
    formData.append("group_id", String(createdGroupId));
    const testBlob = new Blob(["Sample lecture notes content for postgres test."], { type: "text/plain" });
    formData.append("file", testBlob, "postgres_notes.txt");

    const uploadNoteRes = await fetch(`${baseUrl}/api/notes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user1Token}` },
      body: formData,
    });
    const uploadNoteData = await uploadNoteRes.json();
    record("Upload Note (POST /api/notes)", uploadNoteRes.status === 200 && uploadNoteData.success === true);

    const getNotesRes = await fetch(`${baseUrl}/api/notes`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const getNotesData = await getNotesRes.json();
    const foundNote = getNotesData.notes?.find((n) => n.title === "PostgreSQL Architecture Notes");
    if (foundNote) {
      createdNoteId = foundNote.note_id;
    }
    record("Get All Notes (GET /api/notes)", getNotesRes.status === 200 && !!foundNote);

    if (createdNoteId) {
      const delNoteRes = await fetch(`${baseUrl}/api/notes/${createdNoteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user1Token}` },
      });
      const delNoteData = await delNoteRes.json();
      record("Delete Note (DELETE /api/notes/:noteId)", delNoteRes.status === 200 && delNoteData.success === true);
    }

    // Test 14: Notifications (User 1 received notification when peer joined)
    const notifRes = await fetch(`${baseUrl}/api/notifications`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const notifData = await notifRes.json();
    const notifs = notifData.notifications || [];
    record("Get Notifications (GET /api/notifications)", notifRes.status === 200 && Array.isArray(notifs) && notifs.length > 0, `Count: ${notifs.length}`);

    if (notifs.length > 0) {
      const readNotifRes = await fetch(`${baseUrl}/api/notifications/${notifs[0].notification_id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user1Token}` },
      });
      const readNotifData = await readNotifRes.json();
      record("Mark Notification Read (PUT /api/notifications/:id)", readNotifRes.status === 200 && readNotifData.success === true);
    }

    // Test 15: AI Assistant Query
    const assistantRes = await fetch(`${baseUrl}/api/assistant/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        question: "Show me upcoming sessions for database",
      }),
    });
    const assistantData = await assistantRes.json();
    record("AI Assistant Query (POST /api/assistant/chat)", assistantRes.status === 200 && !!assistantData.reply, `Reply length: ${assistantData.reply?.length || 0}`);

    // Test 16: Peer Leaves Group
    const leaveRes = await fetch(`${baseUrl}/api/groups/${createdGroupId}/leave`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const leaveData = await leaveRes.json();
    record("Leave Group (DELETE /api/groups/:id/leave)", leaveRes.status === 200 && leaveData.success === true);

    // Test 17: Delete Study Session
    if (createdSessionId) {
      const delSessionRes = await fetch(`${baseUrl}/api/sessions/${createdSessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user1Token}` },
      });
      const delSessionData = await delSessionRes.json();
      record("Delete Session (DELETE /api/sessions/:id)", delSessionRes.status === 200 && delSessionData.success === true);
    }

    // Test 18: Delete Study Group (tests affectedRows check in PostgreSQL!)
    const delGroupRes = await fetch(`${baseUrl}/api/groups/${createdGroupId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const delGroupData = await delGroupRes.json();
    record("Delete Group (DELETE /api/groups/:id)", delGroupRes.status === 200 && delGroupData.success === true, JSON.stringify(delGroupData));

  } catch (err) {
    record("Unhandled Test Exception", false, err.stack || err.message);
  } finally {
    server.close();
  }

  console.log("\n============================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

