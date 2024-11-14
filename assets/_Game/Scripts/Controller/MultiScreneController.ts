import { _decorator, Canvas, Component, Node, Sprite, SpriteFrame, View, Size } from 'cc';
import { TutorialController } from '../TutorialController';
import { UIController } from '../UIController';
import { screen } from 'cc'
import { view } from 'cc';
import { ResolutionPolicy } from 'cc';
import { UITransform } from 'cc';
import { Widget } from 'cc';
import { Camera } from 'cc';
import { CameraController } from '../CameraController';
const { ccclass, property } = _decorator;

@ccclass( 'MultiScreneController' )
export class MultiScreneController extends Component
{

    @property( CameraController )
    public CameraController: CameraController = null;

    @property( Node )
    public listCanvas: Node[] = [];

    @property( Camera )
    public UICamera: Camera = null;

    public ScreenType: ScreenType = 0;

    private uiController: UIController = null;

    protected onEnable (): void
    {
        //this.sceneCanvas.node.on( Node.EventType.SIZE_CHANGED, this.onSizeChanged, this );
        this.uiController = UIController.Instance;
    }

    protected start (): void
    {
        this.onSizeChanged();
    }

    onSizeChanged (): void
    {
        let width = screen.windowSize.width;
        let height = screen.windowSize.height;

        let ratio = width / height;

        if ( ratio < 1.4 )
        {
            //console.log( "Portrait" );
            this.ScreenType = ScreenType.Portrait;

        } else if ( ratio > 1.4 )
        {
            //console.log( "Landscape" );
            this.ScreenType = ScreenType.Landscape;
        }

        //this.tutorialController.updatePosition();
    }

    protected update ( dt: number ): void
    {
        let ratio = screen.windowSize.width / screen.windowSize.height;
        console.log( "Ratio: ", ratio );
        let targetSize: Size = new Size( 1920, 1080 );
        let screenType = ScreenType.Landscape;

        // if ( ratio < 0.69 )
        // {
        //     targetSize = new Size( 1080, 1920 );
        //     screenType = ScreenType.Portrait;
        // }
        // else if ( ratio > 0.69 && ratio < 1.4 )
        // {
        //     targetSize = new Size( 1920, 1920 );
        //     screenType = ScreenType.Square;
        // }
        // else if ( ratio > 1.4 && ratio < 1.65 )
        // {
        //     targetSize = new Size( 1920, 1324 );
        //     screenType = ScreenType.Mixed;
        // }
        // else if ( ratio > 1.65 )
        // {
        //     targetSize = new Size( 1920, 1080 );
        //     screenType = ScreenType.Landscape;
        // }
        if ( ratio < 1.4 )
        {
            targetSize = new Size( 1080, 1920 );
            screenType = ScreenType.Portrait;
        }
        else if ( ratio > 1.4 )
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
    }

    setupCanvas ( type: ScreenType, targetSize: Size, ratio: number ): void
    {
        //console.log("Target Size: ", targetSize);
        this.listCanvas[ type ].active = true;
        this.listCanvas[ type ].getComponent( UITransform ).contentSize = targetSize;
        this.listCanvas[ type ].getComponent( Widget ).updateAlignment();
        //this.UICamera.orthoHeight = targetSize.height / 2;
        this.CameraController.setCameraOthorSize( targetSize );

    }
}

// export enum ScreenType
// {
//     Portrait = 0,
//     Square = 1,
//     Mixed = 2,
//     Landscape = 3
// }

export enum ScreenType
{
    Portrait = 0,
    Landscape = 1
}


