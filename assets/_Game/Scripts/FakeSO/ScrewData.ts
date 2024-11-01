import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrewData')
export class ScrewData extends Component {
    @property(Prefab)
    public ScrewPrefab: Prefab[] = [];
}
