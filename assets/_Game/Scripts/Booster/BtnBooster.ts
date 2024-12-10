import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
import { BoosterType } from './HightlightBooster';
import { Enum } from 'cc';
import { getGameSystem } from '../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'BtnBooster' )
export class BtnBooster extends Component
{
    @property( { type: Enum( BoosterType ) } )
    private boosterType: BoosterType = BoosterType.None;
    @property( Node )
    private addMoreUI: Node = null;
    @property( Node )
    private haveCount: Node = null;
    @property( Label )
    private textCount: Label = null;

    protected start (): void
    {
        this.setCountUI();
    }

    private updateBtn ()
    {
        if ( getGameSystem().BoosterControll.ListBoosterCount[ this.boosterType ] > 0 ) 
        {
            this.addMoreUI.active = false;
            this.haveCount.active = true;
        } else
        {
            this.addMoreUI.active = true;
            this.haveCount.active = false;
        }
    }

    private setCountUI ()
    {
        this.textCount.string = `${ getGameSystem().BoosterControll.ListBoosterCount[ this.boosterType ] }`;
        this.updateBtn();
    }

    public UseBtn ()
    {
        if ( getGameSystem().CahedContainer.isFirstTime4Screw === false ) return;

        this.setCountUI();
        getGameSystem().BoosterControll.BoosterHammer();
        getGameSystem().BoosterControll.ListBoosterCount[ this.boosterType ]--;
    }
}


