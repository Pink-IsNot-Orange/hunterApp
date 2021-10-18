import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './Components/popover/popover.component';
import { HunterFormService } from './Services/hunter-form.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  huntersForm = this.fb.group({
    woodsHunters: this.fb.group({
      citizens: [0],
      soldiers: [0],
      elite: [0],
    }),
    riverHunters: this.fb.group({
      citizens: [0],
      soldiers: [0],
      elite: [0],
    }),
  });

  baseLvlOfDanger = 25;
  currentLvlOfDanger = this.baseLvlOfDanger;
  temporalCitizenPercent = 0;
  temporalSoldierPercent = 0;
  temporalElitePercent = 0;

  popoverProps = {
    citizens: this.woodsHunters.get('citizens').value,
    soldiers: this.woodsHunters.get('soldiers').value,
    elite: this.woodsHunters.get('elite').value,
  };

  get woodsHunters() {
    return this.huntersForm.get('woodsHunters') as AbstractControl;
  }

  get riverHunters() {
    return this.huntersForm.get('riverHunters') as AbstractControl;
  }

  constructor(
    private fb: FormBuilder,
    public popoverController: PopoverController,
    private hunterService: HunterFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.huntersForm.valueChanges.subscribe(
      (values) => (this.hunterService.hunterForm = values)
    );
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover-hunt',
      event: ev,
      translucent: true,
      componentProps: { hunters: this.popoverProps },
    });
    await popover.present();
  }

  toggleDarkTheme(event) {
    document.body.classList.toggle('dark', event.detail.checked);
  }

  citizenSlider(event) {
    this.woodsHunters.get('citizens').setValue(event.detail.value);
    this.setLvlOfDanger(event.detail.value, 'citizen');
    this.popoverProps = {
      ...this.popoverProps,
      citizens: this.woodsHunters.get('citizens').value,
    };
  }
  soldiersSlider(event) {
    this.woodsHunters.get('soldiers').setValue(event.detail.value);
    this.setLvlOfDanger(event.detail.value, 'soldier');
    this.popoverProps = {
      ...this.popoverProps,
      soldiers: this.woodsHunters.get('soldiers').value,
    };
  }
  eliteSlider(event) {
    this.woodsHunters.get('elite').setValue(event.detail.value);
    this.setLvlOfDanger(event.detail.value, 'elite');
    this.popoverProps = {
      ...this.popoverProps,
      elite: this.woodsHunters.get('elite').value,
    };
  }

  sendHunters() {
    this.router.navigate(['/rewards']);
    this.resetPercentages();
  }

  private setLvlOfDanger(hunters: number, type: string) {
    if (type === 'citizen') {
      this.temporalCitizenPercent = 0.5 * hunters;
    }
    if (type === 'soldier') {
      this.temporalSoldierPercent = 0.8 * hunters;
    }
    if (type === 'elite') {
      this.temporalElitePercent = hunters;
    }

    this.currentLvlOfDanger =
      this.baseLvlOfDanger -
      (this.temporalCitizenPercent +
        this.temporalSoldierPercent +
        this.temporalElitePercent);
  }
  private resetPercentages() {
    this.temporalCitizenPercent = 0;
    this.temporalSoldierPercent = 0;
    this.temporalElitePercent = 0;
  }
}
