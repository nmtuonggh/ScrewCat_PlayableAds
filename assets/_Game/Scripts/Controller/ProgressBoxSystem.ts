import { _decorator, Component, Node } from 'cc';
import { ScreenType } from './MultiScreneController';
import { Vec3 } from 'cc';
import { Label } from 'cc';
import { tween } from 'cc';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { PlayableAdsManager } from 'db://assets/PA_iKame (1)/base-script/PlayableAds/PlayableAdsManager';
import { TrackingManager } from 'db://assets/PA_iKame (1)/base-script/PlayableAds/Tracking/TrackingManager';
const { ccclass, property } = _decorator;

@ccclass( 'ProgressBoxSystem' )
export class ProgressBoxSystem extends Component
{
    //#region EDITOR EXPOSED FIELD
    @property( Node )
    private uiProgrees: Node = null;
    @property( [ Vec3 ] )
    private uiPosition: Vec3[] = [];
    @property( Label )
    private text: Label = null;
    @property( Node )
    private boxNode: Node = null;
    @property( Prefab )
    private progressPrefab: Prefab = null;
    @property( Node )
    private holder: Node = null;

    @property( { group: 'Vibration' } )
    vibrationRate: number = 3;
    @property( { group: 'Vibration' } )
    duration: number = 0.1;
    @property( { group: 'Vibration' } )
    delay: number = 0;
    //#endregion
    //#region PRIVATE FIELD
    private totalProgress: number = 10;
    private currentProgress: number = 0;
    //#endregion
    //#region CC METHODS
    protected start (): void
    {
        this.text.string = `${ this.currentProgress }/${ this.totalProgress }`;
    }
    //#endregion
    //#region PUBLIC METHODS
    public setUIPosMultiscreen ( screenType: ScreenType ): void
    {
        if ( !this.uiProgrees ) return;
        let pos = this.uiPosition[ screenType ];
        this.uiProgrees.position = pos;
    }

    public onBoxCollect ( box: Node ): void
    {
        this.currentProgress++;
        const prefab = instantiate( this.progressPrefab );
        prefab.parent = this.holder;
        prefab.setWorldPosition( box.getWorldPosition() );
        tween( prefab )
            .to( 0.8, { worldPosition: this.text.node.getWorldPosition() }, { easing: 'smooth' } )
            .call( () =>
            {
                prefab.destroy();
                if ( this.currentProgress <= 10 )
                {
                    this.tweenText();
                }
                if ( this.currentProgress === 9 )
                {
                    TrackingManager.WinLevel();
                    PlayableAdsManager.Instance().ForceOpenStore();
                }
            } )
            .start();
    }

    //#endregion

    //#region PRIVATE METHODS
    tweenText ()
    {
        this.actionTween();
        tween( this.text.node )
            .to( 0.25, { scale: new Vec3( 1.1, 1.1, 1.1 ) }, { easing: 'backOut' } )
            .to( 0.25, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'backOut' } )
            .start();
        this.text.string = `${ this.currentProgress }/${ this.totalProgress }`;

    }
    actionTween ()
    {
        tween( this.boxNode )
            .to( this.duration, { eulerAngles: new Vec3( 0, 0, this.vibrationRate ) }, { easing: 'sineOut' } )
            .to( this.duration, { eulerAngles: new Vec3( 0, 0, -this.vibrationRate ) }, { easing: 'sineOut' } )
            .union()
            .repeat( 3 )
            .to( this.duration, { eulerAngles: new Vec3( 0, 0, 0 ) }, { easing: 'sineOut' } )
            .union()
            .start();
    }
    //#endregion
}


