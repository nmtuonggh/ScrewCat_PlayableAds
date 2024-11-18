import { Camera } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { UICanvasScreen } from './UICanvasScreen';
const { ccclass, property } = _decorator;

@ccclass('CanvasScreenController')
export class CanvasScreenController extends Component {
    @property({type: Camera, group: 'Camera'})
    public cameraBG: Camera = null;
    @property({type: Camera, group: 'Camera'})
    public cameraUI: Camera = null;
    @property({type: Camera, group: 'Camera'})
    public cameraGamePlay: Camera = null;
    @property({type: Camera, group: 'Camera'})
    public cameraParticle: Camera = null;

    @property(UICanvasScreen)
    public uiCanvasScreen: UICanvasScreen = null;

}


