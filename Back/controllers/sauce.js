const Sauce = require('../models/Sauce');
const fs = require('fs');

//exports.createThing = (req, res, next) => {
// delete req.body._id;
// const thing = new Thing({
//   ...req.body
// });
// thing.save()
//   .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//   .catch(error => res.status(400).json({ error }));

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

// exports.modifyThing = (req, res, next) => {
//   Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//     .then(() => res.status(200).json({ message: 'Objet modifié !' }))
//     .catch(error => res.status(400).json({ error }));
// };

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Thing.findOne({_id: req.params.id})
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

// exports.deleteThing = (req, res, next) => {
//   Thing.deleteOne({ _id: req.params.id })
//     .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
//     .catch(error => res.status(400).json({ error }));
// };

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


 exports.getOneSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error }));
 };

 exports.getAllSauce = (req, res, next) => {
   Sauce.find()
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(400).json({ error }));
 };
 
// exports.likeAndDislike = (req, res, next) => {
//   Sauce.findOne({_id: req.params.id});
//   if (like === 1) {
//     Sauce.updateOne(
//     { _id: req.params.id }, 
//     { $push: { usersLiked: userId } },
//     { $pull: { userDisliked : userId}},
//     { $inc: {likes: +1 }})
//     .then(sauce => res.status(200).json({ message: 'Like ajouté' }))
//     .catch(error => res.status(500).json({error : 'like non ajouté'}));
//   // }else if (like = 0){
//   //   // Sauce.updateOne(
//   //   //   { _id: req.params.id }, 
//   //   //   { $pull: { usersLiked: userId } }),
//   //   //   { $pull: { userDisliked : userId}},
//   //   //   { $inc: {likes: +1 }},
   
//     // }else if (like === -1) {
//     // Sauce.updateOne({ _id: req.params.id }, )
//   }
  
// }

exports.likeAndDislike = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  if (like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersLiked: userId },
        $pull: { usersDisliked: userId },
        $inc: { likes: 1 }
      })
      .then(() => {res.status(200).json({ message: 'Like ajouté' });})
      .catch(error => {res.status(500).json({ error: 'Erreur lors de la mise à jour du like' });});
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
                res.status(500).json({ error: "Erreur lors de l'annulation des likes" });
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
              .catch(error => {res.status(500).json({ error: "Erreur lors de l'annulation des likes" });
              });
          }
        })
      }
    }
       
    