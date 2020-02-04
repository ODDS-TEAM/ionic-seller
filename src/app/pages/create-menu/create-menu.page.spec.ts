import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMenuPage } from './create-menu.page';

describe('CreateMenuPage', () => {
  let component: CreateMenuPage;
  let fixture: ComponentFixture<CreateMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
