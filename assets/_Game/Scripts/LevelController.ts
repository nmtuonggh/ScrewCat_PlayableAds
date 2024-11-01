import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
import { BoxData } from './FakeSO/BoxData';
import { BoxContainer } from './Controller/BoxContainer';
import { Screw } from './GameComponent/Screw/Screw';
import { ScrewData } from './FakeSO/ScrewData';
const { ccclass, property } = _decorator;

@ccclass( 'LevelController' )
export class LevelController extends Component
{
    @property( Node )
    private Holder: Node = null;

    @property( BarController )
    private listBar: BarController[] = [];
    @property( BoxData )
    private BoxData: BoxData = null;
    @property( ScrewData )
    private ScrewData: ScrewData = null

    protected onLoad (): void
    {
        this.listBar = this.Holder.getComponentsInChildren( BarController );
    }

    protected start (): void
    {
        this.InitScrew();
        this.InitBox();
        BoxContainer.Instance.InitQueue();
    }

    private InitScrew (): void 
    {
        this.listBar.forEach( bar => 
        {
            bar.SpawnScrew( this.ScrewData.ScrewPrefab[ 2 ] );
            bar.barPhysic.CreatHGJoint();
            bar.barPhysic.EnableHGJoin();
        } );
    }

    public InitBox (): void
    {
        const listBoxSlot = BoxContainer.Instance.boxSlots;
        for ( let i = 0; i < 3; i++ )
        {
            const boxSlot = listBoxSlot[ i ];
            BoxContainer.Instance.InitBox( this.BoxData.BoxPrefab[ 1 ], boxSlot.node );
            boxSlot.InitBoxValue();
        }

        for ( let i = 3; i < listBoxSlot.length; i++ )
            {
                const boxSlot = listBoxSlot[ i ];
                BoxContainer.Instance.InitBox( this.BoxData.BoxPrefab[ 2 ], boxSlot.node );
                boxSlot.InitBoxValue();
            }
    }

}


