import { _decorator, Component, Node } from 'cc';
import { eScrewState, Screw } from '../GameComponent/Screw/Screw';
import { getGameSystem } from '../GameSystem';
import { Vec3 } from 'cc';
import { tween } from 'cc';
import { Tween } from 'cc';
import { log } from 'console';
const { ccclass, property } = _decorator;

@ccclass( 'RealTimeTutorial' )
export class RealTimeTutorial extends Component
{
    //#region EDITOR EXPOSED FIELDS
    // @property()
    // private isTutorialing: boolean = false;
    @property( Node )
    private levelContainer: Node = null;
    @property( Node )
    private handTutorial: Node = null;
    @property()
    private waitTime: number = 0;
    @property( { readonly: true } )
    private currentWaitTime: number = 0;
    @property( Vec3 )
    private offset: Vec3 = new Vec3( 0, 0, 0 );

    private screw: Node = null;

    //#endregion
    //#region PROPERTIES
    // public get IsTutorialing ()
    // {
    //     return this.isTutorialing;
    // }
    //#endregion
    //#region CC METHODS
    protected onEnable (): void
    {
        this.updateTutorial();
    }
    //#endregion
    public cancelTutorial (): void
    {
        //this.screw.getComponent( Screw ).ScrewAnimation.stopPlayTutorial();
        Tween.stopAllByTarget( this.handTutorial );
        this.handTutorial.parent = this.levelContainer;
        this.handTutorial.position = new Vec3( 0, 0, 0 );
        this.handTutorial.active = false;
    }
    //#region PUBLIC METHODS
    public updateTutorial (): void
    {
        this.cancelTutorial();
        this.unschedule( this.tweenHandTutorial );
        this.scheduleOnce( this.tweenHandTutorial, this.waitTime);
    }
    //#endregion
    //#region PRIVATE METHODS
    private tweenHandTutorial (  ): void
    {
        try {
            var screw = this.getScrew().node;
            if(!screw) return;
            this.handTutorial.active = true;
            this.handTutorial.parent = screw;
            var startPos = new Vec3( 0, 0, 0 );
            let offset = this.offset.clone();
            Vec3.add( startPos, this.handTutorial.getPosition(), offset );
            this.handTutorial.position = startPos;
        } catch (error) {
            debugger
        }

        tween( this.handTutorial ).repeatForever
            (
                tween()
                    .parallel(
                        tween().to( 0.5, { position: new Vec3( 5, -5, 0 ) }, { easing: 'cubicIn' } ),
                        tween().to( 0.5, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'cubicIn' } )
                    )
                    .parallel(
                        tween().to( 0.5, { position: startPos }, { easing: 'cubicOut' } ),
                        tween().to( 0.5, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'cubicOut' } )
                    )
                    .delay( 0.5 )
            ).start();
    }
    private getScrew (): Screw
    {
        var allScrews = this.levelContainer.getComponentsInChildren( Screw );
        let availableScrews : Screw[] = [];
        allScrews.forEach( screw =>
        {
            if ( !screw.IsBlocked() && screw.State === eScrewState.IN_BAR )
            {
                availableScrews.push( screw );
            }
        } );
        var boxContainer = getGameSystem().BoxContainer;
        var boxs = boxContainer.getBoxForTutorial();
        var colors = boxs.map( box => box.BoxRenderer.colorType );
        for ( const screw of availableScrews )
        {
            for (const color of colors)
            {
                if ( screw.ScrewRenderer.colorType === color )
                {
                    return screw;
                }
            }
        }
        return null;
    }
    //#endregion
}


