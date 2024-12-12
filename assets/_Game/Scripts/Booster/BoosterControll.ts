import { _decorator, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
import { CCInteger } from 'cc';
import { Game } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { input } from 'cc';
import { Input } from 'cc';
import { EventTouch } from 'cc';
import { MultiScreneController } from '../Controller/MultiScreneController';
import { Vec3 } from 'cc';
import { Vec2 } from 'cc';
import { Collider2D } from 'cc';
import { Rect } from 'cc';
import { GameConfig } from '../GameConfig/GameConfig';
import { PhysicsSystem2D } from 'cc';
import { GameLayerMaskConfig } from '../GameConfig/GameLayerMaskConfig';
import { BarController } from '../GameComponent/Bar/BarController';
import { MoveScrewHandle } from '../Controller/MoveScrewHandle';
import { CCBoolean } from 'cc';
import { Screw } from '../GameComponent/Screw/Screw';
import { tween } from 'cc';
import { StarController } from '../Star/StarController';
import { sp } from 'cc';
import { Hole } from '../GameComponent/Hole/Hole';
import { BoosterType, HightlightBooster } from './HightlightBooster';
import { AudioController, AudioType } from '../AudioController/AudioController';
import { set } from '../../../../extensions/nvthan/@types/packages/scene/@types/cce/utils/lodash';
import { getGameSystem } from '../GameSystem';
import { log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BoosterControll' )
export class BoosterControll extends Component 
{
    //#region EDITOR EXPOSED FIELDS
    @property( HightlightBooster )
    private hightlightBooster: HightlightBooster = null;
    @property( )
    private listBoosterCount: number[] = [];
    @property()
    private isCompleteBreakBar: boolean = false;
    @property( Node )
    private mayhutPosiotion: Node = null;
    @property( Node )
    private boosterUI: Node = null;

    @property( { type: sp.Skeleton, group: "Skeleton" } )
    private drillSkeleton: sp.Skeleton = null;
    @property( { type: sp.Skeleton, group: "Skeleton" } )
    private hammerSkeleton: sp.Skeleton = null;
    @property( { type: sp.Skeleton, group: "Skeleton" } )
    private vacuumSkeleton: sp.Skeleton = null;
    //#endregion

    //#region PRIVATE FIELDS
    private State: BoosterState = BoosterState.None;
    private cachedContainer: CahedContainer = null;
    //#endregion

    //#region  PROPERTIES
    public get ListBoosterCount (): number[]
    {
        return this.listBoosterCount;
    }
    public get HightlightBooster ()
    {
        return this.hightlightBooster;
    }
    public get BoosterUI (): Node
    {
        return this.boosterUI;
    }
    public set BoosterUI ( value: Node )
    {
        this.boosterUI = value;
    }
    //#endregion

    //#region CC_METHODS

    protected onDestroy (): void
    {
        input.off( Input.EventType.TOUCH_START, this.GetBarState, this );
    }

    protected start (): void
    {
        this.cachedContainer = getGameSystem().CahedContainer;
    }

    protected update ( dt: number ): void
    {
        switch ( this.State )
        {
            case BoosterState.None:
                break;
            case BoosterState.Hammer:
                input.on( Input.EventType.TOUCH_START, this.GetBarState, this );
                break;
        }
    }
    //#endregion

    private SetState ( state: BoosterState ): void
    {
        this.State = state;
    }
    //#region AddNewHole
    public BoosterHammer (): void
    {
        if ( getGameSystem().CahedContainer.isFirstTime4Screw === false ) return;
        if ( this.cachedContainer.AddNewHole( this.listBoosterCount[BoosterType.Hammer] ) != null &&
        this.listBoosterCount[BoosterType.Hammer] > 0 )
        {
            this.listBoosterCount[BoosterType.Hammer]--;
            //getGameSystem().BoosterControll.hightlightBooster.StopHLBooster();
            //getGameSystem().MoveScrewHandle.EnableTouch();
            getGameSystem().CahedContainer.StopShowingWarning();
        }
        else
        {
            log( "Can't add new hole" );
        }
    }

    public DrillAnimation ( hole: Hole ): void
    {
        const startPos = this.drillSkeleton.node.getWorldPosition();
        const worldPosition = hole.node.getWorldPosition();
        this.drillSkeleton.node.active = true;
        // tween( this.drillSkeleton.node )
        //     .to( 1, { worldPosition: worldPosition } )
        //     .call( () => 
        //     {
        //         this.drillSkeleton.node.active = false;
        //         this.drillSkeleton.node.worldPosition = startPos;
        //         this.drillSkeleton.setAnimation( 0, "animation", false );

        //         hole.node.active = true;
        //     } )
        //     .start();
        //this.drillSkeleton.node.active = false;
        this.drillSkeleton.node.worldPosition = worldPosition.add3f( 10, -10, 0 );
        this.drillSkeleton.setAnimation( 0, "animation", false );
        setTimeout( () =>
        {
            getGameSystem().AudioController.playDrill();
        }, 300 );
        this.drillSkeleton.setCompleteListener( ( trackListener: sp.spine.TrackEntry ) =>
        {
            if ( trackListener.animation.name === 'animation' )
            {
                hole.node.active = true;
                this.drillSkeleton.node.active = false;
                this.drillSkeleton.node.worldPosition = startPos;

            }
        } );

    }
    //endregion
    //#region BreakBar
    public BoosterBreakBar (): void
    {
        this.SetState( BoosterState.Hammer );
        this.isCompleteBreakBar = false;
        getGameSystem().MoveScrewHandle.DisableTouch();
       
    }
    private cachedBarCollider: Collider2D[] = [];

    public GetBarState ( event: EventTouch ): void
    {
        
        if ( this.isCompleteBreakBar ) return;
        let camera = getGameSystem().MultiScreneController.getCameraGamePlay();
        let mousePosition = event.getLocation();
        let worldPosition = camera.screenToWorld( new Vec3( mousePosition.x, mousePosition.y, 0 ) );
        let lastMousePositon = new Vec2( worldPosition.x, worldPosition.y );

        this.cachedBarCollider = [];
        const aabb = new Rect( lastMousePositon.x - GameConfig.CLICK_RADIUS
            , lastMousePositon.y - GameConfig.CLICK_RADIUS
            , GameConfig.CLICK_RADIUS * 2
            , GameConfig.CLICK_RADIUS * 2 );

        let cachedCollider = PhysicsSystem2D.instance.testAABB( aabb );

        if ( cachedCollider.length === 0 ) return;
        for ( let i = 0; i < cachedCollider.length; i++ )
        {
            if ( cachedCollider[ i ].node.layer === GameLayerMaskConfig.BAR_LAYER_MASK )
            {
                this.cachedBarCollider.push( cachedCollider[ i ] );
            }
        }

        if ( this.cachedBarCollider.length === 0 ) return;

        let highestLayerBar: BarController = null;
        let highestLayer = -999;
        for ( let i = 0; i < this.cachedBarCollider.length; i++ )
        {
            let bar = this.cachedBarCollider[ i ].node.getComponent( BarController );
            if ( bar.Layer > highestLayer )
            {
                highestLayer = bar.Layer;
                highestLayerBar = bar;
            }
        }

        if ( highestLayerBar === null ) return;
        this.CompleteBreakBar( highestLayerBar );
    }

    public async CompleteBreakBar ( bar: BarController ): Promise<void>
    {
        this.isCompleteBreakBar = true;
        await this.UseHammer();
        bar.BreakBar();
        input.off( Input.EventType.TOUCH_START, this.GetBarState, this );
        getGameSystem().MoveScrewHandle.EnableTouch();
        this.SetState( BoosterState.None );
    }

    public async UseHammer (): Promise<void>
    {
    
    }
    //#endregion

    //#region RemoveScrew
    public BoosterRemoveScrew (): void
    {
        if ( this.listBoosterCount[BoosterType.Vacuum] <= 0 ) return;
        this.State = BoosterState.Vaccum;
        let listScrewOnCached = this.cachedContainer.GetScrewForBooster();
        if ( listScrewOnCached.length > 0 )
        {
            for ( let i = 0; i < listScrewOnCached.length; i++ )
            {
                let screw = listScrewOnCached[ i ];
                if ( screw !== null )
                {
                    getGameSystem().CahedContainer.CurrentScrewCount--;
                    this.MoveScrewToBooster( screw, i );
                }
            }
            this.State = BoosterState.None;
        }
        else
        {
            log( "Can't remove screw" );
            this.State = BoosterState.None;

        }
    }

    private MoveScrewToBooster ( screw: Screw, order: number ): void
    {
        let timedelay = 0.15;
        const worldPosition = screw.node.worldPosition.clone();
        screw.node.setParent( this.boosterUI );
        screw.node.worldPosition = worldPosition;
        tween( screw.node )
            .delay( timedelay * order )
            .to( 0.5, { worldPosition: this.mayhutPosiotion.worldPosition } )
            .call( () =>
            {
                let star = getGameSystem().StarController.spawnStarAtBar( screw.node.worldPosition, 0 );
                getGameSystem().GameManager.updateDataBox( screw );
                screw.node.destroy();
                getGameSystem().GameManager.CollectedScrew++;
                getGameSystem().StarController.moveStart( star );
            } )
            .start();
    }
    //#endregion
}

export enum BoosterState
{
    None = 0,
    Drill = 1,
    Hammer = 2,
    Vaccum = 3,
}




