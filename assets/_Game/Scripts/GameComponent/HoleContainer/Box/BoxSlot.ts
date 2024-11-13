import { _decorator, Component, Node } from 'cc';
import { Box } from './Box';
import { CCBoolean } from 'cc';
import { CCInteger } from 'cc';
import { Label } from 'cc';
import { sp } from 'cc';
import { Color } from 'cc';
import { tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BoxSlot' )
export class BoxSlot extends Component
{
    @property( { type: Box } )
    private box: Box = null;
    @property( CCBoolean )
    public isAds: boolean = false;
    @property( Node )
    public boxHolder: Node = null;
    @property( Node )
    public boxAdsPrefab: Node = null;
    @property( sp.Skeleton )
    public lockAnim: sp.Skeleton = null;

    @property( CCInteger )
    public lockCount: number = 0;
    @property( CCInteger )
    public currentCount: number = 0;
    @property( Label )
    public lockText: Label = null;

    public get Box (): Box
    {
        return this.box;
    }

    public set Box ( value: Box )
    {
        this.box = value;
    }

    public InitBoxSlotData (): void
    {
        this.box = this.getComponentInChildren( Box );
    }

    public SetTextLockBox (): void
    {
        this.lockText.node.active = true;
        this.lockText.color = new Color( 70, 70, 70 );
        this.lockText.string = this.currentCount + "/" + this.lockCount;
    }

    public SetLock (): void
    {
        this.lockAnim.node.active = true;
    }

    public ActAnimation (): void
    {
        this.lockAnim.setAnimation( 0, 'Act', false );
    }

    public TextLockBoxAnim(): void
    {
        tween( this.lockText.node )
        .to( 0.25, { scale: new Vec3( 1.2, 1.2, 1.2 ) } )
        .to( 0.25, { scale: new Vec3( 1, 1, 1 ) })
        .start();
    }
}


