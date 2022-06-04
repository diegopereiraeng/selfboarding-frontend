import { Event } from '@harnessio/ff-javascript-client-sdk'

export class FFClient {
    event?: Event;
    callback?: any;

    public constructor(event?: Event, callback?: any) {
        if (event !== undefined) {
            this.event = event;
        }
        if (callback !== undefined) {
            this.callback = callback;
        }
    }
}
