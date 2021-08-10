import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Component,ViewEncapsulation, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { EmployerService } from '@data/service/employer.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-employer-shortlisted-candidate',
  templateUrl: './employer-shortlisted-candidate.component.html',
  styleUrls: ['./employer-shortlisted-candidate.component.css']
})
export class EmployerShortlistedCandidateComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	public shortListedJobs: any[] = [];
	public shortListedMeta: any;
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [ 10, 20,50,100];
	public selectedJob: any;
	public queryParams: any;
	public postedJobMeta: any;
	public employeeValue: any;
	public selectedStatusMessage: any;
	public messagePopupValueStatus: any='';
	public selectedStatusValue: any;
	public messagePopupValue: any;
	public postedJobs: any[] = [];
	public TotalCount: any[] = [];
	public statusvalue: any[] = [
	{id:1,text:'APPLICATION UNDER REVIEW'},
	{id:2,text:'Hired'},
	{id:3,text:'Interview Scheduled'},
	{id:4,text:'Rejected'},
	{id:5,text:'On Hold'},
	{id:6,text:'Not Available'}
	];
	public validateSubscribe: number = 0;
	public isCheckModel: boolean = false;
	public isErrorShown: boolean = false;
	public isErrorShownValue: boolean = false;
	public checkModalRef: NgbModalRef;
	@ViewChild("checkModal", { static: false }) checkModal: TemplateRef<any>;

	constructor(
		private employerService: EmployerService,
		private modalService: NgbModal,
		public utilsHelperService: UtilsHelperService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private employerSharedService: EmployerSharedService
	) {
		
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.id) {
					this.selectedJob = {id: urlQueryParams.id};
				}
				this.queryParams = {...this.queryParams, ...urlQueryParams };
			}
		});
	}

	/**
	**	TO initialize the function triggers
	**	To get the employer details
	**/
	 
	ngOnInit(): void {
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				this.employeeValue =details;
				if(details) {
					if((details && details.id) && this.validateSubscribe == 0) {
						this.onGetPostedJob(details.id);
						this.onGetPostedJobCount(details.id);
						this.validateSubscribe ++;
					}
				}
			}
		)
	}

	/**
	**	TO Set the new selected job
	**/
	 
	onSetJob = (item) =>{
		this.page=1;
		this.limit =10;
		this.selectedJob = item;
		if(this.selectedJob && this.selectedJob.id) {
			this.shortListedJobs = [];
			const removeEmpty = this.utilsHelperService.clean(this.queryParams);
			let url = this.router.createUrlTree(['/employer/dashboard'], {queryParams: {...removeEmpty, id: this.selectedJob.id}, relativeTo: this.route}).toString();
			this.location.go(url);
			this.onGetShortListedJobs();
		}
	}

	/**
	**	TO Get the posted job details 
	**/
	 
	onGetPostedJob(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJob(requestParams).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					this.postedJobs = [...response.items];
					if(this.postedJobs && this.postedJobs.length && this.postedJobs[0]) {
						if(this.selectedJob && this.selectedJob.id) {
							const filterJob = this.postedJobs.find((val) => {
								if(this.selectedJob && this.selectedJob.id)
								return parseInt(val.id) == parseInt(this.selectedJob.id);
							});
							if(filterJob && !this.utilsHelperService.isEmptyObj(filterJob)) {
								this.selectedJob = filterJob;
							}
							this.onGetShortListedJobs();
						}else {
							this.selectedJob = this.postedJobs[0];
							this.onGetShortListedJobs();
						}
					}
				}
				this.postedJobMeta = { ...response.meta };
			}, error => {
			}
		)
	}
  
	/**
	**	TO get the count details
	**/
	 
	checkDataCount(id){
		if(id !=undefined && id!=null && id !=''){
			var tempData= this.TotalCount.filter(function(a,b){ return a.id == id });
			if(tempData.length==1){
				return tempData[0]['count'];
			}
		}
		return 0;
	}
  
	/**
	**	TO get the posted job details for shortlisted user Count
	**/
	 
	onGetPostedJobCount(companyId) {
		let requestParams: any = {};
		requestParams.page = 1;
		requestParams.status = 1;
		requestParams.limit = 1000;
		requestParams.expand = 'company';
		requestParams.view = 'shortlisted';
		requestParams.company = companyId;
		requestParams.sort = 'created_at.desc';
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					this.TotalCount =response['count'];
					var TotalValue =response['count'].map(function(a,b){return parseInt(a.count)}).reduce((a, b) => a + b, 0);
					if(document.getElementById('ApplicantsShortListCount')){
						document.getElementById('ApplicantsShortListCount').innerHTML="("+TotalValue+")";
					}
				}else{
			
				}
			}, error => {
			}
		)
	}

	/**
	**	TO get the shortlisted user details
	**/
	 
	onGetShortListedJobs = () => {
		this.shortListedJobs =[];
		let requestParams: any = {};
		requestParams.page = this.page;
		requestParams.limit = this.limit;
		requestParams.expand = "job_posting,user,employer";
		requestParams.job_posting = this.selectedJob.id;
		requestParams.short_listed = 1;
		this.employerService.applicationsList(requestParams).subscribe(
			response => {
				if(response && response.items && response.items.length > 0) {
					this.shortListedJobs = [...this.shortListedJobs, ...response.items];
				}
				this.shortListedMeta = { ...response.meta }
				if(this.shortListedMeta.total){
					this.length = this.shortListedMeta.total;
				}
			}, error => {
			}
		)
	}
    
	/**
	**	To open the message popoup
	**/
	 openMessagePopup(item){
		 this.isCheckModel = true;
		 this.messagePopupValueStatus = '';
		 if (this.isCheckModel) {
			 this.messagePopupValue = item;
			 if(item.status>=7){
				var idValue = item.status-7;
				if(item['job_posting']['screening_process'][idValue]){
					this.selectedStatusValue =item.status;
					this.selectedStatusMessage = null;
					this.messagePopupValueStatus= this.messagePopupValue['job_posting']['screening_process'][idValue]['title'];
				}
			}else{
				this.selectedStatusValue =item.status;
				this.selectedStatusMessage = null;
				var values = parseInt(this.selectedStatusValue);
				var value = this.statusvalue.filter(function(a,b){ return a.id == values });
				if(value.length !=0){
					this.messagePopupValueStatus = value[0]['text'];
				}
			}
		setTimeout(() => {
        this.checkModalRef = this.modalService.open(this.checkModal, {
          windowClass: 'modal-holder',
          centered: true,
          backdrop: 'static',
          keyboard: false
        });
      }, 300);
		}
	 }
	 
	 
	/**
	**	To cancel the check buton event
	**/
	
	cancelCheck(){
		this.checkModalRef.close();
		 this.isCheckModel = false;
		 this.selectedStatusValue =null;
		 this.selectedStatusMessage = null;
		 this.isErrorShown = false;
		 this.isErrorShownValue = false;
	}
  
	
	sendMessage(){
		this.isErrorShown= false;
		this.isErrorShownValue= false;
		if(this.selectedStatusValue !=null && this.selectedStatusValue !='' && this.selectedStatusMessage != null && this.selectedStatusMessage !='' ){
			
			let requestParams: any = {};
			requestParams.job_posting = this.selectedJob.id;
			requestParams.user = this.messagePopupValue.user.id;
			requestParams.short_listed = true ;
			requestParams.view = false ;
			requestParams.status =  this.messagePopupValue.status ;
			requestParams.application_status =  this.messagePopupValue.application_status ;
			var datas ='';
			var values = parseInt(this.selectedStatusValue);
			if(values>=7){
				var idValue =  values-7;
				datas = this.messagePopupValue['job_posting']['screening_process'][idValue]['title'];
			}else{
				
				var value = this.statusvalue.filter(function(a,b){ return a.id == values });
				if(value.length !=0){
					datas = value[0]['text'];
				}
			}
			if(datas !=''){
				for(let i=0;i< requestParams.application_status.length;i++){
					if(requestParams.application_status[i]['status'] == datas){
						requestParams.application_status[i]['comments'] = this.selectedStatusMessage;
						this.isErrorShown= true;
					}
				}
				if(this.isErrorShown== true){
					this.employerService.shortListUser(requestParams).subscribe(
						response => {
							this.cancelCheck();
							this.onGetShortListedJobs();
						}, error => {
							this.cancelCheck();
							this.onGetShortListedJobs();
						}
					)

				}else{
					this.isErrorShownValue = true;
				}
			}
			
		}

	}
	
	
	/**
	**	TO Change the shortlisted user details
	**/
	 onChangeStatusPop(data){
		this.isErrorShown= false;
		this.isErrorShownValue= false;
		if(this.selectedStatusValue !=null && this.selectedStatusValue !=''){
			var datas ='';
			var val = parseInt(this.selectedStatusValue);
			if(val>=7){
				var idValue =  val-7;
				datas = this.messagePopupValue['job_posting']['screening_process'][idValue]['title'];
			}else{
				var values = val;
				var value = this.statusvalue.filter(function(a,b){ return a.id == values });
				if(value.length !=0){
					datas = value[0]['text'];
				}
			}
			if(datas !=''){
				for(let i=0;i< this.messagePopupValue.application_status.length;i++){
					if(this.messagePopupValue.application_status[i]['status'] == datas){
						this.messagePopupValue.application_status[i]['comments'] = this.selectedStatusMessage;
						this.isErrorShown= true;
					}
				}
				if(this.isErrorShown== false){
					this.isErrorShownValue = true;
				}
			}else{
				this.isErrorShownValue = true;
			}
		}
	 }
	
	/**
	**	TO Change the shortlisted user details
	**/
	 
	onChangeStatus = (item, values) => {
		if((this.selectedJob && this.selectedJob.id) && (item.user && item.user.id)) {
			let requestParams: any = {};
			requestParams.job_posting = this.selectedJob.id;
			requestParams.user = item.user.id;
			requestParams.short_listed = true ;
			requestParams.view = false ;
			requestParams.status = values ;
			requestParams.application_status = item.application_status ;
			if(values>=7){
				var idValue = values-7;
				if(item['job_posting']['screening_process'][idValue]){
					var datas = {'id':values,'status':item['job_posting']['screening_process'][idValue]['title'], 'date': new Date(),'comments':' ' };
					requestParams.application_status.push(datas);
				}
			}else{
				var value = this.statusvalue.filter(function(a,b){ return a.id == values});
				if(value.length !=0){
					var datas = {'id':values,'status':value[0]['text'], 'date': new Date(),'comments':' ' };
					requestParams.application_status.push(datas);
				}
			}
			this.employerService.shortListUser(requestParams).subscribe(
				response => {
					this.onGetShortListedJobs();
				}, error => {
					this.onGetShortListedJobs();
				}
			)
		}else {
			//this.toastrService.error('Something went wrong, please try again', 'Failed')
		}
	}

	/**
	**	To handle the pagination event
	**/
	 
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		this.onGetShortListedJobs();
	}
  
	/**
	**	To load more details 
	**/
	 
	onLoadMoreJob = () => {
		this.page = this.page + 1;
		this.onGetShortListedJobs();
	}
	
}
