import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CentersService } from '../../core/services/centers.service';
import { SpecialtiesService } from '../../core/services/specialties.service';
import { DoctorsService, DoctorInput } from '../../core/services/doctors.service';
import { AbsencesService } from '../../core/services/absences.service';
import {
  Absence,
  AbsenceReason,
  Availability,
  Center,
  Doctor,
  Specialty,
} from '../../core/models';

type Tab = 'centers' | 'specialties' | 'doctors' | 'absences';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private readonly centersApi = inject(CentersService);
  private readonly specialtiesApi = inject(SpecialtiesService);
  private readonly doctorsApi = inject(DoctorsService);
  private readonly absencesApi = inject(AbsencesService);

  readonly tab = signal<Tab>('centers');
  readonly error = signal<string | null>(null);

  // Données
  readonly centers = signal<Center[]>([]);
  readonly specialties = signal<Specialty[]>([]);
  readonly doctors = signal<Doctor[]>([]);
  readonly absences = signal<Absence[]>([]);

  readonly weekDays = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
    { value: 0, label: 'Dimanche' },
  ];
  readonly reasons: { value: AbsenceReason; label: string }[] = [
    { value: 'SICKNESS', label: 'Maladie' },
    { value: 'VACATION', label: 'Congés' },
    { value: 'OTHER', label: 'Autre' },
  ];

  // Formulaires (modèles template-driven)
  centerForm: { id?: string; name: string; address: string; contact: string } =
    this.emptyCenter();
  specialtyForm: { id?: string; name: string } = { name: '' };
  doctorForm: {
    id?: string;
    firstName: string;
    lastName: string;
    specialtyId: string;
    centerId: string;
  } = this.emptyDoctor();
  doctorAvailabilities = signal<Availability[]>([]);
  absenceForm: {
    doctorId: string;
    startDate: string;
    endDate: string;
    reason: AbsenceReason;
    note: string;
  } = this.emptyAbsence();

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.centersApi.list().subscribe((c) => this.centers.set(c));
    this.specialtiesApi.list().subscribe((s) => this.specialties.set(s));
    this.doctorsApi.list().subscribe((d) => this.doctors.set(d));
    this.absencesApi.list().subscribe((a) => this.absences.set(a));
  }

  setTab(t: Tab): void {
    this.tab.set(t);
    this.error.set(null);
  }

  private handleError = (err: unknown): void => {
    const e = err as { error?: { message?: string | string[] } };
    const msg = e?.error?.message;
    this.error.set(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Erreur.');
  };

  // ---------- Centres ----------
  emptyCenter() {
    return { id: undefined as string | undefined, name: '', address: '', contact: '' };
  }
  editCenter(c: Center): void {
    this.centerForm = { ...c };
  }
  saveCenter(): void {
    const { id, ...data } = this.centerForm;
    const req = id
      ? this.centersApi.update(id, data)
      : this.centersApi.create(data);
    req.subscribe({
      next: () => {
        this.centerForm = this.emptyCenter();
        this.centersApi.list().subscribe((c) => this.centers.set(c));
      },
      error: this.handleError,
    });
  }
  deleteCenter(c: Center): void {
    if (!confirm(`Supprimer le centre « ${c.name} » ?`)) return;
    this.centersApi.remove(c.id).subscribe({
      next: () => this.centersApi.list().subscribe((x) => this.centers.set(x)),
      error: this.handleError,
    });
  }

  // ---------- Spécialités ----------
  editSpecialty(s: Specialty): void {
    this.specialtyForm = { ...s };
  }
  saveSpecialty(): void {
    const { id, name } = this.specialtyForm;
    const req = id
      ? this.specialtiesApi.update(id, name)
      : this.specialtiesApi.create(name);
    req.subscribe({
      next: () => {
        this.specialtyForm = { name: '' };
        this.specialtiesApi.list().subscribe((s) => this.specialties.set(s));
      },
      error: this.handleError,
    });
  }
  deleteSpecialty(s: Specialty): void {
    if (!confirm(`Supprimer la spécialité « ${s.name} » ?`)) return;
    this.specialtiesApi.remove(s.id).subscribe({
      next: () =>
        this.specialtiesApi.list().subscribe((x) => this.specialties.set(x)),
      error: this.handleError,
    });
  }

  // ---------- Médecins ----------
  emptyDoctor() {
    return {
      id: undefined as string | undefined,
      firstName: '',
      lastName: '',
      specialtyId: '',
      centerId: '',
    };
  }
  resetDoctorForm(): void {
    this.doctorForm = this.emptyDoctor();
    this.doctorAvailabilities.set([]);
  }
  editDoctor(d: Doctor): void {
    this.doctorForm = {
      id: d.id,
      firstName: d.firstName,
      lastName: d.lastName,
      specialtyId: d.specialtyId,
      centerId: d.centerId,
    };
    this.doctorsApi.get(d.id).subscribe((full) =>
      this.doctorAvailabilities.set(full.availabilities ?? []),
    );
  }
  addAvailability(): void {
    this.doctorAvailabilities.update((list) => [
      ...list,
      { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
    ]);
  }
  applyWeekdayTemplate(): void {
    const blocks: Availability[] = [];
    for (let day = 1; day <= 5; day++) {
      blocks.push({ dayOfWeek: day, startTime: '09:00', endTime: '12:00' });
      blocks.push({ dayOfWeek: day, startTime: '14:00', endTime: '17:00' });
    }
    this.doctorAvailabilities.set(blocks);
  }
  removeAvailability(index: number): void {
    this.doctorAvailabilities.update((list) =>
      list.filter((_, i) => i !== index),
    );
  }
  saveDoctor(): void {
    const { id, ...rest } = this.doctorForm;
    const payload: DoctorInput = {
      ...rest,
      availabilities: this.doctorAvailabilities(),
    };
    const req = id
      ? this.doctorsApi.update(id, payload)
      : this.doctorsApi.create(payload);
    req.subscribe({
      next: () => {
        this.resetDoctorForm();
        this.doctorsApi.list().subscribe((d) => this.doctors.set(d));
      },
      error: this.handleError,
    });
  }
  deleteDoctor(d: Doctor): void {
    if (!confirm(`Supprimer Dr ${d.firstName} ${d.lastName} ?`)) return;
    this.doctorsApi.remove(d.id).subscribe({
      next: () => this.doctorsApi.list().subscribe((x) => this.doctors.set(x)),
      error: this.handleError,
    });
  }
  dayLabel(value: number): string {
    return this.weekDays.find((d) => d.value === value)?.label ?? '';
  }

  // ---------- Absences ----------
  emptyAbsence() {
    return {
      doctorId: '',
      startDate: '',
      endDate: '',
      reason: 'SICKNESS' as AbsenceReason,
      note: '',
    };
  }
  saveAbsence(): void {
    this.absencesApi
      .create({
        doctorId: this.absenceForm.doctorId,
        startDate: this.absenceForm.startDate,
        endDate: this.absenceForm.endDate,
        reason: this.absenceForm.reason,
        note: this.absenceForm.note || undefined,
      })
      .subscribe({
        next: () => {
          this.absenceForm = this.emptyAbsence();
          this.absencesApi.list().subscribe((a) => this.absences.set(a));
        },
        error: this.handleError,
      });
  }
  deleteAbsence(a: Absence): void {
    if (!confirm('Supprimer cette absence ?')) return;
    this.absencesApi.remove(a.id).subscribe({
      next: () => this.absencesApi.list().subscribe((x) => this.absences.set(x)),
      error: this.handleError,
    });
  }
  reasonLabel(value: AbsenceReason): string {
    return this.reasons.find((r) => r.value === value)?.label ?? value;
  }
  doctorName(id: string): string {
    const d = this.doctors().find((x) => x.id === id);
    return d ? `Dr ${d.firstName} ${d.lastName}` : '';
  }
}
