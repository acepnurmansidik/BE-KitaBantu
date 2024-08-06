const Mustache = require("mustache");
const nodemailer = require("nodemailer");
const ENV = require("../utils/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../utils/errors");

const transporter = nodemailer.createTransport({
  host: ENV.emailHost,
  port: ENV.emailPort,
  secure: ENV.emailSecure, // true for 465, false for other ports
  auth: {
    user: ENV.emailSender,
    // password device
    pass: ENV.emailPassword,
  },
});

const globalFunc = {};

/**
 * -----------------------------------------------
 * | EMAIL
 * -----------------------------------------------
 * | if you wanna send email to yours friends
 * | or another people this function can do it
 * | don't worry this very secret, just you and me
 * |
 */
globalFunc.sendEmail = async ({ template, payload, receive, subject }) => {
  // Get template email from html file
  const tempFile = fs.readFileSync(
    `resource/app/templates/html/${template}.html`,
    "utf-8",
  );

  // create instance email/config email
  let message = {
    from: ENV.emailSender,
    to: receive,
    subject,
    html: Mustache.render(tempFile, payload),
  };

  // send email
  return await transporter.sendMail(message);
};

/**
 * -----------------------------------------------
 * | HASH PASSWORD
 * -----------------------------------------------
 * | Sometimes you must like anonymous, i mean
 * | your privacy keep safe, don't let people know
 * | so this function can be guard your privacy
 * |
 */
globalFunc.hashPassword = async ({ password }) => {
  return await bcrypt.hash(password, 12);
};

globalFunc.verifyPassword = async ({ password, hashPassword }) => {
  return await bcrypt.compare(password, hashPassword);
};

/**
 * -----------------------------------------------
 * | JSON WEB TOKEN
 * -----------------------------------------------
 * | if you wanna privacy data exchange
 * | this function can be help you
 * | and your privay keep safe using JWT
 * |
 */
globalFunc.generateJwtToken = async (payload, next) => {
  delete payload.password;
  const jwtSignOptions = {
    algorithm: ENV.algorithmToken,
    expiresIn: ENV.jwtExpired,
    jwtid: ENV.jwtID,
  };
  // create token
  const token = await jwt.sign(payload, ENV.secretToken, jwtSignOptions);

  // verify token
  const refresh = await verifyJwtToken(token);
  delete refresh.jti;
  delete refresh.exp;
  delete refresh.iat;
  jwtSignOptions.expiresIn = ENV.jwtRefreshExpired;
  // create refresh token
  const refreshToken = await jwt.sign(refresh, ENV.secretToken, jwtSignOptions);

  return {
    token,
    refreshToken,
  };
};

const verifyJwtToken = async (token, next) => {
  try {
    // verify token
    const decode = await jwt.verify(token, ENV.secretToken, (err, decode) => {
      if (err) throw new UnauthenticatedError(err.message);
      if (!err) return decode;
    });
    return decode;
  } catch (err) {
    next(err);
  }
};

/**
 * -----------------------------------------------
 * | DYNAMIC QUERY SEARCH
 * -----------------------------------------------
 * | Hey it sounds good and powerfull for
 * | this function, you don't need to bother
 * | writing long search queries
 * |
 */
globalFunc.QuerySearch = async (payload) => {
  const result = {};
  for (const everyData of payload) {
    Object.keys(everyData["values"]).map((item) => {
      result[item] = {
        [Op[everyData["opr"]]]: `%${everyData["values"][item]}%`,
      };
      if ([compaOpr.ILIKE, compaOpr.NOT_ILIKE].includes(everyData["opr"])) {
        result[item] = {
          [Op[everyData["opr"]]]: `%${everyData["values"][item]}%`,
        };
      } else if (
        [
          compaOpr.IN,
          compaOpr.NOT_IN,
          compaOpr.BETWEEN,
          compaOpr.NOT_BETWEEN,
        ].includes(everyData["opr"])
      ) {
        let temp = [
          ...everyData["values"][item],
          `${everyData["values"][item]}`,
        ];
        result[item] = {
          [Op[everyData["opr"]]]: temp,
        };
      } else if ([compaOpr.AND, compaOpr.OR].includes(everyData["opr"])) {
        let temp = [
          ...everyData["values"][item],
          { item: `${everyData["values"][item]}` },
        ];
        result[item] = {
          [Op[everyData["opr"]]]: temp,
        };
      } else {
        result[item] = {
          [Op[everyData["opr"]]]: `${everyData["values"][item]}`,
        };
      }
    });
  }

  return result;
};

globalFunc.GenerateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Menghapus karakter non-alfanumerik kecuali spasi dan tanda penghubung
    .replace(/\s+/g, "-") // Menggantikan spasi dengan tanda penghubung
    .replace(/-+/g, "-") // Menggabungkan beberapa tanda penghubung menjadi satu
    .trim("-"); // Menghapus tanda penghubung di awal dan akhir
};

globalFunc.titleCase = (title) => {
  return title.replace(/\b[a-z]/g, (char) => char.toUpperCase());
};

globalFunc.sayThanks = () => {
  const word = [
    "Terima kasih, pahlawan lingkungan! 🌿",
    "Terima kasih atas dukunganmu! 🙏",
    "Anda luar biasa, terima kasih! ⭐",
    "Terima kasih telah peduli! 💖",
    "Sumbanganmu sangat berarti! 💰",
    "Terima kasih atas kebaikanmu! 😊",
    "Terima kasih telah berbagi! 🤝",
    "Terima kasih atas kepedulianmu! 🌍",
    "Terima kasih telah membuat perbedaan! 🕊️",
    "Terima kasih telah mendukung kami! 💪",
    "Bantuanmu sangat dihargai! 🙌",
    "Terima kasih atas kontribusimu! 🏆",
    "Terima kasih atas kemurahan hatimu! ❤️",
    "Terima kasih telah membantu sesama! 🤗",
    "Terima kasih telah menyelamatkan bumi! 🌱",
    "Terima kasih atas empati dan cinta! 💕",
    "Terima kasih telah berdonasi! 💳",
    "Terima kasih atas komitmenmu! 🎯",
    "Terima kasih atas semangatmu! 🔥",
    "Terima kasih telah menjadi inspirasi! 🌟",
  ];

  return word[((Math.random() * 100) / word.length).toFixed(0)];
};

module.exports = { globalFunc, verifyJwtToken };
