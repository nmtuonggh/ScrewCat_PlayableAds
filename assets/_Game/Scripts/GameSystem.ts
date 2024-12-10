import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './Controller/BoxContainer';
import { CahedContainer } from './Controller/CahedContainer';
import { StarController } from './Star/StarController';
import { MoveScrewHandle } from './Controller/MoveScrewHandle';
import { LevelController } from './Controller/LevelController';
import { AudioController } from './AudioController/AudioController';
import { MultiScreneController } from './Controller/MultiScreneController';
import { GameManager } from './Manager/GameManager';
import { TutorialController } from './TutorialController';
import { UnlockBoxController } from './UnlockBoxConcept/UnlockBoxController';
import { BoosterControll } from './Booster/BoosterControll';
import { UIController } from './UIController';
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
    @property( { type: AudioController, group: "Controller" } )
    private audioController: AudioController = null;
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
    @property( { type: AudioController, group: "Controller" } )
    private audioController2222: AudioController = null;
    //#endregion

    //#region PROPERTIES
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

    protected onLoad (): void
    {
        gameSystem = this;
    }
}

export function getGameSystem (): GameSystem
{
    return gameSystem;
}

