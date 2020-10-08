import { Component, OnInit } from '@angular/core';
import { DashboardCardsService } from 'src/app/dashboard/dashboard-cards-service.service';
import { DashboardCard } from 'src/app/dashboard/dashboard-card';
import { DashboardUsersComponent } from 'src/app/dashboard/dashboard-users/dashboard-users.component';

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   entryComponents: [DashboardUsersComponent],
   styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   cards: DashboardCard[] = [];
   constructor(private cardsService: DashboardCardsService) {
      this.cardsService.cards.subscribe(cards => {
         this.cards = cards;
      });
   }
   ngOnInit() {
      this.createCards();
   } createCards(): void {
      this.cardsService.addCard(
         new DashboardCard(
            {
               name: { key: DashboardCard.metadata.NAME, value: 'users' },
               routerLink: {
                  key: DashboardCard.metadata.ROUTERLINK,
                  value: 'home/home.component'
               },
               // iconClass: {key: DashboardCard.metadata.ICONCLASS,
               //value: 'fa-users'},
               color: { key: DashboardCard.metadata.COLOR, value: 'blue' }
            }, DashboardUsersComponent)
      );
   }
}