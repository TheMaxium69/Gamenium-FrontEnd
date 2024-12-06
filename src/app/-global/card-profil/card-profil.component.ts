import { Component, Input } from '@angular/core';
import { UserInterface } from 'src/app/-interface/user.interface';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-card-profil',
  templateUrl: './card-profil.component.html',
  styleUrls: ['./card-profil.component.css'],
})
export class CardProfilComponent {

  @Input() user: UserInterface | null = null;
  @Input() currentUser: UserInterface | null = null;

  constructor(
    protected app: AppComponent,

    ){ }

  generatePPStyle(user: UserInterface | null): string {
    if (!user) return '';
    const displayName = user.displayname_useritium || user.username;
    const color = user.color || 'red';
    return this.generatePPUseritium(user?.pp?.url, displayName, color);
  }

  generatePPUseritium(ppUrl: string | undefined, displayName: string, color: string): string {
    if (ppUrl) {
      return `background-image: url(${ppUrl});`;
    }
    return `background-color: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;`;
  }
}
