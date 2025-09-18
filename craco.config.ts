import path from 'path';

module.exports = {
  webpack: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets/"),
      "@features": path.resolve(__dirname, "src/features/"),
      "@routes": path.resolve(__dirname, "src/routes/"),
      "@shared": path.resolve(__dirname, "src/shared/"),
      "@styles": path.resolve(__dirname, "src/styles/"),
    },
  },
};
