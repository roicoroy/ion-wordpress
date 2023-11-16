import { AnimationReferenceMetadata, AnimationTriggerMetadata, transition, trigger, useAnimation } from '@angular/animations';

export type NamedAnimation = [string, AnimationReferenceMetadata];

export abstract class AnimationSeries {

    static readonly animations: NamedAnimation[];

    static trigger(ref: string): AnimationTriggerMetadata {

        return trigger(ref, this.animations.map(item => transition(item[0], [useAnimation(item[1])])));
    }
}
