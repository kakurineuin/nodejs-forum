使用 NodeJS、Express、Sequelize、React 建立的論壇網站。

NodeJS
https://nodejs.org/en/

Express
https://expressjs.com

Sequelize
http://docs.sequelizejs.com

React
https://reactjs.org

目錄與檔案說明
===
- config：專案配置檔的目錄。
- database：初始化 Sequelize(ORM Framework)的程式碼目錄。
- error：自訂錯誤的程式碼目錄。
- frontend：前端程式碼的目錄，前端使用 React 開發。
- logger：初始化日誌物件的程式碼目錄。
- middleware：Express 的 middleware 目錄。
- model：Sequelize 的 model 目錄，每個 model 對應一張資料表。
- route：Express 的 route 目錄，依照功能區分。
  - admin.js：處理系統管理員相關功能的 router。
  - auth.js：處理註冊、登入功能的 router。
  - forum.js：查詢論壇統計資料的 router。
  - topic.js：處理文章相關功能的 router。
- service：實作論壇各功能的 service 的目錄，例如有關文章的新增、修改、刪除、查詢等功能會寫在 TopicService.js。在 Express 的 handler function 中會呼叫對應的 service 去處理請求。寫成 service 是為了將論壇的業務邏輯(文章 CRUD、使用者管理)和 Web 的瑣碎處理(檢核 request、回傳 response)分開，以提供更好的可維護性。
  - AdminService.go：處理系統管理員相關功能的 service。
  - AuthService.go：處理註冊、登入功能的 service。
  - ForumService.go：查詢論壇統計資料的 service。
  - TopicService.go：處理文章相關功能的 service。
- sql：sql 語句樣板的放置目錄。遇到比較複雜的查詢必須寫成 sql 時，就寫在此目錄下的 template.xml，然後在程式碼中讀取該段 sql 去執行。
- test：專案程式碼的測試目錄，在專案目錄下執行 npm run test 即可執行測試。
- validate：初始化 Joi 的程式碼目錄。Joi 是檢核 JavaScript 物件的函式庫，此專案使用此函式庫來檢核請求參數是否正確。
- app.js：初始化 Express 的 app 的檔案。
- index.js：專案程式碼的進入點。
- package.js：NodeJS 的專案開發配置檔。

資料表說明
===
### Golang 文章資料表
    CREATE TABLE `post_golang` (
      `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵',
      `user_profile_id` int(11) NOT NULL COMMENT '發文者的使用者資料表主鍵',
      `reply_post_id` int(11) DEFAULT NULL COMMENT '回覆目標文章的主鍵',
      `topic` varchar(30) NOT NULL COMMENT '主題',
      `content` varchar(20000) NOT NULL COMMENT '內文',
      `created_at` datetime NOT NULL COMMENT '建立時間',
      `updated_at` datetime DEFAULT NULL COMMENT '修改時間',
      `deleted_at` datetime DEFAULT NULL COMMENT '刪除時間',
      PRIMARY KEY (`id`)
    ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Golang 文章資料表'

### Node.js 文章資料表
    CREATE TABLE `post_nodejs` (
      `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵',
      `user_profile_id` int(11) NOT NULL COMMENT '發文者的使用者資料表主鍵',
      `reply_post_id` int(11) DEFAULT NULL COMMENT '回覆目標文章的主鍵',
      `topic` varchar(30) NOT NULL COMMENT '主題',
      `content` varchar(20000) NOT NULL COMMENT '內文',
      `created_at` datetime NOT NULL COMMENT '建立時間',
      `updated_at` datetime DEFAULT NULL COMMENT '修改時間',
      `deleted_at` datetime DEFAULT NULL COMMENT '刪除時間',
      PRIMARY KEY (`id`)
    ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Node.js 文章資料表'

### 使用者資料表
    CREATE TABLE `user_profile` (
      `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵',
      `username` varchar(20) NOT NULL COMMENT '使用者名稱',
      `email` varchar(50) NOT NULL COMMENT '電子信箱',
      `password` varchar(100) NOT NULL COMMENT '密碼',
      `role` varchar(10) NOT NULL COMMENT '角色：admin 系統管理者、user 一般使用者。',
      `is_disabled` tinyint(1) DEFAULT '0' COMMENT '0: 啟用。1：停用。',
      `created_at` datetime NOT NULL COMMENT '建立時間',
      `updated_at` datetime DEFAULT NULL COMMENT '修改時間',
      PRIMARY KEY (`id`)
    ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='使用者資料表'

View 說明
===
### Golang 各主題的最新回覆文章 id 和回覆數的 View
    create or replace view view_post_golang_last_reply
    as 
    select
        max(post_golang.id) as id,
        count(*) as reply_count
    from
        post_golang
    where
        post_golang.reply_post_id is not null
    group by
        post_golang.reply_post_id
    
### Node.js 各主題的最新回覆文章 id 和回覆數的 View
    create or replace
    view view_post_nodejs_last_reply
    as
    select
        max(post_nodejs.id) as id,
        count(*) as reply_count
    from
        post_nodejs
    where
        post_nodejs.reply_post_id is not null
    group by
        post_nodejs.reply_post_id

### Golang 各主題的最新回覆文章的時間、作者和回覆數的 View
    create or replace view view_post_golang_each_topic_last_reply
    as
    select
        p.id as id,
        p.user_profile_id as user_profile_id,
        p.reply_post_id as reply_post_id,
        p.topic as topic,
        p.content as content,
        p.created_at as created_at,
        p.updated_at as updated_at,
        u.username as username,
        u.email as email,
        u.role as role,
        last_reply.reply_count as reply_count
    from
        post_golang p
    join user_profile u 
      on p.user_profile_id = u.id
    join view_post_golang_last_reply last_reply
      on p.id = last_reply.id
    order by
        p.reply_post_id desc
    
### Node.js 各主題的最新回覆文章的時間、作者和回覆數的 View
    create or replace view view_post_nodejs_each_topic_last_reply
    as
    select
        p.id as id,
        p.user_profile_id as user_profile_id,
        p.reply_post_id as reply_post_id,
        p.topic as topic,
        p.content as content,
        p.created_at as created_at,
        p.updated_at as updated_at,
        u.username as username,
        u.email as email,
        u.role as role,
        last_reply.reply_count as reply_count
    from
        post_nodejs p
    join user_profile u
      on p.user_profile_id = u.id
    join view_post_nodejs_last_reply last_reply
      on p.id = last_reply.id
    order by
        p.reply_post_id desc
