const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { cron_clean_images } = require("./resource/utils/bull-setup");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const indexRouter = require("./routes/index");
const notFoundMiddleware = require("./resource/middleware/not-found");
const handleErrorMiddleware = require("./resource/middleware/handle-error");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); //
const { redisLogo } = require("./resource/utils/config");

// Redis
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(cron_clean_images)],
  serverAdapter: serverAdapter,
  options: {
    uiConfig: {
      boardTitle: "KitaBantu",
      boardLogo: {
        path: redisLogo,
        width: "75px",
        height: 75,
      },
      miscLinks: [{ text: "Logout", url: "/logout" }],
      favIcon: {
        default: "static/images/logo.svg",
        alternative: "static/favicon-32x32.png",
      },
    },
  },
});

// createBullBoard({
//   queues: [new BullAdapter(cronJobQueue)],
//   serverAdapter,
//   options: {
//     uiConfig: {
//       boardTitle: "My BOARD",
//       boardLogo: {
//         path: "https://firebasestorage.googleapis.com/v0/b/trackmoney-af0db.appspot.com/o/icons%2Fmore.png?alt=media&token=75016435-e25f-4629-aef1-ce5ed3793eae",
//         width: "100px",
//         height: 200,
//       },
//       miscLinks: [{ text: "Logout", url: "/logout" }],
//       favIcon: {
//         default: "static/images/logo.svg",
//         alternative: "static/favicon-32x32.png",
//       },
//     },
//   },
// });

const app = express();
app.use("/admin/queues", serverAdapter.getRouter());

app.use(cors());
app.use(helmet());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const apiV1 = "/api/v1/";
app.use(apiV1, indexRouter);

// middleware
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
