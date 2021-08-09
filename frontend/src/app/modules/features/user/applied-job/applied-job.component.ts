import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import {PageEvent} from '@angular/material/paginator';
import { EmployerService } from '@data/service/employer.service';

@Component({
  selector: 'app-applied-job',
  templateUrl: './applied-job.component.html',
  styleUrls: ['./applied-job.component.css']
})
export class AppliedJobComponent implements OnInit {
	
	/**
	**	Variable Declaration
	**/
	
	public appliedJobs: any[] = [];
	public appliedJobMeta: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	showFirstLastButtons = true;
	public statusvalue: any[] = [
		{id:1,text:'APPLICATION UNDER REVIEW'},
		{id:2,text:'Hired'},
		{id:3,text:'Interview Scheduled'},
		{id:4,text:'Rejected'},
		{id:5,text:'On Hold'},
		{id:6,text:'Not Available'},
		{id:98,text:'Not a Fit'},
		{id:99,text:'Closed'}
	];
	/**	
	**	To implement the package section constructor
	**/
	
	constructor(
		private userService: UserService,private employerService : EmployerService
	) { }

	/**
	**		When the page loads the OnInitCalls 
	**/
	
	ngOnInit(): void {
		this.onGetAppliedJobs();
	}

	/**
	**	To get the Applied Jobs Details API Calls
	**/

	onGetAppliedJobs = () => {
      let requestParams: any = {};
      requestParams.page = this.page;
      requestParams.limit = this.limit;
      requestParams.expand = "job_posting,user,employer";
      this.userService.applicationsListForUser(requestParams).subscribe(
        response => {
			this.appliedJobs=[];
          if(response && response.items && response.items.length > 0) {
            this.appliedJobs = [...this.appliedJobs, ...response.items];
          }
          this.appliedJobMeta = { ...response.meta }
		  if(document.getElementById('appliedCountValue')){
				document.getElementById('appliedCountValue').innerHTML="("+this.appliedJobMeta.total+")";
			}
		  if(this.appliedJobMeta.total){
			  this.length =this.appliedJobMeta.total;
		  }
        }, error => {
        }
      )
	}

	/**
	**	To handle the pagination
	**/	
	
	handlePageEvent(event: PageEvent) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.onGetAppliedJobs();
	}
	/**
	**	To assign the collapse id and href
	**/	
	  
	getIdVal(items){
		if(items){
			if(items['id']){
				var data = '#Open'+items['id']
				return data;
			}
		}
		return '#Open'
	}

	/**
	**	To assign the close collapse id
	**/	
	  
	getIdVals(items){
		if(items){
			if(items['id']){
				var data = 'Open'+items['id']
				return data;
			}
		}
		return 'Open'
	}
	/**
	**	To set the href for close id
	**/	
	  
	stopPropagation(event,item,index){
		if(event && event.path){
			if(event['path'][1]){
				if(event['path'][1]['href']){
					var temp= event['path'][1]['href'].split('/')
					temp = temp[temp.length-1];
					if(document.getElementById(temp)){
						document.getElementById(temp).setAttribute('href',temp);
					}
				}
			}

		}
		var display = document.getElementById(index);
		var views = true;
		if(display && display.style ){
			if(display.style.display =='none'){
				views = false;
			}
		}
		if(item && item.view == false && views == true){
			let requestParams: any = {};
			requestParams.job_posting = item.job_posting.id;
			requestParams.id = item.id;
			requestParams.status = true ;
			requestParams.view = 'update_status' ;
			requestParams.company = true ;
			this.employerService.getPostedJobCount(requestParams).subscribe(
				response => {
					var display = document.getElementById(index);
					if(display && display.style){
						document.getElementById(index).style.display='none';
					}
				}, error => {
					
				}
			)

		}
	}
	
	/**
	**	To delete the job application API 
	**/	
	  
	deleteJobApplication = (id) => {
      let requestParams: any = {};
      requestParams.id = id;
      this.userService.deleteJobApplication(requestParams).subscribe(
        response => {
			console.log(response);
			this.onGetAppliedJobs();
        }, error => {
			this.onGetAppliedJobs();
        }
      )
	}
	
	itemReturn(id,application_status){
		if(id !=null && id !=undefined ){
			var valCheck = this.statusvalue.filter(function(a,b){ return parseInt(a.id) == parseInt(id)});
			if(valCheck.length !=0){
				return valCheck[0]['text'];
			}
			if(application_status && application_status.length){
				var valChecks = application_status.filter(function(a,b){ return parseInt(a.id) == parseInt(id)});
				if(valChecks.length !=0){
					return valChecks[0]['status'];
				}
			}
			
		}
		return '--';
	}

}
