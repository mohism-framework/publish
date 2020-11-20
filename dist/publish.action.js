"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sloty_1 = require("@mohism/sloty");
const colors_1 = require("colors");
const fs_1 = require("fs");
const shelljs_1 = require("shelljs");
class PublishAction extends sloty_1.ActionBase {
    options() {
        return {
            'push': {
                default: false,
                desc: 'push to npm'
            }
        };
    }
    description() {
        return '尝试更好的管理npm发布方式';
    }
    run(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { push } = options;
            if (!fs_1.existsSync(`${process.cwd()}/package.json`)) {
                this.fatal(`Not found: ${process.cwd()}/package.json`);
            }
            const pkg = require(`${process.cwd()}/package.json`);
            const { version: currentVersion = '1.0.0' } = pkg;
            const [major, minor, patch] = currentVersion.split('.').map((v) => +v);
            const answer = yield this.question.select(`当前版本${currentVersion}, 请问阁下意欲何为:`.green, [
                `升级主版本: ${colors_1.red(`${major + 1}`)}.0.0`,
                `升级次版本: ${major}.${colors_1.yellow(`${minor + 1}`)}.0`,
                `打个补丁: ${major}.${minor}.${colors_1.blue(`${patch + 1}`)}`,
                '什么也不做'
            ]);
            const newVersion = ((idx) => {
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
            })(Number.parseInt(answer, 10));
            if (newVersion === currentVersion) {
                this.info('什么也不做');
                process.exit();
            }
            pkg.version = newVersion;
            fs_1.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(pkg, null, 2));
            this.info('Successful Updated package.json');
            if (push === true || push === 1) {
                const name = pkg.name;
                if (name.startsWith('@') && name.includes('/')) {
                    shelljs_1.exec('npm publish --access public');
                }
                else {
                    shelljs_1.exec('npm publish');
                }
            }
        });
    }
}
exports.default = new PublishAction();
