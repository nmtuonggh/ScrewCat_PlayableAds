import { _decorator, CCInteger, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
import { StarController } from '../Star/StarController';
import { GameLayer } from '../GameComponent/GameLayer';
import { group } from 'console';
const { ccclass, property } = _decorator;

@ccclass( 'GameManager' )
export class GameManager extends Component
{
    @property( CCInteger )
    public activeLayer: number = 0;
    @property( CCInteger )
    public toltalShowLayer: number = 0;

    @property( CCInteger )
    public CollectedScrew: number = 0;
    @property( CCInteger )
    public currentScrew: number = 0;
    @property( CCInteger )
    public TotalScrew: number = 0;

    @property( Node )
    public LevelContainer: Node = null;
    @property( GameLayer )
    private layerList: GameLayer[] = [];

    @property(Node)
    public loseUI: Node = null;

    public lose : boolean = false;

    private static _instance: GameManager = null;

    public static get Instance (): GameManager
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if (!GameManager._instance)
        {
            GameManager._instance = this;
        }
    }

    protected start (): void
    {

    }


    public CheckLose (): void
    {
        if ( CahedContainer.Instance.GetFreeHole() === null )
        {
            this.loseUI.active = true;
            this.lose = true;
        }
    }

    public GetRemainningScrew (): number
    {
        return this.currentScrew;
    }


    InitLayer (): void
    {
        //this.layerList = this.LevelContainer.getComponentsInChildren( GameLayer );

        // for ( let i = this.layerList.length; i >= 0; i-- )
        // {
        //     if ( i < this.activeLayer )
        //     {
        //         this.layerList[ i ].node.active = true;
        //     }
        //     else
        //     {
        //         this.layerList[ i ].node.active = false;
        //     }
        // }

    }
}


