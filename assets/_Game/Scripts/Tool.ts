import { _decorator, Component, Node } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
import { Screw } from './GameComponent/Screw/Screw';
import { CCBoolean } from 'cc';
import { PolygonCollider2D } from 'cc';
import { Sprite } from 'cc';
import { UIOpacity } from 'cc';
import { UIMultiScreen } from './MultiScreen/UIMultiScreen';
const { ccclass, property, executeInEditMode } = _decorator;


@ccclass( 'Tool' )
@executeInEditMode( true )
export class Tool extends Component
{
    @property( CCBoolean )
    public runSetCollider: boolean = false;
    @property( CCBoolean )
    public setlayer: boolean = false;
    @property( CCBoolean )
    public setScrewToBar: boolean = false;
    @property( CCBoolean )
    public setPosScreenData: boolean = false;
    @property( CCBoolean )
    public testPosScreen: boolean = false;

    @property( CCBoolean )
    public runSetCollider2222222: boolean = false;

    @property( BarController )
    public listBar: BarController[] = [];
    @property( Screw )
    public listScrew: Screw[] = [];
    @property( Node )
    barparent: Node = null;

    @property(UIMultiScreen)
    public uiMultiScreen: UIMultiScreen = null;
    
    @property({type: Node, group: "Element"})
    public LevelContainer: Node;

    @property({type: Node, group: "Element"})
    public BoxContainer: Node;

    @property({type: Node, group: "Element"})
    public CacheContainer: Node;
    

    @property({type: Node, group: "Element"})
    public Star: Node;

    protected onLoad (): void
    {
        this.listBar.length = 0;
        this.listScrew.length = 0;

        if ( this.runSetCollider || this.setScrewToBar )
        {
            this.listBar = this.barparent.getComponentsInChildren( BarController );
        }

        if ( this.setlayer )
        {
            this.listBar = this.barparent.getComponentsInChildren( BarController );
            this.listScrew = this.barparent.getComponentsInChildren( Screw );
        }

        if ( this.setCollider2222222 )
        {
            this.listBar = this.barparent.getComponentsInChildren( BarController );
            this.listScrew = this.barparent.getComponentsInChildren( Screw );

        }

        if ( this.setPosScreenData )
        {
            this.SetScreenElements();
        }

        if ( this.testPosScreen )
        {
            this.TestPosScreen();
        }

    }

    protected start (): void
    {
        if ( this.runSetCollider )
        {
            this.setCollider();
        }

        if ( this.setlayer )
        {
            this.setLayer();
        }

        if ( this.setScrewToBar )
        {
            this.SetScrewBar();
        }

        if ( this.runSetCollider2222222 )
        {
            this.setCollider2222222();
        }
    }

    public setCollider (): void    
    {
        for ( let i = 0; i < this.listBar.length; i++ ) 
        {

            const bar = this.listBar[ i ];
            bar.SetCollider();
            //bar.collider.threshold = 5; 
            bar.modelCollider.destroy();
        }
    }


    public setCollider2222222 (): void    
    {
        for ( let i = 0; i < this.listScrew.length; i++ ) 
        {
            const node = this.listScrew[ i ];
            let child2 = node.node.children[ 1 ];
            
            node.ScrewRenderer.botSprite = child2.getComponent( Sprite );
            
        }
    }

    public setLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ ) 
        {
            const bar = this.listBar[ i ];
            bar.node.layer = 1 << 10;
        }
        for ( let i = 0; i < this.listScrew.length; i++ ) 
        {

            const screw = this.listScrew[ i ];
            screw.node.layer = 1 << 11;
        }
    }

    public SetScrewBar (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ ) 
        {
            const bar = this.listBar[ i ];
            bar.listScrews.length = 0;

            let listScrewInLayer = bar.node.parent.getComponentsInChildren( Screw );

            for ( let j = 0; j < listScrewInLayer.length; j++ )
            {
                const screw = listScrewInLayer[ j ];
                const fullName = screw.node.name;
                const extractedName = fullName.substring( fullName.indexOf( "Bar_" ) );
                const barName = bar.node.name;

                if ( extractedName === barName )
                {
                    bar.listScrews.push( screw );
                }

                //lay colorIndex
                const parts = fullName.split( "_" );
                const colorIndex = parts[ 1 ];

                screw.ScrewRenderer.colorIndex = parseInt( colorIndex );

            }


            console.log( "Screw: ", bar.listScrews.length );
        }
    }

    public SetScreenElements (): void
    {
        this.uiMultiScreen.LevelContainerPosPortrai = this.LevelContainer.position;
        this.uiMultiScreen.BoxContainerPosPortrai  = this.BoxContainer.position;
        this.uiMultiScreen.CacheContainerPosPortrai  = this.CacheContainer.position;
        this.uiMultiScreen.StarPosPortrai  = this.Star.position;

    }

    public TestPosScreen (): void
    {
        // //Portrait
        // this.LevelContainer.position = this.uiMultiScreen.LevelContainerPosPortrai;
        // this.BoxContainer.position = this.uiMultiScreen.BoxContainerPosPortrai;
        // this.CacheContainer.position = this.uiMultiScreen.CacheContainerPosPortrai;
        // this.Star.position = this.uiMultiScreen.StarPosPortrai;
        //Square
        this.LevelContainer.position = this.uiMultiScreen.LevelContainerPosSquare;
        this.BoxContainer.position = this.uiMultiScreen.BoxContainerPosSquare;
        this.CacheContainer.position = this.uiMultiScreen.CacheContainerPosSquare;
        this.Star.position = this.uiMultiScreen.StarPosSquare;
        //Mixed
        // this.LevelContainer.position = this.uiMultiScreen.LevelContainerPosMix;
        // this.BoxContainer.position = this.uiMultiScreen.BoxContainerPosMix;
        // this.CacheContainer.position = this.uiMultiScreen.CacheContainerPosMix;
        // this.Star.position = this.uiMultiScreen.StarPosMix;
        // //Landscape
        // this.LevelContainer.position = this.uiMultiScreen.LevelContainerPosLandscape;
        // this.BoxContainer.position = this.uiMultiScreen.BoxContainerPosLandscape;
        // this.CacheContainer.position = this.uiMultiScreen.CacheContainerPosLandscape;
        // this.Star.position = this.uiMultiScreen.StarPosLandscape;
    }

}

