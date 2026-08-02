const db=require("../config/db");

exports.saveMessage=(data,callback)=>{

db.query(

`INSERT INTO group_messages
(group_id,user_id,message)
VALUES(?,?,?)`,

[
data.group_id,
data.user_id,
data.message
],

callback

);

};

exports.getMessages=(groupId,callback)=>{

db.query(

`SELECT
gm.*,
u.full_name

FROM group_messages gm

JOIN users u
ON gm.user_id=u.user_id

WHERE group_id=?

ORDER BY created_at ASC`,

[groupId],

callback

);

};