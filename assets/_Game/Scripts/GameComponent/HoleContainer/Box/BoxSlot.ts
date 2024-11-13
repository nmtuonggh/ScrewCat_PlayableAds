import { _decorator, Component, Node } from 'cc';
import { Box } from './Box';
import { CCBoolean } from 'cc';
import { CCInteger } from 'cc';
import { Label } from 'cc';
import { sp } from 'cc';
import { Color } from 'cc';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { set } from '../../../../../../extensions/nvthan/@types/packages/scene/@types/cce/utils/lodash';
import { AudioController, AudioType } from '../../../AudioController/AudioController';
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

    private randomTime: number = 0;
    private accumulatedTime: number = 0;

    protected update(dt: number): void {
        if (this.lockAnim.node.active) {
            if (this.randomTime === 0) {
                this.randomTime = Math.random() * 10000; // Random time between 0 and 10000 milliseconds (10 seconds)
            }

            this.accumulatedTime += dt * 1000; // Convert dt to milliseconds

            if (this.accumulatedTime >= this.randomTime) {
                this.ActAnimation();
                this.resetTimers();
            }
        }
    }

    private resetTimers(): void {
        this.randomTime = 0;
        this.accumulatedTime = 0;
    }
    
    public InitBoxSlotData (): void
    {
        this.box = this.getComponentInChildren( Box );
    }

    public SetTextLockBox (): void
    {
        this.lockText.node.active = true;
        this.lockText.color = new Color( 255, 255, 255 );
        this.lockText.string = this.currentCount + "/" + this.lockCount;
    }

    public SetLock (): void
    {
        this.lockAnim.node.active = true;
        this.ActAnimation();
    }

    public ActAnimation (): void
    {
        this.lockAnim.setAnimation( 0, 'Act', false );
        AudioController.Instance.PlayAudio( AudioType.chainVibrate );
    }

    public UnlockAnimation (): void
    {
        this.lockAnim.setAnimation( 0, 'Unlock', false );
    }

    public TextLockBoxAnim(): void
    {
        tween( this.lockText.node )
        .to( 0.25, { scale: new Vec3( 1.2, 1.2, 1.2 ) } )
        .to( 0.25, { scale: new Vec3( 1, 1, 1 ) })
        .start();
    }
}


