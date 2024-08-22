const methodConstant = {
  POST: "POST",
  PUT: "PUT",
  GET: "GET",
  DELETE: "DELETE",
  BAD_REQUEST: "BAD_REQUEST",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
};

const msgConstant = {
  PAYMENT_SUCCESS: "payment-success",
};
const msgTypeConstant = {
  BROADCAST: "broadcast",
  SINGLE: "single",
};

module.exports = {
  methodConstant,
  msgConstant,
  msgTypeConstant,
};
