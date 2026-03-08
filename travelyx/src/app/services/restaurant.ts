import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurantes`);
  }

  createRestaurant(restaurant: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/restaurantes`, restaurant);
  }

  getRestaurantById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/restaurantes/${id}`);
  }

  updateRestaurant(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurantes/${id}`, data);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`);
  }

  // --- MENU ---

  getMenu(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurantes/${restaurantId}/platillos`);
  }

  addDish(dish: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/platillos`, dish);
  }

  updateDish(id: number, dish: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/platillos/${id}`, dish);
  }

  deleteDish(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/platillos/${id}`);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getAnalytics(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/analytics/${restaurantId}`);
  }

  // --- SCHEDULES & STATUS ---

  getSchedules(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurantes/${restaurantId}/horarios`);
  }

  updateSchedules(restaurantId: number, schedules: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurantes/${restaurantId}/horarios`, { schedules });
  }

  // --- GALLERY ---

  getGallery(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurantes/${restaurantId}/galeria`);
  }

  addToGallery(restaurantId: number, fotoUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/restaurantes/${restaurantId}/galeria`, { foto_url: fotoUrl });
  }

  deleteFromGallery(photoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/restaurantes/galeria/${photoId}`);
  }
}
