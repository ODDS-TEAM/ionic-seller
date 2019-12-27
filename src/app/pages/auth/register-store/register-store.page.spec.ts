import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterStorePage } from './register-store.page';

describe('RegisterStorePage', () => {
  let component: RegisterStorePage;
  let fixture: ComponentFixture<RegisterStorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterStorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterStorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
