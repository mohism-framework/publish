import { ActionBase, ArgvOption, IWithSubCommands } from '@mohism/sloty';
import { Dict } from '@mohism/utils';
declare class PublishAction extends ActionBase {
    options(): Dict<ArgvOption>;
    description(): string;
    run(options: IWithSubCommands): Promise<void>;
}
declare const _default: PublishAction;
export default _default;
