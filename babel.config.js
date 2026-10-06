module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for VisionCamera frame processors (worklets on the camera thread)
      'react-native-worklets-core/plugin',
    ],
  };
};
