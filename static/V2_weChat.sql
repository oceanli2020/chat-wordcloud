CREATE TABLE "weChatChatroom" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"name" TEXT,

"nickname" TEXT,

"memberList" TEXT,

"displayNameList" TEXT,

"roomOwner" TEXT,

"selfDisplayName" TEXT,

"notice" TEXT,

"noticeEditor" TEXT,

"avatar" TEXT,

"noticePublishTime" INTEGER,

"memberCount" INTEGER,

"userId" INTEGER
);


CREATE TABLE "weChatContacts" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"username" TEXT,

"alias" TEXT,

"nickname" TEXT,

"conRemark" TEXT,

"avatar" TEXT,

"type" INTEGER,

"userId" INTEGER
);

CREATE TABLE "weChatMessage" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"msgId" INTEGER,

"type" INTEGER,

"isSend" INTEGER,

"createTime" INTEGER,

"talker" TEXT,

"content" TEXT,

"imgPath" TEXT,

"userId" INTEGER
);

CREATE TABLE "weChatUser" (

"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

"name" TEXT,

"alias" TEXT,

"nickname" TEXT,

"signature" TEXT,

"country" TEXT,

"province" TEXT,

"city" TEXT,

"qq" TEXT,

"phone" TEXT,

"avatar" TEXT,

"extractId" INTEGER
);