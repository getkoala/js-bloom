/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.js?$": "ts-jest",
    "^.+\\.ts?$": "ts-jest",
  },
};
