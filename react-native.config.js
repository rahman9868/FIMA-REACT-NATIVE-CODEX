module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    'react-native-safe-area-context': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-safe-area-context/android',
        },
      },
    },
  },
};
