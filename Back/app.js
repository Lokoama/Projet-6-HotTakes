const express = require ("express");
const mongoose = require('mongoose');
const app = express ();
const path = require('path');
const cors = require ('cors')

const sauceRoutes = require("./routes/sauce");
const userRoutes = require ("./routes/user")

mongoose.connect('mongodb+srv://thegingerjad:motdepasse@cluster0.nff6ddq.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
// app.use(cors);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;