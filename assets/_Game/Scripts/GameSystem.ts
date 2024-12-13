import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './Controller/BoxContainer';
import { CahedContainer } from './Controller/CahedContainer';
import { StarController } from './Star/StarController';
import { MoveScrewHandle } from './Controller/MoveScrewHandle';
import { LevelController } from './Controller/LevelController';
import { AudioController, AudioType } from './AudioController/AudioController';
import { MultiScreneController } from './Controller/MultiScreneController';
import { GameManager } from './Manager/GameManager';
import { TutorialController } from './TutorialController';
import { UnlockBoxController } from './UnlockBoxConcept/UnlockBoxController';
import { BoosterControll } from './Booster/BoosterControll';
import { UIController } from './UIController';
import { TestIQController } from './TestIQ/TestIQController';
import { RealTimeTutorial } from './Controller/RealTimeTutorial';
const { ccclass, property } = _decorator;

var gameSystem: GameSystem;


@ccclass( 'GameSystem' )
export class GameSystem extends Component
{
    //#region EDITOR EXPOSED FIELDS
    @property( { type: BoxContainer, group: "Container" } )
    private boxContainer: BoxContainer = null;
    @property( { type: CahedContainer, group: "Container" } )
    private cahedContainer: CahedContainer = null;
    @property( { type: StarController, group: "Container" } )
    private starController: StarController = null;

    @property( { type: MoveScrewHandle, group: "Controller" } )
    private moveScrewHandle: MoveScrewHandle = null;
    @property( { type: LevelController, group: "Controller" } )
    private levelController: LevelController = null;
    @property( { type: MultiScreneController, group: "Controller" } )
    private multiScreneController: MultiScreneController = null;
    @property( { type: GameManager, group: "Controller" } )
    private gameManager: GameManager = null;
    @property( { type: TutorialController, group: "Controller" } )
    private tutorialController: TutorialController = null;
    @property( { type: UnlockBoxController, group: "Controller" } )
    private unlockBoxController: UnlockBoxController = null;
    @property( { type: BoosterControll, group: "Controller" } )
    private boosterControll: BoosterControll = null;
    @property( { type: UIController, group: "Controller" } )
    private uiController: UIController = null;
    @property( { type: TestIQController, group: "Controller" } )
    private tesIQController: TestIQController = null;
    @property( { type: AudioController, group: "Controller" } )
    private audioController: AudioController = null;
    @property( { type: RealTimeTutorial, group: "Controller" } )
    private realTimeTutorial: RealTimeTutorial = null;
    //#endregion

    //#region PROPERTIES
    public get RealTimeTutorial ()
    {
        return this.realTimeTutorial
    }
    public get TestIQController ()
    {
        return this.tesIQController;
    }
    public get UIController ()
    {
        return this.uiController;
    }
    public get BoxContainer ()
    {
        return this.boxContainer;
    }
    public get CahedContainer ()
    {
        return this.cahedContainer;
    }
    public get StarController ()
    {
        return this.starController;
    }
    public get MoveScrewHandle ()
    {
        return this.moveScrewHandle;
    }
    public get LevelController ()
    {
        return this.levelController;
    }
    public get AudioController ()
    {
        return this.audioController;
    }
    public get MultiScreneController ()
    {
        return this.multiScreneController;
    }
    public get GameManager ()
    {
        return this.gameManager;
    }
    public get TutorialController ()
    {
        return this.tutorialController;
    }
    public get UnlockBoxController ()
    {
        return this.unlockBoxController;
    }
    public get BoosterControll ()
    {
        return this.boosterControll;
    }

    //#endregion
    //#region PRIVATE FIELD
    private isFINISH: boolean = false;
    //#endregion
    protected onLoad (): void
    {
        gameSystem = this;
    }
    protected update ( dt: number ): void
    {
        if ( !this.isFINISH )
        {
            if ( getGameSystem().GameManager.CurrentScrew <= 0 )
            {
                this.isFINISH = true;
                this.scheduleOnce( () => this.win(), 1 );
            }
        }
    }

    //#region PUBLIC METHODS
    public lose ()
    {
        if ( this.gameManager.lose )
        {
            this.audioController.playAudio( AudioType.lose );
            this.audioController.lose();
        }
    }
    public win ()
    {
        this.uiController.setIQText( getGameSystem().TestIQController.currentIQ.toString() );
        this.audioController.playWin();
        this.uiController.showLose();
    }
    //#endregion
}

export function getGameSystem (): GameSystem
{
    return gameSystem;
}

