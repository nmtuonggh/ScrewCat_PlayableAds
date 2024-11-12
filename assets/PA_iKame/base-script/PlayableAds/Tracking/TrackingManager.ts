import { _decorator, Component, director, Node, screen } from 'cc';
const { ccclass, property } = _decorator;
import { sys } from "cc"; 
import { PlayableAdsManager } from '../PlayableAdsManager';
import { ACTION_NAME, ACTION_TYPE, OBJECT, OPERATING_SYSTEM, RESULT, USER_RETURN } from './Tracker/Output/DefineEventStruct';
import { GameEvent } from '../GameEvent';
import { EventListener } from '../EventListener';

@ccclass('TrackingManager')
export class TrackingManager extends Component {
    static userPseudoID : string = "";

    static api_secret : string = `ymcwxS12SSi6IavS3-Jj-Q`;
    static firebase_app_id : string= `1:444377725360:android:b0bef9148a16a69aa27e75`;
    static package_name : string = `com.ig.screw.cat`;
    static os : OPERATING_SYSTEM = OPERATING_SYSTEM.NONE;

    static returnGame : USER_RETURN = USER_RETURN._false;

    protected onLoad(): void {
        TrackingManager.userPseudoID = this.generateUniqueString();
        TrackingManager.SetOS();
    }
    static SetOS(){
        switch (sys.os) {
            case sys.OS.ANDROID:
                this.os  = OPERATING_SYSTEM.ANDROID;
                break;
            case sys.OS.IOS:
                this.os  = OPERATING_SYSTEM.IOS;
                break;
            case sys.OS.WINDOWS:
                this.os  = OPERATING_SYSTEM.NONE;
                break;
        }
    }

    //#region LISTEN EVENT
    static gameStart(){
        this.LogEvent(ACTION_NAME._start);
    }

    static FirstClick(){
        this.LogEvent(ACTION_NAME._first_click);
    }

    static UserEngagement(time : number){
        var fps = director.root.fps;
        this.LogEvent_Time(
            time.toFixed(2).toString(),
            fps.toString());
    }

    static WinLevel(){
        this.LogEvent_Result(RESULT._win);
    }

    static LoseLevel(){
        this.LogEvent_Result(RESULT._lose);
    }

    static ClickConversion(){
        this.LogEvent_Button(ACTION_NAME._click_conversion);
        this.returnGame = USER_RETURN._true;
    }

    static ForceConversion(){
        TrackingManager.LogEvent_Button(ACTION_NAME._force_conversion);
        this.returnGame = USER_RETURN._true;
    }
    
    //#endregion


