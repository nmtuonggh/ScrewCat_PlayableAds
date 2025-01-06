import { _decorator, Component, Node } from 'cc';
import { Box } from './Box';
import { Label } from 'cc';
import { sp } from 'cc';
import { Color } from 'cc';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { AudioController, AudioType } from '../../../AudioController/AudioController';
import { getGameSystem } from '../../../GameSystem';
import { PlayableAdsManager } from '../../../../../PA_iKame (1)/base-script/PlayableAds/PlayableAdsManager';
const { ccclass, property } = _decorator;

@ccclass( 'BoxSlot' )
export class BoxSlot extends Component
{
    @property( { type: Box, readonly: true } )
    private box: Box = null;
    @property( Node )
    public boxHolder: Node = null;
    @property( Node )
    public boxAdsPrefab: Node = null;
    @property( sp.Skeleton )
    private lockAnim: sp.Skeleton = null;
    @property( Label )
    private lockText: Label = null;
    //#region PROPERTY EXPOSED 
    public get LockText (): Label
    {
        return this.lockText;
    }
    public set LockText ( value: Label )
    {
        this.lockText = value;
    }
    @property( { group: "Lock" } )
    public get IsBlockByChain (): boolean
    {
        return this.isBlockByChain;
    }
    public set IsBlockByChain ( value: boolean )
    {
        this.isBlockByChain = value;
        this.lockAnim.node.active = value;
        this.lockAnim.setAnimation( 0, 'Idle', false );
    }

    public get TotalLockedCount (): number
    {
        return this.totalLockCount;
    }
    public set TotalLockedCount ( value: number )
    {
        this.totalLockCount = value;
    }
    public get CurrentLockedCount (): number
    {
        return this.currentLockCount;
    }
    public set CurrentLockedCount ( value: number )
    {
        this.currentLockCount = value;
    }
    public get LockAnim (): sp.Skeleton
    {
        return this.lockAnim;
    }
    public set LockAnim ( value: sp.Skeleton )
    {
        this.lockAnim = value;
    }
    public get IsInProgress (): boolean
    {
        return this.isInProgress;
    }
    public set IsInProgress ( value: boolean )
    {
        this.isInProgress = value;
    }
    
    //#endregion
    //#region PRIVATE FIELD
    @property( { visible: false, readonly: true, group: "Lock" } )
    private isBlockByChain: boolean = false;
    private isInProgress: boolean = false;

    private totalLockCount: number = 0;
    private currentLockCount: number = 0;

    //#endregion
    public get Box (): Box
    {
        return this.box;
    }

    public set Box ( value: Box )
    {
        this.box = value;
    }

    private randomTime: number = 0;

    private setRandomTime (): void
    {
        // Thiết lập thời gian ngẫu nhiên trong khoảng từ 1 đến 5 giây (có thể điều chỉnh)
        this.randomTime = Math.random() * 4 + 1;
    }

    private runRandomAnimation (): void
    {
        this.setRandomTime();
        setTimeout( () =>
        {
            this.lockAnim.setAnimation( 0, 'Act', false );
            this.runRandomAnimation(); // Tiếp tục quá trình
        }, this.randomTime * 1000 ); // Chuyển đổi giây sang mili giây
    }

    public startRandomAnimation (): void
    {
        this.runRandomAnimation();
    }



    public InitBoxSlotData (): void
    {
        this.box = this.getComponentInChildren( Box );
    }

    public TextLockBoxAnim (): void
    {
        tween( this.lockText.node )
            .to( 0.25, { scale: new Vec3( 1.2, 1.2, 1.2 ) } )
            .to( 0.25, { scale: new Vec3( 1, 1, 1 ) } )
            .start();
    }

    public openStore ()
    {
        PlayableAdsManager.Instance().OpenStore();
    }
}


