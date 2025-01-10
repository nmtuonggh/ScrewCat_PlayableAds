import { ITriggerEvent } from 'cc';
import { Contact2DType } from 'cc';
import { IPhysics2DContact } from 'cc';
import { RigidBody2D } from 'cc';
import { EPhysics2DDrawFlags } from 'cc';
import { ParticleSystem } from 'cc';
import { HingeJoint2D } from 'cc';
import { Vec3 } from 'cc';
import { Prefab } from 'cc';
import { PhysicsSystem2D } from 'cc';
import { Collider2D } from 'cc';
import { PolygonCollider2D } from 'cc';
import { BoxCollider2D } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { getGameSystem } from '../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'DrillComponent' )
export class DrillComponent extends Component
{
    @property( Node )
    private glassBreakPrefab: Node = null;

    onLoad ()
    {
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;
        const collider = this.getComponent( BoxCollider2D );
        if ( collider )
        {
            collider.on( Contact2DType.BEGIN_CONTACT, this.onBeginContact, this );
        }
    }

    onBeginContact ( selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null )
    {
        if ( otherCollider && otherCollider.node && otherCollider.node.name !== "Bar_17" )
        {
            const worldManifold = contact.getWorldManifold();
            const points = worldManifold.points;
            const rigidBody = otherCollider.getComponent( RigidBody2D );
            let node = otherCollider.node;
            if ( rigidBody )
            {
                this.scheduleOnce( () =>
                {
                    try
                    {
                        this.playGlassBreakEffect2( new Vec3( points[ 0 ].x, points[ 0 ].y, 0 ) );
                        rigidBody.enabled = false; // Vô hiệu hóa RigidBody2D trước khi destroy node
                        otherCollider.node.destroy();
                    }
                    catch ( e )
                    {
                        console.log( e );
                        debugger;
                    }

                }, 0 );
            } else
            {
                this.playGlassBreakEffect2( new Vec3( points[ 0 ].x, points[ 0 ].y, 0 ) );
                otherCollider.node.destroy();
            }
        }
    }

    playGlassBreakEffect ( node: Node )
    {
        this.glassBreakPrefab.setWorldPosition( node.getWorldPosition() );
        this.glassBreakPrefab.getComponent( ParticleSystem ).stop();
        this.glassBreakPrefab.getComponent( ParticleSystem ).play();
    }
    playGlassBreakEffect2 ( vec3: Vec3 )
    {
        getGameSystem().AudioController.playBreakBar();
        this.glassBreakPrefab.setWorldPosition( vec3 );
        this.glassBreakPrefab.getComponent( ParticleSystem ).stop();
        this.glassBreakPrefab.getComponent( ParticleSystem ).play();
    }
}


