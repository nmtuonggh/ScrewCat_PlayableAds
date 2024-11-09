import { _decorator, Canvas, Component, Node, Sprite, SpriteFrame, View } from 'cc';
import { TutorialController } from '../TutorialController';
import { UIController } from '../UIController';
const { ccclass, property } = _decorator;

@ccclass( 'MultiScreneController' )
export class MultiScreneController extends Component
{

    @property( Canvas )
    public sceneCanvas: Canvas = null;

    @property(Sprite)
    public background: Sprite = null;
    @property(SpriteFrame)
    public backgroundPortrait: SpriteFrame = null;
    @property(SpriteFrame)
    public backgroundLandscape: SpriteFrame = null;

    @property(TutorialController)
    public tutorialController: TutorialController = null;

    private uiController: UIController = null;

    protected onEnable (): void
    {
        this.sceneCanvas.node.on( Node.EventType.SIZE_CHANGED, this.onSizeChanged, this );
        this.uiController = UIController.Instance;
    }

    protected start (): void
    {
        this.onSizeChanged();
    }
    onSizeChanged (): void
    {
        let view = View.instance.getVisibleSize();
        let height = view.height;
        let width = view.width;

        let ratio = height / width;

        if ( ratio > 1.5 )
        {
            this.background.spriteFrame = this.backgroundPortrait;
            this.uiController.onPortrait();
            //this.tutorialController.handPortraitTutorial();
        } else if ( ratio < 0.7 )
        {
            this.background.spriteFrame = this.backgroundLandscape;
            this.uiController.onLandscape();
            //this.tutorialController.handLandscapeTutorial();
        } 

        //this.tutorialController.updatePosition();
    }
}


