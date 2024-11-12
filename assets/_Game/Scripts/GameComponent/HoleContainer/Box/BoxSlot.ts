import { _decorator, Component, Node } from 'cc';
import { Box } from './Box';
import { CCBoolean } from 'cc';
import { CCInteger } from 'cc';
import { Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoxSlot')
export class BoxSlot extends Component {
    @property({ type: Box })
    private box : Box = null;
    @property(CCBoolean)
    public isAds: boolean = false;
    @property(Node)
    public boxHolder : Node = null;
    @property(Node)
    public boxAdsPrefab : Node = null;

    @property(CCInteger)
    public lockCount: number = 0;
    @property(CCInteger)
    public currentCount: number = 0;
    @property(Label)
    public lockText: Label = null;

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

    public SetUnlockBox(): void
    {
        if(this.isAds)
        {
            this.lockText.node.active = true;
            this.lockText.string = this.currentCount + "/" + this.lockCount;
        }
    }

}


