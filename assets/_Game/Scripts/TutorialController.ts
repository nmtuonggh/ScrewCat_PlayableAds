import { _decorator, Component, Node } from 'cc';
import { Screw } from './GameComponent/Screw/Screw';
import { tween } from 'cc';
import { Tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'TutorialController' )
export class TutorialController extends Component
{
    @property( Screw )
    public screw: Screw = null;
    @property( Node )
    public handPortrait: Node = null;

    protected start (): void
    {
        this.handTutorial();
    }

    public stopTutorial (): void
    {
        this.screw.screwAnimation.PlayTutorial();
        this.handPortrait.active = false;
        Tween.stopAllByTarget( this.handPortrait );
    }

    public handTutorial (): void
    {
        this.stopTutorial();
        this.handPortrait.active = true;

        let handPosition = this.handPortrait.getPosition().clone();
        tween( this.handPortrait ).repeatForever
            (
                tween()
                    .to( 0.5, { position: new Vec3(0,0,0) }, { easing: 'cubicIn' } )
                    .call( () => this.screw.screwAnimation.ScrewOut() )
                    .to( 0.5, { position: handPosition }, { easing: 'cubicOut' } )
                    .call( () =>
                    {
                        this.screw.screwAnimation.ScrewIn();
                        console.log("ScrewIn");
                    } )
                    .delay( 0.5 )
            ).start();
    }
}


