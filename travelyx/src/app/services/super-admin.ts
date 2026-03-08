import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  private apiUrl = 'http://localhost:3000/api/super-admin';

  constructor(private http: HttpClient) { }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurants`);
  }

  updateRestaurantStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurants/${id}/status`, { status });
  }
}
