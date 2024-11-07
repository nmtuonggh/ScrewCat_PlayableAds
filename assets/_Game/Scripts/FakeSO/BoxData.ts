import { _decorator, Component, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoxData')
export class BoxData extends Component {
    @property(Prefab)
    public boxPrefab: Prefab[] = [];

    @property(SpriteFrame)
    public BoxOpenSprite: SpriteFrame[] = [];

    @property(SpriteFrame)
    public BoxCloseSprite: SpriteFrame[] = [];
}


