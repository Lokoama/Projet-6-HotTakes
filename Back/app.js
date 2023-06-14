//Fichier principal
//Importation des modules, path pour le chemin des fichier, cors pour la gestion des CORS, dotenv pour changer les variables et helmet pour la sécurité 
const express = require ("express");
const mongoose = require('mongoose');
const app = express ();
const path = require('path');
const cors = require ('cors');
require('dotenv').config();
const helmet = require("helmet");

//Routes pour les fonctionnalité des sauces et des utilisateurs
const sauceRoutes = require("./routes/sauce");
const userRoutes = require ("./routes/user")

//Connection à la BDD avec la variable d'environnement
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.SERVER_DB}/${process.env.NAME_DB}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Permet de se servir d'express pour traiter les données JSON
app.use(express.json());
//Permet de traiter les requêtes HTTP
app.use(express.urlencoded({extended:true}))
//Permet de traiter des données venant de deux domaines différents
// app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Ressource-Policy', 'same-site');
  next();
});
//Permet de sécurisé les en tête HTTP
app.use(helmet());
//Fonction express qui permet d'utiliser les fichier static, ici il s'agira des images
app.use('/images', express.static(path.join(__dirname, 'images')));
//Route pour les fonctionnalités d'authentification des utilisateurs et des sauces.
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;