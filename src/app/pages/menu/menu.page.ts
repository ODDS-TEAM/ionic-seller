import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-list',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  openCreateMenuModal() {
    this.router.navigate(['/create-menu']);
  }

}
