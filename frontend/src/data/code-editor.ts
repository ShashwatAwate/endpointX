export const EXPRESS_BOILERPLATE = `const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
| Start writing your handlers from here 
| Example:
| app.post("/api/example", (req, res) => {
|   res.json({ message: "Hello World" });
| });
*/

module.exports = app;
`;
