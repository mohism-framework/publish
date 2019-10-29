import ActionBase from '@mohism/cli-wrapper/dist/libs/action.class';
import { Dict, ArgvOption } from '@mohism/cli-wrapper/dist/libs/utils/type';
import { red, yellow, blue } from 'colors';
import { existsSync, writeFileSync } from 'fs';
import { exec } from 'shelljs';

class PublishAction extends ActionBase {
  options(): Dict<ArgvOption> {
    return {
      'push': {
        default: false,
        desc: 'push to npm'
      }
    };
  }
  description(): string {
    return '尝试更好的管理npm发布方式';
  }

  async run(options: Dict<any>): Promise<any> {
    const { push } = options;
    if (!existsSync(`${process.cwd()}/package.json`)) {
      this.fatal(`Not found: ${process.cwd()}/package.json`);
    }
    const pkg = require(`${process.cwd()}/package.json`);
    const { version: currentVersion = '1.0.0' } = pkg;
    const [major, minor, patch] = currentVersion.split('.').map((v: number) => +v);
    const answer = await this.question.select(
      `当前版本${currentVersion}, 请问阁下意欲何为:`.green,
      [
        `升级主版本: ${red(`${major + 1}`)}.${minor}.${patch}`,
        `升级次版本: ${major}.${yellow(`${minor + 1}`)}.${patch}`,
        `打个补丁: ${major}.${minor}.${blue(`${patch + 1}`)}`,
        '什么也不做'
      ]
    );
    const newVersion = ((idx: number): string => {
      switch (idx) {
      case 0:
        return `${major + 1}.0.0`;
      case 1:
        return `${major}.${minor + 1}.0`;
      case 2:
        return `${major}.${minor}.${patch + 1}`;
      case 3:
        return currentVersion;
      default:
        return currentVersion;
      }
    })(answer);

    if (newVersion === currentVersion) {
      this.info('什么也不做');
      process.exit();
    }

    pkg.version = newVersion;
    writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pkg, null, 2));
    this.info('Successful Updated package.json');

    if (push === true || push === 1) {
      const name: string = pkg.name as string;
      if (name.startsWith('@') && name.includes('/')) {
        exec('npm publish --access public');
      } else {
        exec('npm publish');
      }
    }
  }
}

export default new PublishAction();