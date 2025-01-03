import { Vec3, Color } from 'cc';
import { Label } from 'cc';
import { Tween } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { PlayableAdsManager } from 'db://assets/PA_iKame (1)/base-script/PlayableAds/PlayableAdsManager';
import { TrackingManager } from 'db://assets/PA_iKame (1)/base-script/PlayableAds/Tracking/TrackingManager';
const { ccclass, property } = _decorator;

@ccclass( 'TimeAttackController' )
export class TimeAttackController extends Component
{
    //#region EXPOSED EDITOR PROPERTIES
    @property( { type: Node, group: "MultiScene" } )
    private timeAttackUI: Node = null;
    @property( { type: [ Vec3 ], group: "MultiScene" } )
    private uiPositions: Vec3[] = [];


    @property( { type: Node } )
    private clock: Node = null;
    @property( { type: Node } )
    private clock2: Node = null;
    @property( Label )
    private timeLabel: Label = null;
    @property( Node )
    private forceStoreUI: Node = null;
    //#endregion
    private startAttack: boolean = false;
    public lose: boolean = false;
    //#region LIFE-CYCLE CALLBACKS

    protected update ( dt: number ): void
    {
        if ( !this.startAttack && PlayableAdsManager.Instance().firstClicked )
        {
            this.startAttack = true;
            this.startCountdown();
        }
    }
    //#endregion
    //#region PUBLIC FIELDS
    public setUIPosition ( index: number ): void
    {
        this.timeAttackUI.setPosition( this.uiPositions[ index ] );
    }
    //#endregion
    //#region PRIVATE FIELDS
    @property
    private countdownTime: number = 30; // Countdown time in seconds
    private countdownInterval: ReturnType<typeof setInterval> = null;
    //#endregion
    //#region PRIVATE METHODS
    private startCountdown (): void
    {
        this.updateTimeLabel();
        this.countdownInterval = setInterval( () =>
        {
            this.countdownTime--;
            this.updateTimeLabel();
            if ( this.countdownTime === 10 )
            {
                this.timeLabel.color = new Color( 255, 0, 0 );
                this.clock.active = false;
                this.clock2.active = true;
            }
            if ( this.countdownTime <= 0 )
            {
                clearInterval( this.countdownInterval );
                this.onCountdownEnd();
            }

        }, 1000 );
    }

    private updateTimeLabel (): void
    {
        this.timeLabel.string = this.formatTime( this.countdownTime );
        if(this.countdownTime <= 10)
        {
            tween( this.timeLabel.node )
                    .to( 0.5, { scale: new Vec3( 1.1, 1.1, 1.1 ) } )
                    .to( 0.5, { scale: new Vec3( 1, 1, 1 ) } )
                    .start();
        }
    }

    private formatTime ( time: number ): string
    {
        const minutes = Math.floor( time / 60 );
        const seconds = time % 60;
        return `${ minutes }:${ seconds < 10 ? '0' : '' }${ seconds }`;
    }

    private onCountdownEnd (): void
    {
        this.lose = true;
        this.forceStoreUI.active = true;
        Tween.stopAllByTarget( this.timeLabel.node );
        PlayableAdsManager.Instance().ForceOpenStore();
        TrackingManager.WinLevel();
    }

    public stopCountdown (): void
    {
        clearInterval( this.countdownInterval );
    }
    //#endregion
}


