const login = require("wchtools-api/lib/loginREST").instance;

async function handleLogin(context, apiOptions) {
  return login.login(context, apiOptions);
}

module.exports = { handleLogin };
