const User = require('../models/user');
const { linkValidator } = require('../utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.findUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const update = { $set: {} };
  const { _id: meId } = req.user;

  if (name !== undefined) update.$set.name = name;
  if (about !== undefined) update.$set.about = about;

  User.findByIdAndUpdate(
    meId,
    update,
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: meId } = req.user;

  User.schema.path('avatar').validate(linkValidator);

  User.findByIdAndUpdate(
    meId,
    { $set: { avatar } },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};