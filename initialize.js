
var collections=["user","role","dojo","avatar","meeting"];
var roles=["Administrator","Champion","Mentor","Ninja"];

for (var i=0; i<collections.length;i++){
    db.createCollection(collections[i]); 
}

for (var j=0; j<roles.length;j++){
    db.role.insert({"name":roles[j]}); 
}


var item1 = { "_id" : "1",
             "firstName" : "admin", 
             "lastName" : "", 
             "roles" : ["Administrator" ], 
             "email" : "admin", 
             "password" : "123", 
             "username" : "admin" };
var item2 = { "_id" : "2",
             "firstName" : "jj", 
             "lastName" : "l", 
             "roles" : ["Mentor" ], 
             "email" : "jj", 
             "password" : "123", 
             "username" : "jj" };
var item3 = { "_id" : "3",
             "firstName" : "c", 
             "lastName" : "l", 
             "roles" : ["Champion" ], 
             "email" : "c", 
             "password" : "123", 
             "username" : "c",
             "avatar" : "data:," };
var session1 = {
     "_id" : "1",
     "name" : "uwa",
}
var meeting1 = {
     "_id" : "1",
     "name" : "uwa" ,
     "location" : "56fd1de65fd3b21db12f9a97",
     "password" : "1",
     "avatar" : "data:,"
}

db.user.insert(item1);
db.user.insert(item2);
db.user.insert(item3);
db.dojo.insert(session1);
db.meeting.insert(meeting1);
