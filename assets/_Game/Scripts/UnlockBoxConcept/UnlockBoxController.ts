import { _decorator, Component, Node } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { BoxContainer } from '../Controller/BoxContainer';
const { ccclass, property } = _decorator;

@ccclass( 'UnlockBoxController' )
export class UnlockBoxController extends Component 
{
    @property( Node )
    public boxContainer: Node = null;

    public boxSlot: BoxSlot[] = [];

    @property( [BoxSlot] )
    public lockBoxSlot: BoxSlot[] = [];

    @property( BoxSlot )
    currentLockBoxSlot: BoxSlot = null;


    private static _instance: UnlockBoxController = null;

    public static get Instance (): UnlockBoxController
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( UnlockBoxController._instance === null )
        {
            UnlockBoxController._instance = this;
        }
    }

    protected start (): void
    {
        this.boxSlot = this.boxContainer.getComponentsInChildren( BoxSlot );
        for ( const slot of this.boxSlot )
        {
            if ( slot.isAds )
            {
                this.lockBoxSlot.push( slot );
            }
        }
        this.SetCurrentBlockBox();
    }

    public AddLockCount (): void
    {
        this.currentLockBoxSlot.currentCount += 1;
        this.currentLockBoxSlot.lockText.string = this.currentLockBoxSlot.currentCount + "/" + this.currentLockBoxSlot.lockCount;

        if ( this.currentLockBoxSlot.currentCount >= this.currentLockBoxSlot.lockCount )
        {
            this.currentLockBoxSlot.isAds = false;
            this.currentLockBoxSlot.lockText.node.active = false;
            this.currentLockBoxSlot.boxAdsPrefab.active = false;
            this.lockBoxSlot.shift();
            this.SetCurrentBlockBox();
        }
    }

    public SetCurrentBlockBox (): void
    {
        if ( this.lockBoxSlot.length === 0 ) return;
        this.currentLockBoxSlot = this.lockBoxSlot[0];
    }
}


