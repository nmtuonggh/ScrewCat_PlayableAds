import { _decorator, Component, Node } from 'cc';
import { Screw } from './GameComponent/Screw/Screw';
import { tween } from 'cc';
import { Tween } from 'cc';
import { Vec3 } from 'cc';
import { UIMultiScreen } from './MultiScreen/UIMultiScreen';
import { MultiScreneController } from './Controller/MultiScreneController';
import { MoveScrewHandle } from './Controller/MoveScrewHandle';
const { ccclass, property } = _decorator;

@ccclass( 'TutorialController' )
export class TutorialController extends Component
{
    @property( Node )
    public screw: Node = null;
    @property( Node )
    public handPortrait: Node = null;
    
    @property( [Node] )
    public tapToPlay: Node[] = [];
    @property( [Node] )
    public iconGame: Node[] = [];

    private handPosition: Vec3 = new Vec3();
    private handScale: Vec3 = new Vec3();

    protected start (): void
    {
        
        this.handPosition = this.handPortrait.getPosition().clone();
        this.handScale = this.handPortrait.getScale().clone();
    }

    public stopTutorial (): void
    {
        this.screw.getComponent( Screw ).screwAnimation.PlayTutorial();
        this.handPortrait.active = false;
        this.tapToPlay[MultiScreneController.Instance.ScreenType].active = false;
        if(this.iconGame[MultiScreneController.Instance.ScreenType] !== null) this.iconGame[MultiScreneController.Instance.ScreenType].active = false;
        Tween.stopAllByTarget( this.handPortrait );
    }

    public handTutorial (): void
    {
        if(MoveScrewHandle.Instance.isFirstTouch) return;
        this.stopTutorial();
        this.handPortrait.active = true;
        for ( let i = 0; i < this.tapToPlay.length; i++ )
        {
            if ( i === MultiScreneController.Instance.ScreenType )
            {
                this.tapToPlay[i].active = true;
            }
            else
            {
                this.tapToPlay[i].active = false;
            }
        }

        for ( let i = 0; i < this.iconGame.length; i++ )
        {
            if(this.iconGame[i] === null) continue;
            if ( i === MultiScreneController.Instance.ScreenType )
            {
                this.iconGame[i].active = true;
            }
            else
            {
                this.iconGame[i].active = false;
            }
        }
        
        //let handPosition = this.handPortrait.getPosition().clone();
        //let handScale = this.handPortrait.getScale().clone();

        tween( this.handPortrait ).repeatForever
            (
                tween()
                    .parallel(
                        tween().to( 0.5, { position: new Vec3( 0, 0, 0 ) }, { easing: 'cubicIn' } ),
                        tween().to( 0.5, { scale: new Vec3( 1.2, 1.2, 1.2 ) }, { easing: 'cubicIn' } )
                    )
                    .call( () => this.screw.getComponent( Screw ).screwAnimation.ScrewOut() )
                    .parallel(
                        tween().to( 0.5, { position: this.handPosition }, { easing: 'cubicOut' } ),
                        tween().to( 0.5, { scale: this.handScale }, { easing: 'cubicOut' } )
                    )
                    .call( () =>
                    {
                        this.screw.getComponent( Screw ).screwAnimation.ScrewIn();
                        console.log( "ScrewIn" );
                    } )
                    .delay( 0.5 )
            ).start();

        tween( this.tapToPlay[MultiScreneController.Instance.ScreenType] ).repeatForever
            (
                tween()
                    .to( 0.5, { scale: new Vec3( 1.2, 1.2, 1 ) }, { easing: 'cubicIn' } )
                    .to( 0.5, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'cubicOut' } )
            ).start();
    }
}


