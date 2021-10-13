import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { SharedDataService } from "common/services/SharedDataService";
import { EmitterService } from "common/services/emitterService";
import { CustomerService } from "../Service/CustomerServices";
import { MatTabChangeEvent } from "@angular/material";
import { RMSApiService } from "common/services/RMSApiService";
import { ToasterComponent } from "common/components/ToasterComponent";
declare var $: any;

@Component({
  selector: "app-claimadd",
  templateUrl: "../../../../../../Views/CustomerServices/ClaimAddEdit.html",
  styleUrls: ["../../../../../common/styles/AgGrid.scss"]
})
export class ClaimAddEitComponent {
  ClaimForm: FormGroup;
  Claimid: any;
  countryData: any;
  stateData: any = [];
  phoneData: any;
  @Output() next = new EventEmitter<string>();

  @Output() claimDetil = new EventEmitter<string>();

  firstnameId: any;
  lastNameId: any;
  addressList: any;
  contactList: any;
  typeData: any;
  ClaimAddId: any;
  status: any;
  ReminderId: any;
  flagId: any;
  cruiseLineId: any;
  editForm: any;
  editClaimData: any;
  editClaimSearchData: any;
  personId: any;
  countryId: FormGroup;
  addressId: any;
  contactId: any;
  phoneId: any;
  personIds: any;
  stateDataadd: any;
  emailRegEx = /^.{1,}@.{1,}\..{2,}/;
  //nameRegEx = '^[a-zA-Z0-9]*$'
  //nameRegExwithspace = '^[a-zA-Z0-9_ ]*$'
  moneyRegx = "^[0-9]{1,2}([,.][0-9]{1,2})?$";
  deleteAdress: any;
  tempDeleteAdress: any = [];
  DeletedContactList: any;
  tempDeleteContact: any = [];
  deletedPhoneList: any;
  tempDeletePhone: any = [];
  stateShow: boolean = false;
  deletedobj: any = [];
  editChangeForm: any;
  addressList2: any;
  contactList2: any;
  insideaddressList2: any;
  inside2addressList2: any;
  insideEmailcontactList2: any;
  insidePhonePrefixcontactList2: any;
  insidePhoneNumbercontactList2: any;
  userAd1: any;
  userAd2: any;
  userMail: any;
  userPrefix: any;
  userNumber: any;
  editChangeFormExist: any;
  personIde: any;
  Claimide: any;

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private service: CustomerService,
    private rMSApiService: RMSApiService,
    private toasterComponent: ToasterComponent,
    private sharedDataService: SharedDataService,
    private emitterService: EmitterService
  ) {
    this.Claimid = this.route.snapshot.queryParamMap.get("Claimid");
    this.personId = this.route.snapshot.queryParamMap.get("personId");
    this.status = this.route.snapshot.paramMap.get("status");
    this.ReminderId = this.route.snapshot.paramMap.get("ReminderId");
    this.flagId = this.route.snapshot.paramMap.get("flagId");
    this.cruiseLineId = this.route.snapshot.paramMap.get("cruiseLineId");
  }
  ngOnInit() {
    this.editClaim();
    this.getCountry();
    this.getPhoneType();
    this.getContactType();
    this.getClaim();

    this.ClaimForm = this._fb.group({
      firstname: ["", [Validators.required, Validators.maxLength(50)]],
      lastname: ["", [Validators.required, Validators.maxLength(50)]],
      addresses: this._fb.array([this.initAddress()]),
      contactess: this._fb.array([this.initcontact()])
    });

    if (this.Claimid) {
    }
  }

  //Address fromcontrols
  initAddress() {
    return this._fb.group({
      //addressId:[''],

      address1: ["", [Validators.required, Validators.maxLength(75)]],
      address2: ["", [Validators.maxLength(75)]],
      City: ["", [Validators.maxLength(75), Validators.required]],
      countryid: ["", Validators.required],
      stateid: ["", Validators.required],
      PostalCode: [""]
    });
  }

  //click on address added new rows
  addAdress() {
    this.stateShow = true;
    const control = <FormArray>this.ClaimForm.controls["addresses"];
    control.push(this.initAddress());
  }
  // click on deleteaddress remove new addess rows
  removeAddress() {
    const control = <FormArray>this.ClaimForm.controls["addresses"];

    this.deleteAdress = control.controls.pop().value;
    this.tempDeleteAdress.push(this.deleteAdress);
  }
  // Contact formcontrols
  initcontact() {
    return this._fb.group({
      //contactId:[''],

      name: ["", [Validators.required, Validators.maxLength(50)]],
      typeid: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(this.emailRegEx)]],
      phoneList: this._fb.array([this.initPhone()])
    });
  }
  //Phone Formcontrols
  initPhone() {
    return this._fb.group({
      typeid: ["", Validators.required],
      prefix: ["", [Validators.required, Validators.maxLength(10)]],
      number: ["", [Validators.required, Validators.maxLength(40)]]
    });
  }
  //Click Contact addes new contacts
  addContact() {
    const controlcontact = <FormArray>this.ClaimForm.controls["contactess"];
    controlcontact.push(this.initcontact());
  }

  hasErrorAddress(controlName: string, errorName: string, index) {
    let addressArray = <FormArray>this.ClaimForm.controls["addresses"];
    let addressGroups = <FormGroup>addressArray.controls[index];
    return addressGroups.controls[controlName].hasError(errorName);
  }

  hasErrorContact(controlName: string, errorName: string, index) {
    let addressArray = <FormArray>this.ClaimForm.controls["contactess"];
    let addressGroups = <FormGroup>addressArray.controls[index];
    return addressGroups.controls[controlName].hasError(errorName);
  }

  hasErrorPhone(controlName: string, errorName: string, index, phoneindex) {
    let addressArray = <FormArray>this.ClaimForm.controls["contactess"];
    let addressGroups = <FormGroup>addressArray.controls[index];
    let phoneListArray = <FormArray>addressGroups.controls["phoneList"];
    let phonelistGroup = <FormGroup>phoneListArray.controls[phoneindex];
    return phonelistGroup.controls[controlName].hasError(errorName);
  }

  hasError(controlName: string, errorName: string) {
    return this.ClaimForm.controls[controlName].hasError(errorName);
  }
  // click on deletecontact remove new addes rows
  removeContact(i: number) {
    const control = <FormArray>this.ClaimForm.controls["contactess"];
    this.DeletedContactList = control.controls.pop().value;
    this.tempDeleteContact.push(this.DeletedContactList);

    //control.removeAt(length - 1);
  }
  // click on addphone added new rows
  addPhone(control) {
    //	const controlcontact = <FormArray>this.ClaimForm.controls['phonelist'];
    control.push(this.initPhone());
  }
  // click on delte icon remove
  removePhone(control, index, selectedOBJ) {
    this.tempDeletePhone.push(selectedOBJ.value);
    control.removeAt(index);
  }

  //edit Claim Patch values first name and lastname
  editClaim() {
    if (this.Claimid) {
      this.rMSApiService.showLoader(true);
      this.service.editClaim(this.Claimid).subscribe(
        (data: any) => {
          this.editForm = data;
          this.rMSApiService.showLoader(false);

          this.personIds = this.editForm.personId;
          this.editForm.addressList.forEach(address => {
            //address.countryId=null;
            let countryId = address.countryId;
            if (address.countryId == null) {
              countryId = "";
            } else {
              countryId = address.countryId;
            }
            this.getAllState(countryId);
            this.addressId = address.addressId;
          });
          this.editForm.contactList.forEach(contact => {
            this.contactId = contact.contactId;
            contact.phoneList.forEach(phone => {
              this.phoneId = phone.phoneId;
            });
          });
          this.ClaimForm.patchValue({
            firstname: this.editForm.personFirstName,
            lastname: this.editForm.personLastName,
            personId: this.editForm.personId
          });
          this.ClaimForm.setControl(
            "addresses",
            this.setcontrolsAdtess(this.editForm.addressList)
          );
          this.ClaimForm.setControl(
            "contactess",
            this.setcontrolsContact(this.editForm.contactList)
          );
        },
        error => {
          this.rMSApiService.setData(error);
          this.rMSApiService.showLoader(false);
          this.router.navigate(["/Error"]);
        }
      );
    }
  }
  ngOnChanges() {
    this.ClaimForm.patchValue({
      firstname: this.editChangeForm.personFirstName,
      lastname: this.editChangeForm.personLastName,
      personId: this.editChangeForm.personId
    });
    this.ClaimForm.setControl(
      "addresses",
      this.setcontrolsAdtess(this.editChangeForm.addressList)
    );
    this.ClaimForm.setControl(
      "contactess",
      this.setcontrolsContact(this.editChangeForm.contactList)
    );
    //Exist user
    this.ClaimForm.patchValue({
      firstname: this.editChangeFormExist.personFirstName,
      lastname: this.editChangeFormExist.personLastName,
      personId: this.editChangeFormExist.personId
    });
    this.ClaimForm.setControl(
      "addresses",
      this.setcontrolsAdtess(this.editChangeFormExist.addressList)
    );
    this.ClaimForm.setControl(
      "contactess",
      this.setcontrolsContact(this.editChangeFormExist.contactList)
    );
  }

  //edit Claim Patch values for addresslist
  setcontrolsAdtess(address): FormArray {
    const formarray = new FormArray([]);
    address.forEach(addressList => {
      formarray.push(
        this._fb.group({
          addressId: addressList.addressId,
          address1: [addressList.address1, [Validators.required]],
          address2: [addressList.address2],
          City: [addressList.city, [Validators.required]],
          countryid: addressList.countryId,
          stateid: [addressList.stateId, [Validators.required]],
          PostalCode: [addressList.postalCode]
        })
      );
    });

    return formarray;
  }

  //edit Claim Patch values for contactList
  setcontrolsContact(contact): FormArray {
    const formarray = new FormArray([]);
    contact.forEach(contact => {
      formarray.push(
        this._fb.group({
          contactId: contact.contactId,
          name: [contact.name, [Validators.required]],
          typeid: contact.typeId,
          email: [
            contact.email,
            [Validators.required, Validators.pattern(this.emailRegEx)]
          ],
          phoneList: this.setcontrolsPhoneList(contact.phoneList)
        })
      );
    });

    return formarray;
  }

  //edit Claim Patch values for PhoneList
  setcontrolsPhoneList(phone) {
    const formarray = new FormArray([]);
    phone.forEach(phone => {
      formarray.push(
        this._fb.group({
          phoneId: phone.phoneId,
          typeid: phone.typeId,
          prefix: phone.prefix,
          number: phone.number
        })
      );
    });
    return formarray;
  }

  //getCountry call api
  getCountry() {
    this.sharedDataService.getCountry().subscribe(
      (data: any) => {
        this.countryData = data;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }
  //getPhoneType call api
  getPhoneType() {
    this.sharedDataService.getPhoneType().subscribe(
      (data: any) => {
        this.phoneData = data.items;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  //getState call api
  getState(e) {
    let countryId = e.value;
    this.sharedDataService.getState(countryId).subscribe(
      (data: any) => {
        this.stateDataadd = data;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  getAllState(countryId) {
    this.sharedDataService.getState(countryId).subscribe(
      (data: any) => {
        this.stateDataadd = data;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  //getContactType call api
  getContactType() {
    this.sharedDataService.getContactType().subscribe(
      (data: any) => {
        this.typeData = data.items;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  // cancel back claimlist page
  cancel() {
    sessionStorage.setItem("status", this.status);
    localStorage.setItem("ReminderId", this.ReminderId);
    localStorage.setItem("flagId", this.flagId);
    localStorage.setItem("cruiseLineId", this.cruiseLineId);
  }

  focusOutFunction() {
    const userFn = {
      firstName: this.ClaimForm.get("firstname").value
    };
    const userLn = {
      lastName: this.ClaimForm.get("lastname").value
    };

    this.ClaimForm.get("addresses").value.forEach(item => {
      this.userAd1 = item.address1;
    });
    this.ClaimForm.get("addresses").value.forEach(item => {
      this.userAd2 = item.address2;
    });

    this.ClaimForm.get("contactess").value.forEach(item => {
      this.userMail = item.email;
    });
    this.ClaimForm.get("contactess").value.forEach(item => {
      item.phoneList.forEach(inside => {
        this.userPrefix = inside.prefix;
      });
    });
    this.ClaimForm.get("contactess").value.forEach(item => {
      item.phoneList.forEach(inside => {
        this.userNumber = inside.number;
      });
    });
    //this.rMSApiService.showLoader(true);
    if (this.ClaimForm.invalid) {
      this.service
        .getClaimSearch(
          userFn.firstName,
          userLn.lastName,
          this.userAd1,
          this.userAd2,
          this.userMail,
          this.userPrefix,
          this.userNumber
        )
        .subscribe(
          res => {
            this.editClaimSearchData = res["items"];
            this.rMSApiService.showLoader(false);
          },
          error => {
            this.toasterComponent.onError(error);
            this.rMSApiService.showLoader(false);
            this.router.navigate(["/Error"]);
          }
        );
    }
  }
  claimExistUserclick(item) {
    let id = item.claimId;
   // this.Claimid = item.claimId;
    this.personId = item.personId;
    this.rMSApiService.showLoader(true);
    this.service.editClaim(id).subscribe(
      (data: any) => {
        this.rMSApiService.showLoader(false);
        this.editChangeFormExist = data;
        this.Claimide = data.id;
        this.personIds = this.editChangeFormExist.personId;
        this.editChangeFormExist.addressList.forEach(address => {
          this.getAllState(address.countryId);
          this.addressId = address.addressId;
        });
        this.editChangeFormExist.contactList.forEach(contact => {
          this.contactId = contact.contactId;
          contact.phoneList.forEach(phone => {
            this.phoneId = phone.phoneId;
          });
        });
        this.ClaimForm.patchValue({
          firstname: this.editChangeFormExist.personFirstName,
          lastname: this.editChangeFormExist.personLastName,
          personId: this.editChangeFormExist.personId
        });
        this.ClaimForm.setControl(
          "addresses",
          this.setcontrolsAdtess(this.editChangeFormExist.addressList)
        );
        this.ClaimForm.setControl(
          "contactess",
          this.setcontrolsContact(this.editChangeFormExist.contactList)
        );
      },
      error => {
        this.rMSApiService.setData(error);
        this.rMSApiService.showLoader(false);
        this.router.navigate(["/Error"]);
      }
    );
    // this.service.getPersonData(id, personId).subscribe(res => {
    //   this.editClaimData = res;
    // });
  }

  //Save Profile send data to backend
  saveprofile() {
    if (this.ClaimForm.invalid) {
      return;
    }
    const Person = {
      firstName: this.ClaimForm.get("firstname").value,
      lastName: this.ClaimForm.get("lastname").value,
      personId:this.personId
    };

    this.addressList = this.ClaimForm.get("addresses").value;
    this.contactList = this.ClaimForm.get("contactess").value;

    this.rMSApiService.showLoader(true);
 
    this.service
      .saveClaim(Person, this.addressList, this.contactList)
      .subscribe(
        (data: any) => {
          this.ClaimAddId = data;

          this.Claimid = this.ClaimAddId;

          localStorage.setItem("ClaimAddId", this.ClaimAddId);
          this.next.emit(this.ClaimAddId);
          this.rMSApiService.showLoader(false);
        },
        error => {
          this.rMSApiService.setData(error);
          this.rMSApiService.showLoader(false);
          this.router.navigate(["/Error"]);
        }
      );
  }

  Updateprofile() {
    if (this.ClaimForm.invalid) {
      return;
    }
    if (this.personIds) {
    }
    const Person = {
      firstName: this.ClaimForm.get("firstname").value,
      lastName: this.ClaimForm.get("lastname").value,
      personId: this.personIds
    };

    this.addressList = this.ClaimForm.get("addresses").value;
    var addresslist = this.addressList.concat(this.addressId);
    this.contactList = this.ClaimForm.get("contactess").value;

    this.rMSApiService.showLoader(true);
    this.service
      .UpdateNextClaim(
        this.Claimid,
        Person,
        this.addressList,
        this.contactList,
        this.tempDeleteAdress,
        this.tempDeleteContact,
        this.tempDeletePhone
      )
      .subscribe(
        (data: any) => {
          this.ClaimAddId = data;
          localStorage.setItem("ClaimAddId", this.ClaimAddId);
          this.next.emit(this.ClaimAddId);
          this.rMSApiService.showLoader(false);
        },
        error => {
          this.rMSApiService.setData(error);
          this.rMSApiService.showLoader(false);
          this.router.navigate(["/Error"]);
        }
      );
  }

  getClaim() {
    if (this.Claimid) {
      this.service.getPersonData(this.Claimid, this.personId).subscribe(res => {
        this.editClaimData = res;
      });
    }
  }
  //Edit mode click on right side module list change the tabe
  claimDetilclick(claimId) {
  //  this.Claimid = claimId;
    this.rMSApiService.showLoader(true);
    this.service.editClaim(claimId).subscribe(
      (data: any) => {
        this.editChangeForm = data;
        this.Claimid = data.id;
        this.rMSApiService.buttonClickEventTrack.next(this.editChangeForm);
        this.claimDetil.emit(this.editChangeForm);

        localStorage.setItem("changeEvent", this.editChangeForm);

        this.rMSApiService.showLoader(false);

        this.personIds = this.editChangeForm.personId;
        this.editChangeForm.addressList.forEach(address => {
          this.getAllState(address.countryId);
          this.addressId = address.addressId;
        });
        this.editChangeForm.contactList.forEach(contact => {
          this.contactId = contact.contactId;
          contact.phoneList.forEach(phone => {
            this.phoneId = phone.phoneId;
          });
        });
        this.ClaimForm.patchValue({
          firstname: this.editChangeForm.personFirstName,
          lastname: this.editChangeForm.personLastName,
          personId: this.editChangeForm.personId
        });
        this.ClaimForm.setControl(
          "addresses",
          this.setcontrolsAdtess(this.editChangeForm.addressList)
        );
        this.ClaimForm.setControl(
          "contactess",
          this.setcontrolsContact(this.editChangeForm.contactList)
        );
      },
      error => {
        this.rMSApiService.setData(error);
        this.rMSApiService.showLoader(false);
        this.router.navigate(["/Error"]);
      }
    );

    this.service.getPersonData(claimId, this.personId).subscribe(res => {
      this.editClaimData = res;
    });

    var name = "claimDetil";
  }
}
