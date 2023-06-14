//importaion du modèle sauce
const Sauce = require('../models/Sauce');
//importation du module fs (file systeme) pour deleteSauce afin d'utiliser la méthode fs.unlink pour supprimer une image
const fs = require('fs');

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()
    .then(() => {res.status(201).json({ message: 'Nouvel sauce enregistré !' });
    })
    .catch(error => { res.status(400).json({ error });
    });
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(403).json({ message : 'Not authorized'});
          } else {
              Thing.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(403).json({message: 'Non autorisé'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

//Permet de récupérer une sauce
 exports.getOneSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
 };

 //Permet de récupérer toute les sauces
 exports.getAllSauce = (req, res, next) => {
   Sauce.find()
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(400).json({ error }));
 };
 
 //Ajout du like et dislike
exports.likeAndDislike = (req, res, next) => {
// Variable "like" de la requête
  const like = req.body.like;
//Variable qui contient l'id du user
  const userId = req.body.userId;
//Cas lors d'un like
  if (like === 1) {
//On ajoute l'id de l'utilisateur dans un tableau, incrémente de 1 la variable likes et retire l'id de l'utilisateur d'un tableau dislike. La même chose est faites pour le dislikes, sur d'autre tableau et variables.
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersLiked: userId },
        $pull: { usersDisliked: userId },
        $inc: { likes: 1 }
      })
      .then(() => {res.status(200).json({ message: 'Like ajouté' });})
      .catch(error => {res.status(500).json({ error: 'Erreur lors de la mise à jour du like' });});
//Cas lors d'un dislike
  } else if (like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $pull: { usersLiked: userId },
        $push: { usersDisliked: userId },
        $inc: { dislikes: 1 }
      })
      .then(() => {res.status(200).json({ message: 'Dislike ajouté' });})
      .catch(error => {res.status(500).json({ error: 'Erreur lors de la mise à jour du dislike' });});
//Cas lorsque le like ou dislike est annulé, ajout d'une condition pour chacun de ces cas.
    } else if (like === 0) {
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersLiked: userId },
                $inc: { likes: -1 }
              }
            )
              .then(() => {res.status(200).json({ message: 'Likes annulés' });})
              .catch(error => {
                res.status(500).json({ error: "Erreur lors de l'annulation du like" });
              });
          }else if(sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersDisliked: userId },
                $inc: { dislikes: -1 }
              }
            )
              .then(() => {res.status(200).json({ message: 'Dislikes annulés' });})
              .catch(error => {res.status(500).json({ error: "Erreur lors de l'annulation du dislike" });
              });
          }
        })
      }
    }
       
    