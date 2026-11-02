// Mock version data in memory (normally this would be in MongoDB)
let currentAppVersion = {
  android: {
    versionCode: 15,
    versionName: "1.2.5",
    isForceUpdate: false,
    releaseNotes: "Added AI Voice Assistant and Emergency SOS features.",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.mediconnect.app"
  },
  ios: {
    versionCode: 12,
    versionName: "1.2.0",
    isForceUpdate: true,
    releaseNotes: "Critical security patch and new Dark Mode.",
    downloadUrl: "https://apps.apple.com/app/id123456789"
  }
};

// @desc   Get current app version details
// @route  GET /api/version
exports.getAppVersion = (req, res) => {
  res.status(200).json({
    success: true,
    data: currentAppVersion
  });
};

// @desc   Update app version info (Admin only)
// @route  POST /api/version
exports.updateAppVersion = (req, res) => {
  const { android, ios } = req.body;
  if (android) currentAppVersion.android = { ...currentAppVersion.android, ...android };
  if (ios) currentAppVersion.ios = { ...currentAppVersion.ios, ...ios };
  
  res.status(200).json({
    success: true,
    message: "App version details updated successfully",
    data: currentAppVersion
  });
};
