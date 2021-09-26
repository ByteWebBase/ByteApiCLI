export default () => {
  return {
    type: "input",
    name: "database_url",
    message: "please input the database url",
    default() {
      return "mongodb://localhost:27017/test";
    },
  };
};
