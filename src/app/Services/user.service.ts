import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
interface Item {
  product_id: number;
  quantity: number;
}

interface OrderPayload {
  user_id: number;
  items: Item[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private messageSource = new BehaviorSubject<string>('default message');
  currentMessage = this.messageSource.asObservable();

  private apiUrl = 'https://fake-store-api.mock.beeceptor.com';

  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/users`);
  }
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/orders`);
  }
  login(email: string, password: string): Observable<any | null> {
    return this.getUsers().pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        return user || null; // return true if user exists, false otherwise
      })
      
    );
  }

  getProducts(): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/api/products`)
      .pipe(map((res: any) => res));
  }
  createOrder(payload:OrderPayload): Observable<any> {
    return this.http.put<any[]>(`${this.apiUrl}/api/orders`, payload);
  }
}
