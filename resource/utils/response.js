const { StatusCodes } = require("http-status-codes");
const { methodConstant } = require("./constanta");

const response = {};

response.MethodResponse = ({ res, method, data, message }) => {
  let code = StatusCodes.OK;
  let responseMessage;
  switch (method) {
    case methodConstant.POST:
      code = StatusCodes.CREATED;
      responseMessage = "Data has created successfully!";
      break;
    case methodConstant.PUT:
      responseMessage = "Data has updated successfully!";
      break;
    case methodConstant.DELETE:
      responseMessage = "Data has deleted successfully!";
      break;
    case methodConstant.BAD_REQUEST:
      code = StatusCodes.BAD_REQUEST;
      responseMessage = message ? message : "Bad request!";
      break;
    case methodConstant.INTERNAL_SERVER_ERROR:
      code = StatusCodes.INTERNAL_SERVER_ERROR;
      responseMessage = message ? message : "Internal server error!";
      break;
    default:
      responseMessage = "Data retrieved successfully!";
      break;
  }

  return res.status(code).json({
    code,
    status: true,
    message: responseMessage,
    data,
  });
};

response.GetPaginationResponse = ({ res, data, page, page_size }) => {
  return res.status(StatusCodes.CREATED).json({
    code: StatusCodes.OK,
    status: true,
    message: "Data retrieved successfully!",
    data: {
      data,
      pagination: {
        page,
        page_size,
        total: data.length,
      },
    },
  });
};

response.ErrorResponse = (res, code, message) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    code,
    status: false,
    message,
    data: null,
  });
};

module.exports = response;
