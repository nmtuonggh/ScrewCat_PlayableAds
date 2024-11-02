import { _decorator, Component, Node, Skeleton, sp, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MeowAnimation')
export class MeowAnimation extends Component {
    @property(sp.Skeleton)
    public skeleton: sp.Skeleton = null!;

    private static _instance: MeowAnimation = null;

    public static get Instance (): MeowAnimation
    {
        if ( this._instance === null )
        {
            this._instance = new MeowAnimation();
        }
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( MeowAnimation._instance === null )
        {
            MeowAnimation._instance = this;
        }
    }

    public MoveIn(boxNode: Node) : void {
        this.skeleton.setAnimation(0, 'Appear', false);
        this.skeleton.timeScale = 1.5;
        const pos = boxNode.getPosition();
        this.node.position = new Vec3(pos.x + 20, 200, 0);
        console.log('pos', pos);
        tween(this.node)
        .to(0.4, { position: new Vec3(pos.x + 20, -40, 0) })
        // .call(() => {
        //     this.MoveOut();
        // })
        .start();
    }

    public MoveOut() : void {
        this.skeleton.setAnimation(0, 'Appear2', true);
        tween(this.node)
        .to(0.4, { position: this.node.position.add3f(0, 240, 0) })
        .start();
    }
}


