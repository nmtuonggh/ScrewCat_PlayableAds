import { _decorator, Canvas, Component, Node, Sprite, SpriteFrame, View, Size } from 'cc';
import { TutorialController } from '../TutorialController';
import { UIController } from '../UIController';
import { screen } from 'cc'
import { view } from 'cc';
import { ResolutionPolicy } from 'cc';
import { UITransform } from 'cc';
import { Widget } from 'cc';
import { Camera } from 'cc';
import { Vec3 } from 'cc';
import { UIMultiScreen } from '../MultiScreen/UIMultiScreen';
import { MoveScrewHandle } from './MoveScrewHandle';
import { TestIQController } from '../TestIQ/TestIQController';
import { Game } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { PlayableAdsManager } from '../../../PA_iKame (1)/base-script/PlayableAds/PlayableAdsManager';

const { ccclass, property } = _decorator;

@ccclass( 'MultiScreneController' )
export class MultiScreneController extends Component
{
    @property( Node )
    public listCanvas: Node[] = [];
    @property( [ Camera ] )
    public listCamera: Camera[] = [];

    @property( Canvas )
    public baseCanvas: Canvas = null;

    public ScreenType: ScreenType = 0;

    @property( UIMultiScreen )
    public uimulti: UIMultiScreen = null;
    @property( TutorialController )
    public tutorialController: TutorialController = null;

    private static _instance: MultiScreneController = null;

    public static get Instance (): MultiScreneController
    {
        return this._instance;
    }

    protected onEnable (): void
    {
        if ( MultiScreneController._instance === null )
        {
            MultiScreneController._instance = this;
        }
        this.baseCanvas.node.on( Node.EventType.SIZE_CHANGED, this.onSizeChanged, this );
    }



    protected start (): void
    {
        this.getScreenSize();
        this.tutorialController.handTutorial();
    }

    public onSizeChanged (): void
    {
        console.log( "Size Changed" );
        this.UpdateSize();
        this.tutorialController.handTutorial();
        TestIQController.Instance.SetupIQUI( this.ScreenType );
        UIController.Instance.onChangedScreen();
    }

    getScreenSize (): void
    {
        let width = screen.windowSize.width;
        let height = screen.windowSize.height;

        let ratio = width / height;

        if ( ratio < 0.69 )
        {
            //console.log( "Portrait" );
            this.ScreenType = ScreenType.Portrait;

        } else if ( ratio > 0.69 && ratio < 1.4 )
        {
            //console.log( "Landscape" );
            this.ScreenType = ScreenType.Square;
        }
        else if ( ratio > 1.4 && ratio < 1.65 )
        {
            //console.log( "Landscape" );
            this.ScreenType = ScreenType.Mixed;
        }
        else if ( ratio > 1.65 )
        {
            //console.log( "Landscape" );
            this.ScreenType = ScreenType.Landscape;
        }

        this.onSizeChanged();
    }

    protected UpdateSize (): void
    {
        let ratio = screen.windowSize.width / screen.windowSize.height;
        //console.log( "Ratio: ", ratio );
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

        for ( let i = 0; i < this.listCanvas.length; i++ )
        {
            if ( i != this.ScreenType )
            {
                this.listCanvas[ i ].active = false;
            }
            else
            {
                this.setupCanvas( this.ScreenType, targetSize, ratio );
            }
        }

        console.log( "Ratio: ", ratio );
    }

    setupCanvas ( type: ScreenType, targetSize: Size, ratio: number ): void
    {
        //console.log("Target Size: ", targetSize);
        this.listCanvas[ type ].active = true;
        this.listCanvas[ type ].getComponent( UITransform ).contentSize = targetSize;
        this.listCanvas[ type ].getComponent( Widget ).updateAlignment();
        //this.UICamera.orthoHeight = targetSize.height / 2;
        this.uimulti.SetUIElements( this.ScreenType );
        MoveScrewHandle.Instance.camera = this.listCamera[ this.ScreenType ];

    }
}

export enum ScreenType
{
    Portrait = 0,
    Square = 1,
    Mixed = 2,
    Landscape = 3
}


