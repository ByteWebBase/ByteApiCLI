export default () => {
  return {
    type: "list",
    message: "select the database",
    name: "database",
    choices: [
      {
        name: "字节轻服务",
      },
      {
        name: "MongoDB",
      },
      {
        name: "阿里云表格存储",
      },
      {
        name: "MySQL",
      },
    ],
  };
};
