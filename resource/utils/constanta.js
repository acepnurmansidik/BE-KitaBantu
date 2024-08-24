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

const emailConstant = {
  OTP: "OTP",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  VERIFIKASI_EMAIL: "VERIFIKASI_EMAIL",
};

const msgTypeConstant = {
  BROADCAST: "broadcast",
  SINGLE: "single",
};

module.exports = {
  methodConstant,
  msgConstant,
  msgTypeConstant,
  emailConstant
};
