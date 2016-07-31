module.exports = [
  (req, res) => {
    res.json({ msg: req.data })
  },
  (err, req, res, next) => {
    res.json({ err: err })
  }
];
