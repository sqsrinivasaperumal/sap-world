import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilsHelperService } from './utils-helper.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private skillTags = new BehaviorSubject<any>({});
  private industries = new BehaviorSubject<any>({});
  private userPhoto = new BehaviorSubject<any>({});

  setSkillDataSource(data: {}) {
    this.skillTags.next(data);
  }

  clearSkillDataSource(): any {
    this.skillTags.next({});
  }

  getSkillDataSource(): Observable<any> {
    return this.skillTags.asObservable();
  }

  setIndustriesDataSource(data: {}) {
    this.industries.next(data);
  }

  clearIndustriesDataSource(): any {
    this.industries.next({});
  }

  getIndustriesDataSource(): Observable<any> {
    return this.industries.asObservable();
  }

  setUserPhoto(data: {}) {
    this.userPhoto.next(data);
  }

  clearUserPhoto(): any {
    this.userPhoto.next({});
  }

  getUserPhoto(): Observable<any> {
    return this.userPhoto.asObservable();
  }

}
