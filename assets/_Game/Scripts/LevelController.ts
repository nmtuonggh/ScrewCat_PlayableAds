import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
import { BoxData } from './FakeSO/BoxData';
import { BoxContainer } from './Controller/BoxContainer';
const { ccclass, property } = _decorator;

@ccclass( 'LevelController' )
export class LevelController extends Component
{
    @property( Node )
    private Holder: Node = null;

    @property( BarController )
    private listBar: BarController[] = [];

    @property( Prefab )
    private screwPrefab: Prefab = null;
    @property( BoxData )
    private BoxData: BoxData = null;

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
            bar.SpawnScrew( this.screwPrefab );
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
            BoxContainer.Instance.InitBox( this.BoxData.BoxPrefab[ 0 ], boxSlot.node );
            boxSlot.InitBoxValue();
        }

        for ( let i = 3; i < listBoxSlot.length; i++ )
            {
                const boxSlot = listBoxSlot[ i ];
                BoxContainer.Instance.InitBox( this.BoxData.BoxPrefab[ 1 ], boxSlot.node );
                boxSlot.InitBoxValue();
            }
    }

}

