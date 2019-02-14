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
