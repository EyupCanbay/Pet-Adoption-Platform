const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    level: { type: String },
    email: { type: String },
    location: { type: String },
    processType: { type: String },
    log: { type: mongoose.Schema.Types.Mixed }
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("AuditLogs", auditLogSchema);
