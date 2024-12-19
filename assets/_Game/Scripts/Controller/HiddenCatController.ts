import { tween } from 'cc';
import { UIOpacity } from 'cc';
import { ParticleSystem } from 'cc';
import { Vec3 } from 'cc';
import { Color } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { get } from 'http';
import { getGameSystem } from '../GameSystem';
import { ScreenType } from './MultiScreneController';
const { ccclass, property } = _decorator;

@ccclass( 'HiddenCatController' )
export class HiddenCatController extends Component
{
    //#region EDITOR EXPOSED FIELDS
    @property( [ Node ] )
    private cats: Node[] = [];
    @property( [ Number ] )
    private targetCollect: number[] = [];
    @property( Node )
    private uiCats: Node = null;
    @property([Vec3] )
    private uiPos: Vec3[] = [];

    @property( { group: 'Vibration' } )
    vibrationRate: number = 3;
    @property( { group: 'Vibration' } )
    duration: number = 0.1;
    @property( { group: 'Vibration' } )
    delay: number = 0;
    //#endregion
    //#region PRIVATE FIELDS
    private poolCat: number = 1;
    private currentBoxCollected: number = 0;
    private currentTargetCollect: number = 0;
    private index: number = 0;
    //#endregion

    //#region PROPERTIES
    public get PoolCat (): number
    {
        return this.poolCat;
    }
    public get Index (): number
    {
        return this.index;
    }
    //#endregion

    //#region PUBLIC METHODS
    public setUIPosMultiscreen ( screenType: ScreenType ): void
    {
        let pos = this.uiPos[ screenType ];
        this.uiCats.position = pos;
    }
    public showCat ( index: number ): void
    {
        var hoicham = this.cats[ index ].children[ 1 ];
        if ( !hoicham.active ) return;

        hoicham.active = false;
        var black = this.cats[ index ].children[ 0 ];
        tween( black.getComponent( UIOpacity ) )
            .set( { opacity: 255 } )
            .to( 1, { opacity: 0 }, { easing: "smooth" } )
            .start();
        tween( this.cats[ index ] )
            .to( 0.5, { scale: new Vec3( 1.2, 1.2, 1 ) }, { easing: "smooth" } )
            .to( 0.5, { scale: new Vec3( 1, 1, 0 ) }, { easing: "smooth" } )
            .start();
        this.actionTween( this.cats[ index ] );
        var particles = this.cats[ index ].children[ 2 ].getComponentsInChildren( ParticleSystem );
        particles.forEach( element =>
        {
            element.stop();
            element.play();
        } );
        getGameSystem().AudioController.playHiddenCat();

    }
    public updatePoolCat (): void
    {
        this.index = Math.floor( Math.random() * this.poolCat )
        this.currentBoxCollected++;
        if ( this.currentBoxCollected >= this.targetCollect[ this.currentTargetCollect ] )
        {
            this.poolCat++;
            this.currentTargetCollect++;
            this.index = this.poolCat - 1;

        }
    }
    actionTween ( node: Node ): void
    {
        tween( node )
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


