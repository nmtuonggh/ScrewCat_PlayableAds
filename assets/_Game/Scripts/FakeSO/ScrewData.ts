import { _decorator, Component, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrewData')
export class ScrewData extends Component {
    @property(Prefab)
    public ScrewPrefab: Prefab = null;

    @property(SpriteFrame)
    public ScrewTopSprite: SpriteFrame[] = [];
}
