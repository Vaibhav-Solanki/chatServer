const { connect } = require("mongoose");
module.exports = () =>
  connect(
    `mongodb+srv://VaibhavDasss:${process.env.key}@onenetwork.ozbbj.mongodb.net/chatserver?retryWrites=true&w=majority`
  );
