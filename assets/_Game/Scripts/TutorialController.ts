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
    public hand: Node = null;

    private firstTouch: boolean = false;

    protected start (): void
    {
        this.handTutorial();
    }

    public handTutorial (): void 
    {
        this.hand.active = true;
        let startPos = this.hand.getWorldPosition();
        let screwPos = this.screw.node.getWorldPosition();
        //toi muon dung easing de di chuyen chu khong phai di chuyen thang
        
        tween( this.hand ).repeatForever
            (
                tween()
                    .to( 0.5, { worldPosition: screwPos }, { easing: 'cubicIn' } )
                    .call( () => this.screw.screwAnimation.ScrewOut() )
                    .to( 0.5, { worldPosition: startPos }, { easing: 'cubicOut' } )
                    .call( () => this.screw.screwAnimation.ScrewIn() )
                    .delay( 0.5 )
            ).start();
    }

    public stopTutorial (): void
    {
        this.screw.screwAnimation.PlayTutorial();
        Tween.stopAllByTarget( this.hand );
        this.hand.active = false;
    }
}


