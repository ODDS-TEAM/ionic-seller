import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/api-caller/menu/menu.service';
import { FoodMenu } from 'src/app/models/menu.model';

@Component({
  selector: 'app-add-list',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  menuList: FoodMenu[];

  constructor(
    private router: Router,
    private menuService: MenuService,
  ) { }

  ngOnInit() {
    this.menuList = [];
    this.getMenuList();
  }

  async getMenuList() {
    this.menuList = await this.menuService.getMenuList();
  }

  openCreateMenuModal() {
    this.router.navigate(['/create-menu']);
  }

}
