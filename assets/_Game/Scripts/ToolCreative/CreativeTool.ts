import { LabelAtlas } from 'cc';
import { systemEvent } from 'cc';
import { KeyCode } from 'cc';
import { SystemEvent } from 'cc';
import { Label } from 'cc';
import { EventMouse } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'CreativeTool' )
export class CreativeTool extends Component
{
    @property( Node )
    starNode: Node = null;
    @property( Node )
    toolUI: Node = null;
    @property( Label )
    text: Label = null;

    @property( Node )
    tutorialNode: Node = null;
    @property( Node )  
    bgMusic: Node = null;
    @property( [ Node ] )
    tapToPlay: Node[] = [];

    private isCreativeMode: boolean = false;
    onLoad() {
        this.starNode.on(Node.EventType.MOUSE_DOWN, this.onStarNodeClick, this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        this.starNode.off(Node.EventType.MOUSE_DOWN, this.onStarNodeClick, this);
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.keyCode === KeyCode.SPACE) {
            this.toolUI.active = !this.toolUI.active;
        }
    }

    public creativeMode ()
    {
        this.isCreativeMode = !this.isCreativeMode;
        this.text.string = this.isCreativeMode ? "LyLy Mode" : "Normal Mode";
        if ( this.isCreativeMode )
        {
            this.tutorialNode.active = false;
            this.bgMusic.active = false;
            this.tapToPlay.forEach( element =>
            {
                element.active = false;
            } );
        }
        else
        {
            this.tutorialNode.active = true;
            this.bgMusic.active = true;
            this.tapToPlay.forEach( element =>
            {
                element.active = true;
            } );
        }
    }

    public closeCreativeMode ()
    {
        this.toolUI.active = false;
    }

    //#region Click Logic
    private clickCount: number = 0;
    private clickTimeout: number = 2; // Thời gian chờ giữa các lần nhấp (giây)
    private clickTimer: ReturnType<typeof setTimeout> = null;

    private onStarNodeClick ( event: EventMouse )
    {
        this.clickCount++;
        console.log( "Click Count: ", this.clickCount );
        if ( this.clickCount === 1 )
        {
            this.resetClickTimer();
        }

        if ( this.clickCount >= 10 )
        {
            this.toolUI.active = true;
            console.log( "Creative Mode" );
            this.resetClickCount();
        }
    }

    private resetClickTimer ()
    {
        if ( this.clickTimer )
        {
            clearTimeout( this.clickTimer );
        }

        this.clickTimer = setTimeout( () =>
        {
            this.resetClickCount();
        }, this.clickTimeout * 1000 );
    }

    private resetClickCount ()
    {
        this.clickCount = 0;
        if ( this.clickTimer )
        {
            clearTimeout( this.clickTimer );
            this.clickTimer = null;
        }
    }
    //#endregion
}


