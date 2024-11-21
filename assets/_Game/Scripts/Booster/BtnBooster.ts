import { Label } from 'cc';
import { CCInteger } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
const { ccclass, property } = _decorator;

@ccclass( 'BtnBooster' )
export class BtnBooster extends Component
{
    @property( Node )
    private cong: Node = null;
    @property( Node )
    private haveCount: Node = null;
    @property(Label)
    private textCount: Label = null;
    @property( CCInteger )
    public count: number = 0;

    protected start (): void
    {
        this.setCount();
    }
    
    public updateBtn ()
    {
        if ( this.count > 0 )
        {
            this.cong.active = false;
            this.haveCount.active = true;
        } else
        {
            this.cong.active = true;
            this.haveCount.active = false;
        }
    }

    public setCount ()
    {
        this.textCount.string = `${ this.count }`;
        this.updateBtn();
    }

    public UseBtn()
    {
        if(CahedContainer.Instance.isFirstTime4Screw === false) return;
        this.count--;
        this.setCount();
    }
}


