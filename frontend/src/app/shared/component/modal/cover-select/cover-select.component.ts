import { Component, EventEmitter, ElementRef,Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobPosting } from '@data/schema/post-job';
import { UserSharedService } from '@data/service/user-shared.service';
import { UserService } from '@data/service/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilsHelperService } from '@shared/service/utils-helper.service';

@Component({
  selector: 'app-cover-select',
  templateUrl: './cover-select.component.html',
  styleUrls: ['./cover-select.component.css']
})
export class CoverSelectComponent implements OnInit {

  public userSelectedCover: File;
  public selectedCoverUrl: any;
  public isOpenedCoverModal: boolean;
  public isShowData: boolean = false;
  public isShowUpload: boolean = true;
  @Input() togglecoverSelectModal: boolean;
  @Output() onEvent = new EventEmitter<boolean>();

  public mbRef: NgbModalRef;
  public mbRefs: NgbModalRef;
  public userInfo: any;

  @ViewChild("coverSelectModal", { static: false }) coverSelectModal: TemplateRef<any>;
  @ViewChild("coverTitleModal", { static: false }) coverTitleModal: TemplateRef<any>;
  public coverSelectForm: FormGroup;
  public resumeSelected: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router,
    private userSharedService: UserSharedService,
    private utilsHelperService: UtilsHelperService,
    private toastrService: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    
  }

  onGetFilteredValue = (array: any[], fields) => {
    if (array && Array.isArray(array) && array.length) {
      return array.find(i => {
        return (i[fields] == 1 || i[fields] == '1')
      });
    }
    return []
  }

  ngAfterViewInit(): void {
    if (this.togglecoverSelectModal) {
      this.mbRef = this.modalService.open(this.coverSelectModal, {
        windowClass: 'modal-holder',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    this.onClickCloseBtn(false);
  }


  onItemChange = (value) => {
    this.resumeSelected = value;
  }

  private buildForm(): void {
    this.coverSelectForm = this.formBuilder.group({
      title: ['', [Validators.required]]
    });
  }

  get f() {
    return this.coverSelectForm.controls;
  }

  onClickCloseBtn(status) {
    this.onEvent.emit(status);
    if (status == false) {
      this.mbRef.close()
    }
  }
  

  handleFileInput(event,data) {
    let files: FileList = event.target.files;
    if (files && files.length > 0) {
      let allowedExtensions = ["doc", "docx", "pdf"];

      let fileExtension = files
        .item(0)
        .name.split(".")
        .pop();
      if (!this.utilsHelperService.isInArray(allowedExtensions, fileExtension)) {
        this.toastrService.error('File format not supported(Allowed Format:doc,pdf,docx)');
        return;
      }
      if (files.item(0).size > 3145728) {
        this.toastrService.error('Size Should be less than or equal to 3 MB');
        return;
      }
	  
		this.userSelectedCover = files[0];
		this.onOpenCoverTitleModal();
      
    }

  }
  
  onOpenCoverTitleModal = () => {
    this.mbRef = this.modalService.open(this.coverTitleModal, {
      windowClass: 'modal-holder',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }
   
 onTogglecoverSelectForm = (status, selectedCoverUrl?) => {
    if (selectedCoverUrl) {
      this.selectedCoverUrl = selectedCoverUrl;
    }

    this.isOpenedCoverModal = status;
  }
  
    onSaveCover = () => {
    if(this.coverSelectForm.valid) {
      this.onUserCoverUpdate();
    }
  }
   
   onUserCoverUpdate = () => {
    const formData = new FormData();

    formData.append('doc_cover', this.userSelectedCover, this.userSelectedCover.name);
    formData.append('title', this.coverSelectForm.value.title);
    this.userService.coverUpdate(formData).subscribe(
      response => {
       
         this.modalService.dismissAll();
		  this.onClickCloseBtn(true);
        this.coverSelectForm.reset();
        //this.userCover.nativeElement.value = null;
      }, error => {
      }
    )
  }
  
  onGetUserProfile(isRequiredDefault : boolean = false) {
    this.userService.profile().subscribe(
      response => {
		  
        if(response['details']){
			this.userSharedService.saveUserProfileDetails(response['details']);
		}
      }, error => {
        //this.modalService.dismissAll();
      }
    )
  }
  
}
