import { AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";

import { ICellEditorAngularComp } from "ag-grid-angular";


@Component({
    selector: 'numeric-cell',
    template: `<input #input (keypress)="onKeyDown($event)" requiured  [(ngModel)]='value' style="width: 100%">`
})
export class IntineraryEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: any;
    private cancelBeforeStart: boolean = false;

    @ViewChild('input', { read: ViewContainerRef }) public input;


    agInit(params: any): void {
        this.params = params;

        this.value = this.params.value;

        // only start edit if key pressed is a number, not a letter
        this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
        return this.value > 1000000;
    };

    onKeyDown(event) {

        let keyCode = event.keyCode;
        let val = event.target.value;
        if (keyCode != 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57))
            return false;

        var succ =
            val.match(/^([0-9]*)$/) != null ||
            val.match(/^([0-9]*\.)[0-9]{0,12}$/) != null;
        return succ;
    };
    // if (!this.isKeyPressedNumeric(event) || !this.validateAmount(event)) {
    //     if (event.preventDefault) event.preventDefault();
    // }



    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr): boolean {
      
        var succ =
            charStr.match(/^([0-9]*)$/) != null ||
            charStr.match(/^([0-9]*\.)[0-9]{0,13}$/) != null;
        return succ;
        // return !!/^([0-9]*\.)[0-9]{0,13}$/.test(charStr);
    }

    private isKeyPressedNumeric(event): boolean {
     
        const charCode = this.getCharCodeFromEvent(event);

        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        if (charStr == 'Backspace')
            return true
        else {
            let fullVaue = this.getValue() ? this.getValue() : ""
            let entererdValue = fullVaue + charStr
            return this.isCharNumeric(entererdValue);
        }

    }

    validateAmount(event) {
     
        const amountRegx = /^([0-9]*(\.[0-9]?),{0,13}?)$/
        if (event.key == 'Backspace')
            return true
        else if (!amountRegx.test(event.target.value)) {
            return false;
        }
        return true;
    }
}