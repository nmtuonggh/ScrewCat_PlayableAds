import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from '../GameComponent/Bar/BarController';
import { BoxData } from '../FakeSO/BoxData';
import { ScrewData } from '../FakeSO/ScrewData';
import { BoxContainer } from './BoxContainer';
import { Screw } from '../GameComponent/Screw/Screw';
import { Button } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { Layers } from 'cc';
import { eColorType } from '../GameConfig/GameColorConfig';
import { boxSpawnData } from '../BoxSpawndata/boxSpawnData';

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
    @property( boxSpawnData )
    public colorBoxSpawnData: boxSpawnData[] = [];
    @property( Number )
    public currentIndex: number = 0;

    private static _instance: LevelController = null;

    public static get Instance (): LevelController
    {
        if ( this._instance === null )
        {
            this._instance = new LevelController();
        }
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( LevelController._instance === null )
        {
            LevelController._instance = this;
        }
        //this.listBar = this.Holder.getComponentsInChildren( BarController ).filter( bar => bar.node.parent.active === true );
        //this.listScrew = this.Holder.getComponentsInChildren( Screw ).filter( screw => screw.node.parent.active === true );
        this.listBar = this.Holder.getComponentsInChildren( BarController );
        this.listScrew = this.Holder.getComponentsInChildren( Screw );
    }

    protected start (): void
    {
        //this.RandomColorScrew();
        //this.SetLayer();
        this.InitBarAndScrewColor();
        this.InitBox();
        BoxContainer.Instance.InitQueue();
        GameManager.Instance.currentScrew = this.listScrew.length;
        GameManager.Instance.TotalScrew = this.listScrew.length;
        GameManager.Instance.InitLayer();
    }

    // private RandomColorScrew (): void
    // {
    //     this.listScrew.forEach( screw =>
    //     {
    //         const randomIndex = Math.floor( Math.random() * 9 );
    //         screw.ScrewRenderer.SetSprite( randomIndex ,this.ScrewData );
    //     } );
    // }

    private SetLayer (): void
    {
        this.listBar.forEach( bar => 
        {
            bar.node.layer = 10;

        } );

        this.listScrew.forEach( screw => 
        {
            screw.node.layer = 11;
        } );
    }


    private InitBarAndScrewColor (): void 
    {
        this.listBar.forEach( bar => 
        {
            bar.InitScrewColor( this.ScrewData );
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
            const color = this.colorBoxSpawnData[ this.currentIndex ].color;
            const holeCount = this.colorBoxSpawnData[ this.currentIndex ].holeCount;
            BoxContainer.Instance.InitBox( color, boxSlot.node, this.BoxData, holeCount );
            boxSlot.InitBoxSlotData();
            this.currentIndex++;
        }
    }
}