import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './Controller/BoxContainer';
import { eScrewState, Screw } from './GameComponent/Screw/Screw';
const { ccclass, property } = _decorator;

@ccclass( 'AutoTest' )
export class AutoTest extends Component
{
    @property( BoxContainer )
    private boxContainer: BoxContainer = null;
    @property( Node )
    private levelNode: Node = null;

    private tapCount: number = 0;
    private tapTimeout: any = null;
    private allScrews: Screw[] = [];
    private enableAutoTest: boolean = false;

    onLoad ()
    {
        this.node.on( Node.EventType.TOUCH_END, this.onTouchEnd, this );
    }

    protected start (): void
    {
        this.allScrews = this.levelNode.getComponentsInChildren( Screw );
    }

    private onTouchEnd ()
    {
        this.tapCount++;
        if ( this.tapTimeout )
        {
            clearTimeout( this.tapTimeout );
        }
        this.tapTimeout = setTimeout( () =>
        {
            this.tapCount = 0;
        }, 10000 );

        if ( this.tapCount === 10 )
        {
            this.test();
            this.enableAutoTest = true;
            this.tapCount = 0;
        }
    }

    private test (): void
    {
        console.log( 'Test' );
    }


    private runAutoTest (): void
    {
        let colors = this.boxContainer.getActiveBoxColor();
        
    }


    private getSameColorScrewInBar ( colorType: number ): Screw
    {
        let listSameColorScrew: Screw[] = [];
        for ( const screw of this.allScrews )
        {
            if ( screw.State === eScrewState.MOVING ) continue;
            if ( screw.ScrewRenderer.colorIndex === colorType && screw.State === eScrewState.IN_BAR )
            {
                listSameColorScrew.push( screw );
            }
        }

        //tim screw co Layer cao nhat
        let maxLayerScrew: Screw = null;
        let maxLayer = -1;
        for ( const screw of listSameColorScrew )
        {
            if ( screw.Layer > maxLayer )
            {
                maxLayer = screw.Layer;
                maxLayerScrew = screw;
            }
        }
        if ( maxLayerScrew )
        {
            return maxLayerScrew;
        }

        return null;
    }
}


