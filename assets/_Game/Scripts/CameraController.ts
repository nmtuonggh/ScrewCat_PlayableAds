import { Size } from 'cc';
import { Camera } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Camera)
    public BackGroundCamera: Camera = null;

    public setCameraOthorSize(screenSize : Size): void 
    {
        this.BackGroundCamera.orthoHeight = screenSize.height / 2;
    }
}


