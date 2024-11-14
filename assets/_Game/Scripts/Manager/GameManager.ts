import { _decorator, CCInteger, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
import { StarController } from '../Star/StarController';
import { GameLayer } from '../GameComponent/GameLayer';
import { group } from 'console';
import { AudioController, AudioType } from '../AudioController/AudioController';
import { UIManager } from '../../../../extensions/nvthan/@types/packages/scene/@types/cce/3d/manager/ui';
import { UIController } from '../UIController';
import { MultiScreneController } from '../Controller/MultiScreneController';
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
    @property( MultiScreneController )
    private multiScreenController: MultiScreneController= null;

    @property( Node )
    public loseUI: Node = null;

    public lose: boolean = false;

    private static _instance: GameManager = null;

    public static get Instance (): GameManager
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( !GameManager._instance )
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
            AudioController.Instance.PlayAudio( AudioType.lose );
            AudioController.Instance.bg.stop();
            UIController.Instance.TweenFail(this.multiScreenController.ScreenType);

            //wait for 2s
            setTimeout( () =>
            {
                UIController.Instance.fail[this.multiScreenController.ScreenType].active = false;
                UIController.Instance.LoseUI[this.multiScreenController.ScreenType].active = true;
                this.lose = true;
            }, 2000 );
        }
    }

    public GetRemainningScrew (): number
    {
        return this.currentScrew;
    }

}


