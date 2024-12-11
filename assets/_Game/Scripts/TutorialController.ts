import { _decorator, Component, Node } from 'cc';
import { Screw } from './GameComponent/Screw/Screw';
import { tween } from 'cc';
import { Tween } from 'cc';
import { Vec3 } from 'cc';
import { getGameSystem } from './GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'TutorialController' )
export class TutorialController extends Component
{
    @property( Node )
    public screw: Node = null;
    @property( Node )
    public handPortrait: Node = null;
    @property( Vec3 )
    public offset: Vec3 = new Vec3( 0, 0, 0 );

    @property( [Node] )
    public tapToPlay: Node[] = [];
    @property( [Node] )
    public iconGame: Node[] = [];

    protected onEnable (): void
    {
        this.handTutorial();
    }
    protected onDisable (): void
    {
        this.screw.getComponent( Screw ).screwAnimation.stopPlayTutorial();
        Tween.stopAllByTarget( this.handPortrait );
    }

    public handTutorial (): void
    {
        if(getGameSystem().MoveScrewHandle.isFirstTouch) return;
        
        this.handPortrait.parent = this.screw;
        var startPos = new Vec3( 0, 0, 0 );
        let offset = this.offset.clone();
        Vec3.add( startPos, this.handPortrait.getPosition(), offset );
        this.handPortrait.position = startPos;

        tween( this.handPortrait ).repeatForever
            (
                tween()
                    .parallel(
                        tween().to( 0.5, { position: new Vec3( 0, 0, 0 ) }, { easing: 'cubicIn' } ),
                        tween().to( 0.5, { scale: new Vec3( 1.2, 1.2, 1.2 ) }, { easing: 'cubicIn' } )
                    )
                    .call( () => this.screw.getComponent( Screw ).screwAnimation.ScrewOut() )
                    .parallel(
                        tween().to( 0.5, { position: startPos }, { easing: 'cubicOut' } ),
                        tween().to( 0.5, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'cubicOut' } )
                    )
                    .call( () =>
                    {
                        this.screw.getComponent( Screw ).screwAnimation.ScrewIn();
                    } )
                    .delay( 0.5 )
            ).start();
    }
}


