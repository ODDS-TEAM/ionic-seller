import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuService } from 'src/app/services/api-caller/menu/menu.service';
import { FoodMenu } from 'src/app/models/menu.model';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.page.html',
  styleUrls: ['./add-food.page.scss'],
})
export class AddFoodPage implements OnInit {

  @Input() day: string;
  @Input() edit: boolean;
  @Input() foodIdList: string[];
  @Input() foodId: string;
  @Input() dayMenuId: string;
  @Input() foodLeft: number;

  fg: FormGroup;

  selectFood: FoodMenu;

  menuList: FoodMenu[];

  selected = false;

  constructor(
    private popoverController: PopoverController,
    private menuService: MenuService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.fg = this.formBuilder.group({
      foodLeft: ['', Validators.min(0)]
    });
    this.fg.setValue({
      foodLeft: (this.edit ? this.foodLeft : 10)
    });
    this.getMenuList();
  }

  shouldDisabled(index: number) {
    if (this.foodId === this.menuList[index].foodMenuId) {
      return false;
    }
    if (this.foodIdList.indexOf(this.menuList[index].foodMenuId) !== -1) {
      return true;
    }
    return false;
  }

  shouldBeChecked(index: number) {
    if (this.foodId === this.menuList[index].foodMenuId) {
      if (!this.selected) {
        this.selectFood = this.menuList[index];
      }
      this.selected = true;
      return true;
    }
    return false;
  }

  get valid() {
    return this.selected && this.fg.valid;
  }

  async getMenuList() {
    try {
      this.menuList = await this.menuService.getMenuList();
    } catch (err) {
      this.getMenuList();
    }
  }

  onSelect(event: CustomEvent) {
    this.selectFood = this.menuList[Number(event.detail.value)];
    this.selected = true;
    console.log(event);
  }

  onPressOK() {
    console.log(this.fg.value.foodLeft);
    console.log(this.selectFood);
    this.popoverController.dismiss({
      foodMenuId: this.selectFood.foodMenuId,
      menuName: this.selectFood.foodName,
      foodLeft: this.fg.value.foodLeft,
      imageUrl: this.selectFood.imageUrl,
      price: this.selectFood.price,
      dayMenuId: this.dayMenuId
    }, (this.edit ? 'edit' : 'add'));
  }

  closeModal() {
    this.popoverController.dismiss();
  }

}
