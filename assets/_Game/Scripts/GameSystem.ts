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
const { ccclass, property } = _decorator;
var gameSystem : GameSystem;
@ccclass('GameSystem')
export class GameSystem extends Component {
    @property({type:BoxContainer, group:"Container"})
    public boxContainer: BoxContainer = null;
    @property({type:CahedContainer, group:"Container"})
    public cahedContainer: CahedContainer = null;
    @property({type:StarController, group:"Container"})
    public starController: StarController = null;

    @property({type:MoveScrewHandle, group:"Controller"})
    public moveScrewHandle: MoveScrewHandle = null;
    @property({type:LevelController, group:"Controller"})
    public levelController: LevelController = null;
    @property({type:AudioController, group:"Controller"})
    public audioController: AudioController = null;
    @property({type:MultiScreneController, group:"Controller"})
    public multiScreneController: MultiScreneController = null;
    @property({type:GameManager, group:"Controller"})
    public gameManager: GameManager = null;
    @property({type:TutorialController, group:"Controller"})
    public tutorialController: TutorialController = null;
    @property({type:UnlockBoxController, group:"Controller"})
    public unlockBoxController: UnlockBoxController = null;

}

export function getGameSystem() {
    return gameSystem;
}


