import { Component, OnInit } from '@angular/core';
import { WeekMenusService } from 'src/app/services/api-caller/week-menus/week-menus.service';
import { WeekMenus, Menus } from 'src/app/models/week-menus.model';

@Component({
  selector: 'app-table',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  private listMenus: WeekMenus;
  private listMenusForMon: Array<Menus>;
  private listMenusForTue: Array<Menus>;
  private listMenusForThu: Array<Menus>;
  private listMenusForFri: Array<Menus>;

  constructor(
    private weekMenusService: WeekMenusService
  ) { }

  ngOnInit() {
    this.listMenus = this.weekMenusService.getListWeek();
    this.listMenusForMon = this.listMenus.days[0].stores[0].menus;
    this.listMenusForTue = this.listMenus.days[1].stores[0].menus;
    this.listMenusForThu = this.listMenus.days[2].stores[0].menus;
    this.listMenusForFri = this.listMenus.days[3].stores[0].menus;
  }

}
