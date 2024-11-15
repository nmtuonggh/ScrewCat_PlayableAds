import { _decorator, CCInteger, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
import { StarController } from '../Star/StarController';
import { GameLayer } from '../GameComponent/GameLayer';
import { group } from 'console';
import { AudioController, AudioType } from '../AudioController/AudioController';
import { UIManager } from '../../../../extensions/nvthan/@types/packages/scene/@types/cce/3d/manager/ui';
import { UIController } from '../UIController';
import { MultiScreneController } from '../Controller/MultiScreneController';
import { ScrewData } from '../FakeSO/ScrewData';
import { UILose } from '../UI/UILose';
import { TestIQController } from '../TestIQ/TestIQController';
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
    private multiScreenController: MultiScreneController = null;

    @property( Node )
    public loseUI: Node = null;

    @property( ScrewData )
    public screwData: ScrewData = null;

    public lose: boolean = false;

    public win: boolean = false;

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
        if ( CahedContainer.Instance.currentScrewCount >= CahedContainer.Instance.listActiveHole.length && this.lose === false )
        {
            this.lose = true;
            AudioController.Instance.PlayAudio( AudioType.lose );
            AudioController.Instance.bg.stop();
            UIController.Instance.TweenFail( this.multiScreenController.ScreenType );
            UIController.Instance.ShowOutOfMove();

            //wait for 2s
            setTimeout( () =>
            {
                UIController.Instance.listOFM[ this.multiScreenController.ScreenType ].node.active = false;
                UIController.Instance.fail[ this.multiScreenController.ScreenType ].active = false;
                UIController.Instance.LoseUI[ this.multiScreenController.ScreenType ].active = true;
                UIController.Instance.LoseUI[ this.multiScreenController.ScreenType ]
                    .getComponent( UILose ).setIQtext( TestIQController.Instance.currentIQ.toString() );

            }, 2000 );
        }
    }

    public GetRemainningScrew (): number
    {
        return this.currentScrew;
    }

}


