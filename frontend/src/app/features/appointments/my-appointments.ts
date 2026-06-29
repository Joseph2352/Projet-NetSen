import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppointmentsService } from '../../core/services/appointments.service';
import { Appointment } from '../../core/models';

@Component({
  selector: 'app-my-appointments',
  imports: [DatePipe],
  templateUrl: './my-appointments.html',
})
export class MyAppointments implements OnInit {
  private readonly api = inject(AppointmentsService);

  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly upcoming = computed(() =>
    this.appointments().filter(
      (a) => a.status === 'BOOKED' && new Date(a.startTime) > new Date(),
    ),
  );
  readonly past = computed(() =>
    this.appointments().filter(
      (a) => a.status === 'CANCELLED' || new Date(a.startTime) <= new Date(),
    ),
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.mine().subscribe({
      next: (a) => {
        this.appointments.set(a);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger vos rendez-vous.');
        this.loading.set(false);
      },
    });
  }

  cancel(appt: Appointment): void {
    if (!confirm('Confirmer l’annulation de ce rendez-vous ?')) {
      return;
    }
    this.api.cancel(appt.id).subscribe({
      next: () => this.load(),
      error: (err) =>
        this.error.set(err?.error?.message ?? 'Annulation impossible.'),
    });
  }
}
