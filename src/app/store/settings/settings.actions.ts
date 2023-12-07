import { Form } from "@angular/forms";
import { Token } from "@capacitor/push-notifications";

export namespace UserProfileActions {
    export class UpdateDarkMode {
        public static readonly type = '[UserProfileActions] Update Dark Mode';
        constructor(public readonly isDarkMode: boolean) { }
    }
    export class UpdateFcmAccepted {
        public static readonly type = '[UserProfileActions] Update Fcm Accepted';
        constructor(public readonly fcmAccepted: boolean, public readonly channel?: string) { }
    }
    export class SetFcmToken {
        public static readonly type = '[UserProfileActions] Set Fcm Token';
        constructor(public readonly fcmToken: Token) { }
    }
}
