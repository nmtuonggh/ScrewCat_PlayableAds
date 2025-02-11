import { _decorator, Collider2D, HingeJoint2D, instantiate, Node, PhysicsSystem2D, Prefab, random, Rect, Tween, tween, Vec2, Vec3 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { Hole } from '../Hole/Hole';
import { GameConfig } from '../../GameConfig/GameConfig';
import { GameLayerMaskConfig } from '../../GameConfig/GameLayerMaskConfig';
import { ScrewRenderer } from './ScrewRenderer';
import { ScrewAnim } from './ScrewAnim';
import { AudioType } from '../../AudioController/AudioController';
import { BarController } from '../Bar/BarController';
import { RigidBody2D } from 'cc';
import { ERigidBody2DType } from 'cc';
import { getGameSystem } from '../../GameSystem';
import { ParticleSystem } from 'cc';


const { ccclass, property } = _decorator;

@ccclass( 'Screw' )
export class Screw extends GameLayerComponent
{
    //#region EDITOR EXPOSED FIELD
    @property( [ HingeJoint2D ] )
    private hingeJoint: HingeJoint2D[] = [];
    //@property( ScrewRenderer )
    private screwRenderer: ScrewRenderer = null;
    //#endregion

    private screwAnimation: ScrewAnim = null;
    private linkingHole: Hole = null;

    public State: eScrewState = eScrewState.IN_BAR;
    //#region PROPERTIES
    public get ScrewRenderer (): ScrewRenderer
    {
        return this.screwRenderer;
    }
    public set ScrewRenderer ( value: ScrewRenderer )
    {
        this.screwRenderer = value
    }
    public get HingeJoint (): HingeJoint2D[]
    {
        return this.hingeJoint;
    }
    public set HingeJoint ( value: HingeJoint2D[] )
    {
        this.hingeJoint = value
    }
    public get ScrewAnimation (): ScrewAnim
    {
        return this.screwAnimation;
    }
    public set ScrewAnimation ( value: ScrewAnim )
    {
        this.screwAnimation = value;
    }
    //#endregion

    protected onLoad (): void
    {
        this.screwRenderer = this.getComponent( ScrewRenderer );
        this.screwAnimation = this.getComponent( ScrewAnim );
        this.HingeJoint = this.hingeJoint;
    }
    //#region PRIVATE METHOD
    private freeJoints (): void 
    {
        this.hingeJoint.forEach( hg =>
        {
            hg.enabled = false;
        } );
        this.hingeJoint.forEach( hg =>
        {
            if ( hg.node.getComponent( RigidBody2D ).type = ERigidBody2DType.Kinematic )
            {
                hg.node.getComponent( RigidBody2D ).type = ERigidBody2DType.Dynamic;
            }
        } );
    }
    private CheckMoveCache (): boolean
    {
        let freeHole = getGameSystem().CahedContainer.GetFreeHole();
        if ( freeHole !== null )
        {
            this.moveToCacheSlot( freeHole );
            return true;
        }

        return false;
    }

    private cachedBarLayer: Collider2D[] = [];
    //#region Blocked

    public IsBlocked (): boolean
    {
        this.cachedBarLayer = [];

        const barLayer = GameLayerMaskConfig.BAR_LAYER_MASK;
        const screwPosition = this.node.getWorldPosition();

        const screwPosition2D = new Vec2( screwPosition.x, screwPosition.y );
        const radius = GameConfig.SCREW_RADIUS;

        const points = [];
        for ( let i = 0; i < 8; i++ )
        {
            const angle = ( i * Math.PI ) / 4; // 45 degrees in radians
            const x = screwPosition2D.x + radius * Math.cos( angle );
            const y = screwPosition2D.y + radius * Math.sin( angle );
            points.push( new Vec2( x, y ) );
        }

        const cachedColliders = [];
        for ( const point of points )
        {
            const colliders = PhysicsSystem2D.instance.testPoint( point );
            cachedColliders.push( ...colliders );
        }

        // Loại bỏ các phần tử trùng lặp
        const cachedCollider = Array.from( new Set( cachedColliders ) );

        if ( cachedCollider.length === 0 ) return false;

        for ( let i = 0; i < cachedCollider.length; i++ )
        {
            //neu cung layer voi BAR_LAYER
            if ( cachedCollider[ i ].node.layer === barLayer )
            {
                this.cachedBarLayer.push( cachedCollider[ i ] );
            }
        }

        for ( let i = 0; i < this.cachedBarLayer.length; i++ )
        {
            let bar = this.cachedBarLayer[ i ].node.getComponent( BarController );
            if ( bar !== null )
            {
                if ( bar.Layer > this.Layer )
                {
                    //console.log( "Is blocked" + bar.node.name );
                    return true;
                }
            }
        }

        return false;
    }

    private BlockedTween (): void
    {
        const axis = Math.floor( Math.random() * 4 );
        this.screwAnimation.ScrewBlock( axis );
    }

    //#endregion
    //#region MoveToBoxSlot
    private MoveToBoxSlot ( hole: Hole ): void 
    {
        hole.isLinked = true;
        hole.linkingScrew = null;
        this.linkingHole = hole;
        hole.Box.checkGonnaMove();
        this.screwAnimation.ScrewOut();
        this.tweenMoveToBox( this.node, hole, GameConfig.SCREW_OUT_DURATION ).start();
    }

    private tweenMoveToBox ( node: Node, hole: Hole, delayTime: number ): Tween<Node>
    {
        return tween( node )
            .delay( delayTime )
            .to( GameConfig.SCREW_MOVE_DURATION, { worldPosition: this.linkingHole.node.worldPosition }, { easing: 'sineInOut' } )
            .call( () =>
            {
                //play fx
                getGameSystem().AudioController.playAudio( AudioType.screwIn );
                var vfxs = hole.VFX.getComponentsInChildren( ParticleSystem );
                for ( let i = 0; i < vfxs.length; i++ )
                {
                    vfxs[ i ].stop();
                    vfxs[ i ].play();
                }
                //set child and world position screw to hole
                const worldPosition = this.node.worldPosition;
                this.node.parent = this.linkingHole.node;
                this.node.worldPosition = worldPosition;
                //set state and value
                this.State = eScrewState.IN_BOX;
                hole.Box.checkCloseBox();
                this.screwAnimation.ScrewIn();
            } );
    }
    //#endregion
    //#region MoveToCacheSlot

    private moveToCacheSlot ( hole: Hole ): void
    {
        hole.isLinked = true;
        this.linkingHole = hole;
        hole.linkingScrew = this;
        this.screwAnimation.ScrewOut();
        //getGameSystem().GameManager.checkLose();
        this.tweenMoveCached( this.node, GameConfig.SCREW_IN_DURATION ).start();
    }

    private tweenMoveCached ( node: Node, delayTime: number ): Tween<Node>
    {
        let iqNode;
        return tween( node )
            .delay( delayTime )
            .to( GameConfig.SCREW_MOVE_DURATION, { worldPosition: this.linkingHole.node.worldPosition }, { easing: 'sineInOut' } )
            .call( () =>
            {
                getGameSystem().AudioController.playAudio( AudioType.screwIn );
                const worldPosition = this.node.worldPosition;
                this.node.parent = this.linkingHole.node;
                this.node.worldPosition = worldPosition;
                this.State = eScrewState.IN_CACHED;
                this.screwAnimation.ScrewIn();
                getGameSystem().CahedContainer.CheckMoveScrewFromCachedToBox();
                getGameSystem().CahedContainer.CheckWarning();
                getGameSystem().GameManager.checkLose();
                if ( getGameSystem().TestIQController )
                {
                    iqNode = getGameSystem().TestIQController.spawnIQ( this.node, false );
                    this.scheduleOnce( () =>
                    {
                        if ( getGameSystem().TestIQController )
                        {
                            getGameSystem().TestIQController.moveIQ( iqNode, -5 );
                        }
                    }, 0.2 );
                }
            } );
    }

    //#endregion
    //#endregion

    //#region PUBLIC METHOD
    //#region CheckMove
    public checkMove (): void
    {
        if ( getGameSystem().GameManager.lose ) return;
        if ( this.State === eScrewState.MOVING )
        {
            return;
        }

        if ( this.State === eScrewState.IN_BAR && this.IsBlocked() )
        {
            this.BlockedTween();
            getGameSystem().AudioController.playBlock();
            getGameSystem().RealTimeTutorial.updateTutorial();
            return;
        }


        switch ( this.State )
        {
            case eScrewState.IN_BAR:
                let moveSuccess: boolean = false;

                if ( this.checkMoveBox() )
                {
                    this.State = eScrewState.MOVING;
                    moveSuccess = true;
                    getGameSystem().AudioController.playAudio( AudioType.screwOut );
                    this.node.setScale( new Vec3( 1, 1, 1 ) );

                }
                else if ( this.CheckMoveCache() )
                {
                    this.State = eScrewState.MOVING;
                    moveSuccess = true;
                    getGameSystem().AudioController.playAudio( AudioType.screwOut );
                    getGameSystem().CahedContainer.CurrentScrewCount++;
                    this.node.setScale( new Vec3( 1, 1, 1 ) );
                }

                if ( moveSuccess === true )
                {
                    this.freeJoints();
                    //getGameSystem().MoveScrewHandle.pointSpawnTouchEffect( getGameSystem().MoveScrewHandle._lastMousePosition );
                    getGameSystem().LevelController.removeScrewInLayer( this );
                    getGameSystem().GameManager.CurrentScrew--;
                    getGameSystem().RealTimeTutorial.updateTutorial();
                }

                break;

            case eScrewState.IN_CACHED:
                if ( this.checkMoveBox() )
                {
                    getGameSystem().AudioController.playAudio( AudioType.screwOut );
                }
                break;
            case eScrewState.IN_BOX:
                break;
        }

    }

    public checkMoveBox (): boolean
    {
        //let freeBox = this.GameLogic.GetFreeHoleBox( this.screwRenderer.ColorType );

        let freeBox = getGameSystem().BoxContainer.GetFreeBoxSlot( this.screwRenderer.colorType );

        if ( freeBox !== null )
        {
            this.MoveToBoxSlot( freeBox );
            return true;
        }

        return false;
    }
    //#endregion
    public hide (): void
    {
        this.screwRenderer.hideScrew();
        this.State = eScrewState.IS_HIDING;
    }

    public show (): void
    {
        try
        {
            this.screwRenderer.showScrew();
        }
        catch
        {
            debugger;
        }
        this.State = eScrewState.IN_BAR;
    }
    public enableHgJoint (): void
    {
        this.hingeJoint.forEach( hg => hg.enabled = true );
    }
    //#endregion
}

export enum eScrewState
{
    IN_BAR = 0,
    IN_CACHED = 1,
    IN_BOX = 2,
    IS_HIDING = 3,
    MOVING = 999
}




