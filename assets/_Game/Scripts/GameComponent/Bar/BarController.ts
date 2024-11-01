import { _decorator, Component, ERigidBody2DType, HingeJoint2D, instantiate, Node, Prefab, RigidBody2D, UITransform, Vec2 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eScrewState, Screw } from '../Screw/Screw';
import { BarPhysic } from './BarPhysic';
const { ccclass, property } = _decorator;

@ccclass( 'BarController' )
export class BarController extends GameLayerComponent
{

    //#region Fields
    @property( Node )
    public listHolePos: Node[] = [];

    @property( Screw )
    public listScrews: Screw[] = [];

    public barPhysic : BarPhysic = null;

    //#endregion

    protected onLoad (): void
    {
        this.barPhysic = this.getComponent( BarPhysic );
    }
    //#region Spawn Screw
    public SpawnScrew ( screwPrefab: Prefab ): void 
    {
        for ( let i = 0; i < this.listHolePos.length; i++ )
        {
            const spawnPos = this.listHolePos[ i ].getWorldPosition();
            const screwNode = instantiate( screwPrefab );
            const screw = screwNode.getComponent( Screw );
            screwNode.setParent( this.node.parent );
            screwNode.setWorldPosition( spawnPos );

            screw.State = eScrewState.IN_BAR;
            this.listScrews.push( screw);
        }
    }

    //#endregion
}


