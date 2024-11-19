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
const { ccclass, property } = _decorator;

@ccclass( 'BoosterControll' )
export class BoosterControll extends Component 
{
    @property( CCInteger )
    public addHoleBoosterCount: number = 0;
    @property( CCBoolean )
    private isUsingBooster: boolean = false;
    @property( CCBoolean )
    private isCompleteBreakBar: boolean = false;

    private State: BoosterState = BoosterState.None;
    private cachedContainer: CahedContainer = null;

    protected override onLoad (): void
    {
    }

    protected onDestroy (): void
    {
        input.off( Input.EventType.TOUCH_START, this.GetBarState, this );
    }

    protected start (): void
    {
        this.cachedContainer = CahedContainer.Instance;
    }

    protected update ( dt: number ): void
    {
        switch ( this.State )
        {
            case BoosterState.None:
                break;
            case BoosterState.BreakBar:
                input.on( Input.EventType.TOUCH_START, this.GetBarState, this );
                break;
        }
    }

    private SetState ( state: BoosterState ): void
    {
        this.State = state;
    }

    public BoosterAddNewHole (): void
    {
        if ( this.cachedContainer.AddNewHole( this.addHoleBoosterCount ) != null && this.addHoleBoosterCount > 0 )
        {
            console.log( "Add new hole" );
            this.addHoleBoosterCount--;
        }
        else
        {
            console.log( "Can't add new hole" );
        }

    }
    //#region BreakBar
    public BoosterBreakBar (): void
    {
        this.SetState( BoosterState.BreakBar );
        this.isCompleteBreakBar = false;
        MoveScrewHandle.Instance.DisableTouch();
        console.log( "Break bar" );
    }
    private cachedBarCollider: Collider2D[] = [];

    public GetBarState ( event: EventTouch ): void
    {
        console.log( "Get bar state" );
        if ( this.isCompleteBreakBar ) return;
        let camera = MultiScreneController.Instance.getCameraGamePlay();
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
        MoveScrewHandle.Instance.EnableTouch();
        this.SetState( BoosterState.None );
    }

    public async UseHammer (): Promise<void>
    {
        console.log( "Use hammer" );
    }
    //#endregion
}

export enum BoosterState
{
    None = -1,
    AddNewHole = 0,
    BreakBar = 1,
    RemoveScrew = 2,
}




