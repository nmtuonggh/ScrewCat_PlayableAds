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
import { CCInteger } from 'cc';
import { GameLayer } from '../GameComponent/GameLayer';
import { JsonAsset } from 'cc';
import { getGameSystem } from '../GameSystem';
import { GameLayerOder } from '../GameComponent/GameLayerOder';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
import { get } from 'http';
import { PhysicsSystem2D } from 'cc';
import { Vec3 } from 'cc';
import { tween } from 'cc';
import { Quat } from 'cc';
import { easing } from 'cc';
import { Tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass( 'LevelController' )
export class LevelController extends Component
{
    //#region EDITOR EXPOSED FIELDS
    @property( Node )
    private Holder: Node = null;
    @property( BarController )
    private listBar: BarController[] = [];
    @property( { type: [ Screw ], readonly: true } )
    private listScrew: Screw[] = [];
    @property( { type: [ GameLayer ], readonly: true } )
    private listLayer: GameLayer[] = [];
    @property( JsonAsset )
    private jsonFile: JsonAsset = null;
    @property( BoxData )
    private BoxData: BoxData = null;
    @property( ScrewData )
    private ScrewData: ScrewData = null;
    @property( { type: boxSpawnData, readonly: true } )
    private colorBoxSpawnData: boxSpawnData[] = [];
    @property( { readonly: true } )
    private currentBoxDataIndex: number = 0;
    @property()
    private activeLayerCount: number = 5;
    @property()
    private playingLayerCount: number = 3;
    @property( { readonly: true } )
    private currentPlayingLayerIndex: number = 0;
    //#endregion
    //#region PRIVATE FIELDS
    private listActiveLayer: GameLayer[] = [];
    private listPlayingLayer: GameLayer[] = [];
    private listUnActiveLayer: GameLayer[] = [];
    //#endregion
    //#region PROPERTIES
    public get CurrentBoxDataIndex (): number
    {
        return this.currentBoxDataIndex;
    }
    public set CurrentBoxDataIndex ( value: number )
    {
        this.currentBoxDataIndex = value;
    }
    public get ColorBoxSpawnData (): boxSpawnData[]
    {
        return this.colorBoxSpawnData;
    }
    public set ColorBoxSpawnData ( value: boxSpawnData[] )
    {
        this.colorBoxSpawnData = value;
    }
    //#endregion
    //#region CC METHODS
    protected onLoad (): void
    {

        this.listBar = this.Holder.getComponentsInChildren( BarController );
        this.listScrew = this.Holder.getComponentsInChildren( Screw );
        this.listLayer = this.Holder.getComponentsInChildren( GameLayer );

    }

    protected async start (): Promise<void>
    {
        this.loadBoxDataFromJson();
        this.initBarAndScrewColor();
        getGameSystem().ProgressBoxSlot.initLockBoxSlot();
        this.initBox();
        getGameSystem().BoxContainer.InitQueue();
        getGameSystem().GameManager.CurrentScrew = this.listScrew.length;
        getGameSystem().GameManager.TotalScrew = this.listScrew.length;
        this.initLayer();

        PhysicsSystem2D.instance.enable = false;
        // let listBar = this.Holder.getComponentsInChildren( BarController );
        // let listScrew = this.Holder.getComponentsInChildren( Screw );
        // for ( let i = 0; i < listBar.length; i++ )
        // {
        //     this.introScale( listBar[ i ].node );
        //     this.introRotation( listBar[ i ].node );
        // }
        // for ( let i = 0; i < listScrew.length; i++ )
        // {
        //     this.introScale( listScrew[ i ].node );
        //     this.introRotation( listScrew[ i ].node );
        // }
        // let listLayer = this.Holder.getComponentsInChildren( GameLayerOder );
        // for ( let i = 0; i < listLayer.length; i++ )
        // {

        //     this.introScale( listLayer[ i ].node );
        //     this.introRotation( listLayer[ i ].node );
        //     await new Promise( resolve => setTimeout( resolve, 50 ) );
        // }
        // await new Promise( resolve => setTimeout( resolve, 1000 ) );
        PhysicsSystem2D.instance.enable = true;
        getGameSystem().MultiScreneController.onSizeChanged();
    }
    //#region Intro
    private introScale ( node: Node )
    {
        let startScale = node.getScale();
        node.setScale( Vec3.ZERO );
        tween( node )
            .delay( 0 )
            .to( 0.25, { scale: startScale }, { easing: "linear" } )
            .start();
    }
    private offsetRotation = 180;
    private introRotation ( node: Node )
    {
        // let startRotation = node.getRotation();
        // let endRotation = new Quat();
        // Quat.rotateZ( endRotation, startRotation, this.offsetRotation * Math.PI / 180 );
        // tween( node )
        //     .delay( 0.2 )
        //     .to( 0.5, { rotation: endRotation }, { easing: "linear" } )
        //     //.to( 0.5, { rotation: startRotation }, { easing: "linear" } )
        //     .start();
        //
        node.eulerAngles = new Vec3( 0, 0, -275 );
        const tweenRotate = tween( node )
            .delay( 0 )
            .to( 0.25, { eulerAngles: new Vec3( 0, 0, 0 ) }, { easing: easing.backOut } )
        tweenRotate.start();

        // return new Promise<void>( ( resolve, reject ) =>
        // {
        //     setTimeout( () =>
        //     {
        //         resolve();
        //         Tween.stopAllByTarget( node );
        //     }, ( 0 + 0.25 + 1 ) * 1000 );
        // } );
    }
    //#endregion
    //#endregion
    //#region PRIVATE METHODS
    private initBarAndScrewColor (): void 
    {
        this.listBar.forEach( bar => 
        {
            bar.InitScrewColor( this.ScrewData );
            bar.BarPhysic.SetGroupLayer();
            bar.BarPhysic.CreatHGJoint();
            //bar.BarPhysic.EnableHGJoin();
        } );
        this.listScrew.forEach( screw =>
        {
            screw.enableHgJoint();
        } )
    }

    private initBox (): void
    {
        const listBoxSlot = getGameSystem().BoxContainer.BoxSlots;

        for ( let i = 0; i < listBoxSlot.length; i++ )
        {
            const boxSlot = listBoxSlot[ i ];
            if ( boxSlot.IsBlockByChain )
            {
                boxSlot.boxAdsPrefab.active = true;
            }
            else if ( !boxSlot.IsInProgress )
            {
                const color = this.colorBoxSpawnData[ this.currentBoxDataIndex ].color;
                const holeCount = this.colorBoxSpawnData[ this.currentBoxDataIndex ].holeCount;
                getGameSystem().BoxContainer.InitBox( color, boxSlot.boxHolder, this.BoxData, holeCount );
                boxSlot.InitBoxSlotData();
                this.currentBoxDataIndex++;
            }
        }
    }

    private loadBoxDataFromJson (): void
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
    private initLayer (): void
    {
        this.listActiveLayer = [];
        this.listPlayingLayer = [];
        this.listUnActiveLayer = [];

        //Init số lượng screw trong mỗi layer
        for ( let i = 0; i < this.listLayer.length; i++ )
        {
            this.listLayer[ i ].initDataLayer();
            let listBar = [];
            listBar = this.listLayer[ i ].node.getComponentsInChildren( BarController );
            this.listLayer[ i ].listBar = listBar;
        }

        //UnActive all layer + set hideSprite cua bar + hideScrew
        for ( let i = 0; i < this.listLayer.length; i++ )
        {
            this.listLayer[ i ].setHideSpriteBar();
            this.listLayer[ i ].unActiveLayer();
            this.listLayer[ i ].hideScrew();
            this.listUnActiveLayer.push( this.listLayer[ i ] );
        }

        //active layer 
        for ( let i = 0; i < this.activeLayerCount; i++ )
        {
            if ( this.listUnActiveLayer.length > 0 &&
                i < this.activeLayerCount )
            {
                const lastLayer = this.listUnActiveLayer.pop();
                this.activeLayer( lastLayer );
            }
        }

        //set playing layer
        for ( let i = 0; i < this.playingLayerCount; i++ )
        {
            if ( this.listActiveLayer.length > 0 && i < this.playingLayerCount )
            {
                this.setPlayingLayer( this.listActiveLayer[ i ] );
            }
        }

        this.currentPlayingLayerIndex = this.playingLayerCount - 1;
    }

    //#endregion
    private activeNewLayer (): void
    {
        //active layer cuoi cung trong listUnActiveLayer
        if ( this.listUnActiveLayer.length > 0 && this.listActiveLayer.length < this.activeLayerCount )
        {
            const lastLayer = this.listUnActiveLayer.pop();
            this.activeLayer( lastLayer );
        }
    }

    private displayLayer ( index: number ): void
    {
        if ( index < this.listActiveLayer.length )
        {
            const layer = this.listActiveLayer[ index ];
            this.setPlayingLayer( layer );
        }
    }
    //#region Show Layer
    private activeLayer ( layer: GameLayer ): void
    {
        layer.activeLayer();
        this.listActiveLayer.push( layer );
    }

    private setPlayingLayer ( layer: GameLayer ): void
    {
        //bat screw + show bar
        layer.showScrew();
        layer.setNormalSpriteBarInLayer();
        //layer.SetDynamicBarLayer();
        this.listPlayingLayer.push( layer );
    }
    //#endregion
    //#endregion
    //#region PUBLIC METHODS
    //#region New Layer
    public removeScrewInLayer ( screw: Screw ): void
    {
        for ( let i = 0; i < this.listLayer.length; i++ )
        {
            if ( screw.Layer === this.listLayer[ i ].node.getComponent( GameLayerOder ).getLayer() )
            {
                this.listLayer[ i ].removeScrew();
                if ( this.listLayer[ i ].screwCount <= 0 )
                {
                    //loai screw.Layer ra khoi listACtiveLayer
                    // const layer = this.listLayer[ i ];
                    // const index = this.listActiveLayer.indexOf( layer );
                    // if ( index > -1 )
                    // {
                    //     this.listActiveLayer.splice( index, 1 );
                    // }
                    this.activeLayerCount++;
                    this.activeNewLayer();
                    this.currentPlayingLayerIndex++;
                    this.displayLayer( this.currentPlayingLayerIndex );
                }
            }
        }
    }
    //#endregion
    //#endregion
}