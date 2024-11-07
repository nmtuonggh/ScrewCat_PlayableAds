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
    public TotalScrew: number = 0;

    @property( Node )
    public LevelContainer: Node = null;
    @property( GameLayer )
    private layerList: GameLayer[] = [];

    private static _instance: GameManager = null;

    public static get Instance (): GameManager
    {
        if ( this._instance === null )
        {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( GameManager._instance === null )
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
            console.log( "Lose" );
        }
    }

    public GetRemainningScrew (): number
    {
        let screwRemain = this.TotalScrew - this.CollectedScrew;

        return screwRemain;
    }

    public CheckGoToAdsCondition (): void
    {
        if ( this.GetRemainningScrew() <= 1 )
        {
            console.log( "Go to ADS" );
        }
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


