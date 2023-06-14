const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const User = require('../models/User');

//Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    //Hachage du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
    //Création d'un nouvel utilisateur que l'on sauvegarde dans la DB
        const user = new User({
            email: req.body.email,
            password : hash
    })
    user.save()
        .then( () => res.status (201).json({message: 'Utilisateur Créé !'}))
        .catch(error => res.status (400).json({ error: 'test' }))
    })
    .catch(error => res.status (500))
};

//Connection d'un utilisateur si il n'est pas trouvé ou que le mdp est mauvais retourne une erreur de "Identifiant/MDP incorect"
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then( valid => {
                if (!valid) {
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'})
                } else {
                //Quand l'authentificatioon réussit l'utilisateur à un jeton d'accès (token) pendant 24h
                    res.status(200).json ({
                        userId : user._id,
                        token : jwt.sign(
                            { userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn : '24h'}
                        )
                    });
                }
            })
            .catch (error => {
                res.status(500).json ({error})
            })
        }
    })
    .catch(error => {
        res.status(500).json( {error})
    })
}

