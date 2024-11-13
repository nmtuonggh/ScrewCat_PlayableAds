import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from '../GameComponent/Bar/BarController';
import { BoxData } from '../FakeSO/BoxData';
import { ScrewData } from '../FakeSO/ScrewData';
import { BoxContainer } from './BoxContainer';
import { Screw } from '../GameComponent/Screw/Screw';
import { Button } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { Layers } from 'cc';
import { eColorType } from '../GameConfig/GameColorConfig';
import { boxSpawnData } from '../BoxSpawndata/boxSpawnData';
import { ScriptHolder } from '../ScriptHolder';
import { CCInteger } from 'cc';
import { GameLayer } from '../GameComponent/GameLayer';
import { JsonAsset } from 'cc';

const { ccclass, property } = _decorator;

@ccclass( 'LevelController' )
export class LevelController extends Component
{
    @property( Node )
    private Holder: Node = null;
    @property( BarController )
    private listBar: BarController[] = [];
    @property( [ Screw ] )
    private listScrew: Screw[] = [];
    @property( [ GameLayer ] )
    private listLayer: GameLayer[] = [];

    @property( JsonAsset )
    public jsonFile: JsonAsset = null;
    @property( BoxData )
    private BoxData: BoxData = null;
    @property( ScrewData )
    private ScrewData: ScrewData = null;

    @property( boxSpawnData )
    public colorBoxSpawnData: boxSpawnData[] = [];
    @property( CCInteger )
    public currentIndex: number = 0;

    @property( CCInteger )
    public activeLayerCount: number = 5;
    @property( CCInteger )
    public playingLayerCount: number = 3;
    @property( CCInteger )
    public currentPlayingLayerIndex: number = 0;

    public listActiveLayer: GameLayer[] = [];
    public listPlayingLayer: GameLayer[] = [];
    public listUnActiveLayer: GameLayer[] = [];

    private static _instance: LevelController = null;

    public static get Instance (): LevelController
    {
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( LevelController._instance === null )
        {
            LevelController._instance = this;
        }

        this.listBar = this.Holder.getComponentsInChildren( BarController );
        this.listScrew = this.Holder.getComponentsInChildren( Screw );
        this.listLayer = this.Holder.getComponentsInChildren( GameLayer );
    }

    protected start (): void
    {
        this.loadBoxDataFromJson();
        this.InitBarAndScrewColor();
        this.InitBox();
        BoxContainer.Instance.InitQueue();
        GameManager.Instance.currentScrew = this.listScrew.length;
        GameManager.Instance.TotalScrew = this.listScrew.length;
        this.InitLayer();
    }

    private InitBarAndScrewColor (): void 
    {
        this.listBar.forEach( bar => 
        {
            bar.InitScrewColor( this.ScrewData );
            bar.barPhysic.SetGroupLayer();
            bar.barPhysic.CreatHGJoint();
            bar.barPhysic.EnableHGJoin();
        } );
    }

    public InitBox (): void
    {
        const listBoxSlot = BoxContainer.Instance.boxSlots;

        for ( let i = 0; i < listBoxSlot.length; i++ )
        {
            const boxSlot = listBoxSlot[ i ];
            if ( boxSlot.isAds )
            {
                boxSlot.boxAdsPrefab.active = true;
            }
            else
            {
                const color = this.colorBoxSpawnData[ this.currentIndex ].color;
                const holeCount = this.colorBoxSpawnData[ this.currentIndex ].holeCount;
                BoxContainer.Instance.InitBox( color, boxSlot.boxHolder, this.BoxData, holeCount );
                boxSlot.InitBoxSlotData();
                this.currentIndex++;
            }
        }
    }

    public loadBoxDataFromJson (): void
    {
        try
        {
            const data = this.jsonFile.json;
            this.colorBoxSpawnData = [];
            if ( data.BoxData && Array.isArray( data.BoxData ) )
            {
                for ( let i = 0; i < data.BoxData.length; i++ )
                {
                    const item = data.BoxData[ i ];
                    this.colorBoxSpawnData.push( {
                        color: item.Color,
                        holeCount: item.HoleCount
                    } );
                }
            }
        } catch ( error )
        {
            console.error( "Failed to load box data:", error );
        }
    }

    //#region  Init Layer
    public InitLayer (): void
    {
        this.listActiveLayer = [];
        this.listPlayingLayer = [];
        this.listUnActiveLayer = [];

        //Init số lượng screw trong mỗi layer
        for ( let i = 0; i < this.listLayer.length; i++ )
        {
            this.listLayer[ i ].InitDataLayer();
            let listBar = [];
            listBar = this.listLayer[ i ].node.getComponentsInChildren( BarController );
            this.listLayer[ i ].listBar = listBar;
        }

        //UnActive all layer + set hideSprite cua bar + hideScrew
        for ( let i = 0; i < this.listLayer.length; i++ )
        {
            this.listLayer[ i ].SetHideSpriteBar();
            this.listLayer[ i ].UnActiveLayer();
            this.listLayer[ i ].HideScrew();
            this.listUnActiveLayer.push( this.listLayer[ i ] );
        }

        //active layer 
        for ( let i = 0; i < this.activeLayerCount; i++ )
        {
            if ( this.listUnActiveLayer.length > 0 )
            {
                const lastLayer = this.listUnActiveLayer.pop();
                this.ActiveLayer( lastLayer );
            }
        }

        //set playing layer
        for ( let i = 0; i < this.playingLayerCount; i++ )
        {
            if ( this.listActiveLayer.length > 0 )
            {
                this.SetPlayingLayer( this.listActiveLayer[ i ] );
            }
        }

        this.currentPlayingLayerIndex = this.playingLayerCount - 1;
    }

    //#endregion


    //#region New Layer
    public RemoveScrewInLayer ( screw: Screw ): void
    {
        for ( let i = 0; i < this.listLayer.length; i++ )
        {
            if ( screw.Layer === this.listLayer[ i ].layerOrder )
            {
                this.listLayer[ i ].RemoveScrew();
                if ( this.listLayer[ i ].screwCount <= 0 )
                {
                    this.ActiveNewLayer();
                    this.currentPlayingLayerIndex++;
                    this.DisplayLayer( this.currentPlayingLayerIndex );
                }
            }
        }
    }

    private ActiveNewLayer (): void
    {
        //active layer cuoi cung trong listUnActiveLayer
        if ( this.listUnActiveLayer.length > 0 )
        {
            const lastLayer = this.listUnActiveLayer.pop();
            this.ActiveLayer( lastLayer );
        }
    }

    private DisplayLayer ( index: number ): void
    {
        if ( index < this.listActiveLayer.length )
        {
            const layer = this.listActiveLayer[ index ];
            this.SetPlayingLayer( layer );
        }
    }
    //#endregion

    //#region Show Layer
    private ActiveLayer ( layer: GameLayer ): void
    {
        layer.ActiveLayer();
        this.listActiveLayer.push( layer );
    }

    private SetPlayingLayer ( layer: GameLayer ): void
    {
        //bat screw + show bar
        layer.ShowScrew();
        layer.SetNormalSpriteBarInLayer();
        //layer.SetDynamicBarLayer();
        this.listPlayingLayer.push( layer );
        console.log( "Playing Layer: ", layer.layerOrder );
    }
    //#endregion
}