import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  hero = {
    badge: 'Developer Network',
    title: 'UmbrellaDev',
    subtitle: 'Secure Software Engineering Platform',
    description:
      'Modern software solutions built with security, innovation and scalability as the primary protocols.',
    primaryButton: 'Explore Services',
    secondaryButton: 'Learn More',
  };

  protocols = [
    'Secure Development',
    'Cloud Infrastructure',
    'Artificial Intelligence',
    'Cyber Security'
  ];

  status = [
    { name: 'Backend', state: 'ONLINE' },
    { name: 'Frontend', state: 'ONLINE' },
    { name: 'Database', state: 'ONLINE' },
    { name: 'API', state: 'ONLINE' },
  ];

}