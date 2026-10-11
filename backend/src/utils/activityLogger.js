const ActivityLog = require("../models/ActivityLog");

const createActivityLog = async ({
  actor,
  action,
  targetType,
  targetId,
  details,
}) => {
  try {
    await ActivityLog.create({
      actor,
      action,
      targetType,
      targetId,
      details,
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
};

module.exports = createActivityLog;