    //#region LOG EVENT
    generateUniqueString(): string {
        const characters = 'abcdef0123456789';
        let randomStr = '';
        const charactersLength = characters.length;
        const currentTime = new Date().getTime();
        const timeString = currentTime.toString(16);
        const timeStringLength = timeString.length;
        for (let i = 0; i < 32 - timeStringLength; i++) 
        {
            randomStr += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return timeString + randomStr;
    }
    static LogEvent(
        action_name : ACTION_NAME, 
        action_type : ACTION_TYPE = ACTION_TYPE._start,
        object : OBJECT = OBJECT._level_status)
        {
        var jsonInput = JSON.stringify({
            app_instance_id: this.userPseudoID,
            events: [{
                name: 'playable_level',
                params: {
                    "action_type": ACTION_TYPE[action_type], // "start", "action", "end"
                    "action_name": ACTION_NAME[action_name],
                    "user_return": USER_RETURN[this.returnGame],
                    "object": OBJECT[object],
                    "screen": "_level_1",
                    "package_name": this.package_name,
                    "operating_system": OPERATING_SYSTEM[this.os],
                    "playable_ad_id": PlayableAdsManager.Instance().playableAdsName,
                },
            }]
        });
        this.PostEvent(jsonInput);
    }
    static LogEvent_Click(
        action_type : ACTION_TYPE, 
        action_name : ACTION_NAME, 
        position_name: string,
        positionX : string, 
        positionY : string, 
        user_return : USER_RETURN,
        object : OBJECT)
        {

        var jsonInput = JSON.stringify({
            app_instance_id: this.userPseudoID,
            events: [{
                name: 'playable_level',
                params: {
                    "action_type": ACTION_TYPE[action_type], // "start", "action", "end"
                    "action_name": ACTION_NAME[action_name],
                    "position_name": position_name,
                    "positionX": positionX,
                    "positionY": positionY,
                    "screen": "_level_1",
                    "user_return": USER_RETURN[this.returnGame],
                    "object": OBJECT[object],
                    "package_name": this.package_name,
                    "operating_system": OPERATING_SYSTEM[this.os],
                    "playable_ad_id": PlayableAdsManager.Instance().playableAdsName,
                },
            }]
        });
        this.PostEvent(jsonInput);
    }
    static LogEvent_Result(
        result : RESULT,
        action_type : ACTION_TYPE = ACTION_TYPE._end, 
        action_name : ACTION_NAME = ACTION_NAME._finish,
        object : OBJECT = OBJECT._level_status)
        {
        var jsonInput = JSON.stringify({
            app_instance_id: this.userPseudoID,
            events: [{
                name: 'playable_level',
                params: {
                    "action_type": ACTION_TYPE[action_type], // "start", "action", "end"
                    "action_name": ACTION_NAME[action_name],
                    "user_return": USER_RETURN[this.returnGame],
                    "result": RESULT[result],
                    "object": OBJECT[object],
                    "screen": "_level_1",
                    "package_name": this.package_name,
                    "operating_system": OPERATING_SYSTEM[this.os],
                    "playable_ad_id": PlayableAdsManager.Instance().playableAdsName,
                },
            }]
        });
        this.PostEvent(jsonInput);
    }
    static LogEvent_Button(
        action_name : ACTION_NAME,
        action_type : ACTION_TYPE = ACTION_TYPE._action,    
        object : OBJECT = OBJECT._conversion)
        {
        var jsonInput = JSON.stringify({
            app_instance_id: this.userPseudoID,
            events: [{
                name: 'playable_level',
                params: {
                    "action_type": ACTION_TYPE[action_type], // "start", "action", "end"
                    "action_name": ACTION_NAME[action_name],
                    "user_return": USER_RETURN[this.returnGame],
                    "object": OBJECT[object],
                    "screen": "_level_1",
                    "package_name": this.package_name,
                    "operating_system": OPERATING_SYSTEM[this.os],
                    "playable_ad_id": PlayableAdsManager.Instance().playableAdsName,
                },
            }]
        });
        this.PostEvent(jsonInput);
    }
    static LogEvent_Time(
        engagement_time : string,
        fps : string,
        action_type : ACTION_TYPE = ACTION_TYPE._action, 
        action_name : ACTION_NAME = ACTION_NAME._users_engagement, 
        object : OBJECT = OBJECT._users_engagement)
        {
        var jsonInput = JSON.stringify({
            app_instance_id: this.userPseudoID,
            events: [{
                name: 'playable_level',
                params: {
                    "action_type": ACTION_TYPE[action_type], // "start", "action", "end"
                    "action_name": ACTION_NAME[action_name],
                    "engagement_time": engagement_time,
                    "fps": fps,
                    "object": OBJECT[object],
                    "screen": "_level_1",
                    "package_name": this.package_name,
                    "operating_system": OPERATING_SYSTEM[this.os],
                    "playable_ad_id": PlayableAdsManager.Instance().playableAdsName,
                },
            }]
        });
        this.PostEvent(jsonInput);
    }
    static PostEvent(jsonInput : string){
        if(PlayableAdsManager.Instance().logDebug){
            var splitJsonInput = jsonInput.split(",");
            var result = "";
            for (let i = 0; i < splitJsonInput.length; i++) {
                result += splitJsonInput[i] + "\n";
            }
            console.log(result);
        }
        if(sys.os == sys.OS.WINDOWS || !PlayableAdsManager.Instance().activeTracking) return;
        fetch(`https://www.google-analytics.com/mp/collect?firebase_app_id=${this.firebase_app_id}&api_secret=${this.api_secret}`, {
            method: "POST",
            body: jsonInput
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
    }
    //#endregion
}
