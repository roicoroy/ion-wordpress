import { Form } from "@angular/forms";

export namespace UserProfileActions {
    export class UpdateDarkMode {
        public static readonly type = '[UserProfileActions] Update Dark Mode';
        constructor(public readonly isDarkMode: boolean) { }
    }
    export class UpdateFcmAccepted {
        public static readonly type = '[UserProfileActions] Update Fcm Accepted';
        constructor(public readonly fcmAccepted: boolean) { }
    }
    export class UpdateStrapiUser {
        public static readonly type = '[UserProfileActions] Update Strapi User';
        constructor(public readonly userForm: Form) { }
    }
    export class UploadImage {
        public static readonly type = '[UserProfileActions] Upload Image';
        constructor(public readonly imageForm: FormData) { }
    }
}
