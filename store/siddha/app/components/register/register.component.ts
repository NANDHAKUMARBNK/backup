import { Component, OnInit } from '@angular/core';
import { CovidtrackingService } from 'src/app/services/covidtracking.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
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
  profileForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: [''],
    degree: ['', Validators.required],
    guruname: ['', Validators.required],
    specialist: ['', Validators.required],
    email: [''],
    countrycode: [15, Validators.required],
    mobilenumber: ['', Validators.required],
    birthplace: ['', Validators.required],
    currentlocation: ['', Validators.required],
    wardname: [''],
    aadharnumber: ['', Validators.required],
    hospitalForm: this.fb.group({
      hospitalname: ['', Validators.required],
      employeescount: ['', Validators.required],
      address: ['', Validators.required],
      // countryselect: ['', Validators.required],
      districtselect: ['', Validators.required],
    }),
  });
  constructor(
    private covidTrackingService: CovidtrackingService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
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
    //   $('form[data-toggle="validator"]').on('submit', function (e) {
    //     window.setTimeout(function () {
    //         var errors = $('.has-error')
    //         if (errors.length) {
    //             $('html, body').animate({ scrollTop: errors.offset().top - 50 }, 500);
    //         }
    //     }, 0);
    // });
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
      this.guru = '';
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
  }
  cancel() {
    this.router.navigate(['']);
  }
  phonenumberValidation(inputtxt: any) {
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (inputtxt.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  }
  aadharnumberValidation(inputtxt: any) {
    var aadharno = /^\d{12}$/;
    if (inputtxt.match(aadharno)) {
      return true;
    } else {
      return false;
    }
  }
  emailValidation(inputtxt: any) {
    let email_Regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
    if (email_Regex.test(inputtxt)) {
      return true;
    }
    // this.toastr.warning('Enter Valid Email Format XXX@YYY.ZZZ');
    return false;
  }
  register(type: any) {
    window.scroll(0, 0);
    let gmail: any = this.profileForm.get('email').value;
    if (gmail) {
      if (!this.emailValidation(gmail)) {
        return;
      }
    }
    let PhoneNumber: any = this.profileForm.get('mobilenumber').value;
    if (!this.phonenumberValidation(PhoneNumber)) {
      return;
    }
    let aadharNumber: any = this.profileForm.get('aadharnumber').value;
    if (!this.aadharnumberValidation(aadharNumber)) {
      return;
    }
    if (this.marked) {
      const requestHospitalData = {
        name: this.profileForm.get('hospitalForm').value.hospitalname,
        employees: parseInt(
          this.profileForm.get('hospitalForm').value.employeescount
        ),
        // country_id: parseInt(
        //   this.profileForm.get('hospitalForm').value.countryselect
        // ),
        district_id: parseInt(
          this.profileForm.get('hospitalForm').value.districtselect
        ),
        address: this.profileForm.get('hospitalForm').value.address,
      };
      const requestBody = {
        firstname: this.profileForm.get('firstname').value,
        lastname: this.profileForm.get('lastname').value,
        specialization_id: parseInt(this.profileForm.get('specialist').value),
        qualification_id: parseInt(this.profileForm.get('degree').value),
        guru_name: this.profileForm.get('guruname').value,
        email: this.profileForm.get('email').value,
        mobile: this.profileForm.get('mobilenumber').value,
        origin_id: parseInt(this.profileForm.get('birthplace').value),
        location_id: parseInt(this.profileForm.get('currentlocation').value),
        ward_name: this.profileForm.get('wardname').value,
        account_name: this.bankAccountName,
        account_number: this.accountNo,
        ifsc_code: this.ifscBranchCode,
        upi_id: this.upiId,
        addhar_number: this.profileForm.get('aadharnumber').value,
      };
      if (
        requestBody.firstname === undefined ||
        requestBody.specialization_id === undefined ||
        requestBody.qualification_id === undefined ||
        requestBody.origin_id === undefined ||
        requestBody.location_id === undefined ||
        requestBody.addhar_number === undefined ||
        requestHospitalData.name === undefined ||
        requestHospitalData.employees === undefined ||
        requestHospitalData.district_id === undefined ||
        requestHospitalData.address === undefined ||
        !this.agreeCheck ||
        !this.theCheckboxAgree
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
        if (
          requestBody.guru_name === undefined ||
          this.showInputGuru === false
        ) {
          requestBody.guru_name = '';
        }
        // if (requestHospitalData.country_id === undefined) {
        //   requestHospitalData.country_id = null;
        // }
        if (
          requestBody.firstname &&
          requestBody.specialization_id &&
          requestBody.qualification_id &&
          requestBody.addhar_number &&
          requestBody.origin_id &&
          requestBody.location_id &&
          requestHospitalData.name &&
          requestHospitalData.employees &&
          requestHospitalData.district_id &&
          requestHospitalData.address &&
          this.theCheckboxAgree &&
          this.agreeCheck
        ) {
          const requestPayloadWithHospital = {
            name: requestHospitalData.name,
            employees: requestHospitalData.employees,
            district_id: requestHospitalData.district_id,
            address: requestHospitalData.address,
            doctors: [requestBody],
          };
          this.covidTrackingService
            .saveDoctorsForm(requestPayloadWithHospital)
            .subscribe(
              (response: any) => {
                this.formDataHospital = response.result;
                if (this.formDataHospital) {
                  if (type === 'redirectToVideoUpload') {
                    this.toastr.success(response.status);
                    this.router.navigate(['/uploaddoctorvideo']);
                  } else if (type === 'redirectToHome') {
                    this.toastr.success(response.status);
                    this.router.navigate(['']);
                  } else {
                    this.router.navigate(['/uploaddoctorvideo']);
                  }
                }
              },
              (error: any) => {
                if (error.status === 400) {
                  this.toastr.error(error.error.message);
                }
              }
            );
        }
      }
    } else {
      const requestBody = {
        firstname: this.profileForm.get('firstname').value,
        lastname: this.profileForm.get('lastname').value,
        specialization_id: parseInt(this.profileForm.get('specialist').value),
        qualification_id: parseInt(this.profileForm.get('degree').value),
        guru_name: this.profileForm.get('guruname').value,
        email: this.profileForm.get('email').value,
        mobile: this.profileForm.get('mobilenumber').value,
        origin_id: parseInt(this.profileForm.get('birthplace').value),
        location_id: parseInt(this.profileForm.get('currentlocation').value),
        ward_name: this.profileForm.get('wardname').value,
        account_name: this.bankAccountName,
        account_number: this.accountNo,
        ifsc_code: this.ifscBranchCode,
        upi_id: this.upiId,
        addhar_number: this.profileForm.get('aadharnumber').value,
      };
      if (
        requestBody.firstname === undefined ||
        requestBody.specialization_id === undefined ||
        requestBody.qualification_id === undefined ||
        requestBody.origin_id === undefined ||
        requestBody.location_id === undefined ||
        requestBody.addhar_number === undefined ||
        !this.agreeCheck ||
        !this.theCheckboxAgree
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
        if (
          requestBody.guru_name === undefined ||
          this.showInputGuru === false
        ) {
          requestBody.guru_name = '';
        }
        if (
          requestBody.firstname &&
          requestBody.location_id &&
          requestBody.qualification_id &&
          requestBody.specialization_id &&
          requestBody.addhar_number &&
          this.theCheckboxAgree &&
          this.agreeCheck
        ) {
          const registerPayloadWithoutHospital = {
            doctors: [requestBody],
          };
          this.covidTrackingService
            .saveDoctorsForm(registerPayloadWithoutHospital)
            .subscribe(
              (response: any) => {
                this.formData = response.result;
                if (this.formData) {
                  if (type === 'redirectToVideoUpload') {
                    this.toastr.success(response.status);
                    this.router.navigate(['/uploaddoctorvideo']);
                  } else if (type === 'redirectToHome') {
                    this.toastr.success(response.status);
                    this.router.navigate(['']);
                  } else {
                    this.router.navigate(['/uploaddoctorvideo']);
                  }
                }
              },
              (error: any) => {
                if (error.status === 400) {
                  this.toastr.error(error.error.message);
                }
              }
            );
        }
      }
    }
  }
}
