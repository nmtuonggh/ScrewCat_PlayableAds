import { _decorator, Component, Node, Skeleton, sp, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MeowAnimation')
export class MeowAnimation extends Component {
    @property(sp.Skeleton)
    public skeleton: sp.Skeleton = null!;

    private static _instance: MeowAnimation = null;

    public static get Instance (): MeowAnimation
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( MeowAnimation._instance === null )
        {
            MeowAnimation._instance = this;
        }
    }

    public MoveIn() : void {
        this.skeleton.setAnimation(0, 'Appear', false);
    }

    public MoveOut() : void {
        this.skeleton.setAnimation(0, 'Appear2', true);
    }
}


