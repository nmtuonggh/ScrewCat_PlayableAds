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
    //#endregion

    public SetUIElements (screenType : ScreenType): void
    {
        console.log("SetUIElements" + screenType);
        switch (screenType) {
            case ScreenType.Portrait:
                this.SetGPortrainElementsPosition();
                break;
            case ScreenType.Landscape:
                this.SetGLandscapeElementsPosition();
                break;
            default:
                break;
        }
    }

    public SetGPortrainElementsPosition (): void 
    {
        this.LevelContainer.setPosition( this.LevelContainerPosPortrai );
        this.BoxContainer.setPosition( this.BoxContainerPosPortrai );
        this.CacheContainer.setPosition( this.CacheContainerPosPortrai );
        this.Star.setPosition( this.StarPosPortrai );
    }

    public SetGLandscapeElementsPosition (): void 
    {
        this.LevelContainer.setPosition( this.LevelContainerPosLandscape );
        this.BoxContainer.setPosition( this.BoxContainerPosLandscape );
        this.CacheContainer.setPosition( this.CacheContainerPosLandscape );
        this.Star.setPosition( this.StarPosLandscape );
    }
}





