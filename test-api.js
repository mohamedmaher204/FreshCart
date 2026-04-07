const fs = require("fs");
fetch("http://localhost:3000/api/recommendations")
  .then(res => res.text())
  .then(text => fs.writeFileSync("error_output.txt", text))
  .catch(err => fs.writeFileSync("error_output.txt", err.message));
