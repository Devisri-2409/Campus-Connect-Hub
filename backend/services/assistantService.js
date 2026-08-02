const db = require("../config/db");

const queryDb = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

const normalize = (text) => (text || "").toLowerCase().trim();

async function getNextSession() {
  const sql = `
    SELECT
      ss.*,
      sg.group_name
    FROM study_sessions ss
    LEFT JOIN study_groups sg
      ON ss.group_id = sg.group_id
    WHERE ss.session_date >= CURDATE()
    ORDER BY ss.session_date ASC, ss.session_time ASC
    LIMIT 1
  `;

  const rows = await queryDb(sql);

  return rows.length ? rows[0] : null;
}

async function getTodaySessions() {
  const sql = `
    SELECT
      ss.*,
      sg.group_name
    FROM study_sessions ss
    LEFT JOIN study_groups sg
      ON ss.group_id = sg.group_id
    WHERE DATE(ss.session_date)=CURDATE()
    ORDER BY ss.session_time ASC
  `;

  return await queryDb(sql);
}

async function searchNotes(keyword) {

  const sql = `
    SELECT
      n.*,
      sg.group_name
    FROM notes n
    LEFT JOIN study_groups sg
      ON n.group_id=sg.group_id
    WHERE
      n.title LIKE ?
      OR n.summary LIKE ?
  `;

  return await queryDb(sql, [
    `%${keyword}%`,
    `%${keyword}%`
  ]);
}

async function searchGroups(keyword){

    const sql=`
    SELECT *
    FROM study_groups
    WHERE
    group_name LIKE ?
    OR subject LIKE ?
    OR description LIKE ?
    `;
    const result = await queryDb(sql, [
  `%${keyword}%`,
  `%${keyword}%`,
  `%${keyword}%`
]);
return result;

    return await queryDb(sql,[
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`
    ]);

}

async function searchSessions(keyword){

    const sql=`
    SELECT
    ss.*,
    sg.group_name
    FROM study_sessions ss
    LEFT JOIN study_groups sg
    ON ss.group_id=sg.group_id

    WHERE

    ss.title LIKE ?
    OR ss.description LIKE ?
    OR sg.group_name LIKE ?

    ORDER BY ss.session_date
    `;

    return await queryDb(sql,[
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`
    ]);

}
function cleanKeyword(question){

    return question
        .toLowerCase()
        .replace(/find/g,"")
        .replace(/show/g,"")
        .replace(/recommend/g,"")
        .replace(/study/g,"")
        .replace(/group/g,"")
        .replace(/groups/g,"")
        .replace(/notes/g,"")
        .replace(/note/g,"")
        .replace(/session/g,"")
        .replace(/sessions/g,"")
        .replace(/about/g,"")
        .replace(/for/g,"")
        .replace(/my/g,"")
        .replace(/please/g,"")
        .trim();

}

module.exports={
    normalize,
    cleanKeyword,
    getNextSession,
    getTodaySessions,
    searchNotes,
    searchGroups,
    searchSessions
};