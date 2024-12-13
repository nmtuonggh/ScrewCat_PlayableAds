import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { group } from 'console';
import { ScreenType } from '../Controller/MultiScreneController';
const { ccclass, property } = _decorator;

@ccclass( 'UIMultiScreen' )
export class UIMultiScreen extends Component 
{
    //#region Element Position
    @property( { type: Node, group: "Element" } )
    public LevelContainer: Node = null;

    @property( { type: Node, group: "Element" } )
    public BoxContainer: Node = null;

    @property( { type: Node, group: "Element" } )
    public CacheContainer: Node = null;

    @property( { type: Node, group: "Element" } )
    public Star: Node = null;

    @property( { type: Node, group: "Element" } )
    public Booster: Node = null;

    @property( { type: Node, group: "Element" } )
    public BoosterHL: Node = null;


    //#endregion

    //#region Portrain Position
    @property( { type: Vec3, group: "Portrain" } )
    public LevelContainerPosPortrai: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Portrain" } )
    public BoxContainerPosPortrai: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Portrain" } )
    public CacheContainerPosPortrai: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Portrain" } )
    public StarPosPortrai: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Portrain" } )
    public BoosterPosPortrai: Vec3 = new Vec3( 0, 0, 0 );
    //#endregion

    //#region Landscape Position
    @property( { type: Vec3, group: "Square" } )
    public LevelContainerPosSquare: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Square" } )
    public BoxContainerPosSquare: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Square" } )
    public CacheContainerPosSquare: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Square" } )
    public StarPosSquare: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Square" } )
    public BoosterPosSquare: Vec3 = new Vec3( 0, 0, 0 );
    //#endregion

    //#region Landscape Position
    @property( { type: Vec3, group: "Mix" } )
    public LevelContainerPosMix: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Mix" } )
    public BoxContainerPosMix: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Mix" } )
    public CacheContainerPosMix: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Mix" } )
    public StarPosMix: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Mix" } )
    public BoosterPosMix: Vec3 = new Vec3( 0, 0, 0 );
    //#endregion

    //#region Landscape Position
    @property( { type: Vec3, group: "Landscape" } )
    public LevelContainerPosLandscape: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Landscape" } )
    public BoxContainerPosLandscape: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Landscape" } )
    public CacheContainerPosLandscape: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Landscape" } )
    public StarPosLandscape: Vec3 = new Vec3( 0, 0, 0 );
    @property( { type: Vec3, group: "Landscape" } )
    public BoosterPosLandscape: Vec3 = new Vec3( 0, 0, 0 );
    //#endregion



    public SetComponentPosition ( screenType: ScreenType ): void
    {
        //console.log( "SetUIElements " + screenType.toString() );
        switch ( screenType )
        {
            case ScreenType.Portrait:
                this.SetPortrainElementsPosition();
                break;
            case ScreenType.Landscape:
                this.SetLandscapeElementsPosition();
                break;
            case ScreenType.Square:
                this.SetSquareElementsPosition();
                break;
            case ScreenType.Mixed:
                this.SetMixElementsPosition();
                break;
            default:
                break;
        }
    }

    public SetPortrainElementsPosition (): void 
    {
        this.LevelContainer.setPosition( this.LevelContainerPosPortrai );
        this.BoxContainer.setPosition( this.BoxContainerPosPortrai );
        this.CacheContainer.setPosition( this.CacheContainerPosPortrai );
        this.Star.setPosition( this.StarPosPortrai );
        if ( this.Booster )
        {
            this.Booster.setPosition( this.BoosterPosPortrai );
            this.BoosterHL.setPosition( this.BoosterPosPortrai );
            this.Booster.setScale( 1, 1, 1 );
            this.BoosterHL.setScale( 1, 1, 1 );
        }

    }

    public SetLandscapeElementsPosition (): void 
    {
        this.LevelContainer.setPosition( this.LevelContainerPosLandscape );
        this.BoxContainer.setPosition( this.BoxContainerPosLandscape );
        this.CacheContainer.setPosition( this.CacheContainerPosLandscape );
        this.Star.setPosition( this.StarPosLandscape );
        if ( this.Booster )
        {
            this.Booster.setPosition( this.BoosterPosLandscape );
            this.Booster.setScale( 0.85, 0.85, 1 );
            this.BoosterHL.setPosition( this.BoosterPosLandscape );
            this.BoosterHL.setScale( 0.85, 0.85, 1 );
        }
    }

    public SetSquareElementsPosition (): void 
    {
        this.LevelContainer.setPosition( this.LevelContainerPosSquare );
        this.BoxContainer.setPosition( this.BoxContainerPosSquare );
        this.CacheContainer.setPosition( this.CacheContainerPosSquare );
        this.Star.setPosition( this.StarPosSquare );
        if ( this.Booster )
        {
            this.Booster.setPosition( this.BoosterPosSquare );
            this.Booster.setScale( 1, 1, 1 );
            this.BoosterHL.setPosition( this.BoosterPosSquare );
            this.BoosterHL.setScale( 1, 1, 1 );
        }
    }

    public SetMixElementsPosition (): void 
    {
        this.LevelContainer.setPosition( this.LevelContainerPosMix );
        this.BoxContainer.setPosition( this.BoxContainerPosMix );
        this.CacheContainer.setPosition( this.CacheContainerPosMix );
        this.Star.setPosition( this.StarPosMix );
        if ( this.Booster )
        {
            this.Booster.setPosition( this.BoosterPosMix );
            this.Booster.setScale( 1, 1, 1 );
            this.BoosterHL.setPosition( this.BoosterPosMix );
            this.BoosterHL.setScale( 1, 1, 1 );
        }
    }
}





