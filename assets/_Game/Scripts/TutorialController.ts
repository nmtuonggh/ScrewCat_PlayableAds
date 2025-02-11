import { _decorator, Component, Node } from 'cc';
import { eScrewState, Screw } from './GameComponent/Screw/Screw';
import { tween } from 'cc';
import { Tween } from 'cc';
import { Vec3 } from 'cc';
import { getGameSystem } from './GameSystem';
import { get } from 'http';
const { ccclass, property } = _decorator;

@ccclass( 'TutorialController' )
export class TutorialController extends Component
{
    @property( Node )
    private handTutorial: Node = null;
    @property
    private offSet: Vec3 = new Vec3( 0, 0, 0 );
    @property( Node )
    private levelContainer: Node = null;

    private screw: Screw = null;
    protected start (): void
    {
        this.scheduleOnce( this.tweenHandTutorial, 1 );
    }
    protected onDisable (): void
    {
        Tween.stopAllByTarget( this.handTutorial );
        this.handTutorial.parent = this.levelContainer;
        this.handTutorial.position = new Vec3( 0, 0, 0 );
        this.handTutorial.active = false;
        this.screw.ScrewAnimation.stopPlayTutorial();
    }
    public tweenHandTutorial (): void
    {
        try
        {
            var screw = this.getScrew().node;
            if ( !screw ) return;
            this.screw = screw.getComponent( Screw );
            this.handTutorial.active = true;
            this.handTutorial.parent = screw;
            var startPos = new Vec3( 0, 0, 0 );
            let offset = this.offSet.clone();
            Vec3.add( startPos, this.handTutorial.getPosition(), offset );
            this.handTutorial.position = startPos;
        } catch ( error )
        {
            debugger
        }

        tween( this.handTutorial ).repeatForever
            (
                tween()
                    .parallel(
                        tween().to( 0.5, { position: new Vec3( 5, -5, 0 ) }, { easing: 'cubicIn' } ),
                        tween().to( 0.5, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'cubicIn' } )
                    )
                    .call( () =>
                    {
                        screw.getComponent( Screw ).ScrewAnimation.ScrewOut();
                    } )
                    .parallel(
                        tween().to( 0.5, { position: startPos }, { easing: 'cubicOut' } ),
                        tween().to( 0.5, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'cubicOut' } )
                    )
                    .call( () =>
                    {
                        screw.getComponent( Screw ).ScrewAnimation.ScrewIn();
                    } )
                    .delay( 0.5 )
            ).start();
    }
    private getScrew (): Screw
    {
        var allScrews = this.levelContainer.getComponentsInChildren( Screw );
        let availableScrews: Screw[] = [];
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
        var screwTutos: Screw[] = [];
        for ( const screw of availableScrews )
        {
            for ( const color of colors )
            {
                if ( screw.ScrewRenderer.colorType === color )
                {
                    screwTutos.push( screw );
                }
            }
        }
        //tim screw co layer cao nhat
        let maxLayer = 0;
        let screwMaxLayer = null;
        if ( screwTutos.length > 0 )
        {
            for ( const screw of screwTutos )
            {
                if ( screw.Layer > maxLayer )
                {
                    maxLayer = screw.Layer;
                    screwMaxLayer = screw;
                }
            }
            return screwMaxLayer;
        }
        else
        {
            for ( const screw of availableScrews )
            {
                if ( screw.Layer > maxLayer )
                {
                    maxLayer = screw.Layer;
                    screwMaxLayer = screw;
                }
            }
            return screwMaxLayer;
        }
    }
}


