var routes = {
  GET: {
    '/users': function (req, res) {
      res.end('tobi, loki, ferret')
    },
    '/user/:id': function (req, res, id) {
      res.end('user ' + id)
    }
  },
  DELETE: {
    '/user/:id': function (req, res, id) {
      res.end('deleted user ' + id)
    }
  }
}
