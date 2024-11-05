import { _decorator, Component, ERigidBody2DType, HingeJoint2D, instantiate, Node, Prefab, RigidBody2D, UITransform, Vec2 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eScrewState, Screw } from '../Screw/Screw';
import { BarPhysic } from './BarPhysic';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { ScrewData } from '../../FakeSO/ScrewData';
import { StarController } from '../../Star/StarController';
import { GameManager } from '../../Manager/GameManager';
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

    protected update ( dt: number ): void
    {
        if(this.node.position.y < -2000)
        {
            this.node.destroy();
        }
    }
    //#region Spawn Screw
    public SpawnScrew ( screwData : ScrewData ): void 
    {
        for ( let i = 0; i < this.listHolePos.length; i++ )
        {
            const randomIndex = Math.floor(Math.random() * 9);
            
            const spawnPos = this.listHolePos[ i ].getWorldPosition();
            const screwNode = instantiate( screwData.ScrewPrefab );
            const screw = screwNode.getComponent( Screw );

            screwNode.setParent( this.node.parent );
            screwNode.setWorldPosition( spawnPos );

            screw.InitSCrewData( randomIndex , screwData );
            this.listScrews.push( screw);
           
            GameManager.Instance.TotalScrew += 1;
        }
    }

    //#endregion
}


