import { _decorator, CCInteger, Component, Node, sp, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { BoxData } from '../../../FakeSO/BoxData';
const { ccclass, property } = _decorator;

@ccclass( 'BoxRenderer' )
export class BoxRenderer extends Component
{
    @property( Sprite )
    private openSprite: Sprite = null

    @property(Sprite)
    public closeSprite: Sprite = null;
    @property( Node )
    public closeBox: Node = null;
    @property( CCInteger )
    public colorType: eColorType = eColorType.Blue;

    @property(sp.Skeleton)
    public skeleton: sp.Skeleton = null!;

    //#region Encapsulated

    public get ColorType (): eColorType
    {
        return this.colorType;
    }

    public set ColorType ( value: eColorType )
    {
        this.colorType = value;
    }
    //#endregion

    protected start (): void
    {

    }

    public SetBoxData ( colorType: eColorType , data : BoxData): void
    {
        this.colorType = colorType;
        this.openSprite.spriteFrame = data.BoxOpenSprite[ this.colorType ];
        this.closeSprite.spriteFrame = data.BoxCloseSprite[ this.colorType ];
    }

}


