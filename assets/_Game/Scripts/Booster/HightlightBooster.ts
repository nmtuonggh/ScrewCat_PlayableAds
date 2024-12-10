import { Vec3 } from 'cc';
import { Tween } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'HightlightBooster' )
export class HightlightBooster extends Component
{
    @property( Node )
    hightlightHolder: Node = null;
    @property( Node )
    normalHolder: Node = null;
    @property( Node )
    hideBg: Node = null;
    @property( Node )
    popupWarning: Node = null;
    @property( [ Node ] )
    listBooster: Node[] = [];

    protected start (): void
    {

    }

    public HLBooster ( boosterType: BoosterType )
    {
        const booster = this.listBooster[ boosterType ];
        const worldPosition = booster.getWorldPosition();
        booster.setParent( this.hightlightHolder );
        booster.worldPosition = worldPosition;

        this.hideBg.active = true;
        //this.popupWarning.active = true;
        tween( this.listBooster[ boosterType ] ).repeatForever(
            tween()
                .to( 0.5, { scale: new Vec3( 1.2, 1.2, 1.2 ) } )
                .to( 0.5, { scale: new Vec3( 1, 1, 1 ) } ) )
            .start();
    }

    public StopHLBooster ()
    {
        for ( let i = 0; i < this.listBooster.length; i++ )
        {
            this.listBooster[ i ].setParent( this.normalHolder );
            Tween.stopAllByTarget( this.listBooster[ i ] );
            this.listBooster[ i ].scale = new Vec3( 1, 1, 1 );

        }
        this.hideBg.active = false;
        //this.popupWarning.active = false;
    }

}

export enum BoosterType
{
    None = 0,
    Drill = 1,
    Hammer = 2,
    Vacuum = 3,
}


