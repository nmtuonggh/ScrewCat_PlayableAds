import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
import { BoxData } from './FakeSO/BoxData';
import { BoxContainer } from './Controller/BoxContainer';
import { Screw } from './GameComponent/Screw/Screw';
import { ScrewData } from './FakeSO/ScrewData';
import { StarController } from './Star/StarController';
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
            //random screw prefab
            
            bar.SpawnScrew( this.ScrewData);
            
            bar.barPhysic.SetGroupLayer();
            bar.barPhysic.CreatHGJoint();
            bar.barPhysic.EnableHGJoin();
        } );
    }

    public InitBox (): void
    {
        const listBoxSlot = BoxContainer.Instance.boxSlots;

        for ( let i = 0; i < listBoxSlot.length; i++ )
            {
                const boxSlot = listBoxSlot[ i ];
                const randomIndex = Math.floor(Math.random() * 9);
                BoxContainer.Instance.InitBox( randomIndex, boxSlot.node, this.BoxData );
                boxSlot.InitBoxSlotData();
            }
    }

}


