import { _decorator, Component, Node } from 'cc';
import { Box } from './Box';
const { ccclass, property } = _decorator;

@ccclass('BoxSlot')
export class BoxSlot extends Component {
    @property({ type: Box })
    private box : Box = null;

    public get Box (): Box
    {
        return this.box;
    }

    public SetBox(): void
    {
        this.box = this.getComponentInChildren(Box);
    }
}


