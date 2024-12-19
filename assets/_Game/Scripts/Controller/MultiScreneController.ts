import { _decorator, Canvas, Component, Node, Sprite, SpriteFrame, View, Size } from 'cc';
import { TutorialController } from '../TutorialController';
import { UIController } from '../UIController';
import { screen } from 'cc'
import { view } from 'cc';
import { ResolutionPolicy } from 'cc';
import { UITransform } from 'cc';
import { Widget } from 'cc';
import { Camera } from 'cc';
import { UIMultiScreen } from '../MultiScreen/UIMultiScreen';
import { MoveScrewHandle } from './MoveScrewHandle';
import { TestIQController } from '../TestIQ/TestIQController';
import { CanvasScreenController } from '../MultiScreen/CanvasScreenController';
import { getGameSystem } from '../GameSystem';

const { ccclass, property } = _decorator;

@ccclass( 'MultiScreneController' )
export class MultiScreneController extends Component
{
    @property( CanvasScreenController )
    public canvasScreenController: CanvasScreenController[] = [];

    @property( Canvas )
    public baseCanvas: Canvas = null;

    public ScreenType: ScreenType = 0;

    @property( UIMultiScreen )
    public uimulti: UIMultiScreen = null;
    @property( TutorialController )
    public tutorialController: TutorialController = null;

    protected onEnable (): void
    {
        this.baseCanvas.node.on( Node.EventType.SIZE_CHANGED, this.onSizeChanged, this );
    }



    protected start (): void
    {
        this.getScreenSize();
    }

    public onSizeChanged (): void
    {

        this.UpdateSize();

    }

    getScreenSize (): void
    {
        let width = screen.windowSize.width;
        let height = screen.windowSize.height;

        let ratio = width / height;

        if ( ratio < 0.69 )
        {

            this.ScreenType = ScreenType.Portrait;

        } else if ( ratio > 0.69 && ratio < 1.4 )
        {

            this.ScreenType = ScreenType.Square;
        }
        else if ( ratio > 1.4 && ratio < 1.65 )
        {

            this.ScreenType = ScreenType.Mixed;
        }
        else if ( ratio > 1.65 )
        {

            this.ScreenType = ScreenType.Landscape;
        }

        this.onSizeChanged();
    }

    protected UpdateSize (): void
    {
        let ratio = screen.windowSize.width / screen.windowSize.height;

        let targetSize: Size = new Size( 1920, 1080 );
        let screenType = ScreenType.Landscape;

        if ( ratio < 0.69 )
        {
            targetSize = new Size( 1080, 1920 );
            screenType = ScreenType.Portrait;
        }
        else if ( ratio > 0.69 && ratio < 1.4 )
        {
            targetSize = new Size( 1920, 1920 );
            screenType = ScreenType.Square;
        }
        else if ( ratio > 1.4 && ratio < 1.65 )
        {
            targetSize = new Size( 1920, 1324 );
            screenType = ScreenType.Mixed;
        }
        else if ( ratio > 1.65 )
        {
            targetSize = new Size( 1920, 1080 );
            screenType = ScreenType.Landscape;
        }



        if ( screenType != this.ScreenType )
        {
            this.ScreenType = screenType;
        }

        view.setDesignResolutionSize( targetSize.width, targetSize.height, ResolutionPolicy.FIXED_HEIGHT );

        for ( let i = 0; i < this.canvasScreenController.length; i++ )
        {
            if ( i != this.ScreenType )
            {
                this.canvasScreenController[ i ].node.active = false;
            }
            else
            {
                this.setupScreen( this.ScreenType, targetSize, ratio );
            }
        }
    }

    setupScreen ( type: ScreenType, targetSize: Size, ratio: number ): void
    {
        this.canvasScreenController[ type ].node.active = true;
        this.canvasScreenController[ type ].getComponent( UITransform ).contentSize = targetSize;
        this.canvasScreenController[ type ].getComponent( Widget ).updateAlignment();
        getGameSystem().MoveScrewHandle.Camera = this.getCameraGamePlay();
        this.uimulti.SetComponentPosition( type );  //set vi tri cac thanh phan
        if ( getGameSystem().TestIQController )
        {
            getGameSystem().TestIQController.setupIQUI( type );
        }
        if ( getGameSystem().ProgressBoxSystem )
        {
            getGameSystem().ProgressBoxSystem.setUIPosMultiscreen( type );
        }
        if ( getGameSystem().HiddenCatControll )
        {
            getGameSystem().HiddenCatControll.setUIPosMultiscreen( type );
        }
        getGameSystem().UIController.onChangedScreen();
    }

    public getCameraGamePlay (): Camera
    {
        return this.canvasScreenController[ this.ScreenType ].cameraGamePlay;
    }


}

export enum ScreenType
{
    Portrait = 0,
    Square = 1,
    Mixed = 2,
    Landscape = 3
}


