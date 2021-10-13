import { Component, OnInit } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registermodel',
  templateUrl: './registermodel.component.html',
  styleUrls: ['./registermodel.component.css'],
})
export class RegistermodelComponent implements OnInit {
  districts: any;
  order: string = 'name';
  hospitals: any;
  countries: any;
  firstName: any;
  lastName: any;
  hEq: any;
  email: any;
  aadharNo: any;
  mobileNumber: any;
  birthPlace: any;
  currentLocation: any;
  village: any;
  countryCode: any = '15';
  bankAccountName: any;
  accountNo: any;
  ifscBranchCode: any;
  upiId: any;
  checkedHospital: any;
  hospitalName: any;
  noOfEmployess: any;
  address: any;
  country: any;
  district: any;
  agreeCheck: any;
  formData: any;
  marked = false;
  disableButton: any = true;
  theCheckbox = false;
  theCheckboxAgree = false;
  hospitalOne: any;
  hospitalForm: any;
  hospitalFormId: any;
  specialization: any;
  qualification: any;
  special: any;
  showNameGuru: any;
  guru: any;
  showInputGuru = false;
  formDataHospital: any;
  navigation: boolean = false;
  constructor(
    private covidTrackingService: CovidtrackingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let popup = localStorage.getItem('showpopup');
    if (popup) {
      localStorage.clear();
    }
    this.getDistricts();
    this.getCountries();
    this.getHospitals();
    this.getSpecialization();
    this.getQualification();
  }
  getQualification() {
    this.covidTrackingService.retrieveQualification().subscribe(
      (response: any) => {
        this.qualification = response.result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getSpecialization() {
    this.covidTrackingService.retrieveSpecialization().subscribe(
      (response: any) => {
        this.specialization = response.result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getDistricts() {
    this.covidTrackingService.retrieveDistrictsBasedOnNameAscSort().subscribe(
      (response: any) => {
        this.districts = response.result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getHospitals() {
    this.covidTrackingService.retrieveHospitals().subscribe(
      (response: any) => {
        this.hospitals = response.result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getCountries() {
    this.covidTrackingService.retrieveCountries().subscribe(
      (response: any) => {
        this.countries = response.result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  isNumber(evt) {
    var iKeyCode = evt.which ? evt.which : evt.keyCode;
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
      return false;

    return true;
  }
  changeFn(e) {
    this.firstName = e.target.value;
  }
  changeLn(e) {
    this.lastName = e.target.value;
  }
  changeHeQ(e) {
    this.hEq = e.target.value;
    let Name = e.target.id;
    if (Name === 'Traditionally Trained physician (Generation to Generation)') {
      this.showInputGuru = true;
      this.showNameGuru = Name;
    } else {
      this.showInputGuru = false;
    }
  }
  changeGuru(e) {
    this.guru = e.target.value;
  }
  changeSpecial(e) {
    this.special = e.target.value;
  }
  changeEmail(e) {
    this.email = e.target.value;
  }
  changeCountryCode(e) {
    this.countryCode = e.target.value;
  }
  changeMobileNumber(e) {
    this.mobileNumber = e.target.value;
  }
  changeBirthPlace(e) {
    this.birthPlace = e.target.value;
  }
  changeCurrentLocation(e) {
    this.currentLocation = e.target.value;
  }
  changeVillage(e) {
    this.village = e.target.value;
  }
  changeAadharNumber(e) {
    this.aadharNo = e.target.value;
  }
  changeBankAccountName(e) {
    this.bankAccountName = e.target.value;
  }
  changeAccountNo(e) {
    this.accountNo = e.target.value;
  }
  changeIfscBranchCode(e) {
    this.ifscBranchCode = e.target.value;
  }
  changeUpiId(e) {
    this.upiId = e.target.value;
  }
  changeChecked(e) {
    this.marked = e.target.checked;
    this.checkedHospital = e.target.value;
    // if (
    //   this.marked &&
    //   this.hospitalName &&
    //   this.noOfEmployess &&
    //   this.country &&
    //   this.district
    // ) {
    //   this.theCheckboxAgree = true;
    //   this.disableButton = false;
    // } else {
    //   this.theCheckboxAgree = false;
    //   this.disableButton = true;
    // }
  }
  changeHospitalName(e) {
    this.hospitalName = e.target.value;
  }
  changeNoOfEmployess(e) {
    this.noOfEmployess = e.target.value;
  }
  changeAddress(e) {
    this.address = e.target.value;
  }
  changeCountry(e) {
    this.country = e.target.value;
  }
  changeDistrict(e) {
    this.district = e.target.value;
  }
  changeAgree(e) {
    this.agreeCheck = e.target.checked;
    // if (
    //   this.agreeCheck &&
    //   this.firstName &&
    //   this.countryCode &&
    //   this.special &&
    //   this.qualification &&
    //   this.birthPlace &&
    //   this.currentLocation &&
    //   this.aadharNo
    // ) {
    //   this.disableButton = false;
    // } else if (
    //   this.agreeCheck &&
    //   this.firstName &&
    //   this.countryCode &&
    //   this.special &&
    //   this.qualification &&
    //   this.birthPlace &&
    //   this.currentLocation &&
    //   this.aadharNo &&
    //   this.marked &&
    //   this.hospitalName &&
    //   this.noOfEmployess &&
    //   this.country &&
    //   this.district
    // ) {
    //   this.disableButton = false;
    // } else {
    //   this.theCheckboxAgree = false;
    //   this.disableButton = true;
    // }
  }
  cancel() {
    this.router.navigate(['']);
  }
  // uploadDoctor() {
  //   this.navigation = true;
  //   this.register(this.navigation);
  //   this.router.navigate(['/uploaddoctorvideo']);
  // }
  register(navValue) {
    if (this.marked) {
      const reqHospital = {
        name: this.hospitalName,
        employees: parseInt(this.noOfEmployess),
        country_id: parseInt(this.country),
        district_id: parseInt(this.district),
        address: this.address,
      };
      if (
        reqHospital.name === undefined ||
        reqHospital.country_id === undefined ||
        reqHospital.district_id === undefined ||
        reqHospital.employees === undefined
      ) {
        return;
      } else {
        if (reqHospital.address === undefined) {
          reqHospital.address = '';
        }
        if (
          reqHospital.country_id &&
          reqHospital.district_id &&
          reqHospital.employees &&
          reqHospital.name
        ) {
          this.covidTrackingService
            .saveHospitalForm(reqHospital)
            .subscribe((response: any) => {
              this.hospitalForm = response.result;
              this.hospitalFormId = response.result.id;
              const requestBody = {
                firstname: this.firstName,
                lastname: this.lastName,
                specialization_id: parseInt(this.special),
                qualification_id: parseInt(this.hEq),
                guru_name: this.guru,
                email: this.email,
                mobile: this.mobileNumber,
                country_id: parseInt(this.countryCode),
                origin_id: parseInt(this.birthPlace),
                location_id: parseInt(this.currentLocation),
                ward_name: this.village,
                account_name: this.bankAccountName,
                account_number: this.accountNo,
                ifsc_code: this.ifscBranchCode,
                upi_id: this.upiId,
                addhar_number: this.aadharNo,
                hospital_id: parseInt(response.result.id),
              };
              if (
                requestBody.firstname === undefined ||
                requestBody.specialization_id === undefined ||
                requestBody.qualification_id === undefined ||
                requestBody.country_id === undefined ||
                requestBody.origin_id === undefined ||
                requestBody.location_id === undefined ||
                requestBody.addhar_number === undefined
              ) {
                return;
              } else {
                if (requestBody.lastname === undefined) {
                  requestBody.lastname = '';
                }
                if (requestBody.email === undefined) {
                  requestBody.email = '';
                }
                if (requestBody.mobile === undefined) {
                  requestBody.mobile = '';
                }
                if (requestBody.ward_name === undefined) {
                  requestBody.ward_name = '';
                }
                if (requestBody.upi_id === undefined) {
                  requestBody.upi_id = '';
                }
                if (requestBody.hospital_id === undefined) {
                  requestBody.hospital_id = null;
                }
                if (requestBody.account_name === undefined) {
                  requestBody.account_name = '';
                }
                if (requestBody.account_number === undefined) {
                  requestBody.account_number = '';
                }
                if (requestBody.ifsc_code === undefined) {
                  requestBody.ifsc_code = '';
                }
                if (requestBody.guru_name === undefined) {
                  requestBody.guru_name = '';
                }
                if (
                  requestBody.firstname &&
                  requestBody.specialization_id &&
                  requestBody.qualification_id &&
                  requestBody.country_id &&
                  requestBody.addhar_number &&
                  requestBody.origin_id &&
                  requestBody.location_id
                ) {
                  this.covidTrackingService
                    .saveDoctorsForm(requestBody)
                    .subscribe(
                      (response: any) => {
                        this.formDataHospital = response.result;
                        if (this.formDataHospital) {
                          let Success = this.toastr.success(
                            'Successfully Registered'
                          );
                          if (Success && navValue) {
                            this.router.navigate(['/uploaddoctorvideo']);
                          } else {
                            this.router.navigate(['']);
                          }
                        }
                      },
                      (error) => {
                        this.toastr.error('Something Went Wrong');
                        console.log(error);
                      }
                    );
                }
              }
            });
        }
      }
    } else {
      const requestBody = {
        firstname: this.firstName,
        lastname: this.lastName,
        specialization_id: parseInt(this.special),
        qualification_id: parseInt(this.hEq),
        guru_name: this.guru,
        email: this.email,
        mobile: this.mobileNumber,
        country_id: parseInt(this.countryCode),
        origin_id: parseInt(this.birthPlace),
        location_id: parseInt(this.currentLocation),
        ward_name: this.village,
        account_name: this.bankAccountName,
        account_number: this.accountNo,
        ifsc_code: this.ifscBranchCode,
        upi_id: this.upiId,
        addhar_number: this.aadharNo,
      };
      if (
        requestBody.firstname === undefined ||
        requestBody.specialization_id === undefined ||
        requestBody.qualification_id === undefined ||
        requestBody.country_id === undefined ||
        requestBody.origin_id === undefined ||
        requestBody.location_id === undefined ||
        requestBody.addhar_number === undefined
      ) {
        return;
      } else {
        if (requestBody.lastname === undefined) {
          requestBody.lastname = '';
        }
        if (requestBody.email === undefined) {
          requestBody.email = '';
        }
        if (requestBody.mobile === undefined) {
          requestBody.mobile = '';
        }
        if (requestBody.ward_name === undefined) {
          requestBody.ward_name = '';
        }
        if (requestBody.upi_id === undefined) {
          requestBody.upi_id = '';
        }
        if (requestBody.account_name === undefined) {
          requestBody.account_name = '';
        }
        if (requestBody.account_number === undefined) {
          requestBody.account_number = '';
        }
        if (requestBody.ifsc_code === undefined) {
          requestBody.ifsc_code = '';
        }
        if (requestBody.guru_name === undefined) {
          requestBody.guru_name = '';
        }
        if (
          requestBody.firstname &&
          requestBody.location_id &&
          requestBody.country_id &&
          requestBody.qualification_id &&
          requestBody.specialization_id &&
          requestBody.addhar_number
        ) {
          this.covidTrackingService.saveDoctorsForm(requestBody).subscribe(
            (response: any) => {
              this.formData = response.result;
              if (this.formData) {
                let Success = this.toastr.success('Successfully Registered');
                if (Success && navValue) {
                  this.router.navigate(['/uploaddoctorvideo']);
                } else {
                  this.router.navigate(['']);
                }
              }
            },
            (error) => {
              this.toastr.error('Something Went Wrong');
              console.log(error);
            }
          );
        }
      }
    }
  }
}
