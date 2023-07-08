const { exec } = require("child_process");

class ModelService {
  //在命令行执行python命令
  async runPythonScript(ctx, pyFilePath, args) {
    return new Promise((resolve, reject) => {
      const command = `python ${pyFilePath} ${args
        .map((arg) => `"${arg}"`)
        .join(" ")}`;
      console.log(`Execute command: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error.message);
        } else if (stderr) {
          console.error(`Error: ${stderr}`);
          reject(stderr);
        } else {
          console.log(`Output: ${stdout}`);
          resolve(stdout);
        }
      });
    });
  }
}

module.exports = new ModelService();
