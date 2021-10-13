import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";
import { FormControl } from '@angular/forms';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { EmitterService } from 'common/services/emitterService';


@Component({
    selector: 'numeric-cell',
    template: `<input #input (keydown)="onKeyDown($event)" (keyup)="onkeyup($event)"   class="input--textfield" requiured  [(ngModel)]='value' style="width: 100%">`
})
export class SaelsInputEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: any;
    private cancelBeforeStart: boolean = false;
    number=new FormControl('');

    @ViewChild('input', {read: ViewContainerRef}) public input;
    gridApi: any;
constructor(private toasterComponent:ToasterComponent, private emitterService:EmitterService){
   
}


    agInit(params: any): void {
        this.gridApi=params.api;
        this.params = params;
        this.value = this.params.value;
        this.number.patchValue(params.value)

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

    onKeyDown(event): void {
        if (!this.isKeyPressedNumeric(event) || !this.validateAmount(event)) {
            if (event.preventDefault) event.preventDefault();
        }
       
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            if(this.params.data.focus){
                this.input.element.nativeElement.focus();
             }
            //
        })
    }

    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr): boolean {
        return !!/^\d+(\.\d*)?$/.test(charStr);
    }

    private isKeyPressedNumeric(event): boolean {
        const charCode = this.getCharCodeFromEvent(event);
        
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        
       
        if(charStr == 'Backspace')
            return true
        else{
            let fullVaue = this.getValue() ? this.getValue() : ""
            let entererdValue = fullVaue + charStr
            return this.isCharNumeric(entererdValue);
        };

            
    }

    validateAmount(event){
        const amountRegx = /^([0-9]*(\.[0-9]?)?)$/
        if(event.key == 'Backspace')
          return true
		else if(!amountRegx.test(event.target.value)){
            return false;
        };
       
        
        return true;
    };;
    
    onkeyup(event){        
           if(this.params.data.retunMaxValidation){
            if(this.params.data.businessLogic.amountMaxValue && event.target.value>this.params.data.businessLogic.amountMaxValue){
              
                this.toasterComponent.dynamicInputMessage(this.params.data.businessLogic.amountMaxValue);
                event.target.value=null;
                this.params.data.businessLogic.amountDefault=null;
               
               // this.emitterService.refreshInputChanged.emit(this.params.data.businessLogic.amountDefault);
                this.gridApi.redrawRows()
                return false
         }else{
           
             this.params.data.salesInputValidation=true;
            this.params.data.businessLogic.amountDefault= event.target.value;
            
         }
        }
    
    }


        
       
}