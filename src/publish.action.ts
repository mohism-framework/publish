import { ActionBase, ArgvOption, IWithSubCommands } from '@mohism/sloty';
import { blue, red, yellow } from 'colors';
import { existsSync, writeFileSync } from 'fs';
import { exec } from 'shelljs';
import { Dict } from '@mohism/utils';

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

  async run(options: IWithSubCommands): Promise<void> {
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
        {
          label: `升级主版本: ${red(`${major + 1}`)}.0.0`,
          value: '0',
        },
        {
          label: `升级次版本: ${major}.${yellow(`${minor + 1}`)}.0`,
          value: '1',
        },
        {
          label: `打个补丁: ${major}.${minor}.${blue(`${patch + 1}`)}`,
          value: '2',
        },
        {
          label: '什么也不做',
          value: '3',
        },
      ]
    );

    const newVersion = ((idx: string): string => {
      switch (idx) {
      case '0':
        return `${major + 1}.0.0`;
      case '1':
        return `${major}.${minor + 1}.0`;
      case '2':
        return `${major}.${minor}.${patch + 1}`;
      case '3':
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