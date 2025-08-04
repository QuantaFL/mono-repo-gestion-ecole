import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import lottie from 'lottie-web';
import { interval } from 'rxjs';

@Component({
  selector: 'app-term-countdown-reminder',
  templateUrl: './term-countdown-reminder.component.html',
  styleUrls: ['./term-countdown-reminder.component.scss']
})
export class TermCountdownReminderComponent implements OnInit, AfterViewInit {
  @Input() termEndDate!: string; // ISO string
  @Input() notesSubmitted = false;

  timeLeft: { days: number; hours: number; minutes: number; seconds: number } = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  urgent = false;
  warning = false;
  autoSubmit = false;

  ngOnInit() {
    this.updateCountdown();
    interval(1000).subscribe(() => this.updateCountdown());
  }

  ngAfterViewInit() {
    lottie.loadAnimation({
      container: document.getElementById('lottie-container')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // Use local asset for the animation
      path: 'assets/dashboard-teacher.json'
    });
  }

  updateCountdown() {
    const now = new Date();
    const end = new Date(this.termEndDate);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) {
      this.timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      this.autoSubmit = true;
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    this.timeLeft = { days, hours, minutes, seconds };
    this.urgent = days < 7;
    this.warning = days < 14 && days >= 7;
  }
}
