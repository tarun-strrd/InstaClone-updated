let keys;
const dev_keys = require("./dev");
const prod_keys = require("./prod");
if (process.env.NODE_ENV == "production") {
  keys = prod_keys;
} else {
  //console.log(dev_keys);
  keys = dev_keys;
}

module.exports = keys;
