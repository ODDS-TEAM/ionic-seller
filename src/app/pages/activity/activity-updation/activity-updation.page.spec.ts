import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivityUpdationPage } from './activity-updation.page';

describe('ActivityUpdationPage', () => {
  let component: ActivityUpdationPage;
  let fixture: ComponentFixture<ActivityUpdationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityUpdationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityUpdationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
