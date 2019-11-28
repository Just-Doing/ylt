const chalk = require("chalk");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const memFs = require("mem-fs");
const memFsEditor = require("mem-fs-editor");
const path = require("path");
const shell = require("shelljs");

class Creator {
  constructor() {
    // 创建内存store
    const store = memFs.create();
    this.fs = memFsEditor.create(store);

    // 存储命令行获取的数据，作为demo这里只要这两个；
    this.options = {
      name: "",
      description: ""
    };
    this.rootPath = path.resolve(__dirname, "../");
    this.tplDirPath = path.join(this.rootPath, "template");
  }
  // 初始化；
  init() {
    console.log(chalk.green("my cli 开始"));
    console.log();
    this.ask().then(answers => {
      this.options = Object.assign({}, this.options, answers);
      console.log(this.options);
      this.write();
    });
  }
  // 和命令行交互；
  ask() {
    const prompt = [];

    prompt.push({
      type: "input",
      name: "name",
      message: "请输入项目名称：",
      validate(input) {
        if (!input) {
          return "请输入项目名称：";
        }
        if (fs.existsSync(input)) {
          return "项目名称重复，请重新输入";
        }
        return true;
      }
    });

    prompt.push({
      type: "input",
      name: "description",
      message: "请输入项目描述"
    });
    return inquirer.prompt(prompt);
  }
  // 拷贝&写数据；
  write() {
    console.log(chalk.green("my cli 构建开始"));
    const tplBuilder = require("../template/cli.js");
    tplBuilder(this, this.options, () => {
      console.log(chalk.green("my cli 构建完成"));
      shell.exec(`cd ${this.options.name}
                  npm i`);
      console.log(
        chalk.grey(`开始项目:  cd ${this.options.name} && npm install`)
      );
    });
  }

  getTplPath(file) {
    return path.join(this.tplDirPath, file);
  }

  copyTpl(file, to, data = {}) {
    const tplPath = this.getTplPath(file);
    this.fs.copyTpl(tplPath, to, data);
  }

  copy(file, to) {
    const tplPath = this.getTplPath(file);
    this.fs.copy(tplPath, to);
  }
}

module.exports = Creator;
