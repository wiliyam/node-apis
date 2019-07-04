exports.register = (server, options) => {

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'session'
    },
    handler: (request, h) => {

      return h.view('manager/list.html', {
        hours: [
          {
            enteredBy: 'user1',
            hours: 40
          },
          {
            enteredBy: 'user2',
            hours: 45
          },
          {
            enteredBy: 'user3',
            hours: 80
          },
          {
            enteredBy: 'user4',
            hours: 5
          }
        ]
      });
    }
  });

};

exports.pkg = {
  name: "manager"
};