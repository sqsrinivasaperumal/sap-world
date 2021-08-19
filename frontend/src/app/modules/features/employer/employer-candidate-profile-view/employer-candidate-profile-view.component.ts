import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CandidateProfile } from '@data/schema/create-candidate';
import { JobPosting } from '@data/schema/post-job';
import { EmployerService } from '@data/service/employer.service';
import { UserService } from '@data/service/user.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';
import { Location } from '@angular/common';
import { EmployerSharedService } from '@data/service/employer-shared.service';
import { DataService } from '@shared/service/data.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-employer-candidate-profile-view',
  templateUrl: './employer-candidate-profile-view.component.html',
  styleUrls: ['./employer-candidate-profile-view.component.css']
})
export class EmployerCandidateProfileViewComponent implements OnInit {
	
	/**
	**	Variable declaration
	**/
	
	public page: number = 1;
	public limit: number = 10;
	length = 0;
	pageIndex = 1;
	pageSizeOptions = [10, 25,50,100];
	public isOpenedResumeModal: boolean;
	public isOpenedSendMailModal: boolean;
	public DetailsShown: boolean = false;
	public DetailsShownCheck: boolean = false;
	public userDetails: CandidateProfile;
	public userID: string;
	public jobId: string;
	public employeeID: any;
	public pathUser: any;
	public postedJobsDetails: JobPosting;
	public postedJobsMatchDetails:any[] =[];
	public postedJobsMatchDetailsArray:any[] =[];
	public nationality: any[] = [];

	constructor(
		private userService: UserService,
		private route: ActivatedRoute,
		public sharedService: SharedService,
		private location: Location,
		private dataService: DataService,
		public utilsHelperService: UtilsHelperService,
		private employerService: EmployerService,
		private employerSharedService: EmployerSharedService,
		private router: Router
	) {
		
		this.route.queryParams.subscribe(params => {
			if(params && !this.utilsHelperService.isEmptyObj(params)) {
				let urlQueryParams = {...params};
				if(urlQueryParams && urlQueryParams.jobId) {
					sessionStorage.setItem('jobId',urlQueryParams.jobId);
				}
				if(urlQueryParams && urlQueryParams.id) {
					sessionStorage.setItem('userId',urlQueryParams.id);
				}
				if(urlQueryParams && urlQueryParams.employee) {
					sessionStorage.setItem('employeeID',urlQueryParams.employee);
				}
				if(urlQueryParams.path){
					sessionStorage.setItem('view-user-path',urlQueryParams.path);
					this.router.navigate([], {queryParams: {path: null}, queryParamsHandling: 'merge'});
				}
			}
		});	 
		var jobIds:any=0;
		var userIds:any=0;
		if(sessionStorage.getItem('jobId')){
			jobIds = parseInt(sessionStorage.getItem('jobId'));
		}if(sessionStorage.getItem('userId')){
			userIds = parseInt(sessionStorage.getItem('userId'));
		}if(sessionStorage.getItem('employeeID')){
			this.employeeID = parseInt(sessionStorage.getItem('employeeID'));
		}
		this.jobId = jobIds;
		this.userID = userIds;
		this.router.navigate([], {queryParams: {id: null,jobId:null,path:null,employee:null}, queryParamsHandling: 'merge'});
	}
	
	/**
	**	When page init call after the page loads
	**/
	
	ngOnInit(): void {
		this.employerSharedService.getEmployerProfileDetails().subscribe(
			details => {
				if(details && details.id){
					this.employeeID = details.id;
					if(this.employeeID && this.DetailsShownCheck == false){
						this.DetailsShownCheck = true;
						this.onGetPostedJobs();
					}
				}
			}
		)
		if(this.jobId) {
			this.onGetPostedJob();
		}
		this.dataService.getCountryDataSource().subscribe(
			response => {
				if (response && Array.isArray(response) && response.length) {
					this.nationality = response;
				}
			}
		);
		if(this.userID) {
			this.onGetCandidateInfo();
		}
	}
	
	/**
	**	Click the back Button 
	**	Route navigation path assigning
	**/
	
	onRedirectBack = () => {
		//this.location.back();
		if(sessionStorage.getItem('view-user-path')=='applicants'){
			this.router.navigate(['/employer/dashboard'], {queryParams: {activeTab: 'applicants'}});
		}else if(sessionStorage.getItem('view-user-path')=='savedprofile'){
			this.router.navigate(['/employer/dashboard'], {queryParams: {activeTab: 'savedProfile'}});
		}else if(sessionStorage.getItem('view-user-path')=='shortlisted'){
			this.router.navigate(['/employer/dashboard'], {queryParams: {activeTab: 'shortlisted'}});
		}else{
			this.router.navigate(['/employer/job-candidate-matches/details/view'], { queryParams: {jobId: this.jobId, userId: this.userID} });
		}
	}
	
	/**
	**	To get the posted job details
	**/
	
	onGetPostedJob() {
		let requestParams: any = {};
		requestParams.expand = 'company';
		requestParams.id = this.jobId;
		this.employerService.getPostedJobDetails(requestParams).subscribe(
			response => {
				if (response && response.details) {
					this.postedJobsDetails = response.details;
					if(response['details']['company']){
						if(response['details']['company']['id']){
							if(!this.employeeID ){
								this.employeeID = response['details']['company']['id'];
							}
						}
					}
				}
				
			}, error => {
			}
		)
	}

	/**
	**	To get the matched job candidate lists
	**/
	
	onGetCandidateInfo() {
		let requestParams: any = {};
		requestParams.id = this.userID;
		this.userService.profileView(requestParams).subscribe(
			response => {
				if(response && response.details) {
					this.userDetails = {...response.details, meta: response.meta};
					if(this.employeeID){
						//this.onGetPostedJobs(this.employeeID);
					}
					if(sessionStorage.getItem('view-user-path')=='savedprofile'){
						if(sessionStorage.getItem('employeeID')){
							//this.onGetPostedJobs(this.employeeID);
						}
					}
				}
			}, error => {
			}
		)
	}

	/**
	**	To assign the resume popup status
	**/
	
	onToggleResumeForm = (status) => {
		this.isOpenedResumeModal = status;
	}

	/**
	**	To assign send mail Status Assign
	**/
	
	onToggleSendMail = (status) => {
		this.isOpenedSendMailModal = status;
	}
	
	/**
	**	To get the posted job details
	**	Matched for the user details
	**/
	
	onGetPostedJobs() {
		let requestParams: any = {};
		requestParams.view = 'users_matches';
		requestParams.company = this.employeeID;
		requestParams.id = this.userID;
		this.employerService.getPostedJobCount(requestParams).subscribe(
			response => {
				if(response['count']){
					this.postedJobsMatchDetails = response['count'];		
						
				}else{
					this.postedJobsMatchDetails =[];
				}
				this.length = this.postedJobsMatchDetails.length;
				this.postedJobsMatchDetailsArray = this.postedJobsMatchDetails.slice(0,this.limit)
				this.DetailsShown = true;
			}, error => {
				this.postedJobsMatchDetails =[];
				this.postedJobsMatchDetailsArray =[];
				this.DetailsShown = true;
			}
		)
	}
	
	/**
	**	To pagination changes
	**/ 
	
	handlePageEvent(event: PageEvent) {
		//this.length = event.length;
		this.limit = event.pageSize;
		this.page = event.pageIndex+1;
		this.postedJobsMatchDetailsArray =[];
		
		this.postedJobsMatchDetailsArray = this.postedJobsMatchDetails.slice((this.page - 1) * this.limit, this.page * this.limit);
	}
  
}
