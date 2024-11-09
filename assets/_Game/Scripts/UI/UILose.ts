import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { PlayableAdsManager } from '../../../PA_iKame/base-script/PlayableAds/PlayableAdsManager';
import { tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'UILose' )
export class UILose extends Component
{
    @property( Node )
    public tryAginButton: Node = null!;
    @property( Node )
    public installButton: Node = null!;
    @property( Node )
    public loseUI: Node = null!;
    protected onEnable (): void
    {

        this.TweenBtn();

    }

    public TweenBtn (): void
    {
        tween( this.tryAginButton ).repeatForever(
            tween()
                .to( 0.7, { scale: new Vec3( 1.1, 1.1, 1.1 ) } )
                .to( 0.7, { scale: new Vec3( 1, 1, 1 ) } )
        ).start();


        tween( this.installButton ).repeatForever(
            tween()
                .to( 0.7, { scale: new Vec3( 1.1, 1.1, 1.1 ) } )
                .to( 0.7, { scale: new Vec3( 1, 1, 1 ) } )
        ).start();
    }

}


