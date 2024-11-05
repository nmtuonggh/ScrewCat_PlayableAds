import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from '../GameComponent/Bar/BarController';
import { BoxData } from '../FakeSO/BoxData';
import { ScrewData } from '../FakeSO/ScrewData';
import { BoxContainer } from './BoxContainer';
import { colorTypeCount, LogicSpawnBoxController } from './LogicSpawnBoxController';
import { eColorType } from '../GameConfig/GameColorConfig';

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
        LogicSpawnBoxController.Instance.currentBar = this.listBar;
        this.InitScrew();
        this.InitBox();
        BoxContainer.Instance.InitQueue();
    }

    private InitScrew (): void 
    {
        this.listBar.forEach( bar => 
        {
            //random screw prefab
            bar.SpawnScrew( this.ScrewData );
            bar.barPhysic.SetGroupLayer();
            bar.barPhysic.CreatHGJoint();
            bar.barPhysic.EnableHGJoin();
        } );

        LogicSpawnBoxController.Instance.GetColorData();
    }

    public InitBox (): void
    {
        const listBoxSlot = BoxContainer.Instance.boxSlots;
        const mostColor = LogicSpawnBoxController.Instance.GetMostColorType(true);

        for ( let i = 0; i < 1; i++ )
        {
            const boxSlot = listBoxSlot[ i ];
            BoxContainer.Instance.InitBox( mostColor, boxSlot.node, this.BoxData );
            boxSlot.InitBoxSlotData();
        }

        const colorData = LogicSpawnBoxController.Instance.colorScrewData;


        for ( let i = 1; i < listBoxSlot.length; i++ )
        {
            const boxSlot = listBoxSlot[ i ];
            // const randomIndex = Math.floor( Math.random() * 9 );
            //chỉ random các máu có trong colorData
            const randomIndex = Math.floor( Math.random() * colorData.length );
            const colorType = colorData[ randomIndex ].colorType;
            BoxContainer.Instance.InitBox( colorType, boxSlot.node, this.BoxData );
            boxSlot.InitBoxSlotData();
        }
    }

    

}


