import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';

@Pipe({
  name: 'timeAgoThai'
})
export class TimeAgoThaiPipe implements PipeTransform, OnDestroy {


  private timer: number | null;
  constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) { }

  transform(value: string) {
    this.removeTimer();
    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const timeToUpdate = this.getSecondsUntilUpdate(seconds) * 1000;
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck());
        }, timeToUpdate);
      }
      return null;
    });
    return this.toDateTimeThai(d);
  }
  ngOnDestroy(): void {
    this.removeTimer();
  }

  private toDateTimeThai(d: Date) {
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    return this.toDateThai(year, month, date) + ' ' + this.toTimeThai(hour, minute);
  }

  private toDateThai(year: number, month: number, date: number) {
    return `วันที่ ${date} ${this.numberToThaiMonth(month)} ${year + 543}`;
  }

  private toTimeThai(hour: number, minute: number) {
    return `${hour}:${minute} น.`;
  }

  private numberToThaiMonth(month: number) {
    switch (month) {
      case 0:
        return 'มกราคม';
      case 1:
        return 'กุมภาพันธ์';
      case 2:
        return 'มีนาคม';
      case 3:
        return 'เมษายน';
      case 4:
        return 'พฤษภาคม';
      case 5:
        return 'มิถุนายน';
      case 6:
        return 'กรกฎาคม';
      case 7:
        return 'สิงหาคม';
      case 8:
        return 'กันยายน';
      case 9:
        return 'ตุลาคม';
      case 10:
        return 'พฤศจิกายน';
      case 11:
        return 'ธันวาคม';
      default:
        return 'ไม่ทราบเดือน';
    }
  }

  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
  private getSecondsUntilUpdate(seconds: number) {
    const min = 60;
    const hr = min * 60;
    const day = hr * 24;
    if (seconds < min) { // less than 1 min, update ever 2 secs
      return 2;
    } else if (seconds < hr) { // less than an hour, update every 30 secs
      return 30;
    } else if (seconds < day) { // less then a day, update every 5 mins
      return 300;
    } else { // update every hour
      return 3600;
    }

  }

}
