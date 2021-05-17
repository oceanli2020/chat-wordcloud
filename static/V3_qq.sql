CREATE TABLE "qqUser" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"uin" TEXT(15),

"name" TEXT(50),

"gender" INTEGER,

"age" INTEGER,

"extractId" INTEGER,

"country" TEXT(20),

"province" TEXT(20),

"city" TEXT(10),

"email" TEXT(50),

"phone" TEXT(20),

"sign" TEXT,

"constellation" INTEGER,

"birthday" TEXT(50),

"company" TEXT(50),

"profession" TEXT(20),

"school" TEXT(50),

"avatar" TEXT

);

CREATE TABLE "qqFriend" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"uin" TEXT(15),

"name" TEXT(50),

"gender" INTEGER,

"age" INTEGER,

"remark" TEXT(50),

"userId" INTEGER,

"groupId" INTEGER,

"country" TEXT(20),

"province" TEXT(20),

"city" TEXT(10),

"email" TEXT(50),

"phone" TEXT(20),

"sign" TEXT,

"constellation" INTEGER,

"birthday" TEXT(50),

"company" TEXT(50),

"profession" TEXT(20),

"school" TEXT(50),

"avatar" TEXT
);



CREATE TABLE "qqGroup" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"name" TEXT,

"count" INTEGER,

"userId" INTEGER
);



CREATE TABLE "qqTroop" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"userId" INTEGER,

"uin" TEXT,

"name" TEXT,

"ownerUin" TEXT,

"memo" TEXT,

"avatar" TEXT,

"joinTime" INTEGER,

"memberNum" INTEGER

);

CREATE TABLE "qqTroopMember" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"userId" INTEGER,

"troopId" INTEGER,

"troopUin" TEXT,

"memberUin" TEXT,

"friendNick" TEXT,

"troopNick" TEXT,

"sex" INTEGER,

"age" INTEGER,

"joinTime" INTEGER,

"phone" TEXT,

"email" TEXT

);

CREATE TABLE "qqDiscussion" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"userId" INTEGER,

"uin" TEXT,

"name" TEXT,

"ownerUin" TEXT,

"createTime" INTEGER

);

CREATE TABLE "qqDiscussionMember" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"userId" INTEGER,

"discussionId" INTEGER,

"discussionUin" TEXT,

"memberUin" TEXT,

"remark" TEXT

);