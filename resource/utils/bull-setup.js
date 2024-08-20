const Queue = require("bull");
const { redisHost, redisPort, password, redisPassword } = require("./config");
const { ImagesModel } = require("../models/images");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const { globalFunc } = require("../helper/global-func");

const redisConfig = {
  redis: {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
  },
};

// ==== CRON JOB SCHEDULER =============================================================

// SCHEDULE CLEAN DATABASE
const cron_clean_images = new Queue("Cron Clean Images", redisConfig);
cron_clean_images.process(async (job) => {
  console.log(`+++++++++++ Cron job will execute every 6 month +++++++++++}`);
  // delete image
  await ImagesModel.destroy({
    where: { [Op.or]: [{ status: false }, { ref_id: null }] },
  });
});
cron_clean_images.add(
  {},
  {
    repeat: {
      cron: "* * 1 */6 *", // Setiap 6 bulan pada tanggal 1 pukul 00:00
    },
  },
);
cron_clean_images.on("failed", (job, err) => {
  console.error(`Job failed with error ${err.message}`);
});

// ====- QUEUE =============================================================

// EMAIL
// Membuat queue baru untuk email
const queue_send_email = new Queue("Send Email", redisConfig);
queue_send_email.process(async (job) => {
  const { type, to } = job.data;

  const info = globalFunc.sendEmail({ type, to });

  return Promise.resolve(info.messageId);
});

module.exports = { cron_clean_images, queue_send_email };