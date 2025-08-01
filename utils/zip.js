import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const folderName = path.join('zip')
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  const output = fs.createWriteStream(path.join(folderName, 'qrcode-generator-v' + packageJson.version + '.zip'));
  
  const archive = archiver('zip');

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  // 压缩文件夹
  archive.directory('dist/', false);

  // 完成压缩
  archive.finalize();

  console.log("Zip file created");
} catch (err) {
  console.error(err);
}