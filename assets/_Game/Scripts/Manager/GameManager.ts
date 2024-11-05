import { _decorator, CCInteger, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
import { StarController } from '../Star/StarController';
const { ccclass, property } = _decorator;

@ccclass( 'GameManager' )
export class GameManager extends Component
{
    @property( CCInteger )
    public CollectedScrew: number = 0;
    @property( CCInteger )
    public TotalScrew: number = 0;

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
}


