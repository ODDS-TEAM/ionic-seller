import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.page.html',
  styleUrls: ['./create-menu.page.scss'],
})
export class CreateMenuPage implements OnInit {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      foodName: [''],
      price: [''],
      description: [''],
      options: this.formBuilder.array([
        this.formBuilder.group({
          optionTitle: [''],
          optionType: [''],
          choices: this.formBuilder.array([
            this.formBuilder.group({
              choiceTitle: [''],
              choicePrice: ['']
            })
          ])
        })
      ])
    });
    console.log(this.formGroup);
  }

  get options() {
    return this.formGroup.get('options') as FormArray;
  }

  getChoices(index: number) {
    return ((this.formGroup.get('options') as FormArray).at(index) as FormGroup).get('choices') as FormArray;
  }

  addOption() {
    this.options.push(this.formBuilder.group({
      optionTitle: [''],
      optionType: [''],
      choices: this.formBuilder.array([
        this.formBuilder.group({
          choiceTitle: [''],
          choicePrice: ['']
        })
      ])
    }));
  }

  addChoice(optionIndex: number) {
    this.getChoices(optionIndex).push(this.formBuilder.group({
      choiceTitle: [''],
      choicePrice: ['']
    }));
  }

  logForm() {
    console.log(this.formGroup.value);
  }
}
