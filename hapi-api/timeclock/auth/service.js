const users = {
  john: {
    username: 'john',
    password: 'changeme',
    name: 'John Doe',
    id: '2133d32a'
  },
  client2: {
    username: 'client2',
    password: 'changeme',
    name: 'client2',
    id: '1234'
  }
};

module.exports.validate = async (request, username, password, h) => {

  const user = users[username];
  if (!user) {
    return { credentials: null, isValid: false };
  }

  const isValid = password === user.password;
  const credentials = { id: user.id, username: user.username };

  return { isValid, credentials };
};