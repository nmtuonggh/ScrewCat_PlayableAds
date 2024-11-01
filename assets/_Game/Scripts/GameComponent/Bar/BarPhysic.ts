import { _decorator, Component, debug, HingeJoint2D, Node, RigidBody2D, Vec2 } from 'cc';
import { BarController } from './BarController';
const { ccclass, property } = _decorator;

@ccclass('BarPhysic')
export class BarPhysic extends Component {
    private rb: RigidBody2D = null;

    private barController : BarController = null;

    protected onLoad (): void
    {
        this.rb = this.getComponent( RigidBody2D );
        this.barController = this.getComponent( BarController );
        //this.SetGroupLayer();
    }

    //#region Hinge Joint

    public CreatHGJoint (): void
    {
        for ( let i = 0; i < this.barController.listScrews.length; i++ ) 
        {
            const screw = this.barController.listScrews[ i ];
            const localPos = this.barController.listHolePos[ i ].getPosition();
            const screwRb = screw.node.getComponent( RigidBody2D );
            screw.hingeJoint = this.SetHGJoint( new Vec2( localPos.x, localPos.y ), screwRb );
        }
    }

    private SetHGJoint ( pos: Vec2, screwRb: RigidBody2D ): HingeJoint2D
    {
        const hgJoint = this.node.addComponent( HingeJoint2D );
        hgJoint.connectedBody = screwRb;
        hgJoint.anchor = pos;
        hgJoint.enabled = false;
        return hgJoint;
    }

    public EnableHGJoin (): void
    {
        for ( let i = 0; i < this.barController.listScrews.length; i++ ) 
        {
            this.barController.listScrews[ i ].hingeJoint.enabled = true;
        }
    }

    //#endregion

    SetGroupLayer() : void
    {
        this.rb.group = 1 << this.barController.Layer +13;
    }
}


