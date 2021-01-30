import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '@data/service/employer.service';
import { UserSharedService } from '@data/service/user-shared.service';
import { DataService } from '@shared/service/data.service';
import { SharedService } from '@shared/service/shared.service';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-matching-job',
  templateUrl: './matching-job.component.html',
  styleUrls: ['./matching-job.component.css']
})
export class MatchingJobComponent implements OnInit {

  public isOpenedResumeSelectModal: boolean = false;
  public page: number = 1;
  public limit: number = 25;
  public postedJobs: any[] = [];
  public postedJobMeta: any;
  public userInfo: any;
  public currentJobDetails: any;

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public utilsHelperService: UtilsHelperService,
    private dataService: DataService,
    private employerService: EmployerService,
    private userSharedService: UserSharedService
  ) { }

validateAPI = 0;
  ngOnInit(): void {
    this.userSharedService.getUserProfileDetails().subscribe(
      response => {
        this.userInfo = response;
        if(this.userInfo && this.userInfo.skills && this.userInfo.skills.length && this.validateAPI == 0) {
          this.onGetPostedJob();
          this.validateAPI++;
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.validateAPI = null;
  }

  onGetPostedJob() {
    let requestParams: any = {};
    requestParams.page = this.page;
    requestParams.limit = this.limit;
    requestParams.expand = 'company';
    requestParams.expand = 'company';
    if(this.userInfo && this.userInfo.city && this.userInfo.willing_to_relocate == false) {
      requestParams.city = this.userInfo.city;
    }
    if(this.userInfo && this.userInfo.skills && this.userInfo.skills.length) {
      requestParams.skills = this.userInfo.skills.join(',')
    }


    const removeEmpty = this.utilsHelperService.clean(requestParams)

    this.employerService.getPostedJob(removeEmpty).subscribe(
      response => {
        if(response && response.items && response.items.length > 0) {
          this.postedJobs = [...this.postedJobs, ...response.items];
        }
        this.postedJobMeta = { ...response.meta };
      }, error => {
      }
    )
  }

  onToggleResumeSelectModal = (status, item?) => {
    if(!this.utilsHelperService.isEmptyObj(item)) {
      this.currentJobDetails = item;
    }
    this.isOpenedResumeSelectModal = status;
  }

  onLoadMoreJob = () => {
    this.page = this.page + 1;
    this.onGetPostedJob();
  }


}
