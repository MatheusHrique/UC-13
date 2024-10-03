const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
app.use(bodyParser.json());

// Permitir CORS para o frontend no XAMPP (http://localhost)
app.use(
  cors()
  // {origin: "http://localhost",}
);

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "diagweblogin",
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const storedHash = () => {
    db.query(
      "SELECT password FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.sendStatus(200); // Login bem-sucedido
          return results;
        } else {
          res.status(401).send("Email inválido!");
        }
      }
    );
  }

  bcrypt.compare(password, storedHash, (err, result) => {
    if (err) throw err;
    if (result) {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) throw err;
          if (results.length > 0) {
            res.sendStatus(200); // Login bem-sucedido
          } else {
            res.status(401).send("Email inválido!");
          }
        }
      );
    } else {
      res.status(401).send("Senha inválida");
    }
  });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 10; // Número de rounds para salting

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash],
      (err, result) => {
        if (err) throw err;
        res.sendStatus(201); // Usuário registrado com sucesso
      }
    );
  });
});

app.get("/menu", (req, res) => {
  db.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(500).send("Erro ao obter usuários.");
      return;
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
