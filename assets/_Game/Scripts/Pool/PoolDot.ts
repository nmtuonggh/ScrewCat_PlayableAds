import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolDot')
export class PoolDot extends Component {
    @property( Prefab )
    public DotPrefabs: Prefab = null;
    @property( Node )
    public poolParent: Node = null;
    @property (Node)
    public touchParent: Node = null;
    // Create a pool for touch prefabs
    private _poolTouch: Node[] = [];


    // Initialize the pool with a specified number of prefabs
    public initializePool ( size: number ): void
    {
        for ( let i = 0; i < size; i++ )
        {
            const node = instantiate( this.DotPrefabs );
            node.parent = this.poolParent;
            this._poolTouch.push( node );
        }
    }

    // Get a prefab from the pool
    public getFromPool (): Node
    {
        let node = null;
        if ( this._poolTouch.length > 0 )
        {
            node = this._poolTouch.pop();
            node.parent = this.touchParent;
            return node;
        }
        else
        {
            node = instantiate( this.DotPrefabs );
            node.parent = this.touchParent;
            return node;
        }
    }

    // Return a prefab to the pool
    public returnToPool ( node: Node ): void
    {
        node.parent = this.poolParent;
        node.setPosition( 0, 0, 0 );
        this._poolTouch.push( node );
    }
}


