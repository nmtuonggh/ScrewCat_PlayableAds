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
        this.isLock = value;
        this.lockAnim.node.active = value;
        this.lockAnim.setAnimation( 0, 'Idle', false );
        this.lockText.node.active = this.lockCount !== -5 && this.lockCount > 0;
    }
    @property( { group: "Lock" } )
    public get IsLock (): boolean
    {
        return this.isLock;
    }
    public set IsLock ( value: boolean )
    {
        this.isLock = value;
    }
    @property( { group: "Lock" } )
    public get LockCount (): number
    {
        return this.lockCount;
    }
    public set LockCount ( value: number )
    {
        this.lockCount = value;
        if ( this.lockCount <= 0 && this.lockCount !== -5 ) this.lockAnim.node.active = false;
        this.lockText.color = new Color( 255, 255, 255 );
        this.lockText.string = this.currentCount + "/" + this.lockCount;
    }
    @property( { readonly: true, group: "Lock" } )
    public get CurrentCount (): number
    {
        return this.currentCount;
    }
    public set CurrentCount ( value: number )
    {
        this.currentCount = value;
        if ( this.currentCount >= this.lockCount && this.lockCount !== -5 )
        {
            this.IsLock = false;
            this.lockText.node.active = false;
            this.boxAdsPrefab.active = false;
            getGameSystem().AudioController.playAudio( AudioType.unlockChain );
            this.lockAnim.setAnimation( 0, 'Unlock', false );
        }
    }
    //#endregion
    //#region PRIVATE FIELD
    @property( { visible: false, readonly: true, group: "Lock" } )
    private isBlockByChain: boolean = false;
    @property( { visible: false, readonly: true, group: "Lock" } )
    private isLock: boolean = false;
    @property( { visible: false, group: "Lock" } )
    private lockCount: number = 0;
    @property( { visible: false, readonly: true, group: "Lock" } )
    private currentCount: number = 0;

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
    private accumulatedTime: number = 0;

    protected update ( dt: number ): void
    {
        // if ( this.lockAnim.node.active
        //     && PlayableAdsManager.Instance().firstClicked
        //     && !getGameSystem().GameManager.lose
        //     && !getGameSystem().GameManager.win )
        // {
        //     if ( this.randomTime === 0 )
        //     {
        //         this.randomTime = Math.random() * 15000;
        //     }
        //     this.accumulatedTime += dt * 1000;
        //     if ( this.accumulatedTime >= this.randomTime )
        //     {
        //         this.lockAnim.setAnimation( 0, 'Act', false );
        //         getGameSystem().AudioController.playChain();
        //         this.resetTimers();
        //     }
        // }
    }

    private resetTimers (): void
    {
        this.randomTime = 0;
        this.accumulatedTime = 0;
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


