import { _decorator, Component, Node } from 'cc';
import { Screw } from './GameComponent/Screw/Screw';
import { tween } from 'cc';
import { Tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'TutorialController' )
export class TutorialController extends Component
{
    @property( Node )
    public screw: Node = null;
    @property( Node )
    public handPortrait: Node = null;

    protected start (): void
    {
        this.handTutorial();
    }

    public stopTutorial (): void
    {
        this.screw.getComponent(Screw).screwAnimation.PlayTutorial();
        this.handPortrait.active = false;
        Tween.stopAllByTarget( this.handPortrait );
    }

    public handTutorial (): void
{
    this.stopTutorial();
    this.handPortrait.active = true;

    let handPosition = this.handPortrait.getPosition().clone();
    let handScale = this.handPortrait.getScale().clone();
    
    tween(this.handPortrait).repeatForever
    (
        tween()
            .parallel(
                tween().to(0.5, { position: new Vec3(0, 0, 0) }, { easing: 'cubicIn' }),
                tween().to(0.5, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'cubicIn' })
            )
            .call(() => this.screw.getComponent(Screw).screwAnimation.ScrewOut())
            .parallel(
                tween().to(0.5, { position: handPosition }, { easing: 'cubicOut' }),
                tween().to(0.5, { scale: handScale }, { easing: 'cubicOut' })
            )
            .call(() =>
            {
                this.screw.getComponent(Screw).screwAnimation.ScrewIn();
                console.log("ScrewIn");
            })
            .delay(0.5)
    ).start();
}
}


