import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CentersService } from '../../core/services/centers.service';
import { SpecialtiesService } from '../../core/services/specialties.service';
import { DoctorsService } from '../../core/services/doctors.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { Center, Doctor, Slot, Specialty } from '../../core/models';

@Component({
  selector: 'app-booking',
  imports: [FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking implements OnInit {
  private readonly centersApi = inject(CentersService);
  private readonly specialtiesApi = inject(SpecialtiesService);
  private readonly doctorsApi = inject(DoctorsService);
  private readonly appointmentsApi = inject(AppointmentsService);

  // Listes
  readonly centers = signal<Center[]>([]);
  readonly specialties = signal<Specialty[]>([]);
  readonly doctors = signal<Doctor[]>([]);
  readonly slots = signal<Slot[]>([]);

  // Sélections
  readonly centerId = signal('');
  readonly specialtyId = signal('');
  readonly doctorId = signal('');
  readonly date = signal(this.today());
  readonly selectedSlot = signal<Slot | null>(null);

  // États
  readonly loadingDoctors = signal(false);
  readonly loadingSlots = signal(false);
  readonly booking = signal(false);
  readonly message = signal<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  ngOnInit(): void {
    this.centersApi.list().subscribe((c) => this.centers.set(c));
  }

  onCenterChange(value: string): void {
    this.centerId.set(value);
    this.specialtyId.set('');
    this.doctorId.set('');
    this.specialties.set([]);
    this.doctors.set([]);
    this.slots.set([]);
    this.message.set(null);
    if (value) {
      this.specialtiesApi.list(value).subscribe((s) => this.specialties.set(s));
    }
  }

  onSpecialtyChange(value: string): void {
    this.specialtyId.set(value);
    this.doctorId.set('');
    this.doctors.set([]);
    this.slots.set([]);
    if (value) {
      this.loadingDoctors.set(true);
      this.doctorsApi
        .list({ centerId: this.centerId(), specialtyId: value })
        .subscribe({
          next: (d) => {
            this.doctors.set(d);
            this.loadingDoctors.set(false);
          },
          error: () => this.loadingDoctors.set(false),
        });
    }
  }

  selectDoctor(id: string): void {
    this.doctorId.set(id);
    this.loadSlots();
  }

  onDateChange(value: string): void {
    this.date.set(value);
    this.selectedSlot.set(null);
    if (this.doctorId()) {
      this.loadSlots();
    }
  }

  loadSlots(): void {
    if (!this.doctorId() || !this.date()) {
      return;
    }
    this.loadingSlots.set(true);
    this.slots.set([]);
    this.selectedSlot.set(null);
    this.appointmentsApi.slots(this.doctorId(), this.date()).subscribe({
      next: (s) => {
        this.slots.set(s);
        this.loadingSlots.set(false);
      },
      error: () => this.loadingSlots.set(false),
    });
  }

  selectSlot(slot: Slot): void {
    this.selectedSlot.set(slot);
  }

  book(): void {
    const slot = this.selectedSlot();
    if (!slot) {
      return;
    }
    this.booking.set(true);
    this.message.set(null);
    this.appointmentsApi.book(this.doctorId(), slot.start).subscribe({
      next: () => {
        this.message.set({
          type: 'success',
          text: `Rendez-vous confirmé à ${slot.label}. Retrouvez-le dans « Mes rendez-vous ».`,
        });
        this.booking.set(false);
        this.loadSlots(); // le créneau réservé disparaît
      },
      error: (err) => {
        this.message.set({
          type: 'error',
          text: err?.error?.message ?? 'Réservation impossible.',
        });
        this.booking.set(false);
      },
    });
  }

  selectedDoctor(): Doctor | undefined {
    return this.doctors().find((d) => d.id === this.doctorId());
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
