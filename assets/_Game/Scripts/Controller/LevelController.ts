import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from '../GameComponent/Bar/BarController';
import { BoxData } from '../FakeSO/BoxData';
import { ScrewData } from '../FakeSO/ScrewData';
import { Screw } from '../GameComponent/Screw/Screw';
import { boxSpawnData } from '../BoxSpawndata/boxSpawnData';
import { GameLayer } from '../GameComponent/GameLayer';
import { JsonAsset } from 'cc';
import { getGameSystem } from '../GameSystem';
import { GameLayerOder } from '../GameComponent/GameLayerOder';
import { TweenScale } from 'db://assets/PA_iKame (1)/base-script/Tween/TweenScale';
import { director } from 'cc';
import { PhysicsSystem2D } from 'cc';
import { TweenRotation } from 'db://assets/PA_iKame (1)/base-script/Tween/TweenRotation';
import { TutorialController } from '../TutorialController';
import { RigidBody2D } from 'cc';
import { HingeJoint2D } from 'cc';
import { Collider2D } from 'cc';
import { init } from '../../../../extensions/nvthan/@types/packages/engine/@types/editor-extends';
import { get } from 'http';
import { ScaleIntro } from 'db://assets/PA_iKame (1)/base-script/Tween/ScaleIntro';
import { RotationIntro } from 'db://assets/PA_iKame (1)/base-script/Tween/RotationIntro';
import { UIOpacity } from 'cc';
import { tween } from 'cc';
import { ShowLayerId } from '../GameComponent/ShowLayerId';
import { ServicesPool } from '../ServicePool/ServicesPool';
import { RealTimeTutorial } from './RealTimeTutorial';

const { ccclass, property } = _decorator;
export class LayerGroup
{
    public id: number;
    public listLayer: ShowLayerId[] = [];
}
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
    @property( Node )
    private levelNode: Node;
    @property( Node )
    disableInputWhenIntro: Node;
    @property()
    private isNotCollide: boolean = false;
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

    protected start (): void
    {
        this.initLevel();
    }
    //#endregion
    //#region Init Level
    private async initLevel (): Promise<void>
    {
        this.disableInputWhenIntro.active = true;
        this.loadBoxDataFromJson();
        this.initBarAndScrewColor();
        this.initBox();

        this.initLayer();
        PhysicsSystem2D.instance.enable = false;
        await this.playIntro2();
        await this.playIntroLevel();

        getGameSystem().ProgressBoxSlot.initLockBoxSlot();
        getGameSystem().BoxContainer.InitQueue();
        getGameSystem().GameManager.CurrentScrew = this.listScrew.length;
        getGameSystem().GameManager.TotalScrew = this.listScrew.length;

        this.initBarAndScrewPhysics();
        await new Promise( resolve => setTimeout( resolve, 0 ) );
        this.disableInputWhenIntro.active = false;
        //getGameSystem().TutorialController.tweenHandTutorial();
        //PhysicsSystem2D.instance.enable = true;
        ServicesPool.get( RealTimeTutorial ).updateTutorial();

    }
    //#endregion

    static delay ( seconds: number ): Promise<void>
    {
        return new Promise( resolve => setTimeout( resolve, seconds * 1000 ) );
    }
    //#region Play Intro Level
    private async playIntroLevel (): Promise<void>
    {
        let tweens = [];
        let noneIntroLayer = this.levelNode.getComponentsInChildren( UIOpacity );
        let tweenScales = this.levelNode.getComponentsInChildren( ScaleIntro );

        if ( tweenScales.length > 0 )
        {
            noneIntroLayer.forEach( layer =>
            {
                layer.getComponent( UIOpacity ).opacity = 0;
            } );
        }
        this.scheduleOnce( () =>
        {
            noneIntroLayer.forEach( layer =>
            {
                tween( layer ).to( 0.75, { opacity: 255 } ).start();
            } );
        }, 0.75 );
        tweenScales.forEach( tweenScale =>
        {
            tweens.push( tweenScale.play() );
        } );

        let tweenRotation = this.levelNode.getComponentsInChildren( RotationIntro );
        tweenRotation.forEach( tweenRotation =>
        {
            tweens.push( tweenRotation.play() );
        } );

        await Promise.all( tweens );
        if ( this.isNotCollide )
        {
            this.listBar.forEach( bar =>
            {
                bar.BarPhysic.setUnColliderGroupLayer();
            } );
        }
        else
        {
            this.listBar.forEach( bar =>
            {
                bar.BarPhysic.SetGroupLayer();
            } );
        }

        PhysicsSystem2D.instance.enable = true;
        getGameSystem().MultiScreneController.onSizeChanged();
    }
    //#endregion
    //#region Intro2
    private async playIntro2 (): Promise<void>
    {
        let listLayer = this.levelNode.getComponentsInChildren( ShowLayerId );
        let listLayerGroup: LayerGroup[] = [];
        if ( listLayer.length <= 0 ) return;

        listLayer.forEach( layer =>
        {
            let existingGroup = listLayerGroup.find( group => group.id === layer.layerId );
            if ( !existingGroup )
            {
                existingGroup = new LayerGroup();
                existingGroup.id = layer.layerId;
                listLayerGroup.push( existingGroup );
            }
            existingGroup.listLayer.push( layer );
        } );

        // Set opacity to 0 for all layers
        listLayer.forEach( layer =>
        {
            let uiOpacity = layer.getComponent( UIOpacity );
            if ( uiOpacity )
            {
                uiOpacity.opacity = 0;
            }
        } );

        // Sort layer groups by id
        listLayerGroup.sort( ( a, b ) => a.id - b.id );

        // Tween opacity to 255 in order with delay
        for ( const group of listLayerGroup )
        {
            for ( const layer of group.listLayer )
            {
                await LevelController.delay( 0.1 );
                let uiOpacity = layer.getComponent( UIOpacity );
                if ( uiOpacity )
                {
                    tween( uiOpacity ).to( 0.1, { opacity: 255 } ).start();
                }
            }
        }

        // let timeDelay = 0.1 * listLayerGroup.length;
        // await LevelController.delay( timeDelay );
        // ServicesPool.get( RealTimeTutorial ).updateTutorial();
    }
    //#endregion
    //#region PRIVATE METHODS
    private initBarAndScrewColor (): void 
    {
        this.listBar.forEach( bar => 
        {
            bar.InitScrewColor( this.ScrewData );
        } );
    }

    private initBarAndScrewPhysics (): void
    {
        this.listBar.forEach( bar =>
        {
            //bar.BarPhysic.SetGroupLayer();
            bar.BarPhysic.setActivePhysic( false );
            //bar.BarPhysic.SetNoneColliderGroupLayer();
            bar.BarPhysic.CreatHGJoint();
            bar.BarPhysic.setActivePhysic( true );
        } );
        this.listScrew.forEach( screw =>
        {
            screw.enableHgJoint();
        } );
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