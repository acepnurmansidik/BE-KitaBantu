const { verifyJwtToken } = require("../helper/global-func");
const { AuthUserModel } = require("../models/auth");
const { OrganizerModel } = require("../models/organizer");
const { RolesModel } = require("../models/roles");
const { UnauthenticatedError } = require("../utils/errors");
const NotFound = require("../utils/errors/not-found");

const AuthorizeUserLogin = async (req, res, next) => {
  try {
    // get JWT token from header
    const authHeader =
      req.headers.authorization?.split(" ")[
        req.headers.authorization?.split(" ").length - 1
      ];

    // send error Token not found
    if (!authHeader) throw new UnauthenticatedError("Invalid credentials!");

    // verify JWT token
    const dataValid = await verifyJwtToken(authHeader, next);

    // check email is register on database and organizer
    const [verifyData, dataOrganizer] = await Promise.all([
      await AuthUserModel.findOne({
        where: { email: dataValid.email },
        attributes: ["id", "username"],
        include: {
          model: RolesModel,
          attributes: ["role_name"],
        },
      }),
      await OrganizerModel.findOne({
        include: {
          model: AuthUserModel,
          where: { email: dataValid.email },
        },
      }),
    ]);
    // const dataOrganizer = await OrganizerModel.findOne({ id: verifyData.id });

    // send error not found, if data not register
    if (!verifyData) throw new NotFound("Data not register!");

    // impliment login user
    delete dataValid.iat;
    delete dataValid.exp;
    delete dataValid.jti;

    req.login = {
      user_id: verifyData.id,
      organizer_id: !dataOrganizer ? null : dataOrganizer.id,
      ...dataValid,
      ...verifyData.role.toJSON(),
    };

    // next to controller
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { AuthorizeUserLogin };
