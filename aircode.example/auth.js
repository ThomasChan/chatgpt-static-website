// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

module.exports = async function (params, context) {
  console.log(params);
  if (/* do your authenticate here */true) {
    context.status(200);
    return 'login success';
  }
  context.status(401);
  return 'wrong password';
}
