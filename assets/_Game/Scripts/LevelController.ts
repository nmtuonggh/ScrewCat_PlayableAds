import { _decorator, Component, Node, Prefab } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
const { ccclass, property } = _decorator;

@ccclass( 'LevelController' )
export class LevelManager extends Component
{
    @property( Node )
    private Holder: Node = null;

    @property( BarController )
    private listBar: BarController[] = [];

    @property(Prefab)
    private screwPrefab: Prefab = null;

    protected onLoad (): void
    {
        this.listBar = this.Holder.getComponentsInChildren( BarController );
    }

    protected start (): void
    {
        this.InitScrew();
    }

    private InitScrew (): void 
    {
        this.listBar.forEach( bar => 
        {
            bar.SpawnScrew( this.screwPrefab );
            bar.barPhysic.CreatHGJoint();
            bar.barPhysic.EnableHGJoin();
        } );
    }
}


