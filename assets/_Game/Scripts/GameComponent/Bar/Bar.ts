import { _decorator, Component, HingeJoint2D, Node, Vec2 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { Screw } from '../Screw/Screw';
const { ccclass, property } = _decorator;

@ccclass('Bar')
export class Bar extends GameLayerComponent {
    @property(Screw)
    private screws: Screw[] = [];

    protected start(): void {
        for (let i = 0; i < this.screws.length; i++) 
        {
            const screwPos = this.screws[i].node.getWorldPosition(this.screws[i].node.position);
            const pos = this.screws[i].node.position;
            console.log("Screw position: ", pos);
            this.CreatHGJoint(new Vec2(screwPos.x, screwPos.y));
        }
    }

    private CreatHGJoint(pos : Vec2): void {
        const hgJoint = this.node.addComponent(HingeJoint2D);
        const anchor = this.node.getWorldPosition(this.node.position);
        //const anchor = this.node.position;
        
        hgJoint.connectedBody = null;
        hgJoint.connectedAnchor = new Vec2(anchor.x, anchor.y);
        hgJoint.anchor = new Vec2(anchor.x, anchor.y);
    }
}


