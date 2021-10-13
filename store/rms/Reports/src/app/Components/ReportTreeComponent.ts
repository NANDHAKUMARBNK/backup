import { Component } from '@angular/core';
import { ReportsService } from '../Service/ReportService';
import { TreeNode, MenuItem, MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { RMSApiService } from 'common/services/RMSApiService';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
	selector: 'app-report',
	templateUrl: '../../../../../../Views/Reports/ReportTree.html',
	styleUrls: ['../../../../../common/styles/Report.scss']

})
export class ReportTreeComponent {
	filesTree: TreeNode[];
	selectedNode: TreeNode;
	treeId: any;
	openfolder: boolean = false;

	constructor(private reportsService: ReportsService, private router: Router, private rMSApiService: RMSApiService, private route: ActivatedRoute) {
		this.treeId = this.route.snapshot.paramMap.get('cruiseLineId');
	};
	ngOnInit() {
		this.getReports();
	};

	setIcon(treeList) {
		if (treeList.length > 0) {
			treeList.forEach(eachNode => {
				if (eachNode.treeObjectCode == "FOLDER") {
					eachNode['expandedIcon'] = "fa fa-folder-open";
					eachNode['collapsedIcon'] = "fa fa-folder";
					this.setIcon(eachNode.children);
				} else {
					eachNode['key'] = eachNode.entityId;
					eachNode['icon'] = 'fa fa-file-word';
				}
			});
		}

	}

	getReports() {
		this.rMSApiService.showLoader(true);
		this.reportsService.getReports().subscribe((files: any) => {
			this.filesTree = <TreeNode[]>files.items;
		
			this.setIcon(this.filesTree);
	
			let icons = {
				expandedIcon: "fa fa-folder-open",
				collapsedIcon: "fa fa-folder",
			}
		

		

			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);

				this.router.navigate(['/Error']);
			}
		)
	};

	

	nodeSelect(e) {
	
		if (e.node.treeObjectCode == "REPORT") {
			this.router.navigate(['/profile', { id: e.node.entityId,name:e.node.name }]);
		}
		else {
			this.openfolder = !this.openfolder;
			e.node.expanded = !e.node.expanded;
		}
		
	};

	expandAll() {
		this.filesTree.forEach(node => {
			this.expandRecursive(node, true);
		});
	};

	private expandRecursive(node: TreeNode, isExpand: boolean) {
		node.expanded = isExpand;
		if (node.children) {
			node.children.forEach(childNode => {
				this.expandRecursive(childNode, isExpand);
			});
		}
	}

}