import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CouponBookService } from '../../Service/CouponBookService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
declare var $: any;

@Component({
	selector: 'app-couponbooklist',
	templateUrl: '../../../../../../../Views/CouponBook/CouponBookList.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class CouponBookListComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	appName = 'couponBook';
	display: boolean = false;
	gridApi: any;
	gridColumnApi: any;
	columnDefs: any;
	defaultColDef: any;
	rowData: any;
	searchValue: string;
	updatedId: any;
	getRowHeight: any;
	config = new MatDialogConfig();
	gridId: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	statusData: any;
	cruiseLine: any;
	couponlistform: FormGroup;
	cruiseLineId: any;
	shipId: any;
	statusId: any;
	domLayout: any;
	paginationPageSize: any;

	constructor(private couponBookService: CouponBookService,
		private fb: FormBuilder, private router: Router, private sharedDataService: SharedDataService,
		private toasterComponent: ToasterComponent, private rMSApiService: RMSApiService
	) {



		this.columnDefs = [
			{
				headerName: 'Item',
				field: "itemNumber",
				sortable: true,
				minWidth: 100
			},
			{
				headerName: 'Cruise Line',
				field: "cruiseLineName",
				sortable: true,
				minWidth: 200
			},
			{
				headerName: 'Description',
				field: "description",
				sortable: true,
				minWidth: 200
			},
			{
				headerName: 'Short Name',
				field: "shortName",
				sortable: true,
				minWidth: 200
			},
		];
		this.defaultColDef = {
			editable: true,
			resizable: true,
		}
		// Row HEIGHT
		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};
		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	}

	ngOnInit() {
		this.formControlSet();
		this.getStatus();
		this.getCruiseLine();
		setTimeout(() => {
			this.getCouponList();
		}, 1000);

	};

	/* =========== init formcontrols here call to ngOnInit() =========*/
	formControlSet() {
		this.couponlistform = this.fb.group({
			statusId: [''],
			cruiseLineId: ['']
		})
	};

	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		};
		console.log(this.gridApi.sizeColumnsToFit());
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	}

	/* ===========GetStatus call from Service =========*/
	getStatus() {
		this.couponBookService.getcouponbookStatus().subscribe((data: any) => {
			this.statusData = data;
			this.couponlistform.patchValue({
				statusId: this.statusData[0].id
			});
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	/* ===========getCruiseLine call from Service =========*/
	getCruiseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.cruiseLine = data;
			this.cruiseLine.forEach(item=>{
				if(item.isDefault==true){
					this.couponlistform.patchValue({
						cruiseLineId: item.id
					});
				}

			})
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	}

	//<-----Get Coupon List when page load---->
	getCouponList() {
		this.rMSApiService.showLoader(true);
		this.statusId = this.couponlistform.get('statusId').value;
		this.cruiseLineId = this.couponlistform.get('cruiseLineId').value;

		if (this.statusId == null) {
			this.statusId = ''
		} else {
			this.statusId = this.couponlistform.get('statusId').value;
		}
		if (this.cruiseLineId == null) {
			this.cruiseLineId = ''
		} else {
			this.cruiseLineId = this.couponlistform.get('cruiseLineId').value;
		}

		this.couponBookService.getcouponBookList(this.statusId, this.cruiseLineId).subscribe((data: any) => {
			this.rowData = data;
			this.rMSApiService.showLoader(false)
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }

		},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error']);
			}

		)
	};


	/*================= Page Size change==============*/

	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");

	}

	/* ===========search filter  =========*/
	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	};

	//Remove text from search
	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue);
	};

	/* ===========navigate to profile Page =========*/
	addCoupon() {
		this.router.navigate(['/CouponBooks/Profile'])
	};

	/* ===========navigate to profile Page pass id etc..  =========*/
	onRowClicked(e) {
		this.router.navigate(['/CouponBooks/Profile', {
			id: e.data.id
		}])
	};

	cancel() {
		this.couponlistform.reset();
		this.rowData = [];
	}


}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;
