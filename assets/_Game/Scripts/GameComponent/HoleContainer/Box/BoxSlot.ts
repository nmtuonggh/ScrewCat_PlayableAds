import { _decorator, Component, Node } from 'cc';
import { Box } from './Box';
import { CCBoolean } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoxSlot')
export class BoxSlot extends Component {
    @property({ type: Box })
    private box : Box = null;
    @property(CCBoolean)
    public isAds: boolean = false;

    public get Box (): Box
    {
        return this.box;
    }

    public set Box ( value: Box )
    {
        this.box = value;
    }

    public InitBoxSlotData(): void
    {
        this.box = this.getComponentInChildren(Box);
    }

}


