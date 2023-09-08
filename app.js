import express from "express";
import { client } from "./db/db-connection.js";

const app = express();

app.use(express.json());

client.connect(function(err) {
  if (err) console.info(`err => `, err);
  console.info("Connected!");
});

app.get('/', (request, response) => {
  return response.send('Application online');
});

app.post('/create-simple-table', async (request, response) => {
  const query = `
    CREATE TABLE IF NOT EXISTS "languages" (
      "id" SERIAL,
      "name" VARCHAR(100) NOT NULL,
      PRIMARY KEY ("id")
    );`;

  await client.query(query);

  return response.status(201).json({message: 'created'})
});

app.post('/add-language', async (request, response) => {
  const { language } = request.body;

  const query = `INSERT INTO "languages" ("name") VALUES ($1)`;

  await client.query(query, [language]);

  return response.status(201).json({message: 'inserted'});
});

app.get('/list-language', async (request, response) => {
  const query = `SELECT	name FROM languages;`;

  const rows = await client.query(query);

  const list = rows.rows.reduce((acc, row) => {
    if(acc === "") {
      return row.name;
    }
    return `${acc}, ${row.name}`
  }, "");

  return response.send(list);
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.info(`Server Running at port ${port}`);
});