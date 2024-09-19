const fs = require('fs')
const os = require('os')
const { execSync } = require('child_process')

if (fs.existsSync('.nvmrc')) {
  const nvmrcContent = fs.readFileSync('.nvmrc', 'utf8').trim()
  const nvmVersion =
    os.platform() === 'win32' ? execSync('type .nvmrc', { encoding: 'utf8' }).trim() : nvmrcContent

  try {
    execSync(`nvm use ${nvmVersion}`, { stdio: 'inherit' })
    console.log('\x1b[32m%s\x1b[0m', 'Node.js 版本切换成功')
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Node.js 版本切换失败 Check installation nvm')
  }
} else {
  console.error('\x1b[31m%s\x1b[0m', '.nvmrc 文件不存在')
}
