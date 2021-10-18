import { Component, OnInit } from '@angular/core';
import { HunterFormService } from '../../Services/hunter-form.service';
import { WoodAnimals } from 'src/app/data/animals';
import { rollDice } from 'src/app/utils/diceRolls.utils';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
})
export class RewardsComponent implements OnInit {
  huntersSent = {};
  rewards = [];

  constructor(private hunterService: HunterFormService) {}

  ngOnInit(): void {
    this.huntersSent = this.hunterService.hunterForm;
    const rollThrows = this.getTotalHunters(this.huntersSent);
    this.hunt(rollThrows);
  }

  hunt(throws: number) {
    for (let i = 0; i < throws; i++) {
      const rolledDice = rollDice(3);
      if (this.checkIfAnimalExist(rolledDice)) {
        this.rewards
          .filter((reward) => reward.animal[0].id === rolledDice)
          .map((reward) => (reward.quantity += rollDice(6)));
      } else {
        const animal = WoodAnimals.filter((animal) => animal.id === rolledDice);
        const quantity = rollDice(6);
        this.rewards.push({ animal, quantity });
      }
    }
  }

  private getTotalHunters(hunters): number {
    let totalRiverHunters =
      hunters.riverHunters.citizens +
      hunters.riverHunters.soldiers +
      hunters.riverHunters.elite;
    let totalWoodsHunters =
      hunters.woodsHunters.citizens +
      hunters.woodsHunters.soldiers +
      hunters.woodsHunters.elite;
    return totalRiverHunters + totalWoodsHunters;
  }

  private checkIfAnimalExist(id): boolean {
    return (
      this.rewards.filter((reward) => reward.animal[0].id === id).length > 0
    );
  }
}
