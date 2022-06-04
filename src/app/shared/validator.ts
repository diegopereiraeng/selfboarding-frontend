import {
    AbstractControl, 
    NG_VALIDATORS, 
    Validator, 
    ValidatorFn
} from '@angular/forms';
import {Directive} from '@angular/core';

export function blue(): ValidatorFn {  
    return (control: AbstractControl): { [key: string]: any } | null => 
        control.value?.toLowerCase() === 'blue' 
            ? null : {wrongColor: control.value};
}

@Directive({  
    selector: '[blue]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: BlueValidatorDirective,
        multi: true
    }]
})
export class BlueValidatorDirective implements Validator { 
    
    validate(control: AbstractControl): { [key: string]: any } | null { 
        return blue()(control);  
    }
}