import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from '../GameComponent/Bar/BarController';
import { BoxData } from '../FakeSO/BoxData';
import { ScrewData } from '../FakeSO/ScrewData';
import { BoxContainer } from './BoxContainer';
import { Screw } from '../GameComponent/Screw/Screw';
import { Button } from 'cc';
import { GameManager } from '../Manager/GameManager';

const { ccclass, property } = _decorator;

@ccclass( 'LevelController' )
export class LevelController extends Component
{
    @property( Node )
    private Holder: Node = null;
    @property( BarController )
    private listBar: BarController[] = [];
    @property( Screw )
    private listScrew: Screw[] = [];
    @property( BoxData )
    private BoxData: BoxData = null;
    @property( ScrewData )
    private ScrewData: ScrewData = null;

    protected onLoad (): void
    {
        //this.listBar = this.Holder.getComponentsInChildren( BarController ).filter( bar => bar.node.parent.active === true );
        //this.listScrew = this.Holder.getComponentsInChildren( Screw ).filter( screw => screw.node.parent.active === true );
        //this.listBar = this.Holder.getComponentsInChildren( BarController );
        //this.listScrew = this.Holder.getComponentsInChildren( Screw );
    }

    protected start (): void
    {
        this.RandomColorScrew();
        this.InitScrew();
        this.InitBox();
        BoxContainer.Instance.InitQueue();
        GameManager.Instance.TotalScrew = this.listScrew.length;
    }

    private RandomColorScrew (): void
    {
        this.listScrew.forEach( screw =>
        {
            const randomIndex = Math.floor( Math.random() * 9 );
            screw.ScrewRenderer.SetSprite( randomIndex ,this.ScrewData );
        } );
    }
    

    private InitScrew (): void 
    {
        this.listBar.forEach( bar => 
        {
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


