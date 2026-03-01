const momgoose = require("mongoose");

const blacklistTokenSchema = new momgoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be added in blacklist"],
    },
  },
  {
    timestamps: true,
  },
);

const tokenBlackListModel = momgoose.model(
  "balcklistToken",
  blacklistTokenSchema,
);

module.exports = tokenBlackListModel;
