const path = require("path");
const fs = require("fs");
const parser = require("fast-xml-parser");

function readSqlTemplate() {
  const xmlData = fs.readFileSync(path.join(__dirname, "template.xml"), "utf8");
  const sqlJsonData = parser.parse(xmlData, { ignoreAttributes: false });
  console.log(sqlJsonData);
  const sqlTemplate = {};

  sqlJsonData.Sqls.Sql.forEach(sqlElement => {
    sqlTemplate[sqlElement["@_name"]] = sqlElement["#text"];
  });

  return sqlTemplate;
}

const sqlTemplate = readSqlTemplate();
module.exports = sqlTemplate;
