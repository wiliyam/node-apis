exports.register = (server) => {

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: false,
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('home/unauthenticated.html', {
        next: request.query.next
      }, {
        layout: false
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/home',
    config: {
      auth: 'session'
    },
    handler: {
      view: 'home/home.html'
    }
  });

};

exports.pkg = {
  name: "home"
};