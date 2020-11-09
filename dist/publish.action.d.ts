import { ActionBase, ArgvOption } from '@mohism/sloty';
import { Dict } from '@mohism/utils';
declare class PublishAction extends ActionBase {
    options(): Dict<ArgvOption>;
    description(): string;
    run(options: Dict<any>): Promise<any>;
}
declare const _default: PublishAction;
export default _default;
