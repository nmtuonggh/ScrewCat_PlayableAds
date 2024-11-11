import { _decorator, Component, Node } from 'cc';
import { MeowAnimation } from './MeowAnimation';
import { UIController } from './UIController';
import { AudioController } from './AudioController/AudioController';
import { BoxContainer } from './Controller/BoxContainer';
import { CahedContainer } from './Controller/CahedContainer';
import { LevelController } from './Controller/LevelController';
import { MoveScrewHandle } from './Controller/MoveScrewHandle';
import { GameManager } from './Manager/GameManager';
import { StarController } from './Star/StarController';
const { ccclass, property } = _decorator;

@ccclass('ScriptHolder')
export class ScriptHolder extends Component {

    @property(UIController)
    public UIController: UIController = null!;
    @property(AudioController)
    public AudioController: AudioController = null!;
    @property(BoxContainer)
    public BoxContainer: BoxContainer = null!;
    @property(CahedContainer)
    public CahedContainer: CahedContainer = null!;
    @property(LevelController)
    public LevelController: LevelController = null!;
    @property(MoveScrewHandle)
    public MoveScrewHandle: MoveScrewHandle = null!;
    @property(GameManager)
    public GameManager: GameManager = null!;
    @property(StarController)
    public StarController: StarController = null!;


    private static _instance: ScriptHolder = null;

    public static get Instance (): ScriptHolder
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( ScriptHolder._instance === null )
        {
            ScriptHolder._instance = this;
        }
    }
}


